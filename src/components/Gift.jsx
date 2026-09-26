import { useCallback, useEffect, useState } from 'react'
import { Modal } from './Modal'
import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Older browsers / non-HTTPS: fall back to a hidden textarea.
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    el.remove()
  }
}

function AccountCard({ account }) {
  const { t } = useApp()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    await copyText(account.accountNumber)
    setCopied(true)
  }

  return (
    <div className="flex flex-col rounded-sm border border-line bg-paper-2/40 p-6 text-left dark:border-line-dark dark:bg-night/40">
      <p className="eyebrow text-accent">{account.role}</p>
      <p className="mt-2 font-display text-3xl italic">{account.name}</p>
      <span aria-hidden className="my-5 block h-px w-8 bg-accent" />

      <dl className="space-y-4">
        <div>
          <dt className="eyebrow text-[0.58rem] text-ink-soft dark:text-moon-soft">{t.bank}</dt>
          <dd className="mt-1">{account.bank}</dd>
        </div>
        <div>
          <dt className="eyebrow text-[0.58rem] text-ink-soft dark:text-moon-soft">{t.accountName}</dt>
          <dd className="mt-1">{account.accountName}</dd>
        </div>
        <div>
          <dt className="eyebrow text-[0.58rem] text-ink-soft dark:text-moon-soft">{t.accountNumber}</dt>
          <dd className="mt-1 font-display text-2xl tracking-wider tabular-nums">{account.accountNumber}</dd>
        </div>
      </dl>

      <button onClick={copy} className={`btn mt-6 w-full justify-center ${copied ? 'border-accent text-accent' : ''}`}>
        <Icon name={copied ? 'check' : 'copy'} width={14} height={14} /> {copied ? t.copied : t.copy}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t.copied : ''}
      </span>
    </div>
  )
}

export function Gift() {
  const { t, giftOpen, setGiftOpen } = useApp()
  const close = useCallback(() => setGiftOpen(false), [setGiftOpen])
  return (
    <Modal open={giftOpen} onClose={close} label={t.giftCouple}>
      <div className="px-6 pt-14 pb-10 text-center sm:px-8">
        <Icon name="gift" width={30} height={30} className="mx-auto text-accent" />
        <p className="eyebrow mt-5 text-accent">{t.giftCouple}</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">{t.giftTitle}</h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-soft dark:text-moon-soft">{t.giftNote}</p>

        <div className={`mt-8 grid gap-4 ${wedding.gifts.length > 1 ? 'sm:grid-cols-2' : 'mx-auto max-w-xs'}`}>
          {wedding.gifts.map((account) => (
            <AccountCard key={account.accountNumber} account={account} />
          ))}
        </div>

        <p className="mt-8 font-display text-lg italic text-ink-soft dark:text-moon-soft">{t.giftThanks}</p>
      </div>
    </Modal>
  )
}
