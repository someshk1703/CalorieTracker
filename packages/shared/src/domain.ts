export type SourceMethod = "camera" | "photo_import" | "manual_correction";
export type ConfirmationState = "pending_review" | "confirmed" | "corrected";
export type SyncState = "local_only" | "pending_sync" | "synced" | "share_pending" | "shared" | "failed";
export type DetectionStatus = "analyzing" | "succeeded" | "failed" | "timed_out" | "corrected";
export type NutritionSource = "database" | "ai_fallback" | "user_corrected";
export type GoalStatus = "under_goal" | "near_goal" | "met_goal" | "over_goal";
export type VisibilityState = "private" | "group_shared" | "removed";
export type ProgressPointType = "weight" | "calorie_average" | "macro_average" | "goal_progress";
export type ShareState = "local_only" | "share_pending" | "shared" | "removed";

export interface MacroTargets {
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
}

export interface ProfileInputs {
  ageRange?: string;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "athlete";
  goalIntent?: "lose" | "maintain" | "gain";
  dietaryPreferenceFlags: string[];
}

export interface PrivacyPreferences {
  photoBackupEnabled: boolean;
  communitySharingDefault: "private";
  hideWeightByDefault: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  profileInputs: ProfileInputs;
  calorieTarget: number;
  macroTargets: MacroTargets;
  streakSettings: { qualificationRule: "at_least_one_confirmed_meal" };
  privacyPreferences: PrivacyPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface IngredientNutrition {
  label: string;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  source: NutritionSource;
  databaseProviderId?: string;
}

export interface MealEntry {
  id: string;
  userId: string;
  loggedAt: string;
  diaryDate: string;
  mealName: string;
  sourceMethod: SourceMethod;
  localImageUri?: string;
  cloudMediaId?: string;
  servings: number;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  ingredients: IngredientNutrition[];
  analysisResultId?: string;
  confirmationState: ConfirmationState;
  syncState: SyncState;
  createdAt: string;
  updatedAt: string;
}

export interface DetectedFood {
  label: string;
  estimatedPortion: string;
  confidence: number;
  anchor?: { x: number; y: number };
}

export interface FoodDetectionResult {
  id: string;
  userId: string;
  imageSessionId: string;
  detectedFoods: DetectedFood[];
  databaseMatches: Array<{ label: string; providerId: string }>;
  fallbackItems: string[];
  confidence: number;
  requiresConfirmation: boolean;
  estimatedCalories: number;
  estimatedProteinGrams: number;
  estimatedCarbGrams: number;
  estimatedFatGrams: number;
  sourceBreakdown: NutritionSource[];
  status: DetectionStatus;
  createdAt: string;
  expiresAt: string;
}

export interface DailySummary {
  id: string;
  userId: string;
  diaryDate: string;
  caloriesConsumed: number;
  proteinConsumedGrams: number;
  carbConsumedGrams: number;
  fatConsumedGrams: number;
  calorieTarget: number;
  macroTargetsSnapshot: MacroTargets;
  mealCount: number;
  goalStatus: GoalStatus;
  updatedAt: string;
}

export interface StreakRecord {
  id: string;
  userId: string;
  currentStreakDays: number;
  longestStreakDays: number;
  lastQualifiedDate?: string;
  qualificationRule: "at_least_one_confirmed_meal";
  updatedAt: string;
}

export interface ProgressPoint {
  id: string;
  userId: string;
  recordedAt: string;
  type: ProgressPointType;
  weightValue?: number;
  calorieAverage?: number;
  macroAverages?: MacroTargets;
  source: "user_entry" | "diary_rollup" | "imported";
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  groupId: string;
  sourceType: "meal" | "progress" | "transformation";
  sourceId: string;
  caption?: string;
  nutritionSummary?: Pick<MealEntry, "calories" | "proteinGrams" | "carbGrams" | "fatGrams">;
  mediaId?: string;
  visibilityState: VisibilityState;
  reactionCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransformationPair {
  id: string;
  userId: string;
  beforeImageUri: string;
  afterImageUri: string;
  beforeDate: string;
  afterDate: string;
  beforeWeight?: number;
  afterWeight?: number;
  hideWeight: boolean;
  shareState: ShareState;
  createdAt: string;
  updatedAt: string;
}