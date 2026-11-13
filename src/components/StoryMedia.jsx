import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { PhotoFrame } from './PhotoFrame'

/**
 * One full-width photo or video for a memory, under the same brown tint as the hero photo (#573831).
 * Videos stay still on their cover until the guest taps the round sound button, which plays them with sound
 * (the background music pauses for it, see useApp) and lifts the tint; tapping again pauses.
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
  // The video only plays when the guest asks: the sound button is play/pause, and it always plays with sound.
  const [on, setOn] = useState(false)
  // Until it has played, the cover picture sits on top (so the card is never blank or a black frame).
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = video.current
    // Leaving the tab (the PIN screen comes back up): stop the video.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        el.pause()
        setOn(false)
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

  const toggle = () => {
    const el = video.current
    if (on) {
      el.pause()
      setOn(false)
    } else {
      el.muted = false
      if (el.ended) el.currentTime = 0
      setOn(true)
      setStarted(true)
      // Called straight from the tap, so phones allow it to play with sound at once.
      el.play().catch(() => setOn(false))
    }
    // Tell the music right away, while still inside the tap (it pauses for the video and comes back after).
    document.dispatchEvent(new Event('storymedia'))
  }

  return (
    <>
      <video
        ref={video}
        src={src}
        poster={poster}
        playsInline
        preload="auto"
        aria-label={label}
        onEnded={() => {
          setOn(false)
          setStarted(false)
        }}
        onPause={() => setOn(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {poster && (
        <img
          src={poster}
          alt=""
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${started ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-[#573831] transition-opacity duration-700 ${on ? 'opacity-20' : 'opacity-55'}`}
      />
      <button
        onClick={toggle}
        aria-label={on ? 'Pause video' : 'Play video with sound'}
        aria-pressed={on}
        className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper/85 text-ink shadow-md transition-transform active:scale-95"
      >
        <Icon name={on ? 'sound' : 'mute'} width={18} height={18} />
      </button>
    </>
  )
}
