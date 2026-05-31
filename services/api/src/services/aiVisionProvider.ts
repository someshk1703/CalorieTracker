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

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export class GeminiVisionProvider implements AiVisionProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = process.env.GEMINI_VISION_MODEL ?? "gemini-1.5-flash"
  ) {}

  async analyzeImage(input: AnalyzeImageInput): Promise<AiVisionResult> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${encodeURIComponent(this.apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "Analyze this meal image for calorie tracking and return strict JSON with keys: mealName, confidence, detectedFoods. detectedFoods is an array of items with label, estimatedPortion, confidence, and optional anchor {x,y} where x and y are 0..1."
                },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: input.image.toString("base64")
                  }
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini vision request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as GeminiGenerateContentResponse;
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
    if (!text) {
      throw new Error("Gemini vision returned no content");
    }

    const parsed = visionResponseSchema.parse(JSON.parse(extractJson(text)));
    return {
      ...parsed,
      detectedFoods: parsed.detectedFoods.map((food) =>
        food.anchor ? { ...food, anchor: food.anchor } : { label: food.label, estimatedPortion: food.estimatedPortion, confidence: food.confidence }
      )
    };
  }
}

class FallbackAiVisionProvider implements AiVisionProvider {
  constructor(private readonly providers: AiVisionProvider[]) {}

  async analyzeImage(input: AnalyzeImageInput): Promise<AiVisionResult> {
    let lastError: unknown;
    for (const provider of this.providers) {
      try {
        return await provider.analyzeImage(input);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError instanceof Error ? lastError : new Error("All AI vision providers failed");
  }
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1);
  }

  return text;
}

export function createAiVisionProvider(): AiVisionProvider {
  const providerMode = (process.env.AI_VISION_PROVIDER ?? "auto").toLowerCase();
  const openAiKey = process.env.OPENAI_API_KEY ?? process.env.AI_PROVIDER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (providerMode === "openai") {
    return openAiKey ? new OpenAiVisionProvider(openAiKey) : new MockAiVisionProvider();
  }

  if (providerMode === "gemini") {
    return geminiKey ? new GeminiVisionProvider(geminiKey) : new MockAiVisionProvider();
  }

  const providers: AiVisionProvider[] = [];
  if (openAiKey) {
    providers.push(new OpenAiVisionProvider(openAiKey));
  }
  if (geminiKey) {
    providers.push(new GeminiVisionProvider(geminiKey));
  }

  if (providers.length === 0) {
    return new MockAiVisionProvider();
  }
  const firstProvider = providers[0];
  if (providers.length === 1 && firstProvider) {
    return firstProvider;
  }

  return new FallbackAiVisionProvider(providers);
}