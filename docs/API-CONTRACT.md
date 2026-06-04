# SignalFit — API contract

**Endpoint:** `POST /api/insight`  
**Owners:** Role 3 (implementation), Role 4 (schema + prompt). Freeze shape in first 30 minutes.

---

## Request

```json
{
  "goal": "build_muscle",
  "weight_lb": 172,
  "sleep": {
    "hours": 5,
    "quality": "low"
  },
  "nutrition_input": {
    "source": "demo",
    "meals": [
      {
        "name": "breakfast",
        "items": [
          { "description": "coffee black", "quantity": "12 oz" },
          { "description": "banana", "quantity": "1 medium" }
        ]
      },
      {
        "name": "dinner",
        "items": [
          { "description": "chicken breast grilled", "quantity": "6 oz" },
          { "description": "white rice cooked", "quantity": "1 cup" }
        ]
      }
    ],
    "pasted_text": null,
    "skipped_log": false
  },
  "nutrition": {
    "calories": 1400,
    "protein_g": 80,
    "carbs_g": 120,
    "fat_g": 45,
    "fiber_g": 12,
    "meals_count": 2,
    "ate_enough_for_goal": "no",
    "micronutrients": {
      "vitamin_d": { "status": "low" },
      "magnesium": { "status": "partial" },
      "iron": { "status": "not_sure" }
    }
  },
  "supplements": {
    "multivitamin": "no",
    "vitamin_d": "skipped",
    "other": "creatine 5g"
  },
  "training": {
    "trained": true,
    "type": "strength",
    "duration_min": 75,
    "muscle_groups": ["quads", "glutes", "hamstrings"],
    "exercises": "Back squat 3x5 @RPE8, RDL 3x8, leg press 2x12",
    "intensity": "hard",
    "rpe": 8,
    "performance_vs_usual": "much_worse",
    "volume_feel": "normal",
    "soreness": 4,
    "soreness_areas": ["quads", "glutes"]
  },
  "wellbeing": {
    "energy": "low",
    "mood": "low",
    "stress": "high",
    "motivation": "low"
  },
  "notes": "deadlines at work",
  "recent_days": []
}
```

- **`nutrition`:** Server-computed from `nutrition_input` + `data/foods.json`, or pre-filled when `source` is `"demo"`.  
- **`recent_days`:** Same shape, abbreviated; load from `data/recent-days.json` for demo.

---

## Response

```json
{
  "recovery_status": "moderate",
  "readiness_score": 62,
  "main_insight": "Your workout performance may be limited more by recovery and fueling than effort.",
  "summary": "Short sleep, high stress, and low calories from what you logged appear to line up with lower energy and weaker training today.",
  "what_is_helping": [
    "You still trained today.",
    "You got some protein in.",
    "You tracked enough data to notice a pattern."
  ],
  "what_is_hurting": [
    "Sleep was short.",
    "Stress was high.",
    "Food intake may be low for your goal."
  ],
  "possible_connections": [
    "Low sleep and high soreness may be reducing training readiness.",
    "Based on what you logged, calories and protein may be low for leg day and a build-muscle goal.",
    "High stress may be affecting energy and recovery."
  ],
  "signals": {
    "nutrition": {
      "status": "low",
      "insight": "From what you logged, food intake may not be enough for strong training performance."
    },
    "sleep": {
      "status": "low",
      "insight": "Short sleep may be one of the biggest recovery bottlenecks."
    },
    "training": {
      "status": "okay",
      "insight": "Training effort was high, but performance was lower than usual."
    },
    "stress": {
      "status": "low",
      "insight": "High stress may be adding recovery load."
    }
  },
  "today_action_plan": [
    "Avoid max-effort training if soreness and fatigue stay high.",
    "Eat one solid meal with protein and carbs.",
    "Prioritize sleep tonight."
  ],
  "tomorrow_focus": "Recover better before pushing intensity again.",
  "reflection_question": "Do your lower-energy days also happen after short sleep or lighter food days?",
  "safety_note": "This is general wellness reflection based on the data you entered, not medical advice. Talk to a qualified professional for health concerns."
}
```

---

## Enums (suggested)

| Field | Values |
|-------|--------|
| `goal` | `build_muscle`, `lose_fat`, `performance`, `feel_better`, `maintain` |
| `sleep.quality` | `low`, `okay`, `good` |
| `ate_enough_for_goal` | `yes`, `somewhat`, `no` |
| `training.performance_vs_usual` | `better`, `normal`, `below`, `much_worse` |
| `signals.*.status` | `low`, `okay`, `high` (domain-specific meaning) |
| `wellbeing.*` | `low`, `okay`, `high` |

---

## LLM instructions (Role 4)

- Always include `safety_note`.  
- Reference meals when discussing nutrition, not only numbers.  
- Use cautious phrasing; no diagnosis.  
- If `skipped_log` is true, say insight is limited based on available data.
