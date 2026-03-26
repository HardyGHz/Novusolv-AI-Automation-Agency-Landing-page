import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What exactly does Novusolv do?',
    answer: "Novusolv is an AI automation agency based in Cluj-Napoca. We partner with growing businesses to map their existing workflows, identify where time and money are being lost, and build custom AI-driven systems that handle the repetitive work — so your team can focus on what actually moves the needle.",
  },
  {
    question: "How quickly can I see results?",
    answer: "For most engagements, the first automations go live within 2 to 4 weeks. Simpler setups like support bots or CRM integrations can often be done faster. Deep custom AI model training takes 6 to 8 weeks depending on data complexity — but we always aim to show you a working prototype in the first two weeks.",
  },
  {
    question: 'Is our data safe with you?',
    answer: "Absolutely. We build within your secure environment and use zero data-retention APIs. Your data is never used to train public AI models. We sign NDAs from day one and treat security as a non-negotiable, not an afterthought.",
  },
  {
    question: 'What ROI can we realistically expect?',
    answer: "Our clients typically reclaim 100+ hours per month in manual labour within the first 30 days — time that gets redirected to growth activities. On the revenue side, AI-powered lead systems have helped clients double their qualified pipeline. Your mileage will vary, which is why we start every project with a free audit to set realistic expectations together.",
  },
  {
    question: 'Do we need a technical team to work with you?',
    answer: "No. We plug the automations into the tools you already use — Slack, email, your CRM, or whatever's in your stack. Everything is designed to run in the background. If you can click a button, you can use what we build.",
  },
  {
    question: 'What if our software is old or doesn\'t have an API?',
    answer: "That\'s actually where we shine. If there\'s no API, we deploy RPA bots that interact with the interface exactly like a human would — clicking, reading, and filling in data — with zero need for software upgrades.",
  },
  {
    question: 'How do we get started?',
    answer: "It starts with a free 30-minute discovery call. We\'ll audit your current workflows, identify the highest-leverage automation opportunities, and if we\'re a good fit, deliver a clear implementation roadmap. No commitment required.",
  },
]

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <div
        className="bg-surface-card p-5 rounded-xl flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
      >
        <p className="text-[16px] leading-[150%] font-medium pr-4">{item.question}</p>
        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3">
              <p className="text-[14px] leading-[180%] text-body">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="w-full max-w-4xl mx-auto py-20 max-sm:py-10 relative z-[3]">
      <div className="container flex flex-col gap-16 max-sm:gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center flex flex-col gap-4"
        >
          <h2 className="text-[48px] leading-[120%] max-sm:text-[32px] font-semibold">FAQs</h2>
          <p className="text-[20px] leading-[140%] max-sm:text-[18px] text-body">
            We make AI integration seamless for your business.
            <br />
            Here are our most common questions and answers.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="max-w-3xl w-full max-sm:w-full flex flex-col gap-5 mx-auto">
          {faqs.map((faq, i) => (
            <FAQAccordion key={i} item={faq} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="flex flex-col gap-5 text-center">
          <div className="flex flex-col gap-2">
            <h3 className="text-[32px] leading-[130%] max-sm:text-[24px] font-medium">
              Still have questions?
            </h3>
            <h4 className="text-[20px] leading-[140%] max-sm:text-[18px]">
              Ready to automate your workflows?{' '}
              <a href="mailto:hello@novusolv.com" className="text-link hover:underline">
                Contact our team
              </a>
              {' '}or{' '}
              <a
                href="#contact"
                className="text-link hover:underline"
              >
                book a discovery call
              </a>
              .
            </h4>
          </div>
        </div>
      </div>
    </section>
  )
}
