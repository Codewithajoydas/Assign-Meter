import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/Text";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
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
      if (name) {
        setUserName(JSON.parse(name).name);
      }
    };

    getName();
  }, []);

  const categories = [
    { id: 1, name: "METER", label: "Meter", icon: "meter-electric" },
    { id: 2, name: "CT", label: "CT", icon: "current-ac" },
    { id: 3, name: "NIC", label: "NIC", icon: "chip" },
    { id: 4, name: "PT", label: "PT", icon: "flash" },
    { id: 5, name: "SIM", label: "SIM", icon: "sim" },
    { id: 5, name: "SEAL", label: "SEAL", icon: "lock" },
    {
      id: 6,
      name: "AssignLocation",
      label: "Assign Location",
      icon: "location-enter",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 0 }}>
          <Image
            source={require("../../assets/images/image.png")}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text styles={styles.greeting}>{greeting},</Text>
            <Text styles={styles.username} bold>
              {userName}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.replace("/meterStatus")}>
          <MaterialCommunityIcons name="magnify" size={30} color="#2C6BED" />
        </TouchableOpacity>
      </View>

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
          renderItem={({ item }) => (
            <Link href={`/categories/${item.name}`} asChild>
              <TouchableOpacity style={styles.card}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={40}
                    color="#2C6BED"
                  />
                </View>

                <Text bold styles={styles.cardText}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        />
        <BannerAd
          unitId={"ca-app-pub-8386909400947159/3079799956"}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 10,
    marginBottom: 25,
  },

  greeting: {
    fontSize: 14,
    color: "#666",
  },

  username: {
    fontSize: 18,
  },

  categorySection: {
    flex: 1,
  },

  categoryTitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },

  iconBox: {
    backgroundColor: "#F2F4F7",
    padding: 12,
    borderRadius: 12,
    marginBottom: 6,
  },

  icon: {
    width: 40,
    height: 40,
  },

  cardText: {
    fontSize: 15,
  },
});
