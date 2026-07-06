// ─── UTM + attribution capture ──────────────────────────────────────────────
// Captures campaign params on first landing and stores them for the session,
// so a form submitted several clicks later still carries the ad attribution.

const UTM_STORAGE_KEY = 'novusolv_utm'

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

export interface UtmData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  landing_page?: string
  referrer?: string
}

/**
 * Reads UTM params from the current URL. If any are present, stores them
 * (plus landing_page + referrer) in sessionStorage. Only overwrites when
 * new UTMs are found, so an internal navigation doesn't wipe the original ad.
 */
export function captureUtms(): void {
  try {
    const params = new URLSearchParams(window.location.search)
    const found: UtmData = {}
    let hasAny = false

    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) {
        found[key] = value
        hasAny = true
      }
    }

    if (!hasAny) return

    found.landing_page = window.location.pathname
    found.referrer = document.referrer || undefined

    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found))
  } catch {
    // sessionStorage unavailable / SSR — ignore
  }
}

/** Returns the stored UTM data for this session, or an empty object. */
export function getStoredUtms(): UtmData {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UtmData) : {}
  } catch {
    return {}
  }
}
