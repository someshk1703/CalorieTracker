import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export interface CorrectionFormProps {
  initialMealName: string;
  onSubmit: (mealName: string) => void;
}

export function CorrectionForm({ initialMealName, onSubmit }: CorrectionFormProps) {
  const [mealName, setMealName] = useState(initialMealName);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meal name</Text>
      <TextInput accessibilityLabel="Corrected meal name" onChangeText={setMealName} style={styles.input} value={mealName} />
      <Pressable onPress={() => onSubmit(mealName)} style={styles.action}>
        <Text style={styles.actionText}>Apply Fix</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  action: { alignItems: "center", backgroundColor: "#111827", padding: 12 },
  actionText: { color: "#FFFFFF", fontWeight: "700" },
  container: { gap: 8 },
  input: { borderColor: "#CBD5E1", borderWidth: 1, padding: 10 },
  label: { color: "#334155", fontWeight: "600" }
});