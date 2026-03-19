import { motion } from 'framer-motion'

// Integration tools that Novusolv works with
const tools = [
  { name: 'Slack', icon: '💬' },
  { name: 'Salesforce', icon: '☁️' },
  { name: 'HubSpot', icon: '🟠' },
  { name: 'Zapier', icon: '⚡' },
  { name: 'OpenAI', icon: '🤖' },
  { name: 'Google Sheets', icon: '📊' },
  { name: 'Notion', icon: '📝' },
  { name: 'Airtable', icon: '📋' },
  { name: 'Shopify', icon: '🛒' },
  { name: 'Zendesk', icon: '🎧' },
  { name: 'Stripe', icon: '💳' },
  { name: 'Intercom', icon: '💬' },
  { name: 'Make', icon: '🔧' },
  { name: 'GitHub', icon: '🐙' },
]

export default function LogoMarquee() {
  return (
    <div className="py-20 max-sm:py-10 max-w-[1920px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-[2]"
      >
        <div className="text-center flex flex-col gap-6 max-sm:gap-4">
          <div className="container flex flex-col gap-2">
            <p className="text-purple-600 font-semibold text-[14px] uppercase tracking-wider">Integrations</p>
            <h2 className="text-[28px] leading-[140%] max-sm:text-[22px] font-bold w-[600px] mx-auto max-sm:w-full text-heading">
              We connect with the tools you already use
            </h2>
            <p className="text-body text-[16px] max-sm:text-[14px]">
              Seamless integration with 50+ platforms and growing
            </p>
          </div>

          {/* Tool marquee */}
          <div className="overflow-hidden mt-4">
            <div className="flex animate-marquee-left" style={{ width: `calc(200px * ${tools.length * 2})` }}>
              {[...tools, ...tools].map((tool, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center w-[200px] h-[64px] flex-shrink-0 mx-2"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 cursor-default">
                    <span className="text-[20px]">{tool.icon}</span>
                    <span className="text-gray-700 font-semibold text-[14px]">{tool.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
