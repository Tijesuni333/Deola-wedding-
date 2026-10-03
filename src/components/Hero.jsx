import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

const longest = Math.max(wedding.couple.partnerA.length, wedding.couple.partnerB.length)
/** 16vw suits ~6-letter names; longer names shrink so they never overflow a phone screen. */
const nameVw = Math.min(16, 140 / longest)
const nameSize = `clamp(${(nameVw / 4).toFixed(2)}rem, ${nameVw.toFixed(1)}vw, ${(nameVw * 0.69).toFixed(2)}rem)`

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
      // force3D keeps each line on its own GPU layer, so the big serif text and the grain
      // overlay aren't repainted every frame; clearProps drops the layers once it's done.
      gsap
        .timeline({ defaults: { ease: 'power3.out', force3D: true, clearProps: 'transform,opacity' } })
        .from('[data-hero="line"]', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.05)
        .from('[data-hero="fade"]', { opacity: 0, y: 16, duration: 1, stagger: 0.1 }, '-=0.8')
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
        <p data-hero="fade" className="eyebrow mb-8 text-ink-soft dark:text-moon-soft">
          {wedding.dateLabel}
        </p>

        <h1 className="font-display leading-[0.9] font-normal">
          <span className="block overflow-hidden">
            <span data-hero="line" className="block" style={{ fontSize: nameSize }}>
              {wedding.couple.partnerA}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero="line" className="block text-[clamp(2.5rem,8vw,5rem)] text-accent italic">
              &amp;
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero="line" className="block" style={{ fontSize: nameSize }}>
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
