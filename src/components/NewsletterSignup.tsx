import { useState, FormEvent } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeNewsletter } from '../lib/supabase'
import { useTranslation } from 'react-i18next'

export default function NewsletterSignup() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setErrorMsg(t('newsletter.error_email'))
      return
    }

    setStatus('loading')
    try {
      await subscribeNewsletter(email)
      setStatus('success')
      setEmail('')
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err?.message || t('newsletter.error_general'))
    }
  }

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 justify-center py-3"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={16} className="text-green-400" />
            </div>
            <p className="text-white font-medium text-[14px]">{t('newsletter.success')}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex gap-2 max-sm:flex-col"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              required
              className="flex-1 px-4 py-3 rounded-xl text-[14px] bg-white/10 border border-white/20 focus:border-[#FFC300] text-white placeholder:text-white/50 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="font-semibold flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#FFC300] to-[#FFD60A] text-[#000814] hover:from-[#E5AF00] hover:to-[#E5C009] py-3 px-5 rounded-xl transition-all shadow-md shadow-[#FFC300]/20 group disabled:opacity-60 text-[14px] whitespace-nowrap"
            >
              {status === 'loading' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {t('newsletter.btn')}
                  <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === 'error' && (
        <p className="text-red-400 text-[12px] mt-2 text-center">{errorMsg}</p>
      )}
    </div>
  )
}
