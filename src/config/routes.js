/**
 * Shareable URLs for the overlay panels. The panels stay overlays on top of the
 * home page; these paths just open them directly (e.g. from a QR code at the venue).
 *   /photos → photo gallery     /rsvp → RSVP form     /gift → gift accounts
 * The older ?view=gallery / ?view=rsvp links still work.
 */

const base = import.meta.env.BASE_URL // '/' unless the site is hosted under a sub-folder

export const home = base

export const viewPaths = {
  gallery: `${base}photos`,
  rsvp: `${base}rsvp`,
  gift: `${base}gift`,
}

/** Which panel the current URL asks for: 'gallery', 'rsvp', 'gift' or null. */
export function viewFromLocation() {
  const path = location.pathname.replace(/\/+$/, '')
  for (const [view, p] of Object.entries(viewPaths)) if (path === p) return view
  const q = new URLSearchParams(location.search).get('view')
  return q in viewPaths ? q : null
}
