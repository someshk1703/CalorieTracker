import { z } from "zod";
import { AI_LOW_CONFIDENCE_THRESHOLD } from "./constants";

export const detectedFoodSchema = z.object({
  label: z.string().min(1),
  estimatedPortion: z.string().min(1),
  confidence: z.number().min(0).max(1),
  anchor: z.object({ x: z.number(), y: z.number() }).optional()
});

export const ingredientNutritionSchema = z.object({
  label: z.string().min(1),
  calories: z.number().nonnegative(),
  proteinGrams: z.number().nonnegative(),
  carbGrams: z.number().nonnegative(),
  fatGrams: z.number().nonnegative(),
  source: z.enum(["database", "ai_fallback", "user_corrected"]),
  databaseProviderId: z.string().optional()
});

export const nutritionEstimateSchema = z.object({
  calories: z.number().nonnegative(),
  proteinGrams: z.number().nonnegative(),
  carbGrams: z.number().nonnegative(),
  fatGrams: z.number().nonnegative(),
  ingredients: z.array(ingredientNutritionSchema).default([]),
  sourceBreakdown: z.object({
    databaseMatchedCount: z.number().int().nonnegative().default(0),
    aiFallbackCount: z.number().int().nonnegative().default(0)
  })
});

export const foodDetectionResultSchema = z
  .object({
    analysisId: z.string().min(1),
    mealName: z.string().min(1).optional(),
    detectedFoods: z.array(detectedFoodSchema).min(1),
    nutrition: nutritionEstimateSchema,
    confidence: z.number().min(0).max(1),
    requiresConfirmation: z.boolean(),
    status: z.enum(["succeeded", "failed", "timed_out"]),
    expiresAt: z.string().datetime()
  })
  .superRefine((value, context) => {
    if (value.confidence <= AI_LOW_CONFIDENCE_THRESHOLD && !value.requiresConfirmation) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requiresConfirmation"],
        message: "Low-confidence results require confirmation"
      });
    }
  });

export const analyzeMealRequestSchema = z.object({
  sourceMethod: z.enum(["camera", "photo_import"]),
  localRequestId: z.string().min(1).optional(),
  userConsentedToBackup: z.boolean().default(false),
  userConsentedToShare: z.boolean().default(false)
});

export const resolveNutritionRequestSchema = z.object({
  detectedFoods: z.array(detectedFoodSchema).min(1),
  servings: z.number().min(0.01).default(1)
});

export const shareMealRequestSchema = z.object({
  localMealId: z.string().min(1),
  groupId: z.string().min(1),
  caption: z.string().max(280).optional(),
  explicitConsent: z.literal(true),
  includePhoto: z.boolean().default(false),
  includeNutrition: z.boolean().default(true)
});

export const shareProgressRequestSchema = z.object({
  sourceId: z.string().min(1),
  sourceType: z.enum(["progress_point", "transformation_pair"]),
  groupId: z.string().min(1),
  explicitConsent: z.literal(true),
  hideWeight: z.boolean().default(true)
});

export const errorResponseSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  retryable: z.boolean().default(false)
});

export type FoodDetectionResultResponse = z.infer<typeof foodDetectionResultSchema>;
export type NutritionEstimateResponse = z.infer<typeof nutritionEstimateSchema>;