import { defineConfig } from 'vite'
import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import tsconfigPaths from 'vite-tsconfig-paths'

import svgr from 'vite-plugin-svgr'
import path from 'path'

installGlobals()

// https://vitejs.dev/config/
export default defineConfig(async () => {
  // Must import @mdx-js/rollup like this. See
  // https://github.com/brillout/vite-plugin-mdx/issues/44
  const mdx = await import('@mdx-js/rollup')

  return {
    base: './',
    plugins: [remix({}), svgr({}), mdx.default({}), tsconfigPaths()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: true,
      port: 5000,
    },
  }
})
