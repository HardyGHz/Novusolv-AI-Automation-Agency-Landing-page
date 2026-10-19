import test from 'node:test'
import assert from 'node:assert/strict'
import { createHandler, clientIp, hashIp, ipNetwork, type Dependencies } from '../supabase/functions/website-submit/core.ts'

const booking = { name: 'SECURITY TEST', company: 'Test', phone: '+40 700 000 000', source: 'book_call_modal', main_problem: 'problem_manual_work', timeline: 'asap', project_details: 'CRM <test>' }
function fixture(overrides: Partial<Dependencies> = {}) {
  const writes: unknown[] = [], budgets: string[] = [], tokens: string[] = []
  const handler = createHandler({ secret: 'test-only', ipSalt: 'test-only-secret',
    takeBudget: async hash => { budgets.push(hash); return true },
    verify: async token => { tokens.push(token); return { success: true, hostname: 'novusolv.com', action: 'booking' } },
    insert: async (kind, data) => { writes.push({ kind, data }) }, ...overrides })
  const request = (body: unknown = { kind: 'booking', token: 'test-token', data: booking }, headers = {}) => new Request('https://test.invalid', { method: 'POST', headers: { Origin: 'https://novusolv.com', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers }, body: JSON.stringify(body) })
  return { handler, request, writes, budgets, tokens }
}

test('verified booking preserves qualification and drops internal fields', async () => {
  const f = fixture()
  assert.equal((await f.handler(f.request({ kind: 'booking', token: 'valid', data: { ...booking, is_deleted: true } }))).status, 201)
  assert.equal(f.writes.length, 1)
  assert.deepEqual(f.writes[0], {kind:'booking', data:{...booking, email:undefined}})
  assert.match(f.budgets[0], /^[a-f0-9]{64}$/)
})
test('missing, forged, expired, wrong-host and wrong-action tokens never insert', async () => {
  const missing = fixture(); assert.equal((await missing.handler(missing.request({kind:'booking',data:booking}))).status,400); assert.equal(missing.writes.length,0)
  for (const result of [{success:false}, {success:true,hostname:'attacker.invalid',action:'booking'}, {success:true,hostname:'novusolv.com',action:'newsletter'}]) {
    const f=fixture({verify:async()=>result}); assert.equal((await f.handler(f.request())).status,400); assert.equal(f.writes.length,0)
  }
})
test('IP limit precedes CAPTCHA; spoofable headers cannot change bucket', async () => {
  const f=fixture({takeBudget:async()=>false})
  const response=await f.handler(f.request(undefined,{'X-Forwarded-For':'203.0.113.1','X-Real-IP':'203.0.113.2'}))
  assert.equal(response.status,429); assert.equal(response.headers.get('Retry-After'),'600'); assert.equal(f.tokens.length,0); assert.equal(f.writes.length,0)
  assert.equal(clientIp(new Headers({'CF-Connecting-IP':'192.0.2.1','X-Forwarded-For':'203.0.113.9'})),'192.0.2.1')
  assert.throws(()=>clientIp(new Headers({'X-Forwarded-For':'203.0.113.9'})))
})
test('IPv6 /64, equivalent spellings and mapped IPv4 share stable keyed buckets', async()=> {
  assert.equal(ipNetwork('2001:0db8:0:0:0:0:0:1'),ipNetwork('2001:db8::ffff'))
  assert.equal(ipNetwork('::ffff:192.0.2.1'),'192.0.2.1')
  assert.equal(await hashIp('::ffff:c000:201','secret'),await hashIp('192.0.2.1','secret'))
  assert.notEqual(await hashIp('192.0.2.1','secret'),await hashIp('192.0.2.1','different'))
})
test('network/service failures fail closed without exposing details',async()=> {
  for (const overrides of [{secret:''},{takeBudget:async()=>{throw Error('secret')}},{verify:async()=>{throw Error('secret')}},{insert:async()=>{throw Error('secret')}}]) {
    const f=fixture(overrides); const r=await f.handler(f.request()); assert.equal(r.status,503); assert.equal((await r.text()).includes('secret'),false); assert.equal(f.writes.length,0)
  }
})
test('invalid origin, type, payload and size cannot reach insert',async()=> {
  const f=fixture()
  assert.equal((await f.handler(f.request(undefined,{Origin:'https://evil.invalid'}))).status,403)
  assert.equal((await f.handler(f.request(undefined,{'Content-Type':'text/plain'}))).status,415)
  for(const body of [null,[],{kind:'admin',token:'x',data:booking},{kind:'booking',token:'x',data:{...booking,phone:'bad'}},{kind:'booking',token:'x',data:{...booking,project_details:'x'.repeat(501)}},{kind:'booking',token:'x',data:{...booking,project_details:'x'.repeat(17000)}}]) assert.equal((await f.handler(f.request(body))).status,400)
  assert.equal(f.writes.length,0)
})
test('all three form contracts and sanitized database errors are supported',async()=> {
  for(const kind of ['newsletter','lead']) {
    const f=fixture({verify:async()=>({success:true,hostname:'www.novusolv.com',action:kind})})
    const r=await f.handler(f.request({kind,token:'valid',data:{name:'Test',email:' TEST@example.invalid ',source:'contact_form'}}))
    assert.equal(r.status,201); assert.equal(f.writes.length,1)
  }
  const f=fixture({insert:async()=>{throw {code:'PT429'}}})
  assert.equal((await f.handler(f.request())).status,429)
})
