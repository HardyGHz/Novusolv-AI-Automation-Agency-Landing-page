import { useEffect, useRef } from 'react'

// ─── Ambient network background ─────────────────────────────────────────────
// Coded canvas: drifting nodes connected by proximity lines (automation-network
// motif). Reacts to mouse (parallax lerp) and scroll (slow counter-drift).
// Theme-aware via the `html.dark` class; static single frame when the user
// prefers reduced motion.

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  depth: number
}

const LINK_DIST = 150
const NODE_AREA = 26000 // px² per node — lower = denser

function palette(dark: boolean) {
  return dark
    ? {
        node: (a: number) => `rgba(255, 140, 42, ${a})`,
        link: (a: number) => `rgba(232, 99, 10, ${a})`,
        accent: (a: number) => `rgba(0, 53, 102, ${a})`,
        nodeAlpha: 0.55,
        linkAlpha: 0.22,
      }
    : {
        node: (a: number) => `rgba(232, 99, 10, ${a})`,
        link: (a: number) => `rgba(0, 53, 102, ${a})`,
        accent: (a: number) => `rgba(0, 29, 61, ${a})`,
        nodeAlpha: 0.38,
        linkAlpha: 0.13,
      }
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dark = document.documentElement.classList.contains('dark')

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let raf = 0
    let mouseX = 0
    let mouseY = 0
    let mouseTargetX = 0
    let mouseTargetY = 0
    let scrollDrift = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(24, Math.min(70, Math.round((width * height) / NODE_AREA)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.8,
        depth: Math.random() * 0.7 + 0.3, // parallax layer: 0.3 far … 1 near
      }))
    }

    const draw = () => {
      const p = palette(dark)
      ctx.clearRect(0, 0, width, height)
      mouseX += (mouseTargetX - mouseX) * 0.04
      mouseY += (mouseTargetY - mouseY) * 0.04

      const pts = nodes.map((n) => ({
        n,
        px: n.x + mouseX * 18 * n.depth,
        py: n.y + mouseY * 12 * n.depth + scrollDrift * 40 * (1 - n.depth),
      }))

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].px - pts[j].px
          const dy = pts[i].py - pts[j].py
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DIST) {
            const a = (1 - dist / LINK_DIST) * p.linkAlpha
            ctx.strokeStyle = p.link(a)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(pts[i].px, pts[i].py)
            ctx.lineTo(pts[j].px, pts[j].py)
            ctx.stroke()
          }
        }
      }

      for (const { n, px, py } of pts) {
        ctx.fillStyle = n.depth > 0.75 ? p.node(p.nodeAlpha) : p.accent(p.nodeAlpha * 0.8)
        ctx.beginPath()
        ctx.arc(px, py, n.r * n.depth + 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < -20) n.x = width + 20
        if (n.x > width + 20) n.x = -20
        if (n.y < -20) n.y = height + 20
        if (n.y > height + 20) n.y = -20
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    const onMouse = (e: MouseEvent) => {
      mouseTargetX = (e.clientX / window.innerWidth) * 2 - 1
      mouseTargetY = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      scrollDrift = Math.min(window.scrollY / window.innerHeight, 1.5)
    }

    // Re-render on theme toggle (html.dark class flips)
    const themeObserver = new MutationObserver(() => {
      const next = document.documentElement.classList.contains('dark')
      if (next !== dark) {
        dark = next
        if (reducedMotion) draw()
      }
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    resize()
    if (reducedMotion) {
      draw() // one static frame, no loop
    } else {
      window.addEventListener('mousemove', onMouse, { passive: true })
      window.addEventListener('scroll', onScroll, { passive: true })
      raf = requestAnimationFrame(step)
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      themeObserver.disconnect()
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
