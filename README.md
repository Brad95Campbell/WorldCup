# World Cup 2026 Pool — Deployment Guide

This turns your tracker into a real website with a shareable link and **fully automatic live updates**. A scheduled job pulls finished match results from a free football data feed every few minutes and the standings update themselves — no manual entry needed. There's also a **password-protected manual override** so you can set or correct any result yourself if the feed is wrong or slow; anything you set by hand is locked and the auto-updater won't touch it.

You'll set up four free accounts: **GitHub** (stores the code), **Supabase** (the shared database + the auto-updater + the override), **Vercel** (hosts the site), and **football-data.org** (the free results feed). Total time: about 45 minutes the first time.

You do NOT need to be a programmer, and you do **not** need to use the terminal — the whole thing can be done by clicking and pasting in websites. (There's one optional "preview on your computer" step that uses the terminal, clearly marked, that you can skip.)

---

## What you need

- A free **GitHub** account: https://github.com/signup
- A free **Supabase** account: https://supabase.com (sign in with GitHub)
- A free **Vercel** account: https://vercel.com (sign in with GitHub)
- A free **football-data.org** account: https://www.football-data.org/client/register — after registering, they email you an **API token**. Save it; you'll need it in Part 3.

> **Node.js** is only needed if you want to do the optional local preview (Part 2). For the main click-based path you can ignore it.

---

## Part 1 — Set up the database (Supabase)

1. Go to https://supabase.com and click **New project**.
2. Give it a name like `worldcup-pool`, set a database password (save it somewhere), pick the region closest to you, and click **Create new project**. Wait ~2 minutes for it to finish setting up.
3. In the left sidebar, click the **SQL Editor** icon.
4. Click **New query**, then open the file `supabase-setup.sql` from this project, copy ALL of it, paste it into the editor, and click **Run**. You should see "Success". This creates the table that stores results and switches on live updates.
5. Now get your keys. Click the **Connect** button (top of the screen) — or go to **Project Settings → API**.
   - Copy the **Project URL** (looks like `https://abcdxyz.supabase.co`).
   - Copy the **Publishable key** (starts with `sb_publishable_...`). If you don't see one, click **Create new API keys** first.
   - Keep these two values handy for Part 2 and Part 4.

> The publishable key is safe to put in a website — it only allows the actions your SQL policies permit (read results, and write results which your admin password gates in the app).

---

## Part 2 — (Optional) Test it on your computer first  ·  *you can skip this*

**You can skip this entire part.** It's only for previewing the site locally before going live, and it's the one part that needs the terminal. If you'd rather just deploy and see it live, jump straight to Part 3 — nothing later depends on this.

<details>
<summary>Click to expand the optional local-test steps</summary>

1. Open the **Terminal** app (Mac) or **Command Prompt / PowerShell** (Windows).
2. Navigate into this project folder. For example, if it's in your Downloads:
   ```bash
   cd ~/Downloads/worldcup-pool
   ```
3. Install the project's building blocks:
   ```bash
   npm install
   ```
4. Create your local settings file. Copy `.env.example` to a new file named exactly `.env`, then open it and paste in the two values from Supabase:
   ```bash
   cp .env.example .env
   ```
5. Start it:
   ```bash
   npm run dev
   ```
   Open the `http://localhost:5173` link it prints. You'll see the tracker with matches as "Scheduled". Press `Ctrl + C` to stop.

</details>

---

## Part 3 — Set up the automatic results updater (in the Supabase website)

This is the piece that fills in results on its own. It's two small programs ("Edge Functions") that live inside Supabase. **You'll set these up entirely by clicking in the Supabase website — no terminal, no commands.**

There are two functions to create:
- **`sync-results`** — the robot that reads finished matches and fills in winners
- **`manual-result`** — the one that powers your password-protected override button

Do B1 once, then repeat B2 for each function.

---

### Step 1 — Open the Edge Functions area

1. Go to your project in the Supabase dashboard (https://supabase.com/dashboard).
2. In the far-left icon sidebar, click the **Edge Functions** icon (it looks like a little lightning bolt / `λ` symbol). If you can't spot it, use the search bar at the top and type "Edge Functions".

You'll land on a page titled **Edge Functions** with a button to deploy a new one.

---

### Step 2 — Create the first function (`sync-results`)

1. Click **Deploy a new function**, then choose **Via Editor** (this opens a code editor right in your browser).
2. At the top, there's a box for the function **name**. Type exactly:
   ```
   sync-results
   ```
3. The editor will show some starter "Hello World" code. Select all of it and delete it.
4. Open the project file `supabase/functions/sync-results/index.ts`, copy **everything** in it, and paste it into the editor.
5. Click **Deploy function** (bottom-right). After a few seconds it'll say it deployed. Done with this one.

### Step 2b — Create the second function (`manual-result`)

Repeat the exact same steps:
1. Back on the Edge Functions page, click **Deploy a new function → Via Editor**.
2. Name it exactly:
   ```
   manual-result
   ```
3. Delete the starter code.
4. Copy everything from `supabase/functions/manual-result/index.ts` and paste it in.
5. Click **Deploy function**.

You now have both functions deployed.

---

### Step 3 — Give the functions their secret values

The functions need three private values to work. You add these once, in the dashboard.

1. In the left sidebar click **Project Settings** (the gear), then find **Edge Functions** within settings, and look for the **Secrets** section. (Or use the top search bar for "Edge Functions secrets".)
2. Add these three secrets one at a time — type the **name** on the left and the **value** on the right, then click **Add**/**Save** for each:

   | Name | Value |
   |------|-------|
   | `FOOTBALL_DATA_TOKEN` | the token football-data.org emailed you |
   | `ADMIN_PASSWORD` | any password you choose for your override button |
   | `SUPABASE_SERVICE_ROLE_KEY` | see note below |

   > For `SUPABASE_SERVICE_ROLE_KEY`: go to **Project Settings → API**, find the **service_role** key (it's hidden behind a "Reveal" button), copy it, and paste it as the value. This key is powerful — only ever paste it here inside Supabase, never into the website code or anywhere public.

   > `SUPABASE_URL` is provided automatically — you don't need to add it.

---

### Step 4 — Test that the updater works (optional but reassuring)

1. Go back to **Edge Functions**, click **`sync-results`**, then find the **Invoke** / **Run** option (or the "Test" tab).
2. Run it. You'll get a response like `{ "ok": true, "upserted": 0, "unmatched": [] }`.
   - `upserted: 0` is **correct** before any matches have finished — it just means there were no new results to write yet.

---

### Step 5 — Turn on the 5-minute schedule

This makes `sync-results` run automatically on a timer.

1. In the left sidebar, open **SQL Editor**, click **New query** (this is the same place you ran the setup SQL in Part A).
2. Open the project file `supabase-cron.sql`. Near the bottom it has two placeholders to fill in:
   - `<PROJECT-REF>` → the part before `.supabase.co` in your project URL (e.g. if your URL is `https://abcdxyz.supabase.co`, it's `abcdxyz`)
   - `<SERVICE-ROLE-KEY>` → the same **service_role** key you used in B3 (Project Settings → API → reveal service_role)
3. Paste the edited SQL into the editor and click **Run**.

That's it. Every 5 minutes the updater checks for finished World Cup matches and writes any results. Your site updates live with no further action.

> **Want to confirm the schedule is running?** In the SQL Editor, run:
> ```sql
> select * from cron.job_run_details order by start_time desc limit 5;
> ```
> You'll see a row appear roughly every 5 minutes.

> **If a finished match doesn't show a result:** the feed spelled a nation differently than the site. In the Edge Functions editor, open `sync-results`, find the `NAME_ALIASES` list, add the feed's spelling (the Invoke response in B4 lists any `unmatched` games), and click **Deploy updates**.

---

## How your manual override works (once deployed)

Nothing more to set up — Steps 2 and 3 already handled it. On the live site:

1. Click **🔒 Admin** (top-right of the header).
2. Enter the `ADMIN_PASSWORD` you chose in Step 3.
3. Win / Draw / Reset controls appear under every match.

Anything you set by hand shows a yellow **✎ Manual** badge and is **locked** — the automatic updater leaves it alone. Click **Clear result** on a match to unlock it and let the feed manage it again.

---

## Part 4 — Put the code on GitHub (drag & drop in the browser)

GitHub lets you upload files right in the browser. No git commands needed.

1. Go to https://github.com/new and create a new repository named `worldcup-pool`. Leave it **Private** if you like. **Don't** check "Add a README". Click **Create repository**.
2. On the next page, click the link **"uploading an existing file"** (it's in the line "…or push an existing repository… / uploading an existing file").
3. Open your `worldcup-pool` folder on your computer, select **all the files and folders inside it**, and drag them onto the GitHub upload area. (Make sure you grab the `src` and `supabase` folders too — drag the *contents* of `worldcup-pool`, not the outer folder.)
4. Wait for the files to finish uploading, then click **Commit changes**.

That's your code on GitHub. 

> The `.env` file isn't in your project folder unless you created it during the optional Part 2 — and even if it is, don't upload it. Your real keys go into Vercel in the next part, never into GitHub.

---

## Part 5 — Deploy the live site (Vercel)

1. Go to https://vercel.com and click **Add New → Project**.
2. **Import** the `worldcup-pool` repository from GitHub. (First time only: Vercel will ask permission to access your GitHub — click **Install**, pick the repo, save.) Vercel auto-detects it's a Vite app — leave the build settings as-is.
3. Before clicking Deploy, expand **Environment Variables** and add your two values (from Supabase, Project Settings → API):
   - Name: `VITE_SUPABASE_URL` → Value: your project URL
   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY` → Value: your publishable key
4. Click **Deploy**. After a minute you'll get a public URL like `https://worldcup-pool.vercel.app`.
5. Open it and confirm it loads. **That URL is what you share with your 9 players.** Results fill in automatically as matches finish.

---

## Making changes later

To change something, edit the file on GitHub directly (click the file in your repo, click the pencil ✏️ icon, edit, **Commit changes**) — or re-upload it via the same drag-and-drop. Vercel notices the change and rebuilds the live site within about a minute.

---

## Common questions

**Does anyone need to enter results?** No. The scheduled updater reads finished matches from football-data.org and writes the winners automatically. You only step in via the **🔒 Admin** override if something needs correcting.

**How fast do results show up?** The updater runs every 5 minutes, so a result typically appears within a few minutes of full-time. The free feed itself can occasionally lag a little — fine for a pool.

**Do results persist?** Yes — they live in the Supabase database permanently, not in any one browser.

**It says "Loading results…" forever.** Double-check the two environment variables in Vercel match your Supabase values exactly, and that you ran the `supabase-setup.sql`.

**A finished match isn't showing a result.** It's almost always a nation-name spelling the feed uses that differs from the site. In the Supabase dashboard, open **Edge Functions → sync-results**, find the `NAME_ALIASES` list in the code, add the feed's spelling, and click **Deploy updates**. (The function's Invoke response lists any `unmatched` games so you know exactly what to add.)

**Can I correct a result manually?** Yes — click **🔒 Admin** on the site, enter your `ADMIN_PASSWORD`, and Win / Draw / Reset controls appear on each match. Manually-set results are locked (yellow ✎ Manual badge) and the auto-updater won't overwrite them.

**Can I correct a result manually if the feed is wrong?** Yes. Click **🔒 Admin** on the site, enter your password (the `ADMIN_PASSWORD` you set in Step 3), and Win / Draw / Reset controls appear on each match. Anything you set is locked with a **✎ Manual** badge and the auto-updater won't overwrite it. Click **Clear result** to hand a match back to the automatic feed.

**Is the manual override secure on a public site?** Yes. The password and the database's privileged key live only inside Supabase. The browser sends just the password to a server-side function that checks it before writing — visitors can only read.
