import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is Novusolv?',
    answer: "Novusolv is a specialized AI automation agency. We partner with growing businesses to identify bottlenecks in their workflows and build custom AI-driven solutions that automate repetitive tasks, enhance customer support, and uncover data insights.",
  },
  {
    question: "How long does it take to implement an AI solution?",
    answer: "Most of our core automation setups (like custom CRM integrations or support bots) are deployed within 2 to 4 weeks. Deep, customized LLM training for specific internal data may take 6 to 8 weeks depending on the complexity.",
  },
  {
    question: 'Is our company data secure?',
    answer: "Absolutely. We build all our AI agents and models within your secure environment or using enterprise-grade secure APIs with zero data-retention policies. Your data is never used to train public models.",
  },
  {
    question: 'What kind of ROI can we expect?',
    answer: "While it varies by industry, our clients typically see a 30-40% reduction in manual data entry time within the first month. Our AI sales outreach agents frequently increase qualified lead volume by 2x to 3x.",
  },
  {
    question: 'Do we need technical knowledge to use the automations?',
    answer: "Not at all. We design the automations to work seamlessly in the background or within the tools you already use daily (like Slack, Teams, Salesforce, or your email inbox). We handle the complexity so you don't have to.",
  },
  {
    question: 'Can you work with our custom legacy software?',
    answer: "Yes. If your software has an API, we can connect to it. If it doesn't, we can often deploy secure RPA (Robotic Process Automation) bots to interact with the software interface exactly like a human would.",
  },
  {
    question: 'How do we get started?',
    answer: "It starts with a free 30-minute discovery call where we audit your current workflows. If we see a right fit, we'll present a customized AI implementation roadmap for your business.",
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
    <section className="w-full max-w-4xl mx-auto py-20 max-sm:py-10 relative z-[3]">
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
