import { useState, useEffect } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`
        ${scrolled ? 'fixed z-[100] top-0 bg-white/80 backdrop-blur-[80px] py-1 min-h-[72px]' : 'absolute py-5 min-h-[72px]'}
        top-0 left-0 w-full transition-all duration-400 items-center flex ease-out max-sm:py-4 shrink-0 z-[2]
      `}
    >
      <div className="container flex justify-between items-center">
        {/* Logo — bigger */}
        <div className="w-[30%] max-sm:w-auto">
          <a href="/" aria-label="Novusolv Home" className="relative flex items-center gap-2">
            <img
              src={scrolled ? "/logo-black.png" : "/logo-white.png"}
              alt="Novusolv Logo"
              className="h-10 max-sm:h-8 w-auto object-contain transition-all duration-300"
            />
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className={`px-5 py-[10px] rounded-2xl max-sm:hidden ${scrolled ? 'bg-gray-100/80' : 'bg-white/10 backdrop-blur-[80px]'}`}>
          <ul className="flex gap-8 items-center">
            <li className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`text-[14px] leading-[150%] opacity-70 hover:opacity-100 cursor-pointer flex items-center gap-1 font-medium transition-opacity ${scrolled ? 'text-heading' : 'text-white'}`}
              >
                Services
                <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[220px] z-50"
                  >
                    <a href="#custom-models" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium">Custom AI Models</a>
                    <a href="#workflow-automation" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium">Workflow Automation</a>
                    <a href="#customer-support" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium">AI Customer Support</a>
                    <a href="#data-insights" className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium">Data & Analytics</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
            <li>
              <a
                href="#testimonials"
                className={`text-[14px] leading-[150%] opacity-70 hover:opacity-100 font-medium cursor-pointer transition-opacity ${scrolled ? 'text-heading' : 'text-white'}`}
              >
                Case Studies
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className={`text-[14px] leading-[150%] opacity-70 hover:opacity-100 font-medium cursor-pointer transition-opacity ${scrolled ? 'text-heading' : 'text-white'}`}
              >
                FAQ
              </a>
            </li>
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="max-sm:hidden flex items-center gap-3 justify-end w-[30%]">
          <a href="#contact">
            <button className="font-medium flex items-center justify-center cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 py-2.5 px-5 h-[42px] rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
              <span className="text-[14px] leading-[150%]">Book a Call</span>
            </button>
          </a>
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
            className="sm:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t z-50"
          >
            <div className="container py-4 flex flex-col gap-4">
              <a href="#custom-models" className="text-[14px] font-medium py-2">Services</a>
              <a href="#testimonials" className="text-[14px] font-medium py-2">Case Studies</a>
              <a href="#faq" className="text-[14px] font-medium py-2">FAQ</a>
              <a href="#contact">
                <button className="font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 px-5 h-[42px] rounded-xl text-[14px] w-full">
                  Book a Call
                </button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
