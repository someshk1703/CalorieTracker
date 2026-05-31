import { nutritionEstimateSchema } from "@calorie-tracker/shared";
import { buildApp } from "../../src/app";

describe("POST /v1/nutrition/resolve contract", () => {
  it("resolves detected foods into calories and macros", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/v1/nutrition/resolve",
      headers: {
        authorization: "Bearer test-token"
      },
      payload: {
        detectedFoods: [{ label: "Caesar salad", estimatedPortion: "1 bowl", confidence: 0.84 }],
        servings: 1
      }
    });

    expect(response.statusCode).toBe(200);
    const parsed = nutritionEstimateSchema.safeParse(response.json());
    expect(parsed.success).toBe(true);
    expect(parsed.success ? parsed.data.proteinGrams : 0).toBeGreaterThanOrEqual(0);
  });
});