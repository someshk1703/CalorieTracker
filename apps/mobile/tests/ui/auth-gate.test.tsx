import { getInitialRouteForAuthState } from "../../src/features/auth/authStore";

describe("auth gate", () => {
  it("requires sign-in before app use", () => {
    expect(getInitialRouteForAuthState(null, false)).toBe("/sign-in");
  });

  it("routes authenticated users through onboarding before tabs", () => {
    const user = { id: "user_001", displayName: "Alex", token: "token" };

    expect(getInitialRouteForAuthState(user, false)).toBe("/onboarding");
    expect(getInitialRouteForAuthState(user, true)).toBe("/(tabs)");
  });
});