import { useState, useEffect } from 'react'
import { ArrowRight, Zap, Users, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactForm from './ContactForm'

const rotatingWords = ['customer support.', 'lead generation.', 'data analysis.', 'internal workflows.', 'operations.']

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-[108vh] max-w-[1920px] mx-auto max-sm:min-h-[auto] flex flex-col w-full relative pb-8 justify-center">
      {/* Background - AI generated image */}
      <img src="/hero-bg.png" alt="" className="absolute top-0 left-0 w-full object-cover opacity-40 pointer-events-none" style={{ height: '120%' }} />
      <div className="absolute inset-0 w-full h-[120%] max-h-full overlay-bg" />

      <div className="my-auto w-full">
        <div className="justify-center items-center w-full max-sm:mt-[50px] relative my-[42px] pt-[88px]">
          <div className="flex flex-col gap-10 container">
            <div className="flex flex-col gap-8 w-full overflow-hidden">
              <div className="flex flex-col grow gap-4 text-center">
                {/* Announcement banner */}
                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group w-max px-4 max-sm:px-3 py-2 rounded-full mx-auto text-white bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-[80px] flex gap-2 items-center mb-6 border border-white/10"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-2.5 py-0.5 rounded-full mr-1">
                    <p className="text-[11px] leading-[150%] font-semibold text-white">NEW</p>
                  </div>
                  <p className="text-[13px] leading-[150%] font-medium text-white/90 max-sm:text-[11px]">
                    Novusolv is now accepting new clients
                  </p>
                  <ArrowRight size={13} className="text-white/70 group-hover:translate-x-0.5 transition-transform" />
                </motion.a>

                {/* Main heading with gradient */}
                <div className="w-8/12 mx-auto max-sm:w-full flex flex-col gap-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-[56px] leading-[115%] max-sm:text-[36px] font-bold"
                  >
                    <span className="text-white">Automate Your Business.</span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                      Scale with AI.
                    </span>
                  </motion.h1>
                </div>

                {/* Subheading with rotating text */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-white/80 w-[620px] overflow-hidden max-sm:w-full mx-auto flex flex-col gap-1 justify-center"
                >
                  <div className="flex flex-wrap justify-center">
                    <h2 className="text-[20px] leading-[140%] max-sm:text-[18px]">
                      Scale 10x faster by automating{' '}
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
                    className="font-semibold flex items-center justify-center cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 py-3 px-8 h-[52px] rounded-2xl transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] group text-[16px]">
                      Book a Free Audit
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a href="#custom-models">
                    <button className="font-semibold flex items-center justify-center cursor-pointer bg-white/10 text-white hover:bg-white/20 py-3 px-8 h-[52px] rounded-2xl transition-all border border-white/20 backdrop-blur-sm hover:border-white/40 text-[16px]">
                      See Our Work
                    </button>
                  </a>
                </motion.div>
              </div>

              {/* Stats counters */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center gap-12 max-sm:gap-6 mt-4"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-white">
                    <Zap size={18} className="text-purple-400" />
                    <span className="text-[28px] max-sm:text-[22px] font-bold">40%</span>
                  </div>
                  <span className="text-white/50 text-[13px] max-sm:text-[11px]">Cost Reduction</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={18} className="text-indigo-400" />
                    <span className="text-[28px] max-sm:text-[22px] font-bold">200+</span>
                  </div>
                  <span className="text-white/50 text-[13px] max-sm:text-[11px]">Hours Saved / Month</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-white">
                    <Users size={18} className="text-pink-400" />
                    <span className="text-[28px] max-sm:text-[22px] font-bold">50+</span>
                  </div>
                  <span className="text-white/50 text-[13px] max-sm:text-[11px]">Businesses Scaled</span>
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
