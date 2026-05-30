import { getBearerToken } from "../../src/security/authMiddleware";

describe("auth middleware", () => {
  it("extracts bearer tokens", () => {
    expect(getBearerToken("Bearer abc123")).toBe("abc123");
  });

  it("rejects missing or malformed authorization headers", () => {
    expect(getBearerToken(undefined)).toBeNull();
    expect(getBearerToken("Basic abc123")).toBeNull();
    expect(getBearerToken("Bearer")).toBeNull();
  });
});