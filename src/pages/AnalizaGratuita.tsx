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
  TrendingUp,
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
  { icon: Inbox, text: 'Inboxul e plin de cereri care așteaptă răspuns.' },
  { icon: MessagesSquare, text: 'Cererile vin din email, WhatsApp și formulare, fără un flux unificat.' },
  { icon: ClipboardList, text: 'Taskurile repetitive ocupă timpul echipei în loc de muncă cu valoare.' },
  { icon: HelpCircle, text: 'Nu este clar câte cereri se pierd sau întârzie.' },
  { icon: Clock, text: 'Aprobările interne durează zile, nu ore.' },
  { icon: Repeat, text: 'Aceleași procese se repetă manual, săptămână de săptămână.' },
  { icon: Layers, text: 'Informațiile sunt împrăștiate în mai multe tooluri deconectate.' },
  { icon: Globe, text: 'Rapoartele se fac manual, în loc să fie disponibile în timp real.' },
  { icon: PhoneCall, text: 'Echipa e ocupată cu operațional, nu cu creșterea afacerii.' },
  { icon: Building2, text: 'Nimeni nu are o imagine unificată asupra a ce se întâmplă în companie.' },
]

const CATEGORIES = [
  {
    icon: TrendingUp,
    title: 'Companii care au crescut rapid',
    desc: 'Echipa s-a extins, dar procesele au rămas aceleași ca la început.',
    problems: ['volum de cereri în creștere', 'procese care nu mai scalează', 'muncă manuală care ține tot mai greu pasul', 'lipsă de vizibilitate asupra operațiunilor', 'echipă suprasolicitată cu taskuri repetitive'],
  },
  {
    icon: Layers,
    title: 'Echipe cu sisteme deconectate',
    desc: 'Datele și cererile sunt împrăștiate în mai multe tooluri care nu comunică între ele.',
    problems: ['CRM, email, WhatsApp și foi de calcul separate', 'informații duplicate sau pierdute', 'rapoarte făcute manual din surse diferite', 'timp pierdut cu copiere de date între sisteme', 'lipsă de o sursă unică de adevăr'],
  },
  {
    icon: ClipboardList,
    title: 'Operațiuni blocate de aprobări și taskuri manuale',
    desc: 'Cererile interne și externe așteaptă zile întregi pentru un răspuns sau o aprobare.',
    problems: ['aprobări care durează zile, nu ore', 'taskuri repetitive fără automatizare', 'cereri care se pierd între departamente', 'echipa reacționează, nu anticipează', 'blocaje greu de identificat din exterior'],
  },
  {
    icon: Building2,
    title: 'Companii fără o infrastructură AI reală',
    desc: 'Au încercat un chatbot sau un tool izolat, dar nimic nu s-a conectat la procesele reale.',
    problems: ['AI folosit izolat, fără integrare', 'unelte care nu vorbesc cu sistemele existente', 'automatizări superficiale, fără impact măsurabil', 'lipsă de strategie clară pentru AI', 'nevoie de un partener, nu doar un tool'],
  },
]

const SOLUTIONS = [
  { icon: Globe, title: 'Vizibilitate operațională', desc: 'O imagine clară asupra proceselor reale: unde intră cererile, cine le procesează și unde se blochează.' },
  { icon: ClipboardList, title: 'Fluxuri de aprobare automatizate', desc: 'Cererile interne și externe ajung direct la persoana potrivită, fără e-mailuri pierdute sau urmăriri manuale.' },
  { icon: Bot, title: 'AI integrat în procesele reale', desc: 'Nu un chatbot izolat, ci AI conectat la datele și sistemele pe care le folosești deja.' },
  { icon: Send, title: 'Automatizarea taskurilor repetitive', desc: 'Raportare, sincronizare de date și follow-up-uri care rulează automat, fără intervenție manuală.' },
  { icon: Users, title: 'Organizarea cererilor și a leadurilor', desc: 'Solicitările sunt centralizate, etichetate și urmărite într-un singur loc, nu împrăștiate în conversații.' },
  { icon: Repeat, title: 'Fluxuri interne simplificate', desc: 'Reducem sarcinile repetitive prin automatizări mici, clare, construite în jurul modului real de lucru al echipei.' },
]

const BEFORE = [
  'Cereri și taskuri împrăștiate în email, WhatsApp și foi de calcul',
  'Aprobări și taskuri interne care durează zile',
  'Rapoarte făcute manual, din surse diferite',
  'Procese repetitive rezolvate manual, mereu de la zero',
  'Informații împrăștiate, fără o sursă unică de adevăr',
  'Echipa reacționează la haos, în loc să crească',
]

const AFTER = [
  'Cereri colectate și direcționate automat',
  'Aprobări și taskuri interne rezolvate în ore, nu zile',
  'Rapoarte disponibile în timp real',
  'Procese repetitive automatizate, cu AI integrat real',
  'O sursă unică de adevăr pentru toată echipa',
  'Echipa se concentrează pe creștere, nu pe operațional',
]

