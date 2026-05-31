import { API_ROUTES, applyServingMultiplier, foodDetectionResultFixture, foodDetectionResultSchema, type FoodDetectionResultResponse } from "@calorie-tracker/shared";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { createPendingMealEntry, saveMealEntryOnce } from "../src/features/diary/saveMealEntry";
import { CorrectionForm } from "../src/features/scan/CorrectionForm";
import { createApiClient } from "../src/services/apiClient";

function getAnalysisFromParams(value: string | string[] | undefined): FoodDetectionResultResponse | null {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (!rawValue) {
    return null;
  }

  try {
    return foodDetectionResultSchema.parse(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export default function NutritionResultsScreen() {
  const params = useLocalSearchParams<{ analysis?: string; imageUri?: string; sourceMethod?: "camera" | "photo_import" }>();
  const analysis = getAnalysisFromParams(params.analysis);
  const imageUri = Array.isArray(params.imageUri) ? params.imageUri[0] : params.imageUri;
  const [servings, setServings] = useState(1);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [mealName, setMealName] = useState(analysis?.mealName ?? foodDetectionResultFixture.detectedFoods[0]?.label ?? "Scanned Meal");
  const [savedState, setSavedState] = useState<"idle" | "saved">("idle");
  const baseNutrition = {
    calories: analysis?.nutrition.calories ?? foodDetectionResultFixture.estimatedCalories,
    proteinGrams: analysis?.nutrition.proteinGrams ?? foodDetectionResultFixture.estimatedProteinGrams,
    carbGrams: analysis?.nutrition.carbGrams ?? foodDetectionResultFixture.estimatedCarbGrams,
    fatGrams: analysis?.nutrition.fatGrams ?? foodDetectionResultFixture.estimatedFatGrams
  };
  const totals = useMemo(() => applyServingMultiplier(baseNutrition, servings), [servings]);
  const detectedFoods = analysis?.detectedFoods ?? foodDetectionResultFixture.detectedFoods;

  async function saveResult() {
    const pendingMeal = createPendingMealEntry({
      userId: foodDetectionResultFixture.userId,
      analysisId: analysis?.analysisId ?? foodDetectionResultFixture.id,
      mealName,
      servings,
      nutrition: {
        ...totals,
        ingredients: detectedFoods.map((food) => ({
          label: food.label,
          calories: totals.calories,
          proteinGrams: totals.proteinGrams,
          carbGrams: totals.carbGrams,
          fatGrams: totals.fatGrams,
          source: "database"
        })),
        sourceBreakdown: { databaseMatchedCount: 1, aiFallbackCount: 0 }
      },
      localImageUri: imageUri ?? "file:///meal_001.jpg"
    });
    await saveMealEntryOnce(pendingMeal, async (meal) => {
      try {
        const apiClient = createApiClient({ baseUrl: apiBaseUrl, getToken: () => "test-token" });
        const response = await apiClient.request<{ syncState: "synced" | "local_only" }>(API_ROUTES.mealEntries, {
          method: "POST",
          body: JSON.stringify(meal)
        });
        return { ...meal, syncState: response.syncState };
      } catch {
        return meal;
      }
    });
    setSavedState("saved");
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <Text style={styles.imageText}>{mealName}</Text>}
      </View>
      <View style={styles.sheet}>
      <Text style={styles.time}>6:21 PM</Text>
      <Text style={styles.title}>{mealName}</Text>
      <View style={styles.calorieHero}><Text style={styles.metricLabel}>Calories</Text><Text style={styles.metric}>{totals.calories}</Text></View>
      <View style={styles.macroRow}>
        <Text style={styles.macro}>Protein {totals.proteinGrams}g</Text>
        <Text style={styles.macro}>Carbs {totals.carbGrams}g</Text>
        <Text style={styles.macro}>Fat {totals.fatGrams}g</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable accessibilityLabel="Decrease serving quantity" onPress={() => setServings((value) => Math.max(0.5, value - 1))}>
          <Text style={styles.stepperButton}>-</Text>
        </Pressable>
        <Text style={styles.servings}>{servings} {servings === 1 ? "serving" : "servings"}</Text>
        <Pressable accessibilityLabel="Increase serving quantity" onPress={() => setServings((value) => value + 1)}>
          <Text style={styles.stepperButton}>+</Text>
        </Pressable>
      </View>
      {(analysis?.requiresConfirmation ?? foodDetectionResultFixture.requiresConfirmation) ? <Text style={styles.prompt}>Confirm this estimate before saving.</Text> : null}
      {isCorrecting ? <CorrectionForm initialMealName={mealName} onSubmit={(value) => { setMealName(value); setIsCorrecting(false); }} /> : null}
      <View style={styles.actionRow}>
        <Pressable onPress={() => setIsCorrecting(true)} style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Fix Results</Text>
        </Pressable>
        <Pressable onPress={saveResult} style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Done</Text>
        </Pressable>
      </View>
      {savedState === "saved" ? <Text style={styles.savedText}>Saved locally</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: { flexDirection: "row", gap: 12 },
  calorieHero: { backgroundColor: "#FFFFFF", borderRadius: 22, elevation: 4, marginVertical: 12, padding: 18, shadowColor: "#17131F", shadowOpacity: 0.1, shadowRadius: 18 },
  container: { backgroundColor: "#F8FAFC", flex: 1 },
  image: { height: "100%", width: "100%" },
  imagePreview: { alignItems: "center", backgroundColor: "#111827", height: 330, justifyContent: "center" },
  imageText: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  macro: { color: "#334155", fontWeight: "700" },
  macroRow: { flexDirection: "row", justifyContent: "space-between" },
  metric: { color: "#111827", fontSize: 38, fontWeight: "900" },
  metricLabel: { color: "#8A8591", fontWeight: "800" },
  primaryAction: { alignItems: "center", backgroundColor: "#16A34A", flex: 1, padding: 14 },
  primaryActionText: { color: "#FFFFFF", fontWeight: "800" },
  prompt: { color: "#B45309", fontWeight: "600" },
  savedText: { color: "#15803D", fontWeight: "700" },
  secondaryAction: { alignItems: "center", borderColor: "#94A3B8", borderWidth: 1, flex: 1, padding: 14 },
  secondaryActionText: { color: "#0F172A", fontWeight: "800" },
  servings: { color: "#111827", fontWeight: "700" },
  sheet: { backgroundColor: "#FAF9F7", borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 16, marginTop: -28, padding: 20 },
  stepper: { alignItems: "center", flexDirection: "row", gap: 20 },
  stepperButton: { color: "#111827", fontSize: 24, fontWeight: "900", padding: 8 },
  time: { color: "#8A8591", fontWeight: "800" },
  title: { color: "#111827", fontSize: 20, fontWeight: "800" }
});