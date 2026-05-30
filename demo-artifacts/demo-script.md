# Loom Demo Script

## 1. Intro

Hi, I built CalorieTracker, an AI calorie tracker inspired by Cal AI-style meal scanning. The app focuses on quickly scanning a meal, estimating calories and macros, allowing corrections, and saving the meal locally with privacy-first defaults.

## 2. Architecture

The project is a TypeScript monorepo:

- `apps/mobile` is the Expo React Native app.
- `services/api` is the Fastify API proxy for AI and nutrition providers.
- `packages/shared` holds shared domain types, Zod schemas, constants, and nutrition/confidence utilities.

The architecture keeps provider credentials out of the mobile app and keeps meal/photo data local-first.

## 3. Demo Flow

1. Open the mobile app.
2. Show the auth/onboarding gate.
3. Open the Scan tab.
4. Show camera/gallery controls.
5. Trigger the meal analysis flow.
6. Open Nutrition Results.
7. Show calories, protein, carbs, fat, and serving quantity changes.
8. Open Fix Results to show correction support.
9. Tap Done to save the meal locally.

## 4. Privacy Callout

Photos are local-first. The backend only handles transient analysis requests unless the user explicitly opts into backup or sharing. Community sharing is private by default and requires explicit consent.

## 5. Quality Evidence

Show these commands passing:

```sh
nvm use 22.21.0
npm run typecheck
npm test -- --runInBand
npm run lint
```

## 6. Close

Phase 3 completes the MVP scan-to-log loop. The next phase is the Home/Diary and macro progress experience.