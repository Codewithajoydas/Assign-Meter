import { useEffect } from "react";
import { Stack } from "expo-router";
import {
  AppOpenAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { StatusBar } from "expo-status-bar";

const appOpenAd = AppOpenAd.createForAdRequest(
  __DEV__ ? TestIds.APP_OPEN : "ca-app-pub-8386909400947159/9358747747",
);

export default function RootLayout() {
  useEffect(() => {
    appOpenAd.load();
    const unsubscribeLoaded = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        appOpenAd.show();
      },
    );

    return () => {
      unsubscribeLoaded();
    };
  }, []);

  return (
    <>
      <StatusBar style={"inverted"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
