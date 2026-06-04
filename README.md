# SignalFit

**See the patterns your body is trying to tell you.**

SignalFit is a wellness and performance reflection app for the Miami Cursor Hackathon. Users log what they ate (MyFitnessPal-style), weight, sleep, training, and how they feel. The app derives nutrition from food logs and uses AI to surface **possible patterns** between habits and energy or performance — not medical advice.

**Repository:** [github.com/matiajm/SignalFit](https://github.com/matiajm/SignalFit)

---

## Hackathon deliverables

| Deliverable | Location |
|-------------|----------|
| Public URL | Deploy the `app/` folder when built (Vercel recommended) |
| Working app | Daily check-in → insight |
| `.cursorrules` | Repo root |
| README | This file |

Submit before **9:00pm** at the event. Deploy a working URL by **~7:30pm** when possible.

---

## Team docs

| Doc | Purpose |
|-----|---------|
| [docs/TEAM-ROLES.md](./docs/TEAM-ROLES.md) | Who owns what (5 roles) |
| [docs/GAMEPLAN.md](./docs/GAMEPLAN.md) | Timeline and phases |
| [docs/PRODUCT.md](./docs/PRODUCT.md) | Product scope, fields, nutrition model |
| [docs/API-CONTRACT.md](./docs/API-CONTRACT.md) | Request/response JSON for `/api/insight` |

---

## Repo layout

| Path | Purpose |
|------|---------|
| `app/` | **Hackathon app** (Next.js or similar) — build here |
| `data/` | Demo payloads and fake food database |
| `docs/` | Product and team planning |
| `.cursor/` | Cursor rules and skills |
| `deepagents/` | Reference / workshop material (not the shipped product) |
| `DEV-ENVIRONMENT-GUIDE.md` | Deep Agents local setup (optional) |

---

## Quick start (app — once scaffolded)

```bash
cd app
npm install
cp .env.example .env.local   # add OPENAI_API_KEY or ANTHROPIC_API_KEY
npm run dev
```

---

## How we built this

Built with [Cursor](https://cursor.com) during the Miami Cursor Hackathon. See `.cursorrules` for project-specific AI and safety guidelines.

---

## What's next (after hackathon)

- Paste or sync food logs from MyFitnessPal or similar
- Real food/nutrition API instead of `data/foods.json`
- User accounts and history (no seeded `recent_days` only)
