import { createBrowserRouter, RouteObject } from 'react-router-dom'
import ErrorPage from './components/error-page'
import { getDefaultLayout } from './components/layout'
import HomePage from './pages/home'
import AboutPage from './pages/about'
import TrackerPage from './pages/tracker'
import BlogLayout from './pages/blog/layout'
import Blog from './pages/blog/metagame.mdx'

export const routerObjects: RouteObject[] = [
  {
    path: '/',
    id: 'homepage',
    Component: HomePage,
  },
  {
    path: 'about',
    Component: AboutPage,
  },
  {
    path: 'tracker',
    Component: TrackerPage,
  },
  {
    path: 'blog/*',
    Component: BlogLayout,
    children: [
      {
        path: 'metagame',
        Component: Blog,
      },
    ],
  },
]

export function createRouter(): ReturnType<typeof createBrowserRouter> {
  const routeWrappers = routerObjects.map((router) => {
    // @ts-ignore TODO: better type support
    const getLayout = router.Component?.getLayout || getDefaultLayout
    const Component = router.Component!
    const page = getLayout(<Component />)
    return {
      ...router,
      element: page,
      Component: null,
      ErrorBoundary: ErrorPage,
    }
  })
  return createBrowserRouter(routeWrappers)
}
