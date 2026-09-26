import { mockBackend } from './mock'
import { sheetsConfigured, submitRsvpToSheet } from './sheets'

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
 * @property {string} url
 * @property {number} createdAt
 * @property {boolean} mine  True when this visitor uploaded it (so they can delete it)
 */

export const backend = {
  // RSVPs go to the Google Sheet once VITE_RSVP_ENDPOINT is set; until then they're saved locally for testing.
  submitRsvp: sheetsConfigured ? submitRsvpToSheet : mockBackend.submitRsvp,

  // Photo storage is still undecided — the gallery runs on the local mock for now.
  listPhotos: mockBackend.listPhotos,
  uploadPhoto: mockBackend.uploadPhoto,
  deletePhoto: mockBackend.deletePhoto,
}
