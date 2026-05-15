import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as SecureStore from "expo-secure-store";


const AssignMeter = () => {
  const [meterNumber, setMeterNumber] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const [coords, setCoords] = useState({
    latitude: 26.7271,
    longitude: 92.7176,
  });

  // 🔹 Fetch current location
  const handleFetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCoords({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch {
      Alert.alert("Error", "Failed to fetch location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchLocation();
  }, []);

  const submitData = async () => {
    if (!meterNumber || !consumerNumber) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const token = await SecureStore.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const res = await fetch(
        "https://assign-meter-backend.onrender.com/api/assign-location",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            meterNumber,
            consumerNumber,
            location: coords,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      Alert.alert("Success", "Location saved successfully");

      // optional reset
      setMeterNumber("");
      setConsumerNumber("");

    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Assign Location" }} />

      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Meter Number</Text>
          <TextInput
            placeholder="Enter Meter Number"
            value={meterNumber}
            onChangeText={setMeterNumber}
            style={styles.input}
          />

          <Text style={styles.label}>Consumer Number</Text>
          <TextInput
            placeholder="Enter Consumer Number"
            value={consumerNumber}
            onChangeText={setConsumerNumber}
            style={styles.input}
          />
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.secondaryBtn, loading && { opacity: 0.6 }]}
            onPress={handleFetchLocation}
            disabled={loading}
          >
            <Text style={styles.secondaryText}>Refresh Location</Text>
          </Pressable>

          <Pressable
            style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
            onPress={submitData}
            disabled={loading}
          >
            <Text style={styles.primaryText}>
              {loading ? "Saving..." : "Save Location"}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default AssignMeter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  map: {
    width: "100%",
    height: 350,
  },
  form: {
    padding: 16,
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actions: {
    padding: 16,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryBtn: {
    backgroundColor: "#E5E7EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryText: {
    color: "#111",
    fontWeight: "600",
  },
});