import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import Text from "../../components/Text";
import { Image } from "expo-image";
import userData from "../../assets/user.json";
import {
  RewardedAd,
  AdEventType,
  TestIds,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

const rewarded = RewardedAd.createForAdRequest(
  __DEV__ ? TestIds.REWARDED : "ca-app-pub-8386909400947159/5846878143",
);
const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MeterScreen = () => {
  const { meternumber } = useLocalSearchParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (meternumber) {
      showAdThenLoadData();
    }
  }, [meternumber]);

  const showAdThenLoadData = () => {
    const loadedListener = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewarded.show();
      },
    );

    const closedListener = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        loadedListener();
        closedListener();
        searchMeter(); // Load content after ad closes
      },
    );

    rewarded.load();
  };

  const searchMeter = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const res = await fetch(
        `https://assign-meter-backend.onrender.com/api/getmeterdetails/supervisor?search=${meternumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const meter = data?.data?.[0];

  return (
    <>
      <Stack.Screen options={{ title: "Meter Details " }} />

      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#2C6BED" />
        ) : !meter ? (
          <Text>No Data Found</Text>
        ) : (
          <View style={styles.card}>
            {/* <Text bold styles={styles.title}>
              Meter Details
            </Text> */}
            {/* <Image
              source={{
                uri: "https://png.pngtree.com/png-clipart/20230928/original/pngtree-power-meter-3d-illustration-png-image_13010172.png",
              }}
              style={{ width: 200, height: 200 }}
            /> */}
            <Row label="Meter Number" value={meter.meterNumber} />
            <Row label="Category" value={meter.equipCategory} />
            <Row label="Meter Type" value={meter.meterType} />
            <Row label="Installation" value={meter.installationType} />
            <Row label="Location" value={meter.storeLocation} />
            <Row label="Agency" value={meter.agency} />
            <Row label="Installer ID" value={meter.installerId} />
            <Row
              label="Installer Name"
              value={
                userData.filter(
                  (user) => user.mobileNumber === meter?.installerId,
                )[0]?.name
              }
            />

            <Row
              label="Meter Submitted At"
              value={formatDate(meter.createdAt)}
            />
            <Row
              label="Meter Updated At "
              value={formatDate(meter.updatedAt)}
            />
            <Row label="Remarks " value={meter?.remarks??"-"} />
            <View style={styles.row}>
              <Text bold styles={styles.label}>
                Status
              </Text>
              <Text
                styles={[
                  styles.value,
                  meter.status === "active" ? styles.active : styles.inactive,
                ]}
              >
                {meter.status}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text bold styles={styles.label}>
      {label}
    </Text>
    <Text styles={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  card: {
    padding: 16,
    width: "100%",
  },

  title: {
    fontSize: 18,
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  label: {
    color: "#666",
    fontSize: 13,
  },

  value: {
    fontSize: 14,
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
    textTransform: "capitalize",
  },

  active: {
    color: "green",
  },

  inactive: {
    color: "red",
  },
});

export default MeterScreen;
