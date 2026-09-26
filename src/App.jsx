import { useState } from 'react'
import { AppProvider } from './hooks/useApp'
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

function Site() {
  // Skip the loader when deep-linking straight to the gallery or RSVP (/photos, /rsvp — e.g. from a QR code).
  const [loaded, setLoaded] = useState(() => viewFromLocation() !== null)
  useReveal(loaded)

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Toolbar />
      <main>
        <Hero play={loaded} />
        <GlobeStory />
        <WeddingDetails />
      </main>
      <footer className="px-6 pt-20 pb-28 text-center sm:pb-16">
        <p className="font-display text-3xl italic">
          {wedding.couple.partnerA} &amp; {wedding.couple.partnerB}
        </p>
        <p className="eyebrow mt-3 text-ink-soft dark:text-moon-soft">{wedding.dateLabel}</p>
      </footer>
      <Rsvp />
      <Gallery />
      <Gift />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Site />
    </AppProvider>
  )
}
