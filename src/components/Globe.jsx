import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

/** cobe's convention for centring a lat/lng in front of the camera. */
function anglesFor([lat, lng]) {
  return { phi: Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), theta: (lat * Math.PI) / 180 }
}

const TAU = Math.PI * 2
/** Shortest signed distance between two angles, so the globe never spins the long way round. */
const angleDelta = (from, to) => ((((to - from) % TAU) + TAU + Math.PI) % TAU) - Math.PI

/** Auto-rotation speed (radians / second). */
const SPIN = 0.2
/** Pause before auto-rotation resumes after a drag, or after flying to a memory (ms). */
const RESUME_AFTER_DRAG = 1500
const RESUME_AFTER_SELECT = 5000
/** Largest canvas backing size in device pixels — sharp on 3x phones without overloading the GPU. */
const MAX_PIXELS = 1600

const themes = {
  light: {
    dark: 0,
    baseColor: [0.96, 0.96, 0.86], // beige #f5f5dc
    glowColor: [1, 1, 0.94], // ivory #fffff0
    markerColor: [0.34, 0.22, 0.19], // cocoa #573831
    mapBrightness: 5,
    diffuse: 1.1,
  },
  dark: {
    dark: 1,
    baseColor: [0.55, 0.45, 0.38],
    glowColor: [0.13, 0.1, 0.09],
    markerColor: [0.79, 0.64, 0.56], // dark-mode accent #c9a48f
    mapBrightness: 9,
    diffuse: 2,
  },
}

