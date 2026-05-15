import {
  AntDesign,
  Feather,
  Lucide,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";

const interstitial = InterstitialAd.createForAdRequest(
  "ca-app-pub-8386909400947159/6680133618",
);
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
import { Stack } from "expo-router";

const stores = ["Nagaon", "Golaghat"];

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

const MeterCategory = ["CT", "METER", "NIC", "PT", "SEAL", "SIM"];

const LTWCForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [store, setStore] = useState("");
  const [agency, setAgency] = useState("");
  const [mobile, setMobile] = useState("");
  const [meter, setMeter] = useState("");

  const [equipCategory, setEquipCategory] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [meterType, setMeterType] = useState("");
  const [openMeterType, setOpenMeterType] = useState(false);
  const [installationType, setInstallationType] = useState("");
  const [openInstallationType, setOpenInstallationType] = useState(false);

  const [openScaner, setOpenScaner] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [agencyOpen, setAgencyOpen] = useState(false);

  const [focusedInput, setFocusedInput] = useState("");

  useEffect(() => {
    (async () => {
      const camera = await requestPermission();
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();

      setGalleryPermission(gallery.status === "granted");
    })();
  }, []);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitial.load();
      },
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const pickAndScanQR = async () => {
    if (!galleryPermission) {
      Alert.alert("Permission Required", "Allow gallery access");
      return;
    }

    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (image.canceled) return;

      const uri = image.assets[0].uri;

      const scanned = await Camera.scanFromURLAsync(uri, [
        "qr",
        "code128",
        "code39",
        "ean13",
      ]);

      if (scanned.length > 0) {
        const finalData = scanned[0].data.replace(/Meter Sr.no.:/gm, "");

        setMeter((pre) => (pre ? pre + "," + finalData : finalData));
      } else {
        Alert.alert("No QR Found", "Try another image");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to scan image");
    }
  };
  const handleScan = ({ data }) => {
    const finalData = data.replace(/Meter Sr.no.:/gm, "");
    setMeter((pre) => pre + "," + finalData);
    setOpenScaner(false);
  };

  const submitData = async () => {
    const token = await SecureStore.getItemAsync("token");
    setSubmitting(true);
    const res = await fetch(
      "https://assign-meter-backend.onrender.com/api/meterassign",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeLocation: store,
          agency,
          installerId: mobile,
          meterNumber: meter
            .split(/[,\s]+/)
            .filter((item) => item.trim() !== ""),
          equipCategory: equipCategory,
          meterType,
          installationType,
        }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      setSubmitting(false);
      Alert.alert("Data Inserted Successfully", data.message);
      if (loaded) {
        interstitial.show();
      }
      setStore("");
      setAgency("");
      setMobile("");
      setMeter("");
      setEquipCategory("");
      setMeterType("");
      setInstallationType("");
    } else {
      setSubmitting(false);
      Alert.alert("Something went wrong", data.message);
    }
  };

  const MeterTypes = [
    "1P,2W,5-30A",
    "3P,4W,-/1A",
    "3P,4W,-/5A",
    "3P,4W,10-60A",
    "3P,4W,100/5A",
    "3P,4W,200/5A",
    "3P,4W,400/5A",
    "3P,4W,50/5A",
  ];

  const installationTypes = ["DTMeter", "FeederMeter", "HTCT", "LTCT", "LTWC"];

  const openScannerWithPermission = async () => {
    if (permission?.status === "granted") {
      setOpenScaner(true);
    } else {
      await requestPermission();
    }
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
        {/* Store Dropdown */}

        <Text style={{ marginBottom: 5 }}>Store Name</Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === "store" && styles.activeInput,
          ]}
          onPress={() => {
            setStoreOpen(!storeOpen);
            setFocusedInput("store");
          }}
        >
          <Text>{store || "Select Store"}</Text>
          <Feather name="chevron-down" size={18} />
        </TouchableOpacity>

        {storeOpen && (
          <FlatList
            nestedScrollEnabled
            data={stores}
            keyExtractor={(item) => item}
            style={styles.dropdown}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setStore(item);
                  setStoreOpen(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Equipment Category */}

        <Text style={{ marginTop: 15, marginBottom: 5 }}>
          Equipment Category
        </Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === "category" && styles.activeInput,
          ]}
          onPress={() => {
            setOpenCategory(!openCategory);
            setFocusedInput("category");
          }}
        >
          <Text>{equipCategory || "Select Category"}</Text>
          <Feather name="chevron-down" size={18} />
        </TouchableOpacity>

        {openCategory && (
          <FlatList
            nestedScrollEnabled
            data={MeterCategory}
            style={[styles.dropdown, { maxHeight: 200 }]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setEquipCategory(item);
                  setOpenCategory(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Meter Type */}

        <Text style={{ marginTop: 15, marginBottom: 5 }}>Meter Type</Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === "metertype" && styles.activeInput,
          ]}
          onPress={() => {
            setOpenMeterType(!openMeterType);
            setFocusedInput("metertype");
          }}
        >
          <Text>{meterType || "Select Meter Type"}</Text>
          <Feather name="chevron-down" size={18} />
        </TouchableOpacity>

        {openMeterType && (
          <FlatList
            nestedScrollEnabled
            data={MeterTypes}
            style={[styles.dropdown, { maxHeight: 200 }]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setMeterType(item);
                  setOpenMeterType(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Installation Type */}

        <Text style={{ marginTop: 15, marginBottom: 5 }}>
          Installation Type
        </Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            focusedInput === "installation" && styles.activeInput,
          ]}
          onPress={() => {
            setOpenInstallationType(!openInstallationType);
            setFocusedInput("installation");
          }}
        >
          <Text>{installationType || "Select Installation Type"}</Text>
          <Feather name="chevron-down" size={18} />
        </TouchableOpacity>

        {openInstallationType && (
          <FlatList
            nestedScrollEnabled
            data={installationTypes}
            style={[styles.dropdown, { maxHeight: 200 }]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setInstallationType(item);
                  setOpenInstallationType(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Agency Dropdown */}

        <Text style={{ marginTop: 15, marginBottom: 5 }}>Agency Name</Text>

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
            data={agencies}
            nestedScrollEnabled
            keyExtractor={(item) => item}
            style={[styles.dropdown, { maxHeight: 200 }]}
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

        {/* Installer Mobile */}

        <Text style={{ marginTop: 15, marginBottom: 5 }}>
          Installer Mobile Number
        </Text>

        <TextInput
          style={[
            styles.input,
            focusedInput === "mobile" && styles.activeInput,
          ]}
          keyboardType="phone-pad"
          placeholder="Enter Mobile Number"
          value={mobile}
          onFocus={() => setFocusedInput("mobile")}
          onChangeText={setMobile}
        />

        {/* Meter Number */}

        <Text style={{ marginTop: 15, marginBottom: 5 }}>Meter Number</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            style={[
              styles.input,
              { width: "80%", textAlignVertical: "top" },
              focusedInput === "meter" && styles.activeInput,
            ]}
            placeholder="Enter or Scan Meter Number"
            value={meter}
            onFocus={() => setFocusedInput("meter")}
            onChangeText={setMeter}
            multiline
            numberOfLines={4}
            keyboardType="numeric"
          />
          <AntDesign
            name="scan"
            size={24}
            color="#2C6BED"
            // style={{ width: "10%", textAlign: "center" }}
            onPress={openScannerWithPermission}
          />
          <MaterialCommunityIcons
            name="image-plus-outline"
            size={27}
            color="#2C6BED"
            // style={{ width: "10%", textAlign: "center" }}
            onPress={pickAndScanQR}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { marginBottom: 110 },
            submitting && styles.buttonDisabled,
          ]}
          onPress={submitData}
          disabled={submitting}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            {submitting ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>

        <BannerAd
          unitId={"ca-app-pub-8386909400947159/3079799956"}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </ScrollView>

      {openScaner && (
        <>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 100,
              overflow: "hidden",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          >
            <CameraView
              style={{ backgroundColor: "transparent", flex: 1 }}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "code128", "code39", "ean13"],
              }}
              onBarcodeScanned={handleScan}
            />

            <TouchableOpacity
              onPress={() => setOpenScaner(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "black",
                borderRadius: 6,
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 20 }}>
                <MaterialCommunityIcons name="close" size={25} />
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  buttonDisabled: {
    backgroundColor: "#A0AEC0", // gray
    opacity: 0.7,
  },
};

export default LTWCForm;
