'use client'

import { useEffect, useState } from 'react'
import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react'

// The fixed field behind the whole page. Replaces the dot grid, which read as
// a static texture no matter how far its speed was pushed.
//
// Preset 2 ("Backdrop") ships grey with a white tint and a red/blue chromatic
// split. All of that is overridden: the surface is the page backdrop colour
// and the tint is the accent green, so it reads as the same pine material the
// rest of the site is made of, lit and moving, rather than as chrome.
//
// The shader is the loud element here, so it is deliberately dialled down:
// slow speed, low contour, wide repetition. Content sits on top of it in
// glass panels and has to stay readable over every phase of the animation.

const BASE = liquidMetalPresets[2].params

export default function Backdrop() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <div className="bg" aria-hidden="true">
      <LiquidMetal
        {...BASE}
        colorBack="#040B06"
        colorTint="#2D583A"
        // one wide sweep rather than a busy pattern; this sits behind every
        // section of a long page, not just the hero
        scale={1.35}
        repetition={1.15}
        softness={0.78}
        distortion={0.14}
        contour={0.12}
        shiftRed={0}
        shiftBlue={0}
        angle={104}
        // frozen rather than unmounted under reduced motion, so the surface
        // still reads as the same material instead of going flat black
        speed={reduced ? 0 : 0.42}
        // This is a full-viewport fragment shader, so cost scales with pixels
        // drawn, and at DPR 2 it was rasterising ~5.2M of them per frame. The
        // surface is a soft blur with no fine detail, so it is capped well
        // below native and stretched: visually identical, a fraction of the
        // fill rate. Raise this only with a frame-rate measurement in hand.
        maxPixelCount={960 * 540}
        minPixelRatio={1}
        className="bg__shader"
      />
    </div>
  )
}
