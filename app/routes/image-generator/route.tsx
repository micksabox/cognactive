import satori, { SatoriOptions } from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { LoaderFunctionArgs } from '@remix-run/node'
import React from 'react'

// Used code from https://www.jacobparis.com/content/remix-og

export async function loader({ request }: LoaderFunctionArgs) {
  const jsx = (
    <div tw="flex flex-col p-8 w-full h-full bg-white border border-black">
      <h1 tw="flex text-6xl">What is NAC Protocol?</h1>
      <h2 tw="text-4xl text-slate-700">Natural supplements to boost immune and cognitive health</h2>
    </div>
  )
  // From satori docs example
  const svg = await satori(jsx, {
    width: 1200,
    height: 600,
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