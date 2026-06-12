# START HERE — Re-uploading correctly

You got a "vite build exited with 127" error last time. That almost always
means the files landed one folder too deep in GitHub, so Vercel couldn't see
`package.json` and never installed Vite. These steps avoid that.

## 1. Unzip

Unzip `worldcup-pool.zip`. You'll get a folder called `worldcup-pool`
containing: `index.html`, `package.json`, `vite.config.js`, a `src` folder,
a `supabase` folder, and a few config files.

## 2. The golden rule for the GitHub upload

When you drag files into GitHub, you must upload the **contents** of the
`worldcup-pool` folder — NOT the folder itself.

- ✅ RIGHT: open the `worldcup-pool` folder, select everything inside it
  (`index.html`, `package.json`, `src`, `supabase`, etc.), and drag those in.
- ❌ WRONG: dragging the single `worldcup-pool` folder in (this nests
  everything one level too deep and causes the 127 error).

After uploading, your GitHub repo's main page should show `package.json` and
`index.html` directly in the list — NOT a single folder you have to click into.

### Quick way to check / fix if it's still nested
If your repo shows one folder you must click into to see `package.json`, you
don't have to re-upload. In Vercel:
Settings → Build and Deployment → **Root Directory** → Edit → type the folder
name (e.g. `worldcup-pool`) → Save → then Deployments → ••• → Redeploy.

## 3. In Vercel, confirm these settings before deploying
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Environment Variables:** `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_PUBLISHABLE_KEY` (your two Supabase values)

Then Deploy. The full walkthrough is in `README.md` (Parts 4 and 5).
