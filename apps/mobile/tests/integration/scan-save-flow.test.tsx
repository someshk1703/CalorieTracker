import { mealEntryFixture } from "@calorie-tracker/shared";
import { createPendingMealEntry, saveMealEntryOnce } from "../../src/features/diary/saveMealEntry";

describe("scan-to-save diary flow", () => {
  it("creates one local meal entry from a confirmed analysis result", async () => {
    const pendingMeal = createPendingMealEntry({
      userId: mealEntryFixture.userId,
      analysisId: "analysis_001",
      mealName: "Caesar Salad",
      nutrition: {
        calories: 420,
        proteinGrams: 28,
        carbGrams: 22,
        fatGrams: 26,
        ingredients: [],
        sourceBreakdown: { databaseMatchedCount: 1, aiFallbackCount: 0 }
      },
      localImageUri: "file:///meal.jpg"
    });

    const saved = await saveMealEntryOnce(pendingMeal, async (meal) => meal);

    expect(saved.confirmationState).toBe("confirmed");
    expect(saved.syncState).toBe("local_only");
    expect(saved.localImageUri).toBe("file:///meal.jpg");
    expect(saved.cloudMediaId).toBeUndefined();
  });
});