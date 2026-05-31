# Tasks: AI Calorie Tracker Mobile App

**Input**: Design documents from `/specs/001-ai-calorie-tracker/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Included because the constitution requires test-first development for business logic, AI wrappers, persistence, and UI rendering.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other [P] tasks in the same phase when dependencies are satisfied
- **[Story]**: User story label for traceability (US1, US2, US3, US4)
- Every task includes an exact file path or path group

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the TypeScript monorepo, Expo mobile app, Fastify API service, shared package, and common tooling.

- [X] T001 Create root npm workspace and scripts in package.json
- [X] T002 [P] Create shared TypeScript config in tsconfig.base.json
- [X] T003 [P] Configure linting and formatting in eslint.config.mjs and .prettierrc.json
- [X] T004 [P] Configure Jest project runner in jest.config.ts
- [X] T005 Create Expo mobile package manifest in apps/mobile/package.json
- [X] T006 [P] Create Expo app configuration in apps/mobile/app.config.ts
- [X] T007 Create Fastify API package manifest in services/api/package.json
- [X] T008 Create shared package manifest in packages/shared/package.json
- [X] T009 [P] Create environment examples in services/api/.env.example and apps/mobile/.env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish contracts, authentication boundaries, local persistence, provider abstractions, and test fixtures required by every user story.

**CRITICAL**: No user story work can begin until this phase is complete.

### Tests for Foundation

- [X] T010 [P] Create shared schema validation tests in packages/shared/tests/contracts/shared-schemas.test.ts
- [X] T011 [P] Create API auth middleware tests in services/api/tests/unit/auth-middleware.test.ts
- [X] T012 [P] Create mobile SQLite migration tests in apps/mobile/tests/unit/sqlite-migrations.test.ts
- [X] T013 [P] Create mobile auth gate tests in apps/mobile/tests/ui/auth-gate.test.tsx

### Foundation Implementation

- [X] T014 Create shared domain types for UserProfile, MealEntry, FoodDetectionResult, DailySummary, StreakRecord, ProgressPoint, CommunityPost, and TransformationPair in packages/shared/src/domain.ts
- [X] T015 Create shared Zod schemas for API requests/responses in packages/shared/src/schemas.ts
- [X] T016 [P] Create shared constants for confidence threshold, scan timeout, macro units, and route names in packages/shared/src/constants.ts
- [X] T017 Create mobile SQLite database bootstrap in apps/mobile/src/data/database.ts
- [X] T018 Create mobile SQLite migrations for user profiles, meals, summaries, streaks, progress points, community posts, and transformation pairs in apps/mobile/src/data/migrations.ts
- [X] T019 Create local repository interfaces and implementations in apps/mobile/src/data/repositories.ts
- [X] T020 [P] Create local media storage service for device-only photo references in apps/mobile/src/services/localMediaStorage.ts
- [X] T021 Create mobile API client with auth headers and timeout handling in apps/mobile/src/services/apiClient.ts
- [X] T022 Create mobile auth state and route guard in apps/mobile/src/features/auth/authStore.ts and apps/mobile/app/_layout.tsx
- [X] T023 Create Fastify app bootstrap with request logging and error normalization in services/api/src/app.ts
- [X] T024 Create API auth verification middleware in services/api/src/security/authMiddleware.ts
- [X] T025 [P] Create API redaction and transient image cleanup utilities in services/api/src/security/privacy.ts
- [X] T026 Create AI vision provider interface and mock provider in services/api/src/services/aiVisionProvider.ts
- [X] T027 Create nutrition provider interface and mock provider in services/api/src/services/nutritionProvider.ts
- [X] T028 [P] Create shared test fixtures for users, meals, detections, summaries, posts, and transformations in packages/shared/src/testFixtures.ts

**Checkpoint**: Foundation ready. User story implementation can now begin in priority order or in parallel by story.

---

## Phase 3: User Story 1 - Scan Meal and Log Nutrition (Priority: P1) MVP

**Goal**: Authenticated users can capture/import a meal image, receive AI + nutrition database estimates, review/fix low-confidence results, adjust servings, and save one confirmed meal locally.

**Independent Test**: Capture or import a meal image, receive calories/protein/carbs/fat, adjust serving quantity, save the meal, and verify a single MealEntry exists locally with correct totals and no raw server-side image persistence.

### Tests for User Story 1

- [X] T029 [P] [US1] Add contract tests for POST /v1/analyze-meal in services/api/tests/contract/analyze-meal.contract.test.ts
- [X] T030 [P] [US1] Add contract tests for POST /v1/nutrition/resolve in services/api/tests/contract/nutrition-resolve.contract.test.ts
- [X] T031 [P] [US1] Add unit tests for serving multiplier and macro recalculation in packages/shared/tests/unit/nutritionMath.test.ts
- [X] T032 [P] [US1] Add unit tests for low-confidence confirmation rules in packages/shared/tests/unit/confidenceRules.test.ts
- [X] T033 [P] [US1] Add API integration test for transient image cleanup after analysis in services/api/tests/integration/analyze-meal-privacy.test.ts
- [X] T034 [P] [US1] Add mobile integration test for scan-to-save diary flow in apps/mobile/tests/integration/scan-save-flow.test.tsx
- [X] T035 [P] [US1] Add mobile UI test for Nutrition Results quantity and Fix Results actions in apps/mobile/tests/ui/nutrition-results.test.tsx

### Implementation for User Story 1

- [X] T036 [US1] Implement nutrition math utilities in packages/shared/src/nutritionMath.ts
- [X] T037 [US1] Implement confidence and confirmation utilities in packages/shared/src/confidenceRules.ts
- [X] T038 [US1] Implement API meal analysis service combining AI vision, nutrition database matches, AI fallback, confidence, and timeout handling in services/api/src/services/mealAnalysisService.ts
- [X] T039 [US1] Implement POST /v1/analyze-meal route in services/api/src/routes/analyzeMeal.ts
- [X] T040 [US1] Implement POST /v1/nutrition/resolve route in services/api/src/routes/resolveNutrition.ts
- [X] T041 [US1] Register meal analysis and nutrition routes in services/api/src/routes/index.ts
- [X] T042 [US1] Implement mobile scan camera/gallery screen with permission, capture, import, and retry states in apps/mobile/app/(tabs)/scan.tsx
- [X] T043 [US1] Implement scan mode selector and food label overlay component in apps/mobile/src/features/scan/ScanControls.tsx
- [X] T044 [US1] Implement meal analysis hook with loading, timeout, retry, and offline failure states in apps/mobile/src/features/scan/useMealAnalysis.ts
- [X] T045 [US1] Implement Nutrition Results screen with image, meal name, macros, ingredients, confidence prompt, quantity stepper, Fix Results, and Done actions in apps/mobile/app/meal-results.tsx
- [X] T046 [US1] Implement manual correction form for AI result fixes in apps/mobile/src/features/scan/CorrectionForm.tsx
- [X] T047 [US1] Implement idempotent local MealEntry save workflow in apps/mobile/src/features/diary/saveMealEntry.ts
- [X] T048 [US1] Wire successful Done action to save locally before any sync/share attempt in apps/mobile/app/meal-results.tsx

**Checkpoint**: User Story 1 is fully functional and independently testable as the MVP scan-to-log loop.

---

## Phase 4: User Story 2 - View Daily Diary and Macro Progress (Priority: P1)

**Goal**: Users can open Home to see daily calories vs target, macro progress rings/cards, recent uploads, streak summary, and date-specific diary data rendered from local storage, including offline.

**Independent Test**: Open Home after one saved meal, switch dates, disable network, and verify the diary totals, macro rings, recent uploads, and target progress render from local SQLite.

### Tests for User Story 2

- [ ] T049 [P] [US2] Add unit tests for DailySummary aggregation in apps/mobile/tests/unit/dailySummary.test.ts
- [ ] T050 [P] [US2] Add unit tests for onboarding target calculation in packages/shared/tests/unit/goalCalculator.test.ts
- [ ] T051 [P] [US2] Add mobile integration test for offline Home rendering in apps/mobile/tests/integration/home-offline.test.tsx
- [ ] T052 [P] [US2] Add UI snapshot tests for macro progress rings and summary cards in apps/mobile/tests/ui/macro-progress-rings.test.tsx
- [ ] T053 [P] [US2] Add UI test for weekly date selector reload behavior in apps/mobile/tests/ui/weekly-date-selector.test.tsx

### Implementation for User Story 2

- [ ] T054 [US2] Implement onboarding goal calculation utilities in packages/shared/src/goalCalculator.ts
- [ ] T055 [US2] Implement onboarding profile and editable goals screen in apps/mobile/app/onboarding.tsx
- [ ] T056 [US2] Implement DailySummary aggregation service in apps/mobile/src/features/diary/dailySummaryService.ts
- [ ] T057 [US2] Implement diary query hooks for selected dates and recent uploads in apps/mobile/src/features/diary/useDiaryQueries.ts
- [ ] T058 [US2] Implement macro progress ring component using react-native-svg in apps/mobile/src/components/MacroProgressRing.tsx
- [ ] T059 [US2] Implement macro summary cards in apps/mobile/src/features/diary/MacroSummaryCards.tsx
- [ ] T060 [US2] Implement weekly date selector in apps/mobile/src/features/diary/WeeklyDateSelector.tsx
- [ ] T061 [US2] Implement Home dashboard screen with calories, target, streak, date selector, macro progress, recent upload card, and floating scan action in apps/mobile/app/(tabs)/index.tsx
- [ ] T062 [US2] Connect MealEntry save events to DailySummary recalculation in apps/mobile/src/features/diary/saveMealEntry.ts

**Checkpoint**: User Story 2 is independently testable through the local-first Home dashboard and diary experience.

---

## Phase 5: User Story 3 - Analyze Trends and Streaks (Priority: P2)

**Goal**: Users can view progress trends, chart time ranges, streaks, goal status, and average calorie history based on local diary and progress data.

**Independent Test**: Seed multiple days of meals/progress points, open Progress, change time ranges, inspect chart data, and verify streak values across timezone boundaries.

### Tests for User Story 3

- [ ] T063 [P] [US3] Add unit tests for streak qualification and timezone rollover in packages/shared/tests/unit/streakRules.test.ts
- [ ] T064 [P] [US3] Add unit tests for progress range aggregation in apps/mobile/tests/unit/progressRangeService.test.ts
- [ ] T065 [P] [US3] Add UI snapshot tests for progress chart empty, partial, and populated states in apps/mobile/tests/ui/progress-chart.test.tsx
- [ ] T066 [P] [US3] Add mobile integration test for Progress range filters in apps/mobile/tests/integration/progress-range-filter.test.tsx

### Implementation for User Story 3

- [ ] T067 [US3] Implement streak qualification utilities in packages/shared/src/streakRules.ts
- [ ] T068 [US3] Implement local StreakRecord update service in apps/mobile/src/features/progress/streakService.ts
- [ ] T069 [US3] Implement progress range aggregation service in apps/mobile/src/features/progress/progressRangeService.ts
- [ ] T070 [US3] Implement progress chart component with 90D, 6M, 1Y, and ALL ranges in apps/mobile/src/features/progress/ProgressChart.tsx
- [ ] T071 [US3] Implement Progress screen with current weight, goal indicator, streak card, chart filters, reinforcement message, and daily average calories in apps/mobile/app/(tabs)/progress.tsx
- [ ] T072 [US3] Connect MealEntry and onboarding goal changes to streak and progress rollups in apps/mobile/src/features/progress/progressRollupEffects.ts

**Checkpoint**: User Story 3 is independently testable from local seeded history and does not require Community or Compare.

---

## Phase 6: User Story 4 - Engage with Community and Transformations (Priority: P3)

**Goal**: Users can explicitly share selected meals/progress to chosen groups, view a community feed, react/comment, and compare transformation photos with hide-weight and share controls.

**Independent Test**: Create a group-scoped share from private content, verify it appears only after explicit consent, interact with the feed, open Compare, toggle weight visibility, and initiate share output.

### Tests for User Story 4

- [ ] T073 [P] [US4] Add contract tests for POST /v1/meals/share in services/api/tests/contract/share-meal.contract.test.ts
- [ ] T074 [P] [US4] Add contract tests for POST /v1/progress/share and DELETE /v1/media/{mediaId} in services/api/tests/contract/share-progress-media.contract.test.ts
- [ ] T075 [P] [US4] Add API integration test for explicit group sharing consent in services/api/tests/integration/explicit-sharing-consent.test.ts
- [ ] T076 [P] [US4] Add mobile UI tests for Community feed group switching, reactions, and comments in apps/mobile/tests/ui/community-feed.test.tsx
- [ ] T077 [P] [US4] Add mobile UI tests for Compare hide-weight toggle and share action in apps/mobile/tests/ui/compare-transformation.test.tsx

### Implementation for User Story 4

- [ ] T078 [US4] Implement API sharing consent service for meal/progress posts in services/api/src/services/shareService.ts
- [ ] T079 [US4] Implement POST /v1/meals/share route in services/api/src/routes/shareMeal.ts
- [ ] T080 [US4] Implement POST /v1/progress/share route in services/api/src/routes/shareProgress.ts
- [ ] T081 [US4] Implement DELETE /v1/media/{mediaId} and GET /v1/privacy/export routes in services/api/src/routes/privacy.ts
- [ ] T082 [US4] Register sharing, media deletion, and privacy export routes in services/api/src/routes/index.ts
- [ ] T083 [US4] Implement local CommunityPost repository and share state updates in apps/mobile/src/features/community/communityRepository.ts
- [ ] T084 [US4] Implement explicit share sheet for meals/progress with group selection and content toggles in apps/mobile/src/features/community/ExplicitShareSheet.tsx
- [ ] T085 [US4] Implement Community feed screen with group selector, member chips, feed cards, reactions, comments, loading, empty, and network states in apps/mobile/app/(tabs)/groups.tsx
- [ ] T086 [US4] Implement TransformationPair repository and local image selector in apps/mobile/src/features/compare/transformationRepository.ts
- [ ] T087 [US4] Implement Compare Transformation screen with before/after images, dates, optional weights, hide-weight toggle, carousel, and share button in apps/mobile/app/compare-transformation.tsx

**Checkpoint**: User Story 4 is independently testable as explicit sharing plus transformation comparison without changing P1/P2 behavior.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, privacy, documentation, and performance work across all completed stories.

- [ ] T088 [P] Add accessibility labels and hit target checks for scan, dashboard, progress, community, and compare screens in apps/mobile/src/test/accessibilityChecklist.ts
- [ ] T089 [P] Add privacy validation tests for no mobile API secrets and no server-side raw image persistence in services/api/tests/integration/privacy-hardening.test.ts
- [ ] T090 Add API OpenAPI schema validation against implementation in services/api/tests/contract/openapi-validation.test.ts
- [ ] T091 Add app startup performance measurement for cold start to diary in apps/mobile/tests/integration/startup-performance.test.tsx
- [ ] T092 Add scan-to-log timing measurement for 20-second success criterion in apps/mobile/tests/integration/scan-log-performance.test.tsx
- [ ] T093 [P] Update quickstart validation notes after implementation in specs/001-ai-calorie-tracker/quickstart.md
- [ ] T094 Run typecheck, lint, mobile tests, API tests, and contract tests using package scripts in package.json
- [ ] T095 Perform final constitution compliance review in specs/001-ai-calorie-tracker/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3, P1 MVP)**: Depends on Foundation.
- **User Story 2 (Phase 4, P1)**: Depends on Foundation and integrates with MealEntry data from US1, but can be tested with seeded local data.
- **User Story 3 (Phase 5, P2)**: Depends on Foundation and local diary/progress schemas; can be tested with seeded local data after Foundation.
- **User Story 4 (Phase 6, P3)**: Depends on Foundation and privacy/share states; can be tested with seeded local data after Foundation.
- **Polish (Phase 7)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 Scan Meal and Log Nutrition**: Foundation only. This is the MVP and should be delivered first.
- **US2 View Daily Diary and Macro Progress**: Foundation only for independent testing; production value increases after US1 saves meals.
- **US3 Analyze Trends and Streaks**: Foundation only for seeded tests; uses diary data for real use.
- **US4 Engage with Community and Transformations**: Foundation only for seeded tests; uses explicit share state from saved meals/progress.

### Within Each User Story

- Tests MUST be written first and fail before implementation.
- Shared utilities and repositories before services.
- Services before screens/routes.
- Routes/screens before end-to-end integration checks.
- Complete each story checkpoint before marking that story done.

---

## Parallel Execution Examples

### User Story 1

```bash
Task: "T029 [US1] Add contract tests for POST /v1/analyze-meal in services/api/tests/contract/analyze-meal.contract.test.ts"
Task: "T031 [US1] Add unit tests for serving multiplier and macro recalculation in packages/shared/tests/unit/nutritionMath.test.ts"
Task: "T034 [US1] Add mobile integration test for scan-to-save diary flow in apps/mobile/tests/integration/scan-save-flow.test.tsx"
Task: "T035 [US1] Add mobile UI test for Nutrition Results quantity and Fix Results actions in apps/mobile/tests/ui/nutrition-results.test.tsx"
```

### User Story 2

```bash
Task: "T049 [US2] Add unit tests for DailySummary aggregation in apps/mobile/tests/unit/dailySummary.test.ts"
Task: "T050 [US2] Add unit tests for onboarding target calculation in packages/shared/tests/unit/goalCalculator.test.ts"
Task: "T052 [US2] Add UI snapshot tests for macro progress rings and summary cards in apps/mobile/tests/ui/macro-progress-rings.test.tsx"
```

### User Story 3

```bash
Task: "T063 [US3] Add unit tests for streak qualification and timezone rollover in packages/shared/tests/unit/streakRules.test.ts"
Task: "T064 [US3] Add unit tests for progress range aggregation in apps/mobile/tests/unit/progressRangeService.test.ts"
Task: "T065 [US3] Add UI snapshot tests for progress chart empty, partial, and populated states in apps/mobile/tests/ui/progress-chart.test.tsx"
```

### User Story 4

```bash
Task: "T073 [US4] Add contract tests for POST /v1/meals/share in services/api/tests/contract/share-meal.contract.test.ts"
Task: "T075 [US4] Add API integration test for explicit group sharing consent in services/api/tests/integration/explicit-sharing-consent.test.ts"
Task: "T077 [US4] Add mobile UI tests for Compare hide-weight toggle and share action in apps/mobile/tests/ui/compare-transformation.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational infrastructure.
3. Complete Phase 3: US1 Scan Meal and Log Nutrition.
4. Stop and validate the scan-to-log flow independently.
5. Demo the MVP with mocked AI/nutrition providers if real credentials are unavailable.

