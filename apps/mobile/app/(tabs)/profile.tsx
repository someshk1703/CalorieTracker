import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.shell}>
      <View style={styles.avatar}><Text style={styles.avatarText}>JD</Text></View>
      <Text style={styles.name}>Jordan Doe</Text>
      <Text style={styles.subtitle}>Goal: lean muscle recomposition</Text>
      <View style={styles.card}><Text style={styles.cardTitle}>Today</Text><Text style={styles.metric}>1250 / 2500 calories</Text><Text style={styles.muted}>3 meals logged, one pending sync</Text></View>
      <View style={styles.card}><Text style={styles.cardTitle}>Privacy</Text><Text style={styles.muted}>Photos stay local unless you explicitly share or back them up.</Text></View>
      <Link asChild href="/compare-transformation"><Pressable style={styles.button}><Text style={styles.buttonText}>View Transformation</Text></Pressable></Link>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: "center", backgroundColor: "#59BFD5", borderRadius: 42, height: 84, justifyContent: "center", marginTop: 64, width: 84 },
  avatarText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  button: { alignItems: "center", backgroundColor: "#17131F", borderRadius: 24, marginTop: 18, padding: 16, width: "100%" },
  buttonText: { color: "#FFFFFF", fontWeight: "900" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 24, marginTop: 18, padding: 20, width: "100%" },
  cardTitle: { color: "#17131F", fontSize: 18, fontWeight: "900" },
  metric: { color: "#17131F", fontSize: 24, fontWeight: "900", marginTop: 8 },
  muted: { color: "#8A8591", fontWeight: "700", marginTop: 8 },
  name: { color: "#17131F", fontSize: 30, fontWeight: "900", marginTop: 18 },
  shell: { alignItems: "center", backgroundColor: "#FAF9F7", flex: 1, padding: 22 },
  subtitle: { color: "#8A8591", fontWeight: "800", marginTop: 8 }
});