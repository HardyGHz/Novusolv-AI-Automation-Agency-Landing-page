// Public widget identifier, restricted to the Novusolv hostnames in Cloudflare.
// The real secret exists ONLY in Supabase Edge Function Secrets.
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAFbRRMe-4f2bpXu9'

export function submissionErrorKey(error: unknown, fallback: string): string {
  const code = (error as { code?: string })?.code
  if (code === 'PT429') return 'security.rate_limit'
  if (code === 'CAPTCHA_REQUIRED' || code === 'CAPTCHA_INVALID') return 'security.captcha_retry'
  return fallback
}
