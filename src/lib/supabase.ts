import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Forms will not work.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Lead submission
export async function submitLead(data: {
  name: string
  email: string
  message?: string
  source: string
}) {
  const { error } = await supabase.from('leads').insert([data])
  if (error) throw error
  return true
}

// Newsletter subscription
export async function subscribeNewsletter(email: string) {
  const { error } = await supabase.from('newsletter_subscribers').insert([{ email }])
  if (error) {
    // Handle duplicate email gracefully
    if (error.code === '23505') {
      throw new Error('You are already subscribed!')
    }
    throw error
  }
  return true
}
