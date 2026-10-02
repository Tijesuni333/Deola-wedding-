import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { defaultLocale, locales } from '../config/i18n'
import { wedding } from '../config/wedding'
import { home, viewFromLocation, viewPaths } from '../config/routes'

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
  const rsvpOpen = view === 'rsvp'
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
    el.loop = true
    el.volume = 0.5
    audio.current = el
    return () => el.pause()
  }, [])

  const toggleMusic = useCallback(() => {
    const el = audio.current
    if (!el) return
    if (el.paused) {
      el.play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false))
    } else {
      el.pause()
      setMusicOn(false)
    }
  }, [])

  // Browsers only allow audio after a user gesture — the loader's "Enter" click is ours.
  const startMusic = useCallback(() => {
    const el = audio.current
    if (el && el.paused)
      el.play()
        .then(() => setMusicOn(true))
        .catch(() => {})
  }, [])

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
      musicOn,
      toggleMusic,
      startMusic,
      rsvpOpen,
      setRsvpOpen,
      galleryOpen,
      setGalleryOpen,
      giftOpen,
      setGiftOpen,
    }),
    [locale, theme, musicOn, toggleMusic, startMusic, rsvpOpen, setRsvpOpen, galleryOpen, setGalleryOpen, giftOpen, setGiftOpen],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
