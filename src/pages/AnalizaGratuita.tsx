import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  PhoneCall,
  MessagesSquare,
  Inbox,
  ClipboardList,
  Repeat,
  HelpCircle,
  Clock,
  Globe,
  Layers,
  Wrench,
  Scissors,
  Stethoscope,
  Building2,
  Bot,
  Send,
  Users,
  Check,
  ShieldCheck,
} from 'lucide-react'
import BookCallForm from '../components/BookCallForm'
import CtaButtons from '../components/landing/CtaButtons'
import { WHATSAPP_LINK, CONTACT_EMAIL } from '../lib/constants'
import { trackPixelEvent } from '../lib/analytics'

// ─── Small helpers ──────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-4 text-center max-w-[720px] mx-auto"
    >
      {eyebrow && <p className="text-[#E8630A] font-semibold text-[13px] uppercase tracking-wider">{eyebrow}</p>}
      <h2 className="text-[40px] leading-[115%] max-sm:text-[28px] font-bold text-white">{title}</h2>
      {subtitle && <p className="text-[18px] max-sm:text-[16px] leading-[150%] text-white/70">{subtitle}</p>}
    </motion.div>
  )
}

const cardBase =
  'bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-[#E8630A]/40 hover:bg-white/[0.06] transition-all'

// ─── Content data ───────────────────────────────────────────────────────────
const PAIN_POINTS = [
  { icon: PhoneCall, text: 'Clienții sună când echipa este ocupată.' },
  { icon: MessagesSquare, text: 'Mesajele vin pe WhatsApp, Facebook, email și telefon.' },
  { icon: Inbox, text: 'Unele solicitări rămân fără răspuns.' },
  { icon: ClipboardList, text: 'Programările sau cererile sunt gestionate manual.' },
  { icon: Repeat, text: 'Clienții întreabă aceleași lucruri în fiecare zi.' },
  { icon: HelpCircle, text: 'Nu este clar câte cereri se pierd.' },
  { icon: Clock, text: 'După program, firma nu mai răspunde.' },
  { icon: Globe, text: 'Website-ul există, dar nu aduce solicitări clare.' },
  { icon: Repeat, text: 'Echipa pierde timp cu mesaje repetitive.' },
  { icon: Layers, text: 'Informațiile despre clienți sunt împrăștiate în mai multe locuri.' },
]

const CATEGORIES = [
  {
    icon: Wrench,
    title: 'Service-uri auto și firme tehnice',
    desc: 'Pentru firme unde clienții cer oferte, disponibilitate, programări sau informații tehnice, iar echipa pierde timp cu apeluri și mesaje repetitive.',
    problems: ['cereri incomplete', 'multe apeluri', 'multe mesaje pe WhatsApp', 'timp pierdut cu întrebări repetitive', 'lipsă de urmărire clară a solicitărilor'],
  },
  {
    icon: Scissors,
    title: 'Saloane, SPA și wellness',
    desc: 'Pentru afaceri unde programările, întrebările despre servicii și mesajele clienților trebuie gestionate rapid și clar.',
    problems: ['programări prin mesaje', 'întrebări despre prețuri și disponibilitate', 'clienți care scriu în afara programului', 'echipă ocupată în timpul zilei', 'lipsă de follow-up'],
  },
  {
    icon: Stethoscope,
    title: 'Clinici, cabinete și servicii profesionale',
    desc: 'Pentru firme unde clienții au întrebări înainte de programare, iar echipa are nevoie de un mod mai clar de a prelua solicitările.',
    problems: ['întrebări repetitive', 'solicitări urgente amestecate cu mesaje simple', 'multe apeluri', 'programări gestionate manual', 'lipsă de centralizare'],
  },
  {
    icon: Building2,
    title: 'Firme locale cu multe solicitări',
    desc: 'Pentru orice firmă locală care primește cereri prin mai multe canale și vrea să reducă haosul operațional.',
    problems: ['WhatsApp, email, Facebook și telefon în paralel', 'cereri pierdute', 'răspunsuri întârziate', 'lipsă de evidență', 'clienți care trebuie contactați manual'],
  },
]

