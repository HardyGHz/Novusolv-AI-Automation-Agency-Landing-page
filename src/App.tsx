import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogoMarquee from './components/LogoMarquee'
import HowItWorks from './components/HowItWorks'
import BeforeAfter from './components/BeforeAfter'
import ImpactAreas from './components/ImpactAreas'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Privacy from './components/Privacy'
import Terms from './components/Terms'
import CookieBanner from './components/CookieBanner'
import WebsiteBuilderCTA from './components/WebsiteBuilderCTA'

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
    <div className="relative" id="contact">
      <Navbar />
      <main id="landing-hero-section">
        <Hero />
        <LogoMarquee />
        <HowItWorks />
        <BeforeAfter />
        <ImpactAreas />
        <WebsiteBuilderCTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  )
}

export default App
