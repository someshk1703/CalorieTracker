import { foodDetectionResultSchema } from "@calorie-tracker/shared";
import { buildApp } from "../../src/app";

describe("POST /v1/analyze-meal contract", () => {
  it("returns a confidence-gated nutrition estimate for an authenticated meal image", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/v1/analyze-meal",
      headers: {
        authorization: "Bearer test-token"
      },
      payload: {
        sourceMethod: "camera",
        localRequestId: "request_001",
        userConsentedToBackup: false,
        userConsentedToShare: false
      }
    });

    expect(response.statusCode).toBe(200);
    const parsed = foodDetectionResultSchema.safeParse(response.json());
    expect(parsed.success).toBe(true);
    expect(parsed.success ? parsed.data.nutrition.calories : 0).toBeGreaterThan(0);
  });

  it("requires authentication", async () => {
    const app = buildApp();
    const response = await app.inject({ method: "POST", url: "/v1/analyze-meal" });

    expect(response.statusCode).toBe(401);
  });
});