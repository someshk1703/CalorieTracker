import type { DetectedFood } from "@calorie-tracker/shared";

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