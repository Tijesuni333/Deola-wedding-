import { useState } from 'react'
import { Modal } from './Modal'
import { Icon } from './Icon'

/**
 * “Request a Song” / “Spray Money”: a button (full button in the details section, round icon in the top bar)
 * that opens a short pop-up, whose button takes the guest to an outside link. See wedding.linkOuts.
 */
export function LinkOutButton({ item, variant = 'btn' }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={() => setOpen(true)}
          aria-label={item.label}
          title={item.label}
          className="flex h-10 w-9 items-center justify-center rounded-full transition-colors sm:w-10 hover:bg-ink/5 dark:hover:bg-white/10"
        >
          <Icon name={item.icon} />
        </button>
      ) : (
        <button className="btn" onClick={() => setOpen(true)}>
          <Icon name={item.icon} width={14} height={14} /> {item.label}
        </button>
      )}
      <Modal open={open} onClose={() => setOpen(false)} label={item.title}>
        <LinkOutPanel item={item} />
      </Modal>
    </>
  )
}

function LinkOutPanel({ item }) {
  return (
    <div className="flex flex-col items-center px-7 pt-14 pb-12 text-center sm:px-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-accent dark:border-line-dark">
        <Icon name={item.icon} width={18} height={18} />
      </span>
      <h3 className="mt-5 font-display text-3xl sm:text-4xl">{item.title}</h3>
      <p className="mt-4 max-w-sm leading-relaxed text-ink-soft dark:text-moon-soft">{item.text}</p>
      {/* Until the link is added (wedding.linkOuts), the button simply does nothing yet. */}
      <a
        href={item.url || undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => !item.url && e.preventDefault()}
        className="btn-solid mt-8"
      >
        {item.button} <Icon name="external" width={14} height={14} />
      </a>
    </div>
  )
}
