/**
 * Wedding RSVP → Google Sheet
 * Paste this into Extensions → Apps Script on the sheet, then deploy as a web app.
 * Full steps: google-apps-script/README.md
 */

const SHEET_NAME = 'RSVPs'
const HEADERS = ['Submitted', 'Name', 'Email', 'Attending', 'Dietary Restrictions', 'Message']

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)
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
    sheet.appendRow([
      new Date(),
      name,
      email,
      data.attending ? 'Yes' : 'No',
      clean(data.dietary, 300),
      clean(data.message, 1000),
    ])
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
