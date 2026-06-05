# SignalFit
### See the patterns your body is trying to tell you.

Built at the **Miami Cursor Hackathon** · Build & Ship Track

---

## What it does

Most people track food in one app, sleep in another, and workouts somewhere else. SignalFit brings them together and asks: *what do these signals say about each other?*

You log what you ate, how you trained, and how you felt. SignalFit derives your nutrition from your meals and uses an AI to surface **possible patterns** — not diagnoses — between your habits and your energy or performance.

> "Short sleep and low calories on a heavy leg day may explain why your performance felt off."

---

## How we built it

**Stack**
- Next.js 14 (App Router) + TypeScript
- Supabase — Postgres database, migrations, seeded food + demo data
- OpenAI GPT-4o — structured JSON output via `response_format: json_object`
- Tailwind CSS
- Vercel — deployed in under 5 minutes

**AI approach**

The LLM never sees raw form fields. We first resolve meals → nutrition totals by fuzzy-matching food descriptions against our `foods` table in Supabase. Then we pass the full enriched payload to GPT-4o with a carefully constrained system prompt that enforces:
- Cautious language ("may suggest", "possible pattern", "based on what you logged")
- A required `safety_note` on every response
- No medical diagnosis, no fear framing, no certainty claims

The response is a typed JSON object — `recovery_status`, `readiness_score`, `signals`, `today_action_plan`, and more — which the frontend renders directly.

**Data**

All logs are saved to Supabase with individual columns for querying (sleep hours, RPE, readiness score, etc.) plus the full insight blob in `jsonb`. We seeded 10 days of realistic demo data for one user so judges can see patterns, not just a single snapshot.

**Cursor**

We used Cursor throughout — `.cursorrules` kept every teammate's AI context aligned on the API contract, enum values, safety language rules, and which files each role owned. No one broke the response shape.

---

## Running locally

```bash
git clone https://github.com/your-org/signalfit
cd signalfit
npm install
cp .env.example .env.local
# fill in your keys (see below)
npm run dev
```

**Required env vars**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

**Database setup**
```bash
supabase link --project-ref your-project-ref
supabase db push
# then run supabase/seed/foods_from_json.sql in the SQL editor
```

---

## Try the demo

Hit **Load demo day** on the form. It loads a scenario with:
- 5 hours of poor sleep
- ~1400 calories (skipped lunch)
- Hard leg day, performance much worse than usual
- Low energy, high stress, work deadlines

Hit **Generate insight** and watch the AI connect the dots.

---

## What's next

- **MyFitnessPal / Apple Health sync** — auto-fill nutrition instead of manual logging
- **Pattern history** — weekly view of readiness score over time
- **User accounts** — track your own data, not just a demo
- **Wearable data** — HRV, resting HR, steps from Apple Watch or Garmin

---

## Team

| Role | Name |
|------|------|
| Product / Demo | |
| Frontend | |
| Backend / API | |
| AI / Prompts | |
| Data / QA | |

---

## Disclaimer

SignalFit is a wellness reflection tool based on data you enter. It is **not** medical advice, diagnosis, or treatment. Always consult a qualified professional for health concerns.
