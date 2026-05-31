import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const days = [
  { day: "Sun", date: "10", state: "missed" },
  { day: "Mon", date: "11", state: "neutral" },
  { day: "Tue", date: "12", state: "hit" },
  { day: "Wed", date: "13", state: "active" },
  { day: "Thu", date: "14", state: "neutral" },
  { day: "Fri", date: "15", state: "neutral" },
  { day: "Sat", date: "16", state: "neutral" }
];

const macros = [
  { label: "Protein", value: "75", goal: "150g", color: "#EF6B6B" },
  { label: "Carbs", value: "138", goal: "275g", color: "#E6A15D" },
  { label: "Fat", value: "35", goal: "70g", color: "#5B9DEB" }
];

export default function HomeScreen() {
  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>Cal AI</Text>
          <View style={styles.streak}><Text style={styles.streakText}>15</Text></View>
        </View>

        <View style={styles.weekRow}>
          {days.map((item) => (
            <View key={item.day} style={styles.dayItem}>
              <Text style={styles.dayLabel}>{item.day}</Text>
              <View style={[styles.dateCircle, item.state === "active" && styles.activeDate, item.state === "hit" && styles.hitDate, item.state === "missed" && styles.missedDate]}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.calorieCard}>
          <View>
            <Text style={styles.calorieValue}>1250<Text style={styles.calorieGoal}>/2500</Text></Text>
            <Text style={styles.muted}>Calories eaten</Text>
          </View>
          <View style={styles.ring}><Text style={styles.ringText}>50%</Text></View>
        </View>

        <View style={styles.macroRow}>
          {macros.map((macro) => (
            <View key={macro.label} style={styles.macroCard}>
              <Text style={styles.macroValue}>{macro.value}<Text style={styles.macroGoal}>/{macro.goal}</Text></Text>
              <Text style={styles.macroLabel}>{macro.label} eaten</Text>
              <View style={[styles.miniRing, { borderColor: macro.color }]} />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recently uploaded</Text>
        <View style={styles.mealCard}>
          <View style={styles.mealImage}><Text style={styles.mealEmoji}>S</Text></View>
          <View style={styles.mealBody}>
            <Text style={styles.mealTime}>12:37pm</Text>
            <Text style={styles.mealTitle}>Grilled Salmon</Text>
            <Text style={styles.mealCalories}>550 Calories</Text>
            <Text style={styles.mealMacros}>35g protein  40g carbs  28g fat</Text>
          </View>
        </View>
      </ScrollView>
      <Link asChild href="/scan"><Pressable accessibilityLabel="Open food scanner" style={styles.fab}><Text style={styles.fabText}>+</Text></Pressable></Link>
    </View>
  );
}

const styles = StyleSheet.create({
  activeDate: { borderColor: "#17131F", borderWidth: 2 },
  brand: { color: "#17131F", fontSize: 28, fontWeight: "900" },
  calorieCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 28, elevation: 4, flexDirection: "row", justifyContent: "space-between", marginTop: 22, padding: 28, shadowColor: "#17131F", shadowOpacity: 0.1, shadowRadius: 20 },
  calorieGoal: { color: "#9A96A1", fontSize: 24, fontWeight: "600" },
  calorieValue: { color: "#17131F", fontSize: 46, fontWeight: "900" },
  content: { padding: 22, paddingBottom: 120 },
  dateCircle: { alignItems: "center", borderColor: "#ECE9EF", borderRadius: 18, borderWidth: 1, height: 36, justifyContent: "center", width: 36 },
  dateText: { color: "#17131F", fontWeight: "800" },
  dayItem: { alignItems: "center", gap: 8 },
  dayLabel: { color: "#9A96A1", fontSize: 12, fontWeight: "700" },
  fab: { alignItems: "center", backgroundColor: "#17131F", borderRadius: 30, bottom: 28, height: 60, justifyContent: "center", position: "absolute", right: 24, width: 60 },
  fabText: { color: "#FFFFFF", fontSize: 34, fontWeight: "700" },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingTop: 36 },
  hitDate: { borderColor: "#75CB74", borderWidth: 2 },
  macroCard: { backgroundColor: "#FFFFFF", borderRadius: 22, flex: 1, gap: 6, padding: 14 },
  macroGoal: { color: "#A9A4AF", fontSize: 12, fontWeight: "700" },
  macroLabel: { color: "#9A96A1", fontSize: 11, fontWeight: "700" },
  macroRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  macroValue: { color: "#17131F", fontSize: 18, fontWeight: "900" },
  mealBody: { flex: 1, gap: 4 },
  mealCalories: { color: "#17131F", fontSize: 18, fontWeight: "900" },
  mealCard: { backgroundColor: "#FFFFFF", borderRadius: 24, flexDirection: "row", gap: 14, padding: 12 },
  mealEmoji: { color: "#FFFFFF", fontSize: 34, fontWeight: "900" },
  mealImage: { alignItems: "center", backgroundColor: "#D98954", borderRadius: 18, height: 100, justifyContent: "center", width: 100 },
  mealMacros: { color: "#8A8591", fontWeight: "700" },
  mealTime: { alignSelf: "flex-end", color: "#9A96A1", fontSize: 12, fontWeight: "700" },
  mealTitle: { color: "#17131F", fontSize: 16, fontWeight: "800" },
  miniRing: { borderRadius: 22, borderWidth: 5, height: 44, marginTop: 8, width: 44 },
  missedDate: { borderColor: "#E66D6D", borderWidth: 2 },
  muted: { color: "#9A96A1", fontWeight: "700" },
  ring: { alignItems: "center", borderColor: "#17131F", borderLeftColor: "#ECE9EF", borderRadius: 48, borderWidth: 8, height: 96, justifyContent: "center", width: 96 },
  ringText: { color: "#17131F", fontWeight: "900" },
  sectionTitle: { color: "#17131F", fontSize: 20, fontWeight: "900", marginBottom: 14, marginTop: 30 },
  shell: { backgroundColor: "#FAF9F7", flex: 1 },
  streak: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 },
  streakText: { color: "#17131F", fontWeight: "900" },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 }
});