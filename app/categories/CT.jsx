import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Image } from "expo-image";

const CT = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Image
        source={require("../../assets/images/undraw_code-contribution_8k0x.svg")}
        style={{ width: "50%", height: 170, objectFit: "contain" }}
      />
      <Text style={{ textAlign: "center", fontWeight: "bold" }}>
        This screen is under development.
      </Text>
    </View>
  );
};

export default CT;
