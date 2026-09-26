import { useEffect, useState } from 'react'

/** Calendar-aware months, then days/hours/mins/secs for the remainder. */
export function diff(target, now) {
  if (now >= target) return { months: 0, days: 0, hours: 0, mins: 0, secs: 0, done: true }
  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  const anchor = new Date(now)
  anchor.setMonth(now.getMonth() + months)
  if (anchor > target) {
    months -= 1
    anchor.setTime(now.getTime())
    anchor.setMonth(now.getMonth() + months)
  }
  let rest = Math.floor((target.getTime() - anchor.getTime()) / 1000)
  const days = Math.floor(rest / 86400)
  rest -= days * 86400
  const hours = Math.floor(rest / 3600)
  rest -= hours * 3600
  const mins = Math.floor(rest / 60)
  return { months, days, hours, mins, secs: rest - mins * 60, done: false }
}

export function useCountdown(iso) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return diff(new Date(iso), now)
}
