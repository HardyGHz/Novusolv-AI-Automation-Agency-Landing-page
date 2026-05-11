import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

interface FeatureSection {
  id: string
  navLabel: string
  title: string
  titleBold: string
  description: string
  stepsLabel: string
  steps: Array<{ number: string; text: string; isSpecial?: boolean }>
  cta: string
}

const getSections = (t: TFunction): FeatureSection[] => [
  {
    id: 'custom-models',
    navLabel: t('nav.custom_models'),
    title: t('how_it_works.custom_models_title'),
    titleBold: t('how_it_works.custom_models_bold'),
    description: t('how_it_works.custom_models_desc'),
    stepsLabel: t('how_it_works.custom_models_steps_label'),
    steps: [
      { number: '1.1', text: t('how_it_works.custom_models_step_1') },
      { number: '1.2', text: t('how_it_works.custom_models_step_2') },
      { number: '1.3', text: t('how_it_works.custom_models_step_3') },
      { number: '1.4', text: t('how_it_works.custom_models_step_4') },
      { number: '', text: t('how_it_works.custom_models_step_special'), isSpecial: true },
    ],
    cta: t('how_it_works.custom_models_cta'),
  },
  {
    id: 'workflow-automation',
    navLabel: t('nav.workflow'),
    title: t('how_it_works.workflow_title'),
    titleBold: t('how_it_works.workflow_bold'),
    description: t('how_it_works.workflow_desc'),
    stepsLabel: t('how_it_works.workflow_steps_label'),
    steps: [
      { number: '2.1', text: t('how_it_works.workflow_step_1') },
      { number: '2.2', text: t('how_it_works.workflow_step_2') },
      { number: '2.3', text: t('how_it_works.workflow_step_3') },
      { number: '2.4', text: t('how_it_works.workflow_step_4') },
    ],
    cta: t('how_it_works.workflow_cta'),
  },
  {
    id: 'customer-support',
    navLabel: t('nav.customer_support'),
    title: t('how_it_works.support_title'),
    titleBold: t('how_it_works.support_bold'),
    description: t('how_it_works.support_desc'),
    stepsLabel: t('how_it_works.support_steps_label'),
    steps: [
      { number: '3.1', text: t('how_it_works.support_step_1') },
      { number: '3.2', text: t('how_it_works.support_step_2') },
      { number: '3.3', text: t('how_it_works.support_step_3') },
      { number: '3.4', text: t('how_it_works.support_step_4') },
    ],
    cta: t('how_it_works.support_cta'),
  },
  {
    id: 'data-insights',
    navLabel: t('nav.data_insights'),
    title: t('how_it_works.data_title'),
    titleBold: t('how_it_works.data_bold'),
    description: t('how_it_works.data_desc'),
    stepsLabel: t('how_it_works.data_steps_label'),
    steps: [
      { number: '4.1', text: t('how_it_works.data_step_1') },
      { number: '4.2', text: t('how_it_works.data_step_2') },
      { number: '4.3', text: t('how_it_works.data_step_3') },
      { number: '4.4', text: t('how_it_works.data_step_4') },
    ],
    cta: t('how_it_works.data_cta'),
  },
]

