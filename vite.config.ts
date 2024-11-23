import { defineConfig } from 'vite'
import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import tsconfigPaths from 'vite-tsconfig-paths'
import { flatRoutes } from 'remix-flat-routes'

import svgr from 'vite-plugin-svgr'
import path from 'path'

installGlobals()

declare module '@remix-run/node' {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true
  }
}

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
      remix({
        ignoredRouteFiles: ['**/*'],
        serverModuleFormat: 'esm',
        async routes(defineRoutes) {
          return flatRoutes('routes', defineRoutes, {
            ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
          })
        },
        future: {
          v3_singleFetch: true,
        },
      }),
      svgr({}),
      tsconfigPaths(),
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
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
