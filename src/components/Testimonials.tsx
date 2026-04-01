import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

type Platform = 'discord' | 'twitter' | 'linkedin' | 'youtube' | 'email'

interface Testimonial {
  name: string
  handle: string
  quote: string
  platform: Platform
}

const getTestimonialsRow1 = (t: TFunction): Testimonial[] => [
  {
    name: 'Mark',
    handle: 'Director of Operations @ JoySilver',
    quote: t('testimonials.row1_quote1'),
    platform: 'linkedin',
  },
  {
    name: 'Michael Chen',
    handle: 'Head of Growth @ StartupX',
    quote: t('testimonials.row1_quote2'),
    platform: 'linkedin',
  },
  {
    name: 'David Rossi',
    handle: 'CEO @ Fintech Partners',
    quote: t('testimonials.row1_quote3'),
    platform: 'email',
  },
  {
    name: 'Emma Larson',
    handle: 'Operations Manager',
    quote: t('testimonials.row1_quote4'),
    platform: 'email',
  },
  {
    name: 'Alex Rivera',
    handle: '@alex_systems',
    quote: t('testimonials.row1_quote5'),
    platform: 'linkedin',
  },
]

const getTestimonialsRow2 = (t: TFunction): Testimonial[] => [
  {
    name: 'Dr. Jonás',
    handle: 'Founder @ MartonVet',
    quote: t('testimonials.row2_quote1'),
    platform: 'linkedin',
  },
  {
    name: 'Priya Patel',
    handle: 'VP of Growth @ SaaS Co',
    quote: t('testimonials.row2_quote2'),
    platform: 'linkedin',
  },
  {
    name: 'Tom Baker',
    handle: 'Shopify Merchant',
    quote: t('testimonials.row2_quote3'),
    platform: 'email',
  },
  {
    name: 'Lisa Wong',
    handle: 'COO @ Global Logistics',
    quote: t('testimonials.row2_quote4'),
    platform: 'linkedin',
  },
  {
    name: 'Marcus Thorne',
    handle: 'Digital Transformation Lead',
    quote: t('testimonials.row2_quote5'),
    platform: 'email',
  },
]

