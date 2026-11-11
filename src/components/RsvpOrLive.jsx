import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'

/**
 * The site's main call to action: “RSVP” until the day before the wedding, then “Watch Live”
 * (with a pulsing dot) for guests joining online. See wedding.liveStream.
 */
export function RsvpOrLive({ className = '' }) {
  const { t, live, openLive, setRsvpOpen } = useApp()

  if (!live) {
    return (
      <button onClick={() => setRsvpOpen(true)} className={`btn-solid ${className}`}>
        {t.rsvp}
      </button>
    )
  }
  return (
    <button onClick={openLive} className={`btn-solid ${className}`}>
      <span aria-hidden className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      <Icon name="live" width={15} height={15} />
      {t.watchLive}
    </button>
  )
}
