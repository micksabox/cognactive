import { MetaFunction } from 'react-router'
import { lazy, Suspense } from 'react'
import type { Route } from './+types/route'
import { openGraphImageMeta, redirectToImageGenerator } from 'src/utils/misc'

export const meta: MetaFunction = () => {
  const title = 'Memery'
  const subtitle = "Plato's Allegory of the Cave"
  const body = 'A meme that explores the relationship between fungi and the human brain.'
  const imageUrl = redirectToImageGenerator({ title, subtitle, body })

  return [
    { name: 'title', content: title },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: subtitle + '|' + body },
    { property: 'og:title', content: title },
    { property: 'og:description', content: body },
    ...openGraphImageMeta(imageUrl),
  ]
}

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { lang } = context
  return { lang }
}

export default function PlatosCaveRoute({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData
  const ReadmeComponent = lazy(() => import(`./${lang}/readme.mdx`))

  return (
    <div className="prose">
      <Suspense fallback={<div>Loading...</div>}>
        <ReadmeComponent />
      </Suspense>
    </div>
  )
}
