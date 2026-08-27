import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SITE_CRAFTER_URL } from '../lib/constants'

export default function WebsiteBuilderCTA() {
  const { t } = useTranslation()

  return (
    <section className="pt-[80px] pb-[120px] max-md:pt-[56px] max-md:pb-[80px] border-t border-outline-default relative overflow-hidden flex items-center justify-center">
      <div className="absolute w-[60vw] h-[60vh] rounded-full blur-[140px] bg-[#E8630A]/10 mix-blend-multiply dark:mix-blend-lighten pointer-events-none z-0"></div>

      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-surface-card border border-outline-default p-10 md:p-16 rounded-[32px] overflow-hidden relative"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8630A]/10 to-transparent pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-10 items-center justify-between relative z-10">
            <div className="flex flex-col gap-4 md:w-2/3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-[#E8630A]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[#E8630A]">{t('website_builder.eyebrow')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-heading">
                {t('website_builder.title')}
              </h2>
              <p className="text-body text-lg max-w-2xl mt-2">
                {t('website_builder.subtitle')}
              </p>
            </div>

            <div className="md:w-1/3 flex justify-start md:justify-end w-full">
              <a 
                href={SITE_CRAFTER_URL}
                
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-max px-6 py-4 rounded-xl text-[#000814] bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] hover:from-[#D05A09] hover:to-[#E87020] transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg shadow-[#E8630A]/20 hover:shadow-[#E8630A]/40 hover:-translate-y-1"
              >
                <span>{t('website_builder.cta')}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
