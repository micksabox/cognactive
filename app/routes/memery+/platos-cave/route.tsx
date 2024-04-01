import { MetaFunction, json } from '@remix-run/node'
import { getMemeByKey } from '../utils.server'

import Readme from './readme.md'
import { openGraphImageMeta, redirectToImageGenerator } from 'src/utils/misc'

export const meta: MetaFunction = () => {
  const title = 'Memery'
  const subtitle = "Plato's Allegory of the Cave"
  const body = 'A meme that explores the relationship between fungi and the human brain.'
  const imageUrl = redirectToImageGenerator({ title, subtitle, body })

  return [
    { name: 'title', content: title },
    { property: 'og:title', content: title },
    { property: 'og:description', content: body },
    ...openGraphImageMeta(imageUrl),
  ]
}

export const loader = async () => {
  const meme = await getMemeByKey('platos-cave')
  return json({ meme })
}

export default function PlatosCaveRoute() {
  return (
    <div className="prose">
      <Readme />
    </div>
  )
}
