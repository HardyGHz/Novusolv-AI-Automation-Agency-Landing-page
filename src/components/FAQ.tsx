import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

interface FAQItem {
  question: string
  answer: string
}

const getFaqs = (t: TFunction): FAQItem[] => [
  { question: t('faq.q1'), answer: t('faq.a1') },
  { question: t('faq.q2'), answer: t('faq.a2') },
  { question: t('faq.q3'), answer: t('faq.a3') },
  { question: t('faq.q4'), answer: t('faq.a4') },
  { question: t('faq.q5'), answer: t('faq.a5') },
  { question: t('faq.q6'), answer: t('faq.a6') },
  { question: t('faq.q7'), answer: t('faq.a7') },
  { question: t('faq.q8'), answer: t('faq.a8') },
  { question: t('faq.q9'), answer: t('faq.a9') },
]

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <div
        className="bg-surface-card p-5 rounded-xl flex justify-between items-center cursor-pointer hover:bg-outline-default transition-colors"
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
  const { t } = useTranslation()
  const faqs = useMemo(() => getFaqs(t), [t])

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
          <h2 className="text-[48px] leading-[120%] max-sm:text-[32px] font-semibold">{t('faq.title')}</h2>
          <p className="text-[20px] leading-[140%] max-sm:text-[18px] text-body whitespace-pre-line">
            {t('faq.subtitle')}
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
              {t('faq.still_have_questions')}
            </h3>
            <h4 className="text-[20px] leading-[140%] max-sm:text-[18px]">
              {t('faq.ready_to_automate')}{' '}
              <a href="mailto:hello@novusolv.com" className="text-link hover:underline">
                {t('faq.contact_team')}
              </a>
              {' '}{t('faq.or')}{' '}
              <a
                href="#contact"
                className="text-link hover:underline"
              >
                {t('faq.book_discovery')}
              </a>
              .
            </h4>
          </div>
        </div>
      </div>
    </section>
  )
}
