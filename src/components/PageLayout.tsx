import { lazy, Suspense, useEffect } from 'react'
import Navbar from './Navbar'

const Footer = lazy(() => import('./Footer'))

/**
 * Shell for every page that is not the homepage. Those pages have no dark hero
 * behind the navbar, so the bar renders solid from the top.
 */
export default function PageLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  // The SPA has one static index.html, so per-page head data is set on mount
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', description)

    return () => {
      document.title = previousTitle
      meta?.setAttribute('content', previousDescription)
    }
  }, [title, description])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative">
      <Navbar solid />
      {/* The bar is logo-driven, so it lands around 121px desktop / 133px
          mobile. Padding has to clear that and still leave breathing room. */}
      <main className="pt-[176px] max-sm:pt-[172px]">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
