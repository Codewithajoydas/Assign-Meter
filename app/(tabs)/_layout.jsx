// app/(tabs)/_layout.jsx

import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import Text from "../../components/Text";

const TABS = [
  { name: "index", label: "Home", icon: "home" },
  { name: "meterStatus", label: "Meter Status", icon: "aim" },
  { name: "settings", label: "Settings", icon: "setting" },
];

const SPRING = {
  damping: 16,
  stiffness: 180,
  mass: 0.6,
};

function TabIcon({ tab, isFocused }) {
  const scale = useSharedValue(isFocused ? 1.08 : 0.9);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.08 : 0.9, SPRING);
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.tabItemInner}>
      <Animated.View style={iconStyle}>
        <AntDesign
          name={tab.icon}
          size={20}
          color={isFocused ? "#0B1220" : "#9AA5B1"}
        />
      </Animated.View>

      {isFocused && (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(100)}
        >
          <Text bold styles={styles.label} numberOfLines={1}>
            {tab.label}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const [layouts, setLayouts] = useState({});

  const pillX = useSharedValue(0);
  const pillW = useSharedValue(0);

  useEffect(() => {
    const layout = layouts[state.index];

    if (layout) {
      pillX.value = withSpring(layout.x, SPRING);
      pillW.value = withSpring(layout.width, SPRING);
    }
  }, [state.index, layouts]);

  const pillStyle = useAnimatedStyle(() => ({
    width: pillW.value,
    transform: [{ translateX: pillX.value }],
  }));

  const measure = (index, isFocused) => (e) => {
    const { x, width } = e.nativeEvent.layout;

    setLayouts((prev) => ({
      ...prev,
      [index]: { x, width },
    }));

    if (isFocused && pillW.value === 0) {
      pillX.value = x;
      pillW.value = width;
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.bar}>
        <Animated.View style={[styles.pill, pillStyle]} />

        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLayout={measure(index, isFocused)}
              style={styles.tabItem}
              hitSlop={8}
            >
              <TabIcon tab={tab} isFocused={isFocused} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />

      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen key={tab.name} name={tab.name} />
        ))}
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  bar: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginHorizontal: 16,
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },

  pill: {
    position: "absolute",
    top: 6,
    bottom: 6,
    backgroundColor: "#3E7CA6",
    borderRadius: 24,
  },

  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  tabItemInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  label: {
    fontSize: 13,
    color: "#fff",
  },
});
