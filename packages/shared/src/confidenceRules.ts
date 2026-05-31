import { AI_LOW_CONFIDENCE_THRESHOLD } from "./constants";

export type ConfirmationReason = "low_confidence" | "conflict" | "none";

export interface ConfidenceStateInput {
  confidence: number;
  hasConflicts: boolean;
}

export interface ConfidenceState {
  requiresConfirmation: boolean;
  reason: ConfirmationReason;
}

export function requiresUserConfirmation(confidence: number): boolean {
  return confidence <= AI_LOW_CONFIDENCE_THRESHOLD;
}

export function summarizeConfidenceState(input: ConfidenceStateInput): ConfidenceState {
  if (input.hasConflicts) {
    return { requiresConfirmation: true, reason: "conflict" };
  }

  if (requiresUserConfirmation(input.confidence)) {
    return { requiresConfirmation: true, reason: "low_confidence" };
  }

  return { requiresConfirmation: false, reason: "none" };
}