export const AI_LOW_CONFIDENCE_THRESHOLD = 0.5;
export const IMAGE_INFERENCE_TIMEOUT_MS = 10_000;

export const MACRO_UNITS = {
  calories: "kcal",
  protein: "g",
  carbs: "g",
  fat: "g"
} as const;

export const API_ROUTES = {
  analyzeMeal: "/v1/analyze-meal",
  resolveNutrition: "/v1/nutrition/resolve",
  shareMeal: "/v1/meals/share",
  shareProgress: "/v1/progress/share",
  media: "/v1/media",
  privacyExport: "/v1/privacy/export"
} as const;