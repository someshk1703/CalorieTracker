import type { DailySummary, MealEntry, UserProfile } from "@calorie-tracker/shared";
import type { CalorieTrackerDatabase } from "./database";

export interface UserProfileRepository {
  save(profile: UserProfile): Promise<void>;
  findById(id: string): Promise<UserProfile | null>;
}

export interface MealEntryRepository {
  save(meal: MealEntry): Promise<void>;
  findByDate(userId: string, diaryDate: string): Promise<MealEntry[]>;
}

export interface DailySummaryRepository {
  save(summary: DailySummary): Promise<void>;
  findByDate(userId: string, diaryDate: string): Promise<DailySummary | null>;
}

export function createUserProfileRepository(database: CalorieTrackerDatabase): UserProfileRepository {
  return {
    async save(profile) {
      await database.runAsync(
        `INSERT OR REPLACE INTO user_profiles (
          id, display_name, email, profile_inputs_json, calorie_target, macro_targets_json,
          streak_settings_json, privacy_preferences_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        profile.id,
        profile.displayName,
        profile.email ?? null,
        JSON.stringify(profile.profileInputs),
        profile.calorieTarget,
        JSON.stringify(profile.macroTargets),
        JSON.stringify(profile.streakSettings),
        JSON.stringify(profile.privacyPreferences),
        profile.createdAt,
        profile.updatedAt
      );
    },
    async findById(id) {
      const row = await database.getFirstAsync<Record<string, unknown>>(
        "SELECT * FROM user_profiles WHERE id = ?",
        id
      );
      if (!row) {
        return null;
      }

      return {
        id: String(row.id),
        displayName: String(row.display_name),
        ...(row.email ? { email: String(row.email) } : {}),
        profileInputs: JSON.parse(String(row.profile_inputs_json)),
        calorieTarget: Number(row.calorie_target),
        macroTargets: JSON.parse(String(row.macro_targets_json)),
        streakSettings: JSON.parse(String(row.streak_settings_json)),
        privacyPreferences: JSON.parse(String(row.privacy_preferences_json)),
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at)
      } satisfies UserProfile;
    }
  };
}

export function createMealEntryRepository(database: CalorieTrackerDatabase): MealEntryRepository {
  return {
    async save(meal) {
      await database.runAsync(
        `INSERT OR REPLACE INTO meal_entries (
          id, user_id, logged_at, diary_date, meal_name, source_method, local_image_uri,
          cloud_media_id, servings, calories, protein_grams, carb_grams, fat_grams,
          ingredients_json, analysis_result_id, confirmation_state, sync_state, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        meal.id,
        meal.userId,
        meal.loggedAt,
        meal.diaryDate,
        meal.mealName,
        meal.sourceMethod,
        meal.localImageUri ?? null,
        meal.cloudMediaId ?? null,
        meal.servings,
        meal.calories,
        meal.proteinGrams,
        meal.carbGrams,
        meal.fatGrams,
        JSON.stringify(meal.ingredients),
        meal.analysisResultId ?? null,
        meal.confirmationState,
        meal.syncState,
        meal.createdAt,
        meal.updatedAt
      );
    },
    async findByDate(userId, diaryDate) {
      const rows = await database.getAllAsync<Record<string, unknown>>(
        "SELECT * FROM meal_entries WHERE user_id = ? AND diary_date = ? ORDER BY logged_at DESC",
        userId,
        diaryDate
      );

      return rows.map((row) => ({
        id: String(row.id),
        userId: String(row.user_id),
        loggedAt: String(row.logged_at),
        diaryDate: String(row.diary_date),
        mealName: String(row.meal_name),
        sourceMethod: row.source_method as MealEntry["sourceMethod"],
        ...(row.local_image_uri ? { localImageUri: String(row.local_image_uri) } : {}),
        ...(row.cloud_media_id ? { cloudMediaId: String(row.cloud_media_id) } : {}),
        servings: Number(row.servings),
        calories: Number(row.calories),
        proteinGrams: Number(row.protein_grams),
        carbGrams: Number(row.carb_grams),
        fatGrams: Number(row.fat_grams),
        ingredients: JSON.parse(String(row.ingredients_json)),
        ...(row.analysis_result_id ? { analysisResultId: String(row.analysis_result_id) } : {}),
        confirmationState: row.confirmation_state as MealEntry["confirmationState"],
        syncState: row.sync_state as MealEntry["syncState"],
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at)
      }));
    }
  };
}

export function createDailySummaryRepository(database: CalorieTrackerDatabase): DailySummaryRepository {
  return {
    async save(summary) {
      await database.runAsync(
        `INSERT OR REPLACE INTO daily_summaries (
          id, user_id, diary_date, calories_consumed, protein_consumed_grams,
          carb_consumed_grams, fat_consumed_grams, calorie_target, macro_targets_snapshot_json,
          meal_count, goal_status, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        summary.id,
        summary.userId,
        summary.diaryDate,
        summary.caloriesConsumed,
        summary.proteinConsumedGrams,
        summary.carbConsumedGrams,
        summary.fatConsumedGrams,
        summary.calorieTarget,
        JSON.stringify(summary.macroTargetsSnapshot),
        summary.mealCount,
        summary.goalStatus,
        summary.updatedAt
      );
    },
    async findByDate(userId, diaryDate) {
      const row = await database.getFirstAsync<Record<string, unknown>>(
        "SELECT * FROM daily_summaries WHERE user_id = ? AND diary_date = ?",
        userId,
        diaryDate
      );
      if (!row) {
        return null;
      }

      return {
        id: String(row.id),
        userId: String(row.user_id),
        diaryDate: String(row.diary_date),
        caloriesConsumed: Number(row.calories_consumed),
        proteinConsumedGrams: Number(row.protein_consumed_grams),
        carbConsumedGrams: Number(row.carb_consumed_grams),
        fatConsumedGrams: Number(row.fat_consumed_grams),
        calorieTarget: Number(row.calorie_target),
        macroTargetsSnapshot: JSON.parse(String(row.macro_targets_snapshot_json)),
        mealCount: Number(row.meal_count),
        goalStatus: row.goal_status as DailySummary["goalStatus"],
        updatedAt: String(row.updated_at)
      };
    }
  };
}