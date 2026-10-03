import { mockBackend } from './mock'
import { sheetsConfigured, submitRsvpToSheet } from './sheets'
import { drivePhotos, photosConfigured } from './photos'

/**
 * The UI only calls `backend.*`, so swapping storage later means editing this file only.
 *
 * @typedef {Object} RsvpInput
 * @property {string} name
 * @property {string} email
 * @property {boolean} attending
 * @property {boolean} plusOne
 * @property {string} [guestName]
 * @property {string} [dietary]
 * @property {string} [message]
 *
 * @typedef {Object} Photo
 * @property {string} id
 * @property {string} url       Full-size image for the viewer
 * @property {string} [thumb]   Smaller image for the grid
 * @property {string} [download] Link that downloads the file
 * @property {number} createdAt
 * @property {boolean} mine  True when this visitor uploaded it (so they can delete it)
 */

export const backend = {
  // RSVPs go to the Google Sheet once VITE_RSVP_ENDPOINT is set; until then they're saved locally for testing.
  submitRsvp: sheetsConfigured ? submitRsvpToSheet : mockBackend.submitRsvp,

  // Photos go to Google Drive once VITE_PHOTOS_ENDPOINT is set; until then they stay in this browser.
  listPhotos: photosConfigured ? drivePhotos.listPhotos : mockBackend.listPhotos,
  uploadPhoto: photosConfigured ? drivePhotos.uploadPhoto : mockBackend.uploadPhoto,
  deletePhoto: photosConfigured ? drivePhotos.deletePhoto : mockBackend.deletePhoto,
}
