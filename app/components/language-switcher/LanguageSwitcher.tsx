import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { supportedLanguages } from '@/localization/resource'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const location = useLocation()
  const to = location.pathname

  return (
    <div className="z-10 flex w-min gap-2 p-2">
      {supportedLanguages.map((language) => (
        <Link
          className="text-blue-500 transition-all hover:underline"
          key={language}
          to={`${to}?lng=${language}`}
          onClick={() => i18n.changeLanguage(language)}
        >
          {language}
        </Link>
      ))}
    </div>
  )
}

export { LanguageSwitcher }
