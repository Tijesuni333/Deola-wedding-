/**
 * Local-only mock backend. Stores everything in this browser's localStorage so
 * the full UI works before a real backend is chosen. Nothing leaves the device.
 */

const RSVP_KEY = 'wedding:rsvps'
const PHOTO_KEY = 'wedding:photos'
const OWNER_KEY = 'wedding:owner'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage blocked — the mock just won't persist.
  }
}

function ownerId() {
  let id = read(OWNER_KEY, null)
  if (!id) {
    id = crypto.randomUUID()
    write(OWNER_KEY, id)
  }
  return id
}

/** Downscale images so the localStorage mock doesn't blow its ~5MB quota. */
async function toCompressedDataUrl(file, maxSide = 1280) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.8)
}

export const mockBackend = {
  async submitRsvp(input) {
    await delay(600)
    const all = read(RSVP_KEY, [])
    all.push({ ...input, at: Date.now() })
    write(RSVP_KEY, all)
  },

  async listPhotos() {
    await delay(300)
    const me = ownerId()
    return read(PHOTO_KEY, [])
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ owner, ...p }) => ({ ...p, mine: owner === me }))
  },

  async uploadPhoto(file) {
    const url = await toCompressedDataUrl(file)
    const photo = { id: crypto.randomUUID(), url, createdAt: Date.now(), owner: ownerId() }
    write(PHOTO_KEY, [...read(PHOTO_KEY, []), photo])
    const { owner: _owner, ...rest } = photo
    return { ...rest, mine: true }
  },

  async deletePhoto(id) {
    const me = ownerId()
    write(
      PHOTO_KEY,
      read(PHOTO_KEY, []).filter((p) => !(p.id === id && p.owner === me)),
    )
  },
}
