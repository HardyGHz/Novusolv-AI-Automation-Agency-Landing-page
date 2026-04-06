import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, X, Check, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

interface CaseItem {
  id: string
  icon: string
  industry: string
  label: string
  challenge: string
  before: string[]
  after: string[]
  metrics: Array<{ value: string; label: string }>
  realProof?: boolean
}

const getCases = (t: TFunction): CaseItem[] => [
  {
    id: 'ecommerce',
    icon: '💎',
    industry: t('before_after.case1_industry'),
    label: t('before_after.case1_label'),
    challenge: t('before_after.case1_challenge'),
    before: [
      t('before_after.case1_before_1'),
      t('before_after.case1_before_2'),
      t('before_after.case1_before_3'),
      t('before_after.case1_before_4'),
    ],
    after: [
      t('before_after.case1_after_1'),
      t('before_after.case1_after_2'),
      t('before_after.case1_after_3'),
      t('before_after.case1_after_4'),
    ],
    metrics: [
      { value: '90h', label: t('before_after.case1_metric1') },
      { value: '0%', label: t('before_after.case1_metric2') },
      { value: '0.32s', label: t('before_after.case1_metric3') },
    ],
    realProof: true,
  },
  {
    id: 'marketing',
    icon: '📣',
    industry: t('before_after.case2_industry'),
    label: t('before_after.case2_label'),
    challenge: t('before_after.case2_challenge'),
    before: [
      t('before_after.case2_before_1'),
      t('before_after.case2_before_2'),
      t('before_after.case2_before_3'),
      t('before_after.case2_before_4'),
    ],
    after: [
      t('before_after.case2_after_1'),
      t('before_after.case2_after_2'),
      t('before_after.case2_after_3'),
      t('before_after.case2_after_4'),
    ],
    metrics: [
      { value: '3x', label: t('before_after.case2_metric1') },
      { value: '60%', label: t('before_after.case2_metric2') },
      { value: '∞', label: t('before_after.case2_metric3') },
    ],
  },
  {
    id: 'operations',
    icon: '⚙️',
    industry: t('before_after.case3_industry'),
    label: t('before_after.case3_label'),
    challenge: t('before_after.case3_challenge'),
    before: [
      t('before_after.case3_before_1'),
      t('before_after.case3_before_2'),
      t('before_after.case3_before_3'),
      t('before_after.case3_before_4'),
    ],
    after: [
      t('before_after.case3_after_1'),
      t('before_after.case3_after_2'),
      t('before_after.case3_after_3'),
      t('before_after.case3_after_4'),
    ],
    metrics: [
      { value: '80h', label: t('before_after.case3_metric1') },
      { value: '99%', label: t('before_after.case3_metric2') },
      { value: '24/7', label: t('before_after.case3_metric3') },
    ],
  },
]

export default function BeforeAfter() {
  const { t } = useTranslation()
  const cases = useMemo(() => getCases(t), [t])
  const [activeCase, setActiveCase] = useState('ecommerce')

  const active = cases.find(c => c.id === activeCase) ?? cases[0]

  return (
    <section id="results" className="w-full py-20 max-sm:py-12 relative z-[3] overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] bg-purple-500/5 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-sm:mb-8"
        >
          <p className="text-purple-500 font-semibold text-[13px] uppercase tracking-widest mb-3">
            {t('before_after.eyebrow')}
          </p>
          <h2 className="text-[48px] leading-[115%] max-sm:text-[32px] font-bold text-heading">
            {t('before_after.title_1')}{' '}
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              {t('before_after.title_2')}
            </span>
          </h2>
          <p className="text-body text-[18px] max-sm:text-[16px] mt-4 max-w-xl mx-auto leading-relaxed">
            {t('before_after.subtitle')}
          </p>
        </motion.div>

        {/* Industry tabs */}
        <div className="flex justify-center gap-3 max-sm:gap-2 mb-10 flex-wrap">
          {cases.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCase(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 max-sm:px-3 max-sm:text-[13px] ${
                activeCase === c.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-surface-card border border-outline-default text-heading hover:border-purple-300'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
              {c.realProof && (
                <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-bold tracking-wide">
                  LIVE
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="bg-surface-card border border-outline-default rounded-3xl overflow-hidden shadow-xl shadow-black/5"
          >
            {/* Challenge banner */}
            <div className="px-8 py-5 max-sm:px-5 max-sm:py-4 border-b border-outline-default flex items-start gap-3">
              <span className="text-2xl">{active.icon}</span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-purple-500">
                  {active.industry}
                </span>
                <p className="text-[15px] text-body leading-relaxed mt-0.5">{active.challenge}</p>
              </div>
              {active.realProof && (
                <span className="ml-auto shrink-0 flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <Zap size={12} />
                  {t('before_after.real_proof_badge')}
                </span>
              )}
            </div>

            {/* Before / After columns */}
            <div className="grid grid-cols-2 max-sm:grid-cols-1 divide-x max-sm:divide-x-0 max-sm:divide-y divide-outline-default">
              {/* Before */}
              <div className="p-8 max-sm:p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <X size={13} className="text-red-500" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-widest text-red-500">
                    {t('before_after.before_label')}
                  </span>
                </div>
                <ul className="flex flex-col gap-4">
                  {active.before.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <X size={11} className="text-red-400" strokeWidth={2.5} />
                      </div>
                      <p className="text-[14px] leading-[160%] text-body">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="p-8 max-sm:p-5 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 dark:from-purple-900/10 dark:to-indigo-900/5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Check size={13} className="text-emerald-500" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-widest text-emerald-500">
                    {t('before_after.after_label')}
                  </span>
                </div>
                <ul className="flex flex-col gap-4">
                  {active.after.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-emerald-500" strokeWidth={2.5} />
                      </div>
                      <p className="text-[14px] leading-[160%] text-heading font-medium">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Metrics row */}
            <div className="border-t border-outline-default px-8 py-6 max-sm:px-5 max-sm:py-4 flex items-center justify-between gap-6 max-sm:flex-col max-sm:items-start">
              <div className="flex items-center gap-8 max-sm:gap-6">
                {active.metrics.map((m, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span className="text-[28px] max-sm:text-[22px] font-bold text-heading bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                      {m.value}
                    </span>
                    <span className="text-[12px] text-body leading-tight max-w-[90px]">{m.label}</span>
                  </div>
                ))}
              </div>
              <a href="#contact">
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-[14px] font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-purple-500/20 group shrink-0">
                  {t('before_after.cta')}
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
