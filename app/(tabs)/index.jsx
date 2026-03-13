import { Image } from "expo-image";
import { View, FlatList, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import Text from "../../components/Text";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

export default function Home() {
  const [loaded] = useFonts({
    nunito: require("../../assets/fonts/Nunito-VariableFont_wght.ttf"),
  });
  const [greeting, setGreeting] = useState("Good Morning");
  if (!loaded) {
    return null;
  }

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      switch (true) {
        case hour < 12:
          setGreeting("Good Morning");
          break;
        case hour < 18:
          setGreeting("Good Afternoon");
          break;
        case hour >= 18:
          setGreeting("Good Evening");
          break;
      }
    };
    getGreeting();
  }, []);

  const categories = [
    { id: 1, name: "LTWC", icon: require("../../assets/images/Home/ltwc.png") },
    { id: 2, name: "DT", icon: require("../../assets/images/Home/dt.png") },
    { id: 3, name: "HTCT", icon: require("../../assets/images/Home/htct.png") },
    { id: 4, name: "LTCT", icon: require("../../assets/images/Home/ltct.png") },
    {
      id: 5,
      name: "Feeder",
      icon: require("../../assets/images/Home/feeder.png"),
    },
  ];
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ paddingHorizontal: 10 }}>
        {/* Header */}
        <View>
          <View>
            <Text styles={{ fontSize: 15, color: "#444" }} bold>
              {greeting},
            </Text>
            <Text styles={{ fontSize: 25 }} bold>
              Ajoy Das
            </Text>
          </View>
        </View>
        {/* Header End */}
        {/* categories */}
        <View style={{ marginTop: 10 }}>
          <Text
            bold
            styles={{ fontSize: 12, color: "#999", paddingVertical: 5 }}
          >
            Categories
          </Text>
          <FlatList
            data={categories}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Link href={`/categories/${item.name}`} asChild>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    margin: 4,
                    height: 100,
                    borderWidth: 0.2,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <>
                    <Image
                      source={item.icon}
                      style={{ width: 60, height: 60 }}
                    />
                    <Text style={{ fontSize: 16 }} bold>
                      {item.name}
                    </Text>
                  </>
                </TouchableOpacity>
              </Link>
            )}
          />
        </View>
        {/* categories end */}
      </View>
    </SafeAreaView>
  );
}
