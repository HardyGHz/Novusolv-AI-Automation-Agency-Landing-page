import { useState, FormEvent } from 'react'
import { ArrowRight, Check, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitLead } from '../lib/supabase'

interface ContactFormProps {
  source?: string
  onClose?: () => void
  isModal?: boolean
}

export default function ContactForm({ source = 'contact_form', onClose, isModal = false }: ContactFormProps) {
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
      setErrorMsg('Please enter a valid email address.')
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
      setErrorMsg(err?.message || 'Something went wrong. Please try again.')
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
              Thank you!
            </h3>
            <p className={`text-center ${isModal ? 'text-body' : 'text-white/70'}`}>
              We'll get back to you within 24 hours. Get ready to automate!
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
                <h3 className="text-[24px] font-bold text-heading">Book a Free Audit</h3>
                <p className="text-body text-[14px]">Tell us about your business and we'll show you what AI can do.</p>
              </div>
            )}

            <div className="flex gap-3 max-sm:flex-col">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className={`flex-1 px-4 py-3 rounded-xl text-[14px] outline-none transition-all ${
                  isModal
                    ? 'bg-gray-100 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-heading'
                    : 'bg-white/10 border border-white/20 focus:border-purple-400 text-white placeholder:text-white/50'
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className={`flex-1 px-4 py-3 rounded-xl text-[14px] outline-none transition-all ${
                  isModal
                    ? 'bg-gray-100 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-heading'
                    : 'bg-white/10 border border-white/20 focus:border-purple-400 text-white placeholder:text-white/50'
                }`}
              />
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your business and what you'd like to automate..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl text-[14px] outline-none resize-none transition-all ${
                isModal
                  ? 'bg-gray-100 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-heading'
                  : 'bg-white/10 border border-white/20 focus:border-purple-400 text-white placeholder:text-white/50'
              }`}
            />

            {status === 'error' && (
              <p className="text-red-400 text-[13px]">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="font-semibold flex items-center justify-center cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 py-3 px-6 h-[48px] rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 group disabled:opacity-60 disabled:cursor-not-allowed text-[15px]"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Send Message
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
