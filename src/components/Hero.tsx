import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { ArrowRight, Zap, Database, MailCheck, ShieldCheck, BrainCircuit } from 'lucide-react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useInView } from '../hooks/useInView'
import NetworkCanvas from './NetworkCanvas'

// Lazy: keeps the Supabase client out of the initial bundle until the modal opens
const BookCallForm = lazy(() => import('./BookCallForm'))

// ─── Animated Stat Counter ─────────────────────────────────────────────────
function AnimatedCounter({
  endValue,
  suffix = '',
  precision = 0,
  duration = 2000,
}: {
  endValue: number
  suffix?: string
  precision?: number
  duration?: number
}) {
  const { ref, isInView } = useInView<HTMLSpanElement>({ once: true, threshold: 0.1 })
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (isInView && !hasRun.current) {
      hasRun.current = true
      let startTime: number
      let animationFrame: number

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const eased = 1 - Math.pow(2, -10 * progress)
        setCount(endValue * eased)
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        } else {
          setCount(endValue)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isInView, endValue, duration])

  return (
    <span
      ref={ref}
      className="text-[28px] max-sm:text-[22px] font-bold tracking-tight bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] bg-clip-text text-transparent min-w-[100px] max-sm:min-w-0 text-center block"
    >
      {count.toFixed(precision)}{suffix}
    </span>
  )
}

