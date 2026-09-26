import { useCallback, useState } from 'react'
import { Modal } from './Modal'
import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'
import { backend } from '../services'
import { wedding } from '../config/wedding'

function RsvpForm({ onClose }) {
  const { t } = useApp()
  const [attending, setAttending] = useState(null)
  const [plusOne, setPlusOne] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (k) => String(data.get(k) ?? '').trim()

    const next = {}
    if (!get('name')) next.name = t.required
    if (!/^\S+@\S+\.\S+$/.test(get('email'))) next.email = t.invalidEmail
    if (attending === null) next.attending = t.chooseAttendance
    if (attending && plusOne && !get('guestName')) next.guestName = t.required
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      await backend.submitRsvp({
        name: get('name'),
        email: get('email'),
        attending: attending,
        plusOne: attending && plusOne,
        guestName: attending && plusOne ? get('guestName') : undefined,
        dietary: attending ? get('dietary') || undefined : undefined,
        message: get('message') || undefined,
        website: get('website') || undefined, // honeypot, see Code.gs
      })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="px-8 py-16 text-center">
        <Icon name="heart" width={32} height={32} className="mx-auto text-accent" />
        <h2 className="mt-6 font-display text-4xl">{t.thanks}</h2>
        <p className="mx-auto mt-4 max-w-xs leading-relaxed text-ink-soft dark:text-moon-soft">
          {attending ? t.thanksBody : t.thanksDecline}
        </p>
        <button className="btn-solid mt-10" onClick={onClose}>
          {t.done}
        </button>
      </div>
    )
  }

  const err = (k) =>
    errors[k] && (
      <p id={`rsvp-${k}-err`} className="mt-1.5 text-xs text-accent">
        {errors[k]}
      </p>
    )

  const choice = (active) =>
    `flex-1 rounded-full border px-4 py-3 text-xs tracking-[0.15em] uppercase transition-colors ${
      active
        ? 'border-ink bg-ink text-paper dark:border-moon dark:bg-moon dark:text-night'
        : 'border-line hover:border-accent dark:border-line-dark'
    }`

  return (
    <form onSubmit={submit} noValidate className="px-7 pt-12 pb-8 sm:px-10">
      <p className="eyebrow text-accent">{t.rsvp}</p>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl">{t.rsvpTitle}</h2>
      <p className="mt-2 text-sm text-ink-soft dark:text-moon-soft">{wedding.rsvp.deadlineLabel}</p>

      {/* Honeypot for spam bots — hidden from people and screen readers. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-8 space-y-6">
        <label className="block">
          <span className="eyebrow text-[0.6rem] text-ink-soft dark:text-moon-soft">{t.fullName}</span>
          <input
            name="name"
            autoComplete="name"
            className="field"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'rsvp-name-err' : undefined}
          />
          {err('name')}
        </label>
        <label className="block">
          <span className="eyebrow text-[0.6rem] text-ink-soft dark:text-moon-soft">{t.email}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="field"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'rsvp-email-err' : undefined}
          />
          {err('email')}
        </label>

        <fieldset>
          <legend className="eyebrow mb-3 text-[0.6rem] text-ink-soft dark:text-moon-soft">{t.attending}</legend>
          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={attending === true}
              className={choice(attending === true)}
              onClick={() => setAttending(true)}
            >
              {t.accept}
            </button>
            <button
              type="button"
              aria-pressed={attending === false}
              className={choice(attending === false)}
              onClick={() => setAttending(false)}
            >
              {t.decline}
            </button>
          </div>
          {err('attending')}
        </fieldset>

        {attending && (
          <>
            {wedding.rsvp.allowPlusOne && (
              <fieldset>
                <legend className="eyebrow mb-3 text-[0.6rem] text-ink-soft dark:text-moon-soft">{t.plusOne}</legend>
                <div className="flex gap-2">
                  <button type="button" aria-pressed={!plusOne} className={choice(!plusOne)} onClick={() => setPlusOne(false)}>
                    {t.none}
                  </button>
                  <button type="button" aria-pressed={plusOne} className={choice(plusOne)} onClick={() => setPlusOne(true)}>
                    +1
                  </button>
                </div>
              </fieldset>
            )}
            {plusOne && (
              <label className="block">
                <span className="eyebrow text-[0.6rem] text-ink-soft dark:text-moon-soft">{t.guestName}</span>
                <input
                  name="guestName"
                  className="field"
                  aria-invalid={!!errors.guestName}
                  aria-describedby={errors.guestName ? 'rsvp-guestName-err' : undefined}
                />
                {err('guestName')}
              </label>
            )}
            <label className="block">
              <span className="eyebrow text-[0.6rem] text-ink-soft dark:text-moon-soft">{t.dietary}</span>
              <input name="dietary" className="field" />
            </label>
          </>
        )}

        <label className="block">
          <span className="eyebrow text-[0.6rem] text-ink-soft dark:text-moon-soft">{t.message}</span>
          <textarea name="message" rows={3} className="field resize-none" />
        </label>
      </div>

      {status === 'error' && <p className="mt-6 text-sm text-accent">Something went wrong — please try again.</p>}

      <button type="submit" className="btn-solid mt-10 w-full" disabled={status === 'sending'}>
        {status === 'sending' ? t.sending : t.submit}
      </button>
    </form>
  )
}

export function Rsvp() {
  const { t, rsvpOpen, setRsvpOpen } = useApp()
  const close = useCallback(() => setRsvpOpen(false), [setRsvpOpen])
  return (
    <Modal open={rsvpOpen} onClose={close} label={t.rsvp}>
      <RsvpForm onClose={close} />
    </Modal>
  )
}
