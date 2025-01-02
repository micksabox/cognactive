import { resolve } from 'node:path'
import { RemixI18Next } from 'remix-i18next/server'
import i18n from '@/localization/i18n' // your i18n configuration file

const i18next = new RemixI18Next({
  detection: {
    findLocale: async (request) => {
      // Get first path component from URL
      const url = new URL(request.url)
      const firstPathComponent = url.pathname.split('/')[1]

      // Check if it matches a supported language code
      if (i18n.supportedLngs.includes(firstPathComponent as any)) {
        return firstPathComponent
      }

      // Try to detect from Accept-Language header
      const acceptLanguage = request.headers.get('Accept-Language')
      if (acceptLanguage) {
        const preferredLang = acceptLanguage.split(',')[0].split('-')[0]
        if (i18n.supportedLngs.includes(preferredLang as any)) {
          return preferredLang
        }
      }

      // Else detect language from stored cookie
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
