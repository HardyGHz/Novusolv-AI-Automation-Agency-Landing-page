import { isIP } from 'node:net'
import { bookingPayload, leadPayload, normalizeEmail } from '../../../src/lib/submissionValidation.ts'

const origins = new Set(['https://novusolv.com', 'https://www.novusolv.com'])
const hostnames = new Set(['novusolv.com', 'www.novusolv.com'])
const actions = new Set(['booking', 'newsletter', 'lead'])
export interface Dependencies {
  secret: string
  ipSalt: string
  takeBudget: (hash: string) => Promise<boolean>
  verify: (token: string, ip: string) => Promise<{ success?: boolean; hostname?: string; action?: string }>
  insert: (kind: string, payload: Record<string, unknown>) => Promise<void>
}

// Only for the Supabase-hosted Cloudflare ingress. Never fall back to arbitrary
// X-Forwarded-For or body fields. Missing/invalid trusted metadata fails closed.
export function clientIp(headers: Headers): string {
  const ip = headers.get('cf-connecting-ip')?.trim() ?? ''
  if (!isIP(ip) || ip.includes('%')) throw new Error('Missing trusted IP')
  return ip
}

export function ipNetwork(ip: string): string {
  if (isIP(ip) === 4) return ip
  if (isIP(ip) !== 6 || ip.includes('%')) throw new Error('Invalid IP')
  const canonical = new URL(`http://[${ip}]/`).hostname.slice(1, -1)
  const halves = canonical.split('::')
  const left = halves[0] ? halves[0].split(':') : []
  const right = halves[1] ? halves[1].split(':') : []
  const groups = halves.length === 2 ? [...left, ...Array(8-left.length-right.length).fill('0'), ...right] : left
  const numbers = groups.map(part => parseInt(part, 16))
  if (numbers.slice(0, 5).every(n => n === 0) && numbers[5] === 65535) {
    return [numbers[6] >> 8, numbers[6] & 255, numbers[7] >> 8, numbers[7] & 255].join('.')
  }
  return numbers.slice(0, 4).map(n => n.toString(16)).join(':') + '::/64'
}

export async function hashIp(ip: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(salt), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const value = await crypto.subtle.sign('HMAC', key, encoder.encode('novusolv-website:' + ipNetwork(ip)))
  return Array.from(new Uint8Array(value), b => b.toString(16).padStart(2, '0')).join('')
}

async function readBody(req: Request): Promise<unknown> {
  if (Number(req.headers.get('content-length')) > 16384) throw new Error('Body too large')
  if (!req.body) throw new Error('Missing body')
  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > 16384) { await reader.cancel(); throw new Error('Body too large') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
  return JSON.parse(new TextDecoder().decode(bytes))
}

export function createHandler(deps: Dependencies) {
  return async (req: Request): Promise<Response> => {
    const origin = req.headers.get('origin') ?? ''
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff' }
    if (origins.has(origin)) {
      headers['Access-Control-Allow-Origin'] = origin
      headers['Access-Control-Allow-Headers'] = 'authorization, apikey, content-type, x-client-info'
      headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    }
    const respond = (status: number, code: string) => new Response(JSON.stringify(status === 201 ? { ok: true } : { code }), { status, headers })
    if (!origins.has(origin)) return respond(403, 'ORIGIN_DENIED')
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers })
    if (req.method !== 'POST') return respond(405, 'METHOD_NOT_ALLOWED')
    if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return respond(415, 'INVALID_CONTENT_TYPE')
    if (!deps.secret || !deps.ipSalt) return respond(503, 'TEMPORARILY_UNAVAILABLE')
    let ip: string
    try { ip = clientIp(req.headers) } catch { return respond(503, 'TEMPORARILY_UNAVAILABLE') }
    try {
      if (!await deps.takeBudget(await hashIp(ip, deps.ipSalt))) {
        headers['Retry-After'] = '600'
        return respond(429, 'PT429')
      }
    } catch { return respond(503, 'TEMPORARILY_UNAVAILABLE') }
    let kind: string, token: string, payload: Record<string, unknown>
    try {
      const body = await readBody(req) as Record<string, unknown>
      if (!body || Array.isArray(body) || !actions.has(String(body.kind))) throw new Error('Invalid kind')
      kind = body.kind as string
      if (typeof body.token !== 'string' || !body.token || body.token.length > 2048) return respond(400, 'CAPTCHA_REQUIRED')
      token = body.token
      if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) throw new Error('Invalid payload')
      const data = body.data as Record<string, unknown>
      payload = kind === 'booking' ? bookingPayload(data) : kind === 'lead' ? leadPayload(data) : { email: normalizeEmail(data.email)! }
    } catch { return respond(400, 'PT400') }
    try {
      const result = await deps.verify(token, ip)
      if (result.success !== true || !hostnames.has(result.hostname ?? '') || result.action !== kind) return respond(400, 'CAPTCHA_INVALID')
    } catch { return respond(503, 'TEMPORARILY_UNAVAILABLE') }
    try { await deps.insert(kind, payload) } catch (error) {
      const code = (error as {code?: string})?.code
      if (code === 'PT429') { headers['Retry-After'] = '900'; return respond(429, 'PT429') }
      if (code === 'PT400' || code === '23514' || code === '23502') return respond(400, 'PT400')
      return respond(503, 'TEMPORARILY_UNAVAILABLE')
    }
    return respond(201, 'OK')
  }
}
