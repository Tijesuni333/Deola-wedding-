import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'
import { Icon } from './Icon'

/** cobe's convention for centring a lat/lng in front of the camera. */
function anglesFor([lat, lng]) {
  return { phi: Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), theta: (lat * Math.PI) / 180 }
}

/** The stop nearest the middle of the view (within ~55°), or null. Inverse of anglesFor. */
function frontStop(stops, phi, theta) {
  const lng = (3 * Math.PI) / 2 - phi
  let best = null
  let bestCos = Math.cos((55 * Math.PI) / 180)
  for (const st of stops) {
    const la = (st.coords[0] * Math.PI) / 180
    const lo = (st.coords[1] * Math.PI) / 180
    const c = Math.sin(theta) * Math.sin(la) + Math.cos(theta) * Math.cos(la) * Math.cos(lo - lng)
    if (c > bestCos) {
      bestCos = c
      best = st.id
    }
  }
  return best
}

const TAU = Math.PI * 2
/** Shortest signed distance between two angles, so the globe never spins the long way round. */
const angleDelta = (from, to) => ((((to - from) % TAU) + TAU + Math.PI) % TAU) - Math.PI

/** Auto-rotation speed (radians / second). */
const SPIN = 0.35 // ~18s per turn, so each memory gets ~2s in the phone spotlight
/** Pause before auto-rotation resumes after a drag, or after flying to a memory (ms). */
const RESUME_AFTER_DRAG = 1500
const RESUME_AFTER_SELECT = 5000
/** Largest canvas backing size in device pixels — sharp on 3x phones without overloading the GPU. */
const MAX_PIXELS = 1600

// A plain ball: cobe's world-map dots are switched off (mapBrightness ~0, since cobe treats 0 as "default"),
// leaving a softly shaded sphere with only the memory markers on it. `dark: 0` in both themes keeps that
// shading; cobe's own dark mode would render a map-less ball almost black.
const NO_MAP = 1e-6
const themes = {
  light: {
    dark: 0,
    baseColor: [0.97, 0.93, 0.85], // pearl
    glowColor: [0.98, 0.93, 0.82],
    markerColor: [0.34, 0.22, 0.19], // cocoa #573831
    patternColor: [0.78, 0.66, 0.55],
    mapBrightness: NO_MAP,
    diffuse: 1.2,
  },
  dark: {
    dark: 0,
    baseColor: [0.45, 0.33, 0.28], // polished cocoa
    glowColor: [0.24, 0.17, 0.14],
    markerColor: [0.88, 0.74, 0.64],
    patternColor: [0.66, 0.52, 0.45],
    mapBrightness: NO_MAP,
    diffuse: 1.3,
  },
}

/**
 * Surface pattern, drawn as tiny cobe markers so it is painted on the ball and turns with it — that is what
 * makes the spin read. Two wavy pearl strings that cross like intertwined lives (a nod to the beading on the
 * dress), over faint dotted lines running pole to pole. Markers without an id get no label anchor.
 */
function pattern(color) {
  const dots = []
  for (let lng = -180; lng < 180; lng += 30) {
    for (let lat = -75; lat <= 75; lat += 5) dots.push({ location: [lat, lng], size: 0.006, color })
  }
  for (let lng = -180; lng < 180; lng += 2.2) {
    const wave = 22 * Math.sin(((lng * Math.PI) / 180) * 3)
    dots.push({ location: [wave + 8, lng], size: 0.012, color })
    dots.push({ location: [-wave - 8, lng], size: 0.012, color })
  }
  return dots
}

