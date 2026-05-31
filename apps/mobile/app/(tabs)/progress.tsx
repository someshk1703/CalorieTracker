import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export default function ProgressScreen() {
  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Progress</Text>
        <View style={styles.topGrid}>
          <View style={styles.statCard}>
            <Text style={styles.muted}>Your Weight</Text>
            <Text style={styles.bigStat}>132.1 lbs</Text>
            <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
            <Text style={styles.goal}>Goal 140 lbs</Text>
            <Pressable style={styles.darkButton}><Text style={styles.darkButtonText}>Log Weight</Text></Pressable>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.flame}>21</Text>
            <Text style={styles.orange}>Day Streak</Text>
            <Text style={styles.weekDots}>S M T W T F S</Text>
            <Text style={styles.checks}>● ● ○ ○ ○ ○ ○</Text>
          </View>
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}><Text style={styles.sectionTitle}>Weight Progress</Text><Text style={styles.goalPill}>80% of goal</Text></View>
          <Svg height={190} width="100%" viewBox="0 0 320 190">
            <Path d="M18 152 C42 112 55 140 72 98 C94 132 110 140 132 126 C154 112 158 94 176 100 C190 104 194 48 214 76 C234 106 250 50 276 58 C294 64 300 34 314 28" fill="none" stroke="#59C49A" strokeWidth={4} />
            <Path d="M214 76 C234 106 250 50 276 58 C294 64 300 34 314 28" fill="none" stroke="#17131F" strokeWidth={4} />
            <Circle cx={214} cy={76} fill="#FFFFFF" r={7} stroke="#59C49A" strokeWidth={4} />
          </Svg>
          <View style={styles.rangeRow}><Text>90D</Text><Text style={styles.selectedRange}>6M</Text><Text>1Y</Text><Text>ALL</Text></View>
          <Text style={styles.goodNews}>Great job! Consistency is key, and you are mastering it!</Text>
        </View>
        <View style={styles.averageCard}><Text style={styles.sectionTitle}>Daily Average Calories</Text><Text style={styles.avgValue}>2861 <Text style={styles.green}>+90%</Text></Text></View>
        <Link asChild href="/compare-transformation"><Pressable style={styles.compareButton}><Text style={styles.compareText}>Open Transformation Compare</Text></Pressable></Link>
      </ScrollView>
      <Link asChild href="/scan"><Pressable style={styles.fab}><Text style={styles.fabText}>+</Text></Pressable></Link>
    </View>
  );
}

const styles = StyleSheet.create({
  averageCard: { backgroundColor: "#FFFFFF", borderRadius: 24, marginTop: 20, padding: 20 },
  avgValue: { color: "#17131F", fontSize: 34, fontWeight: "900", marginTop: 8 },
  bigStat: { color: "#17131F", fontSize: 24, fontWeight: "900" },
  chartCard: { backgroundColor: "#FFFFFF", borderRadius: 28, marginTop: 18, padding: 18 },
  chartHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  checks: { color: "#F0A33A", fontWeight: "900", marginTop: 10 },
  compareButton: { alignItems: "center", backgroundColor: "#17131F", borderRadius: 24, marginTop: 18, padding: 16 },
  compareText: { color: "#FFFFFF", fontWeight: "900" },
  content: { padding: 22, paddingBottom: 120, paddingTop: 52 },
  darkButton: { backgroundColor: "#17131F", borderRadius: 16, marginTop: 14, padding: 12 },
  darkButtonText: { color: "#FFFFFF", fontWeight: "800" },
  fab: { alignItems: "center", backgroundColor: "#17131F", borderRadius: 30, bottom: 28, height: 60, justifyContent: "center", position: "absolute", right: 24, width: 60 },
  fabText: { color: "#FFFFFF", fontSize: 34, fontWeight: "700" },
  flame: { color: "#F0A33A", fontSize: 38, fontWeight: "900", textAlign: "center" },
  goal: { color: "#8A8591", fontWeight: "700" },
  goalPill: { backgroundColor: "#F4F2F5", borderRadius: 16, color: "#8A8591", fontWeight: "800", paddingHorizontal: 10, paddingVertical: 6 },
  goodNews: { backgroundColor: "#EFFFF7", borderRadius: 14, color: "#35B982", fontWeight: "800", padding: 10 },
  green: { color: "#35B982", fontSize: 18 },
  muted: { color: "#8A8591", fontWeight: "700", textAlign: "center" },
  orange: { color: "#F0A33A", fontSize: 16, fontWeight: "900", textAlign: "center" },
  progressFill: { backgroundColor: "#17131F", borderRadius: 4, height: 7, width: "55%" },
  progressTrack: { backgroundColor: "#E6E1EA", borderRadius: 4, height: 7, marginVertical: 10 },
  rangeRow: { alignItems: "center", backgroundColor: "#F4F2F5", borderRadius: 18, flexDirection: "row", justifyContent: "space-around", padding: 8 },
  sectionTitle: { color: "#17131F", fontSize: 19, fontWeight: "900" },
  selectedRange: { backgroundColor: "#FFFFFF", borderRadius: 14, fontWeight: "900", overflow: "hidden", paddingHorizontal: 24, paddingVertical: 6 },
  shell: { backgroundColor: "#FAF9F7", flex: 1 },
  statCard: { backgroundColor: "#FFFFFF", borderRadius: 24, flex: 1, padding: 18 },
  title: { color: "#17131F", fontSize: 30, fontWeight: "900" },
  topGrid: { flexDirection: "row", gap: 14, marginTop: 20 },
  weekDots: { color: "#8A8591", fontWeight: "800", marginTop: 16, textAlign: "center" }
});