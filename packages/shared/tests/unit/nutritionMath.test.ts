import { applyServingMultiplier, sumIngredientNutrition } from "../../src/nutritionMath";

describe("nutrition math", () => {
  it("applies serving multipliers consistently to calories and macros", () => {
    expect(
      applyServingMultiplier(
        { calories: 420, proteinGrams: 28, carbGrams: 22, fatGrams: 26 },
        1.5
      )
    ).toEqual({ calories: 630, proteinGrams: 42, carbGrams: 33, fatGrams: 39 });
  });

  it("sums ingredient-level nutrition", () => {
    expect(
      sumIngredientNutrition([
        { calories: 100, proteinGrams: 10, carbGrams: 5, fatGrams: 4 },
        { calories: 50, proteinGrams: 2, carbGrams: 8, fatGrams: 1 }
      ])
    ).toEqual({ calories: 150, proteinGrams: 12, carbGrams: 13, fatGrams: 5 });
  });
});