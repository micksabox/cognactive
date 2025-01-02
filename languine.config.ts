import { defineConfig } from 'languine'
import { supportedLanguages } from './app/localization/resource'

export default defineConfig({
  version: '1.0.2',
  locale: {
    source: 'en',
    targets: supportedLanguages.filter((l) => l !== 'en'),
  },
  files: {
    json: {
      include: [
        // Workaround to support i18next namespaces
        {
          from: './app/i18n/locales/en/translation.json',
          to: './app/i18n/locales/[locale]/translation.json',
        },
        {
          from: './app/i18n/locales/en/notfound.json',
          to: './app/i18n/locales/[locale]/notfound.json',
        },
      ],
    },
  },
  llm: {
    provider: 'openai',
    model: 'gpt-4o',
  },
})
