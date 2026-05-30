import { Pressable, StyleSheet, Text, View } from "react-native";

export type ScanMode = "camera" | "photo_import";

export interface ScanControlsProps {
  mode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
  onCapture: () => void;
  onImport: () => void;
  disabled?: boolean;
}

export function ScanControls({ mode, onModeChange, onCapture, onImport, disabled = false }: ScanControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.segmentedControl}>
        <Pressable
          accessibilityLabel="Use camera mode"
          disabled={disabled}
          onPress={() => onModeChange("camera")}
          style={[styles.segment, mode === "camera" && styles.activeSegment]}
        >
          <Text style={[styles.segmentText, mode === "camera" && styles.activeSegmentText]}>Camera</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Use photo import mode"
          disabled={disabled}
          onPress={() => onModeChange("photo_import")}
          style={[styles.segment, mode === "photo_import" && styles.activeSegment]}
        >
          <Text style={[styles.segmentText, mode === "photo_import" && styles.activeSegmentText]}>Gallery</Text>
        </Pressable>
      </View>
      <Pressable accessibilityLabel="Capture meal" disabled={disabled} onPress={onCapture} style={[styles.primaryAction, disabled && styles.disabledAction]}>
        <Text style={styles.primaryActionText}>Scan Meal</Text>
      </Pressable>
      <Pressable accessibilityLabel="Import meal photo" disabled={disabled} onPress={onImport} style={[styles.secondaryAction, disabled && styles.disabledAction]}>
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
  activeSegmentText: { color: "#FFFFFF" },
  container: { gap: 12, padding: 16 },
  disabledAction: { opacity: 0.55 },
  overlay: { gap: 8, position: "absolute", top: 24, left: 24 },
  overlayLabel: { backgroundColor: "#111827", color: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 6 },
  primaryAction: { alignItems: "center", backgroundColor: "#16A34A", padding: 14 },
  primaryActionText: { color: "#FFFFFF", fontWeight: "700" },
  secondaryAction: { alignItems: "center", borderColor: "#CBD5E1", borderWidth: 1, padding: 14 },
  secondaryActionText: { color: "#0F172A", fontWeight: "600" },
  segment: { flex: 1, alignItems: "center", padding: 10 },
  segmentedControl: { borderColor: "#CBD5E1", borderWidth: 1, flexDirection: "row" },
  segmentText: { color: "#0F172A", fontWeight: "600" }
});