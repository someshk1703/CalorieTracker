# Feature Specification: AI Calorie Tracker Mobile App

**Feature Branch**: `001-calorie-tracker-spec`  
**Created**: 2026-05-30  
**Status**: Draft  
**Input**: User description: "Build a Cal AI Clone - AI Calorie Tracker with camera upload, AI macro breakdown, daily diary, macro progress rings, weekly history charts, and streak tracking using the provided reference screen details."

## Clarifications

### Session 2026-05-30

- Q: How should meal and transformation photos be stored for privacy, sync, and sharing? → A: Store photos locally by default; server stores none after AI inference unless user explicitly opts into cloud backup or sharing.
- Q: What should be the source of truth for nutrition estimates after image recognition? → A: Hybrid: AI identifies food/portion; nutrition database calculates calories and macros; AI fills gaps.
- Q: How should calorie and macro goals be established for users? → A: Onboarding calculates calorie and macro targets from profile inputs, and users can edit targets anytime.
- Q: What is the default privacy model for community sharing? → A: Private by default; users explicitly share selected meals/progress to chosen groups.
- Q: What account model should the first release use for diary, goals, and sharing ownership? → A: Authentication required before using the app; all diary and sharing data belongs to a user account.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scan Meal and Log Nutrition (Priority: P1)

As a user, I want to photograph a meal and instantly receive calories and macro estimates so I can quickly log food with minimal manual effort.

**Why this priority**: This is the core value proposition and the primary differentiator of the app. Without it, the product is not an AI calorie tracker.

**Independent Test**: Can be fully tested by capturing or importing a meal image, receiving AI nutrition output, confirming the result, and verifying the meal appears in the current day diary with updated calorie total.

**Acceptance Scenarios**:

1. **Given** a user is on the scan camera screen with camera permission granted, **When** the user captures a meal image, **Then** the system returns an AI estimate including calories, protein, carbs, and fat.
2. **Given** AI nutrition results are displayed, **When** the user adjusts quantity and taps Done, **Then** the system saves the meal and updates the daily diary totals.
3. **Given** AI confidence is low for detected foods, **When** the user views results, **Then** the system prompts the user to fix or confirm results before logging.
4. **Given** AI analysis fails or times out, **When** the request completes unsuccessfully, **Then** the system shows a retry path and does not save a partial meal.

---

### User Story 2 - View Daily Diary and Macro Progress (Priority: P1)

As a user, I want a home dashboard that summarizes my day so I can quickly track calories and macro progress against targets.

**Why this priority**: Daily tracking and feedback are required for retention and immediate utility after each logged meal.

**Independent Test**: Can be fully tested by opening Home after at least one meal is logged and verifying daily calories, macro cards/progress rings, recent uploads, date switching, and offline rendering from local data.

**Acceptance Scenarios**:

1. **Given** one or more meals are logged for today, **When** the user opens Home, **Then** the app shows consumed calories, target calories, and macro progress for protein, carbs, and fat.
2. **Given** the user taps another day in the weekly selector, **When** the date changes, **Then** the dashboard reloads totals and recent uploads for that selected day.
3. **Given** the device is offline and local logs exist, **When** the user opens Home, **Then** the diary and macro progress still render using local data.

---

### User Story 3 - Analyze Trends and Streaks (Priority: P2)

As a user, I want progress views with history and streak tracking so I can see long-term consistency and outcomes.

**Why this priority**: Trend visibility and streak reinforcement increase motivation and long-term engagement, but can follow after the core logging loop.

**Independent Test**: Can be fully tested by loading multiple days of diary data and verifying weekly chart rendering, date-range filtering, and streak/goal indicators update correctly.

**Acceptance Scenarios**:

1. **Given** a user has historical diary data, **When** the user opens Progress, **Then** the app shows trend charts and summary metrics for the selected range.
2. **Given** the user changes chart range (e.g., 90D, 6M, 1Y, ALL), **When** a new range is selected, **Then** the chart updates to that period.
3. **Given** the user logs meals on consecutive days, **When** daily logging continues, **Then** the streak value increases appropriately.

---

### User Story 4 - Engage with Community and Transformations (Priority: P3)

As a user, I want social and comparison experiences so I can stay motivated through accountability and visible progress.

**Why this priority**: Community feed and transformation comparison improve engagement polish but are not required for MVP nutrition tracking.

**Independent Test**: Can be fully tested by opening Groups and Compare screens, loading feed entries/comparison pairs, reacting/commenting, toggling weight visibility, and sharing comparison output.

**Acceptance Scenarios**:

1. **Given** the user opens the community feed, **When** posts are loaded, **Then** the app displays meal posts with nutrition summaries and reaction/comment actions.
2. **Given** the user changes group selection, **When** a new group is selected, **Then** the feed reloads for that group.
3. **Given** the user opens transformation compare, **When** the user toggles hide weight, **Then** weight labels are hidden or shown accordingly.

### Edge Cases

