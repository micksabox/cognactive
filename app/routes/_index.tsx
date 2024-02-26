import * as React from 'react'
import { MetaFunction } from '@remix-run/node'
import { Hero } from 'src/components/hero'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'cognactive',
    },
    {
      property: 'og:image',
      content: 'https://cognactive.net/opengraph-root.jpeg',
    },
    {
      property: 'og:title',
      content: 'cognactive',
    },
    {
      property: 'og:site_name',
      content: 'cognactive',
    },
    {
      property: 'og:url',
      content: 'https://cognactive.net',
    },
    {
      property: 'og:description',
      content: 'Track NAC Protocol',
    },
  ]
}

const IndexRoute: React.FC = () => {
  return <Hero />
}

export default IndexRoute
