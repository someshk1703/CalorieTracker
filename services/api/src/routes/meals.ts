import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { MealEntry } from "@calorie-tracker/shared";
import { createMealStore } from "../services/supabaseMealStore";

const mealEntrySchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  loggedAt: z.string().datetime(),
  diaryDate: z.string().min(1),
  mealName: z.string().min(1),
  sourceMethod: z.enum(["camera", "photo_import", "manual_correction"]),
  localImageUri: z.string().optional(),
  cloudMediaId: z.string().optional(),
  servings: z.number().positive(),
  calories: z.number().nonnegative(),
  proteinGrams: z.number().nonnegative(),
  carbGrams: z.number().nonnegative(),
  fatGrams: z.number().nonnegative(),
  ingredients: z.array(
    z.object({
      label: z.string().min(1),
      calories: z.number().nonnegative(),
      proteinGrams: z.number().nonnegative(),
      carbGrams: z.number().nonnegative(),
      fatGrams: z.number().nonnegative(),
      source: z.enum(["database", "ai_fallback", "user_corrected"]),
      databaseProviderId: z.string().optional()
    })
  ),
  analysisResultId: z.string().optional(),
  confirmationState: z.enum(["pending_review", "confirmed", "corrected"]),
  syncState: z.enum(["local_only", "pending_sync", "synced", "share_pending", "shared", "failed"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export async function registerMealRoutes(app: FastifyInstance): Promise<void> {
  const mealStore = createMealStore();

  app.post("/v1/meals", async (request, reply) => {
    const meal = mealEntrySchema.parse(request.body ?? {});
    const saveResult = await mealStore.saveMeal(toMealEntry({ ...meal, userId: request.user?.id ?? meal.userId }));
    return reply.code(200).send({ syncState: saveResult.syncState });
  });
}

function toMealEntry(meal: z.infer<typeof mealEntrySchema>): MealEntry {
  return {
    id: meal.id,
    userId: meal.userId,
    loggedAt: meal.loggedAt,
    diaryDate: meal.diaryDate,
    mealName: meal.mealName,
    sourceMethod: meal.sourceMethod,
    ...(meal.localImageUri ? { localImageUri: meal.localImageUri } : {}),
    ...(meal.cloudMediaId ? { cloudMediaId: meal.cloudMediaId } : {}),
    servings: meal.servings,
    calories: meal.calories,
    proteinGrams: meal.proteinGrams,
    carbGrams: meal.carbGrams,
    fatGrams: meal.fatGrams,
    ingredients: meal.ingredients.map((ingredient) => ({
      label: ingredient.label,
      calories: ingredient.calories,
      proteinGrams: ingredient.proteinGrams,
      carbGrams: ingredient.carbGrams,
      fatGrams: ingredient.fatGrams,
      source: ingredient.source,
      ...(ingredient.databaseProviderId ? { databaseProviderId: ingredient.databaseProviderId } : {})
    })),
    ...(meal.analysisResultId ? { analysisResultId: meal.analysisResultId } : {}),
    confirmationState: meal.confirmationState,
    syncState: meal.syncState,
    createdAt: meal.createdAt,
    updatedAt: meal.updatedAt
  };
}