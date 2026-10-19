export const FORM_LIMITS = { name: 120, company: 200, phone: 40, email: 254, message: 5000 } as const
export const PROBLEM_OPTIONS = ['problem_lost_leads', 'problem_slow_reply', 'problem_manual_work', 'problem_weak_website', 'problem_scattered', 'problem_unsure'] as const
const attributionFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'landing_page', 'referrer'] as const

function text(value: unknown, max: number, required = false): string | undefined {
  if (value === undefined || value === null || value === '') {
    if (required) throw new Error('Invalid submission')
    return undefined
  }
  if (typeof value !== 'string') throw new Error('Invalid submission')
  const result = value.trim()
  if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result)) throw new Error('Invalid submission')
  return result || undefined
}

export function normalizeEmail(value: unknown, required = true): string | undefined {
  const result = text(value, FORM_LIMITS.email, required)?.toLowerCase()
  if (result && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new Error('Invalid email')
  return result
}

function source(value: unknown) {
  const result = text(value, 100, true)!
  if (!/^[A-Za-z0-9_-]+$/.test(result)) throw new Error('Invalid source')
  return result
}

/** Pick known keys; never spread untrusted storage or caller objects into INSERTs. */
export function leadPayload(data: Record<string, unknown>) {
  return { name: text(data.name, FORM_LIMITS.name, true)!, email: normalizeEmail(data.email)!, message: text(data.message, FORM_LIMITS.message), source: source(data.source) }
}

export function bookingPayload(data: Record<string, unknown>) {
  const phone = text(data.phone, FORM_LIMITS.phone, true)!
  const digits = phone.replace(/\D/g, '')
  if (!/^[+0-9 ().-]{6,40}$/.test(phone) || digits.length < 6 || digits.length > 20) throw new Error('Invalid phone')
  const problem = text(data.main_problem, 100)
  if (problem && !(PROBLEM_OPTIONS as readonly string[]).includes(problem)) throw new Error('Invalid problem')
  const attribution: Record<string, string> = {}
  for (const key of attributionFields) {
    const value = text(data[key], key === 'referrer' || key === 'landing_page' ? 2048 : 500)
    if (value) attribution[key] = value
  }
  return { ...attribution, name: text(data.name, FORM_LIMITS.name, true)!, company: text(data.company, FORM_LIMITS.company, true)!, phone, email: normalizeEmail(data.email, false), main_problem: problem, source: source(data.source) }
}

export function isRateLimited(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'PT429'
}
