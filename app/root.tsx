import React from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from 'react-router'

import 'src/assets/icons/cognactive-symbol.css'
import 'src/styles/globals.css'
import type { Route } from './+types/root'

import { useTranslation } from 'react-i18next'
import { useChangeLanguage } from 'remix-i18next/react'
import { LanguageSwitcher } from '@/components/language-switcher'

import { Toaster } from 'react-hot-toast'

import { Header } from 'src/components/header'
import ErrorPage from 'src/components/error-page'
import Footer from 'src/components/footer'
import { DOMAIN, HOSTNAME } from 'src/constants'

export async function loader({ context }: Route.LoaderArgs) {
  const { lang, clientEnv } = context
  return { lang, clientEnv }
}

export default function Root({ loaderData }: Route.ComponentProps) {
  const { lang, clientEnv } = loaderData

  useChangeLanguage(lang)
  const { i18n } = useTranslation()

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />

        <Meta />
        <Links />

        <script dangerouslySetInnerHTML={{ __html: `window.ENV = ${JSON.stringify(clientEnv)}` }} />

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

        {/* Splash screen */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png"
        />

        {/* Twitter previews */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cognactive" />
        <meta name="twitter:creator" content="@myconull" />
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
            <LanguageSwitcher />

            <Outlet />
          </div>
        </div>
        <Footer />

        <ScrollRestoration />
        <Scripts />
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
