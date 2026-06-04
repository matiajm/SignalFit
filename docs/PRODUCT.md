# SignalFit — Product spec (hackathon)

## One-liner

Log what you ate, how you trained, and how you felt — we derive nutrition and show **possible patterns** between your habits and your energy or performance.

**Tagline:** See the patterns your body is trying to tell you.

## Guardrails

- Wellness reflection only — **not** medical advice, diagnosis, or treatment.
- Language: “possible pattern”, “may suggest”, “worth noticing”, “based on what you logged”.
- Never: certainty, fear, body shaming, supplement pushing, extreme diet or unsafe training advice.

---

## Nutrition model

**Users enter food.** The app **derives** calories, macros, and key micronutrients.

| Layer | Content |
|-------|---------|
| Input | Meals → line items `{ description, quantity }` |
| Optional | Paste block (demo), “didn’t log food” fallback |
| Derived | `nutrition` object — never typed by user |
| Future | Import from MyFitnessPal (not tonight) |

**Extra supplements** (optional): multivitamin, vitamin D pill, etc. if not in food log.

---

## Form sections

1. **Goal** — build muscle · lose fat · performance · feel better  
2. **Weight today** (lb or kg — team picks one)  
3. **Sleep** — hours + quality (low / okay / good)  
4. **Food** — meals + items; Load demo; optional paste  
5. **Training** — see below  
6. **Feel** — energy, mood, stress, motivation, notes  

### Training (when trained)

- Type: strength · hypertrophy · cardio · HIIT · sport · mobility · mixed  
- Duration (min)  
- Muscle groups (multi-select)  
- Main exercises (text)  
- Intensity · RPE 1–10 · performance vs usual  
- Soreness 1–5 · soreness areas  

### Feel

- Energy · mood · stress · motivation (low / okay / high or similar)  
- Notes  

---

## Insight output (summary)

Full shape in [API-CONTRACT.md](./API-CONTRACT.md).

- `main_insight`, `summary`  
- `what_is_helping`, `what_is_hurting`  
- `possible_connections`  
- `signals`: nutrition, sleep, training, stress  
- `today_action_plan`, `tomorrow_focus`, `reflection_question`  
- `safety_note` (required)  
- `recovery_status` and/or `readiness_score` (optional; don’t present as clinical)

---

## Demo scenario

- 5h sleep, poor quality  
- Light food (skipped lunch, ~1400 cal derived)  
- Hard leg day, performance much worse than usual  
- Low energy, high stress, high soreness  
- Seeded `recent_days` with similar short sleep / low fuel  

Button: **Load demo day** → `data/demo-bad-recovery-day.json`.

---

## Architecture (conceptual)

```
Browser form → POST /api/insight
  → resolve meals → nutrition totals
  → LLM(prompt + today + recent_days)
  → structured insight JSON → results UI
```

Build implementation in `app/`. Reference material in `deepagents/` is optional workshop content, not the shipped hackathon app.
