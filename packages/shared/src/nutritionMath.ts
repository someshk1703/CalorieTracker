import type { IngredientNutrition } from "./domain";

export interface NutritionTotals {
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
}

function roundNutrition(value: number): number {
  return Math.round(value * 10) / 10;
}

export function applyServingMultiplier(totals: NutritionTotals, servings: number): NutritionTotals {
  return {
    calories: roundNutrition(totals.calories * servings),
    proteinGrams: roundNutrition(totals.proteinGrams * servings),
    carbGrams: roundNutrition(totals.carbGrams * servings),
    fatGrams: roundNutrition(totals.fatGrams * servings)
  };
}

export function sumIngredientNutrition(ingredients: Pick<IngredientNutrition, keyof NutritionTotals>[]): NutritionTotals {
  return ingredients.reduce<NutritionTotals>(
    (totals, ingredient) => ({
      calories: roundNutrition(totals.calories + ingredient.calories),
      proteinGrams: roundNutrition(totals.proteinGrams + ingredient.proteinGrams),
      carbGrams: roundNutrition(totals.carbGrams + ingredient.carbGrams),
      fatGrams: roundNutrition(totals.fatGrams + ingredient.fatGrams)
    }),
    { calories: 0, proteinGrams: 0, carbGrams: 0, fatGrams: 0 }
  );
}