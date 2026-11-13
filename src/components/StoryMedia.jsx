import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { PhotoFrame } from './PhotoFrame'

/**
 * One full-width photo or video for a memory, under the same brown tint as the hero photo (#573831).
 * Videos play silently on a loop; the round button turns the sound on (the background music pauses for it,
 * see useApp) and lifts the tint so the video can be watched properly.
 */
export function StoryMedia({ stop, index }) {
  const photo = stop.photos?.[0]
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-[#3a2520] lg:aspect-[16/10]">
      {stop.video ? (
        <StoryVideo src={stop.video} poster={stop.poster ?? photo} label={stop.title} />
      ) : photo ? (
        <>
          <img src={photo} alt={stop.title} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#573831]/55" />
        </>
      ) : (
        <PhotoFrame label={stop.title} index={index} />
      )}
    </div>
  )
}

function StoryVideo({ src, poster, label }) {
  const video = useRef(null)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    const el = video.current
    // Set in JS as well: React doesn't reliably write the `muted` attribute, and phones only autoplay muted video.
    el.muted = true
    el.defaultMuted = true
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.play().catch(() => {})

    // Leaving the tab: go quiet (the PIN screen comes back up) and carry on silently on return.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        el.muted = true
        setSound(false)
        el.pause()
      } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      el.pause()
      // The video is gone from the page now (switched memory), so let the music check whether it can come back.
      document.dispatchEvent(new Event('storymedia'))
    }
  }, [])

  const toggleSound = () => {
    const el = video.current
    const on = !sound || el.paused
    el.muted = !on
    setSound(on)
    if (on) {
      if (el.ended) el.currentTime = 0
      el.play().catch(() => {})
    }
  }

  return (
    <>
      <video
        ref={video}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-[#573831] transition-opacity duration-700 ${sound ? 'opacity-20' : 'opacity-55'}`}
      />
      <button
        onClick={toggleSound}
        aria-label={sound ? 'Mute video' : 'Play video with sound'}
        aria-pressed={sound}
        className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper/85 text-ink shadow-md transition-transform active:scale-95"
      >
        <Icon name={sound ? 'sound' : 'mute'} width={18} height={18} />
      </button>
    </>
  )
}
