# RSVP → Google Sheet & photos → Google Drive setup (about 5 minutes)

1. Create a new Google Sheet, for example "Adeola & Tobi — RSVPs".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the starter code, paste in everything from `Code.gs`, and save.
4. Click **Deploy → New deployment**. Under the gear icon, choose **Web app**, then set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy** and approve the permissions prompt. Google warns that the app is unverified because it's your own script; choose *Advanced → Go to project*.
6. Copy the **Web app URL**. It ends in `/exec`.
7. In the project root, copy `.env.example` to `.env` and paste the URL:
   ```
   VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
   ```
8. Restart `npm run dev`. RSVPs now land in the **RSVPs** tab, and the header row is created automatically.

**To test the endpoint:** open the `/exec` URL in a browser. It should show `{"ok":true,"status":"RSVP endpoint is running"}`.

**After editing `Code.gs`:** go to *Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy*. This keeps the same URL. If you use "New deployment" instead, the URL changes.

**When hosting (Vercel, Netlify, etc.):** add `VITE_RSVP_ENDPOINT` as an environment variable in the host's dashboard, then redeploy.

Until the variable is set, the site stores RSVPs in the browser's localStorage, so you can test the form without a sheet.

## Guest photos → Google Drive (`Photos.gs`)

Photos use a **separate** script so they can live in a different Google account's Drive (the photos count against the storage of whichever account owns this script). The RSVP script above doesn't change.

1. Signed into the account that should hold the photos, go to [script.google.com](https://script.google.com) → **New project**.
2. Replace the starter code with everything from `Photos.gs`, and save.
3. In the toolbar, choose **setupPhotos** in the function dropdown, then click **▶ Run** and approve the permissions. The log shows a link to the new **AdeOba — Guest Photos** folder.
4. **Deploy → New deployment → Web app**, with **Execute as: Me** and **Who has access: Anyone**. Copy the `/exec` URL.
5. Add it to `.env` (and to Vercel as a **Config** variable, then redeploy):
   ```
   VITE_PHOTOS_ENDPOINT=https://script.google.com/macros/s/YYYY/exec
   ```

How it works:
- On a good connection the site uploads each photo's original file (up to 25MB). On a slow one, or if the original takes too long, it sends a copy resized to 2400px (roughly 1MB) instead.
- Every photo is shared as "anyone with the link can view" so the gallery can show it. The folder itself isn't listed anywhere public.
- Guests can delete only their own uploads. The couple can remove any photo by deleting it from the Drive folder; it disappears from the gallery within a minute.
- Until `VITE_PHOTOS_ENDPOINT` is set, uploads are only kept in the guest's own browser.
