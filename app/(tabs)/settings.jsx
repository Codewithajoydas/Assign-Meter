import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const Settings = () => {
  const user = {
    name: "Ajoy Das",
    role: "Field Engineer",
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logged out", "Successfully logged out", [
      {
        text: "OK",
        onPress: () => router.replace("/Login"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* USER INFO */}
      <View style={styles.userBox}>
        <Feather name="user" size={26} color="#2C6BED" />
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>
      </View>

      {/* DISABLED SETTINGS */}
      <TouchableOpacity style={styles.disabledItem} disabled>
        <Text style={styles.disabledText}>General Settings</Text>
        <Feather name="lock" size={16} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.disabledItem} disabled>
        <Text style={styles.disabledText}>App Information</Text>
        <Feather name="lock" size={16} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.disabledItem} disabled>
        <Text style={styles.disabledText}>Security</Text>
        <Feather name="lock" size={16} color="#999" />
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Feather name="log-out" size={20} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 16,
  },

  userBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 10,
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
  },

  userRole: {
    color: "#666",
    fontSize: 13,
  },

  disabledItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 6,
    marginTop: 10,
    opacity: 0.5,
  },

  disabledText: {
    fontSize: 16,
  },

  logout: {
    marginTop: 40,
    backgroundColor: "#2C6BED",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  logoutText: {
    color: "white",
    fontSize: 16,
  },
});

export default Settings;
