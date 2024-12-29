import { supportedLanguages } from './app/localization/resource'

export default {
  baseLocale: 'en',
  locales: supportedLanguages,
  localePath: 'app/i18n/locales',
  openAIApiKey: process.env.OPENAI_API_KEY,
  openAIApiUrl: process.env.OPENAI_API_URL,
}
