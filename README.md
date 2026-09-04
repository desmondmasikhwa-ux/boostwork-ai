# MotionDesk — AI Workplace Productivity Assistant

A modern, responsive AI workspace that helps professionals automate daily tasks with structured prompt engineering and clean, high-contrast UI.

![MotionDesk](public/favicon.ico)

## Features

- **Smart Email Generator** — Generate polished workplace emails by choosing tone, audience, and length.
- **Meeting Notes Summarizer** — Turn raw notes into executive summaries with key points, action items, deadlines, and open questions.
- **AI Task Planner** — Prioritize tasks and build a realistic daily schedule.
- **AI Research Assistant** — Produce decision-ready briefings with insights, risks, and next steps.
- **Copilot Chat** — Ask the AI workspace assistant for drafting, planning, summarizing, and research help.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — Full-stack React framework
- [React 19](https://react.dev) — UI library
- [TypeScript](https://www.typescriptlang.org) — Type-safe development
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first styling
- [Zod](https://zod.dev) — Input validation
- [Lovable AI Gateway](https://docs.lovable.dev/features/ai-gateway) — AI model access

## Design

Electric Athletic design direction: dark ink/navy surfaces, high-contrast orange and volt-lime accents, skewed labels, and a persistent sidebar dashboard layout. Fully responsive for desktop and mobile.

## Getting Started

### Prerequisites

- Node.js 20+
- Bun or npm

### Install dependencies

```bash
bun install
# or
npm install
```

### Run the development server

```bash
bun run dev
# or
npm run dev
```

The app runs at `http://localhost:8080`.

### Build for production

```bash
bun run build
# or
npm run build
```

## AI Configuration

The app uses the Lovable AI Gateway. Make sure `LOVABLE_API_KEY` is configured in your project environment. No additional API keys are required.

## Project Structure

```text
src/
  components/        # Shared UI components (AppShell, tool UI primitives)
  lib/
    ai.functions.ts  # Server functions and AI prompts
  routes/            # TanStack Start file-based routes
  styles.css         # Theme tokens, typography, and utilities
```

## Important Notes

- AI-generated content may require human review. Always verify names, dates, and figures before sending or publishing.
- Server functions run on the edge and read `LOVABLE_API_KEY` at call time.

## License

This project is built and owned by you via [Lovable](https://lovable.dev).
