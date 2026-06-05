# SignalFit App

React/Vite frontend integrated from `Fitness Tracking App Design.zip`.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Build

```bash
npm run build
```

## OpenAI client

The server-side OpenAI helper is available at `src/lib/openai/` and defaults to `gpt-4.1-mini`.

Install the SDK and copy env:

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

Keep real keys in `.env.local`; it is ignored by Git:

```bash
OPENAI_API_KEY=sk-...
```
