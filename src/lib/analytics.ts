// ─── Meta Pixel + consent-gated analytics ──────────────────────────────────
// The pixel only ever loads AFTER the visitor has accepted marketing cookies
// (GDPR — required for the RO/EU market). Until then everything here is a no-op.

export const COOKIE_KEY = 'novusolv_cookie_consent'

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

let pixelInitialized = false

export function hasMarketingConsent(): boolean {
  try {
    return localStorage.getItem(COOKIE_KEY) === 'accepted'
  } catch {
    return false
  }
}

/**
 * Injects the Meta Pixel base code and fires the initial PageView.
 * Guarded three ways: needs consent, needs a configured pixel id, and
 * only runs once. Safe to call multiple times (e.g. on mount + on accept).
 */
export function initMetaPixel(): void {
  if (pixelInitialized) return
  if (!hasMarketingConsent()) return
  if (!PIXEL_ID) return // no id configured (local/dev) → silent no-op

  /* eslint-disable */
  // Standard Meta Pixel snippet
  ;(function (f: any, b, e, v, n?: any, t?: any, s?: any) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = true
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */

  window.fbq?.('init', PIXEL_ID)
  window.fbq?.('track', 'PageView')

  // noscript fallback pixel
  const noscript = document.createElement('noscript')
  const img = document.createElement('img')
  img.height = 1
  img.width = 1
  img.style.display = 'none'
  img.src = `https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`
  noscript.appendChild(img)
  document.body.appendChild(noscript)

  pixelInitialized = true
}

/**
 * Tracks a standard Meta Pixel event. No-op if the pixel never loaded
 * (no consent / no id), so call sites don't need their own guards.
 */
export function trackPixelEvent(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (!pixelInitialized) return
  window.fbq?.('track', event, params)
}
