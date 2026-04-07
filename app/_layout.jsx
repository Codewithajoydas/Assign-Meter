import { Redirect, Stack, Tabs } from "expo-router";
import { Provider } from "react-native-paper";
import { PaperProvider, MD3LightTheme } from "react-native-paper";

export default function RootLayout() {
  return (
      <Stack screenOptions={{ headerShown: false }}></Stack>
  );
}
