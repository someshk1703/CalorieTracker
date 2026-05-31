import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const members = ["31", "24", "12", "11", "2"];

export default function GroupsScreen() {
  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.groupName}>Shred Squad</Text><Text style={styles.filter}>Sliders</Text></View>
        <View style={styles.memberRow}>{members.map((score, index) => <View key={score} style={styles.member}><View style={[styles.avatar, index === 3 && styles.goldAvatar]}><Text style={styles.avatarText}>{index === 3 ? "V" : ""}</Text></View><Text style={styles.score}>{score}</Text></View>)}</View>
        <View style={styles.postCard}>
          <View style={styles.postHeader}><View style={styles.smallAvatar} /><View><Text style={styles.author}>Cole Belvins</Text><Text style={styles.time}>Today at 3:49pm</Text></View><Text style={styles.more}>...</Text></View>
          <Text style={styles.postTitle}>Grilled Chicken with Avocado, Garlic Spinach, and Toast</Text>
          <View style={styles.foodPhoto}><Text style={styles.foodLetter}>C</Text></View>
          <View style={styles.nutritionRow}><Text style={styles.nutrition}>480 cal</Text><Text style={styles.nutrition}>38g protein</Text><Text style={styles.nutrition}>23g carbs</Text><Text style={styles.nutrition}>24g fats</Text></View>
          <View style={styles.actionRow}><Text style={styles.reaction}>Fire 4</Text><Text style={styles.comment}>Comment 2</Text></View>
        </View>
        <View style={styles.postCard}><Text style={styles.author}>Devin Carroll</Text><Text style={styles.postTitle}>Kept it clean today. Turkey bowl with greens and rice.</Text></View>
      </ScrollView>
      <Link asChild href="/scan"><Pressable style={styles.fab}><Text style={styles.fabText}>+</Text></Pressable></Link>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: { borderTopColor: "#F0EEF2", borderTopWidth: 1, flexDirection: "row", justifyContent: "space-around", marginTop: 14, paddingTop: 14 },
  author: { color: "#17131F", fontWeight: "900" },
  avatar: { backgroundColor: "#D9D4DD", borderRadius: 28, height: 56, width: 56 },
  avatarText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", textAlign: "center", top: 15 },
  comment: { color: "#8A8591", fontWeight: "800" },
  content: { padding: 22, paddingBottom: 120, paddingTop: 52 },
  fab: { alignItems: "center", backgroundColor: "#17131F", borderRadius: 30, bottom: 28, height: 60, justifyContent: "center", position: "absolute", right: 24, width: 60 },
  fabText: { color: "#FFFFFF", fontSize: 34, fontWeight: "700" },
  filter: { backgroundColor: "#FFFFFF", borderRadius: 18, color: "#17131F", fontWeight: "900", padding: 12 },
  foodLetter: { color: "#FFFFFF", fontSize: 48, fontWeight: "900" },
  foodPhoto: { alignItems: "center", backgroundColor: "#92A56A", borderRadius: 20, height: 260, justifyContent: "center", marginTop: 12 },
  goldAvatar: { backgroundColor: "#9B6A33" },
  groupName: { backgroundColor: "#FFFFFF", borderRadius: 20, color: "#17131F", fontSize: 18, fontWeight: "900", paddingHorizontal: 18, paddingVertical: 12 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  member: { alignItems: "center", gap: 6 },
  memberRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 22 },
  more: { color: "#8A8591", fontSize: 22, marginLeft: "auto" },
  nutrition: { color: "#17131F", fontSize: 12, fontWeight: "800" },
  nutritionRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12 },
  postCard: { backgroundColor: "#FFFFFF", borderRadius: 24, marginBottom: 18, padding: 16 },
  postHeader: { alignItems: "center", flexDirection: "row", gap: 10 },
  postTitle: { color: "#17131F", fontSize: 18, fontWeight: "900", lineHeight: 24, marginTop: 12 },
  reaction: { borderColor: "#17131F", borderRadius: 14, borderWidth: 1, color: "#17131F", fontWeight: "900", paddingHorizontal: 14, paddingVertical: 4 },
  score: { backgroundColor: "#FFFFFF", borderRadius: 12, color: "#17131F", fontSize: 12, fontWeight: "900", overflow: "hidden", paddingHorizontal: 8, paddingVertical: 3 },
  shell: { backgroundColor: "#FAF9F7", flex: 1 },
  smallAvatar: { backgroundColor: "#6FB18F", borderRadius: 18, height: 36, width: 36 },
  time: { color: "#8A8591", fontSize: 12, fontWeight: "700" }
});