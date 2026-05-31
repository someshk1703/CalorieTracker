import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function CompareTransformationScreen() {
  const [hideWeight, setHideWeight] = useState(false);
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.shell}>
      <Text style={styles.title}>Compare</Text>
      <View style={styles.photoRow}>
        <View style={styles.before}><Text style={styles.photoLabel}>{hideWeight ? "Before" : "355 lbs"}</Text><Text style={styles.photoDate}>Sep 20, 2023</Text></View>
        <View style={styles.after}><Text style={styles.photoLabel}>{hideWeight ? "After" : "182 lbs"}</Text><Text style={styles.photoDate}>Jul 7, 2025</Text></View>
      </View>
      <View style={styles.toggleRow}><Text style={styles.toggleLabel}>Hide weight</Text><Pressable accessibilityRole="switch" onPress={() => setHideWeight((value) => !value)} style={[styles.switch, hideWeight && styles.switchOn]}><View style={[styles.knob, hideWeight && styles.knobOn]} /></Pressable></View>
      <View style={styles.carousel}>{[0, 1, 2, 3, 4, 5].map((item) => <View key={item} style={[styles.thumb, item === 4 && styles.selectedThumb]} />)}</View>
      <Pressable style={styles.share}><Text style={styles.shareText}>Share</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  after: { backgroundColor: "#9FAD91", borderColor: "#FFFFFF", borderRadius: 16, borderWidth: 2, flex: 1, justifyContent: "flex-end", padding: 16 },
  before: { backgroundColor: "#D6B494", borderRadius: 16, flex: 1, justifyContent: "flex-end", padding: 16 },
  carousel: { flexDirection: "row", gap: 10, marginTop: 34 },
  content: { padding: 22, paddingBottom: 44, paddingTop: 58 },
  knob: { backgroundColor: "#FFFFFF", borderRadius: 15, height: 30, width: 30 },
  knobOn: { transform: [{ translateX: 25 }] },
  photoDate: { color: "#FFFFFF", fontWeight: "800", textAlign: "center" },
  photoLabel: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", textAlign: "center" },
  photoRow: { flexDirection: "row", gap: 8, height: 380, marginTop: 38 },
  selectedThumb: { borderColor: "#17131F", borderWidth: 2 },
  share: { alignItems: "center", backgroundColor: "#17131F", borderRadius: 28, marginTop: 30, padding: 18 },
  shareText: { color: "#FFFFFF", fontSize: 17, fontWeight: "900" },
  shell: { backgroundColor: "#FAF9F7", flex: 1 },
  switch: { backgroundColor: "#F0EEF2", borderRadius: 18, padding: 3, width: 60 },
  switchOn: { backgroundColor: "#17131F" },
  thumb: { backgroundColor: "#D8D2DC", borderRadius: 10, height: 58, width: 44 },
  title: { color: "#17131F", fontSize: 18, fontWeight: "900", textAlign: "center" },
  toggleLabel: { color: "#17131F", fontSize: 16, fontWeight: "800" },
  toggleRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 28 }
});