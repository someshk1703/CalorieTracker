import { API_ROUTES, foodDetectionResultSchema, type FoodDetectionResultResponse, type SourceMethod } from "@calorie-tracker/shared";
import { useCallback, useState } from "react";
import { createApiClient } from "../../services/apiClient";

export type MealAnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "succeeded"; result: FoodDetectionResultResponse }
  | { status: "failed"; retryable: boolean; message: string };

export function useMealAnalysis(token: string | null) {
  const [state, setState] = useState<MealAnalysisState>({ status: "idle" });

  const analyzeMeal = useCallback(
    async (sourceMethod: Extract<SourceMethod, "camera" | "photo_import">) => {
      if (!token) {
        setState({ status: "failed", retryable: false, message: "Authentication required" });
        return;
      }

      setState({ status: "loading" });
      try {
        const apiClient = createApiClient({ baseUrl: "http://localhost:3000", getToken: () => token });
        const response = await apiClient.request<unknown>(API_ROUTES.analyzeMeal, {
          method: "POST",
          body: JSON.stringify({ sourceMethod })
        });
        setState({ status: "succeeded", result: foodDetectionResultSchema.parse(response) });
      } catch (error) {
        setState({ status: "failed", retryable: true, message: error instanceof Error ? error.message : "Analysis failed" });
      }
    },
    [token]
  );

  return { state, analyzeMeal, reset: () => setState({ status: "idle" }) };
}