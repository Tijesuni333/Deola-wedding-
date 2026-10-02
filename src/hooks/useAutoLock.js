import { useEffect } from 'react'

const ACTIVITY = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart']

/**
 * Calls `onLock` when the guest leaves the tab, or after `seconds` with no
 * interaction (0 disables the inactivity timer).
 */
export function useAutoLock(enabled, seconds, onLock) {
  useEffect(() => {
    if (!enabled) return
    let timer = 0
    const reset = () => {
      clearTimeout(timer)
      if (seconds > 0) timer = setTimeout(onLock, seconds * 1000)
    }
    const onVisibility = () => document.visibilityState === 'hidden' && onLock()

    reset()
    ACTIVITY.forEach((e) => window.addEventListener(e, reset, { passive: true, capture: true }))
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearTimeout(timer)
      ACTIVITY.forEach((e) => window.removeEventListener(e, reset, { capture: true }))
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // onLock is an inline setter from App; re-subscribing on every render isn't needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, seconds])
}
