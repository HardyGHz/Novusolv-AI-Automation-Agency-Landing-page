import { ArrowRight } from 'lucide-react'
import { WHATSAPP_LINK } from '../../lib/constants'
import { trackPixelEvent } from '../../lib/analytics'

// WhatsApp glyph (Phosphor-style, matches the site's icon set)
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L42,215l11.27-33.36a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Zm48.37-60.35c-2.6-1.3-15.37-7.58-17.75-8.45s-4.11-1.3-5.84,1.3-6.71,8.45-8.23,10.19-3,1.95-5.63.65a72,72,0,0,1-21.18-13.07,80,80,0,0,1-14.66-18.25c-1.53-2.61-.16-4,1.14-5.31s2.6-3,3.9-4.55a17.53,17.53,0,0,0,2.6-4.33,4.78,4.78,0,0,0-.22-4.55c-.65-1.3-5.84-14.07-8-19.27s-4.23-4.38-5.84-4.46-3.25-.09-5-.09a9.56,9.56,0,0,0-6.93,3.25c-2.38,2.6-9.09,8.88-9.09,21.65s9.3,25.11,10.6,26.85,18.3,27.94,44.34,39.18a149.36,149.36,0,0,0,14.8,5.47c6.22,2,11.87,1.7,16.34,1a26.6,26.6,0,0,0,17.32-12.2c2.16-3.9,2.16-7.24,1.51-7.94S179,157,176.37,155.69Z" />
    </svg>
  )
}

interface CtaButtonsProps {
  /** Opens the booking form modal with this attribution source. */
  onRequest: () => void
  /** Attribution tag used for the WhatsApp pixel event. */
  waSource: string
  /** 'default' = navy background, 'onLight' = for light card sections. */
  variant?: 'default' | 'onLight'
  className?: string
}

export default function CtaButtons({ onRequest, waSource, variant = 'default', className = '' }: CtaButtonsProps) {
  const secondaryClass =
    variant === 'onLight'
      ? 'border border-outline-default text-heading hover:bg-outline-default/10'
      : 'border border-white/20 text-white hover:bg-white/10'

  return (
    <div className={`flex gap-4 max-sm:flex-col ${className}`}>
      <button
        onClick={onRequest}
        className="font-semibold flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-8 h-[52px] rounded-xl transition-all shadow-xl shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 group text-[16px] max-sm:w-full"
      >
        Cereți analiza gratuită
        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackPixelEvent('Contact', { source: waSource })}
        className={`font-semibold flex items-center justify-center cursor-pointer py-3 px-8 h-[52px] rounded-xl transition-all text-[16px] max-sm:w-full gap-2 hover:-translate-y-0.5 ${secondaryClass}`}
      >
        <WhatsAppIcon />
        Scrieți-ne pe WhatsApp
      </a>
    </div>
  )
}