const SOLUTIONS = [
  { icon: Globe, title: 'Website orientat spre cereri', desc: 'Un website construit pentru a transforma vizitatorii în solicitări clare, nu doar pentru prezență online.' },
  { icon: ClipboardList, title: 'Formulare inteligente', desc: 'Formulare care colectează informațiile importante înainte ca echipa să piardă timp cu întrebări de bază.' },
  { icon: Bot, title: 'AI assistant pentru întrebări frecvente', desc: 'Un assistant care poate răspunde la întrebări simple despre servicii, program, pași următori sau informații generale.' },
  { icon: Send, title: 'Automatizări WhatsApp / email', desc: 'Solicitările pot ajunge automat la echipa dvs. într-un format mai clar și mai ușor de urmărit.' },
  { icon: Users, title: 'Organizarea leadurilor', desc: 'Cererile pot fi centralizate, etichetate și urmărite mai bine, în loc să rămână împrăștiate în conversații.' },
  { icon: Repeat, title: 'Fluxuri interne simple', desc: 'Reducem sarcinile repetitive prin automatizări mici, clare și utile pentru activitatea zilnică.' },
]

const BEFORE = [
  'Cereri prin telefon, WhatsApp, Facebook și email',
  'Răspunsuri întârziate',
  'Întrebări repetitive',
  'Programări sau solicitări gestionate manual',
  'Informații împrăștiate',
  'Website care nu ajută suficient la conversie',
]

const AFTER = [
  'Cereri colectate mai clar',
  'Răspunsuri mai rapide la întrebări simple',
  'Solicitări trimise automat către echipă',
  'Mai puțin timp pierdut cu mesaje repetitive',
  'Leaduri mai ușor de urmărit',
  'Website conectat la un flux real de lucru',
]

const AUDIT_STEPS = [
  { n: '1', title: 'Înțelegem procesul actual', desc: 'Cum primiți cereri: telefon, WhatsApp, Facebook, email, website sau alte canale.' },
  { n: '2', title: 'Identificăm blocajele', desc: 'Unde apar întârzieri, cereri pierdute, întrebări repetitive sau muncă manuală inutilă.' },
  { n: '3', title: 'Propunem un sistem realist', desc: 'Website, formular, AI assistant, automatizare sau organizare internă, doar dacă are sens pentru firma dvs.' },
  { n: '4', title: 'Stabilim primul pas', desc: 'Nu automatizăm totul din prima. Alegem un proces mic, clar și cu impact potențial ridicat.' },
]

const TRUST_BULLETS = [
  'Abordare practică pentru firme locale',
  'Fără promisiuni exagerate despre AI',
  'Analiză înainte de implementare',
  'Soluții construite în jurul procesului real',
  'Website, AI și automatizare conectate într-un flux clar',
  'Potrivit pentru firme fără echipă tehnică internă',
]

