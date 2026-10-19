import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TURNSTILE_SITE_KEY } from '../lib/botProtection'

interface Turnstile {
  render(container: HTMLElement, options: Record<string, unknown>): string
  remove(id: string): void
}
declare global { interface Window { turnstile?: Turnstile } }
let loading: Promise<Turnstile> | undefined
function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (loading) return loading
  loading = new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    const timeout = window.setTimeout(() => { script.remove(); reject(new Error('Challenge unavailable')) }, 15000)
    script.onload = () => { clearTimeout(timeout); window.turnstile ? resolve(window.turnstile) : reject(new Error('Challenge unavailable')) }
    script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('Challenge unavailable')) }
    document.head.appendChild(script)
  }).catch(error => { loading = undefined; throw error })
  return loading
}

export default function TurnstileChallenge({ action, onToken }: { action: 'booking' | 'newsletter'; onToken: (value: string) => void }) {
  const { t, i18n } = useTranslation()
  const container = useRef<HTMLDivElement>(null)
  const callback = useRef(onToken)
  callback.current = onToken
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let cancelled = false
    let widget: string | undefined
    callback.current('')
    setFailed(false)
    loadTurnstile().then(api => {
      if (cancelled || !container.current) return
      widget = api.render(container.current, {
        sitekey: TURNSTILE_SITE_KEY, action, theme: 'auto', size: container.current.clientWidth < 300 ? 'compact' : 'flexible', language: i18n.resolvedLanguage?.split('-')[0] ?? 'auto',
        callback: (token: string) => { if (!cancelled) { setFailed(false); callback.current(token) } },
        'expired-callback': () => { if (!cancelled) callback.current('') },
        'error-callback': () => { if (!cancelled) { callback.current(''); setFailed(true) } },
        'timeout-callback': () => { if (!cancelled) { callback.current(''); setFailed(true) } },
      })
    }).catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true; if (widget !== undefined) window.turnstile?.remove(widget) }
  }, [action, i18n.resolvedLanguage, attempt])
  return <div className="w-full min-w-0 space-y-2">
    <div ref={container} />
    {failed && <p role="alert" className="text-[12px] text-red-500">{t('security.captcha_unavailable')} <button type="button" onClick={() => setAttempt(n => n + 1)} className="underline cursor-pointer">{t('security.retry')}</button></p>}
    <p className="text-[11px] text-gray-500">{t('security.captcha_notice')} <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline">Cloudflare Privacy</a> · <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer" className="underline">Terms</a></p>
  </div>
}
