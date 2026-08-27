// ─── Shared site constants ──────────────────────────────────────────────────

// WhatsApp Business number (international format, no + or spaces for wa.me)
export const WHATSAPP_NUMBER = '40747503708'

// Pre-filled RO message for the WhatsApp CTA
const WHATSAPP_MESSAGE = 'Bună, aș vrea o evaluare operațională pentru afacerea mea.'

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`

// Public contact email
export const CONTACT_EMAIL = 'hello@novusolv.com'

// Free website planner, the entry point of the website line
export const SITE_CRAFTER_URL = 'https://sitecrafter-novusolv.vercel.app/'

// ─── Routes ─────────────────────────────────────────────────────────────────
// Two doors into the business: a website, or an operational assessment.
export const ROUTES = {
  home: '/',
  assessment: '/evaluare-operationala',
  packages: '/pachete',
  website: '/website',
  privacy: '/privacy',
  terms: '/terms',
} as const
