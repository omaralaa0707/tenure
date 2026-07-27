'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// A band of moving light, used once, behind the closing statement.
//
// Adapted from the raw-shader wave effect in two ways that mattered:
//
// 1. It is scoped to its section instead of `position: fixed` filling the
//    viewport. The original would have covered the page and fought the
//    backdrop shader for the same pixels.
// 2. The original splits the wave into red, green and blue and writes them to
//    separate channels, which produces an RGB rainbow. This site has one hue.
//    The three offsets are kept, because that is what gives the light its
//    depth, but they are summed into a single intensity and mapped onto the
//    pine ramp. Alpha comes from that intensity, so the band composites over
//    the backdrop rather than painting opaque black around itself.

const VERT = `
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const FRAG = `
  precision highp float;
  uniform vec2  resolution;
  uniform float time;
  uniform float xScale;
  uniform float yScale;
  uniform float distortion;
  uniform float yOffset;
  uniform vec3  colorLow;
  uniform vec3  colorHigh;

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float d = length(p) * distortion;

    float rx = p.x * (1.0 + d);
    float gx = p.x;
    float bx = p.x * (1.0 - d);

    // the three offset waves, kept for depth but summed rather than written
    // to separate channels
    // yOffset drops the band low in the section, so the light reads as a
    // horizon under the closing statement rather than a stripe through it
    float y = p.y + yOffset;
    float a = 0.05 / abs(y + sin((rx + time) * xScale) * yScale);
    float b = 0.05 / abs(y + sin((gx + time) * xScale) * yScale);
    float c = 0.05 / abs(y + sin((bx + time) * xScale) * yScale);

    float glow = (a + b + c) / 3.0;
    glow = pow(clamp(glow, 0.0, 1.0), 1.25);

    // fade out towards the edges so the band sits inside the section instead
    // of ending on a hard line
    float edge = smoothstep(1.5, 0.2, abs(y)) * smoothstep(2.4, 0.8, abs(p.x));
    glow *= edge;

    // and fade anything that strays up into the copy
    glow *= smoothstep(0.34, -0.12, p.y);

    vec3 col = mix(colorLow, colorHigh, glow);
    gl_FragColor = vec4(col, glow * 0.85);
  }
`

export default function WaveField() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    } catch {
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // soft glow, no fine detail: render below native and let it upscale
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.15))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

    const uniforms = {
      resolution: { value: [1, 1] },
      time: { value: 0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
      yOffset: { value: 0.62 },
      colorLow: { value: new THREE.Vector3(0.098, 0.208, 0.129) },
      colorHigh: { value: new THREE.Vector3(0.40, 0.62, 0.46) },
    }

    const verts = new Float32Array([
      -1, -1, 0, 1, -1, 0, -1, 1, 0,
      1, -1, 0, -1, 1, 0, 1, 1, 0,
    ])
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(verts, 3))

    const material = new THREE.RawShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false
    scene.add(mesh)

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      uniforms.resolution.value = [w, h]
      if (reduced) renderer.render(scene, camera)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    // only run while the band is actually on screen
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: '120px',
    })
    io.observe(host)

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      uniforms.time.value += 0.006
      renderer.render(scene, camera)
    }

    if (reduced) {
      uniforms.time.value = 1.2
      renderer.render(scene, camera)
    } else {
      tick()
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className="wavefield" aria-hidden="true" />
}
