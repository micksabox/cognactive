import { resolve } from 'node:path'
import { RemixI18Next } from 'remix-i18next/server'
import i18n from '@/localization/i18n' // your i18n configuration file

const i18next = new RemixI18Next({
  detection: {
    findLocale: async (request) => {
      // Detect language from stored cookie
      const cookie = request.headers.get('Cookie')
      const lng = cookie?.match(/lng=([^;]+)/)?.[1]
      return lng || 'en'
    },
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve('../i18n/locales/{{lng}}/{{ns}}.json'),
    },
  },
})

export default i18next