### Incremental Delivery

1. Deliver US1 for the core AI photo-to-diary loop.
2. Deliver US2 for the full Home dashboard and local-first diary UX.
3. Deliver US3 for trends, streaks, and progress visualization.
4. Deliver US4 for community sharing and transformation comparison.
5. Run Phase 7 polish and constitution compliance before release.

### Parallel Team Strategy

After Phase 2 is complete:
- Developer A: US1 API analysis and nutrition routes.
- Developer B: US1 mobile scan/results flow.
- Developer C: US2 Home dashboard with seeded local data.
- Developer D: US3/US4 tests and seeded repositories.

Each developer starts with tests for their assigned story files before implementing production code.

---

## Task Summary

- Total tasks: 95
- Setup tasks: 9
- Foundational tasks: 19
- US1 tasks: 20
- US2 tasks: 14
- US3 tasks: 10
- US4 tasks: 15
- Polish tasks: 8
- Parallelizable tasks marked [P]: 37

## Independent Test Criteria

- **US1**: Capture/import image -> receive AI/nutrition estimate -> adjust servings -> save exactly one local MealEntry -> confirm no raw server image persistence.
- **US2**: Open Home with seeded/saved meals -> switch diary dates -> disable network -> verify calories, macro rings, recent uploads, and targets render locally.
- **US3**: Seed multiple days of meals/progress -> open Progress -> change range filters -> verify chart, streak, and average calorie outputs.
- **US4**: Explicitly share selected content to a group -> verify feed visibility, reactions/comments, compare hide-weight behavior, and no default sharing.

## Notes

- All tests must fail before corresponding implementation tasks begin.
- All API provider credentials remain in services/api environment only.
- All photo persistence is local-first unless explicit backup/share consent is present.
- Keep barcode and food-label scanning as future-ready UI only unless a later spec expands scope.
