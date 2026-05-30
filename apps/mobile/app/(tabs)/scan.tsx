import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FoodLabelOverlay, ScanControls, type ScanMode } from "../../src/features/scan/ScanControls";
import { useMealAnalysis } from "../../src/features/scan/useMealAnalysis";

export default function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>("camera");
  const { state, analyzeMeal } = useMealAnalysis("test-token");
  const labels = state.status === "succeeded" ? state.result.detectedFoods.map((food) => food.label) : [];

  return (
    <View style={styles.screen}>
      <View style={styles.preview}>
        <Text style={styles.previewText}>{state.status === "loading" ? "Analyzing" : "Frame your meal"}</Text>
        <FoodLabelOverlay labels={labels} />
      </View>
      {state.status === "failed" ? <Text style={styles.errorText}>{state.message}</Text> : null}
      <ScanControls mode={mode} onCapture={() => analyzeMeal(mode)} onImport={() => analyzeMeal("photo_import")} onModeChange={setMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: { color: "#B91C1C", paddingHorizontal: 16 },
  preview: { alignItems: "center", backgroundColor: "#0F172A", flex: 1, justifyContent: "center" },
  previewText: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  screen: { backgroundColor: "#F8FAFC", flex: 1 }
});