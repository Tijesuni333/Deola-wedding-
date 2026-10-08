import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

export function Hero({ play }) {
  const { t } = useApp()
  const root = useRef(null)

  // Pause the drifting background while the hero is scrolled away.
  useEffect(() => {
    const el = root.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('blobs-paused', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!play || !root.current) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out', force3D: true, clearProps: 'transform,opacity' } })
        .from('[data-hero="fade"]', { opacity: 0, y: 24, duration: 1.2, stagger: 0.15 }, 0.1)
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
          <div className="blob blob-a absolute -top-1/4 -left-1/4 h-[70vmax] w-[70vmax] animate-[drift_18s_ease-in-out_infinite_alternate]" />
          <div className="blob blob-b absolute -right-1/4 -bottom-1/4 h-[60vmax] w-[60vmax] animate-[drift_22s_ease-in-out_infinite_alternate-reverse]" />
        </div>
      )}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.07]" />

      <div className="relative">
        <p data-hero="fade" className="eyebrow mb-10 text-ink-soft dark:text-moon-soft">
          {wedding.dateLabel}
        </p>

        <h1 data-hero="fade" className="mx-auto w-full max-w-[min(90vw,600px)]">
          <img
            src="/images/logos/names-dark.png"
            alt={`${wedding.couple.partnerA} & ${wedding.couple.partnerB}`}
            className="w-full dark:hidden"
          />
          <img
            src="/images/logos/names-light.png"
            alt={`${wedding.couple.partnerA} & ${wedding.couple.partnerB}`}
            className="hidden w-full dark:block"
          />
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
