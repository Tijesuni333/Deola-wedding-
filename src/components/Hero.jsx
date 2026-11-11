import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

export function Hero({ play }) {
  const { t } = useApp()
  const root = useRef(null)
  const bandRef = useRef(null)
  const layerRef = useRef(null)

  // Pause the drifting background while the hero is scrolled away.
  useEffect(() => {
    const el = root.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('blobs-paused', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Put everything in its starting pose before the first paint, so nothing shows at its
  // final size/position while the loader fades out and then jumps when the intro begins.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('[data-hero="photo"]', { scale: 1.12, force3D: true })
      gsap.set('[data-hero="fade"]', { opacity: 0, y: 24 })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!play || !root.current) return
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to('[data-hero="photo"]', { scale: 1, duration: 3.2, ease: 'power3.out', force3D: true }, 0)
        .to(
          '[data-hero="fade"]',
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out', clearProps: 'transform,opacity' },
          0.5,
        )
    }, root)
    return () => ctx.kill()
  }, [play])

  // Gentle parallax: the photo drifts a few pixels away from the cursor, then settles back to centre
  // when the cursor leaves. Mouse/trackpad only, and off for guests who prefer reduced motion.
  useEffect(() => {
    const band = bandRef.current
    const layer = layerRef.current
    if (!band || !layer) return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const MAX = 18 // px; the layer overhangs the band by 24px, so edges never show
    const toX = gsap.quickTo(layer, 'x', { duration: 1.4, ease: 'power3.out' })
    const toY = gsap.quickTo(layer, 'y', { duration: 1.4, ease: 'power3.out' })
    const move = (e) => {
      const r = band.getBoundingClientRect()
      toX(-((e.clientX - r.left) / r.width - 0.5) * 2 * MAX)
      toY(-((e.clientY - r.top) / r.height - 0.5) * 2 * MAX)
    }
    const leave = () => {
      toX(0)
      toY(0)
    }
    band.addEventListener('pointermove', move)
    band.addEventListener('pointerleave', leave)
    return () => {
      band.removeEventListener('pointermove', move)
      band.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(layer)
    }
  }, [])

  return (
    <section ref={root} id="home" className="relative flex min-h-svh flex-col items-center overflow-hidden text-center">
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

      {/* Photo band: the couple's portrait under a cocoa tint, with the names on top. Starts below the fixed header. */}
      <div
        ref={bandRef}
        className="relative mt-16 flex h-[64svh] w-full items-center justify-center overflow-hidden px-6 sm:h-[max(30rem,min(78svh,50vw))]"
      >
        {/* Outer layer follows the cursor; the photo inside does the intro zoom. */}
        <div ref={layerRef} aria-hidden className="absolute -inset-6 will-change-transform">
          <img
            data-hero="photo"
            src="/images/hero/couple-2048.jpg"
            srcSet="/images/hero/couple-1200.jpg 1200w, /images/hero/couple-2048.jpg 2048w"
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[80%_30%] sm:object-[center_30%]"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[#573831]/70" />

        <div className="relative">
          <p data-hero="fade" className="eyebrow mb-8 text-sm normal-case tracking-[0.2em] text-paper sm:mb-10 sm:text-base">
            {wedding.couple.hashtag}
          </p>

          <h1 data-hero="fade" className="mx-auto w-full max-w-[min(85vw,600px)]">
            <img src="/images/logos/names-light.png" alt={`${wedding.couple.partnerA} & ${wedding.couple.partnerB}`} className="w-full" />
          </h1>

          <p data-hero="fade" className="mt-6 font-display text-2xl italic text-paper sm:mt-8 sm:text-4xl">
            {t.heroLine1}
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-between gap-12 px-6 pt-16 pb-8 sm:pt-20">
        <p data-hero="fade" className="mx-auto max-w-md text-base leading-relaxed text-ink-soft dark:text-moon-soft">
          {t.introNote}
        </p>

        <a data-hero="fade" href="#journey" className="eyebrow flex flex-col items-center gap-3 text-ink-soft dark:text-moon-soft">
          {t.scroll}
          <span className="block h-10 w-px animate-[scrollcue_2s_ease-in-out_infinite] bg-current" />
        </a>
      </div>
    </section>
  )
}
