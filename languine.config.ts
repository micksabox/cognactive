import { defineConfig } from 'languine'

export default defineConfig({
  version: '1.0.2',
  locale: {
    source: 'en',
    targets: ['es', 'fr'],
  },
  files: {
    json: {
      include: ['./app/i18n/locales/[locale]/translation.json'],
    },
  },
  llm: {
    provider: 'openai',
    model: 'gpt-4o',
  },
})
