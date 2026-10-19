import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
const config = JSON.parse(readFileSync('vercel.json', 'utf8'))
const headers = config.headers.find(row => row.source === '/(.*)').headers
assert(!headers.some(h => h.key === 'Content-Security-Policy-Report-Only'), 'CSP must be enforced')
const policy = headers.find(h => h.key === 'Content-Security-Policy').value
const scripts = policy.split(';').find(part => part.trim().startsWith('script-src '))
assert(!scripts.includes("'unsafe-inline'") && !scripts.includes("'unsafe-eval'"), 'Unsafe script policy')
for (const match of readFileSync('dist/index.html', 'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (/\bsrc=/.test(match[1]) || !match[2].trim()) continue
  const hash = createHash('sha256').update(match[2].replace(/\r\n/g, '\n')).digest('base64')
  assert(policy.includes(`'sha256-${hash}'`), 'Inline structured-data hash changed: update vercel.json')
}
for (const name of readdirSync('dist/assets').filter(name => name.endsWith('.js'))) {
  const js = readFileSync(`dist/assets/${name}`, 'utf8')
  assert(!js.includes('PENDING_PRODUCTION_SITE_KEY'), 'Missing production CAPTCHA site key')
  assert(!/1x00000000000000000000(?:AA|BB)|2x00000000000000000000(?:AB|BB)|3x00000000000000000000FF/.test(js), 'Test CAPTCHA key in production build')
}
console.log('Security config: enforced CSP, matching inline hashes, production CAPTCHA key.')
