import { mealEntryFixture } from "@calorie-tracker/shared";
import { buildApp } from "../../src/app";

describe("POST /v1/meals contract", () => {
  it("accepts a confirmed local meal and reports local-only sync when Supabase is not configured", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/v1/meals",
      headers: { authorization: "Bearer test-token" },
      payload: mealEntryFixture
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ syncState: "local_only" });
  });
});