import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'

/** Accessible dialog: Escape to close, focus moved in and restored, background scroll locked. */
export function Modal({ open, onClose, label, children, variant = 'center' }) {
  const { t } = useApp()
  const panel = useRef(null)
  // Keep the content mounted until the fade (500ms) and slide (700ms) have both finished, so closing doesn't flash an empty panel.
  const [mounted, setMounted] = useState(open)
  if (open && !mounted) setMounted(true)
  useEffect(() => {
    if (open) return
    const id = setTimeout(() => setMounted(false), 750)
    return () => clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [open, onClose])

  // Rendered into <body> so a transformed ancestor (e.g. a scroll-reveal section) can never trap the fixed overlay.
  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-[opacity,visibility] duration-500 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-ink/50 sm:bg-ink/40 sm:backdrop-blur-sm dark:bg-black/70 sm:dark:bg-black/60" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`absolute overflow-y-auto bg-paper shadow-2xl outline-none transition-transform duration-700 ease-soft dark:bg-night-2 ${
          variant === 'full'
            ? `inset-0 sm:inset-6 sm:rounded-sm ${open ? 'translate-y-0' : 'translate-y-8'}`
            : `inset-x-0 bottom-0 max-h-[92svh] rounded-t-2xl sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[88svh] sm:w-[min(560px,92vw)] sm:-translate-x-1/2 sm:rounded-sm ${
                open ? 'translate-y-0 sm:-translate-y-1/2' : 'translate-y-full sm:-translate-y-[45%]'
              }`
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 transition-colors hover:bg-ink/5 dark:hover:bg-white/5"
          aria-label={t.close}
        >
          <Icon name="close" />
        </button>
        {(open || mounted) && children}
      </div>
    </div>,
    document.body,
  )
}
