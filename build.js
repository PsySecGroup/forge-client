import fs from 'fs'
import path from 'path'

const distDir = path.resolve('dist')
const inputFile = path.join(distDir, 'index.html')
const outputFile = path.join(distDir, 'standalone.html')

try {
  let html = fs.readFileSync(inputFile, 'utf-8')

  // Remove the line containing CSP meta tag
  html = html.replace(/.*<meta http-equiv="Content-Security-Policy".*\n?/i, '')

  // Write to standalone.html
  fs.writeFileSync(outputFile, html, 'utf-8')

  console.log(`✅ Created ${outputFile} without CSP meta tag`)
} catch (err) {
  console.error(`❌ Postprocess failed:`, err)
  process.exit(1)
}
