import { useState } from 'react'
import { useApp } from './hooks/useApp'
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
  // Once the live stream is up the RSVP form is closed, so an old /rsvp link gets the normal intro instead.
  const { live } = useApp()
  const [loaded, setLoaded] = useState(() => {
    const view = viewFromLocation()
    return view !== null && !(view === 'rsvp' && live)
  })
  // The hero intro starts the moment Explore/Skip is clicked, playing while the loader slides away.
  const [introStarted, setIntroStarted] = useState(loaded)
  useReveal(loaded)

  return (
    <div inert={locked}>
      {!loaded && <Loader onExit={() => setIntroStarted(true)} onDone={() => setLoaded(true)} />}
      <Toolbar />
      <main>
        <Hero play={introStarted} />
        <GlobeStory />
        <WeddingDetails />
      </main>
      <footer className="px-6 pt-20 pb-28 text-center sm:pb-16">
        <img src="/images/logos/adeoba-dark.png" alt="AdeOba" className="mx-auto h-20 w-auto dark:hidden" />
        <img src="/images/logos/adeoba-light.png" alt="AdeOba" className="mx-auto hidden h-20 w-auto dark:block" />
        <p className="eyebrow mt-6 text-ink-soft dark:text-moon-soft">{wedding.dateLabel}</p>
        {wedding.couple.hashtag && <p className="eyebrow mt-3 tracking-[0.2em] normal-case text-accent">{wedding.couple.hashtag}</p>}
      </footer>
      <Rsvp />
      <Gallery />
      <Gift />
    </div>
  )
}
