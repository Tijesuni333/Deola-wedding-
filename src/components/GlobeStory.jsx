import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Globe } from './Globe'
import { PhotoFrame } from './PhotoFrame'
import { Icon } from './Icon'
import { Modal } from './Modal'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

const stops = wedding.story

/** Short stories (a couple of lines) read best right on the card; longer ones open in a pop-up. */
// Every story opens in the pop-up via “Read our story”, however short, so all memories behave the same.
const isLong = (stop) => (stop?.story ?? []).length > 0

export function GlobeStory() {
  const { t, theme } = useApp()
  const [activeId, setActiveId] = useState(null)
  const [reading, setReading] = useState(false)
  const card = useRef(null)

  const index = stops.findIndex((s) => s.id === activeId)
  const active = index >= 0 ? stops[index] : null

  // Phones: the card sits below the globe, so tapping a memory on the globe scrolls down to its story.
  const scrollToCard = useRef(false)
  const revealCard = () => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    card.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }
  const pickFromGlobe = (id) => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return setActiveId(id)
    if (id === activeId) return revealCard()
    scrollToCard.current = true
    setActiveId(id)
  }

  useEffect(() => {
    if (!card.current) return
    gsap.fromTo(card.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' })
    if (scrollToCard.current) {
      scrollToCard.current = false
      revealCard()
    }
  }, [activeId])

  const go = (dir) => {
    const next = index + dir
    if (next >= 0 && next < stops.length) setActiveId(stops[next].id)
  }

  const closing = (
    <div data-reveal className="text-center font-display text-4xl leading-tight sm:text-6xl">
      <p className="text-ink-soft italic dark:text-moon-soft">{t.newAdventure1}</p>
      <p>{t.newAdventure2}</p>
    </div>
  )

  if (stops.length === 0) {
    return (
      <section id="journey" className="px-6 py-28 sm:py-36">
        {closing}
      </section>
    )
  }

  return (
    <section id="journey" className="relative overflow-x-clip px-6 py-28 sm:py-36 lg:pt-0">
      <div className="mx-auto max-w-6xl">
        {/* On desktop, the header + globe fill one screen and sit vertically centred. */}
        <div className="lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-16 lg:pb-6">
          <div data-reveal className="mb-14 text-center lg:mb-6">
            <p className="eyebrow text-accent">{t.explore}</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">{wedding.couple.tagline}</h2>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-soft dark:text-moon-soft">
              <Icon name="nav" width={14} height={14} /> {t.globeHint}
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div data-reveal>
              <Globe stops={stops} activeId={activeId} dark={theme === 'dark'} onSelect={pickFromGlobe} />
            </div>

            <div className="min-h-[420px] min-w-0">
              {/* City picker — always visible so keyboard and screen-reader users can navigate the story. */}
              {/* Stacked rows; on phones the buttons stretch so each row fills the width evenly (two per row where they fit). */}
              <div role="tablist" aria-label="Our memories" className="mb-8 flex flex-wrap gap-2 lg:mb-5">
                {stops.map((s) => (
                  <button
                    key={s.id}
                    role="tab"
                    data-id={s.id}
                    aria-selected={s.id === activeId}
                    onClick={() => setActiveId(s.id)}
                    className={`eyebrow grow rounded-full border px-3 py-2.5 text-[0.6rem] tracking-[0.14em] whitespace-nowrap transition-colors sm:grow-0 sm:px-4 sm:py-2 sm:text-[0.62rem] sm:tracking-[0.35em] ${
                      s.id === activeId
                        ? 'border-accent bg-accent text-paper dark:text-night'
                        : 'border-line hover:border-accent hover:text-accent dark:border-line-dark'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <Icon name="heart" width={11} height={11} fill="currentColor" className={s.id === activeId ? '' : 'text-accent'} />
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>

              {active ? (
                <div ref={card} key={active.id} role="tabpanel" aria-live="polite" className="scroll-mt-24">
                  <div className="grid grid-cols-2 gap-3 lg:max-w-[calc(60svh*3/4+0.75rem)]">
                    {(active.photos.length ? active.photos : ['', '']).slice(0, 2).map((src, i) => (
                      <div key={i} className={`aspect-[3/4] overflow-hidden rounded-sm ${i === 0 ? '' : 'mt-10 lg:mt-4'}`}>
                        <PhotoFrame src={src || undefined} label={active.title} index={index + i} />
                      </div>
                    ))}
                  </div>
                  <h3 className="mt-8 font-display text-3xl lg:mt-5">{active.title}</h3>
                  {active.caption && <p className="mt-3 max-w-md leading-relaxed text-ink-soft dark:text-moon-soft">{active.caption}</p>}
                  {isLong(active) && (
                    <button
                      onClick={() => setReading(true)}
                      className="eyebrow mt-4 inline-flex items-center gap-1.5 text-[0.62rem] text-accent underline-offset-4 hover:underline"
                    >
                      {t.readStory} <Icon name="chevronRight" width={12} height={12} />
                    </button>
                  )}

                  <div className="mt-8 flex items-center gap-4 lg:mt-5">
                    <button
                      onClick={() => go(-1)}
                      disabled={index === 0}
                      className="rounded-full border border-line p-2.5 transition-colors hover:border-accent disabled:opacity-30 dark:border-line-dark"
                      aria-label="Previous stop"
                    >
                      <Icon name="chevronLeft" width={16} height={16} />
                    </button>
                    <span className="eyebrow tabular-nums">
                      {String(index + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => go(1)}
                      disabled={index === stops.length - 1}
                      className="rounded-full border border-line p-2.5 transition-colors hover:border-accent disabled:opacity-30 dark:border-line-dark"
                      aria-label="Next stop"
                    >
                      <Icon name="chevronRight" width={16} height={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-56 flex-col items-start justify-center border-l lg:h-72 border-line pl-8 dark:border-line-dark">
                  <p className="font-display text-3xl italic">{t.globeSelect}</p>
                  <p className="mt-3 text-sm text-ink-soft dark:text-moon-soft">{t.globeHint}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-32 lg:mt-20">{closing}</div>
      </div>

      <Modal open={reading && isLong(active)} onClose={() => setReading(false)} label={active?.title}>
        {active?.story && (
          <article className="px-7 pt-12 pb-10 sm:px-10">
            <p className="eyebrow text-accent">
              {String(index + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
            </p>
            <h3 className="mt-3 font-display text-4xl">{active.title}</h3>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-soft dark:text-moon-soft">
              {active.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {index < stops.length - 1 && (
              <button
                onClick={() => {
                  go(1)
                  if (!isLong(stops[index + 1])) setReading(false)
                }}
                className="eyebrow mt-8 inline-flex items-center gap-1.5 text-[0.62rem] text-accent underline-offset-4 hover:underline"
              >
                {t.nextMemory}: {stops[index + 1].title} <Icon name="chevronRight" width={12} height={12} />
              </button>
            )}
          </article>
        )}
      </Modal>
    </section>
  )
}
