import spanish from 'src/i18n/locales/es/translation.json'
import english from 'src/i18n/locales/en/translation.json'

const languages = ['en', 'es'] as const
export const supportedLanguages = [...languages]
export type Language = (typeof languages)[number]

type Resource = {
  translation: typeof english
}

export type Namespace = keyof Resource

export const resources: Record<Language, Resource> = {
  en: {
    translation: english,
  },
  es: {
    translation: spanish,
  },
}
