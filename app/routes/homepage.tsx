import * as React from 'react'
import { MetaFunction } from 'react-router'
import { Hero } from 'src/components/hero'
import { HOSTNAME } from 'src/constants'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'cognactive',
    },
    {
      property: 'og:image',
      content: `${HOSTNAME}/opengraph-root.jpeg`,
    },
    {
      property: 'og:image:url',
      content: `${HOSTNAME}/opengraph-root.jpeg`,
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
      content: `${HOSTNAME}`,
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
