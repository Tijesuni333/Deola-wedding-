import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

/**
 * PIN screen shown before anything else. A single real input sits invisibly on top
 * of the digit cells, so mobile keyboards, paste and autofill all just work.
 */
export function PinGate({ onUnlock }) {
  const { t } = useApp()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [focused, setFocused] = useState(true)
  const root = useRef(null)
  const cells = useRef(null)
  const input = useRef(null)
  const length = wedding.pin.length

  useEffect(() => {
    input.current?.focus()
  }, [])

  const check = (code) => {
    if (code === wedding.pin) {
      input.current?.blur()
      gsap.to(root.current, { opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: onUnlock })
      return
    }
    setError(true)
    gsap.fromTo(cells.current, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
    setTimeout(() => setValue(''), 350)
  }

  const onChange = (e) => {
    const next = e.target.value.replace(/\D/g, '').slice(0, length)
    setValue(next)
    setError(false)
    if (next.length === length) check(next)
  }

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-paper px-6 text-accent dark:bg-night dark:text-moon"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-title"
    >
      <p className="font-display text-3xl italic sm:text-4xl">
        {wedding.couple.partnerA} <span className="text-ink-soft dark:text-moon-soft">&amp;</span> {wedding.couple.partnerB}
      </p>
      <p id="pin-title" className="eyebrow mt-6 text-ink-soft dark:text-moon-soft">
        {t.pinTitle}
      </p>

      <form
        className="relative mt-10"
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
                className={`flex h-14 w-12 items-center justify-center border-b text-2xl transition-colors duration-300 ${
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
          autoComplete="one-time-code"
          maxLength={length}
          aria-label={t.pinTitle}
          aria-invalid={error}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </form>

      <p className="eyebrow mt-6 h-4 text-red-700 dark:text-red-300" aria-live="assertive">
        {error ? t.pinWrong : ''}
      </p>
      <p className="mt-6 max-w-xs text-center text-sm text-ink-soft dark:text-moon-soft">{t.pinHint}</p>
    </div>
  )
}
