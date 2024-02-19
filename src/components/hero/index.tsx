import { ActivitySquare, ScrollIcon, ListTodo, HeartHandshakeIcon, LayoutGridIcon } from 'lucide-react'
import CognactiveIcon from 'src/assets/icons/cognactive-icon'

import { Button } from '../ui/button'
import { Link } from '@remix-run/react'

// Temporary. See docs/decisions/02-i18n
import t from 'src/i18n/locales/en/translation.json'

export const Hero = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-600 to-slate-900">
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="mb-12">
                <div id="cognactive-symbol" className="defence-falling m-auto w-48">
                  <CognactiveIcon className="fill-white" darkMode />
                </div>
                <h1 className="my-6 text-3xl font-bold tracking-tighter text-transparent text-white sm:text-5xl xl:text-6xl/none">
                  {t['hero-title']}
                </h1>
                <div className="mx-auto flex max-w-sm flex-col gap-2">
                  <Button className="font-semiboldn py-6 text-lg" size={'lg'} asChild>
                    <Link to="/tracker">
                      <ListTodo className="mr-2" />
                      Launch Tracker
                      {/* {t('get-started')} */}
                    </Link>
                  </Button>
                  <Button size={'lg'} variant={'ghost'} className="text-white" asChild>
                    <a href="/files/NAC_Protocol.pdf">
                      <ScrollIcon className="mr-2 inline-block w-4" /> Read NAC protocol whitepaper
                    </a>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-full space-y-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                    <div className="rounded-full bg-black p-4 text-white">
                      <ActivitySquare size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t['tracking']}</h2>
                    <p className="text-white">{t['tracking-desc']}</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                    <div className="rounded-full bg-black p-4 text-white">
                      <LayoutGridIcon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t['hero-appexperience']}</h2>
                    <p className="text-white">{t['hero-appexperience-desc']}</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                    <div className="rounded-full bg-black p-4 text-white">
                      <HeartHandshakeIcon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t['hero-opensource']}</h2>
                    <p className="text-white">{t['hero-opensource-desc']}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
