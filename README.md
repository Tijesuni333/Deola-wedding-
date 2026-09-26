# Wedding Website

This is a one-page wedding site built with React (JavaScript), Vite, Tailwind CSS v4, GSAP, and the `cobe` globe library. It's designed mobile-first.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

## Where to edit

| What | File |
|---|---|
| Names, date, venue, timeline, menu, FAQ, **globe cities**, music | `src/config/wedding.js` |
| All UI text (buttons, labels) and a second language | `src/config/i18n.js` |
| Colours and fonts | `@theme` block in `src/index.css`, font link in `index.html` |
| Link-preview title, description, and image | `index.html` |
| Photos, music, and video | `public/images/`, `public/audio/`, then reference them in `wedding.js` |

**Globe cities.** Every entry in `story` becomes a marker, a city button, and a story card. Arcs are drawn between the cities in the order they're listed. To add one, use its `[lat, lng]` coordinates (right-click the spot in Google Maps). If you leave `story` empty, the globe is hidden.

**Second language.** Copy the `en` block in `i18n.js` under a new key such as `yo`, then translate it. The language toggle appears automatically.

## RSVPs → Google Sheet

Follow `google-apps-script/README.md`, then set `VITE_RSVP_ENDPOINT` in `.env`. Until that's set, RSVPs are saved to the browser's localStorage so the form can be tested.

## Guest photo gallery

The gallery currently runs on a **local mock** (`src/services/mock.js`), so each browser only sees its own uploads. To make it shared, implement `listPhotos`, `uploadPhoto`, and `deletePhoto` in a new file and wire them up in `src/services/index.js`. Supabase Storage, Firebase Storage, Cloudinary, or Google Drive via Apps Script would all work.

## Handy links

- `?view=gallery` opens the gallery directly, which is useful on a QR code at the venue.
- `?view=rsvp` opens the RSVP form directly.

## Project layout

```
src/
  config/      wedding.js (content), i18n.js (UI strings)
  services/    index.js (backend switchboard), sheets.js (RSVP → Sheet), mock.js (local)
  hooks/       useApp (theme/music/locale/modals), useCountdown, useReveal
  components/  Loader, Toolbar, Hero, Globe, GlobeStory, WeddingDetails, Rsvp, Gallery, Modal, …
google-apps-script/  Code.gs + setup steps
```
