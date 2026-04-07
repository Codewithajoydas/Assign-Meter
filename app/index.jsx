import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        setIsLoggedIn(Boolean(token));
      } catch (err) {
        console.log("SecureStore error:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/Login" />;
  }
  return <Redirect href={"/(tabs)"} />;
};

export default Index;