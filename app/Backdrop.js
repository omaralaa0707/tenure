'use client'

import { useEffect, useRef } from 'react'

// The fixed activity field behind the whole page. Replaces the earlier 48
// static spans: a canvas can carry a far denser grid and actually move it.
//
// Two motions, both slow and both untied to scroll. The field drifts
// diagonally and wraps, so it reads as one continuous surface passing behind
// the page rather than an element chasing the viewport (the reason the old
// scan line was cut). On top of that, two long-period sine waves cross the
// grid and raise the brightness of whatever they pass over, so activity
// ripples through the dots instead of every dot pulsing on the same clock.

const SPACING = 46 // px between dots at 1x
const DOT = 1.8

export default function Backdrop() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // one row and column of overscan so wrapped dots enter from off-screen
      cols = Math.ceil(w / SPACING) + 2
      rows = Math.ceil(h / SPACING) + 2
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)

      // the whole field drifts; modulo keeps it seamless
      const dx = (t * 0.0055) % SPACING
      const dy = (t * 0.0032) % SPACING

      for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
          const x = ix * SPACING - SPACING + dx
          const y = iy * SPACING - SPACING + dy

          // two crossing waves; where they overlap, a dot is "busy"
          const a = Math.sin(x * 0.0075 - t * 0.00055 + y * 0.0028)
          const b = Math.sin(y * 0.0091 + t * 0.00037 - x * 0.0016)
          const wave = (a + b) * 0.5

          // bias low so most dots stay quiet and the lit ones read as events
          const level = Math.pow(Math.max(0, wave * 0.5 + 0.5), 2.0)
          const alpha = 0.09 + level * 0.5

          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(x, y, DOT + level * 0.9, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      draw(now)
    }

    // accent green, matching --accent on the backdrop
    ctx.fillStyle = 'oklch(0.70 0.11 152)'

    resize()
    const onResize = () => {
      resize()
      ctx.fillStyle = 'oklch(0.70 0.11 152)'
      if (reduced) draw(0)
    }
    window.addEventListener('resize', onResize)

    if (reduced) draw(0)
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="bg" aria-hidden="true">
      <canvas ref={ref} className="bg__canvas" />
    </div>
  )
}
