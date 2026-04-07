import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../../components/Text";
import Table from "../../components/Table";
import * as SecureStore from "expo-secure-store";

const sortList = {
  "New to old": "newold",
  "Old to new": "oldnew",
  "Meter ID": "meterid",
  Status: "status",
};

const meterStatus = [
  { lable: "Active", value: "active" },
  { lable: "Pending", value: "pending" },
  { lable: "Rejected", value: "rejected" },
  { lable: "installed", value: "installed" },
];

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
const InstallationType = ["HTCT", "LTCT", "LTWC", "DT", "FEEDER"];

const MeterStatus = () => {
  const [activeTag, setActiveTag] = useState("New to old");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openModel, setOpenModel] = useState(false);

  // FILTER STATES
  const [status, setStatus] = useState("");
  const [agency, setAgency] = useState("");
  const [store, setStore] = useState("");
  const [meterCategory, setMeterCategory] = useState("");
  const [installationType, setInstallationType] = useState("");

  // DROPDOWN STATES
  const [openStatus, setOpenStatus] = useState(false);
  const [openAgency, setOpenAgency] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openInstallation, setOpenInstallation] = useState(false);
  const [openStore, setOpenStore] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTag]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const query = `?sort=${sortList[activeTag]}&search=${search}
&status=${status}
&agency=${agency}
&store=${store}
&meterType=${meterCategory}
&installationType=${installationType}`;
      const res = await fetch(
        `https://assign-meter-backend.onrender.com/api/getmeterdetails/supervisor${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const rows = data.map((item, index) => [
    index + 1,
    item.meterNumber,
    item.status,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text styles={styles.headerText} bold>
          Meter Status
        </Text>

        {/* Search */}
        <View style={styles.header}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={26} color="#2C6BED" />
            <TextInput
              placeholder="Search by Meter ID"
              style={styles.input}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={fetchData}
            />
          </View>

          <TouchableOpacity onPress={() => setOpenModel(true)}>
            <MaterialCommunityIcons name="filter" size={26} color="#2C6BED" />
          </TouchableOpacity>
        </View>

        {/* Tags */}
        <FlatList
          horizontal
          data={["New to old", "Old to new", "Meter ID", "Status"]}
          keyExtractor={(item) => item}
          contentContainerStyle={{ height: 50 }}
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 50 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setActiveTag(item)}>
              <Text
                bold
                styles={[styles.tag, activeTag === item && styles.active]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Table */}
        <Table
          loading={loading}
          headers={[
            {
              name: "S.No",
              icon: <Feather name="hash" size={20} color="#fff" />,
            },
            {
              name: "Meter ID",
              icon: (
                <MaterialCommunityIcons
                  name="meter-electric"
                  size={20}
                  color="#fff"
                />
              ),
            },
            {
              name: "Status",
              icon: (
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
              ),
            },
          ]}
          rows={rows}
        />
      </View>

      <Modal visible={openModel} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setOpenModel(false)}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ height: "100%" }}>
              <View style={styles.handle}>
                <Text bold>Filter</Text>
                <Pressable onPress={() => setOpenModel(false)}>
                  <MaterialCommunityIcons name="close" size={26} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* STATUS */}
                <Text bold>Meter Status</Text>
                <TouchableOpacity
                  style={styles.field}
                  onPress={() => setOpenStatus(!openStatus)}
                >
                  <Text>{status || "Select Status"}</Text>
                </TouchableOpacity>
                {openStatus && (
                  <FlatList
                    data={meterStatus}
                    keyExtractor={(item) => item.value}
                    style={{ maxHeight: 200, borderRadius: 10 }}
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          setStatus(item.value);
                          setOpenStatus(false);
                        }}
                      >
                        <Text
                          styles={{ textTransform: "capitalize", fontSize: 12 }}
                        >
                          {item.lable}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}

                {/* AGENCY */}
                <Text bold>Agency</Text>
                <TouchableOpacity
                  style={styles.field}
                  onPress={() => setOpenAgency(!openAgency)}
                >
                  <Text>{agency || "Select Agency"}</Text>
                </TouchableOpacity>
                {openAgency && (
                  <FlatList
                    data={agencies}
                    keyExtractor={(item) => item}
                    style={{ maxHeight: 200, borderRadius: 10 }}
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          setAgency(item);
                          setOpenAgency(false);
                        }}
                      >
                        <Text
                          styles={{ textTransform: "capitalize", fontSize: 12 }}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}

                {/* CATEGORY */}
                <Text bold>Meter Category</Text>
                <TouchableOpacity
                  style={styles.field}
                  onPress={() => setOpenCategory(!openCategory)}
                >
                  <Text>{meterCategory || "Select Category"}</Text>
                </TouchableOpacity>
                {openCategory && (
                  <FlatList
                    data={MeterCategory}
                    style={{ maxHeight: 200, borderRadius: 10 }}
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          setMeterCategory(item);
                          setOpenCategory(false);
                        }}
                      >
                        <Text styles={{ fontSize: 12 }}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}

                {/* INSTALLATION */}
                <Text bold>Installation Type</Text>
                <TouchableOpacity
                  style={styles.field}
                  onPress={() => setOpenInstallation(!openInstallation)}
                >
                  <Text>{installationType || "Select Type"}</Text>
                </TouchableOpacity>
                {openInstallation && (
                  <FlatList
                    data={InstallationType}
                    style={{ maxHeight: 200, borderRadius: 10 }}
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          setInstallationType(item);
                          setOpenInstallation(false);
                        }}
                      >
                        <Text styles={{ fontSize: 12 }}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}

                {/* STORE */}
                <Text bold>Store</Text>
                <TouchableOpacity
                  style={styles.field}
                  onPress={() => setOpenStore(!openStore)}
                >
                  <Text>{store || "Select Store"}</Text>
                </TouchableOpacity>
                {openStore && (
                  <FlatList
                    data={stores}
                    style={{ maxHeight: 200, borderRadius: 10 }}
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          setStore(item);
                          setOpenStore(false);
                        }}
                      >
                        <Text styles={{ fontSize: 12 }}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}

                {/* FOOTER */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={() => {
                      setStatus("");
                      setAgency("");
                      setStore("");
                      setMeterCategory("");
                      setInstallationType("");
                      fetchData()
                    }}
                  >
                    <Text styles={{ color: "red" }}>Reset</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => {
                      setOpenModel(false);
                      fetchData();
                    }}
                  >
                    <Text styles={{ color: "#fff" }}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default MeterStatus;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7FB",
    flex: 1,
    paddingHorizontal: 10,
  },

  headerText: {
    fontSize: 23,
    marginVertical: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  input: {
    marginLeft: 10,
    flex: 1,
  },

  tag: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
  },

  active: {
    backgroundColor: "#2C6BED",
    color: "#fff",
  },

  /* MODAL */

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },

  handle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  field: {
    backgroundColor: "#f1f3f6",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },

  applyBtn: {
    backgroundColor: "#2C6BED",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  item: {
    backgroundColor: "#f1f3f6",
    padding: 12,
    borderTopWidth: 0.3,
    borderColor: "#ddd",
  },
});
