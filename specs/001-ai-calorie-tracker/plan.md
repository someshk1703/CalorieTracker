# Implementation Plan: AI Calorie Tracker Mobile App

**Branch**: `001-calorie-tracker-spec` | **Date**: 2026-05-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-ai-calorie-tracker/spec.md`

## Summary

Build a cross-platform mobile AI calorie tracker where authenticated users capture or import meal photos, receive confidence-gated nutrition estimates through a backend AI proxy, confirm or correct results, and save them into a local-first diary. The plan uses an Expo React Native app with SQLite-backed offline diary/progress data and a Node.js API proxy that handles AI vision, nutrition-database matching, and privacy-safe request mediation.

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js 22 LTS for API proxy; React Native via Expo SDK 53+  
**Primary Dependencies**: Expo, React Native, Expo Router, expo-camera, expo-image-picker, expo-sqlite, React Query, Zustand, Zod, Fastify, OpenAI SDK, nutrition database provider adapter, react-native-svg chart/ring rendering  
**Storage**: Local SQLite on device for diary, goals, streaks, and photo references; backend stores no raw meal images after inference unless user explicitly opts into cloud backup or sharing  
**Testing**: Jest + React Native Testing Library for mobile logic/components; Playwright-style API contract tests or Supertest for API; mocked AI/nutrition providers; Detox optional for E2E after app shell exists  
**Target Platform**: iOS 16+ and Android 12+ (API 31+) mobile app; HTTPS backend proxy  
**Project Type**: Mobile app + API proxy  
**Performance Goals**: AI scan p95 ≤ 10 seconds; scan-to-log flow ≤ 20 seconds for 95% of users; cold start to diary ≤ 2 seconds; macro ring animations at 60 fps  
**Constraints**: No API keys in mobile binary; diary and macro rings must render offline; local-first save before sync/share; bundle download target < 50 MB compressed; private-by-default sharing  
**Scale/Scope**: Initial release supports one authenticated personal diary per user, six primary screens from reference app, P1 scan/diary flow, P2 progress, and P3 community/compare features

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] AI calls use backend proxy — no client-side API key exposure (Principle IV).
- [x] Nutritional data persisted locally before any network call (Principle II).
- [x] AI confidence threshold enforced; low-confidence results prompt user confirmation (Principle I).
- [x] Offline diary and macro rings render without network access (Principle II).
- [x] Tests written before implementation — TDD gate satisfied (Principle III).
- [x] Feature is independently deliverable without requiring other in-flight work (Principle V).

**Gate Result**: PASS. No constitution violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-calorie-tracker/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md              # Created by /speckit.tasks, not /speckit.plan
```

### Source Code (repository root)

```text
apps/
└── mobile/
    ├── app/              # Expo Router screens and route groups
    ├── src/
    │   ├── components/   # Reusable UI primitives, rings, charts, cards
    │   ├── features/     # scan, diary, progress, community, compare, auth
    │   ├── data/         # SQLite schema, repositories, migrations
    │   ├── services/     # API client, image handling, sync/share services
    │   ├── state/        # client stores and query keys
    │   └── test/         # mobile test utilities and fixtures
    └── tests/
        ├── unit/
        ├── integration/
        └── ui/

services/
└── api/
    ├── src/
    │   ├── routes/       # analyze, nutrition, share, delete/export
    │   ├── services/     # AI vision and nutrition provider adapters
    │   ├── schemas/      # Zod request/response contracts
    │   └── security/     # auth verification, redaction, consent checks
    └── tests/
        ├── contract/
        ├── integration/
        └── unit/

packages/
└── shared/
    ├── src/              # shared types, validation schemas, constants
    └── tests/
```

**Structure Decision**: Use a mobile + API monorepo. The mobile app owns offline UI, local diary persistence, camera/gallery flows, and progress rendering. The API proxy owns all secret-bearing AI/nutrition calls and privacy-sensitive media handling. Shared contracts reduce drift between mobile and API without introducing extra services.

## Phase 0 Research Summary

See [research.md](research.md) for decisions and alternatives.

Key decisions:
- Expo React Native for cross-platform mobile delivery.
- Backend proxy for AI vision and nutrition database access.
- SQLite local-first storage with photo references kept on device by default.
- Hybrid nutrition pipeline: AI food/portion detection + database calorie/macro calculation + AI fallback.
- Private-by-default community sharing with explicit group destination.

## Phase 1 Design Summary

See [data-model.md](data-model.md), [contracts/openapi.yaml](contracts/openapi.yaml), and [quickstart.md](quickstart.md).

Primary entities:
- UserProfile
- MealEntry
- FoodDetectionResult
- DailySummary
- StreakRecord
- ProgressPoint
- CommunityPost
- TransformationPair

Primary contracts:
- `POST /v1/analyze-meal`
- `POST /v1/nutrition/resolve`
- `POST /v1/meals/share`
- `POST /v1/progress/share`
- `DELETE /v1/media/{mediaId}`
- `GET /v1/privacy/export`

## Post-Design Constitution Check

- [x] AI calls use backend proxy — `contracts/openapi.yaml` exposes analysis via API only; no client secret flow.
- [x] Nutritional data persisted locally before any network call — `MealEntry` and `DailySummary` are local-first entities.
- [x] Confidence threshold enforced — `FoodDetectionResult` includes confidence and confirmation state.
- [x] Offline diary and macro rings render without network access — mobile source structure includes local SQLite repositories.
- [x] Tests written before implementation — quickstart and future tasks require unit, integration, and UI tests before feature code.
- [x] Feature independently deliverable — user stories remain split into P1 scan/diary, P2 progress, P3 community/compare.

**Gate Result**: PASS. No complexity exceptions required.

## Complexity Tracking

No constitution violations or complexity exceptions.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |