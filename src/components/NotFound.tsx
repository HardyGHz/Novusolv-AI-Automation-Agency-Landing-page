import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#000814] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] bg-[#E8630A]/10 pointer-events-none" />

      <div className="relative z-10 text-center max-w-[560px]">
        <p className="text-[#E8630A] font-bold text-[80px] max-sm:text-[60px] leading-none mb-6">404</p>
        <h1 className="text-white text-[32px] max-sm:text-[26px] font-bold mb-3">
          {t('not_found.title')}
        </h1>
        <p className="text-white/70 text-[17px] leading-relaxed mb-10">
          {t('not_found.subtitle')}
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 font-semibold bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-8 h-[52px] rounded-xl transition-all shadow-xl shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 text-[16px]"
        >
          <ArrowLeft size={18} />
          {t('not_found.cta')}
        </a>
      </div>
    </div>
  )
}
