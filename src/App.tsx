import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogoMarquee from './components/LogoMarquee'
import { initMetaPixel } from './lib/analytics'
import { captureUtms } from './lib/utm'

const AnalizaGratuita = lazy(() => import('./pages/AnalizaGratuita'))

const HowItWorks = lazy(() => import('./components/HowItWorks'))
const RealSystemShowcase = lazy(() => import('./components/RealSystemShowcase'))
const OperatingPrinciples = lazy(() => import('./components/OperatingPrinciples'))
const BeforeAfter = lazy(() => import('./components/BeforeAfter'))
const ImpactAreas = lazy(() => import('./components/ImpactAreas'))
const WebsiteBuilderCTA = lazy(() => import('./components/WebsiteBuilderCTA'))
const FAQ = lazy(() => import('./components/FAQ'))
const Footer = lazy(() => import('./components/Footer'))
const Privacy = lazy(() => import('./components/Privacy'))
const Terms = lazy(() => import('./components/Terms'))
const NotFound = lazy(() => import('./components/NotFound'))
const CookieBanner = lazy(() => import('./components/CookieBanner'))

function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [hash])

  return null
}

function Home() {
  return (
    <div className="relative">
      <Navbar />
      <main id="landing-hero-section">
        <Hero />
        <LogoMarquee />
        <Suspense fallback={null}>
          <HowItWorks />
          <RealSystemShowcase />
          <OperatingPrinciples />
          <BeforeAfter />
          <ImpactAreas />
          <FAQ />
          <WebsiteBuilderCTA />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  useEffect(() => {
    // Store ad attribution on first landing
    captureUtms()
    // Returning visitor who already accepted marketing cookies → load pixel
    initMetaPixel()
  }, [])

  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analiza-gratuita" element={<Suspense fallback={null}><AnalizaGratuita /></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={null}><Privacy /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={null}><Terms /></Suspense>} />
        <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
      </Routes>
      <Suspense fallback={null}>
        <CookieBanner />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
