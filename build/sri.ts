// @TODO needs significant debugging

import { createHash } from 'crypto'
import { parseHTML } from 'linkedom'
import { Plugin } from 'vite'
import * as redirects from 'follow-redirects'
import { IncomingMessage } from 'http'

const { http, https } = redirects

// Utility to create CSP-compatible base64-encoded hash
function hashInlineContent(content: string): string {
  const hash = createHash('sha256').update(content).digest('base64')
  return `'sha256-${hash}'`
}

export function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    const request = client.get(url, (res: IncomingMessage) => {
      const chunks: Uint8Array[] = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    })

    request.on('error', reject)
  })
}

export default function sri(): Plugin {
  return {
    name: 'subresource-integrity',
    enforce: 'post',
    apply: 'build',

    async transformIndexHtml(html: string, context): Promise<string> {
      console.log('hello')
      const bundle = context.bundle as Record<string, { code?: string; source?: string | Uint8Array }>
      const { document } = parseHTML(html)

      // 1. Add integrity to external assets (already covered previously)
      const assets = [
        ...document.querySelectorAll('script[src]'),
        ...document.querySelectorAll('link[rel="stylesheet"][href]')
      ]

      for (const el of assets) {
        const attr = el.tagName === 'LINK' ? 'href' : 'src'
        const url = el.getAttribute(attr)
        if (!url) continue

        let source: Buffer | undefined

        try {
          if (url.startsWith('http')) {
            const buffer = await fetchBuffer(url) // assume fetchBuffer defined as before
            source = buffer
          } else {
            const path = url.replace(/^\//, '')
            const item = bundle[path]
            if (item?.code) {
              source = Buffer.from(item.code, 'utf-8')
            } else if (item?.source) {
              const raw = item.source
              source = typeof raw === 'string' ? Buffer.from(raw, 'utf-8') : Buffer.from(raw)
            }
          }

          if (source) {
            const hash = createHash('sha384').update(source).digest('base64')
            el.setAttribute('integrity', `sha384-${hash}`)
            el.setAttribute('crossorigin', 'anonymous')
          }
        } catch (err) {
          console.warn(`SRI generation failed for ${url}:`, err)
        }
      }

      // 2. Generate hashes for inline scripts/styles
      const inlineScriptHashes: string[] = []
      const inlineStyleHashes: string[] = []

      document.querySelectorAll('script:not([src])').forEach((script) => {
        const content = script.textContent?.trim()
        if (content) inlineScriptHashes.push(hashInlineContent(content))
      })

      document.querySelectorAll('style:not([href])').forEach((style) => {
        const content = style.textContent?.trim()
        if (content) inlineStyleHashes.push(hashInlineContent(content))
      })

      // 3. Update <meta http-equiv="Content-Security-Policy"> tag
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]')

      const scriptDirectives = inlineScriptHashes.join(' ')
      const styleDirectives = inlineStyleHashes.join(' ')

      const newDirectives: string[] = []

      if (scriptDirectives) newDirectives.push(`script-src ${scriptDirectives} 'self'`)
      if (styleDirectives) newDirectives.push(`style-src ${styleDirectives} 'self'`)

      const newCSPContent = newDirectives.join('; ')

      if (cspMeta) {
        const existingContent = cspMeta.getAttribute('content') || ''
        cspMeta.setAttribute('content', `${existingContent};${newCSPContent}`)
      } else if (newCSPContent) {
        const meta = document.createElement('meta')
        meta.setAttribute('http-equiv', 'Content-Security-Policy')
        meta.setAttribute('content', newCSPContent)
        document.head.appendChild(meta)
      }

      return document.toString()
    }
  }
}
