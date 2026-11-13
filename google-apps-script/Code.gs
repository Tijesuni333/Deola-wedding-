/**
 * Wedding RSVP → Google Sheet
 * Paste this into Extensions → Apps Script on the sheet, then deploy as a web app.
 * Full steps: google-apps-script/README.md
 */

const SHEET_NAME = 'RSVPs'
const HEADERS = ['Submitted', 'Name', 'Email', 'Attending', 'Dietary Restrictions', 'Message']

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(20000) // one RSVP at a time, so rows never interleave
  try {
    const data = JSON.parse(e.postData.contents)

    // Honeypot: real guests never see or fill the hidden "website" field.
    if (data.website) return json({ ok: true })

    const name = clean(data.name, 120)
    const email = clean(data.email, 200)
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || typeof data.attending !== 'boolean') {
      return json({ ok: false, error: 'Missing or invalid fields' })
    }

    const sheet = getSheet()
    const row = [new Date(), name, email, data.attending ? 'Yes' : 'No', clean(data.dietary, 300), clean(data.message, 1000)]

    // A guest whose connection dropped may press Submit again. The site sends the same id for every try of
    // one form, so a repeat updates the row it already wrote instead of adding a duplicate.
    const cache = CacheService.getScriptCache()
    const key = data.id ? 'rsvp:' + String(data.id).slice(0, 64) : ''
    const existing = key ? Number(cache.get(key)) : 0
    if (existing > 1 && existing <= sheet.getLastRow()) {
      sheet.getRange(existing, 1, 1, row.length).setValues([row])
    } else {
      sheet.appendRow(row)
      if (key) cache.put(key, String(sheet.getLastRow()), 21600) // remembered for 6 hours
    }
    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

/** Lets you open the web app URL in a browser to check it's live. */
function doGet() {
  return json({ ok: true, status: 'RSVP endpoint is running' })
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

/** Trim, cap length, and neutralise leading = + - @ so a guest can't inject spreadsheet formulas. */
function clean(value, max) {
  if (value === undefined || value === null) return ''
  let s = String(value).trim().slice(0, max)
  if (/^[=+\-@]/.test(s)) s = "'" + s
  return s
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
