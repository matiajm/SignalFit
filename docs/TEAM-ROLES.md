# SignalFit — Team roles (5 people)

Fill in **Name** at kickoff. Each role has a **primary owner** and **backup** (who helps if blocked).

**Sync times:** 6:00pm · 7:00pm · 8:30pm — contract changes and blockers only.

---

## Role 1 — Product, demo & pitch

| | |
|--|--|
| **Name** | |
| **Backup** | Role 5 |

### Owns

- App name and one-liner on slides
- 90-second demo script (memorized)
- Disclaimer copy on screen (“wellness reflection, not medical advice”)
- Hackathon submission in the event app (URL, checklist)
- Slide deck: problem → live demo → safety → future (MFP sync)

### Deliverables by deadline

| Time | Output |
|------|--------|
| 6:00pm | Demo script + problem slide bullets |
| 7:30pm | Public URL confirmed on phone |
| 9:00pm | Submission complete |
| 10:30pm | **Beginner presents** on stage; Role 3 or 2 may drive laptop |

### Does not

- Own API implementation or prompt JSON schema (coordinates with Roles 3–4)

---

## Role 2 — Frontend

| | |
|--|--|
| **Name** | |
| **Backup** | Role 3 |

### Owns

- Everything under `app/` UI
- Multi-step form: Goal & weight → Sleep → Food → Training → Feel
- **Load demo day** button (imports `data/demo-bad-recovery-day.json`)
- Nutrition summary card (“From what you logged: …”)
- Insight results UI (cards from API JSON)
- Loading and error states; mobile-friendly layout
- Deploy to Vercel (or host chosen by team)

### Deliverables by deadline

| Time | Output |
|------|--------|
| 7:00pm | Form POSTs to API; shows `main_insight` or raw JSON |
| 7:30pm | Deployed URL with vertical slice |
| 9:00pm | Full form + insight UI + demo button |
| 10:30pm | Polished UI for peer expo (+2 bonus if roving judges agree) |

### Implements against

- [API-CONTRACT.md](./API-CONTRACT.md) — do not change response shape without Role 4

---

## Role 3 — Backend & API

| | |
|--|--|
| **Name** | |
| **Backup** | Role 4 |

### Owns

- `POST /api/insight` (or equivalent server route)
- Food → nutrition resolver using `data/foods.json` (sum macros/micros)
- Demo path: accept precomputed `nutrition` from demo JSON when `source: "demo"`
- Env vars for LLM API key (server-side only)
- JSON validation (Zod or similar) on request and response
- Canned fallback response if LLM fails during expo

### Deliverables by deadline

| Time | Output |
|------|--------|
| 6:30pm | Frozen request/response types shared with Role 2 |
| 7:00pm | Endpoint returns valid insight JSON |
| 7:30pm | Deployed with Role 2 |
| 9:00pm | Resolver + error handling + fallback |

### Does not

- Write system prompt prose (Role 4) — wires prompt + schema together

---

## Role 4 — AI, prompts & schema

| | |
|--|--|
| **Name** | |
| **Backup** | Role 3 |

### Owns

- System prompt: cautious language, no diagnosis, wellness framing
- Required phrases: “possible pattern”, “may suggest”, “based on what you logged”
- Insight JSON schema (matches [API-CONTRACT.md](./API-CONTRACT.md))
- Structured output / JSON mode with Role 3
- Test cases: demo bad day, missing food log, rest day (no training)
- `.cursorrules` updates for AI safety (with team review)

### Deliverables by deadline

| Time | Output |
|------|--------|
| 6:00pm | Response schema in API-CONTRACT.md agreed |
| 6:30pm | Prompt v1 working in Playground or API |
| 9:00pm | Prompt tuned on demo + 2 edge cases |
| 10:30pm | One-liner answers “how does the AI work?” |

### Does not

- Build form UI (Role 2)

---

## Role 5 — Data, QA & docs

| | |
|--|--|
| **Name** | |
| **Backup** | Role 1 |

### Owns

- `data/demo-bad-recovery-day.json` — full hackathon demo scenario
- `data/recent-days.json` — 2–3 prior days for pattern language
- `data/foods.json` — fake food DB for manual add (~20–40 items)
- Manual QA checklist before submit and before stage
- README env var section and “how to run”
- Verify public URL on phone (no login)

### Deliverables by deadline

| Time | Output |
|------|--------|
| 6:00pm | Demo JSON draft with meals + precomputed nutrition |
| 7:00pm | `recent_days` wired into demo payload |
| 9:00pm | README complete; QA sign-off |
| 10:30pm | Backup video or screenshots if live demo risky |

### Demo scenario (must match script)

Short sleep, low food, high stress, hard leg day, weak performance, low energy — see [PRODUCT.md](./PRODUCT.md).

---

## Handoffs (critical path)

```
Role 4 (schema + prompt) ──► Role 3 (API) ──► Role 2 (UI)
Role 5 (demo JSON)      ──► Role 2 + 3
Role 1 (script)         ──► Role 2 (labels, disclaimer)
```

**Contract freeze:** First 30 minutes — no response field renames without all five in agreement.

---

## If someone is stuck

| Blocker | Ask |
|---------|-----|
| API shape | Roles 3 + 4 |
| Form fields | Role 5 + [PRODUCT.md](./PRODUCT.md) |
| Deploy / env | Role 3 + mentors |
| Demo narrative | Role 1 |
| Cursor / tooling | Mentors at event |

---

## Optional name → role mapping (edit at kickoff)

| Name | Role |
|------|------|
| | 1 — Product / demo |
| | 2 — Frontend |
| | 3 — Backend |
| | 4 — AI / prompts |
| | 5 — Data / QA |
