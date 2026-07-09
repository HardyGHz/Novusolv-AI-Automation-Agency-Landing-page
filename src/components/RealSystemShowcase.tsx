import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function RealSystemShowcase() {
  const { t } = useTranslation()

  return (
    <section className="w-full py-24 max-sm:py-14 relative z-[3] bg-[#000814] overflow-hidden">
      {/* Subtle brand glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] bg-[#E8630A]/10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-[720px] mx-auto mb-12 max-sm:mb-8"
        >
          <p className="text-[#E8630A] font-semibold text-[13px] uppercase tracking-widest mb-3">
            {t('real_system.eyebrow')}
          </p>
          <h2 className="text-[44px] leading-[115%] max-sm:text-[30px] font-bold text-white">
            {t('real_system.title')}
          </h2>
          <p className="text-white/70 text-[18px] max-sm:text-[16px] mt-4 leading-relaxed">
            {t('real_system.subtitle')}
          </p>
        </motion.div>

        {/* Framed workflow screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-[#0b0f19] shadow-2xl shadow-black/40 overflow-hidden max-w-[1100px] mx-auto"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            <span className="ml-3 text-white/40 text-[12px]">order-routing.workflow</span>
          </div>
          {/* Wide image scrolls horizontally on small screens */}
          <div className="overflow-x-auto">
            <img
              src="/workflow-order-routing.png"
              alt={t('real_system.caption')}
              className="block min-w-[900px] w-full h-auto"
            />
          </div>
        </motion.div>

        <p className="text-center text-white/45 text-[13px] mt-5 max-w-[620px] mx-auto leading-relaxed">
          {t('real_system.caption')}
        </p>
      </div>
    </section>
  )
}
