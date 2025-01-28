import { lazy, Suspense } from 'react'
import type { Route } from './+types/policy'

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { lang } = context
  return { lang }
}

export default function PrivacyPolicy({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData
  const PrivacyContent = lazy(() => import(`./${lang}/privacy.mdx`))

  return (
    <div className="container prose py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <PrivacyContent />
      </Suspense>
    </div>
  )
}
