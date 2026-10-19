import { useEffect, useId, useRef, useState, FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitBookCall } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import { getStoredUtms } from '../lib/utm'
import { trackPixelEvent } from '../lib/analytics'
import { FORM_LIMITS, PROBLEM_OPTIONS, TIMELINE_OPTIONS, isRateLimited } from '../lib/submissionValidation'

interface BookCallFormProps {
  onClose?: () => void
  /** Attribution tag stored with the lead. */
  source?: string
  /** When false, renders inline (no fixed overlay/backdrop). Default true. */
  isModal?: boolean
}

export default function BookCallForm({ onClose, source = 'book_call_modal', isModal = true }: BookCallFormProps) {
  const { t } = useTranslation()
  const id = useId()
  const sending = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const [step, setStep] = useState(1)
  const [timeline, setTimeline] = useState('')
  const [details, setDetails] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [problem, setProblem] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    if (!isModal) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = () => Array.from(modalRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not([tabindex="-1"]), select, textarea, a[href]') ?? []).filter(el => el.getClientRects().length > 0)
    focusable()[0]?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !sending.current) { event.preventDefault(); closeRef.current?.() }
      if (event.key !== 'Tab') return
      const elements = focusable()
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (!first) { event.preventDefault(); return }
      if (event.shiftKey && (document.activeElement === first || !modalRef.current?.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !modalRef.current?.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow; previousFocus?.focus() }
  }, [isModal])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending.current) return
    if (step === 1) {
      if (problem) {
        setStep(2)
        requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus())
      }
      return
    }
    if (website) { setStatus('success'); return }
    if (!name.trim() || !company.trim() || !phone.trim() || !problem) return
    const digits = phone.replace(/\D/g, '')
    if (!/^[+0-9 ().-]{6,40}$/.test(phone.trim()) || digits.length < 6 || digits.length > 20) {
      setStatus('error')
      setErrorMsg(t('book_call_form.error_phone'))
      formRef.current?.querySelector<HTMLInputElement>('input[type="tel"]')?.focus()
      return
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        setStatus('error')
        setErrorMsg(t('book_call_form.error_email'))
        return
      }
    }

    setStatus('loading')
    sending.current = true
    try {
      await submitBookCall({
        name,
        company,
        phone,
        email: email || undefined,
        main_problem: problem,
        timeline: timeline || undefined,
        project_details: details || undefined,
        source,
        ...getStoredUtms(),
      })
      setStatus('success')
      trackPixelEvent('Lead', { source })
    } catch (error) {
      setStatus('error')
      setErrorMsg(t(isRateLimited(error) ? 'security.rate_limit' : 'book_call_form.error_general'))
    } finally {
      sending.current = false
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl text-[14px] bg-gray-50 border border-gray-200 focus:border-[#E8630A] focus:bg-white text-heading placeholder:text-gray-400 outline-none transition-all'

  // ─── Shared inner content (success state + form) ──────────────────────────
  const inner = (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          role="status"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 id={`${id}-title`} className="text-[24px] font-bold text-heading">{t('book_call_form.success_title')}</h3>
          <p className="text-body">{t('book_call_form.success_desc')}</p>
        </motion.div>
      ) : (
        <motion.div key="form" className="flex flex-col gap-5">
          <div>
            <h3 id={`${id}-title`} className="text-[22px] font-bold text-heading">{t('book_call_form.title')}</h3>
            <p className="text-body text-[14px] mt-1">{t('book_call_form.desc')}</p>
          </div>

          <ol className="flex gap-3 text-[12px]">
            {[1, 2].map(n => <li key={n} aria-current={step === n ? 'step' : undefined} className={`flex-1 border-t-2 pt-2 ${step === n ? 'border-[#E8630A] text-heading font-semibold' : 'border-gray-200 text-body'}`}>{n}/2 · {t(`book_call_form.step_${n === 1 ? 'problem' : 'contact'}`)}</li>)}
          </ol>
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3" aria-busy={status === 'loading'}>
            <div className="hidden" aria-hidden="true">
              <label>Website<input name="website_url" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></label>
            </div>
            {step === 1 ? <>
              <label className="text-[13px] font-medium text-heading" htmlFor={`${id}-problem`}>{t('book_call_form.label_problem')}</label>
              <select id={`${id}-problem`} name="main_problem" value={problem} onChange={e => setProblem(e.target.value)} required className={inputClass}>
                <option value="" disabled>{t('book_call_form.problem_placeholder')}</option>
                {PROBLEM_OPTIONS.map(opt => <option key={opt} value={opt}>{t(`book_call_form.${opt}`)}</option>)}
              </select>
              <label className="text-[13px] font-medium text-heading" htmlFor={`${id}-timeline`}>{t('book_call_form.label_timeline')}</label>
              <select id={`${id}-timeline`} name="timeline" value={timeline} onChange={e => setTimeline(e.target.value)} className={inputClass}>
                <option value="">{t('book_call_form.timeline_placeholder')}</option>
                {TIMELINE_OPTIONS.map(opt => <option key={opt} value={opt}>{t(`book_call_form.timeline_${opt}`)}</option>)}
              </select>
              <label className="text-[13px] font-medium text-heading" htmlFor={`${id}-details`}>{t('book_call_form.label_details')}</label>
              <textarea id={`${id}-details`} name="project_details" value={details} onChange={e => setDetails(e.target.value)} maxLength={FORM_LIMITS.details} rows={3} placeholder={t('book_call_form.details_placeholder')} aria-describedby={`${id}-hint`} className={`${inputClass} resize-y`} />
              <p id={`${id}-hint`} className="text-body text-[12px]">{t('book_call_form.details_hint')} <span className="whitespace-nowrap">{details.length}/{FORM_LIMITS.details}</span></p>
            </> : <>
            <p className="text-body text-[13px]">{t('book_call_form.contact_hint')}</p>
            <label htmlFor={`${id}-name`} className="text-heading text-[13px]">{t('book_call_form.label_name')} *</label>
            <input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              type="text"
              maxLength={FORM_LIMITS.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('book_call_form.placeholder_name')}
              required
              className={inputClass}
            />
            <label htmlFor={`${id}-company`} className="text-heading text-[13px]">{t('book_call_form.label_company')} *</label>
            <input
              id={`${id}-company`}
              autoComplete="organization"
              type="text"
              value={company}
              maxLength={FORM_LIMITS.company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t('book_call_form.placeholder_company')}
              required
              className={inputClass}
            />
            <label htmlFor={`${id}-phone`} className="text-heading text-[13px]">{t('book_call_form.label_phone')} *</label>
            <input
              id={`${id}-phone`}
              autoComplete="tel"
              type="tel"
              maxLength={FORM_LIMITS.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('book_call_form.placeholder_phone')}
              required
              className={inputClass}
            />
            <label htmlFor={`${id}-email`} className="text-heading text-[13px]">{t('book_call_form.label_email')}</label>
            <input
              id={`${id}-email`}
              autoComplete="email"
              type="email"
              maxLength={FORM_LIMITS.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('book_call_form.placeholder_email')}
              className={inputClass}
            />
            <p className="text-body text-[12px]">{t('book_call_form.privacy_note')} <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">{t('book_call_form.privacy_link')}</a></p>
            </>}

            {status === 'error' && (
              <p role="alert" className="text-red-500 text-[12px]">{errorMsg}</p>
            )}

            {step === 2 && <button type="button" disabled={status === 'loading'} onClick={() => { setStep(1); setStatus('idle'); requestAnimationFrame(() => formRef.current?.querySelector<HTMLSelectElement>('select')?.focus()) }} className="flex items-center gap-1 text-body text-[13px] cursor-pointer"><ArrowLeft size={16} />{t('book_call_form.back')}</button>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-1 font-semibold flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-6 rounded-xl transition-all shadow-lg shadow-[#E8630A]/20 hover:shadow-[#E8630A]/40 group disabled:opacity-60 text-[14px]"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {t(step === 1 ? 'book_call_form.next' : 'book_call_form.btn_submit')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ─── Inline variant (e.g. embedded in Footer) ─────────────────────────────
  if (!isModal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[520px] mx-auto bg-white rounded-3xl shadow-2xl p-8"
      >
        {inner}
      </motion.div>
    )
  }

  // ─── Modal variant (default) ──────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => { if (!sending.current) onClose?.() }}
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[480px] max-h-[90dvh] overflow-y-auto overscroll-contain p-6 sm:p-8 flex flex-col gap-5"
      >
        {/* Close */}
        {onClose && (
          <button
            aria-label={t('book_call_form.close')}
            disabled={status === 'loading'}
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X size={14} className="text-gray-500" />
          </button>
        )}

        {inner}
      </motion.div>
    </div>
  )
}
