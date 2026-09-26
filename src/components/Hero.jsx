import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

export function Hero({ play }) {
  const { t } = useApp()
  const root = useRef(null)

  useEffect(() => {
    if (!play || !root.current) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-hero="line"]', { yPercent: 110, duration: 1.6, stagger: 0.12 })
        .from('[data-hero="fade"]', { opacity: 0, y: 16, duration: 1.2, stagger: 0.1 }, '-=1.1')
    }, root)
    return () => ctx.revert()
  }, [play])

  return (
    <section ref={root} id="home" className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background: optional video, otherwise a slow drifting gradient. */}
      {wedding.heroVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40 dark:opacity-30"
          src={wedding.heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div aria-hidden className="absolute inset-0">
          <div className="absolute -top-1/4 -left-1/4 h-[70vmax] w-[70vmax] animate-[drift_18s_ease-in-out_infinite_alternate] rounded-full bg-accent-soft/40 blur-3xl dark:bg-accent/20" />
          <div className="absolute -right-1/4 -bottom-1/4 h-[60vmax] w-[60vmax] animate-[drift_22s_ease-in-out_infinite_alternate-reverse] rounded-full bg-paper-2 blur-3xl dark:bg-night-2" />
        </div>
      )}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.07]" />

      <div className="relative">
        <p data-hero="fade" className="eyebrow mb-8 text-ink-soft dark:text-moon-soft">
          {wedding.dateLabel}
        </p>

        <h1 className="font-display leading-[0.9] font-normal">
          <span className="block overflow-hidden">
            <span data-hero="line" className="block text-[clamp(4rem,16vw,11rem)]">
              {wedding.couple.partnerA}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero="line" className="block text-[clamp(2.5rem,8vw,5rem)] text-accent italic">
              &amp;
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero="line" className="block text-[clamp(4rem,16vw,11rem)]">
              {wedding.couple.partnerB}
            </span>
          </span>
        </h1>

        <p data-hero="fade" className="mt-10 font-display text-xl text-ink-soft italic sm:text-2xl dark:text-moon-soft">
          {t.heroLine1}
          <br />
          {t.heroLine2}
        </p>
      </div>

      <a
        data-hero="fade"
        href="#journey"
        className="eyebrow absolute bottom-8 flex flex-col items-center gap-3 text-ink-soft dark:text-moon-soft"
      >
        {t.scroll}
        <span className="block h-10 w-px animate-[scrollcue_2s_ease-in-out_infinite] bg-current" />
      </a>
    </section>
  )
}
