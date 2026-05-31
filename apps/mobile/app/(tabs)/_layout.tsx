import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#17131F",
        tabBarInactiveTintColor: "#8A8591",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: "#17131F",
          shadowOpacity: 0.12,
          shadowRadius: 18
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <TabIcon color={color} label="H" /> }} />
      <Tabs.Screen name="progress" options={{ title: "Progress", tabBarIcon: ({ color }) => <TabIcon color={color} label="P" /> }} />
      <Tabs.Screen name="groups" options={{ title: "Groups", tabBarIcon: ({ color }) => <TabIcon color={color} label="G" /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <TabIcon color={color} label="JD" /> }} />
      <Tabs.Screen name="scan" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({ color, label }: { color: string; label: string }) {
  return <Text style={{ color, fontSize: 13, fontWeight: "900" }}>{label}</Text>;
}