// ─── Floating Space Card ────────────────────────────────────────────────────
function FloatingCard({
  icon,
  label,
  sub,
  color,
  delay,
  x,
  y,
  rotate,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  color: string
  delay: number
  x: string
  y: string
  rotate: number
}) {
  return (
    <motion.div
      className="absolute flex items-center gap-3 bg-gray-950/70 dark:bg-gray-900/80 border border-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl cursor-default select-none"
      style={{ left: x, top: y, rotate: `${rotate}deg` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0],
        rotate: [rotate, rotate + 1.5, rotate - 1, rotate],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { repeat: Infinity, duration: 5 + delay, ease: 'easeInOut', delay },
        rotate: { repeat: Infinity, duration: 7 + delay, ease: 'easeInOut', delay },
      }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-white leading-tight">{label}</p>
        <p className="text-[11px] text-white/50 leading-tight">{sub}</p>
      </div>
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Hero() {
  const { t } = useTranslation()
  const rotatingWords = [
    t('hero.rotating_1'),
    t('hero.rotating_2'),
    t('hero.rotating_3'),
    t('hero.rotating_4'),
    t('hero.rotating_5'),
  ]

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  // ─── Scroll parallax: ambience layers drift as the hero scrolls out ───
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const orbTopY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140])
  const orbBottomY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -100])
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 70])

  // ─── Mouse tilt: the floating-cards scene leans toward the cursor ───
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const tiltXSpring = useSpring(tiltX, { stiffness: 120, damping: 18 })
  const tiltYSpring = useSpring(tiltY, { stiffness: 120, damping: 18 })

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    tiltX.set(((e.clientY - rect.top) / rect.height - 0.5) * -8)
    tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 8)
  }
  const resetTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        className="min-h-screen max-w-[1920px] mx-auto flex flex-col w-full relative justify-center overflow-hidden pt-20 pb-10"
      >
      {/* Background ambience — parallax layers */}
      <motion.div
        style={{ y: orbTopY }}
        className="absolute top-[-10%] right-[-5%] w-[55vw] h-[55vw] rounded-full blur-[160px] bg-[#001D3D]/40 pointer-events-none"
      />
      <motion.div
        style={{ y: orbBottomY }}
        className="absolute bottom-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-[#003566]/30 pointer-events-none"
      />
      <NetworkCanvas />

      <div className="container relative z-10 my-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-8 w-full max-w-xl mx-auto lg:mx-0 max-sm:text-center">

            {/* Heading */}
            <div className="flex flex-col gap-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[56px] lg:text-[64px] leading-[1.1] max-sm:text-[40px] font-bold tracking-tight text-heading"
              >
                {t('hero.title_1')}
                <br />
                <span className="bg-gradient-to-r from-[#E8630A] via-[#FF8C2A] to-[#E8630A] bg-clip-text text-transparent">
                  {t('hero.title_2')}
                </span>
              </motion.h1>
            </div>

            {/* Rotating subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-body w-full max-sm:mx-auto flex flex-col justify-start"
            >
              <div className="flex flex-wrap items-center max-sm:justify-center text-[20px] max-sm:text-[18px] leading-[140%]">
                <span>{t('hero.subtitle_prefix')}</span>
                <div className="relative overflow-hidden text-left h-[28px] max-sm:h-[25px] ml-1.5 min-w-[280px] max-sm:min-w-[220px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentWordIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <span className="font-semibold bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] bg-clip-text text-transparent">
                        {rotatingWords[currentWordIndex]}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4 mt-2 max-sm:flex-col"
            >
              <button
                onClick={() => setShowContactForm(true)}
                className="font-semibold flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-8 h-[52px] rounded-xl transition-all shadow-xl shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 group text-[16px] max-sm:w-full"
              >
                {t('hero.book_audit_btn')}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#results" className="block max-sm:w-full">
                <button className="font-semibold flex items-center justify-center cursor-pointer bg-surface-card text-heading hover:bg-outline-default py-3 px-8 h-[52px] rounded-xl transition-all border border-outline-default text-[16px] w-full hover:-translate-y-0.5 shadow-sm">
                  {t('hero.see_work_btn')}
                </button>
              </a>
            </motion.div>

            {/* Animated Metric Counters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-start max-sm:justify-between gap-10 max-sm:gap-0 w-full mt-6 pt-6 border-t border-outline-default/50"
            >
              <div className="flex flex-col items-center gap-1 text-center max-sm:flex-1">
                <AnimatedCounter endValue={20} suffix="%" duration={2000} />
                <span className="text-body text-[13px] max-sm:text-[11px] font-medium">{t('hero.stat_1_label')}</span>
              </div>
              <div className="w-px h-12 bg-outline-default/50" />
              <div className="flex flex-col items-center gap-1 text-center max-sm:flex-1">
                <AnimatedCounter endValue={100} suffix="+" duration={2200} />
                <span className="text-body text-[13px] max-sm:text-[11px] font-medium">{t('hero.stat_2_label')}</span>
              </div>
              <div className="w-px h-12 bg-outline-default/50" />
              <div className="flex flex-col items-center gap-1 text-center max-sm:flex-1">
                <AnimatedCounter endValue={99.9} suffix="%" precision={1} duration={2500} />
                <span className="text-body text-[13px] max-sm:text-[11px] font-medium">{t('hero.stat_3_label')}</span>
              </div>
            </motion.div>
          </div>

          {/* ── Right Column: Deep Space Floating Cards ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
            style={{ perspective: 1200, y: cardsY }}
            className="relative hidden lg:flex items-center justify-center h-[560px]"
          >
           <motion.div
            style={{ rotateX: tiltXSpring, rotateY: tiltYSpring, transformStyle: 'preserve-3d' }}
            className="absolute inset-0 flex items-center justify-center"
           >
            {/* Deep space background glow orbs */}
            <div className="absolute w-72 h-72 rounded-full bg-[#E8630A]/10 blur-[80px]" />
            <div className="absolute w-48 h-48 rounded-full bg-[#003566]/20 blur-[60px] translate-x-20 translate-y-10" />

            {/* Subtle star-field dots */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/30"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + Math.random() * 3,
                  delay: Math.random() * 3,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* ── Floating Cards ── */}
            <FloatingCard
              icon={<Database size={18} className="text-[#FF8C2A]" />}
              label="Lead Captured"
              sub="CRM updated via Webhook"
              color="bg-[#003566]/30"
              delay={0}
              x="5%"
              y="10%"
              rotate={-3}
            />

            <FloatingCard
              icon={<BrainCircuit size={18} className="text-[#E8630A]" />}
              label="AI Processing"
              sub="Intent scored — 0.4s"
              color="bg-[#E8630A]/20"
              delay={0.4}
              x="42%"
              y="30%"
              rotate={2}
            />

            <FloatingCard
              icon={<MailCheck size={18} className="text-emerald-300" />}
              label="Email Sent"
              sub="Personalized & delivered"
              color="bg-emerald-500/20"
              delay={0.8}
              x="12%"
              y="55%"
              rotate={-1.5}
            />

            <FloatingCard
              icon={<Zap size={18} className="text-amber-300" />}
              label="Workflow Triggered"
              sub="n8n pipeline executed"
              color="bg-amber-500/20"
              delay={1.2}
              x="50%"
              y="72%"
              rotate={3}
            />

            <FloatingCard
              icon={<ShieldCheck size={18} className="text-sky-300" />}
              label="Zero Data Breach"
              sub="Encrypted & compliant"
              color="bg-sky-500/20"
              delay={1.6}
              x="58%"
              y="2%"
              rotate={1}
            />
           </motion.div>
          </motion.div>
        </div>
      </div>
      </section>

      {/* Book-a-Call Modal */}
      <AnimatePresence>
        {showContactForm && (
          <Suspense fallback={null}>
            <BookCallForm source="hero_main_cta" onClose={() => setShowContactForm(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  )
}
