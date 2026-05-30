# Quickstart: AI Calorie Tracker Mobile App

## Prerequisites

- Node.js 22 LTS
- npm configured for the internal registry when applicable:

```bash
npm config set registry https://artifactory.tools.bestbuy.com/artifactory/api/npm/npm-virtual
```

- iOS Simulator with Xcode for iOS development
- Android Studio emulator for Android development
- AI provider API key available only to the API service environment
- Nutrition database provider credentials available only to the API service environment

## Initial Project Setup

```bash
npm install
npm run typecheck
npm test
```

## Expected Source Layout

```text
apps/mobile
services/api
packages/shared
```

The plan defines the layout before code generation. `/speckit.tasks` should create setup tasks for these paths.

## Environment Variables

Create API-local environment configuration outside committed source:

```bash
AI_PROVIDER_API_KEY=...
NUTRITION_PROVIDER_API_KEY=...
AUTH_JWKS_URL=...
IMAGE_INFERENCE_TIMEOUT_MS=10000
AI_LOW_CONFIDENCE_THRESHOLD=0.5
```

Mobile builds must not contain provider secrets.

## Run Mobile App

```bash
npm run dev:mobile
```

Expected behavior once implemented:
- Auth gate appears before app use.
- Onboarding calculates editable calorie and macro goals.
- Home dashboard renders local diary totals.
- Scan opens camera/gallery flow.

## Run API Proxy

```bash
npm run dev:api
```

Expected behavior once implemented:
- API requires authenticated requests.
- Meal analysis accepts transient image payloads.
- Raw meal images are discarded after inference unless explicit backup/share consent is present.
- Provider keys remain server-side.

## Test Strategy

Write tests before implementation.

```bash
npm run test:mobile
npm run test:api
npm run test:contracts
```

Required coverage from constitution:
- Macro calculation and serving multiplier logic.
- Calorie aggregation and local DailySummary updates.
- Streak qualification and timezone rollover.
- Goal-threshold evaluation.
- AI service wrapper contract with mock provider.
- Local SQLite read/write and diary aggregate queries.
- Macro progress ring and weekly history chart UI snapshots.

## Manual Validation Flow

1. Sign in or create an account.
2. Complete onboarding and verify editable calorie/macro targets.
3. Open Home and confirm empty diary state renders offline.
4. Capture or import meal photo.
5. Confirm AI/nutrition result includes calories, protein, carbs, and fat.
6. Adjust serving quantity and verify recalculation.
7. Save meal and confirm Home totals update immediately from local data.
8. Disable network and confirm diary and macro rings still render.
9. View Progress and verify empty/history states.
10. Explicitly share a selected meal to a group and confirm private content is not auto-posted.

## Privacy Validation

- Confirm no raw meal image is stored server-side after AI inference without opt-in.
- Confirm API keys are absent from mobile bundle/config.
- Confirm delete/export endpoints require authentication.
- Confirm community posts are created only after explicit share action and group selection.