function FeatureCard({ section, onInView }: { section: FeatureSection; onInView: (id: string) => void }) {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.3, rootMargin: '-100px 0px -40% 0px' })

  useEffect(() => {
    if (isInView) {
      onInView(section.id)
    }
  }, [isInView, section.id, onInView])

  return (
    <motion.section
      ref={ref}
      id={section.id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-surface-card p-8 rounded-2xl max-sm:p-5 border border-gray-100"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[32px] leading-[130%] max-sm:text-[24px] font-semibold text-heading">
              {section.title}
              <br />
              {section.titleBold}
            </h2>
          </div>
          <div className="border-t border-outline-default" />
          <p className="text-[16px] text-body leading-relaxed">{section.description}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[14px] leading-[150%] text-body uppercase">{section.stepsLabel}</p>
          <ul className="flex flex-col">
            {section.steps.map((step, i) => (
              <li
                key={i}
                className="flex items-center gap-5 max-sm:gap-4 relative py-3 border-b border-dashed border-emphasis-low"
              >
                <p className="text-[14px] leading-[150%] text-heading min-w-[2.5rem]">
                  {step.isSpecial ? (
                    <Sparkles size={20} className="text-[#FFC300]" />
                  ) : (
                    step.number
                  )}
                </p>
                <div className="flex-1">
                  <p className="text-[14px] leading-[150%] text-heading">{step.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex">
          <a href="#contact" className="w-max">
            <button className="font-medium flex w-full items-center justify-center cursor-pointer bg-gradient-to-r from-[#FFC300] to-[#FFD60A] text-[#000814] hover:from-[#E5AF00] hover:to-[#E5C009] py-2 px-4 h-[40px] rounded-xl transition-all shadow-md shadow-[#FFC300]/20 group">
              <span className="text-[14px] leading-[150%]">{section.cta}</span>
              <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
        </div>
      </div>
    </motion.section>
  )
}

export default function HowItWorks() {
  const { t } = useTranslation()
  const sections = useMemo(() => getSections(t), [t])

  const [activeSection, setActiveSection] = useState('custom-models')
  const activeSectionRef = useRef(activeSection)

  // Keep ref in sync for the callback
  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  const handleSectionInView = (id: string) => {
    setActiveSection(id)
  }

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="w-full relative z-[3]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-20 max-sm:pb-10 pb-20">
          <div className="flex flex-col flex-1 gap-6 lg:gap-12">
            {/* Header banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 max-sm:p-4 lg:p-16 flex-1 overflow-hidden relative"
            >
              {/* Background */}
              <div className="w-full h-full absolute inset-0 rounded-2xl bg-gradient-to-br from-[#000814] via-[#001D3D] to-[#003566]" />
              <div className="relative flex flex-col gap-4 lg:gap-6 z-[1]">
                <div>
                  <p className="text-[#FFC300] font-semibold text-[14px] uppercase tracking-wider mb-3">{t('how_it_works.our_services')}</p>
                  <h2 className="text-[48px] leading-[120%] max-sm:text-[32px] text-white">
                    {t('how_it_works.title_1')}
                  </h2>
                  <h2 className="text-[48px] leading-[120%] max-sm:text-[32px] text-white font-bold">
                    {t('how_it_works.title_2_manual')}{' '}
                    <ArrowRight className="inline-block" size={32} strokeWidth={1.5} color="#ADB5BD" />{' '}
                    {t('how_it_works.title_2_auto')}
                  </h2>
                </div>
                <p className="text-[16px] leading-[150%] text-white/80 w-full lg:w-6/12 font-medium">
                  {t('how_it_works.description')}
                </p>
              </div>
            </motion.div>

            {/* Content area with sidebar nav */}
            <div className="flex max-lg:flex-col gap-8 lg:gap-16">
              {/* Sidebar navigation */}
              <div className="max-sm:hidden w-full lg:w-[160px] flex-shrink-0 sticky top-[160px] lg:bg-transparent h-fit z-10">
                <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible max-sm:gap-4">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={clsx(
                        'flex items-center gap-2 cursor-pointer py-3 px-2 relative border-b border-dashed border-outline-default whitespace-nowrap transition-all duration-300',
                        activeSection === section.id ? 'opacity-100' : 'opacity-30 hover:opacity-60'
                      )}
                    >
                      <div className={clsx(
                        'w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300',
                        activeSection === section.id ? 'bg-[#FFC300] scale-125' : 'bg-heading'
                      )} />
                      <p className={clsx(
                        'text-[16px] leading-[150%] font-semibold grow transition-colors duration-300',
                        activeSection === section.id ? 'text-[#FFC300]' : 'text-heading'
                      )}>{section.navLabel}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile horizontal nav */}
              <div className="sm:hidden sticky top-[72px] border border-x-0 border-outline-default px-3 bg-surface-default z-[1] -mx-4">
                <div className="flex flex-row overflow-x-auto gap-4">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={clsx(
                        'flex items-center gap-2 cursor-pointer py-3 px-2 whitespace-nowrap transition-all duration-300',
                        activeSection === section.id ? 'opacity-100' : 'opacity-30'
                      )}
                    >
                      <div className={clsx(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        activeSection === section.id ? 'bg-[#FFC300]' : 'bg-heading'
                      )} />
                      <p className={clsx(
                        'text-[16px] leading-[150%] font-semibold',
                        activeSection === section.id ? 'text-[#FFC300]' : ''
                      )}>{section.navLabel}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature cards with image */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* Sticky image */}
                <div className="max-sm:hidden relative flex justify-center items-center w-[558px] max-xl:w-[300px] h-[300px] lg:h-[600px] lg:sticky lg:top-[18vh] order-2 lg:order-1">
                  <div className="w-full max-lg:max-w-[300px] max-w-[500px] h-full relative rounded-2xl overflow-hidden shadow-2xl shadow-[#FFC300]/10">
                    <img src="/feature-1 datapipeline.png" alt="AI Automation Dashboard" className="w-full h-full object-cover" />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>

                {/* Feature sections */}
                <div className="flex-1 flex flex-col gap-6 lg:gap-12 order-1 lg:order-2">
                  {sections.map((section) => (
                    <FeatureCard key={section.id} section={section} onInView={handleSectionInView} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
