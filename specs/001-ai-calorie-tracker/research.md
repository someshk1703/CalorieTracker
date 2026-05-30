# Research: AI Calorie Tracker Mobile App

## Decision: Use Expo React Native for the mobile application

**Rationale**: The product requires a polished mobile UI across iOS and Android, camera/gallery access, local storage, charts, and rapid iteration. Expo React Native provides strong camera/image APIs, OTA-friendly development ergonomics, and a practical path to native builds without starting with two separate codebases.

**Alternatives considered**:
- Native Swift/Kotlin: best platform fidelity but doubles early implementation and testing surface.
- Flutter: viable cross-platform option, but TypeScript sharing with the API and AI contract schemas is simpler with React Native.
- Web/PWA: insufficient for the reference app's camera-first native UX and App Store positioning.

## Decision: Use a backend API proxy for AI vision and nutrition provider calls

**Rationale**: The constitution prohibits client-side API keys and raw image retention beyond inference unless explicitly opted in. A backend proxy centralizes secret management, request redaction, provider timeouts, image disposal, auth verification, and audit logging.

**Alternatives considered**:
- Direct mobile-to-AI API calls: rejected because it exposes API keys in the mobile binary.
- Fully on-device AI: privacy-friendly but not practical for high-quality food recognition and nutrition estimation in the first release.
- Third-party hosted workflow only: increases lock-in and makes data deletion/consent harder to guarantee.

## Decision: Use a hybrid nutrition pipeline

**Rationale**: AI is best at recognizing foods, ingredients, and approximate portions, while a nutrition database is better as a testable source for calories/macros. The model can fill gaps only when no database match is available, with confidence and source metadata shown to the user.

**Alternatives considered**:
- AI-only nutrition estimates: faster to prototype but harder to validate and explain.
- Database-first with mandatory user selection: more accurate but slower and less magical than the reference app flow.
- Manual-first logging: reliable but fails the AI-first product promise.

## Decision: Use local SQLite as the system of record for diary and progress rendering

**Rationale**: The constitution requires offline diary and macro progress. SQLite gives reliable structured local persistence for meals, summaries, streaks, goals, sync/share state, and migration-friendly data evolution.

**Alternatives considered**:
- Cloud-only storage: rejected because offline diary must work.
- Async key-value storage only: insufficient for date-range summaries and aggregate queries.
- In-memory cache: cannot satisfy persistence requirements.

## Decision: Store raw photos locally by default with opt-in cloud/share state

**Rationale**: Meal and transformation photos are sensitive health-adjacent data. Local-first storage satisfies privacy expectations while allowing explicit cloud backup or group sharing where the user consents.

**Alternatives considered**:
- Cloud backup by default: convenient but conflicts with privacy-first posture.
- No photo retention: maximally private but weakens recent upload cards, compare, and user review flows.
- Public/community-first media: rejected by private-by-default sharing requirement.

## Decision: Require authentication before app use

**Rationale**: Authentication gives clear ownership for diary, goals, privacy preferences, share consent, backup opt-in, and deletion/export requests. It also simplifies Community access controls.

**Alternatives considered**:
- Guest mode: pleasant onboarding but complicates sync, consent, account migration, and data recovery.
- No auth: incompatible with community sharing and user-owned deletion/export.
- Social-only auth: excludes users who prefer email/password style accounts.

## Decision: Use explicit group-scoped sharing for Community

**Rationale**: Private-by-default sharing preserves trust while still supporting the reference app's friends feed. Each CommunityPost should carry a destination group and visibility state.

**Alternatives considered**:
- Group-visible by default: lower friction but risky for sensitive nutrition/weight data.
- Public feed: rejected by privacy requirements.
- Disable Community in v1: simpler, but the requested reference app includes Groups/Community as a visible screen.

## Decision: Treat barcode and food-label scanning as post-MVP enhancements

**Rationale**: The core P1 flow is photo capture/import, AI food recognition, result correction, and diary save. Barcode and label scan modes can appear as disabled or future-ready UI states, but should not block core delivery.

**Alternatives considered**:
- Build all scan modes immediately: increases scope before the core photo-to-diary loop is proven.
- Remove scan mode selector entirely: diverges from the reference screen and future product direction.
