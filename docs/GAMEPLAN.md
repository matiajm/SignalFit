# SignalFit — Hackathon gameplan

**Event:** Miami Cursor Hackathon — Build & Ship Track  
**Build window:** 6:00pm – 10:30pm (submit URL before **9:00pm**)  
**Demo:** 90 seconds — beginner talks, pro may drive laptop

---

## What we ship tonight

1. Public URL, no login  
2. Log food (MFP-style) → derived nutrition → AI insight  
3. **Load demo day** for judges  
4. `.cursorrules` + README  

**Not tonight:** MyFitnessPal OAuth, real food APIs, user accounts, `deepagents/` as the product.

---

## Timeline

| Time | Phase | Milestone |
|------|--------|-----------|
| 4:00–6:00 | Align + scaffold | Team, contract, `.cursorrules`, deploy hello-world URL |
| 6:00–7:00 | Vertical slice | Form → API → insight (any UI) |
| 7:00–7:30 | Deploy early | Public URL works on phone |
| 7:30–9:00 | Demo-ready | Full form, demo button, insight UI, **submit** |
| 9:00–10:30 | Polish + rehearse | 2× 90s dry runs; freeze features ~9:30 |
| 10:30 | Stage | Role 1 presents |

---

## Phase 0 — Align (first 30 min)

- [ ] Names in [TEAM-ROLES.md](./TEAM-ROLES.md)
- [ ] lb vs kg (pick one)
- [ ] Scaffold `app/` (Next.js recommended)
- [ ] Copy rules → `.cursorrules`
- [ ] Role 5: demo JSON started

---

## Phase 1 — Vertical slice (6:00–7:00)

- [ ] Minimal form → `POST /api/insight`
- [ ] LLM returns valid JSON
- [ ] Show `main_insight` on screen

---

## Phase 2 — Deploy early (7:00–7:30)

- [ ] Env var on host
- [ ] Disclaimer visible
- [ ] Teammate tests URL on phone

---

## Phase 3 — Demo-ready (7:30–9:00)

- [ ] Full form sections (see [PRODUCT.md](./PRODUCT.md))
- [ ] Food log + nutrition summary card
- [ ] Insight UI + **Load demo day**
- [ ] README + submit in event app

---

## Phase 4 — Polish (9:00–10:30)

- [ ] Loading/errors; mobile check
- [ ] Canned fallback if API fails
- [ ] Rehearse demo script (Role 1)

---

## 90-second demo script

1. **Problem (15s):** Food, sleep, and workouts live in different places.  
2. **Load demo (10s):** Hard training day on low food and short sleep.  
3. **Food (15s):** “Like MyFitnessPal — we calculate nutrition from what you ate.”  
4. **Generate (20s):** Main insight + one connection + nutrition signal.  
5. **Safety (10s):** Read `safety_note` — patterns, not diagnosis.  
6. **Future (10s):** Paste/sync from tracker; tonight = sample data.

---

## Judging angles

- **Utility:** Connects habits to how you felt/performed  
- **Creativity:** Food log → derived macros → cross-domain insight  
- **AI build:** Structured JSON + careful language  
- **Beginner story:** Role 1 explains without reading code  
- **Submit early:** Tie-breaker if close

---

## Risks

| Risk | Mitigation |
|------|------------|
| Long form at expo | Mandatory demo button |
| Invalid LLM JSON | Schema + retry + canned fallback |
| Resolver slow | Demo uses precomputed `nutrition` |
| API key leak | Server route only |

See [TEAM-ROLES.md](./TEAM-ROLES.md) for who owns each mitigation.
