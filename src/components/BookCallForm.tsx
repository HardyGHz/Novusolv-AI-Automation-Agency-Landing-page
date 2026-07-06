import { useState, FormEvent } from 'react'
import { ArrowRight, Check, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitBookCall } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import { getStoredUtms } from '../lib/utm'
import { trackPixelEvent } from '../lib/analytics'

interface BookCallFormProps {
  onClose?: () => void
  /** Attribution tag stored with the lead. */
  source?: string
  /** When false, renders inline (no fixed overlay/backdrop). Default true. */
  isModal?: boolean
}

const PROBLEM_OPTIONS = [
  'problem_lost_leads',
  'problem_slow_reply',
  'problem_manual_work',
  'problem_weak_website',
  'problem_scattered',
  'problem_unsure',
] as const

export default function BookCallForm({ onClose, source = 'book_call_modal', isModal = true }: BookCallFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [problem, setProblem] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !company.trim() || !phone.trim() || !problem) return

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setStatus('error')
        setErrorMsg(t('book_call_form.error_email'))
        return
      }
    }

    setStatus('loading')
    try {
      await submitBookCall({
        name,
        company,
        phone,
        email: email || undefined,
        main_problem: problem,
        source,
        ...getStoredUtms(),
      })
      setStatus('success')
      trackPixelEvent('Lead', { source })
    } catch {
      setStatus('error')
      setErrorMsg(t('book_call_form.error_general'))
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl text-[14px] bg-gray-50 border border-gray-200 focus:border-[#E8630A] focus:bg-white text-heading placeholder:text-gray-400 outline-none transition-all'

  // ─── Shared inner content (success state + form) ──────────────────────────
  const inner = (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-[24px] font-bold text-heading">{t('book_call_form.success_title')}</h3>
          <p className="text-body">{t('book_call_form.success_desc')}</p>
        </motion.div>
      ) : (
        <motion.div key="form" className="flex flex-col gap-5">
          <div>
            <h3 className="text-[22px] font-bold text-heading">{t('book_call_form.title')}</h3>
            <p className="text-body text-[14px] mt-1">{t('book_call_form.desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('book_call_form.placeholder_name')}
              required
              className={inputClass}
            />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t('book_call_form.placeholder_company')}
              required
              className={inputClass}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('book_call_form.placeholder_phone')}
              required
              className={inputClass}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('book_call_form.placeholder_email')}
              className={inputClass}
            />
            <select
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
              aria-label={t('book_call_form.label_problem')}
              className={`${inputClass} cursor-pointer ${problem ? 'text-heading' : 'text-gray-400'}`}
            >
              <option value="" disabled>
                {t('book_call_form.label_problem')}
              </option>
              {PROBLEM_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-heading">
                  {t(`book_call_form.${opt}`)}
                </option>
              ))}
            </select>

            {status === 'error' && (
              <p className="text-red-500 text-[12px]">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-1 font-semibold flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-6 rounded-xl transition-all shadow-lg shadow-[#E8630A]/20 hover:shadow-[#E8630A]/40 group disabled:opacity-60 text-[14px]"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {t('book_call_form.btn_submit')}
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
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[420px] p-8 flex flex-col gap-5"
      >
        {/* Close */}
        {onClose && (
          <button
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
