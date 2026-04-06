import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Menu, X, Globe, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import BookCallForm from './BookCallForm'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggle: toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [showBookCall, setShowBookCall] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'ro' : 'en'
    i18n.changeLanguage(newLang)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 80)
      // Hide when scrolling down past hero, show when scrolling up
      if (currentY > 200) {
        setHidden(currentY > lastScrollY.current)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
    <nav
      className={`
        fixed z-[100] top-0 left-0 w-full transition-all duration-300 ease-out items-center flex max-sm:py-4 shrink-0
        ${scrolled
          ? `py-1 min-h-[72px] ${theme === 'dark' ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/10' : 'bg-white/80 backdrop-blur-[80px]'}`
          : 'py-5 min-h-[72px] bg-transparent'
        }
        ${hidden ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      <div className="container flex justify-between items-center">
        {/* Logo — bigger */}
        <div className="w-[30%] max-sm:w-auto">
          <a href="/" aria-label="Novusolv Home" className="relative flex items-center gap-2">
            <img
              src={theme === 'light' ? "/logo-black.png" : "/logo-white.png"}
              alt="Novusolv Logo"
              className="h-28 max-sm:h-25 w-auto object-contain transition-all duration-300"
            />
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className={`px-5 py-[10px] rounded-2xl max-sm:hidden transition-all duration-300 ${
          scrolled
            ? (theme === 'dark' ? 'bg-gray-800/80 border border-white/10' : 'bg-gray-100/80')
            : 'bg-black/20 backdrop-blur-md border border-white/5'
        }`}>
          <ul className="flex gap-8 items-center">
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`text-[14px] leading-[150%] opacity-90 hover:opacity-100 cursor-pointer flex items-center gap-1 font-semibold transition-all ${scrolled ? 'text-heading' : 'text-white'}`}
              >
                {t('nav.services')} <ChevronDown size={14} className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full mt-2 left-0 rounded-2xl shadow-xl border py-2 min-w-[220px] z-50 transition-colors ${
                      theme === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100'
                    }`}
                  >
                    {[
                      { href: '/#custom-models', label: t('nav.custom_models') },
                      { href: '/#workflow-automation', label: t('nav.workflow') },
                      { href: '/#customer-support', label: t('nav.customer_support') },
                      { href: '/#data-insights', label: t('nav.data_insights') },
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setServicesOpen(false)}
                        className={`block px-4 py-2.5 text-sm transition-colors font-medium ${
                          theme === 'dark' ? 'hover:bg-white/5 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
            <li>
              <a
                href="/#results"
                className={`text-[14px] leading-[150%] opacity-70 hover:opacity-100 font-medium cursor-pointer transition-opacity ${scrolled ? 'text-heading' : 'text-white'}`}
              >
                {t('nav.case_studies')}
              </a>
            </li>
            <li>
              <a
                href="/#faq"
                className={`text-[14px] leading-[150%] opacity-70 hover:opacity-100 font-medium cursor-pointer transition-opacity ${scrolled ? 'text-heading' : 'text-white'}`}
              >
                {t('nav.faq')}
              </a>
            </li>
          </ul>
        </nav>

          {/* Lang, Theme & CTA Button */}
          <div className="max-sm:hidden flex items-center gap-3 justify-end w-[30%]">
            <button 
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 text-[13px] font-medium opacity-80 hover:opacity-100 transition-opacity ${scrolled ? 'text-heading' : 'text-white'}`}
            >
              <Globe size={14} />
              {i18n.language.startsWith('en') ? 'EN' : 'RO'}
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110 ${
                scrolled
                  ? (theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-heading')
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setShowBookCall(true)}
              className="font-medium flex items-center justify-center cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 py-2.5 px-5 h-[42px] rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              <span className="text-[14px] leading-[150%]">{t('nav.book_call')}</span>
            </button>
          </div>

        {/* Mobile menu toggle */}
        <button
          className={`hidden max-sm:flex items-center justify-center w-[32px] h-[32px] rounded-lg ${scrolled ? 'bg-gray-100' : 'bg-white/10 backdrop-blur-[80px]'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={16} className={scrolled ? '' : 'text-white'} /> : <Menu size={16} className={scrolled ? '' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`sm:hidden absolute top-full left-0 w-full shadow-lg border-t z-50 transition-colors rounded-b-2xl overflow-hidden ${
              theme === 'dark' ? 'bg-gray-950 border-white/10' : 'bg-white border-gray-100'
            }`}
          >
            <div className="container py-4 flex flex-col gap-4">
              <a href="/#custom-models" className={`text-[15px] font-medium py-3 border-b border-gray-100/10 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t('nav.services')}</a>
              <a href="/#results" className={`text-[15px] font-medium py-3 border-b border-gray-100/10 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t('nav.case_studies')}</a>
              <a href="/#faq" className={`text-[15px] font-medium py-3 border-b border-gray-100/10 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t('nav.faq')}</a>
              
              <div className="flex items-center justify-between py-2 border-t border-gray-100 mt-2 pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-medium text-gray-500">Language</span>
                  <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Globe size={14} />
                    {i18n.language.startsWith('en') ? 'English' : 'Română'}
                  </button>
                </div>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-heading transition-colors"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>

              <button
                onClick={() => { setShowBookCall(true); setMobileMenuOpen(false) }}
                className="font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 px-5 h-[42px] rounded-xl text-[14px] w-full cursor-pointer"
              >
                {t('nav.book_call')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    {/* Mobile menu backdrop — tap outside to close */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </AnimatePresence>

    {/* Book a Call Modal */}
    <AnimatePresence>
      {showBookCall && (
        <BookCallForm onClose={() => setShowBookCall(false)} />
      )}
    </AnimatePresence>
  </>
  )
}
