import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Terms() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-[#FFC300] hover:text-[#FFD60A] mb-10 font-medium">
          <ArrowLeft size={16} /> {t('common.back_to_home')}
        </a>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 26, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement</h2>
            <p>By accessing or using novusolv.com ("the Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site. These terms are governed by Romanian law and applicable EU regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Services</h2>
            <p>Novusolv SRL provides AI automation consulting and implementation services to businesses. The scope, timeline, and pricing of any engagement are defined in a separate contract or statement of work signed by both parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Intellectual Property</h2>
            <p>All website content (text, visuals, code, branding) is owned by Novusolv SRL. You may not copy, reproduce, or distribute any content without written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Disclaimer</h2>
            <p>The Site is provided "as is." We make no warranties regarding uptime, accuracy, or fitness for a particular purpose. Results mentioned on the Site (e.g., "100+ hours saved/month") are based on client averages and are not guaranteed for every engagement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Novusolv SRL shall not be liable for any indirect, incidental, or consequential damages arising from use of the Site or our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:hello@novusolv.com" className="text-[#FFC300] hover:underline">hello@novusolv.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
