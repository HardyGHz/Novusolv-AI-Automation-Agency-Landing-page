import { motion } from 'framer-motion'
import { ArrowRight, Megaphone, Settings, Headphones, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ImpactArea {
  icon: React.ReactNode
  color: string
  bgColor: string
  area: string
  examples: string[]
  metric: string
  metricLabel: string
}

export default function ImpactAreas() {
  const { t } = useTranslation()

  const areas: ImpactArea[] = [
    {
      icon: <Megaphone size={20} />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      area: t('impact.marketing_title'),
      examples: [
        t('impact.marketing_1'),
        t('impact.marketing_2'),
        t('impact.marketing_3'),
        t('impact.marketing_4'),
      ],
      metric: '40%',
      metricLabel: t('impact.marketing_metric'),
    },
    {
      icon: <TrendingUp size={20} />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      area: t('impact.sales_title'),
      examples: [
        t('impact.sales_1'),
        t('impact.sales_2'),
        t('impact.sales_3'),
        t('impact.sales_4'),
      ],
      metric: '3x',
      metricLabel: t('impact.sales_metric'),
    },
    {
      icon: <Settings size={20} />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-700/10',
      area: t('impact.ops_title'),
      examples: [
        t('impact.ops_1'),
        t('impact.ops_2'),
        t('impact.ops_3'),
        t('impact.ops_4'),
      ],
      metric: '80h',
      metricLabel: t('impact.ops_metric'),
    },
    {
      icon: <Headphones size={20} />,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      area: t('impact.support_title'),
      examples: [
        t('impact.support_1'),
        t('impact.support_2'),
        t('impact.support_3'),
        t('impact.support_4'),
      ],
      metric: '80%',
      metricLabel: t('impact.support_metric'),
    },
  ]

  return (
    <section className="w-full py-20 max-sm:py-12 pb-28 max-sm:pb-16 relative z-[3]">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-sm:mb-8"
        >
          <p className="text-[#FFC300] font-semibold text-[13px] uppercase tracking-widest mb-3">
            {t('impact.eyebrow')}
          </p>
          <h2 className="text-[48px] leading-[115%] max-sm:text-[32px] font-bold text-heading">
            {t('impact.title')}
          </h2>
          <p className="text-body text-[18px] max-sm:text-[16px] mt-4 max-w-xl mx-auto leading-relaxed">
            {t('impact.subtitle')}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 max-sm:grid-cols-1 lg:grid-cols-4 gap-4">
          {areas.map((area, i) => (
            <motion.div
              key={area.area}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-surface-card border border-outline-default rounded-2xl p-6 flex flex-col gap-5 hover:border-[#FFC300]/30 dark:hover:border-[#FFC300]/30 hover:shadow-lg hover:shadow-[#FFC300]/5 transition-all duration-300 group"
            >
              {/* Icon + area */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${area.bgColor} ${area.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  {area.icon}
                </div>
                <h3 className="text-[15px] font-bold text-heading">{area.area}</h3>
              </div>

              {/* Examples */}
              <ul className="flex flex-col gap-2.5 flex-1">
                {area.examples.map((ex, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${area.color.replace('text-', 'bg-')} mt-[7px] shrink-0`} />
                    <p className="text-[13px] text-body leading-snug">{ex}</p>
                  </li>
                ))}
              </ul>

              {/* Metric */}
              <div className={`border-t border-outline-default pt-4 flex items-end justify-between`}>
                <div>
                  <p className={`text-[32px] font-bold leading-none ${area.color}`}>{area.metric}</p>
                  <p className="text-[11px] text-body mt-1 leading-tight max-w-[100px]">{area.metricLabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <a href="#contact">
            <button className="flex items-center gap-2 font-semibold bg-gradient-to-r from-[#FFC300] to-[#FFD60A] text-[#000814] hover:from-[#E5AF00] hover:to-[#E5C009] py-3 px-8 h-[52px] rounded-2xl transition-all shadow-xl shadow-[#FFC300]/25 hover:shadow-[#FFC300]/40 hover:scale-[1.02] group text-[16px]">
              {t('impact.cta')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
