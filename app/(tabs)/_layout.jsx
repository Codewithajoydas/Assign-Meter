import { Redirect, Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import Text from "../../components/Text";
export default function Layout() {

  return (
    <>
      <StatusBar style={"dark"} />
        <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#777",
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <AntDesign
                  name="home"
                  size={22}
                  color={focused ? "#2563EB" : "#777"}
                />
                {focused && <Text bold styles={styles.label}>Home</Text>}
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="meterStatus"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <AntDesign
                  name="aim"
                  size={22}
                  color={focused ? "#2563EB" : "#777"}
                />
                {focused && <Text bold styles={styles.label}>Meter Status</Text>}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <AntDesign
                  name="setting"
                  size={22}
                  color={focused ? "#2563EB" : "#777"}
                />
                {focused && <Text bold styles={styles.label}>Settings</Text>}
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
  },
  
  tabItem: {
    marginTop:8,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height:40,
  },

  label: {
    fontSize: 12,
    marginTop: 2,
    color: "#2563EB",
  },
});
