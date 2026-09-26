/**
 * RSVPs → Google Sheet, via a Google Apps Script web app.
 * Setup steps are in google-apps-script/README.md.
 *
 * The request uses `Content-Type: text/plain` on purpose: that keeps it a
 * "simple" CORS request, so the browser doesn't send a preflight that Apps
 * Script can't answer.
 */

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT

export const sheetsConfigured = Boolean(ENDPOINT)

/**
 * @param {import('./index.js').RsvpInput} input
 */
export async function submitRsvpToSheet(input) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`RSVP failed (${res.status})`)
  const data = await res.json().catch(() => ({ ok: false }))
  if (!data.ok) throw new Error(data.error || 'RSVP failed')
}
