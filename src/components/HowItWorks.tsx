import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import clsx from 'clsx'

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

const sections: FeatureSection[] = [
  {
    id: 'custom-models',
    navLabel: 'Custom AI',
    title: 'Custom AI Models',
    titleBold: 'Trained on your data.',
    description:
      "We build tailored AI models that understand your specific business context, terminology, and procedures. No generic answers, just highly accurate assistance.",
    stepsLabel: 'How we do it:',
    steps: [
      { number: '1.1', text: 'Deep dive into your business operations' },
      { number: '1.2', text: 'Gather and securely process your training data' },
      { number: '1.3', text: 'Fine-tune LLMs specifically for your use case' },
      { number: '1.4', text: 'Rigorous testing against your quality standards' },
      { number: '', text: "Deploy a model that thinks like your best employee!", isSpecial: true },
    ],
    cta: 'Discuss custom AI',
  },
  {
    id: 'workflow-automation',
    navLabel: 'Workflows',
    title: 'Workflow Automation',
    titleBold: 'End repetitive tasks.',
    description:
      'Connect your favorite tools and let AI handle the routine data entry, email sorting, and reporting. Free up your human talent for creative problem solving.',
    stepsLabel: 'Automated processes:',
    steps: [
      { number: '2.1', text: 'Invoice processing and data extraction' },
      { number: '2.2', text: 'CRM updates and lead enrichment' },
      { number: '2.3', text: 'Automated email drafting and sorting' },
      { number: '2.4', text: 'Daily and weekly performance reporting' },
    ],
    cta: 'Automate your work',
  },
  {
    id: 'customer-support',
    navLabel: '24/7 Support',
    title: 'Intelligent Support',
    titleBold: 'Never miss a lead.',
    description:
      'Deploy smart chatbots and email assistants that resolve 80% of tier 1 support tickets instantly, across all your communication channels.',
    stepsLabel: 'Support features:',
    steps: [
      { number: '3.1', text: 'Multi-language instant response' },
      { number: '3.2', text: 'Seamless human handoff when needed' },
      { number: '3.3', text: 'Integration with Zendesk, Intercom, etc.' },
      { number: '3.4', text: 'Continuous learning from past tickets' },
    ],
    cta: 'Upgrade your support',
  },
  {
    id: 'data-insights',
    navLabel: 'Analytics',
    title: 'Data Insights',
    titleBold: 'Predict the future.',
    description:
      'Turn overwhelming spreadsheets into actionable insights. Our AI models identify trends, forecast sales, and find revenue opportunities hidden in your data.',
    stepsLabel: 'Analytics capabilities:',
    steps: [
      { number: '4.1', text: 'Predictive sales and inventory forecasting' },
      { number: '4.2', text: 'Customer churn risk analysis' },
      { number: '4.3', text: 'Natural language database querying' },
      { number: '4.4', text: 'Real-time anomaly detection' },
    ],
    cta: 'Unlock your data',
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
                    <Sparkles size={20} className="text-purple-500" />
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
          <button className="font-medium flex w-max items-center justify-center cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 py-2 px-4 h-[40px] rounded-xl transition-all shadow-md shadow-purple-500/20 group">
            <span className="text-[14px] leading-[150%]">{section.cta}</span>
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.section>
  )
}

export default function HowItWorks() {
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
              <div className="w-full h-full absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" />
              <div className="relative flex flex-col gap-4 lg:gap-6 z-[1]">
                <div>
                  <p className="text-purple-300 font-semibold text-[14px] uppercase tracking-wider mb-3">Our Services</p>
                  <h2 className="text-[48px] leading-[120%] max-sm:text-[32px] text-white">
                    How Novusolv helps you
                  </h2>
                  <h2 className="text-[48px] leading-[120%] max-sm:text-[32px] text-white font-bold">
                    Manual work in{' '}
                    <ArrowRight className="inline-block" size={32} strokeWidth={1.5} color="#ADB5BD" />{' '}
                    Automated scalability out
                  </h2>
                </div>
                <p className="text-[16px] leading-[150%] text-white/80 w-full lg:w-6/12 font-medium">
                  We analyze your current operations, identify bottlenecks, and deploy custom AI solutions that save you hundreds of hours per month. Focus on growth, let AI handle the rest.
                </p>
              </div>
            </motion.div>

            {/* Content area with sidebar nav */}
            <div className="flex max-lg:flex-col gap-4">
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
                        activeSection === section.id ? 'bg-purple-600 scale-125' : 'bg-heading'
                      )} />
                      <p className={clsx(
                        'text-[16px] leading-[150%] font-semibold grow transition-colors duration-300',
                        activeSection === section.id ? 'text-purple-600' : 'text-heading'
                      )}>{section.navLabel}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile horizontal nav */}
              <div className="sm:hidden sticky top-[55px] border border-x-0 border-outline-default px-3 bg-white z-[1] -mx-4">
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
                        activeSection === section.id ? 'bg-purple-600' : 'bg-heading'
                      )} />
                      <p className={clsx(
                        'text-[16px] leading-[150%] font-semibold',
                        activeSection === section.id ? 'text-purple-600' : ''
                      )}>{section.navLabel}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature cards with image */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* Sticky image */}
                <div className="max-sm:hidden relative flex justify-center items-center w-[558px] max-xl:w-[300px] h-[300px] lg:h-[600px] lg:sticky lg:top-32 order-2 lg:order-1">
                  <div className="w-full max-lg:max-w-[300px] max-w-[500px] h-full relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10">
                    <img src="/feature-1.png" alt="AI Automation Dashboard" className="w-full h-full object-cover" />
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
