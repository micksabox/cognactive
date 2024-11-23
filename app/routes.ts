// import { flatRoutes } from '@remix-run/fs-routes'
import { remixRoutesOptionAdapter } from '@remix-run/routes-option-adapter'
import { flatRoutes } from 'remix-flat-routes'

import type { RouteConfig } from '@remix-run/route-config'
export default remixRoutesOptionAdapter((defineRoutes) => flatRoutes('routes', defineRoutes)) satisfies RouteConfig
