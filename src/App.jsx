import { lazy, Suspense, useState } from 'react'
import { AppProvider, useApp } from './hooks/useApp'
import { PinGate } from './components/PinGate'
import { useAutoLock } from './hooks/useAutoLock'
import { wedding } from './config/wedding'

// Start downloading the site straight away, while the guest is typing the PIN.
const sitePromise = import('./Site')
const Site = lazy(() => sitePromise)

function Shell() {
  const [locked, setLocked] = useState(Boolean(wedding.pin))
  // The site only mounts after the first unlock, then stays mounted under the PIN screen
  // so re-locking doesn't lose the guest's scroll position or a half-filled RSVP.
  const [entered, setEntered] = useState(!locked)
  // Never lock while the gallery is open: the phone camera / file picker counts as leaving the tab.
  const { galleryOpen } = useApp()
  useAutoLock(Boolean(wedding.pin) && !locked && !galleryOpen, wedding.lockAfter, () => setLocked(true))

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
