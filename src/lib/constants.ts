// ─── Shared site constants ──────────────────────────────────────────────────

// WhatsApp Business number (international format, no + or spaces for wa.me)
export const WHATSAPP_NUMBER = '40747503708'

// Pre-filled RO message for the WhatsApp CTA
const WHATSAPP_MESSAGE = 'Bună, aș vrea o analiză gratuită pentru afacerea mea.'

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`

// Public contact email
export const CONTACT_EMAIL = 'hello@novusolv.com'
