import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
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
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("token");
          router.replace("/Login");
        },
      },
    ]);
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const menuItems = [
    { icon: "settings", label: "General Settings" },
    { icon: "info", label: "App Information" },
    { icon: "shield", label: "Security" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Settings</Text>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>
        </View>

        {/* MENU SECTION */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.menuGroup}>
          {menuItems.map((item, index) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.menuItem} disabled>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconWrap}>
                    <Feather name={item.icon} size={17} color="#8A93A3" />
                  </View>
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Soon</Text>
                </View>
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <TouchableOpacity style={styles.logoutCard} onPress={logout} activeOpacity={0.8}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconWrap, styles.logoutIconWrap]}>
              <Feather name="log-out" size={17} color="#E5484D" />
            </View>
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#C6CBD3" />
        </TouchableOpacity>

        <Text style={styles.versionText}>v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2C6BED",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF1FE",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C6BED",
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9AA5B1",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },

  menuGroup: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F5F6F8",
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 15,
    color: "#5A6270",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 62,
  },
  comingSoonBadge: {
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9AA5B1",
  },

  logoutCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  logoutIconWrap: {
    backgroundColor: "#FDEAEA",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E5484D",
  },

  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#B0B5BD",
    marginTop: 24,
  },
});

export default Settings;