- User denies camera permission: app must provide a clear permission recovery path and allow gallery upload where available.
- AI detection returns uncertain or conflicting foods: app must require confirmation or correction before save.
- Meal has multiple servings or user changes quantity repeatedly: macro and calorie totals must recalculate consistently.
- Duplicate rapid taps on Done: app must prevent duplicate meal entries.
- Offline during AI request: app must fail gracefully, preserve user context, and allow retry.
- Date timezone rollover around midnight: meal entries must appear on the correct local day.
- No history data yet: progress chart and compare views must show meaningful empty states.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-000**: System MUST require authentication before app use; diary, goals, photo-sharing choices, and community content MUST belong to a user account.
- **FR-001**: System MUST provide a food scan flow that supports camera capture and photo import for meal analysis.
- **FR-002**: System MUST analyze submitted meal images and return estimated calories, protein, carbs, fat, and detected food components.
- **FR-002a**: System MUST use a hybrid nutrition pipeline where AI identifies foods and portions, a nutrition database calculates calories/macros, and AI-derived estimates fill gaps when no database match is available.
- **FR-003**: System MUST display a nutrition results screen where users can review image, meal label, ingredients, calories, and macros.
- **FR-004**: Users MUST be able to adjust serving quantity before saving, and the system MUST recalculate nutrition totals accordingly.
- **FR-005**: System MUST provide a correction path (Fix Results) before meal save when users need to edit AI output.
- **FR-006**: System MUST require user confirmation/correction before save when AI confidence is below the configured threshold.
- **FR-007**: System MUST save confirmed meal entries to the user diary and update same-day calorie and macro totals.
- **FR-008**: System MUST provide a Home dashboard showing daily calories vs target, macro progress, streak summary, recent uploads, and weekly date selection.
- **FR-008a**: System MUST calculate initial calorie and macro targets during onboarding from user profile inputs and allow users to edit those targets at any time.
- **FR-009**: System MUST support date-based diary browsing and recalculate dashboard metrics for the selected date.
- **FR-010**: System MUST render diary and macro progress from local persisted data while offline.
- **FR-011**: System MUST provide a Progress view with selectable time ranges and historical trend visualization.
- **FR-012**: System MUST calculate and display streak and goal-tracking indicators based on logged activity.
- **FR-013**: System MUST provide a Community feed view with group selection, post nutrition cards, and reaction/comment interactions.
- **FR-013a**: System MUST keep meals and progress private by default; users MUST explicitly choose selected meals or progress updates and destination groups before content appears in Community.
- **FR-014**: System MUST provide a Compare view with before/after image pairs, date/weight metadata, a hide-weight toggle, and share action.
- **FR-015**: System MUST prevent duplicate meal save operations caused by repeated submit actions.
- **FR-016**: System MUST provide explicit loading, empty, error, and retry states across Home, Scan, Results, Progress, Community, and Compare flows.
- **FR-017**: System MUST store meal and transformation photos locally by default; server-side image storage is prohibited after AI inference unless the user explicitly opts into cloud backup or sharing.

### Key Entities *(include if feature involves data)*

- **UserProfile**: Represents an authenticated app user with onboarding profile inputs, calculated calorie target, editable macro goals, streak settings, and privacy preferences.
- **MealEntry**: Represents a logged meal with timestamp, local source image reference, servings, final calories/macros, source method (camera/import/manual correction), and optional opt-in cloud/share state.
- **FoodDetectionResult**: Represents AI analysis output with detected food components, portion estimates, database match references, nutrition estimate, confidence signals, fallback source, and correction state.
- **DailySummary**: Represents aggregated calories/macros and target progress for a specific calendar day.
- **StreakRecord**: Represents consecutive logging behavior and computed streak values.
- **ProgressPoint**: Represents historical trend data (date, weight and/or calorie averages, goal progress markers).
- **CommunityPost**: Represents an explicitly shared group feed item with meal media or progress content, destination group, nutrition summary, reactions, comments, and visibility state.
- **TransformationPair**: Represents locally stored before/after images with dates, optional weights, sharing metadata, and opt-in cloud/share state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of successful meal scan submissions return a complete nutrition estimate (calories, protein, carbs, fat) within 10 seconds.
- **SC-002**: 95% of users can complete the scan-to-log flow (capture/import -> review -> save) in under 20 seconds on first attempt.
- **SC-003**: 99% of saved meal entries appear in the correct day diary totals immediately after save.
- **SC-004**: Offline diary access succeeds for 100% of users who have previously logged at least one meal on device.
- **SC-005**: At least 80% of active users view either Progress or Community screens at least once per week, indicating engagement beyond basic logging.
- **SC-006**: User-reported correction need on AI results decreases to under 20% after model tuning cycles.

## Assumptions

- The first release requires authentication before app use and supports one personal diary per authenticated user account.
- Calorie and macro targets are calculated during onboarding from profile inputs and remain editable by the user before and after first meal logging.
- AI nutrition estimates are advisory and can be corrected before logging.
- Community and Compare capabilities are included in scope but can launch with limited dataset seeding.
- Barcode and nutrition-label scan modes are optional enhancements and may be launched after core food-photo scan mode.
- Privacy-compliant backend proxy for AI requests exists or will be delivered in parallel, keeping secrets off-device and discarding submitted images after inference unless the user has opted into backup or sharing.
- The app uses local persistence so Home and Progress can render previously synced or logged data offline.