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
  const [ready, setReady] = useState(false)
  const root = useRef(null)
  const bar = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    const counter = { v: 0 }
    // Written straight to the DOM: re-rendering React 60 times a second here would compete
    // with the site mounting underneath, which is what makes phones stutter.
    const paint = () => {
      bar.current.style.transform = `scaleX(${counter.v / 100})`
      label.current.textContent = `${Math.round(counter.v)}%`
    }
    const tween = gsap.to(counter, { v: 90, duration: 1.6, ease: 'power2.out', onUpdate: paint })
    let cancelled = false
    Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, 1400))]).then(() => {
      if (cancelled) return
      tween.kill()
      gsap.to(counter, {
        v: 100,
        duration: 0.5,
        ease: 'power1.inOut',
        onUpdate: paint,
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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper text-accent dark:bg-night dark:text-moon"
      role="dialog"
      aria-label={t.loading}
    >
      <p className="px-6 text-center font-display text-3xl italic sm:text-4xl">
        {wedding.couple.partnerA} <span className="text-ink-soft dark:text-moon-soft">&amp;</span> {wedding.couple.partnerB}
      </p>
      {wedding.couple.hashtag && (
        <p className="eyebrow mt-4 tracking-[0.2em] normal-case text-ink-soft dark:text-moon-soft">{wedding.couple.hashtag}</p>
      )}

      <div className="mt-10 h-px w-48 overflow-hidden bg-accent-soft dark:bg-line-dark">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
      <p ref={label} className="eyebrow mt-4 tabular-nums opacity-70">
        0%
      </p>

      <div className={`mt-10 flex gap-3 transition-opacity duration-700 ${ready ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button className="btn" onClick={() => exit(true)}>
          {t.explore}
        </button>
      </div>

      <button className="eyebrow absolute right-6 bottom-6 opacity-60 hover:opacity-100" onClick={() => exit(false)}>
        {t.skip}
      </button>
    </div>
  )
}
