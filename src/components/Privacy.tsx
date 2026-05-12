import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Privacy() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-[#E8630A] hover:text-[#FF8C2A] mb-10 font-medium">
          <ArrowLeft size={16} /> {t('common.back_to_home')}
        </a>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 26, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Who We Are</h2>
            <p>Novusolv SRL is an AI automation agency registered in Romania, Cluj-Napoca. We operate the website novusolv.com. For any privacy-related queries, contact us at: <a href="mailto:hello@novusolv.com" className="text-[#E8630A] hover:underline">hello@novusolv.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Data We Collect</h2>
            <p>We collect information you voluntarily provide when filling out our contact or booking form:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Full name and email address</li>
              <li>Company name and business description</li>
              <li>Any message content you submit</li>
            </ul>
            <p className="mt-3">We do not collect sensitive personal data and we do not use tracking cookies beyond what is strictly necessary for the website to function.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <p>Your data is used exclusively to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Respond to your inquiry or schedule a discovery call</li>
              <li>Send relevant updates if you have subscribed to our newsletter</li>
            </ul>
            <p className="mt-3">We never sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Legal Basis (GDPR)</h2>
            <p>We process your data based on your explicit consent (Art. 6(1)(a) GDPR) when you submit a form, and on our legitimate interest (Art. 6(1)(f) GDPR) to respond to business inquiries.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
            <p>We retain contact form submissions for up to 12 months, after which they are deleted. You may request deletion at any time by emailing us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p>Under GDPR you have the right to: access, correct, delete, or restrict the processing of your data. To exercise these rights, email <a href="mailto:hello@novusolv.com" className="text-[#E8630A] hover:underline">hello@novusolv.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Third-Party Services</h2>
            <p>Our website is hosted on Vercel (USA). Form submissions may be stored via our backend service (Supabase). Both providers are GDPR-compliant and process data under standard contractual clauses.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p>We may update this policy. Changes will be posted on this page with an updated date.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
