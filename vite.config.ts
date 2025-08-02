import * as dotenv from 'dotenv'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'
import devtools from 'solid-devtools/vite'
import compression from 'vite-plugin-compression'
import ViteInspect from 'vite-plugin-inspect'

const isProduction = process.env['NODE_ENV'] === 'production'
const isLocal = process.env['HOST']?.includes('localhost') || process.env['NODE_ENV'] === 'development'

const envFile = isProduction
  ? '.env.production'
  : '.env.development'

dotenv.config({ path: resolve(__dirname, '.env.common') })
dotenv.config({ path: resolve(__dirname, envFile) })

// const assetPath = process.env['ASSET_PATH']

const NOOP = () => undefined

export default defineConfig({
  plugins: [
    isProduction ? NOOP() : devtools(),
    isProduction ? NOOP() : ViteInspect(),
    solidPlugin(),
    viteSingleFile(),
    svgr(),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false
    }),
    {
      name: 'custom-html-replace',
      transformIndexHtml(html) {
        const title = process.env['PROJECT_DESCRIPTION'] === ''
          ? process.env['PROJECT_NAME']
          : `${process.env['PROJECT_NAME']} | ${process.env['PROJECT_DESCRIPTION']}`
        
        const csp = isLocal === true
          ? ''
          : `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' ${process.env['PROJECT_URL']};${process.env['PROJECT_CSP']}" />`

        const preconnects = isLocal === true
          ? ''
          : (process.env['PROJECT_PRECONNECTS'] ?? '')
            .split(',')
            .map(url => `    <link rel="preconnect" href="${url}" crossorigin />\n`)
            .join('\n')
        
        const serviceWorkers = (process.env['PROJECT_SERVICE_WORKERS'] ?? '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .join(',')

        return html
          .replace(/{{HEADERS_CSP}}/g, csp)
          .replace(/{{HEADERS_PRECONNECTS}}/g, preconnects)
          .replace(/{{PROJECT_SERVICE_WORKERS}}/g, serviceWorkers)
          .replace(/{{PROJECT_TITLE}}/g, title ?? '')
          .replace(/{{PROJECT_DESCRIPTION}}/g, process.env['PROJECT_DESCRIPTION'] ?? '')
          .replace(/{{PROJECT_URL}}/g, process.env['PROJECT_URL'] ?? '')
          .replace(/{{ASSET_PATH}}/g, process.env['ASSET_PATH'] ?? '')
      }
    }
  ],
  server: {
    host: 'localhost',
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
