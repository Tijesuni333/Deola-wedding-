import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

/** cobe's convention for centring a lat/lng in front of the camera. */
function anglesFor([lat, lng]) {
  return { phi: Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), theta: (lat * Math.PI) / 180 }
}

const TAU = Math.PI * 2
/** Shortest signed distance between two angles, so the globe never spins the long way round. */
const angleDelta = (from, to) => ((((to - from) % TAU) + TAU + Math.PI) % TAU) - Math.PI

const themes = {
  light: { dark: 0, baseColor: [0.95, 0.92, 0.87], glowColor: [0.96, 0.93, 0.88], mapBrightness: 5, diffuse: 1.1 },
  dark: { dark: 1, baseColor: [0.55, 0.5, 0.44], glowColor: [0.2, 0.18, 0.15], mapBrightness: 9, diffuse: 2 },
}

export function Globe({ stops, activeId, dark, onSelect }) {
  const canvas = useRef(null)
  const globe = useRef(null)

  // Mutable animation state lives in a ref so React re-renders don't reset it.
  const s = useRef({ phi: 0.6, theta: 0.2, targetPhi: null, targetTheta: 0.2, dragX: null, dragPhi: 0, idle: true })

  useEffect(() => {
    const el = canvas.current
    let width = el.offsetWidth
    const dpr = Math.min(window.devicePixelRatio, 2)
    const theme = dark ? themes.dark : themes.light

    const g = createGlobe(el, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: s.current.phi,
      theta: s.current.theta,
      mapSamples: 16000,
      markerColor: [0.61, 0.42, 0.31],
      arcColor: [0.61, 0.42, 0.31],
      arcWidth: 0.6,
      arcHeight: 0.25,
      markerElevation: 0.01,
      ...theme,
      baseColor: [...theme.baseColor],
      glowColor: [...theme.glowColor],
      markers: [],
      arcs: stops.slice(1).map((stop, i) => ({ from: stops[i].coords, to: stop.coords, id: `arc-${stop.id}` })),
    })
    globe.current = g

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    // Time-based easing so the globe moves at the same speed on slow phones and 120Hz screens.
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const ease = 1 - Math.exp(-dt * 4)
      const st = s.current
      if (st.targetPhi !== null) {
        const d = angleDelta(st.phi, st.targetPhi)
        st.phi += d * ease
        if (Math.abs(d) < 0.001) st.targetPhi = null
      } else if (st.dragX === null && st.idle && !reduced) {
        st.phi += dt * 0.15
      }
      st.theta += (st.targetTheta - st.theta) * ease
      g.update({ phi: st.phi, theta: st.theta, width: width * dpr, height: width * dpr })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const ro = new ResizeObserver(() => (width = el.offsetWidth))
    ro.observe(el)
    requestAnimationFrame(() => (el.style.opacity = '1'))

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      g.destroy()
      globe.current = null
    }
  }, [dark, stops])

  // Highlight the active city and rotate to it.
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
      s.current.idle = false
    } else {
      s.current.idle = true
      s.current.targetTheta = 0.2
    }
  }, [activeId, stops, dark])

  const onPointerDown = (e) => {
    s.current.dragX = e.clientX
    s.current.dragPhi = s.current.phi
    s.current.targetPhi = null
    e.target.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (s.current.dragX === null) return
    s.current.phi = s.current.dragPhi + (e.clientX - s.current.dragX) / 160
  }
  const onPointerUp = () => {
    s.current.dragX = null
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
      {/* Clickable city labels pinned to markers via CSS anchor positioning (progressive enhancement). */}
      {stops.map((st) => (
        <button
          key={st.id}
          onClick={() => onSelect(st.id)}
          className={`globe-label eyebrow absolute rounded-full px-3 py-1.5 text-[0.6rem] whitespace-nowrap shadow-sm backdrop-blur transition-[opacity,filter] duration-300 hover:bg-accent hover:text-paper ${
            st.id === activeId ? 'z-10 bg-accent text-paper' : 'bg-paper/85 text-ink dark:bg-night-2/85 dark:text-moon'
          }`}
          style={{
            positionAnchor: `--cobe-${st.id}`,
            bottom: 'anchor(top)',
            left: 'anchor(center)',
            translate: '-50% -6px',
            opacity: `var(--cobe-visible-${st.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${st.id}, 0)) * 6px))`,
            pointerEvents: 'auto',
          }}
          tabIndex={-1}
          aria-hidden
        >
          {st.city}
        </button>
      ))}
    </div>
  )
}
