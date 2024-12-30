import { z } from 'zod'
import { resources } from '@/localization/resource'
import type { Route } from './+types/resource.locales'
import { getEnv } from '@/utils/env.server'
import { cacheHeader } from 'pretty-cache-header'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)

  const lng = z
    .string()
    .refine((lng): lng is keyof typeof resources => Object.keys(resources).includes(lng))
    .safeParse(url.searchParams.get('lng'))

  const namespaces = resources[lng.success ? lng.data : 'en']

  const ns = z
    .string()
    .refine((ns): ns is keyof typeof namespaces => {
      return Object.keys(namespaces).includes(ns)
    })
    .safeParse(url.searchParams.get('ns'))

  const headers = new Headers()

  // On production, we want to add cache headers to the response
  if (getEnv().MODE === 'production') {
    headers.set(
      'Cache-Control',
      cacheHeader({
        maxAge: '5m',
        sMaxage: '1d',
        staleWhileRevalidate: '7d',
        staleIfError: '7d',
      }),
    )
  }

  return Response.json(namespaces[ns.success ? ns.data : 'translation'], { headers })
}

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const lng = formData.get('lng')

  const referrer = request.headers.get('Referer') || '/'

  const headers = new Headers()
  headers.append('Set-Cookie', `lng=${lng}; Path=/; SameSite=Lax`)
  headers.append('Location', referrer)

  return new Response('Ok', {
    headers,
    status: 302,
  })
}
