import { motion } from 'framer-motion'
import { ArrowRight, Globe, Gauge } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/constants'

/**
 * The site serves two different buyers. A website client has nothing to
 * measure and should not be pushed through an assessment; an operations
 * client should not be handed a website. This section forks them early.
 */
export default function TwoDoors() {
  const { t } = useTranslation()

  const doors = [
    {
      icon: <Globe size={22} />,
      label: t('doors.door1_label'),
      desc: t('doors.door1_desc'),
      cta: t('doors.door1_cta'),
      to: ROUTES.website,
    },
    {
      icon: <Gauge size={22} />,
      label: t('doors.door2_label'),
      desc: t('doors.door2_desc'),
      cta: t('doors.door2_cta'),
      to: ROUTES.assessment,
    },
  ]

  return (
    <section className="w-full py-24 max-sm:py-14 relative z-[3]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 max-sm:mb-8"
        >
          <p className="text-[#E8630A] font-semibold text-[13px] uppercase tracking-widest mb-3">
            {t('doors.eyebrow')}
          </p>
          <h2 className="text-[42px] leading-[115%] max-sm:text-[28px] font-bold text-heading text-balance">
            {t('doors.title')}
          </h2>
          <p className="text-body text-[17px] max-sm:text-[15px] mt-4 leading-relaxed">
            {t('doors.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
          {doors.map((door, i) => (
            <motion.div
              key={door.to}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                to={door.to}
                className="group h-full flex flex-col rounded-3xl border border-outline-default bg-surface-card p-10 max-sm:p-7 transition-all hover:border-[#E8630A]/60 hover:-translate-y-1"
              >
                <span className="w-12 h-12 rounded-2xl bg-[#E8630A]/10 text-[#E8630A] flex items-center justify-center">
                  {door.icon}
                </span>
                <h3 className="text-[22px] max-sm:text-[19px] font-bold text-heading mt-6 text-balance">
                  {door.label}
                </h3>
                <p className="text-[15px] text-body leading-relaxed mt-3 flex-1">{door.desc}</p>
                <span className="inline-flex items-center gap-2 mt-7 text-[15px] font-semibold text-[#E8630A]">
                  {door.cta}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
