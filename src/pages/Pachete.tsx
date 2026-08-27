import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import LevelTable from '../components/LevelTable'
import { ROUTES } from '../lib/constants'

const BookCallForm = lazy(() => import('../components/BookCallForm'))

const DEV_ROWS = Array.from({ length: 10 }, (_, i) => ({ key: `dev_r${i + 1}` }))
const CON_ROWS = Array.from({ length: 5 }, (_, i) => ({ key: `con_r${i + 1}` }))
const AITP_FACTS = ['aitp_f1', 'aitp_f2', 'aitp_f3', 'aitp_f4'] as const

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E8630A] mb-3">
      {children}
    </p>
  )
}

export default function Pachete() {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)

  const onRequest = t('packages_page.price_on_request')

  return (
    <PageLayout title={t('packages_page.meta_title')} description={t('packages_page.meta_description')}>
      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <section className="container pb-16 max-sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <Eyebrow>{t('packages_page.eyebrow')}</Eyebrow>
          <h1 className="text-[52px] max-sm:text-[34px] font-bold tracking-tight text-heading leading-[1.08] text-balance">
            {t('packages_page.title')}
          </h1>
          <p className="text-[19px] max-sm:text-[16px] text-body leading-relaxed mt-6">
            {t('packages_page.lead')}
          </p>
        </motion.div>
      </section>

      {/* ── The gate ──────────────────────────────────────────────────────── */}
      <section className="container pb-20 max-sm:pb-12">
        <div className="rounded-3xl border border-outline-default bg-surface-card px-10 py-9 max-sm:px-6 max-sm:py-7">
          <h2 className="text-[24px] max-sm:text-[20px] font-bold text-heading">
            {t('packages_page.gate_title')}
          </h2>
          <p className="text-[16px] text-body leading-relaxed mt-3 max-w-2xl">
            {t('packages_page.gate_desc')}
          </p>
          <Link
            to={ROUTES.assessment}
            className="inline-flex items-center gap-2 mt-5 text-[15px] font-semibold text-[#E8630A] hover:text-[#FF8C2A] transition-colors group"
          >
            {t('packages_page.gate_cta')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="mt-7 pt-6 border-t border-outline-default">
            <p className="text-[15px] text-body leading-relaxed max-w-2xl">
              {t('packages_page.gate_exception')}
            </p>
            <Link
              to={ROUTES.website}
              className="inline-flex items-center gap-2 mt-3 text-[15px] font-semibold text-[#E8630A] hover:text-[#FF8C2A] transition-colors group"
            >
              {t('packages_page.gate_exception_cta')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Development line ──────────────────────────────────────────────── */}
      <section className="container py-16 max-sm:py-10 border-t border-outline-default">
        <Eyebrow>{t('packages_page.dev_eyebrow')}</Eyebrow>
        <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-heading">
          {t('packages_page.dev_title')}
        </h2>
        <p className="text-[17px] text-body mt-4 max-w-2xl leading-relaxed">
          {t('packages_page.dev_lead')}
        </p>

        <div className="mt-10">
          <LevelTable
            prefix="packages_page"
            rows={DEV_ROWS}
            prices={{ start: onRequest, business: onRequest, privat: onRequest }}
          />
        </div>
      </section>

      {/* ── Consulting line ───────────────────────────────────────────────── */}
      <section className="container py-16 max-sm:py-10 border-t border-outline-default">
        <Eyebrow>{t('packages_page.con_eyebrow')}</Eyebrow>
        <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-heading">
          {t('packages_page.con_title')}
        </h2>
        <p className="text-[17px] text-body mt-4 max-w-2xl leading-relaxed">
          {t('packages_page.con_lead')}
        </p>
        <p className="text-[15px] text-heading mt-4 max-w-2xl leading-relaxed border-l-2 border-[#E8630A] pl-4">
          {t('packages_page.con_note')}
        </p>

        <div className="mt-10">
          <LevelTable
            prefix="packages_page"
            rows={CON_ROWS}
            prices={{
              start: t('packages_page.price_assessment'),
              business: onRequest,
              privat: onRequest,
            }}
          />
        </div>
      </section>

      {/* ── AITP ──────────────────────────────────────────────────────────── */}
      <section className="container py-16 max-sm:py-10 border-t border-outline-default">
        <div className="rounded-3xl bg-[#000814] border border-[#003566] px-12 py-14 max-sm:px-6 max-sm:py-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E8630A] mb-3">
            {t('packages_page.aitp_eyebrow')}
          </p>
          <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-white text-balance">
            {t('packages_page.aitp_title')}
          </h2>

          <div className="mt-7 grid grid-cols-2 max-lg:grid-cols-1 gap-x-14 gap-y-8">
            <div className="flex flex-col gap-5">
              <p className="text-[16px] text-white/70 leading-relaxed">{t('packages_page.aitp_p1')}</p>
              <p className="text-[16px] text-white/70 leading-relaxed">{t('packages_page.aitp_p2')}</p>
              <p className="text-[16px] text-white leading-relaxed font-medium">
                {t('packages_page.aitp_p3')}
              </p>
            </div>

            <ul className="flex flex-col gap-4 lg:pt-1">
              {AITP_FACTS.map((key) => (
                <li key={key} className="flex gap-3.5">
                  <Check size={18} className="shrink-0 mt-0.5 text-[#E8630A]" />
                  <span className="text-[15px] text-white/80 leading-relaxed">{t(`packages_page.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────────── */}
      <section className="container py-16 max-sm:py-10 border-t border-outline-default">
        <h2 className="text-[32px] max-sm:text-[24px] font-bold tracking-tight text-heading text-balance">
          {t('packages_page.final_title')}
        </h2>
        <p className="text-[16px] text-body mt-3 max-w-xl leading-relaxed">
          {t('packages_page.final_desc')}
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-8 font-semibold inline-flex items-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-8 h-[52px] rounded-xl transition-all shadow-xl shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 group text-[16px] max-sm:w-full max-sm:justify-center"
        >
          {t('packages_page.final_cta')}
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {showForm && (
        <Suspense fallback={null}>
          <BookCallForm onClose={() => setShowForm(false)} />
        </Suspense>
      )}
    </PageLayout>
  )
}
