import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PageLayout from '../components/PageLayout'
import LossCalculator from '../components/LossCalculator'

const BookCallForm = lazy(() => import('../components/BookCallForm'))

const DELIVERABLES = ['d1', 'd2', 'd3', 'd4', 'd5'] as const
const STEPS = ['s1', 's2', 's3', 's4', 's5'] as const
const COMPARISON_ROWS = ['row1', 'row2', 'row3', 'row4'] as const

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E8630A] mb-3">
      {children}
    </p>
  )
}

export default function EvaluareOperationala() {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)

  return (
    <PageLayout title={t('assessment_page.meta_title')} description={t('assessment_page.meta_description')}>
      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <section className="container pb-20 max-sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <Eyebrow>{t('assessment_page.eyebrow')}</Eyebrow>
          <h1 className="text-[52px] max-sm:text-[34px] font-bold tracking-tight text-heading leading-[1.08] text-balance">
            {t('assessment_page.title')}
          </h1>
          <p className="text-[19px] max-sm:text-[16px] text-body leading-relaxed mt-6">
            {t('assessment_page.lead')}
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-10 font-semibold inline-flex items-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-8 h-[52px] rounded-xl transition-all shadow-xl shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 group text-[16px] max-sm:w-full max-sm:justify-center"
          >
            {t('assessment_page.cta')}
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* ── Deliverables ──────────────────────────────────────────────────── */}
      <section className="container py-20 max-sm:py-12 border-t border-outline-default">
        <Eyebrow>{t('assessment_page.deliverables_eyebrow')}</Eyebrow>
        <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-heading text-balance">
          {t('assessment_page.deliverables_title')}
        </h2>

        <ol className="mt-12 grid grid-cols-2 max-md:grid-cols-1 gap-x-12 gap-y-10">
          {DELIVERABLES.map((key, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex gap-5"
            >
              <span className="shrink-0 w-9 h-9 rounded-xl bg-[#E8630A]/10 text-[#E8630A] font-bold text-[15px] flex items-center justify-center tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[17px] font-bold text-heading">
                  {t(`assessment_page.${key}_title`)}
                </h3>
                <p className="text-[15px] text-body leading-relaxed mt-2">
                  {t(`assessment_page.${key}_desc`)}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ── Loss calculator ───────────────────────────────────────────────── */}
      {/* Sits right after the deliverables so "the loss, in numbers" stops
          being abstract before the client reads the price. */}
      <section className="container py-20 max-sm:py-12 border-t border-outline-default">
        <Eyebrow>{t('calculator.eyebrow')}</Eyebrow>
        <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-heading text-balance">
          {t('calculator.title')}
        </h2>

        {/* Plain-language framing. It also qualifies: a business short on
            demand needs marketing, not this. Without it the four inputs read
            as a form with no stated purpose. */}
        <div className="mt-6 max-w-2xl flex flex-col gap-4">
          <p className="text-[18px] max-sm:text-[16px] text-heading leading-relaxed">
            {t('calculator.intro_1')}
          </p>
          <p className="text-[16px] text-body leading-relaxed">{t('calculator.intro_2')}</p>
          <p className="text-[16px] text-body leading-relaxed">{t('calculator.intro_3')}</p>
          <p className="text-[16px] text-body leading-relaxed">{t('calculator.intro_4')}</p>
          <p className="text-[15px] text-body/80 leading-relaxed">{t('calculator.subtitle')}</p>
        </div>

        <div className="mt-10">
          <LossCalculator onRequest={() => setShowForm(true)} />
        </div>
      </section>

      {/* ── Free audit vs assessment ──────────────────────────────────────── */}
      <section className="container py-20 max-sm:py-12 border-t border-outline-default">
        <Eyebrow>{t('assessment_page.why_paid_eyebrow')}</Eyebrow>
        <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-heading text-balance">
          {t('assessment_page.why_paid_title')}
        </h2>
        <p className="text-[17px] text-body mt-4">{t('assessment_page.why_paid_lead')}</p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-default">
                <th className="py-4 pr-6 text-[14px] font-semibold text-body uppercase tracking-wider w-1/2">
                  {t('assessment_page.col_free')}
                </th>
                <th className="py-4 pl-6 text-[14px] font-semibold text-[#E8630A] uppercase tracking-wider w-1/2">
                  {t('assessment_page.col_paid')}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row} className="border-b border-outline-default/60 align-top">
                  <td className="py-5 pr-6">
                    <span className="flex gap-3">
                      <Minus size={17} className="shrink-0 mt-0.5 text-body/50" />
                      <span className="text-[15px] text-body leading-relaxed">
                        {t(`assessment_page.${row}_free`)}
                      </span>
                    </span>
                  </td>
                  <td className="py-5 pl-6">
                    <span className="flex gap-3">
                      <Check size={17} className="shrink-0 mt-0.5 text-[#E8630A]" />
                      <span className="text-[15px] text-heading leading-relaxed font-medium">
                        {t(`assessment_page.${row}_paid`)}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Price ─────────────────────────────────────────────────────────── */}
      {/* Deliberately after the comparison: the client sees what it is worth
          before seeing what it costs. */}
      <section className="container py-20 max-sm:py-12 border-t border-outline-default">
        <div className="rounded-3xl border border-outline-default bg-surface-card px-12 py-12 max-sm:px-6 max-sm:py-9 flex max-md:flex-col items-start gap-12 max-md:gap-7">
          <div className="shrink-0">
            <p className="text-[13px] font-semibold text-body uppercase tracking-[0.14em]">
              {t('assessment_page.price_label')}
            </p>
            <p className="text-[46px] max-sm:text-[34px] font-bold tracking-tight bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] bg-clip-text text-transparent leading-none mt-2 tabular-nums">
              {t('assessment_page.price_value')}
            </p>
          </div>

          <div className="w-px self-stretch bg-outline-default max-md:hidden" />

          <div className="flex flex-col gap-3 max-w-xl">
            <p className="text-[17px] text-heading leading-relaxed font-medium">
              {t('assessment_page.price_note')}
            </p>
            <p className="text-[15px] text-body leading-relaxed">
              {t('assessment_page.price_detail')}
            </p>
          </div>
        </div>
      </section>

      {/* ── The five stages ───────────────────────────────────────────────── */}
      <section className="container py-20 max-sm:py-12 border-t border-outline-default">
        <Eyebrow>{t('assessment_page.process_eyebrow')}</Eyebrow>
        <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-heading text-balance">
          {t('assessment_page.process_title')}
        </h2>
        <p className="text-[17px] text-body mt-4 max-w-2xl leading-relaxed">
          {t('assessment_page.process_subtitle')}
        </p>

        <ol className="mt-12 relative">
          {/* the spine only makes sense where the stages are actually sequential */}
          <span
            aria-hidden
            className="absolute left-[19px] top-3 bottom-3 w-px bg-outline-default max-sm:hidden"
          />
          {STEPS.map((key, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative flex gap-6 max-sm:gap-4 pb-10 last:pb-0"
            >
              <span className="relative z-[1] shrink-0 w-10 h-10 rounded-full bg-surface-default border-2 border-[#E8630A] text-[#E8630A] font-bold text-[15px] flex items-center justify-center tabular-nums">
                {i + 1}
              </span>
              <div className="pt-1.5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="text-[19px] max-sm:text-[17px] font-bold text-heading">
                    {t(`assessment_page.${key}_title`)}
                  </h3>
                  <span className="text-[13px] font-medium text-body bg-surface-card px-2.5 py-1 rounded-full">
                    {t(`assessment_page.${key}_meta`)}
                  </span>
                </div>
                <p className="text-[15px] text-body leading-relaxed mt-2 max-w-2xl">
                  {t(`assessment_page.${key}_desc`)}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────────── */}
      <section className="container py-20 max-sm:py-12 border-t border-outline-default">
        <div className="bg-surface-card rounded-3xl px-12 py-14 max-sm:px-6 max-sm:py-10">
          <h2 className="text-[32px] max-sm:text-[24px] font-bold tracking-tight text-heading text-balance">
            {t('assessment_page.final_title')}
          </h2>
          <p className="text-[16px] text-body mt-3 max-w-xl leading-relaxed">
            {t('assessment_page.final_desc')}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-8 font-semibold inline-flex items-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-8 h-[52px] rounded-xl transition-all shadow-xl shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 group text-[16px] max-sm:w-full max-sm:justify-center"
          >
            {t('assessment_page.cta')}
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {showForm && (
        <Suspense fallback={null}>
          <BookCallForm onClose={() => setShowForm(false)} />
        </Suspense>
      )}
    </PageLayout>
  )
}
