import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Linking,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import Text from "../../components/Text";
import { Ionicons } from "@expo/vector-icons";
import userData from "../../assets/user.json";

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

const MIS_NUMBER = "6900611920";

const MeterScreen = () => {
  const { meternumber } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (meternumber) {
      searchMeter();
    }
  }, [meternumber]);

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

  const callMIS = () => Linking.openURL(`tel:+91${MIS_NUMBER}`);
  const whatsappMIS = () =>
    Linking.openURL(
      `whatsapp://send?phone=91${MIS_NUMBER}&text=${encodeURIComponent(
        `Hi, I need help regarding meter ${meter?.meterNumber ?? ""}`,
      )}`,
    );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title: "Meter Details" }} />

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#2C6BED" />
        </View>
      ) : !meter ? (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color="#B0B0B0" />
          <Text style={{ marginTop: 8, color: "#888" }}>No Data Found</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.card}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerCard}>
            <Ionicons name="speedometer-outline" size={32} color="#2C6BED" />
            <Text bold styles={styles.headerText}>
              {meter.meterNumber}
            </Text>
            <View
              style={[
                styles.statusBadge,
                meter.status === "active"
                  ? styles.statusBadgeActive
                  : styles.statusBadgeInactive,
              ]}
            >
              <Ionicons
                name={
                  meter.status === "active"
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={14}
                color={meter.status === "active" ? "green" : "red"}
              />
              <Text
                styles={[
                  styles.statusBadgeText,
                  meter.status === "active" ? styles.active : styles.inactive,
                ]}
              >
                {meter.status}
              </Text>
            </View>
          </View>

          <Row
            icon="pricetag-outline"
            label="Category"
            value={meter.equipCategory}
          />
          <Row
            icon="hardware-chip-outline"
            label="Meter Type"
            value={meter.meterType}
          />
          <Row
            icon="construct-outline"
            label="Installation"
            value={meter.installationType}
          />
          <Row
            icon="location-outline"
            label="Location"
            value={meter.storeLocation}
          />
          <Row icon="business-outline" label="Agency" value={meter.agency} />
          <Row
            icon="id-card-outline"
            label="Installer ID"
            value={meter.installerId}
          />
          <Row
            icon="person-outline"
            label="Installer Name"
            value={
              userData.filter(
                (user) => user.mobileNumber === meter?.installerId,
              )[0]?.name
            }
          />
          <Row
            icon="calendar-outline"
            label="Meter Submitted At"
            value={formatDate(meter.createdAt)}
          />
          <Row
            icon="time-outline"
            label="Meter Updated At"
            value={formatDate(meter.updatedAt)}
          />
          <Row
            icon="chatbox-ellipses-outline"
            label="Remarks"
            value={meter?.remarks ?? "-"}
          />

          <View style={styles.helpRow}>
            <Pressable
              style={[styles.helpButton, styles.callButton]}
              onPress={callMIS}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text styles={styles.helpText}>Call</Text>
            </Pressable>

            <Pressable
              style={[styles.helpButton, styles.whatsappButton]}
              onPress={whatsappMIS}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text styles={styles.helpText}>WhatsApp</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const Row = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.labelWithIcon}>
      {icon && (
        <Ionicons name={icon} size={16} color="#666" style={styles.rowIcon} />
      )}
      <Text bold styles={styles.label}>
        {label}
      </Text>
    </View>
    <Text styles={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  scroll: {
    flex: 1,
  },
  helpRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  helpButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  callButton: {
    backgroundColor: "#2C6BED",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  helpText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  card: {
    padding: 16,
    flexGrow: 1,
  },
  headerCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeActive: {
    backgroundColor: "#E6F4EA",
  },
  statusBadgeInactive: {
    backgroundColor: "#FCE8E6",
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowIcon: {
    marginRight: 4,
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    color: "green",
  },
  inactive: {
    color: "red",
  },
});

export default MeterScreen;
