import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AppProvider, useApp } from './hooks/useApp'
import { PinGate } from './components/PinGate'
import { useAutoLock } from './hooks/useAutoLock'
import { wedding } from './config/wedding'

// Start downloading the site straight away, while the guest is typing the PIN.
const sitePromise = import('./Site')
const Site = lazy(() => sitePromise)

// Same for the hero photo: fetch and decode it now, so its intro zoom doesn't stall on first paint.
if (typeof window !== 'undefined') {
  const heroPhoto = new Image()
  heroPhoto.sizes = '100vw'
  heroPhoto.srcset = '/images/hero/couple-1200.jpg 1200w, /images/hero/couple-2048.jpg 2048w'
  heroPhoto.src = '/images/hero/couple-2048.jpg'
  heroPhoto.decode?.().catch(() => {})
}

function Shell() {
  const [locked, setLocked] = useState(Boolean(wedding.pin))
  // The site only mounts after the first unlock, then stays mounted under the PIN screen
  // so re-locking doesn't lose the guest's scroll position or a half-filled RSVP.
  const [entered, setEntered] = useState(!locked)
  // Never lock while the gallery is open: the phone camera / file picker counts as leaving the tab.
  const { galleryOpen, suspendMusic, resumeMusic } = useApp()
  useAutoLock(Boolean(wedding.pin) && !locked && !galleryOpen, wedding.lockAfter, () => setLocked(true))

  // Music pauses while the PIN screen is up and resumes once the guest is back in.
  const lockedRef = useRef(locked)
  useEffect(() => {
    lockedRef.current = locked
    if (locked) suspendMusic()
    else resumeMusic()
  }, [locked, suspendMusic, resumeMusic])
  // Also pause whenever the page is hidden (covers the gallery, which never locks, and PIN-less setups).
  // Coming back resumes straight away unless the PIN screen is waiting; then the unlock above resumes it.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') suspendMusic()
      else if (!lockedRef.current) resumeMusic()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [suspendMusic, resumeMusic])

  return (
    <>
      {locked && (
        <PinGate
          onUnlock={() => {
            setLocked(false)
            setEntered(true)
          }}
        />
      )}
      {entered && (
        <Suspense fallback={null}>
          <Site locked={locked} />
        </Suspense>
      )}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
