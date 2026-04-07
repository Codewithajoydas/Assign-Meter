import { AntDesign, Feather } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const agencies = [
  "M/S Prashuya Bor Borah",
  "M/S SINGHAL IT SERVICES PRIVATE LIMITED",
  "Akibur Rahaman Laskar",
  "CHOUDHURY POWER ENERGY PVT. LTD.",
  "Hi-Print Metering Solutions Pvt. Ltd.",
  "Assam Power Distribution Company Ltd.",
  "Genus Power Infrastructures Ltd",
  "BHUYAN ENTERPRISE",
  "Ms.Nadim Enterprise",
  "UM Construction",
  "M/S Maa Enterprise",
  "K K ELECTRICALS",
  "Nanda Enterprise",
  "Innovation N Ingeneria",
  "RB DEVELOPERS AND ASSOCIATES",
  "POWER LINE",
  "M/S Uttam Gogoi",
  "Dipjyoti Tamuly",
  "J.B. Electricity",
  "M/S Pradip Baruah",
  "PRATEEK ENTERPRISE",
  "Anika Electricals",
  "M/s. Abdul Wahid Barbhuyan",
  "Tripex Engineering Services pvt ltd",
  "M/S Noor Enterprise",
  "SAMIA ENTERPRISE",
  "Green Hub",
  "N and N Enterprise",
  "Tesla Electricals and Construction",
  "AN2 Skills Private Limited",
  "Youth Care",
  "Azahar Enterprise",
  "ARS Associates",
  "Barbhuyan Electricals",
  "Islam Brother Electricals",
  "Alliance Telenet Pvt Ltd",
  "Grocery Shop",
  "Karan Electrical",
  "Biswakarma Electricals",
  "Super Electric Company",
  "Yogesh Enterprises",
  "Ayush Info Solutions",
  "RT Network Solutions Pvt. Ltd.",
  "Onfoari Enterprise",
  "Mukesh Kumar Mandal",
  "Mahiya Enterprise",
  "Barman Agency",
  "Dhruba Enterprise",
  "A1 Solution",
  "G AID LLP",
  "Hello Saikia",
  "Flourishing Enterprise",
  "Tatrari Electrical and Traders",
  "Destination Technohub India Pvt Ltd",
  "Montrona Construction",
  "Diag Engineering Pvt Ltd",
  "CSC Computer",
];

const nspList = ["Airtel", "Jio"];

const SIM = () => {
  const [equipmentNumber, setEquipmentNumber] = useState("");
  const [agency, setAgency] = useState("");
  const [nsp, setNsp] = useState("");
  const [installerNumber, setInstallerNumber] = useState("");

  const [agencyOpen, setAgencyOpen] = useState(false);
  const [nspOpen, setNspOpen] = useState(false);

  const [openScanner, setOpenScanner] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");

  const [sending, setSending] = useState(false);

  const handleScan = ({ data }) => {
    setEquipmentNumber(data);
    setOpenScanner(false);
  };

  const submitData = async () => {
    setSending(true);

    if (!equipmentNumber) {
      Alert.alert("Error", "Please enter equipment number");
      setSending(false);
      return;
    }

    if (!agency) {
      Alert.alert("Error", "Please select agency");
      setSending(false);
      return;
    }

    if (!nsp) {
      Alert.alert("Error", "Please select NSP");
      setSending(false);
      return;
    }

    if (!installerNumber || installerNumber.length !== 10) {
      Alert.alert("Error", "Installer number must be 10 digits");
      setSending(false);
      return;
    }

    const token = await SecureStore.getItemAsync("token");

    try {
      const res = await fetch(
        "https://assign-meter-backend.onrender.com/api/simassign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            equipmentNumber,
            agency,
            nsp,
            installerNumber,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", data.message);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Internal Problem");
    }

    setSending(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[{ padding: 16, backgroundColor: "#fff" }, styles.container]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ marginBottom: 5 }}>Equipment Number</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            style={[
              styles.input,
              { width: "90%" },
              focusedInput === "equipment" && styles.activeInput,
            ]}
            placeholder="Enter or Scan Equipment Number"
            value={equipmentNumber}
            onFocus={() => setFocusedInput("equipment")}
            onChangeText={setEquipmentNumber}
          />

          <AntDesign
            name="scan"
            size={24}
            color="#2C6BED"
            style={{ width: "10%" }}
            onPress={() => setOpenScanner(true)}
          />
        </View>

        <Text style={{ marginTop: 15, marginBottom: 5 }}>Agency</Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === "agency" && styles.activeInput,
          ]}
          onPress={() => {
            setAgencyOpen(!agencyOpen);
            setFocusedInput("agency");
          }}
        >
          <Text>{agency || "Select Agency"}</Text>
          <Feather name="chevron-down" size={18} />
        </TouchableOpacity>

        {agencyOpen && (
          <FlatList
            nestedScrollEnabled
            data={agencies}
            keyExtractor={(item) => item}
            style={styles.dropdown}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setAgency(item);
                  setAgencyOpen(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <Text style={{ marginTop: 15, marginBottom: 5 }}>NSP</Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === "nsp" && styles.activeInput,
          ]}
          onPress={() => {
            setNspOpen(!nspOpen);
            setFocusedInput("nsp");
          }}
        >
          <Text>{nsp || "Select NSP"}</Text>
          <Feather name="chevron-down" size={18} />
        </TouchableOpacity>

        {nspOpen && (
          <FlatList
            nestedScrollEnabled
            data={nspList}
            keyExtractor={(item) => item}
            style={styles.dropdown}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setNsp(item);
                  setNspOpen(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <Text style={{ marginTop: 15, marginBottom: 5 }}>
          Installer Mobile Number
        </Text>

        <TextInput
          style={[
            styles.input,
            focusedInput === "installer" && styles.activeInput,
          ]}
          placeholder="Enter Installer Mobile Number"
          keyboardType="phone-pad"
          value={installerNumber}
          onFocus={() => setFocusedInput("installer")}
          onChangeText={setInstallerNumber}
        />

        <TouchableOpacity
          style={[styles.button, { marginBottom: 100 }]}
          onPress={submitData}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            {sending ? "Sending..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {openScanner && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 100,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          <CameraView
            style={{ flex: 1 }}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "code128", "code39"],
            }}
            onBarcodeScanned={handleScan}
          />

          <TouchableOpacity
            onPress={() => setOpenScanner(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "black",
              borderRadius: 100,
              width: 60,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>X</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
  },

  input: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  inputContainer: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activeInput: {
    borderColor: "#2C6BED",
    borderWidth: 1.5,
  },

  dropdown: {
    borderWidth: 0.3,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: "#fff",
    maxHeight: 300,
  },

  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  button: {
    marginTop: 25,
    backgroundColor: "#2C6BED",
    padding: 14,
    borderRadius: 6,
  },
};

export default SIM;
