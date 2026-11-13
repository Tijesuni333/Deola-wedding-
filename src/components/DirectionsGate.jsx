import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'
import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

/**
 * Directions are only for selected guests: the button asks for a second PIN (wedding.venue.directionsPin)
 * first. Once entered correctly it is remembered for the rest of the visit. Then a pop-up explains how to get
 * to the venue (wedding.venue.directions), with a button that opens Google Maps.
 */
export function DirectionsButton() {
  const { t } = useApp()
  const [open, setOpen] = useState(false)
  const [unlocked, setUnlocked] = useState(!wedding.venue.directionsPin)

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        <Icon name="pin" width={14} height={14} /> {t.directions}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label={unlocked ? t.directionsTitle : t.directionsPinTitle}>
        {unlocked ? <DirectionsInfo /> : <DirectionsPin onUnlock={() => setUnlocked(true)} />}
      </Modal>
    </>
  )
}

function DirectionsInfo() {
  const { t } = useApp()
  return (
    <div className="flex flex-col items-center px-7 pt-14 pb-12 text-center sm:px-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-accent dark:border-line-dark">
        <Icon name="pin" width={18} height={18} />
      </span>
      <h3 className="mt-5 font-display text-3xl">{t.directionsTitle}</h3>
      <div className="mt-4 max-w-sm space-y-3 text-sm leading-relaxed text-ink-soft dark:text-moon-soft">
        {(wedding.venue.directions ?? []).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <a className="btn mt-8" href={wedding.venue.mapsUrl} target="_blank" rel="noopener noreferrer">
        <Icon name="pin" width={14} height={14} /> {t.openInMaps}
      </a>
    </div>
  )
}

function DirectionsPin({ onUnlock }) {
  const { t } = useApp()
  const pin = wedding.venue.directionsPin
  const length = pin.length
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [focused, setFocused] = useState(false)
  const cells = useRef(null)
  const input = useRef(null)

  // Wait for the modal's slide-in before focusing, so the phone keyboard doesn't jolt the panel.
  useEffect(() => {
    const id = setTimeout(() => input.current?.focus(), 350)
    return () => clearTimeout(id)
  }, [])

  const check = (code) => {
    if (code === pin) {
      input.current?.blur()
      onUnlock()
      return
    }
    setError(true)
    cells.current.animate(
      [
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(2px)' },
        { transform: 'none' },
      ],
      { duration: 450, easing: 'ease-out' },
    )
    setTimeout(() => setValue(''), 350)
  }

  const onChange = (e) => {
    const next = e.target.value.replace(/\D/g, '').slice(0, length)
    setValue(next)
    setError(false)
    if (next.length === length) check(next)
  }

  return (
    <div className="flex flex-col items-center px-7 pt-14 pb-12 text-center sm:px-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-accent dark:border-line-dark">
        <Icon name="pin" width={18} height={18} />
      </span>
      <h3 className="mt-5 font-display text-3xl">{t.directionsPinTitle}</h3>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft dark:text-moon-soft">{t.directionsPinHint}</p>

      <form
        className="relative mt-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (value.length === length) check(value)
        }}
      >
        <div ref={cells} className="flex gap-3" aria-hidden="true">
          {Array.from({ length }, (_, i) => {
            const active = focused && i === Math.min(value.length, length - 1)
            return (
              <div
                key={i}
                className={`flex h-14 w-12 items-center justify-center border-b text-2xl text-accent transition-colors duration-300 dark:text-moon ${
                  error ? 'border-red-700 dark:border-red-300' : active ? 'border-accent' : 'border-accent-soft dark:border-line-dark'
                }`}
              >
                {value[i] ? '•' : ''}
              </div>
            )
          })}
        </div>
        <input
          ref={input}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={length}
          aria-label={t.directionsPinTitle}
          aria-invalid={error}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </form>

      <p className="eyebrow mt-6 h-4 text-red-700 dark:text-red-300" aria-live="assertive">
        {error ? t.pinWrong : ''}
      </p>
    </div>
  )
}
