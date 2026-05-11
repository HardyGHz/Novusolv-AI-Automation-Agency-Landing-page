import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const COOKIE_KEY = 'novusolv_cookie_consent'

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
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-[580px]"
        >
          <div className="bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Cookie icon */}
            <div className="text-2xl shrink-0">🍪</div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] leading-[160%]">
                {t('cookie.text')}{' '}
                <a href="/privacy" className="text-[#FFC300] hover:text-[#FFD60A] underline underline-offset-2 transition-colors">
                  {t('cookie.privacy_link')}
                </a>.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={decline}
                className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white/90 transition-colors cursor-pointer"
              >
                {t('cookie.decline')}
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 text-[13px] font-semibold bg-gradient-to-r from-[#FFC300] to-[#FFD60A] hover:from-[#E5AF00] hover:to-[#E5C009] text-[#000814] rounded-xl transition-all cursor-pointer shadow-md shadow-[#FFC300]/20"
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
