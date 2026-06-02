# Brain Mirror

> An evolving AI cognitive mirror — a psychological operating system, not a chatbot.

Brain Mirror reconstructs how its subject thinks across 40 surgical questions, synthesizes an 8-layer cognitive dossier, then continues evolving the model through ongoing mirror sessions. Memory persists. Contradictions are tracked. Patterns surface.

---

## Stack

- **Next.js 15** (App Router, TypeScript, RSC)
- **TailwindCSS** with a cold monochrome design system (no color, just ink/bone)
- **Framer Motion** for cinematic transitions
- **Supabase** (auth: email/password + Google OAuth; Postgres with RLS)
- **OpenAI** (gpt-4o by default) for synthesis + mirror chat + memory extraction
- **Zustand** for client-side onboarding state
- **Recharts** for monochrome cognitive radar
- **React Markdown** for the mirror's responses

---

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   OPENAI_API_KEY
#   NEXT_PUBLIC_APP_URL (must match the port you use, e.g. http://localhost:3000 or http://localhost:3001)
```

### Database

Run the SQL in `supabase/migrations/0001_init.sql` against your Supabase project (via the SQL editor or the Supabase CLI). It creates:

- `profiles` (1:1 with `auth.users`)
- `reconstruction_responses` (40-question intake)
- `cognitive_dossiers` (8-layer synthesis + radar scores)
- `conversations` + `messages` (mirror chat)
- `cognitive_memory` (evolving long-term memory cells)

All tables ship with Row Level Security and per-user policies.

### Google OAuth

In Supabase: Authentication → Providers → Google → enable, add client id/secret, set redirect URL to `<NEXT_PUBLIC_APP_URL>/auth/callback` (include **3001** in Supabase if that is what you use locally).

---

## Run

```bash
npm run dev
```

Open the URL Next prints (often `http://localhost:3000`; if port 3000 is busy, Next uses **3001** — use that URL instead).

---

## Architecture

### Routing

- `/` — cinematic landing page
- `/auth/sign-in` · `/auth/sign-up` · `/auth/callback` · `/auth/sign-out`
- `/onboarding` — name / age / occupation intake
- `/onboarding/reconstruction` — 40-question protocol
- `/onboarding/analyzing` — synthesis loading screen → calls `/api/reconstruction/analyze`
- `/app` — overview (route group `(app)` shares the sidebar layout)
- `/dossier` — full 8-layer cognitive dossier + radar chart
- `/mirror` · `/mirror/[id]` — evolving chat sessions
- `/app/memory` — every memory cell the mirror is tracking
- `/app/account` — profile, tier, sign out

### AI flow

- **Onboarding synthesis (`/api/reconstruction/analyze`)** sends all 40 responses to OpenAI with a strict JSON schema and a cold-analytical system prompt. Returns the dossier + memory seeds; both are written to the DB.
- **Mirror chat (`/api/mirror/chat`)** loads the latest dossier + top-weighted memory cells + recent conversation history, builds a layered system prompt, and calls OpenAI. After the response is persisted, a background task runs a second pass (`MEMORY_EXTRACTION_SYSTEM`) to extract any new durable patterns into `cognitive_memory`.

### Design system

- Palette: `#050505` → `#161616` ink, `#F5F5F5` bone, `rgba(255,255,255,0.08)` line.
- Typography: Inter for body, JetBrains Mono mapped to `--font-geist-mono` for monospaced labels.
- Motion: slow, eerie, intentional (Framer Motion + custom keyframes for grain, scanlines, shimmer).
- Ambient layers: animated grain, scanlines, vignette, and a faint grid overlay on heroes.

---

## Subscription model

- **Surface (free)** — partial onboarding, surface dossier, 5 mirror sessions, no long-term memory.
- **Mirror ($29/mo)** — full reconstruction, complete 8-layer dossier, unlimited mirror chat, evolving long-term memory, contradiction tracking, trajectory analysis.

Tier is stored on `profiles.subscription_tier` and surfaced in the account page. Billing integration (Stripe) is intentionally left as a thin extension point.

---

## Notes

- All authentication, redirection, and route protection is handled by `src/middleware.ts` + the `(app)` server layout, which also enforces the onboarding state machine: `not_started → in_progress → analyzing → complete`.
- The mirror's voice is configured in `src/lib/ai/mirror-prompt.ts`. Tone, restraint, and confrontation rules live there.
- The dossier schema lives in `src/lib/types/dossier.ts`. The OpenAI prompt enforces this exact shape.
