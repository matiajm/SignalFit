# SignalFit app

Hackathon application — scaffold here (Next.js recommended).

## Scaffold (Role 2 + 3)

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

Add `POST /api/insight` per [../docs/API-CONTRACT.md](../docs/API-CONTRACT.md).

## OpenAI client (gpt-4.1-mini)

After scaffolding, install the SDK and copy env:

```bash
npm install openai
cp .env.example .env.local
```

Server-side usage (e.g. in `src/app/api/insight/route.ts`):

```typescript
import { createResponseText } from "@/lib/openai";

const text = await createResponseText("Explain quantum computing in simple terms.");
```

Implementation: [src/lib/openai/](./src/lib/openai/).

## Env

```bash
# .env.local
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

## Demo data

Import from [../data/demo-bad-recovery-day.json](../data/demo-bad-recovery-day.json) for the **Load demo day** button.
