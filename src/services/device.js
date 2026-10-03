/** Helpers shared by the local mock and the Google Drive photo backend. */

const OWNER_KEY = 'wedding:owner'

/**
 * A random secret per browser. It marks which photos this guest uploaded,
 * so they (and only they) can delete them.
 */
export function ownerId() {
  try {
    let id = localStorage.getItem(OWNER_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(OWNER_KEY, id)
    }
    return id
  } catch {
    return 'no-storage-' + Math.random().toString(36).slice(2) + Date.now()
  }
}

/** Hex SHA-256, matching the hash the Apps Script stores on each photo. */
export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Resize to `maxSide` on the long edge and re-encode as JPEG. Returns a data: URL. */
export async function compressImage(file, maxSide, quality) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', quality)
}