export function Globe({ stops, activeId, dark, onSelect }) {
  const canvas = useRef(null)
  const globe = useRef(null)

  // Mutable animation state lives in a ref so React re-renders don't reset it.
  const s = useRef({
    phi: 0.6,
    theta: 0.2,
    targetPhi: null,
    targetTheta: 0.2,
    dragX: null,
    dragPhi: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0, // fling momentum after a drag
    spin: 0, // current auto-rotation speed, eased up/down so it never jerks
    resumeAt: 0,
  })

  useEffect(() => {
    const el = canvas.current
    let width = el.offsetWidth
    let dpr = Math.min(window.devicePixelRatio || 1, 3, MAX_PIXELS / width)
    const theme = dark ? themes.dark : themes.light

    const g = createGlobe(el, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: s.current.phi,
      theta: s.current.theta,
      mapSamples: 20000,
      arcColor: [...theme.markerColor],
      arcWidth: 0.6,
      arcHeight: 0.25,
      markerElevation: 0.01,
      ...theme,
      baseColor: [...theme.baseColor],
      glowColor: [...theme.glowColor],
      markerColor: [...theme.markerColor],
      markers: [],
      arcs: stops.slice(1).map((stop, i) => ({ from: stops[i].coords, to: stop.coords, id: `arc-${stop.id}` })),
    })
    globe.current = g

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Phones: while the globe is only drifting on its own, 30fps looks the same and halves the GPU work.
    const touch = window.matchMedia('(pointer: coarse)').matches
    let lastDraw = 0
    let raf = 0
    let last = performance.now()
    let visible = true
    // Time-based easing so the globe moves at the same speed on slow phones and 120Hz screens.
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const ease = 1 - Math.exp(-dt * 4)
      const st = s.current

      if (st.dragX !== null) {
        st.spin = 0 // the finger is in charge
      } else if (st.targetPhi !== null) {
        st.spin = 0
        const d = angleDelta(st.phi, st.targetPhi)
        st.phi += d * ease
        if (Math.abs(d) < 0.001) {
          st.targetPhi = null
          st.resumeAt = now + RESUME_AFTER_SELECT
        }
      } else {
        // Fling momentum decays, then auto-rotation eases back in.
        st.phi += st.velocity * dt
        st.velocity *= Math.exp(-dt * 3)
        const wanted = reduced || now < st.resumeAt ? 0 : SPIN
        st.spin += (wanted - st.spin) * (1 - Math.exp(-dt * 1.5))
        st.phi += st.spin * dt
      }
      st.theta += (st.targetTheta - st.theta) * ease
      const busy = st.dragX !== null || st.targetPhi !== null || Math.abs(st.velocity) > 0.05
      if (busy || !touch || now - lastDraw >= 32) {
        g.update({ phi: st.phi, theta: st.theta, width: width * dpr, height: width * dpr })
        lastDraw = now
      }
      raf = visible ? requestAnimationFrame(tick) : 0
    }
    raf = requestAnimationFrame(tick)

    // Pause while scrolled off screen so it doesn't compete with scrolling on phones.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    })
    io.observe(el)

    const ro = new ResizeObserver(() => {
      width = el.offsetWidth
      dpr = Math.min(window.devicePixelRatio || 1, 3, MAX_PIXELS / width)
    })
    ro.observe(el)
    requestAnimationFrame(() => (el.style.opacity = '1'))

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      g.destroy()
      globe.current = null
    }
  }, [dark, stops])

  // Highlight the active memory and rotate to it.
  useEffect(() => {
    globe.current?.update({
      markers: stops.map((st) => ({
        location: st.coords,
        size: st.id === activeId ? 0.09 : 0.05,
        id: st.id,
      })),
    })
    const active = stops.find((st) => st.id === activeId)
    if (active) {
      const a = anglesFor(active.coords)
      s.current.targetPhi = a.phi
      s.current.targetTheta = a.theta * 0.8
      s.current.velocity = 0
    } else {
      s.current.targetTheta = 0.2
    }
  }, [activeId, stops, dark])

  const onPointerDown = (e) => {
    const st = s.current
    st.dragX = st.lastX = e.clientX
    st.lastT = performance.now()
    st.dragPhi = st.phi
    st.targetPhi = null
    st.velocity = 0
    e.target.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const st = s.current
    if (st.dragX === null) return
    const now = performance.now()
    const dt = (now - st.lastT) / 1000
    if (dt > 0) st.velocity = (e.clientX - st.lastX) / 160 / dt
    st.lastX = e.clientX
    st.lastT = now
    st.phi = st.dragPhi + (e.clientX - st.dragX) / 160
  }
  const onPointerUp = () => {
    const st = s.current
    st.dragX = null
    // A finger that stopped before lifting shouldn't fling; cap the speed of a hard swipe.
    if (performance.now() - st.lastT > 80) st.velocity = 0
    st.velocity = Math.max(-4, Math.min(4, st.velocity))
    st.resumeAt = performance.now() + RESUME_AFTER_DRAG
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px] lg:max-w-[min(560px,58svh)]">
      <canvas
        ref={canvas}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="h-full w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 active:cursor-grabbing"
        aria-label="Interactive globe showing the places from the couple’s story"
      />
      {/* Clickable memory labels pinned to markers via CSS anchor positioning (progressive enhancement).
          Kept solid (no blur effects): they move every frame, and blur is costly to redraw on phones. */}
      {stops.map((st) => (
        <button
          key={st.id}
          onClick={() => onSelect(st.id)}
          className={`globe-label eyebrow absolute rounded-full px-3 py-1.5 text-[0.6rem] whitespace-nowrap transition-opacity duration-300 hover:bg-accent hover:text-paper dark:hover:text-night ${
            st.id === activeId
              ? 'z-10 bg-accent text-paper dark:text-night'
              : 'border border-line bg-paper text-ink dark:border-line-dark dark:bg-night-2 dark:text-moon'
          }`}
          style={{
            positionAnchor: `--cobe-${st.id}`,
            bottom: 'anchor(top)',
            left: 'anchor(center)',
            translate: '-50% -6px',
            opacity: `var(--cobe-visible-${st.id}, 0)`,
            pointerEvents: 'auto',
          }}
          tabIndex={-1}
          aria-hidden
        >
          {st.title}
        </button>
      ))}
    </div>
  )
}
