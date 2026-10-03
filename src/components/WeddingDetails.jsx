import { useId, useState } from 'react'
import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'
import { useCountdown } from '../hooks/useCountdown'
import { wedding } from '../config/wedding'

function Countdown() {
  const { t } = useApp()
  const r = useCountdown(wedding.date)
  const units = [
    [r.months, t.months],
    [r.days, t.days],
    [r.hours, t.hours],
    [r.mins, t.mins],
    [r.secs, t.secs],
  ]
  return (
    <div className="flex items-start justify-center gap-0.5 min-[360px]:gap-1 sm:gap-5" role="timer" aria-label="Time until the wedding">
      {units.map(([n, label], i) => (
        <div key={label} className="flex items-start gap-0.5 min-[360px]:gap-1 sm:gap-5">
          <div className="w-11 text-center min-[360px]:w-14 sm:w-20">
            <div className="font-display text-3xl tabular-nums min-[360px]:text-4xl sm:text-6xl">{String(n).padStart(2, '0')}</div>
            <div className="eyebrow mt-2 text-[0.5rem] tracking-[0.2em] text-ink-soft min-[360px]:text-[0.55rem] min-[360px]:tracking-[0.35em] sm:text-[0.62rem] dark:text-moon-soft">
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="pt-0.5 font-display text-2xl text-accent/60 min-[360px]:pt-1 min-[360px]:text-3xl sm:pt-2 sm:text-5xl">:</span>
          )}
        </div>
      ))}
    </div>
  )
}

function Timeline() {
  return (
    <ol className="relative mx-auto max-w-md">
      <span aria-hidden className="absolute top-3 bottom-3 left-[1.35rem] w-px bg-line dark:bg-line-dark" />
      {wedding.timeline.map((item) => (
        <li key={item.time} className="relative flex items-center gap-6 py-4">
          <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-accent dark:border-line-dark dark:bg-night">
            <Icon name={item.icon} width={18} height={18} />
          </span>
          <div>
            <p className="eyebrow text-accent">{item.time}</p>
            <p className="mt-1 font-display text-2xl">{item.title}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Menu() {
  return (
    <div className="mx-auto max-w-lg space-y-10 text-center">
      {wedding.menu.map((m) => (
        <div key={m.course}>
          <p className="font-display text-2xl italic">{m.course}</p>
          <span aria-hidden className="mx-auto my-3 block h-px w-8 bg-accent" />
          <p className="leading-relaxed text-ink-soft dark:text-moon-soft">{m.description}</p>
        </div>
      ))}
    </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  const base = useId()
  return (
    <div className="mx-auto max-w-2xl divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
      {wedding.faq.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q}>
            <h3>
              <button
                id={`${base}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-xl transition-colors hover:text-accent"
              >
                <span>
                  <span className="mr-3 text-accent">{i + 1}.</span>
                  {f.q}
                </span>
                <Icon name="chevronDown" className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </h3>
            <div
              id={`${base}-a${i}`}
              role="region"
              aria-labelledby={`${base}-q${i}`}
              className={`grid transition-[grid-template-rows] duration-500 ease-soft ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 leading-relaxed text-ink-soft dark:text-moon-soft">{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function WeddingDetails() {
  const { t, setRsvpOpen, setGalleryOpen, setGiftOpen } = useApp()
  const [tab, setTab] = useState('timeline')
  const tabs = [
    ['timeline', t.timeline],
    ['menu', t.menu],
    ['faq', t.faq],
  ]

  return (
    <section id="wedding" className="relative bg-paper-2/60 px-6 py-28 sm:py-36 dark:bg-night-2/60">
      <div className="mx-auto max-w-5xl text-center">
        <div data-reveal>
          <p className="eyebrow text-accent">{wedding.dateLabel}</p>
          <div className="mt-10">
            <Countdown />
          </div>
        </div>

        <div data-reveal className="mt-24">
          <h2 className="font-display text-5xl sm:text-7xl">{t.ourWedding}</h2>
          <p className="eyebrow mt-6 text-ink-soft dark:text-moon-soft">{t.at}</p>
          <p className="mt-4 font-display text-3xl italic">
            {wedding.venue.website ? (
              <a
                href={wedding.venue.website}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
              >
                {wedding.venue.name}
              </a>
            ) : (
              wedding.venue.name
            )}
          </p>
          <address className="eyebrow mt-4 leading-loose not-italic text-ink-soft dark:text-moon-soft">
            {wedding.venue.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a className="btn" href={wedding.venue.mapsUrl} target="_blank" rel="noreferrer">
              <Icon name="pin" width={14} height={14} /> {t.directions}
            </a>
            <button className="btn" onClick={() => setGalleryOpen(true)}>
              <Icon name="gallery" width={14} height={14} /> {t.sharePhotos}
            </button>
            {wedding.gifts.length > 0 && (
              <button className="btn" onClick={() => setGiftOpen(true)}>
                <Icon name="gift" width={14} height={14} /> {t.giftCouple}
              </button>
            )}
            <button className="btn-solid" onClick={() => setRsvpOpen(true)}>
              {t.rsvp}
            </button>
          </div>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-ink-soft dark:text-moon-soft">{wedding.venue.note}</p>
        </div>

        <div data-reveal className="mt-28">
          <div
            role="tablist"
            aria-label="Wedding details"
            className="mb-14 inline-flex gap-1 rounded-full border border-line p-1 dark:border-line-dark"
          >
            {tabs.map(([key, label]) => (
              <button
                key={key}
                role="tab"
                id={`tab-${key}`}
                aria-selected={tab === key}
                aria-controls={`panel-${key}`}
                onClick={() => setTab(key)}
                className={`eyebrow rounded-full px-5 py-2.5 text-[0.62rem] transition-colors sm:px-7 ${
                  tab === key ? 'bg-ink text-paper dark:bg-moon dark:text-night' : 'hover:text-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="text-left">
            {tab === 'timeline' && <Timeline />}
            {tab === 'menu' && <Menu />}
            {tab === 'faq' && <Faq />}
          </div>
        </div>
      </div>
    </section>
  )
}
