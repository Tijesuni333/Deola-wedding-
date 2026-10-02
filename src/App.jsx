import { useState } from 'react'
import { AppProvider, useApp } from './hooks/useApp'
import { useReveal } from './hooks/useReveal'
import { Loader } from './components/Loader'
import { PinGate } from './components/PinGate'
import { useAutoLock } from './hooks/useAutoLock'
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
  const [locked, setLocked] = useState(Boolean(wedding.pin))
  // The site only mounts after the first unlock, then stays mounted under the PIN screen
  // so re-locking doesn't lose the guest's scroll position or a half-filled RSVP.
  const [entered, setEntered] = useState(!locked)
  // Never lock while the gallery is open: the phone camera / file picker counts as leaving the tab.
  const { galleryOpen } = useApp()
  useAutoLock(Boolean(wedding.pin) && !locked && !galleryOpen, wedding.lockAfter, () => setLocked(true))
  // Skip the loader when deep-linking straight to the gallery or RSVP (/photos, /rsvp — e.g. from a QR code).
  const [loaded, setLoaded] = useState(() => viewFromLocation() !== null)
  useReveal(loaded)

  const gate = locked && (
    <PinGate
      onUnlock={() => {
        setLocked(false)
        setEntered(true)
      }}
    />
  )
  if (!entered) return gate

  return (
    <>
      {gate}
      <div inert={locked}>
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
          {wedding.couple.hashtag && <p className="eyebrow mt-3 tracking-[0.2em] normal-case text-accent">{wedding.couple.hashtag}</p>}
        </footer>
        <Rsvp />
        <Gallery />
        <Gift />
      </div>
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
