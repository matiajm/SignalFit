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

The server-side OpenAI helper is still available at `src/lib/openai/` and defaults to `gpt-4.1-mini`.

Keep real keys in `.env.local`; it is ignored by Git:

```bash
OPENAI_API_KEY=sk-...
```
