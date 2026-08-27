import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogoMarquee from './components/LogoMarquee'
import { initMetaPixel } from './lib/analytics'
import { captureUtms } from './lib/utm'
import { resolveLanguage } from './lib/languages'
import { ROUTES } from './lib/constants'

const EvaluareOperationala = lazy(() => import('./pages/EvaluareOperationala'))
const Pachete = lazy(() => import('./pages/Pachete'))
const WebsitePage = lazy(() => import('./pages/WebsitePage'))

const TwoDoors = lazy(() => import('./components/TwoDoors'))
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
    if (!hash) return

    const id = hash.replace('#', '')
    let frame = 0
    // Sections below the fold are lazy, so the target often does not exist yet
    // when the route settles. Keep looking for a short while before giving up.
    const deadline = performance.now() + 4000

    const findAndScroll = () => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (performance.now() < deadline) {
        frame = requestAnimationFrame(findAndScroll)
      }
    }

    frame = requestAnimationFrame(findAndScroll)
    return () => cancelAnimationFrame(frame)
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
          <TwoDoors />
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
    // Keep <html lang> on a shipped locale, not i18next's regional variant
    document.documentElement.lang = resolveLanguage(i18n.language)
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
        <Route path={ROUTES.assessment} element={<Suspense fallback={null}><EvaluareOperationala /></Suspense>} />
        <Route path={ROUTES.packages} element={<Suspense fallback={null}><Pachete /></Suspense>} />
        <Route path={ROUTES.website} element={<Suspense fallback={null}><WebsitePage /></Suspense>} />
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
