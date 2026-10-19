import { createClient } from '@supabase/supabase-js'
import { bookingPayload, leadPayload, normalizeEmail } from './submissionValidation'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Forms will not work.')
}

// Provide valid dummy strings to prevent createClient from crashing the app
const apiUrl = supabaseUrl || 'https://dummy.supabase.co'
const apiKey = supabaseAnonKey || 'dummy-anon-key'

export const supabase = createClient(apiUrl, apiKey)

async function protectedSubmission(kind: 'lead' | 'newsletter' | 'booking', data: Record<string, unknown>, token: string) {
  if (!token) throw { code: 'CAPTCHA_REQUIRED' }
  const response = await fetch(`${apiUrl}/functions/v1/website-submit`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': apiKey, 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ kind, data, token }), signal: AbortSignal.timeout(30000),
  })
  const result = await response.json()
  if (!response.ok || result.ok !== true) throw { code: result.code || 'TEMPORARILY_UNAVAILABLE' }
  return true
}

// Lead submission
export async function submitLead(data: {
  name: string
  email: string
  message?: string
  source: string
}, token: string) {
  return protectedSubmission('lead', leadPayload(data), token)
}

// Newsletter subscription
export async function subscribeNewsletter(email: string, token: string) {
  return protectedSubmission('newsletter', { email: normalizeEmail(email)! }, token)
}

// Book a Call submission
export async function submitBookCall(data: {
  name: string
  company: string
  phone: string
  email?: string
  main_problem?: string
  timeline?: string
  project_details?: string
  source: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  landing_page?: string
  referrer?: string
}, token: string) {
  return protectedSubmission('booking', bookingPayload(data), token)
}
