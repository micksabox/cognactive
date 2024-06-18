import Component from './content.mdx'

import type { LinksFunction } from '@remix-run/node'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preload',
      href: '/videos/watermarked_video0c3be294294da4ad89c2509dce30c8bb2.mp4',
      as: 'video',
      type: 'video/mp4',
    },
  ]
}

export default Component
