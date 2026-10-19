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

// Lead submission
export async function submitLead(data: {
  name: string
  email: string
  message?: string
  source: string
}) {
  const { error } = await supabase.from('leads').insert([leadPayload(data)])
  if (error) throw error
  return true
}

// Newsletter subscription
export async function subscribeNewsletter(email: string) {
  const { error } = await supabase.from('newsletter_subscribers').insert([{ email: normalizeEmail(email)! }])
  // The DB guard suppresses duplicates without emitting another n8n event.
  // Also keep older deployments' UNIQUE errors indistinguishable to the visitor.
  if (error && error.code !== '23505') throw error
  return true
}

// Book a Call submission
export async function submitBookCall(data: {
  name: string
  company: string
  phone: string
  email?: string
  main_problem?: string
  source: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  landing_page?: string
  referrer?: string
}) {
  const { error } = await supabase.from('call_bookings').insert([bookingPayload(data)])
  if (error) throw error
  return true
}
