import { FormEvent, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Clock3, Globe2, Layers3, Loader2, MessageCircle, Megaphone, Sparkles, Workflow } from 'lucide-react'
import { FORM_LIMITS, TIMELINE_OPTIONS } from '../lib/submissionValidation'
import { submitBookCall } from '../lib/supabase'
import { getStoredUtms } from '../lib/utm'
import { trackPixelEvent } from '../lib/analytics'
import { submissionErrorKey } from '../lib/botProtection'
import TurnstileChallenge from '../components/TurnstileChallenge'
import '../pages/welcome.css'

const services = [
  { id: 'marketing', icon: Megaphone, label: 'Marketing și atragere de clienți' },
  { id: 'website', icon: Globe2, label: 'Creare sau modernizare website' },
  { id: 'automation', icon: Workflow, label: 'Automatizarea proceselor' },
  { id: 'leads', icon: Layers3, label: 'Gestionarea leadurilor' },
  { id: 'communication', icon: MessageCircle, label: 'Comunicare cu clienții' },
  { id: 'guidance', icon: Sparkles, label: 'Ajutor în alegerea direcției' },
] as const
type ServiceId = typeof services[number]['id']

export default function BookingFlow({ embedded = false, source = 'welcome_page' }: { embedded?: boolean; source?: string }) {
  const { t, i18n } = useTranslation()
  const reduced = useReducedMotion()
  // Local interaction preview only: no CAPTCHA and no external submission.
  const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === '1'
  const video = useRef<HTMLVideoElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const sending = useRef(false)
  const focusNext = useRef(false)
  const [step, setStep] = useState(0)
  const [selectedServices, setSelectedServices] = useState<ServiceId[]>([])
  const [timeline, setTimeline] = useState('')
  const [contact, setContact] = useState({ name: '', company: '', phone: '', email: '' })
  const [trap, setTrap] = useState('')
  const [token, setToken] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [videoFailed, setVideoFailed] = useState(false)
  const [logoSettled, setLogoSettled] = useState(false)
  useEffect(() => {
    if (embedded) return
    const previous = document.title
    document.title = t('welcome.page_title')
    return () => { document.title = previous }
  }, [t, embedded])
  useEffect(() => {
    if (reduced) video.current?.pause()
    else void video.current?.play().catch(() => setVideoFailed(true))
  }, [reduced, status])
  useEffect(() => { if (status === 'success' && !embedded) window.scrollTo({top:0, behavior:'instant'}) }, [status, embedded])
  function go(next: number) {
    setStep(next); setStatus('idle'); setError('')
    if (next !== 2) { setToken(''); setAttempt(n => n + 1) }
    focusNext.current = true
  }
  async function submit(e: FormEvent) {
    e.preventDefault()
    if (sending.current) return
    if (trap) { setStatus('success'); return }
    if ((!preview && !token) || selectedServices.length === 0 || !timeline) return
    const digits = contact.phone.replace(/\D/g, '')
    if (!/^[+0-9 ().-]{6,40}$/.test(contact.phone.trim()) || digits.length < 6 || digits.length > 20) { setStatus('error'); setError(t('book_call_form.error_phone')); return }
    if (preview) { setStatus('success'); focusNext.current = true; return }
    sending.current = true; setStatus('loading')
    try {
      await submitBookCall({ ...contact, email: contact.email || undefined, project_details: `Servicii solicitate: ${services.filter(service => selectedServices.includes(service.id)).map(service => service.label).join('; ')}`, timeline, requested_services: selectedServices, source, ...getStoredUtms() }, token)
      setStatus('success'); trackPixelEvent('Lead', { source })
    } catch (err) { setStatus('error'); setError(t(submissionErrorKey(err, 'book_call_form.error_general'))) }
    finally { sending.current = false; setToken(''); setAttempt(n => n + 1) }
  }
  const steps = [t('welcome.need'), t('welcome.timing'), t('book_call_form.step_contact')]
  const success = status === 'success'
  const Root = embedded ? 'section' : 'main'
  const Heading = embedded ? 'h3' : 'h1'
  return (
    <Root className={`nv-welcome ${embedded ? 'nv-embedded' : ''}`} aria-label={embedded ? t('welcome.question_0') : undefined}>
      {!embedded && <header className="nv-top">
        <Link to="/" className="nv-header-back"><ArrowLeft size={16}/>{t('welcome.back')}</Link>
        <nav aria-label={t('welcome.language')} className="nv-languages">{['ro', 'hu', 'en'].map(lang => <button key={lang} type="button" aria-pressed={i18n.language.startsWith(lang)} onClick={() => void i18n.changeLanguage(lang)}>{lang}</button>)}</nav>
      </header>}
      {success && <section className={`nv-logo-hero ${logoSettled ? 'is-settled' : ''}`} aria-label="Novusolv">
        {reduced || videoFailed ? <img src="/logo-white.png" alt="Novusolv" /> : <video ref={video} src="/novusolv-logo-hero.mp4" muted playsInline autoPlay preload="auto" onEnded={() => setLogoSettled(true)} onError={() => setVideoFailed(true)} aria-label={t('welcome.animation')} />}
      </section>}
      <div className="nv-sr" role="progressbar" aria-label={t('welcome.progress')} aria-valuemin={0} aria-valuemax={3} aria-valuenow={success ? 3 : step + 1} />
      <div className={`nv-body ${success ? 'nv-body-success' : ''}`}>
        {preview && <p className="nv-preview-note">{t('welcome.preview_note')}</p>}
        {!success && <div className="nv-stepbar"><span>{success ? '✓' : `0${step + 1}`} <span className="nv-muted">/ 03</span></span><span>{steps[step]}</span></div>}
        <AnimatePresence mode="wait" initial={false}>
          <motion.section key={success ? 'success' : step} initial={reduced ? false : {opacity:0, y:12}} animate={{opacity:1,y:0}} exit={reduced ? undefined : {opacity:0,y:-8}} transition={{duration:.16}} className="nv-stage">
            <Heading ref={node => { title.current = node; if (node && focusNext.current) { focusNext.current = false; node.focus({preventScroll:true}); if (!success) node.scrollIntoView({block:"nearest", behavior:"instant"}) } }} tabIndex={-1}>{success ? t('welcome.sent') : t(`welcome.question_${step}`)}</Heading>
            <p className="nv-intro">{success ? t('welcome.sent_description') : t(`welcome.hint_${step}`)}</p>
            {success ? <Link className="nv-continue nv-success-link" to="/">{t('welcome.back')}<ArrowUpRight size={20}/></Link> : <>
              {step === 0 && <fieldset className="nv-options"><legend className="nv-sr">{t('welcome.question_0')}</legend>{services.map(service => {const Icon = service.icon; const selected = selectedServices.includes(service.id); return <button type="button" role="checkbox" aria-checked={selected} className={`nv-choice ${selected ? 'is-selected' : ''}`} key={service.id} onClick={() => setSelectedServices(current => selected ? current.filter(id => id !== service.id) : [...current, service.id])}>
                <Icon className="nv-choice-icon" size={23} strokeWidth={1.4}/><span>{t(`welcome.service_${service.id}`)}</span><span className={`nv-choice-check nv-multicheck ${selected ? 'is-checked' : ''}`}>{selected && <Check size={15}/>}</span>
              </button>})}</fieldset>}
              {step === 1 && <fieldset className="nv-options nv-timing"><legend className="nv-sr">{t('welcome.question_1')}</legend>{TIMELINE_OPTIONS.map((opt,i) => <button type="button" aria-pressed={timeline === opt} className={`nv-choice ${timeline === opt ? 'is-selected' : ''}`} key={opt} onClick={() => { setTimeline(opt); go(2) }}>
                <Clock3 className="nv-choice-icon" size={23} strokeWidth={1.4}/><span>{t(`book_call_form.timeline_${opt}`)}<small>{t(`welcome.timing_${i}`)}</small></span><span className="nv-choice-check">{timeline === opt ? <Check size={15}/> : <ChevronRight size={15}/>}</span>
              </button>)}</fieldset>}
              {step === 2 && <form id="welcome-contact" onSubmit={submit} className="nv-contact" aria-busy={status === 'loading'}>
                <div hidden aria-hidden="true"><label>Website<input value={trap} onChange={e => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
                {(['name','company','phone','email'] as const).map(field => <label key={field}>{t(`book_call_form.label_${field}`)}{field !== 'email' && ' *'}<input name={field} autoComplete={{name:'name',company:'organization',phone:'tel',email:'email'}[field]} type={field === 'phone' ? 'tel' : field === 'email' ? 'email' : 'text'} value={contact[field]} required={field !== 'email'} maxLength={FORM_LIMITS[field]} minLength={field === 'phone' ? 6 : 1} onChange={e => setContact({...contact,[field]:e.target.value})} disabled={status === 'loading'} /></label>)}
                <p className="nv-privacy">{t('book_call_form.privacy_note')} <Link to="/privacy" target="_blank">{t('book_call_form.privacy_link')}</Link></p>
                {!preview && <div className="nv-captcha"><TurnstileChallenge key={attempt} action="booking" onToken={setToken}/></div>}
                {status === 'error' && <p className="nv-error" role="alert">{error}</p>}
              </form>}
              <div className="nv-actions">
                {step > 0 ? <button type="button" className="nv-back" disabled={status === 'loading'} onClick={() => go(step - 1)}><ArrowLeft size={17}/>{t('book_call_form.back')}</button> : <span className="nv-note">{t('welcome.no_commitment')}</span>}
                {step === 0 && <button type="button" className="nv-continue" disabled={selectedServices.length === 0} onClick={() => go(1)}>{t('welcome.continue')}<ArrowUpRight size={20}/></button>}
                {step === 2 && <button className="nv-continue" type="submit" form="welcome-contact" disabled={(!preview && !token) || status === 'loading'}>{status === 'loading' ? <Loader2 className="nv-spin" size={20}/> : <>{t('book_call_form.btn_submit')}<ArrowUpRight size={20}/></>}</button>}
              </div>
            </>}
          </motion.section>
        </AnimatePresence>
      </div>
      {!embedded && <footer className="nv-bottom"><Link to="/">{t('welcome.back')}<ArrowUpRight size={14}/></Link><span>Novusolv · {new Date().getFullYear()}</span></footer>}
    </Root>
  )
}
