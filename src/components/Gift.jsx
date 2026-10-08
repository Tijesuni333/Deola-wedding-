import { useCallback, useEffect, useState } from 'react'
import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'
import { wedding } from '../config/wedding'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
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

const wishlist = [
  {
    title: 'A white sedan car',
    note: 'Adeola loves white cars so you can already guess who wants it.',
    icon: '🚗',
  },
  {
    title: 'A set of heavy-duty locally-made clay pots',
    note: 'We want to connect back to mother nature, lol.',
    icon: '🏺',
  },
  {
    title: 'An African-themed dining set',
    note: 'Oluwatobiloba is an Africanist and we want to indulge him.',
    icon: '🪑',
  },
  {
    title: 'A fully sponsored 2-week trip to Rwanda',
    note: 'We would have loved to stay longer but we are both workaholics.',
    icon: '✈️',
  },
  {
    title: 'Food items in abundance',
    note: 'We would always need food, so thank you if you decide to contribute to our cheeks becoming robust and our stomachs being well-fed.',
    icon: '🍱',
  },
]

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
      <p className="mt-2 font-display text-2xl italic">{account.name}</p>
      <span aria-hidden className="my-4 block h-px w-8 bg-accent" />
      <dl className="space-y-3">
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
      <button onClick={copy} className={`btn mt-5 w-full justify-center ${copied ? 'border-accent text-accent' : ''}`}>
        <Icon name={copied ? 'check' : 'copy'} width={14} height={14} /> {copied ? t.copied : t.copy}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? t.copied : ''}</span>
    </div>
  )
}

function AccountsModal({ onClose }) {
  const { t } = useApp()
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 px-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-y-auto rounded-t-2xl bg-paper shadow-2xl dark:bg-night sm:rounded-2xl">
        <button
          onClick={onClose}
          aria-label={t.close}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5 dark:hover:bg-white/10"
        >
          <Icon name="close" width={18} height={18} />
        </button>
        <div className="px-6 pt-10 pb-10 text-center sm:px-8">
          <Icon name="gift" width={28} height={28} className="mx-auto text-accent" />
          <p className="eyebrow mt-5 text-accent">{t.giftCouple}</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">{t.giftTitle}</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft dark:text-moon-soft">{t.giftNote}</p>
          <div className={`mt-7 grid gap-4 ${wedding.gifts.length > 1 ? 'sm:grid-cols-2' : 'mx-auto max-w-xs'}`}>
            {wedding.gifts.map((account) => (
              <AccountCard key={account.accountNumber} account={account} />
            ))}
          </div>
          <p className="mt-7 font-display text-lg italic text-ink-soft dark:text-moon-soft">{t.giftThanks}</p>
        </div>
      </div>
    </div>
  )
}

export function Gift() {
  const { t, giftOpen, setGiftOpen } = useApp()
  const [accountsOpen, setAccountsOpen] = useState(false)
  const close = useCallback(() => setGiftOpen(false), [setGiftOpen])

  if (!giftOpen) return null

  return (
    <>
      {/* Full-screen gift page */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-paper dark:bg-night">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-paper/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md dark:bg-night/95 dark:shadow-[0_1px_0_var(--color-line-dark)]">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-8">
            <img src="/images/logos/adeoba-dark.png" alt="AdeOba" className="h-8 w-auto dark:hidden" />
            <img src="/images/logos/adeoba-light.png" alt="AdeOba" className="hidden h-8 w-auto dark:block" />
            <button
              onClick={close}
              aria-label={t.close}
              className="eyebrow flex items-center gap-2 rounded-full px-4 py-2 text-[0.62rem] transition-colors hover:bg-ink/5 dark:hover:bg-white/10"
            >
              <Icon name="close" width={14} height={14} /> Close
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 pb-28 pt-14 sm:px-8 sm:pt-16">
          {/* Hero */}
          <div className="mb-14 text-center">
            <p className="eyebrow text-accent">{wedding.couple.hashtag}</p>
            <h1 className="mt-4 font-display text-4xl leading-snug sm:text-6xl">Wedding Wishlist</h1>
            <p className="mt-5 font-display text-xl italic text-ink-soft dark:text-moon-soft sm:text-2xl">
              You want to gift us? Awwwn, you&apos;re so sweet!
            </p>
          </div>

          {/* Intro */}
          <div className="mb-12 rounded-sm border border-line bg-paper-2/50 px-7 py-8 dark:border-line-dark dark:bg-night-2/60 sm:px-10">
            <p className="leading-relaxed text-ink-soft dark:text-moon-soft">
              Not to brag or anything… we might actually already have what you had in mind to gift us on our wedding. We are very big on living in a comfortable home, so we have invested in making our new home super efficient — yes, we already have appliances down to a bread maker. Lol.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft dark:text-moon-soft">
              That is why we have taken it upon ourselves to help make your very kind and much-appreciated gesture more thoughtful and meaningful to us.
            </p>
            <p className="mt-5 font-display text-base italic text-accent">
              Please note: you may simply give a contribution towards any item on our wishlist, or blow our minds and get us the item itself.
            </p>
          </div>

          {/* Wishlist */}
          <ol className="space-y-4">
            {wishlist.map((item, i) => (
              <li
                key={i}
                className="flex gap-5 rounded-sm border border-line bg-paper p-6 dark:border-line-dark dark:bg-night-2/40 sm:p-7"
              >
                <span className="mt-0.5 shrink-0 text-2xl" aria-hidden>{item.icon}</span>
                <div>
                  <p className="font-display text-xl sm:text-2xl">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-moon-soft">{item.note}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* CTA */}
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="font-display text-2xl italic sm:text-3xl">Ready to bless us?</p>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft dark:text-moon-soft">
              Tap below to see our account details and send your gift.
            </p>
            <button onClick={() => setAccountsOpen(true)} className="btn-solid mt-2 px-10 py-4 text-sm">
              <Icon name="gift" width={16} height={16} /> Gift the Couple
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="pb-16 text-center">
          <img src="/images/logos/adeoba-dark.png" alt="AdeOba" className="mx-auto h-14 w-auto dark:hidden" />
          <img src="/images/logos/adeoba-light.png" alt="AdeOba" className="mx-auto hidden h-14 w-auto dark:block" />
          <p className="eyebrow mt-4 text-ink-soft dark:text-moon-soft">{wedding.dateLabel}</p>
        </footer>
      </div>

      {/* Account details sub-modal */}
      {accountsOpen && <AccountsModal onClose={() => setAccountsOpen(false)} />}
    </>
  )
}
