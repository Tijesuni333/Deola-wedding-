/**
 * Guest photos → Google Drive, via a separate Apps Script web app (Photos.gs) owned by
 * the account whose Drive holds the photos. Setup steps are in google-apps-script/README.md.
 */
import { compressImage, ownerId, sha256 } from './device'

const ENDPOINT = import.meta.env.VITE_PHOTOS_ENDPOINT

export const photosConfigured = Boolean(ENDPOINT)

/**
 * Upload quality adapts to the connection:
 * - Good network → the original file, untouched (non-JPEGs like PNG screenshots are re-encoded
 *   as near-full-size JPEGs, since the script only stores JPEGs).
 * - Slow network → resized to 2400px on the long edge, ~1MB: still sharp on any screen and
 *   fine for prints up to ~A4.
 * Android browsers report the connection up front; elsewhere (iPhones) we try the original
 * with a deadline, fall back to the resized copy if it's too slow, and remember that for the
 * rest of the visit.
 */
const SMALL_SIDE = 2400
const SMALL_QUALITY = 0.85
/** Re-encode cap for non-JPEGs; also keeps within iOS's canvas size limit. */
const FULL_SIDE = 4096
const FULL_QUALITY = 0.92
/** Originals above this go resized: the script's request limit is ~50MB once base64-encoded. */
const MAX_ORIGINAL_BYTES = 25 * 1024 * 1024
/** Below this upload speed, originals take too long and the resized copy is used instead. */
const MIN_MBPS = 2
/** Time Apps Script + Drive take on top of the transfer itself. */
const SERVER_OVERHEAD_S = 4

/** Learned during this visit: once an original upload proves slow, stop trying originals. */
let slowNetwork = false

function connectionLooksSlow() {
  const c = navigator.connection
  if (!c) return false // unknown (e.g. iPhone) — find out by trying
  return Boolean(c.saveData) || ['slow-2g', '2g', '3g'].includes(c.effectiveType) || (c.downlink > 0 && c.downlink < MIN_MBPS)
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).slice(String(reader.result).indexOf(',') + 1))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

const dataUrlToBase64 = (url) => url.slice(url.indexOf(',') + 1)

// Drive serves publicly shared images at any size through its thumbnail endpoint.
const toPhoto = (p, myHash) => ({
  id: p.id,
  createdAt: p.createdAt,
  thumb: `https://drive.google.com/thumbnail?id=${p.id}&sz=w600`,
  url: `https://drive.google.com/thumbnail?id=${p.id}&sz=w${SMALL_SIDE}`, // viewer; downloads get the stored file
  download: `https://drive.google.com/uc?export=download&id=${p.id}`,
  mine: Boolean(p.owner) && p.owner === myHash,
})

async function call(body, timeoutMs) {
  // text/plain keeps it a "simple" CORS request (see sheets.js).
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    signal: timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined,
  })
  const data = await res.json().catch(() => ({ ok: false }))
  if (!res.ok || !data.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const drivePhotos = {
  async listPhotos() {
    const [res, myHash] = await Promise.all([fetch(`${ENDPOINT}?action=photos`), sha256(ownerId())])
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Could not load photos')
    return data.photos.map((p) => toPhoto(p, myHash))
  },

  async uploadPhoto(file) {
    const owner = ownerId()
    let data

    if (!slowNetwork && !connectionLooksSlow()) {
      try {
        const isJpeg = file.type === 'image/jpeg' && file.size <= MAX_ORIGINAL_BYTES
        const image = isJpeg ? await fileToBase64(file) : dataUrlToBase64(await compressImage(file, FULL_SIDE, FULL_QUALITY))
        const bytes = image.length * 0.75
        // Deadline = how long it should take at MIN_MBPS. Slower than that → give up and send the small copy.
        const budgetS = SERVER_OVERHEAD_S + (bytes * 8) / (MIN_MBPS * 1e6)
        const started = performance.now()
        data = await call({ action: 'upload', owner, image }, (budgetS + 6) * 1000)
        if ((performance.now() - started) / 1000 > budgetS) slowNetwork = true // made it, but only just
      } catch (err) {
        if (err.name === 'TimeoutError' || err.name === 'AbortError' || err instanceof TypeError) slowNetwork = true
      }
    }

    if (!data) {
      const small = await compressImage(file, SMALL_SIDE, SMALL_QUALITY)
      data = await call({ action: 'upload', owner, image: dataUrlToBase64(small) })
    }
    return { ...toPhoto(data.photo, data.photo.owner), mine: true }
  },

  async deletePhoto(id) {
    await call({ action: 'delete', id, owner: ownerId() })
  },
}
