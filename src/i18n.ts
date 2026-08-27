import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en.json'
import roTranslations from './locales/ro.json'
import huTranslations from './locales/hu.json'
import { DEFAULT_LANGUAGE, LANGUAGES } from './lib/languages'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ro: { translation: roTranslations },
      hu: { translation: huTranslations }
    },
    // Romanian is the primary market, so anything we do not ship lands there
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGES.map((l) => l.code),
    // "ro-RO" and "en-GB" resolve to "ro" and "en" instead of falling through
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