function PlatformIcon({ platform }: { platform: Platform }) {
  const iconClass = "w-5 h-5 text-white"
  switch (platform) {
    case 'discord':
      return (
        <svg className={iconClass} viewBox="0 0 256 256" fill="currentColor">
          <path d="M247.51,174.39,218,58a16.08,16.08,0,0,0-13-11.88l-36.06-5.92a16.22,16.22,0,0,0-18.26,11.88l-.21.85a4,4,0,0,0,3.27,4.93,155.62,155.62,0,0,1,24.41,5.62,8.2,8.2,0,0,1,5.62,9.7,8,8,0,0,1-10.19,5.64,155.4,155.4,0,0,0-90.8-.1,8.22,8.22,0,0,1-10.28-4.81,8,8,0,0,1,5.08-10.33,156.85,156.85,0,0,1,24.72-5.72,4,4,0,0,0,3.27-4.93l-.21-.85A16.21,16.21,0,0,0,87.08,40.21L51,46.13A16.08,16.08,0,0,0,38,58L8.49,174.39a15.94,15.94,0,0,0,9.06,18.51l67,29.71a16.17,16.17,0,0,0,21.71-9.1l3.49-9.45a4,4,0,0,0-3.27-5.35,158.13,158.13,0,0,1-28.63-6.2,8.2,8.2,0,0,1-5.61-9.67,8,8,0,0,1,10.2-5.66,155.59,155.59,0,0,0,91.12,0,8,8,0,0,1,10.19,5.65,8.19,8.19,0,0,1-5.61,9.68,157.84,157.84,0,0,1-28.62,6.2,4,4,0,0,0-3.27,5.35l3.49,9.45a16.18,16.18,0,0,0,21.71,9.1l67-29.71A15.94,15.94,0,0,0,247.51,174.39ZM92,152a12,12,0,1,1,12-12A12,12,0,0,1,92,152Zm72,0a12,12,0,1,1,12-12A12,12,0,0,1,164,152Z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg className={iconClass} viewBox="0 0 256 256" fill="currentColor">
          <path d="M215,219.85a8,8,0,0,1-7,4.15H160a8,8,0,0,1-6.75-3.71l-40.49-63.63L53.92,221.38a8,8,0,0,1-11.84-10.76l61.77-68L41.25,44.3A8,8,0,0,1,48,32H96a8,8,0,0,1,6.75,3.71l40.49,63.63,58.84-64.72a8,8,0,0,1,11.84,10.76l-61.77,67.95,62.6,98.38A8,8,0,0,1,215,219.85Z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={iconClass} viewBox="0 0 256 256" fill="currentColor">
          <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM96,176a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0ZM88,96a12,12,0,1,1,12-12A12,12,0,0,1,88,96Zm96,80a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140Z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className={iconClass} viewBox="0 0 256 256" fill="currentColor">
          <path d="M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-73.74,65-40,28A8,8,0,0,1,108,156V100a8,8,0,0,1,12.59-6.55l40,28a8,8,0,0,1,0,13.1Z" />
        </svg>
      )
    case 'email':
      return (
        <svg className={iconClass} viewBox="0 0 256 256" fill="currentColor">
          <path d="M104,152a8,8,0,0,1-8,8H56a8,8,0,0,1,0-16H96A8,8,0,0,1,104,152ZM168,32h24a8,8,0,0,0,0-16H160a8,8,0,0,0-8,8V56h16Zm72,84v60a16,16,0,0,1-16,16H136v32a8,8,0,0,1-16,0V192H32a16,16,0,0,1-16-16V116A60.07,60.07,0,0,1,76,56h76v88a8,8,0,0,0,16,0V56h12A60.07,60.07,0,0,1,240,116Z" />
        </svg>
      )
  }
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-blur rounded-2xl p-6 max-sm:p-4 flex flex-col gap-4 max-sm:gap-3 transition-all duration-300 w-[400px] max-sm:w-[300px] flex-shrink-0 mx-3 max-sm:mx-1.5 relative">
      <div className="flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/20 flex-shrink-0 flex items-center justify-center">
          <span className="text-white/60 text-lg font-semibold">{testimonial.name[0]}</span>
        </div>
        <div>
          <p className="text-[16px] leading-[150%] font-semibold text-white">{testimonial.name}</p>
          {testimonial.handle && (
            <p className="text-[14px] leading-[150%] text-white/70">{testimonial.handle}</p>
          )}
        </div>
      </div>
      <p className="text-[14px] leading-[150%] text-white max-sm:line-clamp-4 max-sm:overflow-hidden">
        "{testimonial.quote}"
      </p>
      <div className="flex justify-end absolute right-5 top-5">
        <PlatformIcon platform={testimonial.platform} />
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { t } = useTranslation()
  const row1 = useMemo(() => getTestimonialsRow1(t), [t])
  const row2 = useMemo(() => getTestimonialsRow2(t), [t])

  return (
    <div id="testimonials" className="relative py-20 max-sm:py-10 overflow-hidden overlay-bg-top max-w-[1920px] mx-auto">
      {/* Background image placeholder */}
      <div className="absolute inset-0 w-full h-full max-h-full bg-gradient-to-b from-purple-950 via-indigo-950 to-gray-950" />

      <div className="flex flex-col gap-16 max-sm:gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 z-[2]"
        >
          <div className="text-center">
            <h2 className="text-[48px] leading-[120%] max-sm:text-[32px] font-semibold text-white mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-[20px] leading-[140%] max-sm:text-[18px] text-white whitespace-pre-line">
              {t('testimonials.subtitle')}
            </p>
          </div>
        </motion.div>

        {/* Marquee Row 1 - scrolls left */}
        <div className="flex flex-col gap-8">
          <div className="overflow-hidden relative">
            <div
              className="flex gap-0 animate-marquee-left"
              style={{ width: `calc(400px * ${row1.length * 2})` }}
            >
              {[...row1, ...row1].map((testimonial, i) => (
                <TestimonialCard key={`row1-${i}`} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Marquee Row 2 - scrolls right */}
          <div className="overflow-hidden relative">
            <div
              className="flex gap-0 animate-marquee-right"
              style={{ width: `calc(400px * ${row2.length * 2})` }}
            >
              {[...row2, ...row2].map((testimonial, i) => (
                <TestimonialCard key={`row2-${i}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center z-[2]">
          <a href="#contact">
            <button className="font-medium flex items-center justify-center cursor-pointer bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 px-4 h-[40px] rounded-xl transition-all shadow-lg shadow-purple-500/30 group">
              <span className="text-[14px] leading-[150%]">{t('testimonials.cta')}</span>
              <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
