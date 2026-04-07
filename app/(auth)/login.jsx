import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const handleLogin = async () => {
    setSending(true);
    try {
      const res = await fetch(
        "https://assign-meter-backend.onrender.com/api/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        await SecureStore.setItemAsync("token", data.data.token);
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify(data.data.user),
        );
        setSending(false);
        router.replace("/");
        Alert.alert("Success", "Login Successfully");
      } else {
        Alert.alert("Login Failed", data.message);
        setSending(false);
      }
    } catch (error) {
      setSending(false);
      console.log(error);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Illustration */}
        <Image
          source={require("../../assets/images/undraw_knocking-on-the-door_vgly.png")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        {/* Mobile Input */}
        <TextInput
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>
            {sending ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    justifyContent: "center",
  },
  image: { width: "100%", height: 220, marginBottom: 30 },
  title: { fontSize: 26, fontWeight: "600", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },
});

export default Login;
