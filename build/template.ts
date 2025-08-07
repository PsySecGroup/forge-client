const isLocal = process.env['IS_LOCAL_BUILD'] === 'true'

export function replaceHtmlTemplates () {
  return {
    name: 'custom-html-replace',
    transformIndexHtml(html: string) {
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
        .replace(/{{PROJECT_NAME}}/g, process.env['PROJECT_NAME'] ?? '')
        .replace(/{{ASSET_PATH}}/g, process.env['ASSET_PATH'] ?? '')
    }
  }
}
