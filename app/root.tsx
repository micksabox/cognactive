import React from 'react'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react'

// TODO: Remove after Vite migration
import cognactiveSymbolStyles from '../src/styles/cognactive-symbol.css?url'
import globalStyles from '../src/styles/globals.css?url'
import type { LinksFunction } from '@remix-run/node'
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: cognactiveSymbolStyles },
]
// import 'src/i18n/config'
// /TODO

import { Toaster } from 'react-hot-toast'

import { Header } from 'src/components/header'
import ErrorPage from 'src/components/error-page'

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <div className="h-min-screen">
          <Header className="fixed top-0 z-10 h-16" />
          <div className="mt-16">
            <Outlet />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <ErrorPage />
        <Scripts />
      </body>
    </html>
  )
}
