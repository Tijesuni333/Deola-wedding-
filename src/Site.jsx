import { useState } from 'react'
import { useReveal } from './hooks/useReveal'
import { Loader } from './components/Loader'
import { Toolbar } from './components/Toolbar'
import { Hero } from './components/Hero'
import { GlobeStory } from './components/GlobeStory'
import { WeddingDetails } from './components/WeddingDetails'
import { Rsvp } from './components/Rsvp'
import { Gallery } from './components/Gallery'
import { Gift } from './components/Gift'
import { wedding } from './config/wedding'
import { viewFromLocation } from './config/routes'

/** Everything behind the PIN screen. Loaded as its own chunk so the PIN screen appears fast. */
export default function Site({ locked }) {
  // Skip the loader when deep-linking straight to the gallery or RSVP (/photos, /rsvp — e.g. from a QR code).
  const [loaded, setLoaded] = useState(() => viewFromLocation() !== null)
  useReveal(loaded)

  return (
    <div inert={locked}>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Toolbar />
      <main>
        <Hero play={loaded} />
        <GlobeStory />
        <WeddingDetails />
      </main>
      <footer className="px-6 pt-20 pb-28 text-center sm:pb-16">
        <img src="/images/logos/adeoba-dark.png" alt="AdeOba" className="mx-auto mb-6 h-12 w-auto dark:hidden" />
        <img src="/images/logos/adeoba-light.png" alt="AdeOba" className="mx-auto mb-6 hidden h-12 w-auto dark:block" />
        <img
          src="/images/logos/names-dark.png"
          alt={`${wedding.couple.partnerA} & ${wedding.couple.partnerB}`}
          className="mx-auto w-full max-w-xs dark:hidden"
        />
        <img
          src="/images/logos/names-light.png"
          alt={`${wedding.couple.partnerA} & ${wedding.couple.partnerB}`}
          className="mx-auto hidden w-full max-w-xs dark:block"
        />
        <p className="eyebrow mt-6 text-ink-soft dark:text-moon-soft">{wedding.dateLabel}</p>
        {wedding.couple.hashtag && <p className="eyebrow mt-3 tracking-[0.2em] normal-case text-accent">{wedding.couple.hashtag}</p>}
      </footer>
      <Rsvp />
      <Gallery />
      <Gift />
    </div>
  )
}
