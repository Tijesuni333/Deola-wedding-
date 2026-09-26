# RSVP → Google Sheet setup (about 5 minutes)

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
