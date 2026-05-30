# Data Model: AI Calorie Tracker Mobile App

## Entity: UserProfile

Represents an authenticated user and their nutrition/privacy configuration.

**Fields**:
- `id`: stable user account identifier
- `displayName`: user-facing name
- `email`: account email where applicable
- `profileInputs`: age range, height, weight, activity level, goal intent, dietary preference flags
- `calorieTarget`: daily calorie target calculated during onboarding and editable later
- `macroTargets`: daily protein/carbs/fat targets in grams
- `streakSettings`: logging criteria used to count a streak
- `privacyPreferences`: photo backup opt-in, community sharing defaults, hide-weight default
- `createdAt`, `updatedAt`

**Validation Rules**:
- `calorieTarget` must be positive.
- `macroTargets` must be non-negative and independently editable.
- Community sharing defaults must start private.
- Photo backup must start disabled unless the user explicitly opts in.

**Relationships**:
- Owns many MealEntry, DailySummary, StreakRecord, ProgressPoint, CommunityPost, and TransformationPair records.

## Entity: MealEntry

Represents a confirmed meal saved to the user's diary.

**Fields**:
- `id`: local-first meal identifier
- `userId`: owning UserProfile
- `loggedAt`: local timestamp used for diary date grouping
- `diaryDate`: normalized local calendar date
- `mealName`: user-visible name
- `sourceMethod`: camera, photo import, or manual correction
- `localImageUri`: local device reference to the meal image, if retained
- `cloudMediaId`: optional media reference only when backup/share is explicitly enabled
- `servings`: positive decimal serving multiplier
- `calories`: final confirmed calories
- `proteinGrams`, `carbGrams`, `fatGrams`: final confirmed macros
- `ingredients`: confirmed ingredient list and contribution metadata
- `analysisResultId`: related FoodDetectionResult
- `confirmationState`: pending_review, confirmed, corrected
- `syncState`: local_only, pending_sync, synced, share_pending, shared, failed
- `createdAt`, `updatedAt`

**Validation Rules**:
- `servings` must be greater than 0.
- Calories and macro grams must be non-negative.
- Low-confidence AI results cannot transition to `confirmed` without user confirmation or correction.
- Duplicate save submissions for the same pending result must resolve to one MealEntry.
- Server-side media storage requires explicit backup/share state.

**State Transitions**:
- pending_review -> confirmed
- pending_review -> corrected -> confirmed
- confirmed -> share_pending -> shared
- confirmed -> pending_sync -> synced
- any share/sync state -> failed -> retryable pending state

## Entity: FoodDetectionResult

Represents AI and nutrition-database output before final meal save.

**Fields**:
- `id`: analysis identifier
- `userId`: requesting UserProfile
- `imageSessionId`: transient inference reference, not raw persisted image
- `detectedFoods`: food labels, ingredient labels, estimated portions, and bounding/anchor metadata where available
- `databaseMatches`: matched nutrition database items with provider identifiers
- `fallbackItems`: items estimated by AI because no database match was available
- `confidence`: aggregate confidence from 0.0 to 1.0
- `requiresConfirmation`: true when confidence <= 0.5 or conflicts exist
- `estimatedCalories`, `estimatedProteinGrams`, `estimatedCarbGrams`, `estimatedFatGrams`
- `sourceBreakdown`: database, ai_fallback, user_corrected
- `status`: analyzing, succeeded, failed, timed_out, corrected
- `createdAt`, `expiresAt`

**Validation Rules**:
- Confidence must be between 0 and 1.
- `requiresConfirmation` must be true for confidence <= 0.5.
- Timed-out or failed results cannot be saved as MealEntry.
- Raw image payloads must not be persisted in this entity.

**State Transitions**:
- analyzing -> succeeded
- analyzing -> failed
- analyzing -> timed_out
- succeeded -> corrected
- succeeded/corrected -> consumed_by_meal_entry

## Entity: DailySummary

Represents local aggregate diary metrics for a user and date.

**Fields**:
- `id`: summary identifier
- `userId`: owning UserProfile
- `diaryDate`: local calendar date
- `caloriesConsumed`, `proteinConsumedGrams`, `carbConsumedGrams`, `fatConsumedGrams`
- `calorieTarget`, `macroTargetsSnapshot`
- `mealCount`
- `goalStatus`: under_goal, near_goal, met_goal, over_goal
- `updatedAt`

**Validation Rules**:
- Aggregate fields must equal the sum of confirmed MealEntry values for the date.
- Summary must be renderable offline from local data.
- Target snapshots preserve what the dashboard compared against on that date.

## Entity: StreakRecord

Represents consecutive successful logging behavior.

**Fields**:
- `id`
- `userId`
- `currentStreakDays`
- `longestStreakDays`
- `lastQualifiedDate`
- `qualificationRule`: e.g., at_least_one_confirmed_meal
- `updatedAt`

**Validation Rules**:
- A streak day counts once per local calendar date.
- Timezone rollover must use the user's local date at logging time.
- Missing a qualifying day resets `currentStreakDays` but not `longestStreakDays`.

## Entity: ProgressPoint

Represents historical progress chart data.

**Fields**:
- `id`
- `userId`
- `recordedAt`
- `type`: weight, calorie_average, macro_average, goal_progress
- `weightValue`: optional weight entry
- `calorieAverage`: optional period average
- `macroAverages`: optional protein/carbs/fat averages
- `source`: user_entry, diary_rollup, imported
- `createdAt`

**Validation Rules**:
- At least one metric value must be present.
- Chart range filters must use `recordedAt`.
- Weight display must honor hide-weight preferences when used in compare/share contexts.

## Entity: CommunityPost

Represents a user-explicitly shared group feed item.

**Fields**:
- `id`
- `userId`
- `groupId`
- `sourceType`: meal, progress, transformation
- `sourceId`: local/share source reference
- `caption`: optional user text
- `nutritionSummary`: optional calories/macros snapshot
- `mediaId`: optional media reference created only through explicit share
- `visibilityState`: private, group_shared, removed
- `reactionCount`, `commentCount`
- `createdAt`, `updatedAt`

**Validation Rules**:
- Posts cannot be created from private content without explicit share action.
- Destination group is required.
- Removing a post must stop future feed visibility.

## Entity: TransformationPair

Represents a before/after comparison experience.

**Fields**:
- `id`
- `userId`
- `beforeImageUri`, `afterImageUri`: local image references
- `beforeDate`, `afterDate`
- `beforeWeight`, `afterWeight`: optional
- `hideWeight`: boolean
- `shareState`: local_only, share_pending, shared, removed
- `createdAt`, `updatedAt`

**Validation Rules**:
- Before date must be earlier than or equal to after date.
- Weight values are optional and must be hidden when `hideWeight` is true.
- Cloud media/sharing requires explicit user action.
