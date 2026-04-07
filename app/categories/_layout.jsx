import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const CategoryPagelayout = () => {
  return (
    <>
      <StatusBar style={"dark"} />
      <Stack screenOptions={{ headerShown: true, headerTitleAlign: "center",headerStyle: { } }} />
    </>
  );
};

export default CategoryPagelayout;
