import { motion } from 'framer-motion'
import { ArrowRight, X, Check, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BEFORE = ['case_before_1', 'case_before_2', 'case_before_3', 'case_before_4'] as const
const AFTER = ['case_after_1', 'case_after_2', 'case_after_3', 'case_after_4'] as const
const METRICS = ['case_metric1', 'case_metric2', 'case_metric3'] as const

export default function BeforeAfter() {
  const { t } = useTranslation()

  return (
    <section id="results" className="w-full py-28 max-sm:py-16 relative z-[3] overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] bg-[#E8630A]/5 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-sm:mb-8"
        >
          <p className="text-[#E8630A] font-semibold text-[13px] uppercase tracking-widest mb-3">
            {t('before_after.eyebrow')}
          </p>
          <h2 className="text-[48px] leading-[115%] max-sm:text-[32px] font-bold text-heading">
            {t('before_after.title_1')}{' '}
            <span className="bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] bg-clip-text text-transparent">
              {t('before_after.title_2')}
            </span>
          </h2>
          <p className="text-body text-[18px] max-sm:text-[16px] mt-4 max-w-xl mx-auto leading-relaxed text-balance">
            {t('before_after.subtitle')}
          </p>
        </motion.div>

        {/* Case card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45 }}
          className="bg-surface-card border border-outline-default rounded-3xl overflow-hidden shadow-xl shadow-black/5"
        >
          {/* Challenge banner */}
          <div className="px-8 py-5 max-sm:px-5 max-sm:py-4 border-b border-outline-default flex items-start gap-4 max-sm:flex-col max-sm:gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8630A]">
                {t('before_after.case_industry')}
              </span>
              <p className="text-[15px] text-body leading-relaxed mt-1">
                {t('before_after.case_challenge')}
              </p>
            </div>
            <span className="ml-auto max-sm:ml-0 shrink-0 flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Zap size={12} />
              {t('before_after.real_proof_badge')}
            </span>
          </div>

          {/* Before / After columns */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 divide-x max-sm:divide-x-0 max-sm:divide-y divide-outline-default">
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
                {BEFORE.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <X size={11} className="text-red-400" strokeWidth={2.5} />
                    </div>
                    <p className="text-[14px] leading-[160%] text-body">{t(`before_after.${key}`)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 max-sm:p-5 bg-gradient-to-br from-[#E8630A]/5 to-[#FF8C2A]/3 dark:from-[#E8630A]/10 dark:to-[#FF8C2A]/5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Check size={13} className="text-emerald-500" strokeWidth={3} />
                </div>
                <span className="text-[13px] font-bold uppercase tracking-widest text-emerald-500">
                  {t('before_after.after_label')}
                </span>
              </div>
              <ul className="flex flex-col gap-4">
                {AFTER.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-emerald-500" strokeWidth={2.5} />
                    </div>
                    <p className="text-[14px] leading-[160%] text-heading font-medium">
                      {t(`before_after.${key}`)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics row */}
          <div className="border-t border-outline-default px-8 py-6 max-sm:px-5 max-sm:py-5 flex items-center justify-between gap-8 max-lg:flex-col max-lg:items-start">
            <div className="flex items-start gap-10 max-sm:gap-6 max-sm:flex-wrap">
              {METRICS.map((key) => (
                <div key={key} className="flex flex-col gap-0.5">
                  <span className="text-[28px] max-sm:text-[22px] font-bold bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] bg-clip-text text-transparent tabular-nums">
                    {t(`before_after.${key}_value`)}
                  </span>
                  <span className="text-[12px] text-body leading-tight max-w-[130px]">
                    {t(`before_after.${key}`)}
                  </span>
                </div>
              ))}
            </div>
            <a href="#contact" className="max-sm:w-full">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] px-5 py-2.5 rounded-xl text-[14px] font-semibold hover:from-[#D05A09] hover:to-[#E87020] transition-all shadow-md shadow-[#E8630A]/20 group shrink-0 max-sm:w-full">
                {t('before_after.cta')}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </a>
          </div>

          {/* Where the numbers come from. Without this the figures read as marketing. */}
          <p className="px-8 pb-6 max-sm:px-5 text-[12px] text-body/80 leading-relaxed max-w-3xl">
            {t('before_after.case_note')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
