import { motion } from 'framer-motion'
import { ArrowRight, Check, ExternalLink, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { CONTACT_EMAIL, ROUTES, SITE_CRAFTER_URL } from '../lib/constants'

const INCLUDED = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6'] as const
const WORK = ['w1', 'w2', 'w3', 'w4'] as const

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E8630A] mb-3">
      {children}
    </p>
  )
}

export default function WebsitePage() {
  const { t } = useTranslation()

  return (
    <PageLayout title={t('website_page.meta_title')} description={t('website_page.meta_description')}>
      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <section className="container pb-16 max-sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <Eyebrow>{t('website_page.eyebrow')}</Eyebrow>
          <h1 className="text-[52px] max-sm:text-[34px] font-bold tracking-tight text-heading leading-[1.08] text-balance">
            {t('website_page.title')}
          </h1>
          <p className="text-[19px] max-sm:text-[16px] text-body leading-relaxed mt-6">
            {t('website_page.lead')}
          </p>
          <p className="text-[16px] text-heading leading-relaxed mt-5 border-l-2 border-[#E8630A] pl-4">
            {t('website_page.no_assessment')}
          </p>
        </motion.div>
      </section>

      {/* ── Site Crafter ──────────────────────────────────────────────────── */}
      <section className="container pb-20 max-sm:pb-12">
        <div className="rounded-3xl bg-[#000814] border border-[#003566] px-12 py-12 max-sm:px-6 max-sm:py-9 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8630A]/12 to-transparent pointer-events-none"
          />
          <div className="relative z-[1] flex max-lg:flex-col items-start gap-12 max-lg:gap-7">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E8630A] mb-3">
                <Sparkles size={16} />
                {t('website_page.crafter_eyebrow')}
              </p>
              <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-white">
                {t('website_page.crafter_title')}
              </h2>
              <p className="text-[16px] text-white/70 leading-relaxed mt-4">
                {t('website_page.crafter_desc')}
              </p>
              <p className="text-[15px] text-white/50 leading-relaxed mt-4">
                {t('website_page.crafter_note')}
              </p>
            </div>

            <a
              href={SITE_CRAFTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 lg:mt-12 font-semibold inline-flex items-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-8 h-[52px] rounded-xl transition-all shadow-xl shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 group text-[16px] max-sm:w-full max-sm:justify-center"
            >
              {t('website_page.crafter_cta')}
              <ExternalLink size={17} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ── What is included ──────────────────────────────────────────────── */}
      <section className="container py-16 max-sm:py-10 border-t border-outline-default">
        <Eyebrow>{t('website_page.included_eyebrow')}</Eyebrow>
        <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-heading text-balance">
          {t('website_page.included_title')}
        </h2>

        <ul className="mt-10 grid grid-cols-2 max-md:grid-cols-1 gap-x-14 gap-y-4">
          {INCLUDED.map((key) => (
            <li key={key} className="flex gap-3.5 items-start">
              <Check size={18} className="shrink-0 mt-1 text-[#E8630A]" />
              <span className="text-[16px] text-heading leading-relaxed">
                {t(`website_page.${key}`)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 pt-8 border-t border-outline-default">
          <p className="text-[16px] text-body leading-relaxed max-w-2xl">
            {t('website_page.levels_note')}
          </p>
          <Link
            to={ROUTES.packages}
            className="inline-flex items-center gap-2 mt-4 text-[15px] font-semibold text-[#E8630A] hover:text-[#FF8C2A] transition-colors group"
          >
            {t('website_page.levels_cta')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── Sectors built ─────────────────────────────────────────────────── */}
      <section className="container py-16 max-sm:py-10 border-t border-outline-default">
        <Eyebrow>{t('website_page.work_eyebrow')}</Eyebrow>
        <h2 className="text-[38px] max-sm:text-[26px] font-bold tracking-tight text-heading text-balance">
          {t('website_page.work_title')}
        </h2>
        <p className="text-[17px] text-body mt-4 max-w-2xl leading-relaxed">
          {t('website_page.work_lead')}
        </p>

        <div className="mt-10 grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5">
          {WORK.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl border border-outline-default bg-surface-card p-6 flex flex-col gap-2.5"
            >
              <span className="w-8 h-1 rounded-full bg-gradient-to-r from-[#E8630A] to-[#FF8C2A]" />
              <h3 className="text-[16px] font-bold text-heading leading-snug">
                {t(`website_page.${key}_sector`)}
              </h3>
              <p className="text-[14px] text-body leading-relaxed">
                {t(`website_page.${key}_desc`)}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-[15px] text-body mt-8 max-w-2xl leading-relaxed">
          {t('website_page.work_note')}
        </p>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────────── */}
      <section className="container py-16 max-sm:py-10 border-t border-outline-default">
        <div className="bg-surface-card rounded-3xl px-12 py-14 max-sm:px-6 max-sm:py-10">
          <h2 className="text-[32px] max-sm:text-[24px] font-bold tracking-tight text-heading text-balance">
            {t('website_page.final_title')}
          </h2>
          <p className="text-[16px] text-body mt-3 max-w-xl leading-relaxed">
            {t('website_page.final_desc')}
          </p>
          <div className="mt-8 flex max-sm:flex-col items-center max-sm:items-stretch gap-5">
            <a
              href={SITE_CRAFTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold inline-flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-8 h-[52px] rounded-xl transition-all shadow-xl shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 group text-[16px]"
            >
              {t('website_page.final_cta')}
              <ExternalLink size={17} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[15px] font-semibold text-[#E8630A] hover:text-[#FF8C2A] transition-colors text-center"
            >
              {t('website_page.final_alt')}
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
