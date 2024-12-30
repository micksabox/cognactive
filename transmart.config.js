import { supportedLanguages } from './app/localization/resource'

module.exports = {
  baseLocale: 'en',
  locales: supportedLanguages,
  localePath: 'app/i18n/locales',
  openAIApiKey: process.env.OPENAI_API_KEY,
  openAIApiUrl: process.env.OPENAI_API_URL,
}
