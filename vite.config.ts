import * as dotenv from 'dotenv'
import { NOOP } from './src/constants'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'
import devtools from 'solid-devtools/vite'
import compression from 'vite-plugin-compression'
import ViteInspect from 'vite-plugin-inspect'

const isProduction = process.env.NODE_ENV === 'production'

const envFile = isProduction
  ? '.env.production'
  : '.env.development'

dotenv.config({ path: resolve(__dirname, '.env.common') })
dotenv.config({ path: resolve(__dirname, envFile) })

const assetPath = process.env.ASSET_PATH

export default defineConfig({
  plugins: [
    isProduction ? NOOP : devtools(),
    isProduction ? NOOP : ViteInspect(),
    solidPlugin(),
    viteSingleFile(),
    svgr(),
    compression(),
    {
      name: 'custom-html-replace',
      transformIndexHtml(html) {
        return html
          .replace(/{{PROJECT_NAME}}/g, process.env.PROJECT_NAME)
          .replace(/{{PROJECT_DESCRIPTION}}/g, process.env.PROJECT_DESCRIPTION)
          .replace(/{{PROJECT_URL}}/g, process.env.PROJECT_URL)
          .replace(/{{PROJECT_CSP}}/g, process.env.PROJECT_CSP)
          .replace(/{{ASSET_PATH}}/g, process.env.ASSET_PATH)
          .replace(/{{PROJECT_PRECONNECTS}}/g, process.env.PROJECT_PRECONNECTS
            .split(',')
            .map(url => `    <link rel="preconnect" href="${url}" />`)
            .join('\n')
          )
      }
    }
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
