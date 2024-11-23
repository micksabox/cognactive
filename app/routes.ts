// import { flatRoutes } from '@remix-run/fs-routes'
import { remixRoutesOptionAdapter } from '@react-router/remix-routes-option-adapter'
import { flatRoutes } from 'remix-flat-routes'

import type { RouteConfig } from '@react-router/dev/routes'
export default remixRoutesOptionAdapter((defineRoutes) => flatRoutes('routes', defineRoutes)) satisfies RouteConfig
