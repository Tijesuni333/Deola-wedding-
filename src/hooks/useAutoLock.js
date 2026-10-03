import { useEffect } from 'react'

const ACTIVITY = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart']

/**
 * Calls `onLock` when the guest leaves the tab, or after `seconds` with no
 * interaction (0 disables the inactivity timer).
 */
export function useAutoLock(enabled, seconds, onLock) {
  useEffect(() => {
    if (!enabled) return
    // Activity only stamps a time (these events fire dozens of times a second while scrolling);
    // a once-a-second check does the rest.
    let lastActive = Date.now()
    const touch = () => (lastActive = Date.now())
    const check =
      seconds > 0 &&
      setInterval(() => {
        if (Date.now() - lastActive >= seconds * 1000) onLock()
      }, 1000)
    const onVisibility = () => document.visibilityState === 'hidden' && onLock()

    ACTIVITY.forEach((e) => window.addEventListener(e, touch, { passive: true, capture: true }))
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(check)
      ACTIVITY.forEach((e) => window.removeEventListener(e, touch, { capture: true }))
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // onLock is an inline setter from App; re-subscribing on every render isn't needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, seconds])
}
