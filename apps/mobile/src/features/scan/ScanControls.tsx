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
        <View style={styles.segment}>
          <Text style={styles.segmentText}>Barcode</Text>
        </View>
        <View style={styles.segment}>
          <Text style={styles.segmentText}>Food Label</Text>
        </View>
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
  container: { backgroundColor: "#111827", gap: 12, padding: 16 },
  disabledAction: { opacity: 0.55 },
  overlay: { gap: 8, position: "absolute", top: 24, left: 24 },
  overlayLabel: { backgroundColor: "#FFFFFF", borderRadius: 18, color: "#17131F", fontWeight: "900", paddingHorizontal: 14, paddingVertical: 8 },
  primaryAction: { alignItems: "center", alignSelf: "center", backgroundColor: "#FFFFFF", borderRadius: 34, height: 68, justifyContent: "center", padding: 14, width: 68 },
  primaryActionText: { color: "#17131F", fontWeight: "900" },
  secondaryAction: { alignItems: "center", alignSelf: "center", borderColor: "rgba(255,255,255,0.22)", borderRadius: 18, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 10 },
  secondaryActionText: { color: "#FFFFFF", fontWeight: "800" },
  segment: { alignItems: "center", borderRadius: 16, flex: 1, padding: 10 },
  segmentedControl: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 20, flexDirection: "row", gap: 6, padding: 6 },
  segmentText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" }
});