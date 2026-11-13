import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { PhotoFrame } from './PhotoFrame'

/**
 * One full-width photo or video for a memory, under the same brown tint as the hero photo (#573831).
 * Videos stay still on their cover until the guest taps them (a play icon sits in the middle); they play with
 * sound (the background music pauses for it, see useApp) and the tint lifts. Tapping again pauses.
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
  // `on`: the guest asked it to play (always with sound). `moving`: frames are actually advancing right now.
  const [on, setOn] = useState(false)
  const [moving, setMoving] = useState(false)
  // Until the first frames really play, the cover stays on top — a frozen frame would look broken.
  const [started, setStarted] = useState(false)
  const buffering = on && !moving

  useEffect(() => {
    const el = video.current
    // Leaving the tab (the PIN screen comes back up): stop the video.
    const onVisibility = () => document.visibilityState === 'hidden' && el.pause()
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
    } else {
      el.muted = false
      if (el.ended) el.currentTime = 0
      setOn(true)
      // Called straight from the tap, so phones allow it to play with sound at once.
      el.play().catch(() => setOn(false))
    }
    // Tell the music right away, while still inside the tap (it pauses for the video and comes back after).
    document.dispatchEvent(new Event('storymedia'))
  }

  return (
    <div className="group absolute inset-0">
      <video
        ref={video}
        src={src}
        poster={poster}
        playsInline
        preload="auto"
        aria-label={label}
        onPlaying={() => {
          setMoving(true)
          setStarted(true)
        }}
        onWaiting={() => setMoving(false)}
        onPause={() => {
          setOn(false)
          setMoving(false)
        }}
        onEnded={() => {
          setOn(false)
          setMoving(false)
          setStarted(false)
        }}
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
        className={`pointer-events-none absolute inset-0 bg-[#573831] transition-opacity duration-700 ${moving ? 'opacity-20' : 'opacity-55'}`}
      />

      {/* The whole video is the play/pause button. A big icon in the middle shows it's a video: always there while
          paused, fading in on hover while it plays, and a spinner while it's still loading. */}
      <button
        onClick={toggle}
        aria-label={on ? 'Pause video' : 'Play video with sound'}
        aria-pressed={on}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-paper/85 text-ink shadow-lg transition-all duration-300 ${
            on && !buffering ? 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100' : 'scale-100 opacity-100'
          }`}
        >
          {buffering ? (
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-ink/25 border-t-ink" />
          ) : (
            <Icon name={on ? 'pause' : 'play'} width={26} height={26} fill="currentColor" strokeWidth={0} className={on ? '' : 'translate-x-0.5'} />
          )}
        </span>
      </button>

      {/* Small sound badge in the corner, so it's clear the video plays with sound. */}
      <span aria-hidden className="pointer-events-none absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/85 text-ink shadow-md">
        <Icon name={on ? 'sound' : 'mute'} width={16} height={16} />
      </span>
    </div>
  )
}
