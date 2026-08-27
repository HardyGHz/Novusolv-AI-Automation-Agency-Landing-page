// Single source of truth for the languages the site ships. Adding one means:
// drop in src/locales/<code>.json, register it in i18n.ts, add a row here.
export const LANGUAGES = [
  { code: 'ro', label: 'Română', short: 'RO', ogLocale: 'ro_RO' },
  { code: 'en', label: 'English', short: 'EN', ogLocale: 'en_US' },
  { code: 'hu', label: 'Magyar', short: 'HU', ogLocale: 'hu_HU' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

export const DEFAULT_LANGUAGE: LanguageCode = 'ro'

/** Maps i18next's resolved language ("ro-RO", "en-GB") onto a shipped locale. */
export function resolveLanguage(language: string | undefined): LanguageCode {
  const base = (language ?? '').split('-')[0].toLowerCase()
  return LANGUAGES.some((l) => l.code === base) ? (base as LanguageCode) : DEFAULT_LANGUAGE
}
