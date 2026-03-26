import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogoMarquee from './components/LogoMarquee'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Privacy from './components/Privacy'
import Terms from './components/Terms'

function Home() {
  return (
    <div className="relative">
      <Navbar />
      <main id="landing-hero-section">
        <Hero />
        <LogoMarquee />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
