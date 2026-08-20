import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useRef, useState } from "react";
import { Stack } from "expo-router";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated
} from "react-native";

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

  const Field = ({ label, icon, children }) => (
    <View style={{ marginTop: 18 }}>
      <View style={styles.labelRow}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={14}
            color={INK_FAINT}
            style={{ marginRight: 6 }}
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );

  const Dropdown = ({
    isOpen,
    value,
    placeholder,
    fieldKey,
    onPress,
    focusedInput,
  }) => (
    <TouchableOpacity
      style={[
        styles.inputContainer,
        focusedInput === fieldKey && styles.activeInput,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={value ? styles.inputValueText : styles.placeholderText}
        numberOfLines={1}
      >
        {value || placeholder}
      </Text>
      <Feather
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={18}
        color={INK_FAINT}
      />
    </TouchableOpacity>
  );


const LTWCForm = () => {
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scanAnim]);

  // then swap the static View for:
  // eslint-disable-next-line no-unused-expressions
  <Animated.View
    style={[
      styles.scanLine,
      {
        transform: [
          {
            translateY: scanAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 140], // roughly the frame height minus line height
            }),
          },
        ],
      },
    ]}
  />;
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
  const [agencySearch, setAgencySearch] = useState("");

  const [focusedInput, setFocusedInput] = useState("");

  useEffect(() => {
    (async () => {
      
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();

      setGalleryPermission(gallery.status === "granted");
    })();
  }, []);

  const filteredAgencies = useMemo(
    () =>
      agencies.filter((a) =>
        a.toLowerCase().includes(agencySearch.toLowerCase()),
      ),
    [agencySearch],
  );

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
      "http://192.168.1.11:9000/api/meterassign",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeLocation: store,
          agency,
          installerId: mobile.replace(/[^0-9]/g, ""),
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
      <Stack.Screen options={{ title: "LTWC Assignment" }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Store */}
        <Field label="Store name" icon="store-outline">
          <Dropdown
            isOpen={storeOpen}
            value={store}
            placeholder="Select store"
            focusedInput={focusedInput}
            fieldKey="store"
            onPress={() => {
              setStoreOpen(!storeOpen);
              setFocusedInput("store");
            }}
          />
        </Field>
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
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Equipment Category */}
        <Field label="Equipment category" icon="tag-outline">
          <Dropdown
            isOpen={openCategory}
            value={equipCategory}
            placeholder="Select category"
            focusedInput={focusedInput}
            fieldKey="category"
            onPress={() => {
              setOpenCategory(!openCategory);
              setFocusedInput("category");
            }}
          />
        </Field>
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
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Meter Type */}
        <Field label="Meter type" icon="meter-electric-outline">
          <Dropdown
            isOpen={openMeterType}
            value={meterType}
            placeholder="Select meter type"
            fieldKey="metertype"
            focusedInput={focusedInput}
            onPress={() => {
              setOpenMeterType(!openMeterType);
              setFocusedInput("metertype");
            }}
          />
        </Field>
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
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Installation Type */}
        <Field label="Installation type" icon="wrench-outline">
          <Dropdown
            isOpen={openInstallationType}
            value={installationType}
            placeholder="Select installation type"
            focusedInput={focusedInput}
            fieldKey="installation"
            onPress={() => {
              setOpenInstallationType(!openInstallationType);
              setFocusedInput("installation");
            }}
          />
        </Field>
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
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Agency */}
        <Field label="Agency name" icon="domain">
          <Dropdown
            isOpen={agencyOpen}
            focusedInput={focusedInput}
            value={agency}
            placeholder="Select agency"
            fieldKey="agency"
            onPress={() => {
              setAgencyOpen(!agencyOpen);
              setFocusedInput("agency");
            }}
          />
        </Field>
        {agencyOpen && (
          <View style={styles.dropdown}>
            <View style={styles.agencySearchBox}>
              <MaterialCommunityIcons
                name="magnify"
                size={16}
                color={INK_FAINT}
              />
              <TextInput
                placeholder="Search agency"
                placeholderTextColor={INK_FAINT}
                style={styles.agencySearchInput}
                value={agencySearch}
                onChangeText={setAgencySearch}
              />
            </View>
            <FlatList
              data={filteredAgencies}
              nestedScrollEnabled
              keyExtractor={(item) => item}
              style={{ maxHeight: 200 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setAgency(item);
                    setAgencyOpen(false);
                  }}
                >
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>No agency found</Text>
              }
            />
          </View>
        )}

        {/* Installer Mobile */}
        <Field label="Installer mobile number" icon="phone-outline">
          <TextInput
            style={[
              styles.input,
              focusedInput === "mobile" && styles.activeInput,
            ]}
            placeholderTextColor={INK_FAINT}
            keyboardType="phone-pad"
            placeholder="Enter mobile number"
            value={mobile}
            onFocus={() => setFocusedInput("mobile")}
            onChangeText={setMobile}
          />
        </Field>

        {/* Meter Number */}
        <Field label="Meter number" icon="barcode-scan">
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
          >
            <TextInput
              style={[
                styles.input,
                styles.meterInput,
                focusedInput === "meter" && styles.activeInput,
              ]}
              placeholderTextColor={INK_FAINT}
              placeholder="Enter or scan meter number"
              value={meter}
              onFocus={() => setFocusedInput("meter")}
              onChangeText={setMeter}
              multiline
              numberOfLines={4}
              keyboardType="numeric"
            />
            <View style={styles.scanActions}>
              <TouchableOpacity
                style={styles.scanBtn}
                onPress={openScannerWithPermission}
              >
                <AntDesign name="scan" size={20} color={ACCENT} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.scanBtn} onPress={pickAndScanQR}>
                <MaterialCommunityIcons
                  name="image-plus-outline"
                  size={22}
                  color={ACCENT}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.helperText}>
            Scan a barcode, pick from gallery, or type meter numbers separated
            by commas
          </Text>
        </Field>

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={submitData}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting && (
            <MaterialCommunityIcons
              name="loading"
              size={16}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={styles.buttonText}>
            {submitting ? "Submitting..." : "Submit assignment"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {openScaner && (
        <View style={styles.scannerOverlay}>
          <CameraView
            style={{ flex: 1 }}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "code128", "code39", "ean13"],
            }}
            onBarcodeScanned={handleScan}
          />

          {/* Dimmed mask with a cut-out scan window */}
          <View style={styles.maskTop} pointerEvents="none" />
          <View style={styles.maskMiddleRow} pointerEvents="none">
            <View style={styles.maskSide} />
            <View style={styles.scannerFrame}>
              {/* Corner brackets */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Animated-feel scan line (static gradient bar; swap for Animated.View if you want real motion) */}
              <View style={styles.scanLine} />
            </View>
            <View style={styles.maskSide} />
          </View>
          <View style={styles.maskBottom} pointerEvents="none" />

          <TouchableOpacity
            onPress={() => setOpenScaner(false)}
            style={styles.scannerCloseBtn}
          >
            <MaterialCommunityIcons name="close" size={22} color="white" />
          </TouchableOpacity>

          <View style={styles.scannerHint}>
            <View style={styles.scannerHintPill}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={16}
                color="#fff"
              />
              <Text style={styles.scannerHintText}>
                Align the barcode within the frame
              </Text>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

/* Same tokens used across the app */
const BG = "#F6F7F9";
const SURFACE = "#FFFFFF";
const INK = "#2B3240";
const INK_SOFT = "#5B6472";
const INK_FAINT = "#8A93A3";
const ACCENT = "#3E7CA6";
const ACCENT_SOFT_BG = "#E9F1F6";
const LINE = "#EEF0F3";

const styles = {
  maskTop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "30%",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  maskBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "44%",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  maskMiddleRow: {
    position: "absolute",
    top: "30%",
    left: 0,
    width: "100%",
    height: "26%",
    flexDirection: "row",
  },
  maskSide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "#3E7CA6",
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },

  scanLine: {
    position: "absolute",
    top: "48%",
    left: 6,
    right: 6,
    height: 2,
    backgroundColor: "#3E7CA6",
    borderRadius: 2,
    shadowColor: "#3E7CA6",
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },



  scannerHint: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  scannerHintPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(17,24,39,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },

  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 16,
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: INK,
    marginTop: 16,
  },

  screenSubtitle: {
    fontSize: 13,
    color: INK_FAINT,
    marginTop: 4,
    marginBottom: 6,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    color: INK_SOFT,
  },

  input: {
    padding: 13,
    borderRadius: 12,
    backgroundColor: SURFACE,
    fontSize: 14,
    color: INK,
  },

  meterInput: {
    flex: 1,
    textAlignVertical: "top",
  },

  inputContainer: {
    padding: 13,
    borderRadius: 12,
    backgroundColor: SURFACE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputValueText: {
    fontSize: 14,
    color: INK,
    flex: 1,
    marginRight: 8,
  },

  placeholderText: {
    fontSize: 14,
    color: INK_FAINT,
    flex: 1,
    marginRight: 8,
  },

  activeInput: {
    borderWidth: 1.5,
    borderColor: ACCENT,
  },

  dropdown: {
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: SURFACE,
    overflow: "hidden",
  },

  item: {
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },

  itemText: {
    fontSize: 13.5,
    color: INK,
  },

  noResultsText: {
    fontSize: 13,
    color: INK_FAINT,
    textAlign: "center",
    paddingVertical: 16,
  },

  agencySearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    margin: 8,
    gap: 6,
  },

  agencySearchInput: {
    flex: 1,
    fontSize: 13,
    color: INK,
  },

  scanActions: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  scanBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ACCENT_SOFT_BG,
    alignItems: "center",
    justifyContent: "center",
  },

  helperText: {
    fontSize: 11.5,
    color: INK_FAINT,
    marginTop: 6,
  },

  button: {
    marginTop: 28,
    backgroundColor: ACCENT,
    paddingVertical: 15,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },

  buttonDisabled: {
    backgroundColor: "#A9B6C4",
    opacity: 0.8,
  },

  scannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 100,
  },

   
  scannerFrame: {
    position: "absolute",
    top: "30%",
    left: "12%",
    width: "76%",
    height: "26%",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
  },

  scannerCloseBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(17,24,39,0.6)",
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },



  scannerHintText: {
    color: "#fff",
    fontSize: 13,
    backgroundColor: "rgba(17,24,39,0.55)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
};

export default LTWCForm;
