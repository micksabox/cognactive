import { ActivitySquare, ScrollIcon, ListTodo, HeartHandshakeIcon, LayoutGridIcon, Scan } from 'lucide-react'
import CognactiveIcon from 'src/assets/icons/cognactive-icon'

import { Button } from '../ui/button'
import { Link } from '@remix-run/react'

// Temporary. See docs/decisions/02-i18n
import t from 'src/i18n/locales/en/translation.json'
import { GITHUB_REPO_BASE } from 'src/constants'

interface FeatureProps {
  icon: React.ElementType
  title: string
  description: string
  link?: string
  linkText?: string
}

const HeroFeature: React.FC<FeatureProps> = ({ icon: Icon, title, description, link, linkText }) => {
  return (
    <div className="flex flex-col items-start space-y-2 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-black p-2 text-white">
          <Icon size={16} />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-white">
        {description}{' '}
        {link && (
          <Link className="underline underline-offset-auto" to={link}>
            {linkText}
          </Link>
        )}
      </p>
    </div>
  )
}

export const Hero = () => {
  return (
    <div className="flex bg-gradient-to-b from-slate-600 to-slate-900">
      <section className="w-full py-8 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="mb-4">
                <div id="cognactive-symbol" className="defence-falling m-auto w-36">
                  <CognactiveIcon className="fill-white" darkMode />
                </div>
                <h1 className="my-4 text-3xl font-bold tracking-tighter text-transparent text-white sm:text-5xl xl:text-6xl/none">
                  {t['hero-title']}
                </h1>
                <p className="mb-4">Open source tools and tech for the anti-fungal NAC protocol.</p>
                <div className="mx-auto flex max-w-sm flex-col gap-2">
                  <Button className="font-semiboldn bg-cyan py-6 text-lg" size={'lg'} asChild>
                    <Link to="/tracker">
                      <ListTodo className="mr-2" />
                      Regimen Tracker
                      {/* {t('get-started')} */}
                    </Link>
                  </Button>
                  <Button className="font-semiboldn py-6 text-lg" size={'lg'} asChild>
                    <Link to="/ingread">
                      <Scan className="mr-2" />
                      Ingredient Scanner
                    </Link>
                  </Button>
                  <div>
                    <p className="my-2">What is the NAC protocol?</p>
                    <Button size={'lg'} variant={'ghost'} className="border border-white text-white shadow-md" asChild>
                      <a href="/files/NAC_Protocol.pdf">
                        <ScrollIcon className="mr-2 inline-block w-4" /> Read NAC protocol whitepaper
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div id="hero-features" className="mx-auto w-full max-w-full space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <HeroFeature
                  icon={() => <ActivitySquare size={16} />}
                  title={t['tracking']}
                  description={t['tracking-desc']}
                />
                <HeroFeature
                  icon={() => <LayoutGridIcon size={16} />}
                  title={t['hero-appexperience']}
                  description={t['hero-appexperience-desc']}
                />
                <HeroFeature
                  icon={() => <HeartHandshakeIcon size={16} />}
                  title={t['hero-opensource']}
                  description={t['hero-opensource-desc']}
                  link={GITHUB_REPO_BASE}
                  linkText="Source code available here."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
