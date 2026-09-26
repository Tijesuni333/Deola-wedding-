import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

/**
 * Percentage preloader. Waits for fonts (and a minimum duration so it never
 * just flashes), then shows an Enter button — that click is the user gesture
 * browsers require before background music can play.
 */
export function Loader({ onDone }) {
  const { t, startMusic } = useApp()
  const [pct, setPct] = useState(0)
  const [ready, setReady] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    const counter = { v: 0 }
    const tween = gsap.to(counter, {
      v: 90,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => setPct(Math.round(counter.v)),
    })
    let cancelled = false
    Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, 1400))]).then(() => {
      if (cancelled) return
      tween.kill()
      gsap.to(counter, {
        v: 100,
        duration: 0.5,
        ease: 'power1.inOut',
        onUpdate: () => setPct(Math.round(counter.v)),
        onComplete: () => setReady(true),
      })
    })
    return () => {
      cancelled = true
      tween.kill()
    }
  }, [])

  const exit = (withMusic) => {
    if (withMusic) startMusic()
    gsap.to(root.current, {
      yPercent: -100,
      duration: 1.1,
      ease: 'expo.inOut',
      onComplete: onDone,
    })
  }

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper dark:bg-night-2 dark:text-moon"
      role="dialog"
      aria-label={t.loading}
    >
      <p className="font-display text-3xl italic opacity-80 sm:text-4xl">
        {wedding.couple.partnerA} <span className="text-accent-soft">&amp;</span> {wedding.couple.partnerB}
      </p>

      <div className="mt-10 h-px w-48 overflow-hidden bg-paper/15">
        <div className="h-full bg-accent-soft transition-[width] duration-150" style={{ width: `${pct}%` }} />
      </div>
      <p className="eyebrow mt-4 tabular-nums opacity-70" aria-live="polite">
        {pct}%
      </p>

      <div className={`mt-10 flex gap-3 transition-opacity duration-700 ${ready ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button className="btn border-paper/40" onClick={() => exit(true)}>
          {t.explore}
        </button>
      </div>

      <button className="eyebrow absolute right-6 bottom-6 opacity-60 hover:opacity-100" onClick={() => exit(false)}>
        {t.skip}
      </button>
    </div>
  )
}
