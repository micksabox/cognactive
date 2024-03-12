import Component from './post.md'

import { MetaFunction } from '@remix-run/node'
import { redirectToImageGenerator, openGraphImageMeta } from 'src/utils/misc'

export const meta: MetaFunction = () => {
  const title = 'Individual Health Empiricism'
  const subtitle = 'Framework for Thinking about Self-Experimentation'
  const body =
    'Unveiling the power of self-experimentation in the quest for personal health breakthroughs, using my NAC protocol journey as example.'
  const imageUrl = redirectToImageGenerator({ title, subtitle, body })

  return [
    { name: 'title', content: title },
    { property: 'og:title', content: title },
    { property: 'og:description', content: body },
    ...openGraphImageMeta(imageUrl),
  ]
}

export default Component
