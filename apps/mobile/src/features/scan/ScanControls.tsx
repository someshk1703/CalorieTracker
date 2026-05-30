import { Pressable, StyleSheet, Text, View } from "react-native";

export type ScanMode = "camera" | "photo_import";

export interface ScanControlsProps {
  mode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
  onCapture: () => void;
  onImport: () => void;
}

export function ScanControls({ mode, onModeChange, onCapture, onImport }: ScanControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.segmentedControl}>
        <Pressable
          accessibilityLabel="Use camera mode"
          onPress={() => onModeChange("camera")}
          style={[styles.segment, mode === "camera" && styles.activeSegment]}
        >
          <Text style={styles.segmentText}>Camera</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Use photo import mode"
          onPress={() => onModeChange("photo_import")}
          style={[styles.segment, mode === "photo_import" && styles.activeSegment]}
        >
          <Text style={styles.segmentText}>Gallery</Text>
        </Pressable>
      </View>
      <Pressable accessibilityLabel="Capture meal" onPress={onCapture} style={styles.primaryAction}>
        <Text style={styles.primaryActionText}>Scan Meal</Text>
      </Pressable>
      <Pressable accessibilityLabel="Import meal photo" onPress={onImport} style={styles.secondaryAction}>
        <Text style={styles.secondaryActionText}>Import Photo</Text>
      </Pressable>
    </View>
  );
}

export function FoodLabelOverlay({ labels }: { labels: string[] }) {
  return (
    <View style={styles.overlay}>
      {labels.map((label) => (
        <Text key={label} style={styles.overlayLabel}>
          {label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  activeSegment: { backgroundColor: "#111827" },
  container: { gap: 12, padding: 16 },
  overlay: { gap: 8, position: "absolute", top: 24, left: 24 },
  overlayLabel: { backgroundColor: "#111827", color: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 6 },
  primaryAction: { alignItems: "center", backgroundColor: "#16A34A", padding: 14 },
  primaryActionText: { color: "#FFFFFF", fontWeight: "700" },
  secondaryAction: { alignItems: "center", borderColor: "#CBD5E1", borderWidth: 1, padding: 14 },
  secondaryActionText: { color: "#0F172A", fontWeight: "600" },
  segment: { flex: 1, alignItems: "center", padding: 10 },
  segmentedControl: { borderColor: "#CBD5E1", borderWidth: 1, flexDirection: "row" },
  segmentText: { color: "#FFFFFF", fontWeight: "600" }
});