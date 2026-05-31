import { requiresUserConfirmation, summarizeConfidenceState } from "../../src/confidenceRules";

describe("confidence rules", () => {
  it("requires confirmation at or below the low-confidence threshold", () => {
    expect(requiresUserConfirmation(0.5)).toBe(true);
    expect(requiresUserConfirmation(0.49)).toBe(true);
    expect(requiresUserConfirmation(0.51)).toBe(false);
  });

  it("summarizes low-confidence and conflict states", () => {
    expect(summarizeConfidenceState({ confidence: 0.4, hasConflicts: false })).toEqual({
      requiresConfirmation: true,
      reason: "low_confidence"
    });
    expect(summarizeConfidenceState({ confidence: 0.9, hasConflicts: true })).toEqual({
      requiresConfirmation: true,
      reason: "conflict"
    });
  });
});