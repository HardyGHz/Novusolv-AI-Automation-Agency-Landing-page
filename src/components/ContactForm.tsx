import { useState, FormEvent } from 'react'
import { ArrowRight, Check, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitLead } from '../lib/supabase'
import { useTranslation } from 'react-i18next'

interface ContactFormProps {
  source?: string
  onClose?: () => void
  isModal?: boolean
}

export default function ContactForm({ source = 'contact_form', onClose, isModal = false }: ContactFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setErrorMsg(t('contact_form.error_email'))
      return
    }

    setStatus('loading')
    try {
      await submitLead({ name, email, message, source })
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(t('contact_form.error_general'))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-[520px] mx-auto ${isModal ? 'bg-white rounded-3xl shadow-2xl p-8 relative' : ''}`}
    >
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      )}

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className={`text-[24px] font-bold ${isModal ? 'text-heading' : 'text-white'}`}>
              {t('contact_form.success_title')}
            </h3>
            <p className={`text-center ${isModal ? 'text-body' : 'text-white/70'}`}>
              {t('contact_form.success_desc')}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {isModal && (
              <div className="mb-2">
                <h3 className="text-[24px] font-bold text-heading">{t('contact_form.book_audit_title')}</h3>
                <p className="text-body text-[14px]">{t('contact_form.book_audit_desc')}</p>
              </div>
            )}

            <div className="flex gap-3 max-sm:flex-col">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('contact_form.placeholder_name')}
                required
                className={`flex-1 px-4 py-3 rounded-xl text-[14px] outline-none transition-all ${
                  isModal
                    ? 'bg-gray-100 border border-gray-200 focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/20 text-heading'
                    : 'bg-white/10 border border-white/20 focus:border-[#E8630A] text-white placeholder:text-white/50'
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('contact_form.placeholder_email')}
                required
                className={`flex-1 px-4 py-3 rounded-xl text-[14px] outline-none transition-all ${
                  isModal
                    ? 'bg-gray-100 border border-gray-200 focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/20 text-heading'
                    : 'bg-white/10 border border-white/20 focus:border-[#E8630A] text-white placeholder:text-white/50'
                }`}
              />
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('contact_form.placeholder_message')}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl text-[14px] outline-none resize-none transition-all ${
                isModal
                  ? 'bg-gray-100 border border-gray-200 focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/20 text-heading'
                  : 'bg-white/10 border border-white/20 focus:border-[#E8630A] text-white placeholder:text-white/50'
              }`}
            />

            {status === 'error' && (
              <p className="text-red-400 text-[13px]">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="font-semibold flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-6 h-[48px] rounded-xl transition-all shadow-lg shadow-[#E8630A]/20 hover:shadow-[#E8630A]/40 group disabled:opacity-60 disabled:cursor-not-allowed text-[15px]"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {t('contact_form.btn_send')}
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
