import * as dotenv from 'dotenv'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'
import devtools from 'solid-devtools/vite'
import compression from 'vite-plugin-compression'
import ViteInspect from 'vite-plugin-inspect'
import { replaceHtmlTemplates } from './build/template'
// import sri from './build/sri' // @TODO turn on when ready
// import { watermark } from './build/watermark' // @TODO turn this on when ready

const NOOP = () => undefined
const compressionFileFilter = /\.(js|mjs|json|css|html|svg)$/i
const isProduction = process.env['NODE_ENV'] === 'production'
const isDesktop = process.env['IS_DESKTOP_BUILD'] === 'true'
const isMobile = process.env['IS_MOBILE_BUILD'] === 'true'
const envFile = isProduction
  ? '.env.production'
  : '.env.development'

dotenv.config({ path: resolve(__dirname, '.env.common') })
dotenv.config({ path: resolve(__dirname, envFile) })

export default defineConfig({
  plugins: [
    isProduction ? NOOP() : devtools(),
    isProduction ? NOOP() : ViteInspect(),
    replaceHtmlTemplates(),
    solidPlugin(),
    // sri(), // @TODO turn on when ready
    viteSingleFile(),
    svgr(),
    // watermark(), // @TODO turn this on when ready
    isMobile || isDesktop ? NOOP() : compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // only files >10kb
      filter: compressionFileFilter
    }),
    isMobile || isDesktop ? NOOP() : compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
      threshold: 10240, // only files >10kb
      filter: compressionFileFilter
    }),
    
  ],
  server: {
    host: 'localhost',
    port: 3000,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: isMobile === true
      ? {
          mobile: resolve(__dirname, 'mobile.html')
        }
      : isDesktop === true
      ? {
        web: resolve(__dirname, 'desktop.html')
      }
      : {
          web: resolve(__dirname, 'index.html')
        }
    }
  },
})
