import { Link } from 'react-router'
import CognactiveIcon from 'src/assets/icons/cognactive-icon'
import { ArrowUpRightSquare, Github } from 'lucide-react'
import { GITHUB_REPO_BASE, TELEGRAM_CHAT_LINK } from 'src/constants'
import { Button } from '../ui/button'
import { LanguageSelector } from '../language-selector'
import { useTranslation } from 'react-i18next'

const Footer: React.FC = () => {
  const { t } = useTranslation('translation')

  return (
    <footer className="w-full bg-foreground text-xs text-slate-500">
      <div className="container p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-block w-16">
              <CognactiveIcon className="fill-slate-500 transition-colors hover:fill-white" darkMode />
            </span>
            <Button size={'sm'} asChild>
              <Link to={TELEGRAM_CHAT_LINK}>
                Chat NAC <ArrowUpRightSquare className="ml-2 inline-block w-4" />
              </Link>
            </Button>
            <Button size={'sm'} asChild>
              <a href={GITHUB_REPO_BASE} target="_blank" rel="noreferrer">
                {t('github-link-title')} &nbsp;
                <Github className="w-4" />
              </a>
            </Button>
          </div>
          <LanguageSelector triggerClassName="text-white" />
        </div>
        <p className="my-2">
          <Link className="underline underline-offset-auto" to={'/privacy'}>
            {t('data-usage-title')}
          </Link>
        </p>
        <p className="bottom-inset">
          <span className="font-semibold">{t('medical-disclaimer')}:</span> {t('medical-disclaimer-desc')}
        </p>
      </div>
    </footer>
  )
}

export default Footer
