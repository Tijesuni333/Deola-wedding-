import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fades up every `[data-reveal]` element as it scrolls into view. Set-up is delayed
 * until the hero intro finishes, since measuring the page mid-animation stutters on phones.
 */
export function useReveal(enabled) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {})
    const id = setTimeout(
      () =>
        ctx.add(() => {
          gsap.utils.toArray('[data-reveal]').forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 40,
              duration: 1.2,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            })
          })
        }),
      1400,
    )
    return () => {
      clearTimeout(id)
      ctx.revert()
    }
  }, [enabled])
}
