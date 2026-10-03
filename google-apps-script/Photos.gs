/**
 * Wedding guest photos → Google Drive.
 * A standalone Apps Script (no sheet needed), owned by the account whose Drive should hold
 * the photos. Paste this into a new project at script.google.com, then deploy as a web app.
 * Full steps: google-apps-script/README.md
 */

/** Drive folder for guest photos. Created automatically; rename or move it freely. */
const PHOTO_FOLDER_NAME = 'AdeOba — Guest Photos'
/** The site sends originals up to 25MB (~34MB as base64) on good connections; this cap just stops abuse. */
const MAX_PHOTO_BASE64 = 36 * 1024 * 1024
const LIST_CACHE_KEY = 'photos:list'

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    if (data.action === 'upload') return json(uploadPhoto(data))
    if (data.action === 'delete') return json(deletePhoto(data))
    return json({ ok: false, error: 'Unknown action' })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

/** ?action=photos lists the gallery; anything else is a health check you can open in a browser. */
function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.action === 'photos') return json({ ok: true, photos: listPhotos() })
    return json({ ok: true, status: 'Photo endpoint is running' })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

/**
 * Each browser has a random secret "owner" token. Only its SHA-256 hash is stored on the
 * file (in the description), so the public list can say which photos are yours without
 * revealing the token needed to delete them.
 */
function uploadPhoto(data) {
  const owner = String(data.owner || '')
  const b64 = String(data.image || '')
  if (owner.length < 16 || !b64 || b64.length > MAX_PHOTO_BASE64) return { ok: false, error: 'Invalid upload' }

  const bytes = Utilities.base64Decode(b64)
  // Only accept real JPEGs (the site always converts to JPEG), so the folder can't host arbitrary files.
  if (bytes.length < 3 || (bytes[0] & 0xff) !== 0xff || (bytes[1] & 0xff) !== 0xd8 || (bytes[2] & 0xff) !== 0xff) {
    return { ok: false, error: 'Not a JPEG' }
  }

  const ownerHash = sha256(owner)
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH.mm.ss')
  const blob = Utilities.newBlob(bytes, 'image/jpeg', 'Guest photo ' + stamp + '.jpg')
  const file = getPhotoFolder().createFile(blob)
  file.setDescription('owner:' + ownerHash)
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  CacheService.getScriptCache().remove(LIST_CACHE_KEY)

  return { ok: true, photo: { id: file.getId(), createdAt: file.getDateCreated().getTime(), owner: ownerHash } }
}

function deletePhoto(data) {
  const id = String(data.id || '')
  const owner = String(data.owner || '')
  let file
  try {
    file = DriveApp.getFileById(id)
  } catch (err) {
    return { ok: true } // already gone
  }
  if (!inPhotoFolder(file) || file.getDescription() !== 'owner:' + sha256(owner)) {
    return { ok: false, error: 'Not allowed' }
  }
  file.setTrashed(true)
  CacheService.getScriptCache().remove(LIST_CACHE_KEY)
  return { ok: true }
}

/** Newest first. Cached for a minute so a busy gallery doesn't re-scan Drive on every visit. */
function listPhotos() {
  const cache = CacheService.getScriptCache()
  const hit = cache.get(LIST_CACHE_KEY)
  if (hit) return JSON.parse(hit)

  const photos = []
  const files = getPhotoFolder().getFilesByType('image/jpeg')
  while (files.hasNext()) {
    const f = files.next()
    if (f.isTrashed()) continue
    const desc = f.getDescription() || ''
    photos.push({
      id: f.getId(),
      createdAt: f.getDateCreated().getTime(),
      owner: desc.indexOf('owner:') === 0 ? desc.slice(6) : '',
    })
  }
  photos.sort((a, b) => b.createdAt - a.createdAt)
  try {
    cache.put(LIST_CACHE_KEY, JSON.stringify(photos), 60)
  } catch (err) {
    // Over the 100KB cache limit (thousands of photos) — just skip caching.
  }
  return photos
}

/** The folder's ID is remembered, so renaming or moving the folder in Drive is fine. */
function getPhotoFolder() {
  const props = PropertiesService.getScriptProperties()
  const id = props.getProperty('PHOTO_FOLDER_ID')
  if (id) {
    try {
      const existing = DriveApp.getFolderById(id)
      if (!existing.isTrashed()) return existing
    } catch (err) {
      // Folder was deleted — make a new one below.
    }
  }
  const folder = DriveApp.createFolder(PHOTO_FOLDER_NAME)
  props.setProperty('PHOTO_FOLDER_ID', folder.getId())
  return folder
}

function inPhotoFolder(file) {
  const folderId = getPhotoFolder().getId()
  const parents = file.getParents()
  while (parents.hasNext()) if (parents.next().getId() === folderId) return true
  return false
}

function sha256(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8)
    .map((b) => ('0' + (b & 0xff).toString(16)).slice(-2))
    .join('')
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

/**
 * Run this once from the editor (choose it in the toolbar dropdown, then ▶ Run) to grant
 * Drive access before deploying. It creates the photo folder and logs where it is.
 */
function setupPhotos() {
  const folder = getPhotoFolder()
  Logger.log('Guest photos folder: ' + folder.getName() + ' → ' + folder.getUrl())
}
