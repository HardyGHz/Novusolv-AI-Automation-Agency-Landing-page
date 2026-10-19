import { createHandler } from './core.ts'

const baseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const secret = Deno.env.get('NOVUSOLV_TURNSTILE_SECRET_KEY') ?? ''

async function rpc(name: string, body: unknown): Promise<unknown> {
  const response = await fetch(`${baseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST', headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(15000),
  })
  const data = await response.json()
  if (!response.ok) throw { code: data.code }
  return data
}

Deno.serve(createHandler({
  secret,
  // HMAC prevents reversing the IP buckets; service key never leaves the server.
  ipSalt: serviceKey,
  takeBudget: async hash => await rpc('website_take_ip_budget', { p_hash: hash }) === true,
  verify: async (token, ip) => {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }), signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error('Verification unavailable')
    return response.json()
  },
  insert: async (kind, payload) => { await rpc('website_insert_verified', { p_kind: kind, p_data: payload }) },
}))
