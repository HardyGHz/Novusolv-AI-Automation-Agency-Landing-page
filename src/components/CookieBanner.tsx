import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { COOKIE_KEY, initMetaPixel } from '../lib/analytics'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) {
      // Small delay so it doesn't flash on first render
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setVisible(false)
    // Fire up the Meta Pixel immediately after consent (no reload needed)
    initMetaPixel()
  }

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-[680px]"
        >
          <div className="bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
            <div className="flex items-start gap-4">
              {/* Cookie icon */}
              <div className="text-3xl shrink-0">🍪</div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-[15px] leading-[160%]">
                  {t('cookie.text')}{' '}
                  <a href="/privacy" className="text-[#E8630A] hover:text-[#FF8C2A] underline underline-offset-2 transition-colors">
                    {t('cookie.privacy_link')}
                  </a>.
                </p>
              </div>
            </div>

            {/* Buttons — equal size/weight so accept and decline are equally easy choices */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={decline}
                className="px-6 py-3 text-[14px] font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                {t('cookie.decline')}
              </button>
              <button
                onClick={accept}
                className="px-6 py-3 text-[14px] font-semibold bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] hover:from-[#D05A09] hover:to-[#E87020] text-[#000814] rounded-xl transition-all cursor-pointer shadow-md shadow-[#E8630A]/20"
              >
                {t('cookie.accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
