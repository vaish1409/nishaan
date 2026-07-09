# Nishaan

*Hindi for "mark" — like the pencil lines on a doorframe tracking how tall a kid's gotten.*

A case-note library for Indian parents: browse real situations by age and topic, or describe your own and get an AI answer that's grounded only in matching cases (never invented).

Built with React + Vite on the frontend, and a small serverless function that calls the Claude API on the backend, so the API key never reaches the browser.

## Features

- **Browse** — 24 seed cases across 5 age bands × 10 behaviour topics, filterable, with a doorframe-style age ruler.
- **Ask** — describe a situation, get a grounded answer that cites which case(s) it drew from. If nothing matches, it says so instead of inventing an answer.
- **Safety gate** — a keyword check runs client-side before any AI call. If it catches something serious, it skips the model and shows CHILDLINE (1098) and iCall instead. This is a minimal, illustrative list — not a real safety classifier.
- **Add a case** - saved to a shared Supabase table through serverless API routes, so every visitor can see submitted cases.
- A few small interaction details: a custom cursor (mouse-only, disabled on touch devices and for people with reduced-motion preferences), staggered card animations, and tab transitions.

## Tech stack

- React 18 + Vite
- Plain CSS (no Tailwind/build step needed for styles)
- `lucide-react` for icons
- One serverless function (`api/guidance.js`) — written for Vercel's zero-config Node functions

## Local setup

```bash
npm install
```

You need the Vercel CLI to run the API route locally (plain `vite dev` only serves the frontend, not `/api`):

```bash
npm install -g vercel
vercel dev
```

Create a `.env` file in the project root first (copy `.env.example`) with your own key:

```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_CASES_TABLE=cases
```

Get a key from the [Claude Console](https://platform.claude.com) → Account Settings → API Keys. Keep it out of git — `.env` is already in `.gitignore`.

## Deploying — step by step

### 1. Push the code to GitHub

```bash
cd nishaan-app
git init
git add .
git commit -m "Initial commit"
```

Create a new empty repository on GitHub (no README/license, you already have them), then:

```bash
git remote add origin https://github.com/<your-username>/nishaan.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

Vercel is the easiest fit here because it auto-detects both the Vite frontend and the `/api` folder as serverless functions, with no config file needed.

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project**, and import the `nishaan` repo you just pushed.
3. Vercel will auto-detect it as a Vite project. Leave the build settings as default (`npm run build`, output directory `dist`).
4. Before deploying, open **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your real API key
   - Key: `SUPABASE_URL`
   - Value: your Supabase project URL
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: your Supabase service role key
   - Key: `SUPABASE_CASES_TABLE`
   - Value: `cases`
   - Apply each one to: Production, Preview, and Development
5. Click **Deploy**. First build takes a minute or two.
6. Once it's live, visit the given `.vercel.app` URL and test the **Ask** tab to confirm the serverless function can reach the API.

Every future `git push` to `main` redeploys automatically.

### 3. (Optional) Custom domain

In the Vercel project → **Settings → Domains**, add your own domain and follow the DNS instructions shown there.

### Alternative: Netlify

Netlify also works, but its functions use a different handler signature (`exports.handler = async (event) => {...}` in `netlify/functions/`), so `api/guidance.js` would need a small rewrite if you go that route. Vercel needs none.

## Shared case database

Cases added in the **Add a case** tab are stored in Supabase through two serverless routes:

- `api/cases-list.js` loads all submitted cases.
- `api/cases-add.js` validates and saves one submitted case.

Create this table in the Supabase SQL editor:

```sql
create table public.cases (
  id text primary key,
  age text not null,
  category text not null,
  situation text not null,
  tried text not null,
  outcome text not null,
  outcome_type text not null check (outcome_type in ('worked', 'mixed', 'backfired')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. Put it in Vercel Environment Variables, never in frontend code.

## Notes for the resume / interview version of this project

- The core technique worth naming is **retrieval-grounded generation**: the AI only ever answers using cases actually retrieved for that query, and the app says so explicitly when nothing matches rather than letting the model improvise.
- The safety gate is intentionally described as illustrative in the code comments — be ready to talk about what a production version would need (a properly reviewed classifier, human-in-the-loop review, logging).
- `src/lib/retrieval.js` uses simple keyword/tag overlap scoring. A natural "v2" to mention: swap it for embedding similarity (e.g. via the Claude API's embeddings support or a small local model).

## License

MIT — see `LICENSE`.
