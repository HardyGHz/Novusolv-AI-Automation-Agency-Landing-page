import test from 'node:test'
import assert from 'node:assert/strict'
import { bookingPayload, leadPayload, normalizeEmail } from '../src/lib/submissionValidation.ts'
import { getStoredUtms } from '../src/lib/utm.ts'

test('payload picks known fields and normalizes contacts', () => {
  assert.deepEqual(leadPayload({ name: ' Test ', email: ' TEST@example.invalid ', source: 'contact_form', is_deleted: true, created_at: '1990' }), { name: 'Test', email: 'test@example.invalid', source: 'contact_form', message: undefined })
  const b = bookingPayload({ name: 'Test', company: 'Company', phone: '+40 700 000 000', source: 'footer_cta', main_problem: 'problem_lost_leads', utm_source: 'campaign', is_deleted: true })
  assert.equal(b.utm_source, 'campaign'); assert.equal('is_deleted' in b, false)
})
test('invalid and oversized input fails before the request', () => {
  for (const email of ['bad', 'a@b', 'a\nb@c.d', 'x'.repeat(255)+'@e.invalid']) assert.throws(() => normalizeEmail(email))
  assert.throws(() => leadPayload({ name: ' ', email: 'x@y.invalid', source: 'contact_form' }))
  assert.throws(() => leadPayload({ name: 'Test', email: 'x@y.invalid', source: 'contact_form', message: 'x'.repeat(5001) }))
  assert.throws(() => bookingPayload({ name: 'Test', company: 'Test', phone: 'letters', source: 'footer_cta' }))
  assert.throws(() => bookingPayload({ name: 'Test', company: 'Test', phone: '0700000000', source: 'footer_cta', main_problem: 'unknown' }))
})

test('qualification is validated and optional for legacy callers', () => {
  const base = { name: 'Test', company: 'Company', phone: '0700000000', source: 'footer_cta' }
  const payload = bookingPayload({ ...base, timeline: 'asap', project_details: ' Manual CRM entry. ' })
  assert.equal(payload.timeline, 'asap')
  assert.equal(payload.project_details, 'Manual CRM entry.')
  assert.equal(bookingPayload(base).timeline, undefined)
  assert.throws(() => bookingPayload({ ...base, timeline: 'urgent_override' }))
  assert.throws(() => bookingPayload({ ...base, project_details: 'x'.repeat(501) }))
})
test('tampered attribution storage cannot override identity, source, or internal columns', () => {
  Object.defineProperty(globalThis, 'sessionStorage', { value: { getItem: () => JSON.stringify({ utm_source: 'campaign', name: 'Injected', source: 'Injected', is_deleted: true, referrer: { attack: true } }) }, configurable: true })
  assert.deepEqual(getStoredUtms(), { utm_source: 'campaign' })
  Object.defineProperty(globalThis, 'sessionStorage', { value: { getItem: () => '[1,2]' }, configurable: true })
  assert.deepEqual(getStoredUtms(), {})
})
