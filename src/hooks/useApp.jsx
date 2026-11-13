import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { defaultLocale, locales } from '../config/i18n'
import { wedding } from '../config/wedding'
import { home, viewFromLocation, viewPaths } from '../config/routes'

/** Music volume (0–1): normal, and softened while the photo gallery is open. */
const MUSIC_VOLUME = 0.5
const MUSIC_VOLUME_GALLERY = 0.15

/** Live-stream mode: on from wedding.liveStream.from (once a link is set), or early with ?live in the address. */
function isLive() {
  const { url, from } = wedding.liveStream ?? {}
  if (!url) return false
  return new URLSearchParams(location.search).has('live') || Date.now() >= new Date(from).getTime()
}

const Ctx = createContext(null)

function safeGet(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function safeSet(key, v) {
  try {
    localStorage.setItem(key, v)
  } catch {
    /* ignore */
  }
}

export function AppProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    const saved = safeGet('wedding:locale')
    return saved && locales[saved] ? saved : defaultLocale
  })
  // Light by default; dark only if this guest switched to it themselves.
  const [theme, setTheme] = useState(() => (safeGet('wedding:theme-choice') === 'dark' ? 'dark' : 'light'))
  const [musicOn, setMusicOn] = useState(false)
  // The open panel ('gallery' | 'rsvp' | null) is mirrored in the URL (/photos, /rsvp) so it can be shared.
  const [view, setView] = useState(viewFromLocation)
  const audio = useRef(null)
  // Re-checked every minute so a page left open flips over on its own.
  const [live, setLive] = useState(isLive)
  useEffect(() => {
    if (live || !wedding.liveStream?.url) return
    const id = setInterval(() => isLive() && setLive(true), 60_000)
    return () => clearInterval(id)
  }, [live])
  const resumeAfter = useRef(false) // music was playing when the guest left; resume on return

  useEffect(() => {
    // Tidy legacy ?view= links into the clean path.
    const initial = viewFromLocation()
    if (initial && location.pathname !== viewPaths[initial]) history.replaceState(null, '', viewPaths[initial])
    // Browser back/forward opens or closes the panel.
    const onPop = () => setView(viewFromLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openView = useCallback((next) => {
    if (viewFromLocation() === next) return setView(next)
    history.pushState({ overlay: next }, '', viewPaths[next])
    setView(next)
  }, [])

  const closeView = useCallback((which) => {
    if (viewFromLocation() !== which) return setView((v) => (v === which ? null : v))
    // Opened from within the site → step back so the back button doesn't reopen it.
    // Arrived via a shared link → just swap the URL back to the home page.
    if (history.state?.overlay) history.back()
    else history.replaceState(null, '', home)
    setView(null)
  }, [])

  const setRsvpOpen = useCallback((open) => (open ? openView('rsvp') : closeView('rsvp')), [openView, closeView])
  const setGalleryOpen = useCallback((open) => (open ? openView('gallery') : closeView('gallery')), [openView, closeView])
  const setGiftOpen = useCallback((open) => (open ? openView('gift') : closeView('gift')), [openView, closeView])
  const rsvpOpen = view === 'rsvp' && !live // RSVP has closed once the live stream is up
  const galleryOpen = view === 'gallery'
  const giftOpen = view === 'gift'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = locale
    safeSet('wedding:locale', locale)
  }, [locale])

  useEffect(() => {
    if (!wedding.music) return
    const el = new Audio(wedding.music)
    // Buffer the song while the guest types the PIN, so it starts the instant they tap Explore.
    el.preload = 'auto'
    el.loop = true
    el.volume = MUSIC_VOLUME
    audio.current = el
    return () => el.pause()
  }, [])

  // Smooth volume changes. (iPhones ignore volume set by web pages, so there the fades/ducking are skipped.)
  const level = useRef(MUSIC_VOLUME) // where the volume should sit right now
  const fade = useRef(0)
  const fadeTo = useCallback((target, ms) => {
    const el = audio.current
    if (!el) return
    cancelAnimationFrame(fade.current)
    const from = el.volume
    const t0 = performance.now()
    const step = (now) => {
      const k = Math.min((now - t0) / ms, 1)
      el.volume = from + (target - from) * k
      if (k < 1) fade.current = requestAnimationFrame(step)
    }
    fade.current = requestAnimationFrame(step)
  }, [])

  const toggleMusic = useCallback(() => {
    const el = audio.current
    if (!el) return
    if (el.paused) {
      el.volume = level.current
      el.play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false))
    } else {
      resumeAfter.current = false
      el.pause()
      setMusicOn(false)
    }
  }, [])

  // Browsers only allow audio after a user gesture — the loader's "Enter" click is ours.
  // Starts silent and fades up over ~2.5s, so the song eases in as the site is revealed.
  const startMusic = useCallback(() => {
    const el = audio.current
    if (!el || !el.paused) return
    el.volume = 0
    el.play()
      .then(() => {
        setMusicOn(true)
        fadeTo(level.current, 2500)
      })
      .catch(() => {
        el.volume = level.current
      })
  }, [fadeTo])

  // Pause when the guest leaves (tab hidden / PIN screen back up) and pick up where it left off on return —
  // but only if it was playing; a guest who switched the music off keeps it off.
  const suspendMusic = useCallback(() => {
    if (!audio.current || audio.current.paused) return
    resumeAfter.current = true
    audio.current.pause()
    setMusicOn(false)
  }, [])
  const resumeMusic = useCallback(() => {
    if (!audio.current || !resumeAfter.current) return
    resumeAfter.current = false
    audio.current
      .play()
      .then(() => setMusicOn(true))
      .catch(() => {})
  }, [])

  // Photo gallery open → music keeps playing, just softer.
  useEffect(() => {
    level.current = galleryOpen ? MUSIC_VOLUME_GALLERY : MUSIC_VOLUME
    if (audio.current && !audio.current.paused) fadeTo(level.current, 600)
  }, [galleryOpen, fadeTo])

  // A video playing with sound anywhere on the site pauses the music; it comes back when the video stops.
  // Silent/muted videos (e.g. a looping background) don't count. Media events don't bubble, hence capture.
  useEffect(() => {
    const audible = (v) => v instanceof HTMLVideoElement && !v.paused && !v.ended && !v.muted && v.volume > 0
    const anyAudible = () => [...document.querySelectorAll('video')].some(audible)
    const onChange = (e) => {
      if (!(e.target instanceof HTMLVideoElement) && e.type !== 'storymedia') return
      if (anyAudible()) suspendMusic()
      else if (document.visibilityState === 'visible' && !document.getElementById('pin-title')) resumeMusic()
    }
    // 'storymedia': a memory's video was removed from the page (switching memories).
    const events = ['play', 'playing', 'pause', 'ended', 'volumechange', 'emptied', 'storymedia']
    events.forEach((ev) => document.addEventListener(ev, onChange, true))
    return () => events.forEach((ev) => document.removeEventListener(ev, onChange, true))
  }, [suspendMusic, resumeMusic])

  const value = useMemo(
    () => ({
      t: locales[locale].strings,
      locale,
      cycleLocale: () => {
        const keys = Object.keys(locales)
        setLocale((l) => keys[(keys.indexOf(l) + 1) % keys.length])
      },
      theme,
      toggleTheme: () =>
        setTheme((t) => {
          const next = t === 'dark' ? 'light' : 'dark'
          safeSet('wedding:theme-choice', next)
          return next
        }),
      live,
      openLive: () => window.open(wedding.liveStream.url, '_blank', 'noopener,noreferrer'),
      musicOn,
      toggleMusic,
      startMusic,
      suspendMusic,
      resumeMusic,
      rsvpOpen,
      setRsvpOpen,
      galleryOpen,
      setGalleryOpen,
      giftOpen,
      setGiftOpen,
    }),
    [locale, theme, live, musicOn, toggleMusic, startMusic, suspendMusic, resumeMusic, rsvpOpen, setRsvpOpen, galleryOpen, setGalleryOpen, giftOpen, setGiftOpen],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
