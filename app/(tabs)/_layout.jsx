import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const layout = () => {
  return (
      <Tabs screenOptions={{
        headerShown:false
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <AntDesign name="home" color={"#000"} size={20} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: () => (
            <AntDesign name="setting" color={"#000"} size={20} />
          ),
        }}
      />
    </Tabs>
  );
};

export default layout;