const AUDIT_STEPS = [
  { n: '1', title: 'Înțelegem procesul actual', desc: 'Cum circulă cererile și informația prin companie: email, formulare, taskuri interne, aprobări, rapoarte.' },
  { n: '2', title: 'Identificăm blocajele', desc: 'Unde apar întârzieri, cereri pierdute, taskuri repetitive sau muncă manuală inutilă.' },
  { n: '3', title: 'Propunem un sistem realist', desc: 'Automatizare, AI integrat, dashboard de vizibilitate sau reorganizare de proces, doar ce are sens real pentru compania dvs.' },
  { n: '4', title: 'Stabilim primul pas', desc: 'Nu automatizăm totul din prima. Alegem un proces mic, clar și cu impact potențial ridicat.' },
]

const TRUST_BULLETS = [
  '100+ ore salvate în medie pe lună',
  '20% reducere medie de costuri operaționale',
  '99.9% acuratețe pe taskurile automatizate',
  'Analiză înainte de implementare, fără promisiuni exagerate',
  'Soluții construite în jurul procesului real, nu al unui tool generic',
  'AI, automatizare și date conectate într-un flux unificat',
]

// ─── Page ────────────────────────────────────────────────────────────────────
export default function AnalizaGratuita() {
  const { i18n } = useTranslation()
  const [formSource, setFormSource] = useState<string | null>(null)

  // Force Romanian on this campaign page regardless of browser language
  useEffect(() => {
    i18n.changeLanguage('ro')
  }, [i18n])

  // Ad-only landing page, no organic entry point → keep it out of search results
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

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
              Evaluare operațională gratuită
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
            Majoritatea companiilor nu au nevoie
            <br />
            de încă un tool AI. Au nevoie de{' '}
            <span className="bg-gradient-to-r from-[#E8630A] via-[#FF8C2A] to-[#E8630A] bg-clip-text text-transparent">
              claritate operațională.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[19px] max-sm:text-[17px] leading-[155%] text-white/75 max-w-[680px]"
          >
            Identificăm unde se pierde timp, unde se repetă taskurile și unde se blochează cererile. Apoi integrăm AI
            în procesele reale.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CtaButtons onRequest={() => openForm('analiza_gratuita_hero')} waSource="analiza_gratuita_hero_wa" />
          </motion.div>
          <p className="text-[14px] text-white/50 max-w-[520px]">
            Pentru companii în creștere, unde procesele manuale au devenit blocajul principal.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4 max-sm:gap-3 flex-wrap justify-center mt-2"
          >
            {[
              ['100+h', 'salvate / lună'],
              ['20%', 'reducere costuri'],
              ['99.9%', 'acuratețe'],
            ].map(([val, label], i) => (
              <div key={val} className="flex items-center gap-4 max-sm:gap-3">
                {i > 0 && <span className="text-white/20 max-sm:hidden">·</span>}
                <div className="flex items-baseline gap-2">
                  <span className="text-[22px] max-sm:text-[18px] font-bold text-white">{val}</span>
                  <span className="text-[13px] max-sm:text-[12px] text-white/50">{label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pain points ── */}
      <section className="py-20 max-sm:py-12 relative">
        <div className="container">
          <SectionHeading
            eyebrow="Problema"
            title="Dacă operațiunile companiei dvs. arată așa, nu sunteți singurii"
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
            În multe companii, problema nu este lipsa de resurse.{' '}
            <span className="text-white font-semibold">
              Problema este că operațiunile nu sunt conectate într-un sistem clar.
            </span>
          </p>
        </div>
      </section>

      {/* ── Where this applies ── */}
      <section className="py-20 max-sm:py-12 relative bg-gradient-to-b from-transparent via-[#001D3D]/40 to-transparent">
        <div className="container">
          <SectionHeading
            eyebrow="Pentru cine"
            title="Pentru ce tip de companie este potrivit?"
            subtitle="Novusolv este potrivit pentru companii aflate în creștere, unde volumul de cereri și procesele manuale au depășit capacitatea sistemelor actuale."
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
            Rezultatul exact depinde de procesul actual al companiei. De aceea începem cu o evaluare operațională
            gratuită.
          </p>
        </div>
      </section>

      {/* ── Free audit steps ── */}
      <section className="py-20 max-sm:py-12 relative bg-gradient-to-b from-transparent via-[#001D3D]/40 to-transparent">
        <div className="container">
          <SectionHeading
            eyebrow="Evaluare operațională"
            title="Evaluare operațională gratuită pentru compania dvs."
            subtitle="Vedem cum circulă cererile acum, unde se pierde timp și ce sistem ar avea cel mai mult sens pentru modul dvs. real de lucru."
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
            Vreți claritate operațională în compania dvs.?
          </h2>
          <p className="text-[18px] max-sm:text-[16px] text-white/70 leading-[155%]">
            Solicitați o evaluare operațională gratuită și identificăm unde se pierde timp, unde se repetă taskurile
            și unde se blochează cererile. Dacă AI-ul are sens, vă arătăm concret cum ar putea fi integrat în
            procesele reale.
          </p>
          <CtaButtons onRequest={() => openForm('analiza_gratuita_final_cta')} waSource="analiza_gratuita_final_wa" className="mt-2" />
          <p className="text-[14px] text-white/45 mt-2">
            Fără obligații. Fără promisiuni exagerate. Doar o discuție clară despre procesul companiei dvs.
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
