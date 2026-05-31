import type { DetectedFood, IngredientNutrition } from "@calorie-tracker/shared";
import OpenAI from "openai";
import { z } from "zod";

export interface NutritionProviderResult {
  ingredients: IngredientNutrition[];
  databaseMatchedCount: number;
  aiFallbackCount: number;
}

export interface NutritionProvider {
  resolveFoods(detectedFoods: DetectedFood[]): Promise<NutritionProviderResult>;
}

export class MockNutritionProvider implements NutritionProvider {
  async resolveFoods(detectedFoods: DetectedFood[]): Promise<NutritionProviderResult> {
    const estimatedIngredients = detectedFoods.map((food) => estimateFoodNutrition(food));

    return {
      ingredients: estimatedIngredients,
      databaseMatchedCount: 0,
      aiFallbackCount: estimatedIngredients.length
    };
  }
}

const nutritionResponseSchema = z.object({
  ingredients: z
    .array(
      z.object({
        label: z.string().min(1),
        calories: z.number().nonnegative(),
        proteinGrams: z.number().nonnegative(),
        carbGrams: z.number().nonnegative(),
        fatGrams: z.number().nonnegative()
      })
    )
    .min(1)
});

export class OpenAiNutritionProvider implements NutritionProvider {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async resolveFoods(detectedFoods: DetectedFood[]): Promise<NutritionProviderResult> {
    const completion = await this.client.chat.completions.create({
      model: process.env.OPENAI_NUTRITION_MODEL ?? process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Estimate calories and macros for visible meal ingredients. Return JSON only. Be conservative, ingredient-level, and use grams for protein/carbs/fat. Do not include medical advice."
        },
        {
          role: "user",
          content: `Estimate nutrition for these detected foods: ${JSON.stringify(detectedFoods)}. Return {"ingredients":[{"label":"...","calories":0,"proteinGrams":0,"carbGrams":0,"fatGrams":0}]}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    const content = completion.choices[0]?.message.content;
    if (!content) {
      throw new Error("Nutrition provider returned no content");
    }

    const parsed = nutritionResponseSchema.parse(JSON.parse(content));
    return {
      ingredients: parsed.ingredients.map((ingredient) => ({
        ...ingredient,
        source: "ai_fallback"
      })),
      databaseMatchedCount: 0,
      aiFallbackCount: parsed.ingredients.length
    };
  }
}

export function createNutritionProvider(): NutritionProvider {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.AI_PROVIDER_API_KEY;
  return apiKey ? new OpenAiNutritionProvider(apiKey) : new MockNutritionProvider();
}

function estimateFoodNutrition(food: DetectedFood): IngredientNutrition {
  const label = food.label.toLowerCase();
  const isProtein = /chicken|salmon|beef|turkey|egg|tofu|fish|shrimp/.test(label);
  const isCarb = /rice|bread|toast|pasta|potato|crouton|tortilla|oat/.test(label);
  const isFat = /avocado|cheese|oil|dressing|nuts|parmesan/.test(label);
  const isVegetable = /lettuce|tomato|spinach|greens|broccoli|pepper|onion|salad/.test(label);

  if (isProtein) {
    return { label: food.label, calories: 220, proteinGrams: 32, carbGrams: 2, fatGrams: 8, source: "ai_fallback" };
  }
  if (isCarb) {
    return { label: food.label, calories: 150, proteinGrams: 4, carbGrams: 28, fatGrams: 3, source: "ai_fallback" };
  }
  if (isFat) {
    return { label: food.label, calories: 120, proteinGrams: 4, carbGrams: 3, fatGrams: 10, source: "ai_fallback" };
  }
  if (isVegetable) {
    return { label: food.label, calories: 35, proteinGrams: 2, carbGrams: 6, fatGrams: 0, source: "ai_fallback" };
  }

  return { label: food.label, calories: 120, proteinGrams: 6, carbGrams: 12, fatGrams: 5, source: "ai_fallback" };
}