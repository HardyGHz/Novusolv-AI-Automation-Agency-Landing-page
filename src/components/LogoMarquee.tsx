import { 
  Slack, 
  Github, 
  Database, 
  Bot, 
  Zap, 
  Layout, 
  Cpu, 
  Layers, 
  Search,
  Mail,
  Link,
  Sparkles
} from 'lucide-react'

import { useTranslation } from 'react-i18next'

// Updated tools list based on user request
const tools = [
  { name: 'ChatGPT', icon: <Bot size={20} /> },
  { name: 'Gemini', icon: <Sparkles size={20} className="text-blue-400" /> },
  { name: 'Claude', icon: <Cpu size={20} /> },
  { name: 'n8n', icon: <Link size={20} /> },
  { name: 'Supabase', icon: <Database size={20} className="text-emerald-500" /> },
  { name: 'Pinecone', icon: <Layers size={20} className="text-white" /> },
  { name: 'Perplexity', icon: <Search size={20} /> },
  { name: 'LinkedIn', icon: <Layers size={20} /> },
  { name: 'Instagram', icon: <Layers size={20} /> },
  { name: 'Slack', icon: <Slack size={20} /> },
  { name: 'GitHub', icon: <Github size={20} /> },
  { name: 'Zapier', icon: <Zap size={20} /> },
  { name: 'Notion', icon: <Layout size={20} /> },
  { name: 'Airtable', icon: <Database size={20} /> },
  { name: 'Proton Mail', icon: <Mail size={20} /> },
]

export default function LogoMarquee() {
  const { t } = useTranslation()

  return (
    <div className="pt-24 pb-10 max-sm:pt-16 max-sm:pb-6 mb-24 max-sm:mb-16 w-full overflow-hidden relative z-10 bg-[#0a0a0a] border-b border-white/5">
      <div className="text-center flex flex-col max-w-[1920px] mx-auto">
        <div className="container flex flex-col gap-2">
          <p className="text-[#E8630A] font-semibold text-[14px] uppercase tracking-wider">{t('integrations.title')}</p>
          <h2 className="text-[28px] leading-[140%] max-sm:text-[22px] font-bold w-[600px] mx-auto max-sm:w-full text-white">
            {t('integrations.heading')}
          </h2>
          <p className="text-white/60 text-[16px] max-sm:text-[14px]">
            {t('integrations.subtitle')}
          </p>
        </div>

        <div className="marquee-mask mt-16 max-sm:mt-10">
          <div className="flex w-max animate-marquee-left">
            {/* EXACTLY DOUBLE the list for a mathematically perfect loop */}
            {[...tools, ...tools].map((tool, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-4 w-[240px] flex-shrink-0 text-slate-400 opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default"
              >
                <div className="flex-shrink-0">
                  {tool.icon}
                </div>
                <span className="text-[15px] font-medium tracking-tight whitespace-nowrap">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
