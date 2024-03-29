import React from 'react'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react'

// TODO: Remove after Vite migration
import cognactiveSymbolStyles from '../src/assets/icons/cognactive-symbol.css?url'
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
import Footer from 'src/components/footer'
import { DOMAIN, HOSTNAME } from 'src/constants'

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />

        {/* Standalone web app support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="cognactive" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

        {/* Open Graph */}
        <meta property="og:site_name" content="cognactive" />
        {/* Rest of meta headers can be specified on a per route basis */}

        {/* Twitter previews */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cognactive" />
        <meta name="twitter:creator" content="@micksabox" />
        <meta property="twitter:domain" content={DOMAIN} />
        <meta property="twitter:url" content={HOSTNAME} />
        <meta name="twitter:image:alt" content="cognactive" />
        <meta name="twitter:title" content="cognactive" />
        <meta name="twitter:description" content="Track NAC Protocol" />
        <meta name="twitter:image" content={`${HOSTNAME}/opengraph-root.jpeg`} />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
        />
        <meta name="theme-color" content="#319197" />
      </head>
      <body>
        <div className="h-min-screen">
          <Header className="fixed top-0 z-10 h-16" />
          <div className="mt-16">
            <Outlet />
          </div>
        </div>
        <Footer />

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
