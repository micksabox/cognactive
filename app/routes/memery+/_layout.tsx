import { Link, Outlet, useLoaderData, LoaderFunctionArgs } from 'react-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { getMemeByKey } from './utils.server'
import { invariantResponse } from 'src/utils/misc'
import { Carousel, CarouselContent, CarouselItem } from 'src/components/ui/carousel'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const urlPath = request.url.split('/')
  const memeKey = urlPath[urlPath.length - 1]

  invariantResponse(memeKey, 'Meme key is required')

  try {
    const meme = await getMemeByKey(memeKey)

    return { meme, memeKey }
  } catch (error) {
    console.log(error)
    throw new Response('Not found', { status: 404 })
  }
}

const MemeLayout: React.FC = () => {
  const { t } = useTranslation()
  const { meme, memeKey } = useLoaderData<typeof loader>()

  return (
    <div className="container p-4">
      <p className="text-xl text-slate-500">{t('memery.title')}</p>
      <h1 className="mb-1 text-3xl font-bold">{t(`memery.${memeKey}.title`)}</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div id="meme-render">
          <Carousel>
            <CarouselContent>
              {meme.imageFiles.map((imageFile) => (
                <CarouselItem className="md:basis-1/2" key={imageFile}>
                  <img className="h-48" src={`/images/memery/${memeKey}/${imageFile}`} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="text-md my-2 flex flex-col gap-4">
            <p>{t(`memery.${memeKey}.description`)}</p>
            <p>{t(`memery.${memeKey}.relevance`)}</p>
          </div>
        </div>
        <div id="meme-remix" className="gap-4 rounded-xl border bg-slate-100 px-4 py-2 shadow-lg">
          <div>
            <Outlet />
            <div>
              <p>Further reading</p>
              {meme.studies.map((study) => (
                <div key={study.key}>
                  <Link className="text-cyan underline underline-offset-auto" to={study.url}>
                    {study.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemeLayout
