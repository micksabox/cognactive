import { flatRoutes } from 'remix-flat-routes'

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  //   cacheDirectory: './node_modules/.cache/remix',
  // Ignore all route files for remix-flat-routes to work
  ignoredRouteFiles: ['**/*'],
  serverModuleFormat: 'esm',
  serverPlatform: 'node',
  tailwind: true,
  postcss: true,
  // outDir: 'public/build',
  // serverBuildPath: 'public/build',
  // assetsBuildDirectory: 'build/client',
  watchPaths: ['./tailwind.config.js', './src/**/*'],
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes, {
      ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}', '**/__*.*'],
    })
  },
}
