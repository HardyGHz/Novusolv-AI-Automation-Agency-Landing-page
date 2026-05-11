import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function WebsiteBuilderCTA() {
  const { t } = useTranslation()

  return (
    <section className="py-[120px] max-md:py-[80px] relative overflow-hidden flex items-center justify-center">
      <div className="absolute w-[60vw] h-[60vh] rounded-full blur-[140px] bg-[#FFC300]/10 mix-blend-multiply dark:mix-blend-lighten pointer-events-none z-0"></div>
      
      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-surface-card border border-outline-default p-10 md:p-16 rounded-[32px] overflow-hidden relative"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FFC300]/10 to-transparent pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-10 items-center justify-between relative z-10">
            <div className="flex flex-col gap-4 md:w-2/3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-[#FFC300]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[#FFC300]">Website Builder</span>
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
                href="https://sitecrafter-novusolv.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-max px-6 py-4 rounded-xl text-[#000814] bg-gradient-to-r from-[#FFC300] to-[#FFD60A] hover:from-[#E5AF00] hover:to-[#E5C009] transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg shadow-[#FFC300]/20 hover:shadow-[#FFC300]/40 hover:-translate-y-1"
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