// ─── Page ────────────────────────────────────────────────────────────────────
export default function AnalizaGratuita() {
  const { i18n } = useTranslation()
  const [formSource, setFormSource] = useState<string | null>(null)

  // Force Romanian on this campaign page regardless of browser language
  useEffect(() => {
    i18n.changeLanguage('ro')
  }, [i18n])

  const openForm = (source: string) => setFormSource(source)
  const closeForm = () => setFormSource(null)

  return (
    <div className="bg-[#000814] min-h-screen text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-[#000814]/90 backdrop-blur-xl border-b border-white/10">
        <div className="container flex items-center justify-between h-[68px]">
          <a href="/" aria-label="Novusolv">
            <img src="/logo-white.png" alt="Novusolv" className="h-20 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackPixelEvent('Contact', { source: 'analiza_gratuita_navbar_wa' })}
              className="max-sm:hidden text-[14px] font-medium text-white/70 hover:text-white transition-colors"
            >
              WhatsApp
            </a>
            <button
              onClick={() => openForm('analiza_gratuita_navbar')}
              className="font-semibold flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-2.5 px-5 h-[42px] rounded-xl transition-all text-[14px] shadow-lg shadow-[#E8630A]/20"
            >
              Cereți analiza gratuită
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-[140px] pb-20 max-sm:pt-[120px] max-sm:pb-14 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[55vw] h-[55vw] rounded-full blur-[160px] bg-[#001D3D]/50 pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-[#003566]/30 pointer-events-none" />
        <div className="container relative z-10 flex flex-col items-center text-center gap-8 max-w-[840px]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[52px] lg:text-[60px] leading-[1.1] max-sm:text-[34px] font-bold tracking-tight"
          >
            Firma dvs. pierde cereri pentru că
            <br />
            <span className="bg-gradient-to-r from-[#E8630A] via-[#FF8C2A] to-[#E8630A] bg-clip-text text-transparent">
              răspunde prea târziu?
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[19px] max-sm:text-[17px] leading-[155%] text-white/75 max-w-[680px]"
          >
            Novusolv ajută firmele de servicii să capteze cereri online, să organizeze solicitările venite din mai multe
            canale și să reducă munca repetitivă prin website-uri, asistenți AI și automatizări simple.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CtaButtons onRequest={() => openForm('analiza_gratuita_hero')} waSource="analiza_gratuita_hero_wa" />
          </motion.div>
          <p className="text-[14px] text-white/50 max-w-[520px]">
            Pentru firme locale care vor sisteme practice, nu prezentări complicate despre AI.
          </p>
        </div>
      </section>

      {/* ── Pain points ── */}
      <section className="py-20 max-sm:py-12 relative">
        <div className="container">
          <SectionHeading
            eyebrow="Problema"
            title="Dacă aveți o firmă de servicii, probabil recunoașteți aceste probleme"
          />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-12 max-sm:mt-8">
            {PAIN_POINTS.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.05 }}
                className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex flex-col gap-3"
              >
                <Icon size={20} className="text-[#FF8C2A]" />
                <p className="text-[14px] max-sm:text-[13px] leading-[140%] text-white/80">{text}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-[18px] max-sm:text-[16px] text-white/70 mt-12 max-w-[720px] mx-auto leading-[150%]">
            În multe firme, problema nu este lipsa de muncă.{' '}
            <span className="text-white font-semibold">
              Problema este că solicitările nu intră într-un sistem clar.
            </span>
          </p>
        </div>
      </section>

      {/* ── Where this applies ── */}
      <section className="py-20 max-sm:py-12 relative bg-gradient-to-b from-transparent via-[#001D3D]/40 to-transparent">
        <div className="container">
          <SectionHeading
            eyebrow="Pentru cine"
            title="Pentru ce tipuri de firme este potrivit?"
            subtitle="Novusolv este potrivit pentru firme de servicii care primesc solicitări, programări sau întrebări repetitive și vor să le gestioneze mai clar."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-sm:mt-8">
            {CATEGORIES.map(({ icon: Icon, title, desc, problems }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cardBase}
              >
                <div className="w-11 h-11 rounded-xl bg-[#E8630A]/15 flex items-center justify-center">
                  <Icon size={22} className="text-[#FF8C2A]" />
                </div>
                <h3 className="text-[20px] font-semibold text-white">{title}</h3>
                <p className="text-[15px] leading-[150%] text-white/70">{desc}</p>
                <ul className="flex flex-col gap-1.5 mt-2">
                  {problems.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-[14px] text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8630A] mt-1.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution + compact Before/After ── */}
      <section className="py-20 max-sm:py-12 relative">
        <div className="container">
          <SectionHeading
            eyebrow="Soluția"
            title="Ce poate construi Novusolv pentru firma dvs."
            subtitle="Nu începem cu tehnologia. Începem cu procesul: cum intră cererile, cum răspunde echipa și unde se pierde timp."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-sm:mt-8">
            {SOLUTIONS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className={cardBase}
              >
                <div className="w-11 h-11 rounded-xl bg-[#003566]/40 flex items-center justify-center">
                  <Icon size={22} className="text-[#FF8C2A]" />
                </div>
                <h3 className="text-[18px] font-semibold text-white">{title}</h3>
                <p className="text-[14px] leading-[150%] text-white/70">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Compact Înainte / După */}
          <div className="mt-16 max-sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[880px] mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[13px] uppercase tracking-wider text-white/40 font-semibold mb-4">Înainte</p>
              <ul className="flex flex-col gap-2.5">
                {BEFORE.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-white/60">
                    <span className="text-white/30 mt-0.5 shrink-0">✕</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#E8630A]/30 bg-[#E8630A]/[0.06] p-6">
              <p className="text-[13px] uppercase tracking-wider text-[#FF8C2A] font-semibold mb-4">După</p>
              <ul className="flex flex-col gap-2.5">
                {AFTER.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-white/85">
                    <Check size={16} className="text-[#FF8C2A] mt-0.5 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center text-[13px] text-white/40 mt-6 max-w-[620px] mx-auto">
            Rezultatul exact depinde de procesul actual al firmei. De aceea începem cu o analiză gratuită.
          </p>
        </div>
      </section>

      {/* ── Free audit steps ── */}
      <section className="py-20 max-sm:py-12 relative bg-gradient-to-b from-transparent via-[#001D3D]/40 to-transparent">
        <div className="container">
          <SectionHeading
            eyebrow="Analiza gratuită"
            title="Analiză gratuită pentru firma dvs. de servicii"
            subtitle="Vedem cum primiți cereri acum, unde se pierde timp și ce sistem ar avea cel mai mult sens pentru modul dvs. real de lucru."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-sm:mt-8">
            {AUDIT_STEPS.map(({ n, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] font-bold text-[20px] flex items-center justify-center">
                  {n}
                </div>
                <h3 className="text-[17px] font-semibold text-white">{title}</h3>
                <p className="text-[14px] leading-[150%] text-white/70">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <CtaButtons onRequest={() => openForm('analiza_gratuita_audit_steps')} waSource="analiza_gratuita_audit_wa" />
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="py-20 max-sm:py-12 relative">
        <div className="container max-w-[880px]">
          <SectionHeading eyebrow="De ce Novusolv" title="De ce Novusolv?" />
          <p className="text-center text-[17px] leading-[160%] text-white/70 mt-6">
            Novusolv ajută firmele să transforme solicitările împrăștiate și munca manuală în sisteme mai clare. Nu
            promitem automatizări spectaculoase fără context. Începem cu procesul real al firmei și construim doar ce
            poate aduce valoare practică.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10">
            {TRUST_BULLETS.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/[0.04] border border-white/10 rounded-xl p-4">
                <ShieldCheck size={18} className="text-[#FF8C2A] mt-0.5 shrink-0" />
                <span className="text-[14px] text-white/80">{b}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-[15px] text-white/50 mt-8 italic">
            AI-ul nu este oferta principală. Sistemul operațional este oferta principală.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 max-sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001D3D]/60 to-[#000814]" />
        <div className="container relative z-10 flex flex-col items-center text-center gap-6 max-w-[760px]">
          <h2 className="text-[40px] max-sm:text-[28px] font-bold leading-[115%]">
            Vreți să vedeți dacă firma dvs. poate lucra mai clar?
          </h2>
          <p className="text-[18px] max-sm:text-[16px] text-white/70 leading-[155%]">
            Solicitați o analiză gratuită și identificăm unde se pierd cereri, timp sau energie în procesul actual. Dacă
            AI-ul sau automatizarea are sens, vă arătăm concret cum ar putea fi implementată.
          </p>
          <CtaButtons onRequest={() => openForm('analiza_gratuita_final_cta')} waSource="analiza_gratuita_final_wa" className="mt-2" />
          <p className="text-[14px] text-white/45 mt-2">
            Fără obligații. Fără promisiuni exagerate. Doar o discuție clară despre procesul firmei dvs.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-10">
        <div className="container flex max-sm:flex-col max-sm:gap-6 items-center justify-between">
          <a href="/" aria-label="Novusolv">
            <img src="/logo-white.png" alt="Novusolv" className="h-16 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-6 text-[14px] text-white/50">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <ArrowRight size={14} /> WhatsApp
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">
              {CONTACT_EMAIL}
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">Confidențialitate</a>
            <a href="/terms" className="hover:text-white transition-colors">Termeni</a>
          </div>
        </div>
        <p className="container text-[13px] text-white/30 mt-6">© {new Date().getFullYear()} Novusolv SRL</p>
      </footer>

      {/* ── Booking form modal ── */}
      {formSource && <BookCallForm source={formSource} onClose={closeForm} />}
    </div>
  )
}
