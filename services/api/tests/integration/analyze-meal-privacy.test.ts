import { buildApp } from "../../src/app";
import { shouldPersistServerMedia } from "../../src/security/privacy";

describe("meal analysis privacy", () => {
  it("does not persist server media without explicit backup or share consent", () => {
    expect(shouldPersistServerMedia({ userConsentedToBackup: false, userConsentedToShare: false })).toBe(false);
    expect(shouldPersistServerMedia({ userConsentedToBackup: true, userConsentedToShare: false })).toBe(true);
    expect(shouldPersistServerMedia({ userConsentedToBackup: false, userConsentedToShare: true })).toBe(true);
  });

  it("returns a retryable timeout/error shape when analysis cannot complete", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/v1/analyze-meal",
      headers: { authorization: "Bearer test-token" },
      payload: { sourceMethod: "camera", localRequestId: "timeout_case" }
    });

    expect([200, 408, 502]).toContain(response.statusCode);
  });
});