// app/(tabs)/index.jsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/Text";

const greetingIcons = {
  "Good Morning": "weather-sunny",
  "Good Afternoon": "weather-partly-cloudy",
  "Good Evening": "weather-night",
};

// Fré Sonneveld — "black transmission towers under green sky", Unsplash
// https://unsplash.com/photos/black-transmission-towers-under-green-sky-q6n8nIrDQHE
const HEADER_BG =
  "https://images.unsplash.com/photo-1574173799345-e672ea143892?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Home() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Good Morning");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };
    getGreeting();

    const getName = async () => {
      const name = await SecureStore.getItemAsync("userData");
      if (name) setUserName(JSON.parse(name).name);
    };
    getName();
  }, []);

  const categories = [
    { id: 1, name: "METER", label: "Meter", icon: "meter-electric" },
    { id: 2, name: "CT", label: "CT", icon: "current-ac" },
    { id: 3, name: "NIC", label: "NIC", icon: "chip" },
    { id: 4, name: "PT", label: "PT", icon: "flash" },
    { id: 5, name: "SIM", label: "SIM", icon: "sim" },
    { id: 6, name: "SEAL", label: "SEAL", icon: "lock" },
    {
      id: 7,
      name: "AssignLocation",
      label: "Assign Location",
      icon: "location-enter",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Hero background behind header only */}
      <ImageBackground
        source={{ uri: HEADER_BG }}
        style={styles.hero}
        contentFit="cover"
      >
        <LinearGradient
          colors={[
            "rgba(11,18,32,0.75)",
            "rgba(11,18,32,0.35)",
            "rgba(246,247,249,1)",
          ]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={["top"]} style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarRing}>
              <Image
                source={require("../../assets/images/image.png")}
                style={styles.avatar}
              />
            </View>
            <View style={{ marginLeft: 12 }}>
              <View style={styles.greetingRow}>
                <MaterialCommunityIcons
                  name={greetingIcons[greeting]}
                  size={14}
                  color="#E6E9EF"
                />
                <Text styles={styles.greeting}>{greeting}</Text>
              </View>
              <Text styles={styles.username} bold>
                {userName}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => router.replace("/meterStatus")}
          >
            <MaterialCommunityIcons name="magnify" size={22} color="#3E7CA6" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      {/* Categories */}
      <View style={styles.categorySection}>
        <Text styles={styles.categoryTitle} bold>
          Categories
        </Text>
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Link href={`/categories/${item.name}`} asChild>
              <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={30}
                    color="#3E7CA6"
                  />
                </View>
                <Text bold styles={styles.cardText}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      </View>
    </View>
  );
}

const BG = "#F6F7F9";
const SURFACE = "#FFFFFF";
const INK = "#2B3240";
const INK_SOFT = "#5B6472";
const ACCENT = "#3E7CA6";
const ACCENT_SOFT_BG = "#E9F1F6";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  hero: {
    width: "100%",
    paddingBottom: 28,
    height: 180,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  greeting: {
    fontSize: 13,
    color: "#E6E9EF",
  },

  username: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 2,
  },

  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: SURFACE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  categorySection: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -8,
  },

  categoryTitle: {
    fontSize: 13,
    color: INK_SOFT,
    marginBottom: 12,
  },

  card: {
    flex: 1,
    backgroundColor: SURFACE,
    marginBottom: 12,
    height: 118,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1A2333",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  iconBox: {
    backgroundColor: ACCENT_SOFT_BG,
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    color: INK,
  },
});
