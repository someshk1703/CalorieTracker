import type { DetectedFood } from "@calorie-tracker/shared";
import OpenAI from "openai";
import { z } from "zod";

export interface AnalyzeImageInput {
  image: Buffer;
  sourceMethod: "camera" | "photo_import";
}

export interface AiVisionResult {
  mealName: string;
  detectedFoods: DetectedFood[];
  confidence: number;
}

export interface AiVisionProvider {
  analyzeImage(input: AnalyzeImageInput): Promise<AiVisionResult>;
}

export class MockAiVisionProvider implements AiVisionProvider {
  async analyzeImage(): Promise<AiVisionResult> {
    return {
      mealName: "Caesar Salad",
      detectedFoods: [{ label: "Caesar salad", estimatedPortion: "1 bowl", confidence: 0.84 }],
      confidence: 0.84
    };
  }
}

const visionResponseSchema = z.object({
  mealName: z.string().min(1),
  confidence: z.number().min(0).max(1),
  detectedFoods: z
    .array(
      z.object({
        label: z.string().min(1),
        estimatedPortion: z.string().min(1),
        confidence: z.number().min(0).max(1),
        anchor: z.object({ x: z.number(), y: z.number() }).optional()
      })
    )
    .min(1)
});

export class OpenAiVisionProvider implements AiVisionProvider {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async analyzeImage(input: AnalyzeImageInput): Promise<AiVisionResult> {
    const imageDataUrl = `data:image/jpeg;base64,${input.image.toString("base64")}`;
    const completion = await this.client.chat.completions.create({
      model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You identify visible foods in a meal photo for calorie tracking. Return compact JSON only with mealName, confidence, and detectedFoods. Each detected food needs label, estimatedPortion, confidence, and optional anchor x/y percentages from 0 to 1. Do not include medical advice."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this meal image for visible food items and portions." },
            { type: "image_url", image_url: { url: imageDataUrl, detail: "low" } }
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    const content = completion.choices[0]?.message.content;
    if (!content) {
      throw new Error("Vision provider returned no content");
    }

    const parsed = visionResponseSchema.parse(JSON.parse(content));
    return {
      ...parsed,
      detectedFoods: parsed.detectedFoods.map((food) =>
        food.anchor ? { ...food, anchor: food.anchor } : { label: food.label, estimatedPortion: food.estimatedPortion, confidence: food.confidence }
      )
    };
  }
}

export function createAiVisionProvider(): AiVisionProvider {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.AI_PROVIDER_API_KEY;
  return apiKey ? new OpenAiVisionProvider(apiKey) : new MockAiVisionProvider();
}