export function Globe({ stops, activeId, dark, onSelect }) {
  const canvas = useRef(null)
  const globe = useRef(null)
  const fade = useRef(null) // not canvas.parentElement: cobe wraps the canvas in its own div
  // Phones spotlight the memory facing the viewer with its full title; the rest show as numbers.
  const [frontId, setFrontId] = useState(null)
  const [moving, setMoving] = useState(false)

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
    // Phones: draw at 2x instead of 3x. Still sharp at globe size, and less than half the pixels,
    // which is what lets them draw every frame for a smooth spin instead of dropping to 30fps.
    const touch = window.matchMedia('(pointer: coarse)').matches
    const maxDpr = touch ? 2 : 3
    let width = el.offsetWidth
    let dpr = Math.min(window.devicePixelRatio || 1, maxDpr, MAX_PIXELS / width)
    const theme = dark ? themes.dark : themes.light
    // eslint-disable-next-line no-unused-vars
    const { patternColor, ...cobeTheme } = theme

    const g = createGlobe(el, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: s.current.phi,
      theta: s.current.theta,
      mapSamples: 1000, // map is hidden; keep the dot lookup cheap
      mapBaseBrightness: 0,
      markerElevation: 0.01,
      ...cobeTheme,
      baseColor: [...theme.baseColor],
      glowColor: [...theme.glowColor],
      markerColor: [...theme.markerColor],
      markers: [],
    })
    globe.current = g

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let drawn = { phi: NaN, theta: NaN, w: 0 }
    let lastFront = 0
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
      if (now - lastFront > 200) {
        lastFront = now
        setFrontId(frontStop(stops, st.phi, st.theta))
        // Flying to a picked memory doesn't count as moving: that memory keeps the spotlight until spin resumes.
        setMoving(st.dragX !== null || st.spin > 0.05 || Math.abs(st.velocity) > 0.05)
      }
      // Redraw every frame while moving; skip when nothing changed (e.g. reduced motion) to save battery.
      if (Math.abs(st.phi - drawn.phi) > 1e-5 || Math.abs(st.theta - drawn.theta) > 1e-5 || drawn.w !== width * dpr) {
        g.update({ phi: st.phi, theta: st.theta, width: width * dpr, height: width * dpr })
        drawn = { phi: st.phi, theta: st.theta, w: width * dpr }
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
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr, MAX_PIXELS / width)
    })
    ro.observe(el)
    requestAnimationFrame(() => fade.current && (fade.current.style.opacity = '1'))

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
      markers: [
        ...pattern((dark ? themes.dark : themes.light).patternColor),
        ...stops.map((st) => ({
          location: st.coords,
          size: st.id === activeId ? 0.09 : 0.05,
          id: st.id,
        })),
      ],
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
      {/* The ball fades in as one piece: CSS lighting (see .ball-* in index.css) wraps cobe's plain sphere.
          The light is fixed top-left, so it stays put while the ball spins underneath. */}
      <div ref={fade} className="absolute inset-0 opacity-0 transition-opacity duration-1000">
        <div aria-hidden className="ball-ground" />
        <canvas
          ref={canvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
          aria-label="Interactive ball showing the couple’s most precious moments"
        />
        <div aria-hidden className="ball-shade" />
        <div aria-hidden className="ball-shine" />
      </div>
      {/* Clickable memory labels pinned to markers via CSS anchor positioning (progressive enhancement).
          Kept solid (no blur effects): they move every frame, and blur is costly to redraw on phones. */}
      {/* Phones: one memory at a time shows its full title, the rest are little hearts, so 8 long titles never
          pile up. While the globe is still, that's the selected memory; once it moves (spin resumes or a drag),
          the spotlight follows whichever memory faces the viewer. Desktop shows every title. */}
      {stops.map((st) => {
        const active = st.id === activeId
        const titled = st.id === (activeId && !moving ? activeId : frontId)
        const look = active
          ? 'bg-accent text-paper dark:text-night'
          : titled
            ? 'border border-accent bg-paper text-accent dark:bg-night-2'
            : 'border border-line bg-paper text-ink dark:border-line-dark dark:bg-night-2 dark:text-moon'
        return (
          <button
            key={st.id}
            onClick={() => onSelect(st.id)}
            className={`globe-label eyebrow absolute rounded-full text-[0.6rem] whitespace-nowrap transition-opacity duration-300 hover:bg-accent hover:text-paper dark:hover:text-night ${look} ${
              titled ? 'z-10 px-3 py-1.5' : 'p-1.5 leading-none sm:px-3 sm:py-1.5'
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
            {titled ? (
              st.title
            ) : (
              <>
                <Icon name="heart" width={11} height={11} fill="currentColor" className={`sm:hidden ${active ? '' : 'text-accent'}`} />
                <span className="hidden sm:inline">{st.title}</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
