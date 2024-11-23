import satori, { SatoriOptions } from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { LoaderFunctionArgs } from 'react-router'
import React from 'react'

import fs from 'fs'
import { OPEN_GRAPH_IMAGE_HEIGHT, OPEN_GRAPH_IMAGE_WIDTH } from 'src/utils/misc'

export function getLogoBase64() {
  const logoPath = new URL('../public/logo.png', import.meta.url).pathname

  const logoData = fs.readFileSync(logoPath)
  return `data:image/png;base64,${logoData.toString('base64')}`
}

// Used code from https://www.jacobparis.com/content/remix-og

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const title = searchParams.get('title') || 'NAC Protocol'
  const subtitle =
    searchParams.get('subtitle') || 'Natural stack to cleanse fungal pathogens and modulate immune health'
  const body = searchParams.get('body') || 'Simple yet powerful anti-fungal cleanse.'

  const jsx = (
    <div tw="flex flex-col p-8 w-full h-full bg-white border border-black">
      <h1 tw="flex text-7xl">{title}</h1>
      <img tw="absolute right-4 bottom-4" src={getLogoBase64()} width={100} height={100} />
      <h2 tw="text-5xl text-slate-700">{subtitle}</h2>
      <p tw="text-3xl">{body}</p>
    </div>
  )
  // From satori docs example
  const svg = await satori(jsx, {
    width: OPEN_GRAPH_IMAGE_WIDTH,
    height: OPEN_GRAPH_IMAGE_HEIGHT,
    fonts: await getFont('Inter'),
  })
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  const data = pngData.asPng()
  return new Response(data, {
    headers: {
      'Content-Type': 'image/png',
    },
  })
}

async function getFont(
  font: string,
  weights = [400, 500, 600, 700],
  text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\!@#$%^&*()_+-=<>?[]{}|;:,.`\'’"–—',
) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${font}:wght@${weights.join(';')}&text=${encodeURIComponent(text)}`,
    {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    },
  ).then((response) => response.text())
  const resource = css.matchAll(/src: url\((.+)\) format\('(opentype|truetype)'\)/g)
  return Promise.all(
    [...resource]
      .map((match) => match[1])
      .map((url) => fetch(url).then((response) => response.arrayBuffer()))
      .map(async (buffer, i) => ({
        name: font,
        style: 'normal',
        weight: weights[i],
        data: await buffer,
      })),
  ) as Promise<SatoriOptions['fonts']>
}
