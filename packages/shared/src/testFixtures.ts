import type {
  CommunityPost,
  DailySummary,
  FoodDetectionResult,
  MealEntry,
  ProgressPoint,
  StreakRecord,
  TransformationPair,
  UserProfile
} from "./domain";

const now = "2026-05-30T12:00:00.000Z";

export const userProfileFixture: UserProfile = {
  id: "user_001",
  displayName: "Alex",
  email: "alex@example.com",
  profileInputs: {
    ageRange: "30-39",
    heightCm: 175,
    weightKg: 82,
    activityLevel: "moderate",
    goalIntent: "maintain",
    dietaryPreferenceFlags: []
  },
  calorieTarget: 2200,
  macroTargets: { proteinGrams: 140, carbGrams: 240, fatGrams: 70 },
  streakSettings: { qualificationRule: "at_least_one_confirmed_meal" },
  privacyPreferences: {
    photoBackupEnabled: false,
    communitySharingDefault: "private",
    hideWeightByDefault: true
  },
  createdAt: now,
  updatedAt: now
};

export const foodDetectionResultFixture: FoodDetectionResult = {
  id: "analysis_001",
  userId: userProfileFixture.id,
  imageSessionId: "image_session_001",
  detectedFoods: [{ label: "Caesar salad", estimatedPortion: "1 bowl", confidence: 0.84 }],
  databaseMatches: [{ label: "Caesar salad", providerId: "nutrition_001" }],
  fallbackItems: [],
  confidence: 0.84,
  requiresConfirmation: false,
  estimatedCalories: 420,
  estimatedProteinGrams: 28,
  estimatedCarbGrams: 22,
  estimatedFatGrams: 26,
  sourceBreakdown: ["database"],
  status: "succeeded",
  createdAt: now,
  expiresAt: "2026-05-30T12:10:00.000Z"
};

export const mealEntryFixture: MealEntry = {
  id: "meal_001",
  userId: userProfileFixture.id,
  loggedAt: now,
  diaryDate: "2026-05-30",
  mealName: "Caesar Salad",
  sourceMethod: "camera",
  localImageUri: "file:///meal_001.jpg",
  servings: 1,
  calories: 420,
  proteinGrams: 28,
  carbGrams: 22,
  fatGrams: 26,
  ingredients: [],
  analysisResultId: foodDetectionResultFixture.id,
  confirmationState: "confirmed",
  syncState: "local_only",
  createdAt: now,
  updatedAt: now
};

export const dailySummaryFixture: DailySummary = {
  id: "summary_001",
  userId: userProfileFixture.id,
  diaryDate: "2026-05-30",
  caloriesConsumed: 420,
  proteinConsumedGrams: 28,
  carbConsumedGrams: 22,
  fatConsumedGrams: 26,
  calorieTarget: userProfileFixture.calorieTarget,
  macroTargetsSnapshot: userProfileFixture.macroTargets,
  mealCount: 1,
  goalStatus: "under_goal",
  updatedAt: now
};

export const streakRecordFixture: StreakRecord = {
  id: "streak_001",
  userId: userProfileFixture.id,
  currentStreakDays: 3,
  longestStreakDays: 5,
  lastQualifiedDate: "2026-05-30",
  qualificationRule: "at_least_one_confirmed_meal",
  updatedAt: now
};

export const progressPointFixture: ProgressPoint = {
  id: "progress_001",
  userId: userProfileFixture.id,
  recordedAt: now,
  type: "calorie_average",
  calorieAverage: 2050,
  source: "diary_rollup",
  createdAt: now
};

export const communityPostFixture: CommunityPost = {
  id: "post_001",
  userId: userProfileFixture.id,
  groupId: "group_001",
  sourceType: "meal",
  sourceId: mealEntryFixture.id,
  nutritionSummary: {
    calories: mealEntryFixture.calories,
    proteinGrams: mealEntryFixture.proteinGrams,
    carbGrams: mealEntryFixture.carbGrams,
    fatGrams: mealEntryFixture.fatGrams
  },
  visibilityState: "group_shared",
  reactionCount: 0,
  commentCount: 0,
  createdAt: now,
  updatedAt: now
};

export const transformationPairFixture: TransformationPair = {
  id: "transform_001",
  userId: userProfileFixture.id,
  beforeImageUri: "file:///before.jpg",
  afterImageUri: "file:///after.jpg",
  beforeDate: "2025-05-30",
  afterDate: "2026-05-30",
  beforeWeight: 220,
  afterWeight: 185,
  hideWeight: true,
  shareState: "local_only",
  createdAt: now,
  updatedAt: now
};