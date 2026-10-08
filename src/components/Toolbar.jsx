import { useEffect, useState } from 'react'
import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'
import { locales } from '../config/i18n'
import { wedding } from '../config/wedding'

const sections = [
  ['home', 'Intro'],
  ['journey', 'Journey'],
  ['wedding', 'Wedding'],
]

function IconButton({ label, onClick, children, pressed }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="flex h-10 w-9 items-center justify-center rounded-full transition-colors sm:w-10 hover:bg-ink/5 dark:hover:bg-white/10"
    >
      {children}
    </button>
  )
}

export function Toolbar() {
  const { t, theme, toggleTheme, musicOn, toggleMusic, setGalleryOpen, setGiftOpen, setRsvpOpen, cycleLocale, locale } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [current, setCurrent] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)), {
      rootMargin: '-45% 0px -50% 0px',
    })
    sections.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const hasLocales = Object.keys(locales).length > 1

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          scrolled
            ? 'bg-paper/95 shadow-[0_1px_0_var(--color-line)] sm:bg-paper/80 sm:backdrop-blur-md dark:bg-night/95 dark:shadow-[0_1px_0_var(--color-line-dark)] sm:dark:bg-night/80'
            : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
          <a href="#home" className="shrink-0 px-1 sm:px-2" aria-label="Back to top">
            <img src="/images/logos/adeoba-dark.png" alt="AdeOba" className="h-8 w-auto dark:hidden" />
            <img src="/images/logos/adeoba-light.png" alt="AdeOba" className="hidden h-8 w-auto dark:block" />
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
            {sections.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={current === id ? 'true' : undefined}
                className={`eyebrow text-[0.62rem] transition-colors ${current === id ? 'text-accent' : 'hover:text-accent'}`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            {wedding.music && (
              <IconButton label={t.sound} onClick={toggleMusic} pressed={musicOn}>
                <Icon name={musicOn ? 'sound' : 'mute'} />
              </IconButton>
            )}
            <IconButton label={t.gallery} onClick={() => setGalleryOpen(true)}>
              <Icon name="gallery" />
            </IconButton>
            {wedding.gifts.length > 0 && (
              <IconButton label={t.giftCouple} onClick={() => setGiftOpen(true)}>
                <Icon name="gift" />
              </IconButton>
            )}
            <IconButton label={t.theme} onClick={toggleTheme} pressed={theme === 'dark'}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </IconButton>
            {hasLocales && (
              <button
                onClick={cycleLocale}
                aria-label={t.language}
                className="eyebrow h-10 rounded-full px-3 text-[0.62rem] hover:bg-ink/5 dark:hover:bg-white/10"
              >
                {locales[locale].label}
              </button>
            )}
            <button onClick={() => setRsvpOpen(true)} className="btn-solid ml-2 hidden px-5 py-2.5 sm:inline-flex">
              {t.rsvp}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile: a thumb-reachable RSVP button once the guest has scrolled past the hero. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-500 sm:hidden ${
          scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
        }`}
      >
        <button onClick={() => setRsvpOpen(true)} className="btn-solid w-full max-w-sm py-4 shadow-lg">
          {t.rsvp}
        </button>
      </div>
    </>
  )
}
