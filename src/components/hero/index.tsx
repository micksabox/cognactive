import { Zap, ActivitySquare, Globe2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CognactiveIcon from 'src/assets/icons/cognactive-icon.svg'

import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

export const Hero = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-600 to-slate-900">
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="mb-24">
                <div id="cognactive-symbol" className="defence-falling m-auto w-48">
                  <CognactiveIcon />
                </div>
                <h1 className="mb-6 text-3xl font-bold tracking-tighter text-transparent text-white sm:text-5xl xl:text-6xl/none">
                  {t('hero-title')}
                </h1>
                <Button className="font-semiboldn gap-3 py-6 text-lg" size={'lg'} asChild>
                  <Link to="/tracker">
                    <Zap />
                    {t('get-started')}
                  </Link>
                </Button>
              </div>
              <div className="mx-auto w-full max-w-full space-y-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                    <div className="rounded-full bg-black p-4 text-white">
                      <ActivitySquare size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('tracking')}</h2>
                    <p className="text-white">{t('tracking-desc')}</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                    <div className="rounded-full bg-black p-4 text-white">
                      <Globe2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('i18nsupport')}</h2>
                    <p className="text-white">{t('i18nsupport-desc')}</p>
                  </div>
                  {/* <div className="flex flex-col items-center p-4 space-y-2 rounded-lg">
                    <div className="p-4 text-white bg-black rounded-full">
                      <HeartHandshake size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white"> {t('linters')} </h2>
                    <p className="text-white">{t('linters-desc')}</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
