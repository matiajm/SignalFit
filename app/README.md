# SignalFit app

Hackathon application — scaffold here (Next.js recommended).

## Scaffold (Role 2 + 3)

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

Add `POST /api/insight` per [../docs/API-CONTRACT.md](../docs/API-CONTRACT.md).

## Env

```bash
# .env.local
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

## Demo data

Import from [../data/demo-bad-recovery-day.json](../data/demo-bad-recovery-day.json) for the **Load demo day** button.
