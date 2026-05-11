import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ContactForm from './ContactForm'
import NewsletterSignup from './NewsletterSignup'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const bgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const rect = bgRef.current.parentElement?.getBoundingClientRect()
        if (rect) {
          const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
          const translateY = Math.max(-80, Math.min(0, (scrollProgress - 0.3) * -120))
          bgRef.current.style.transform = `translateY(${translateY}px) scale(1.15)`
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <footer id="contact" className="flex flex-col justify-between pt-20 max-w-[1920px] mx-auto overflow-hidden relative max-h-full min-h-[1100px] 2xl:min-h-[1300px] max-sm:min-h-[1000px]">
      {/* Parallax Background Image */}
      <img
        ref={bgRef}
        src="/footer-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: 'translateY(0) scale(1.15)' }}
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#000814]/90 via-[#001D3D]/80 to-[#000814]/90" />

      {/* CTA + Contact Form Section */}
      <div className="container relative z-[2] flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-10 w-full items-center py-16"
        >
          <div className="flex flex-col gap-4 text-center max-sm:px-4">
            <p className="text-[#FFC300] font-semibold text-[14px] uppercase tracking-wider">{t('footer.ready')}</p>
            <h2 className="text-[48px] leading-[115%] max-sm:text-[32px] font-bold text-white">
              {t('footer.title_1')}
              <br />
              <span className="bg-gradient-to-r from-[#FFC300] via-[#FFD60A] to-[#FFC300] bg-clip-text text-transparent">
                {t('footer.title_2_gradient')}
              </span>
            </h2>
            <p className="text-[16px] leading-[150%] text-white/70 max-w-[500px] mx-auto">
              {t('footer.desc')}
            </p>
          </div>

          {/* Inline Contact Form */}
          <ContactForm source="footer_cta" />

          {/* Newsletter */}
          <div className="flex flex-col items-center gap-3 mt-4 w-full">
            <div className="w-16 h-px bg-white/10" />
            <p className="text-white/50 text-[13px]">{t('footer.stay_in_loop')}</p>
            <NewsletterSignup />
          </div>
        </motion.div>
      </div>

      {/* Footer bottom */}
      <div className="container relative z-[2]">
        <div className="py-6 flex max-sm:flex-col max-sm:gap-4 justify-between items-center border-t border-white/10">
          {/* Logo */}
          <a href="/" className="flex items-center cursor-pointer">
            <img src="/logo-white.png" alt="Novusolv Logo" className="h-24 w-auto object-contain" />
          </a>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <ul className="flex gap-4 items-center text-white/60">
              <li>
                <a href="https://www.linkedin.com/company/novusolv" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140Z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://x.com/novusolv" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter/X">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29Z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/novusolv/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4 text-white/50 text-[13px]">
            <a href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <span>{t('footer.copyright')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
