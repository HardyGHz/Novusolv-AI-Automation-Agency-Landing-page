import { useState, useEffect } from 'react'
import { ArrowRight, Zap, Users, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ContactForm from './ContactForm'


export default function Hero() {
  const { t } = useTranslation()
  const rotatingWords = [
    t('hero.rotating_1'),
    t('hero.rotating_2'),
    t('hero.rotating_3'),
    t('hero.rotating_4'),
    t('hero.rotating_5')
  ]

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="contact" className="min-h-[108vh] max-w-[1920px] mx-auto max-sm:min-h-[auto] flex flex-col w-full relative pb-8 justify-center">
      {/* Background - AI generated image */}
      <img src="/hero-bg.png" alt="" className="absolute top-0 left-0 w-full object-cover opacity-40 pointer-events-none" style={{ height: '120%' }} />
      <div className="absolute inset-0 w-full h-[120%] max-h-full overlay-bg pointer-events-none" />

      <div className="my-auto w-full relative z-10">
        <div className="justify-center items-center w-full max-sm:mt-[50px] relative my-[42px] pt-[88px]">
          <div className="flex flex-col gap-10 container">
            <div className="flex flex-col gap-8 w-full overflow-hidden">
              <div className="flex flex-col grow gap-4 text-center">
                {/* Announcement banner */}
                <motion.button
                  onClick={() => setShowContactForm(true)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group w-max px-4 max-sm:px-3 py-2 rounded-full mx-auto text-white bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-200 backdrop-blur-xl flex gap-2 items-center mb-6 border border-white/10 cursor-pointer shadow-lg shadow-black/20"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-2.5 py-0.5 rounded-full mr-1 shrink-0">
                    <p className="text-[11px] leading-[150%] font-semibold text-white">FREE</p>
                  </div>
                  <div className="overflow-hidden relative max-sm:w-[180px]">
                    <motion.p 
                      animate={{ x: ["0%", "-50%", "0%"] }}
                      transition={{ 
                        x: { repeat: Infinity, duration: 10, ease: "linear" } 
                      }}
                      className="text-[13px] leading-[150%] font-semibold text-white max-sm:text-[11px] whitespace-nowrap"
                    >
                      {t('hero.free_audit')} &nbsp;&nbsp;&nbsp; {t('hero.free_audit')}
                    </motion.p>
                  </div>
                  <ArrowRight size={13} className="text-white/70 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </motion.button>

                {/* Main heading with gradient */}
                <div className="w-8/12 mx-auto max-sm:w-full flex flex-col gap-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-[56px] leading-[115%] max-sm:text-[24px] font-bold"
                  >
                    <span className="text-white">{t('hero.title_1')}</span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                      {t('hero.title_2')}
                    </span>
                  </motion.h1>
                </div>

                {/* Subheading with rotating text */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-white/80 w-full max-w-[620px] overflow-hidden mx-auto flex flex-col gap-1 justify-center"
                >
                  <div className="flex flex-wrap justify-center">
                    <h2 className="text-[20px] leading-[140%] max-sm:text-[18px]">
                      {t('hero.subtitle_prefix')}
                    </h2>
                    <div className="relative overflow-hidden text-left w-[190px] ml-1 h-[28px] max-sm:h-[25px]">
                      <motion.div
                        key={currentWordIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h2 className="text-[20px] leading-[140%] max-sm:text-[18px] text-white font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                          {rotatingWords[currentWordIndex]}
                        </h2>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Dual CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex gap-4 justify-center mt-4 max-sm:flex-col max-sm:px-8"
                >
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="font-semibold flex items-center justify-center cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 py-3 px-8 h-[52px] rounded-2xl transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] group text-[16px] max-sm:w-full">
                      {t('hero.book_audit_btn')}
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a href="#custom-models" className="hidden sm:block">
                    <button className="font-semibold flex items-center justify-center cursor-pointer bg-white/10 text-white hover:bg-white/20 py-3 px-8 h-[52px] rounded-2xl transition-all border border-white/20 backdrop-blur-sm hover:border-white/40 text-[16px]">
                      {t('hero.see_work_btn')}
                    </button>
                  </a>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="sm:hidden font-semibold flex items-center justify-center cursor-pointer bg-white/10 text-white hover:bg-white/20 py-3 px-8 h-[52px] rounded-2xl transition-all border border-white/20 backdrop-blur-sm hover:border-white/40 text-[16px] w-full"
                  >
                    {t('nav.book_call')}
                  </button>
                </motion.div>
              </div>

              {/* Stats counters */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center gap-12 max-sm:gap-6 mt-4"
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center gap-2 text-white">
                    <Zap size={18} className="text-purple-400" />
                    <span className="text-[28px] max-sm:text-[22px] font-bold">{t('hero.stat_1_val')}</span>
                  </div>
                  <span className="text-white/50 text-[13px] max-sm:text-[11px]">{t('hero.stat_1_label')}</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={18} className="text-indigo-400" />
                    <span className="text-[28px] max-sm:text-[22px] font-bold">{t('hero.stat_2_val')}</span>
                  </div>
                  <span className="text-white/50 text-[13px] max-sm:text-[11px]">{t('hero.stat_2_label')}</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center gap-2 text-white">
                    <Users size={18} className="text-pink-400" />
                    <span className="text-[28px] max-sm:text-[22px] font-bold">{t('hero.stat_3_val')}</span>
                  </div>
                  <span className="text-white/50 text-[13px] max-sm:text-[11px]">{t('hero.stat_3_label')}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setShowContactForm(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10"
            >
              <ContactForm source="hero_cta" isModal onClose={() => setShowContactForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
