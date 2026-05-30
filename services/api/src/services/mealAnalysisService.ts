import {
  applyServingMultiplier,
  resolveNutritionRequestSchema,
  summarizeConfidenceState,
  sumIngredientNutrition,
  type DetectedFood,
  type NutritionEstimateResponse,
  type SourceMethod
} from "@calorie-tracker/shared";
import { randomUUID } from "crypto";
import { MockAiVisionProvider, type AiVisionProvider } from "./aiVisionProvider";
import { MockNutritionProvider, type NutritionProvider } from "./nutritionProvider";

export interface AnalyzeMealInput {
  userId: string;
  sourceMethod: SourceMethod;
  userConsentedToBackup: boolean;
  userConsentedToShare: boolean;
}

export interface MealAnalysisResponse {
  analysisId: string;
  mealName: string;
  detectedFoods: DetectedFood[];
  nutrition: NutritionEstimateResponse;
  confidence: number;
  requiresConfirmation: boolean;
  status: "succeeded" | "failed" | "timed_out";
  expiresAt: string;
}

export class MealAnalysisService {
  constructor(
    private readonly aiVisionProvider: AiVisionProvider = new MockAiVisionProvider(),
    private readonly nutritionProvider: NutritionProvider = new MockNutritionProvider()
  ) {}

  async analyzeMeal(input: AnalyzeMealInput): Promise<MealAnalysisResponse> {
    const vision = await this.aiVisionProvider.analyzeImage({
      image: Buffer.alloc(0),
      sourceMethod: input.sourceMethod === "manual_correction" ? "camera" : input.sourceMethod
    });
    const nutrition = await this.resolveNutrition(vision.detectedFoods, 1);
    const confidenceState = summarizeConfidenceState({ confidence: vision.confidence, hasConflicts: false });

    return {
      analysisId: randomUUID(),
      mealName: vision.mealName,
      detectedFoods: vision.detectedFoods,
      nutrition,
      confidence: vision.confidence,
      requiresConfirmation: confidenceState.requiresConfirmation,
      status: "succeeded",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    };
  }

  async resolveNutrition(detectedFoods: unknown, servings: number): Promise<NutritionEstimateResponse> {
    const request = resolveNutritionRequestSchema.parse({ detectedFoods, servings });
    const normalizedFoods: DetectedFood[] = request.detectedFoods.map((food) =>
      food.anchor ? { ...food, anchor: food.anchor } : { label: food.label, estimatedPortion: food.estimatedPortion, confidence: food.confidence }
    );
    const resolved = await this.nutritionProvider.resolveFoods(normalizedFoods);
    const baseTotals = sumIngredientNutrition(resolved.ingredients);
    const totals = applyServingMultiplier(baseTotals, request.servings);

    return {
      ...totals,
      ingredients: resolved.ingredients,
      sourceBreakdown: {
        databaseMatchedCount: resolved.databaseMatchedCount,
        aiFallbackCount: resolved.aiFallbackCount
      }
    };
  }
}