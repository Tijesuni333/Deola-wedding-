/**
 * Local-only mock backend. Stores everything in this browser's localStorage so
 * the full UI works before a real backend is chosen. Nothing leaves the device.
 */

import { compressImage, ownerId } from './device'

const RSVP_KEY = 'wedding:rsvps'
const PHOTO_KEY = 'wedding:photos'

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
    // Small, so the ~5MB localStorage quota isn't blown.
    const url = await compressImage(file, 1280, 0.8)
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
