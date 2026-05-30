import type { DetectedFood, IngredientNutrition } from "@calorie-tracker/shared";

export interface NutritionProviderResult {
  ingredients: IngredientNutrition[];
  databaseMatchedCount: number;
  aiFallbackCount: number;
}

export interface NutritionProvider {
  resolveFoods(detectedFoods: DetectedFood[]): Promise<NutritionProviderResult>;
}

export class MockNutritionProvider implements NutritionProvider {
  async resolveFoods(detectedFoods: DetectedFood[]): Promise<NutritionProviderResult> {
    return {
      ingredients: detectedFoods.map((food) => ({
        label: food.label,
        calories: 420,
        proteinGrams: 28,
        carbGrams: 22,
        fatGrams: 26,
        source: "database",
        databaseProviderId: "mock-caesar-salad"
      })),
      databaseMatchedCount: detectedFoods.length,
      aiFallbackCount: 0
    };
  }
}