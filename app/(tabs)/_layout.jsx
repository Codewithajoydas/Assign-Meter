// app/(tabs)/_layout.jsx

import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#3E7CA6",
          tabBarInactiveTintColor: "#9AA5B1",
          tabBarStyle: [
            styles.tabBar,
            {
              height: 56 + insets.bottom,
              paddingBottom: Math.max(insets.bottom, 8),
            },
          ],
          tabBarLabelStyle: styles.label,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="meterStatus"
          options={{
            title: "Meter Status",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="aim" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="unmappedReports"
          options={{
            title: "Unmapped",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="alert" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FAFAFA",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5E5",
    paddingTop: 6,
  },
  tabItem: {
    paddingVertical: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },
});