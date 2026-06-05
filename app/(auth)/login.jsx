import React, { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Validation", "Please enter your email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Validation", "Please enter your password");
      return;
    }

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

        Alert.alert("Success", "Login Successfully");

        router.replace("/");
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("../../assets/images/undraw_knocking-on-the-door_vgly.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={"#000"}
          style={[styles.input, {color: "#000"}]}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={"#000"}
            style={[styles.passwordInput, {color: "#000"}]}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, sending && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: 230,
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 35,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    marginBottom: 14,
    fontSize: 16,
  },

  passwordContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  button: {
    height: 56,
    backgroundColor: "#000",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Login;
