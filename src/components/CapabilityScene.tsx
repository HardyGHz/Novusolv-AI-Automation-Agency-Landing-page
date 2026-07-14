import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  BrainCircuit, Workflow, MessageSquare, BarChart3, Check, Bot,
  Database, FileText, Sparkles, TrendingUp, Zap, User,
} from 'lucide-react'

// ─── Capability scenes ───────────────────────────────────────────────────────
// Replaces the static sticky feature image: one animated "system" scene per
// capability, cross-fading as the reader scrolls the cards next to it. Purely
// decorative (aria-hidden), skeleton bars instead of copy so no i18n needed.

const EASE = [0.4, 0, 0.2, 1] as const

// Skeleton text line inside mock UI bubbles/cards
function Skel({ w, light = false }: { w: string; light?: boolean }) {
  return <div className={`h-2 rounded-full ${light ? 'bg-white/40' : 'bg-white/15'}`} style={{ width: w }} />
}

// Small mock chip with an icon + skeleton label
function SourceChip({ icon: Icon, w, delay, still }: { icon: typeof Database; w: string; delay: number; still: boolean }) {
  return (
    <motion.div
      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
      animate={still ? {} : { opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <Icon size={13} className="text-[#FF8C2A]" />
      <Skel w={w} />
    </motion.div>
  )
}

// ─── Scene 1: Custom AI models — neural graph with pulsing links ───
function NeuralScene({ still }: { still: boolean }) {
  const layers = [
    [{ x: 60, y: 90 }, { x: 60, y: 180 }, { x: 60, y: 270 }],
    [{ x: 210, y: 55 }, { x: 210, y: 145 }, { x: 210, y: 235 }, { x: 210, y: 325 }],
    [{ x: 360, y: 120 }, { x: 360, y: 240 }],
  ]
  const edges: Array<[{ x: number; y: number }, { x: number; y: number }]> = []
  layers[0].forEach((a) => layers[1].forEach((b) => edges.push([a, b])))
  layers[1].forEach((a) => layers[2].forEach((b) => edges.push([a, b])))

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-6">
      {/* data sources feeding the model */}
      <div className="flex gap-2 max-lg:hidden">
        <SourceChip icon={Database} w="34px" delay={0} still={still} />
        <SourceChip icon={FileText} w="26px" delay={1} still={still} />
        <SourceChip icon={MessageSquare} w="30px" delay={2} still={still} />
      </div>
    <svg viewBox="0 0 420 380" className="w-full max-h-[300px]" preserveAspectRatio="xMidYMid meet">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={a.x} y1={a.y} x2={b.x} y2={b.y}
          stroke="#E8630A" strokeWidth={1}
          initial={{ opacity: 0.1 }}
          animate={still ? { opacity: 0.25 } : { opacity: [0.08, 0.45, 0.08] }}
          transition={still ? {} : { duration: 2.6, repeat: Infinity, delay: (i % 7) * 0.35, ease: 'easeInOut' }}
        />
      ))}
      {layers.flat().map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={9}
          fill="#001D3D" stroke="#FF8C2A" strokeWidth={1.5}
          animate={still ? {} : { scale: [1, 1.18, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}
      {/* output glow */}
      <motion.circle
        cx={360} cy={180} r={26}
        fill="none" stroke="#E8630A" strokeWidth={1}
        animate={still ? { opacity: 0.4 } : { opacity: [0.1, 0.6, 0.1], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '360px 180px' }}
      />
    </svg>
      {/* model output card */}
      <motion.div
        className="max-lg:hidden flex items-center gap-3 bg-gradient-to-r from-[#E8630A]/20 to-[#FF8C2A]/10 border border-[#E8630A]/30 rounded-xl px-4 py-3"
        animate={still ? {} : { opacity: [0.5, 1, 0.5], y: [2, 0, 2] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles size={15} className="text-[#FF8C2A] shrink-0" />
        <div className="flex flex-col gap-1.5">
          <Skel w="130px" light />
          <Skel w="90px" />
        </div>
      </motion.div>
    </div>
  )
}

// ─── Scene 2: Workflow automation — pipeline with a travelling pulse ───
function WorkflowScene({ still }: { still: boolean }) {
  const steps = [Workflow, Bot, MessageSquare, Check]
  return (
    <div className="w-full flex flex-col items-center justify-center gap-10 px-8">
      <div className="relative w-full max-w-[340px] h-[2px] bg-white/10 mt-8">
        {!still && (
          <motion.div
            className="absolute -top-[3px] w-2 h-2 rounded-full bg-[#FF8C2A] shadow-[0_0_12px_#E8630A]"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {steps.map((Icon, i) => (
          <div
            key={i}
            className="absolute -top-[23px] flex flex-col items-center gap-2"
            style={{ left: `calc(${(i / (steps.length - 1)) * 100}% - 24px)` }}
          >
            <motion.div
              className="w-12 h-12 rounded-xl bg-[#001D3D] border border-white/15 flex items-center justify-center"
              animate={still ? { borderColor: 'rgba(232,99,10,0.6)' } : {
                borderColor: ['rgba(255,255,255,0.15)', 'rgba(232,99,10,0.9)', 'rgba(255,255,255,0.15)'],
                boxShadow: ['0 0 0px rgba(232,99,10,0)', '0 0 18px rgba(232,99,10,0.45)', '0 0 0px rgba(232,99,10,0)'],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: (i / (steps.length - 1)) * 3, ease: 'easeOut' }}
            >
              <Icon size={20} className="text-[#FF8C2A]" />
            </motion.div>
            <Skel w={`${26 + (i % 2) * 8}px`} />
          </div>
        ))}
      </div>
      {/* run log mock */}
      <div className="w-full max-w-[340px] flex flex-col gap-3 mt-8">
        <div className="max-lg:hidden flex items-center gap-2 px-1">
          <Zap size={13} className="text-[#FF8C2A]" />
          <Skel w="60px" />
          <motion.div
            className="ml-auto flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-2.5 py-1"
            animate={still ? {} : { opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="w-8 h-1.5 rounded-full bg-emerald-300/40" />
          </motion.div>
        </div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            animate={still ? {} : { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeInOut' }}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Check size={12} className="text-emerald-300" />
            </div>
            <Skel w={`${70 - i * 15}%`} />
            <div className="ml-auto w-7 h-1.5 rounded-full bg-white/10 shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Scene 3: Customer support — chat loop with typing indicator ───
function ChatScene({ still }: { still: boolean }) {
  const cycle = { duration: 9, repeat: Infinity, ease: 'easeOut' as const }
  return (
    <div className="w-full max-w-[340px] mx-auto flex flex-col gap-4 px-6">
      {/* chat window header */}
      <div className="max-lg:hidden flex items-center gap-3 border-b border-white/10 pb-3 mb-1">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User size={15} className="text-white/60" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#001227]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skel w="72px" light />
          <Skel w="48px" />
        </div>
        <motion.div
          className="ml-auto flex items-center gap-1.5 bg-[#E8630A]/15 border border-[#E8630A]/30 rounded-full px-2.5 py-1"
          animate={still ? {} : { opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <Bot size={12} className="text-[#FF8C2A]" />
          <div className="w-6 h-1.5 rounded-full bg-[#FF8C2A]/40" />
        </motion.div>
      </div>
      {/* incoming */}
      <motion.div
        className="self-start max-w-[75%] bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex flex-col gap-2"
        animate={still ? {} : { opacity: [0, 1, 1, 1, 0], y: [10, 0, 0, 0, 0] }}
        transition={{ ...cycle, times: [0, 0.06, 0.5, 0.94, 1] }}
      >
        <Skel w="120px" />
        <Skel w="80px" />
      </motion.div>
      {/* typing dots */}
      <motion.div
        className="self-end bg-[#E8630A]/25 rounded-2xl rounded-br-md px-4 py-3 flex gap-1.5 items-center"
        animate={still ? { opacity: 0 } : { opacity: [0, 1, 1, 0, 0] }}
        transition={{ ...cycle, times: [0.1, 0.14, 0.3, 0.34, 1] }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/70"
            animate={still ? {} : { y: [0, -4, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </motion.div>
      {/* AI reply */}
      <motion.div
        className="self-end max-w-[80%] bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] rounded-2xl rounded-br-md px-4 py-3 flex flex-col gap-2"
        animate={still ? {} : { opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, 0] }}
        transition={{ ...cycle, times: [0, 0.36, 0.42, 0.94, 1] }}
      >
        <Skel w="150px" light />
        <Skel w="100px" light />
      </motion.div>
      {/* resolved chip */}
      <motion.div
        className="self-center flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-4 py-1.5 mt-2"
        animate={still ? {} : { opacity: [0, 0, 1, 1, 0], scale: [0.9, 0.9, 1, 1, 0.95] }}
        transition={{ ...cycle, times: [0, 0.55, 0.6, 0.94, 1] }}
      >
        <Check size={13} className="text-emerald-300" />
        <div className="w-14 h-2 rounded-full bg-emerald-300/40" />
      </motion.div>
    </div>
  )
}

// ─── Scene 4: Data & insights — growing bars + self-drawing sparkline ───
function DataScene({ still }: { still: boolean }) {
  const bars = [42, 68, 55, 86, 74, 100]
  return (
    <div className="w-full max-w-[340px] mx-auto flex flex-col gap-6 px-6">
      {/* KPI tiles */}
      <div className="flex gap-3 max-lg:hidden">
        {[TrendingUp, Zap].map((Icon, i) => (
          <motion.div
            key={i}
            className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            animate={still ? {} : { opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3.4, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
          >
            <div className="w-7 h-7 rounded-lg bg-[#E8630A]/20 flex items-center justify-center shrink-0">
              <Icon size={14} className="text-[#FF8C2A]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skel w="44px" light />
              <Skel w="30px" />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-end justify-between gap-3 h-[130px] border-b border-white/10 pb-0">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-[4px] bg-gradient-to-t from-[#E8630A]/60 to-[#FF8C2A]"
            initial={{ height: '8%' }}
            animate={{ height: still ? `${h}%` : [`${h * 0.55}%`, `${h}%`, `${h * 0.55}%`] }}
            transition={still ? { duration: 0.5 } : { duration: 5, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <svg viewBox="0 0 340 90" className="w-full h-[90px]">
        {[22, 45, 68].map((y) => (
          <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        ))}
        <motion.path
          d="M0,72 C40,66 60,50 95,52 C130,54 150,30 195,34 C240,38 260,16 305,14 L340,10"
          fill="none" stroke="#FF8C2A" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: still ? 0.01 : 2.2, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="340" cy="10" r="4" fill="#FF8C2A"
          animate={still ? {} : { opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ transformOrigin: '340px 10px' }}
        />
      </svg>
    </div>
  )
}

// ─── Panel shell ─────────────────────────────────────────────────────────────
const SCENES: Record<string, { icon: typeof BrainCircuit; Scene: (p: { still: boolean }) => React.ReactNode }> = {
  'custom-models': { icon: BrainCircuit, Scene: NeuralScene },
  'workflow-automation': { icon: Workflow, Scene: WorkflowScene },
  'customer-support': { icon: MessageSquare, Scene: ChatScene },
  'data-insights': { icon: BarChart3, Scene: DataScene },
}

export default function CapabilityScene({ active, label }: { active: string; label: string }) {
  const reduceMotion = useReducedMotion()
  const entry = SCENES[active] ?? SCENES['custom-models']
  const Icon = entry.icon

  return (
    <div
      aria-hidden="true"
      className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl shadow-[#E8630A]/10 bg-gradient-to-br from-[#000814] via-[#001D3D] to-[#003566] border border-white/10"
    >
      {/* dot grid backdrop */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* window chrome + live label */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 py-4 z-10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E8630A]/70" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
          >
            <Icon size={14} className="text-[#FF8C2A]" />
            <span className="text-[12px] font-semibold text-white/80 tracking-wide">{label}</span>
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={reduceMotion ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {/* scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center pt-10"
        >
          <entry.Scene still={!!reduceMotion} />
        </motion.div>
      </AnimatePresence>
      {/* bottom vignette */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#000814]/80 to-transparent pointer-events-none" />
    </div>
  )
}
