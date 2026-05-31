import {
  foodDetectionResultSchema,
  shareMealRequestSchema,
  userProfileFixture
} from "../../src";

describe("shared schemas", () => {
  it("requires confirmation for low-confidence food detection results", () => {
    const result = foodDetectionResultSchema.safeParse({
      analysisId: "analysis_low",
      mealName: "Unknown meal",
      detectedFoods: [{ label: "salad", estimatedPortion: "1 bowl", confidence: 0.4 }],
      nutrition: {
        calories: 300,
        proteinGrams: 12,
        carbGrams: 30,
        fatGrams: 14,
        ingredients: [],
        sourceBreakdown: { databaseMatchedCount: 0, aiFallbackCount: 1 }
      },
      confidence: 0.4,
      requiresConfirmation: false,
      status: "succeeded",
      expiresAt: "2026-05-30T12:10:00.000Z"
    });

    expect(result.success).toBe(false);
  });

  it("requires explicit consent for meal sharing", () => {
    const result = shareMealRequestSchema.safeParse({
      localMealId: "meal_001",
      groupId: "group_001",
      explicitConsent: false
    });

    expect(result.success).toBe(false);
    expect(userProfileFixture.privacyPreferences.communitySharingDefault).toBe("private");
  });
});