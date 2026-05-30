import { applyServingMultiplier, foodDetectionResultFixture } from "@calorie-tracker/shared";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { createPendingMealEntry, saveMealEntryOnce } from "../src/features/diary/saveMealEntry";
import { CorrectionForm } from "../src/features/scan/CorrectionForm";

export default function NutritionResultsScreen() {
  const [servings, setServings] = useState(1);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [mealName, setMealName] = useState("Caesar Salad");
  const [savedState, setSavedState] = useState<"idle" | "saved">("idle");
  const baseNutrition = {
    calories: foodDetectionResultFixture.estimatedCalories,
    proteinGrams: foodDetectionResultFixture.estimatedProteinGrams,
    carbGrams: foodDetectionResultFixture.estimatedCarbGrams,
    fatGrams: foodDetectionResultFixture.estimatedFatGrams
  };
  const totals = useMemo(() => applyServingMultiplier(baseNutrition, servings), [servings]);

  async function saveResult() {
    const pendingMeal = createPendingMealEntry({
      userId: foodDetectionResultFixture.userId,
      analysisId: foodDetectionResultFixture.id,
      mealName,
      servings,
      nutrition: {
        ...totals,
        ingredients: foodDetectionResultFixture.detectedFoods.map((food) => ({
          label: food.label,
          calories: totals.calories,
          proteinGrams: totals.proteinGrams,
          carbGrams: totals.carbGrams,
          fatGrams: totals.fatGrams,
          source: "database"
        })),
        sourceBreakdown: { databaseMatchedCount: 1, aiFallbackCount: 0 }
      },
      localImageUri: "file:///meal_001.jpg"
    });
    await saveMealEntryOnce(pendingMeal, async (meal) => meal);
    setSavedState("saved");
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>
        <Text style={styles.imageText}>{mealName}</Text>
      </View>
      <Text style={styles.title}>Nutrition Results</Text>
      <Text style={styles.metric}>{totals.calories} calories</Text>
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
      {foodDetectionResultFixture.requiresConfirmation ? <Text style={styles.prompt}>Confirm this estimate before saving.</Text> : null}
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
  );
}

const styles = StyleSheet.create({
  actionRow: { flexDirection: "row", gap: 12 },
  container: { backgroundColor: "#F8FAFC", gap: 18, padding: 20 },
  imagePreview: { alignItems: "center", backgroundColor: "#111827", height: 180, justifyContent: "center" },
  imageText: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  macro: { color: "#334155", fontWeight: "700" },
  macroRow: { flexDirection: "row", justifyContent: "space-between" },
  metric: { color: "#111827", fontSize: 28, fontWeight: "800" },
  primaryAction: { alignItems: "center", backgroundColor: "#16A34A", flex: 1, padding: 14 },
  primaryActionText: { color: "#FFFFFF", fontWeight: "800" },
  prompt: { color: "#B45309", fontWeight: "600" },
  savedText: { color: "#15803D", fontWeight: "700" },
  secondaryAction: { alignItems: "center", borderColor: "#94A3B8", borderWidth: 1, flex: 1, padding: 14 },
  secondaryActionText: { color: "#0F172A", fontWeight: "800" },
  servings: { color: "#111827", fontWeight: "700" },
  stepper: { alignItems: "center", flexDirection: "row", gap: 20 },
  stepperButton: { color: "#111827", fontSize: 24, fontWeight: "900", padding: 8 },
  title: { color: "#111827", fontSize: 20, fontWeight: "800" }
});