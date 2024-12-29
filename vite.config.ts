import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { reactRouterHonoServer } from 'react-router-hono-server/dev'

import svgr from 'vite-plugin-svgr'
import path from 'path'

const MODE = process.env.NODE_ENV

// https://vitejs.dev/config/
export default defineConfig(async () => {
  // Must import @mdx-js/rollup like this. See
  // https://github.com/brillout/vite-plugin-mdx/issues/44
  const mdx = await import('@mdx-js/rollup')
  const remarkFrontmatter = await import('remark-frontmatter')
  const remarkMdxFrontmatter = await import('remark-mdx-frontmatter')

  return {
    build: {
      cssMinify: MODE === 'production',
      rollupOptions: {
        external: [/node:.*/, 'stream', 'crypto', 'fsevents'],
      },
    },
    plugins: [
      mdx.default({
        remarkPlugins: [remarkFrontmatter.default, remarkMdxFrontmatter.default],
      }),
      reactRouter(),
      reactRouterHonoServer({
        dev: {
          exclude: [/^\/(resources)\/.+/],
        },
      }),
      svgr({}),
      tsconfigPaths(),
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './app'),
        '@': path.resolve(__dirname, './app'),
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
      port: 5001,
    },
  }
})
