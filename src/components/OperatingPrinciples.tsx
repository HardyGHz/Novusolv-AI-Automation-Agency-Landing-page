import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function OperatingPrinciples() {
  const { t } = useTranslation()

  const principles = [
    { title: t('principles.p1_title'), desc: t('principles.p1_desc') },
    { title: t('principles.p2_title'), desc: t('principles.p2_desc') },
    { title: t('principles.p3_title'), desc: t('principles.p3_desc') },
    { title: t('principles.p4_title'), desc: t('principles.p4_desc') },
    { title: t('principles.p5_title'), desc: t('principles.p5_desc') },
  ]

  return (
    <section className="w-full py-20 max-sm:py-12 relative z-[3]">
      <div className="container mx-auto px-4 max-w-4xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-sm:mb-8"
        >
          <p className="text-[#E8630A] font-semibold text-[13px] uppercase tracking-widest mb-3">
            {t('principles.eyebrow')}
          </p>
          <h2 className="text-[48px] leading-[115%] max-sm:text-[32px] font-bold text-heading">
            {t('principles.title')}
          </h2>
          <p className="text-body text-[18px] max-sm:text-[16px] mt-3 leading-relaxed">
            {t('principles.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col divide-y divide-outline-default">
          {principles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="py-6 grid grid-cols-[2.5rem_1fr_2fr] max-sm:grid-cols-1 gap-6 max-sm:gap-2 items-start group hover:bg-surface-card/40 px-4 -mx-4 rounded-xl transition-colors duration-200"
            >
              <span className="text-[#E8630A] font-mono text-[13px] font-bold opacity-50 pt-0.5 max-sm:hidden">
                0{i + 1}
              </span>
              <h3 className="text-heading font-semibold text-[17px] max-sm:text-[16px] leading-snug">
                {p.title}
              </h3>
              <p className="text-body text-[15px] max-sm:text-[14px] leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
