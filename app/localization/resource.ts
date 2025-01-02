import spanish from '../../app/i18n/locales/es/translation.json'
import english from '../../app/i18n/locales/en/translation.json'
import french from '../../app/i18n/locales/fr/translation.json'

import notfound from '../../app/i18n/locales/en/notfound.json'
import notfound_es from '../../app/i18n/locales/es/notfound.json'
import notfound_fr from '../../app/i18n/locales/fr/notfound.json'

const languages = ['en', 'es', 'fr'] as const
export const supportedLanguages = [...languages]
export type Language = (typeof languages)[number]

type Resource = {
  translation: typeof english
  notfound: typeof notfound
}

export type Namespace = keyof Resource

export const resources: Record<Language, Resource> = {
  en: {
    translation: english,
    notfound: notfound,
  },
  es: {
    translation: spanish,
    notfound: notfound_es,
  },
  fr: {
    translation: french,
    notfound: notfound_fr,
  },
}
