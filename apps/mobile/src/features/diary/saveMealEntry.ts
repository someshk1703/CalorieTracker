import type { MealEntry, NutritionEstimateResponse } from "@calorie-tracker/shared";

export interface PendingMealEntryInput {
  userId: string;
  analysisId: string;
  mealName: string;
  nutrition: NutritionEstimateResponse;
  localImageUri?: string;
  servings?: number;
}

export function createPendingMealEntry(input: PendingMealEntryInput): MealEntry {
  const now = new Date().toISOString();
  const diaryDate = now.slice(0, 10);
  const ingredients = input.nutrition.ingredients.map((ingredient) => ({
    label: ingredient.label,
    calories: ingredient.calories,
    proteinGrams: ingredient.proteinGrams,
    carbGrams: ingredient.carbGrams,
    fatGrams: ingredient.fatGrams,
    source: ingredient.source,
    ...(ingredient.databaseProviderId ? { databaseProviderId: ingredient.databaseProviderId } : {})
  }));

  return {
    id: `meal_${input.analysisId}`,
    userId: input.userId,
    loggedAt: now,
    diaryDate,
    mealName: input.mealName,
    sourceMethod: "camera",
    ...(input.localImageUri ? { localImageUri: input.localImageUri } : {}),
    servings: input.servings ?? 1,
    calories: input.nutrition.calories,
    proteinGrams: input.nutrition.proteinGrams,
    carbGrams: input.nutrition.carbGrams,
    fatGrams: input.nutrition.fatGrams,
    ingredients,
    analysisResultId: input.analysisId,
    confirmationState: "confirmed",
    syncState: "local_only",
    createdAt: now,
    updatedAt: now
  };
}

export async function saveMealEntryOnce(
  meal: MealEntry,
  save: (meal: MealEntry) => Promise<MealEntry> | MealEntry
): Promise<MealEntry> {
  const localMeal = { ...meal };
  delete localMeal.cloudMediaId;
  return save({ ...localMeal, syncState: "local_only" });
}