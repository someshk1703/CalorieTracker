<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Added sections: Core Principles (I–V), Tech Stack & Constraints, Development Workflow, Governance
Removed sections: N/A — initial constitution
Modified principles: N/A — first ratification
Templates updated:
  ✅ .specify/memory/constitution.md — this file
  ✅ .specify/templates/plan-template.md — Constitution Check gates align
  ✅ .specify/templates/spec-template.md — no structural changes needed
  ✅ .specify/templates/tasks-template.md — no structural changes needed
Follow-up TODOs: none — all placeholders resolved
-->

# CalorieTracker Constitution

## Core Principles

### I. AI-First Image Recognition (NON-NEGOTIABLE)

Every nutritional entry logged through the camera MUST be processed by an AI vision model
before any manual fallback is offered. The AI pipeline is the primary path, not an add-on.

- The AI recognition response MUST return at a minimum: food label, calories, protein,
  carbs, and fat per serving.
- Confidence scores MUST be surfaced; results below a threshold (≤ 0.5) MUST prompt the
  user to confirm or correct before logging.
- Fallback manual entry is permitted but MUST NOT be the default path.
- AI calls MUST complete or time out within 10 seconds; a loading state MUST be shown.

### II. Mobile-First, Offline-Capable UX

The app MUST function as a native mobile experience. Core diary and history features MUST
remain usable without network access.

- All logged meals MUST be persisted locally (device storage) before any cloud sync.
- Macro progress rings and daily diary MUST render from local data only.
- Network-dependent features (AI recognition, cloud backup) MUST degrade gracefully with
  clear user messaging when offline.
- UI MUST follow platform conventions (iOS Human Interface Guidelines / Material Design
  for Android) for navigation, typography, and touch targets.

### III. Test-First Development (NON-NEGOTIABLE)

TDD MUST be applied to all business logic, AI service wrappers, and data persistence layers.
Tests are written and approved before implementation begins. The Red-Green-Refactor cycle
is strictly enforced.

- Unit tests MUST cover: macro calculation, calorie aggregation, streak logic, and
  goal-threshold evaluation.
- Integration tests MUST cover: AI service contract (mock + real), local DB read/write,
  and diary aggregate queries.
- UI snapshot/golden tests MUST cover macro progress rings and weekly history charts.
- No feature is considered "done" until tests pass in CI.

### IV. Data Privacy & Security

User health data is sensitive. The app MUST follow HIPAA-adjacent best practices even if
not legally required, and MUST comply with App Store / Play Store privacy policies.

- No raw meal images MUST be stored server-side beyond the duration of a single AI
  inference request unless the user explicitly opts in.
- All API calls MUST use HTTPS/TLS 1.2+. API keys MUST never be embedded in client
  binaries; use a backend proxy.
- User data MUST be deletable on request (right to erasure).
- Nutritional data MUST NOT be shared with third parties without explicit opt-in consent.

### V. Simplicity & Incremental Delivery

Features MUST ship as independently deployable increments. Complexity requires
justification; YAGNI (You Ain't Gonna Need It) applies by default.

- Each user story MUST be implementable, testable, and demoed independently.
- Weekly history charts and streak tracking are P2+ features; they MUST NOT block core
  photo-to-diary flow (P1).
- Third-party dependencies MUST be evaluated for bundle size impact before adoption.
- No abstraction layer should be created unless consumed by ≥ 2 features.

## Tech Stack & Constraints

**Platform**: iOS (primary) with Android parity target; React Native or Flutter acceptable
for cross-platform; native Swift/Kotlin acceptable for single-platform MVP.

**AI Backend**: OpenAI GPT-4o Vision API (preferred) or Google Gemini Vision; wrapped
behind an internal proxy service to keep keys off the client.

**Local Storage**: SQLite via an ORM (e.g., Realm, Room, SQLite.swift, Drift) for diary
entries, macro history, and streak state.

**Cloud Sync** (optional, P3): Firebase Firestore or Supabase for cross-device sync.

**Performance Goals**:
- AI recognition response (p95): ≤ 10 seconds end-to-end.
- App cold start: ≤ 2 seconds to diary screen.
- Macro ring animations: 60 fps.

**Constraints**:
- App MUST support iOS 16+ and Android 12+ (API 31+).
- Offline diary MUST work without degradation on device with no network.
- Bundle size MUST remain < 50 MB download (App Store compressed).

## Development Workflow

All work MUST follow the Spec Kit lifecycle:

1. `/speckit.specify` — write or update feature spec before any code is written.
2. `/speckit.plan` — produce architecture and data-model artifacts.
3. `/speckit.tasks` — generate dependency-ordered task list from plan.
4. `/speckit.implement` — execute tasks with TDD cycle.
5. `/speckit.checklist` — verify feature against constitution gates before PR.

**Branch naming**: `###-short-description` (e.g., `001-photo-ai-recognition`).

**Definition of Done** for any task:
- Tests written and passing.
- Constitution Check gates satisfied.
- No raw API keys in committed code.
- Feature demoed independently (can be shown without other in-progress work).

**Constitution Check gates** (used in plan-template.md):
- [ ] AI calls use backend proxy — no client-side API key exposure.
- [ ] Nutritional data persisted locally before any network call.
- [ ] Confidence threshold enforced on AI results.
- [ ] Offline diary renders without network.
- [ ] Tests written before implementation (TDD gate).
- [ ] Feature is independently deliverable (does not require other in-flight work).

## Governance

This constitution supersedes all other development conventions for the CalorieTracker
project. Amendments require:

1. A written rationale (one paragraph minimum) describing the change and why it is needed.
2. Version bump per semantic versioning:
   - MAJOR — principle removed or redefined in a backward-incompatible way.
   - MINOR — new principle or section added.
   - PATCH — clarification, wording fix, non-semantic refinement.
3. Propagation review: all templates in `.specify/templates/` and active spec/plan
   documents MUST be checked for consistency after each amendment.
4. All PRs MUST pass the Constitution Check gate before merge.

Complexity MUST be justified against the Simplicity principle (Principle V). Any deviation
from TDD (Principle III) requires explicit written approval captured in the relevant
`plan.md`.

**Version**: 1.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-05-30
