import { API_ROUTES, foodDetectionResultSchema, type FoodDetectionResultResponse, type SourceMethod } from "@calorie-tracker/shared";
import { useCallback, useState } from "react";
import { createApiClient } from "../../services/apiClient";

export type MealAnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "succeeded"; result: FoodDetectionResultResponse }
  | { status: "failed"; retryable: boolean; message: string };

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export function useMealAnalysis(token: string | null) {
  const [state, setState] = useState<MealAnalysisState>({ status: "idle" });

  const analyzeMeal = useCallback(
    async (sourceMethod: Extract<SourceMethod, "camera" | "photo_import">, localImageUri?: string) => {
      if (!token) {
        setState({ status: "failed", retryable: false, message: "Authentication required" });
        return null;
      }

      setState({ status: "loading" });
      try {
        const apiClient = createApiClient({ baseUrl: apiBaseUrl, getToken: () => token });
        const body = localImageUri ? new FormData() : undefined;
        if (body) {
          body.append("sourceMethod", sourceMethod);
          body.append("localRequestId", `local-${Date.now()}`);
          body.append("userConsentedToBackup", "false");
          body.append("userConsentedToShare", "false");
          body.append("image", { uri: localImageUri, name: "meal.jpg", type: "image/jpeg" } as unknown as Blob);
        }

        const response = await apiClient.request<unknown>(API_ROUTES.analyzeMeal, {
          method: "POST",
          body:
            body ??
            JSON.stringify({
              sourceMethod,
              localRequestId: `local-${Date.now()}`
            })
        });
        const result = foodDetectionResultSchema.parse(response);
        setState({ status: "succeeded", result });
        return result;
      } catch (error) {
        setState({ status: "failed", retryable: true, message: error instanceof Error ? error.message : "Analysis failed" });
        return null;
      }
    },
    [token]
  );

  return { state, analyzeMeal, reset: () => setState({ status: "idle" }) };
}