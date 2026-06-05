"""Smoke-test SignalFit structured insight JSON.

Run from repo root:
    python scripts/test_signalfit_insight.py
"""

from __future__ import annotations

import json
import sys
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.openai import create_json_response_object

MODEL = "gpt-4o-mini"
SEED_PATH = ROOT / "data/one-user-input-seed.json"

STATUS_SIGNAL_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "status": {"type": "string", "enum": ["needs_attention", "stable", "strong"]},
        "insight": {"type": "string"},
    },
    "required": ["status", "insight"],
}

INSIGHT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "readiness_score": {"type": "number"},
        "recovery_status": {"type": "string", "enum": ["low", "moderate", "high"]},
        "main_insight": {"type": "string"},
        "summary": {"type": "string"},
        "what_is_helping": {"type": "array", "items": {"type": "string"}},
        "what_is_hurting": {"type": "array", "items": {"type": "string"}},
        "possible_connections": {"type": "array", "items": {"type": "string"}},
        "signals": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "nutrition": STATUS_SIGNAL_SCHEMA,
                "sleep": STATUS_SIGNAL_SCHEMA,
                "training": STATUS_SIGNAL_SCHEMA,
                "stress": STATUS_SIGNAL_SCHEMA,
            },
            "required": ["nutrition", "sleep", "training", "stress"],
        },
        "today_action_plan": {"type": "array", "items": {"type": "string"}},
        "tomorrow_focus": {"type": "string"},
        "reflection_question": {"type": "string"},
        "safety_note": {"type": "string"},
    },
    "required": [
        "readiness_score",
        "recovery_status",
        "main_insight",
        "summary",
        "what_is_helping",
        "what_is_hurting",
        "possible_connections",
        "signals",
        "today_action_plan",
        "tomorrow_focus",
        "reflection_question",
        "safety_note",
    ],
}

INSTRUCTIONS = """
You are SignalFit's wellness and performance insight engine.

Return JSON only. Analyze the user's current daily check-in and recent history.
Connect the dots between daily human metrics: weight, sleep, food, hydration,
activity, workouts, stress, mood, soreness, symptoms, and performance.
If a metric such as hydration or symptoms is not present in the provided data,
do not invent details for it.

The output must answer:
1. How ready does the user seem today?
2. What is the main pattern worth noticing?
3. What is helping the user?
4. What is hurting the user?
5. What possible connections exist between metrics?
6. What are the nutrition, sleep, training, and stress signals?
7. What should the user do today?
8. What should the user focus on tomorrow?
9. What reflection question can help the user notice patterns?
10. What safety note should be shown?

Use careful language such as "may be connected", "could suggest",
"based on the data entered", "appears to line up with", and "possible pattern".
Avoid definitive or dramatic wording such as "caused", "contributed to",
"induces", "proves", "directly shows", "concerning", "significantly impacts",
or "negatively impacts".
Write directly to the user as "you", not as "the user".

Do not diagnose medical conditions, prescribe treatment, claim certainty, give
extreme diet advice, give unsafe workout advice, push supplements, body shame,
or use fear-based health warnings.
Do not describe supplements as a reason the user is doing well, and do not
recommend supplements. Avoid clinical or loaded labels such as "overtraining".
Never include supplement use in what_is_helping, today_action_plan, or
tomorrow_focus.

readiness_score rules:
- 0 to 100.
- 80-100 means strong readiness.
- 60-79 means moderate/decent readiness.
- 40-59 means low readiness.
- 0-39 means very low readiness.
- It is a reflection score based only on user-entered data, not a clinical score.

recovery_status rules:
- "low" if sleep, energy, stress, soreness, or symptoms suggest poor recovery.
- "moderate" if the data is mixed.
- "high" if sleep, energy, stress, soreness, and performance look strong.

Field rules:
- main_insight: one strong, non-generic sentence connecting multiple metrics.
- summary: short paragraph explaining the main insight.
- what_is_helping: 2 to 5 positive signals from the data.
- what_is_hurting: 2 to 5 limiting factors from the data.
- possible_connections: 3 to 6 possible relationships between metrics.
- signals: four dashboard cards, each with status and one clear insight.
- today_action_plan: 3 to 5 practical low-risk actions for today.
- tomorrow_focus: one simple priority for tomorrow.
- reflection_question: one useful question for noticing patterns over time.
- safety_note: always say this is general wellness/performance reflection and
  not medical advice. If symptoms are severe, unusual, or persistent, recommend
  speaking with a medical professional.
""".strip()


def main() -> None:
    seed = json.loads(SEED_PATH.read_text(encoding="utf-8"))
    current_day = deepcopy(seed["days"][0])
    recent_days = deepcopy(seed["days"][1:])
    current_day.pop("supplements", None)
    for day in recent_days:
        day.pop("supplements", None)
    prompt_payload = {
        "user": seed["user"],
        "current_day": current_day,
        "recent_history": recent_days,
        "omitted_fields": ["supplements"],
    }

    result = create_json_response_object(
        json.dumps(prompt_payload, indent=2),
        schema=INSIGHT_SCHEMA,
        name="signalfit_insight_report",
        model=MODEL,
        instructions=INSTRUCTIONS,
        description="Dashboard-ready SignalFit wellness and performance insight report.",
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
