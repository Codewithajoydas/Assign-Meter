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
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../../components/Text";
import Table from "../../components/Table";
import * as SecureStore from "expo-secure-store";

const sortList = {
  Newest: "newold",
  Oldest: "oldnew",
  "Meter ID": "meterid",
  Status: "status",
};

const sortIcons = {
  Newest: "clock-fast",
  Oldest: "clock-outline",
  "Meter ID": "pound",
  Status: "check-decagram-outline",
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
  const [activeTag, setActiveTag] = useState("Newest");
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
  const [agencySearch, setAgencySearch] = useState("");

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

  const activeFilters = useMemo(
    () =>
      [
        status && { key: "status", label: status, clear: () => setStatus("") },
        agency && { key: "agency", label: agency, clear: () => setAgency("") },
        store && { key: "store", label: store, clear: () => setStore("") },
        meterCategory && {
          key: "meterCategory",
          label: meterCategory,
          clear: () => setMeterCategory(""),
        },
        installationType && {
          key: "installationType",
          label: installationType,
          clear: () => setInstallationType(""),
        },
      ].filter(Boolean),
    [status, agency, store, meterCategory, installationType],
  );

  const filteredAgencies = useMemo(
    () =>
      agencies.filter((a) =>
        a.toLowerCase().includes(agencySearch.toLowerCase()),
      ),
    [agencySearch],
  );

  const clearAllFilters = () => {
    setStatus("");
    setAgency("");
    setStore("");
    setMeterCategory("");
    setInstallationType("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Text styles={styles.headerText} bold>
            Meter Status
          </Text>
          <Text styles={styles.countText}>{data.length} results</Text>
        </View>

        {/* Search + filter */}
        <View style={styles.header}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={20} color="#8A93A3" />
            <TextInput
              placeholder="Search by Meter ID"
              placeholderTextColor="#A0A8B5"
              style={styles.input}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={fetchData}
            />
          </View>

          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setOpenModel(true)}
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={20}
              color="#3F4A5A"
            />
            {activeFilters.length > 0 && (
              <View style={styles.filterBadge}>
                <Text styles={styles.filterBadgeText} bold>
                  {activeFilters.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Sort tabs */}
        <View>
          <FlatList
            horizontal
            data={Object.keys(sortList)}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingVertical: 14 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.tag, activeTag === item && styles.tagActive]}
                onPress={() => setActiveTag(item)}
              >
                <MaterialCommunityIcons
                  name={sortIcons[item]}
                  size={15}
                  color={activeTag === item ? "#fff" : "#6B7684"}
                />
                <Text
                  bold
                  styles={[
                    styles.tagText,
                    activeTag === item && styles.tagTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Active filter shelf */}
        {activeFilters.length > 0 && (
          <View style={styles.filterShelf}>
            <FlatList
              horizontal
              data={activeFilters}
              contentContainerStyle={{ alignItems: "center" }}
              keyExtractor={(item) => item.key}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.filterChip}>
                  <Text styles={styles.filterChipText}>{item.label}</Text>
                  <Pressable
                    onPress={() => {
                      item.clear();
                      fetchData();
                    }}
                    hitSlop={8}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={14}
                      color="#4B6E8A"
                    />
                  </Pressable>
                </View>
              )}
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.clearAllBtn}
                  onPress={() => {
                    clearAllFilters();
                    fetchData();
                  }}
                >
                  <Text styles={styles.clearAllText}>Clear all</Text>
                </TouchableOpacity>
              }
            />
          </View>
        )}

        {/* Table */}
        <View style={styles.tableCard}>
          <Table
            loading={loading}
            headers={[
              {
                name: "S.No",
                icon: <Feather name="hash" size={17} color="#fff" />,
              },
              {
                name: "Meter ID",
                icon: (
                  <MaterialCommunityIcons
                    name="meter-electric"
                    size={17}
                    color="#fff"
                  />
                ),
              },
              {
                name: "Status",
                icon: (
                  <MaterialCommunityIcons name="check" size={17} color="#fff" />
                ),
              },
            ]}
            rows={rows}
          />
        </View>
      </View>

      <Modal visible={openModel} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setOpenModel(false)}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ height: "100%" }}>
              <View style={styles.dragHandle} />
              <View style={styles.handle}>
                <View>
                  <Text bold styles={styles.modalTitle}>
                    Filter meters
                  </Text>
                  <Text styles={styles.modalSubtitle}>
                    {activeFilters.length
                      ? `${activeFilters.length} filter${
                          activeFilters.length > 1 ? "s" : ""
                        } applied`
                      : "No filters applied"}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setOpenModel(false)}
                  style={styles.closeBtn}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={18}
                    color="#3F4A5A"
                  />
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 12 }}
              >
                {/* STATUS */}
                <Text styles={styles.sectionLabel} bold>
                  Meter status
                </Text>
                <View style={styles.chipGrid}>
                  {meterStatus.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.pickChip,
                        status === item.value && styles.pickChipActive,
                      ]}
                      onPress={() =>
                        setStatus(status === item.value ? "" : item.value)
                      }
                    >
                      <Text
                        styles={[
                          styles.pickChipText,
                          status === item.value && styles.pickChipTextActive,
                        ]}
                      >
                        {item.lable}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* CATEGORY */}
                <Text styles={styles.sectionLabel} bold>
                  Meter category
                </Text>
                <View style={styles.chipGrid}>
                  {MeterCategory.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pickChip,
                        meterCategory === item && styles.pickChipActive,
                      ]}
                      onPress={() =>
                        setMeterCategory(meterCategory === item ? "" : item)
                      }
                    >
                      <Text
                        styles={[
                          styles.pickChipText,
                          meterCategory === item && styles.pickChipTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* INSTALLATION */}
                <Text styles={styles.sectionLabel} bold>
                  Installation type
                </Text>
                <View style={styles.chipGrid}>
                  {InstallationType.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pickChip,
                        installationType === item && styles.pickChipActive,
                      ]}
                      onPress={() =>
                        setInstallationType(
                          installationType === item ? "" : item,
                        )
                      }
                    >
                      <Text
                        styles={[
                          styles.pickChipText,
                          installationType === item &&
                            styles.pickChipTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* STORE */}
                <Text styles={styles.sectionLabel} bold>
                  Store
                </Text>
                <View style={styles.chipGrid}>
                  {stores.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pickChip,
                        store === item && styles.pickChipActive,
                      ]}
                      onPress={() => setStore(store === item ? "" : item)}
                    >
                      <Text
                        styles={[
                          styles.pickChipText,
                          store === item && styles.pickChipTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* AGENCY */}
                <Text styles={styles.sectionLabel} bold>
                  Agency
                </Text>
                <View style={styles.agencySearchBox}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={18}
                    color="#A0A8B5"
                  />
                  <TextInput
                    placeholder="Search agency"
                    placeholderTextColor="#A0A8B5"
                    style={styles.agencySearchInput}
                    value={agencySearch}
                    onChangeText={setAgencySearch}
                  />
                </View>
                {agency ? (
                  <View style={styles.selectedAgencyRow}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color="#3F8A62"
                    />
                    <Text styles={styles.selectedAgencyText}>{agency}</Text>
                    <Pressable onPress={() => setAgency("")} hitSlop={8}>
                      <MaterialCommunityIcons
                        name="close"
                        size={16}
                        color="#8A93A3"
                      />
                    </Pressable>
                  </View>
                ) : null}
                <FlatList
                  data={filteredAgencies}
                  keyExtractor={(item) => item}
                  style={{ maxHeight: 220 }}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.agencyItem,
                        agency === item && styles.agencyItemActive,
                      ]}
                      onPress={() => setAgency(agency === item ? "" : item)}
                    >
                      <Text
                        styles={[
                          styles.agencyItemText,
                          agency === item && styles.agencyItemTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text styles={styles.noResultsText}>No agency found</Text>
                  }
                />

                {/* FOOTER */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={() => {
                      clearAllFilters();
                      fetchData();
                    }}
                  >
                    <Text bold styles={styles.resetBtnText}>
                      Reset
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => {
                      setOpenModel(false);
                      fetchData();
                    }}
                  >
                    <Text bold styles={{ color: "#fff" }}>
                      Apply filters
                    </Text>
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

/* ───────────────────────── Design tokens ─────────────────────────
   A calmer, low-contrast-strain palette: soft neutral background,
   a single muted blue-teal accent instead of a loud saturated color,
   and pastel status colors that stay readable without shouting. */

const BG = "#F6F7F9";
const SURFACE = "#FFFFFF";
const INK = "#2B3240";
const INK_SOFT = "#5B6472";
const INK_FAINT = "#8A93A3";
const ACCENT = "#3E7CA6"; // muted slate-teal, easy on the eyes on white
const ACCENT_SOFT_BG = "#E9F1F6";
const ACCENT_SOFT_TEXT = "#2E5F7D";
const LINE = "#EEF0F3";
const DANGER = "#B4544A";

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG,
    flex: 1,
    paddingHorizontal: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 4,
  },

  headerText: {
    fontSize: 22,
    color: INK,
    letterSpacing: 0.1,
  },

  countText: {
    fontSize: 13,
    color: INK_FAINT,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: SURFACE,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
  },

  input: {
    marginLeft: 8,
    flex: 1,
    color: INK,
    fontSize: 14.5,
  },

  filterBtn: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    padding: 13,
  },

  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: ACCENT,
    borderRadius: 8,
    minWidth: 17,
    height: 17,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  filterBadgeText: {
    fontSize: 10,
    color: "#fff",
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: SURFACE,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 22,
    marginRight: 8,
  },

  tagActive: {
    backgroundColor: ACCENT,
  },

  tagText: {
    fontSize: 13,
    color: INK_SOFT,
  },

  tagTextActive: {
    color: "#fff",
  },

  filterShelf: {
    marginBottom: 12,
    marginTop: -4,
    },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: ACCENT_SOFT_BG,
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginRight: 8,
  },

  filterChipText: {
    fontSize: 12,
    color: ACCENT_SOFT_TEXT,
    textTransform: "capitalize",
  },

  clearAllBtn: {
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  clearAllText: {
    fontSize: 12.5,
    color: DANGER,
  },

  tableCard: {
    flex: 1,
    backgroundColor: SURFACE,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#1A2333",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  /* MODAL */

  overlay: {
    flex: 1,
    backgroundColor: "rgba(23,29,38,0.42)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    height: "90%",
  },

  dragHandle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#E3E6EB",
    marginBottom: 14,
  },

  handle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 17,
    color: INK,
  },

  modalSubtitle: {
    fontSize: 12.5,
    color: INK_FAINT,
    marginTop: 3,
  },

  closeBtn: {
    backgroundColor: BG,
    borderRadius: 10,
    padding: 7,
  },

  sectionLabel: {
    fontSize: 12.5,
    color: INK_SOFT,
    marginTop: 18,
    marginBottom: 10,
  },

  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  pickChip: {
    backgroundColor: BG,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  pickChipActive: {
    backgroundColor: ACCENT,
  },

  pickChipText: {
    fontSize: 12.5,
    color: INK,
    textTransform: "capitalize",
  },

  pickChipTextActive: {
    color: "#fff",
  },

  agencySearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 7,
  },

  agencySearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: INK,
  },

  selectedAgencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#EAF4EE",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },

  selectedAgencyText: {
    fontSize: 12.5,
    color: "#316B48",
    flex: 1,
  },

  agencyItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: LINE,
  },

  agencyItemActive: {
    backgroundColor: ACCENT_SOFT_BG,
    borderRadius: 8,
    borderBottomWidth: 0,
  },

  agencyItemText: {
    fontSize: 13,
    color: INK,
  },

  agencyItemTextActive: {
    color: ACCENT_SOFT_TEXT,
  },

  noResultsText: {
    fontSize: 12.5,
    color: INK_FAINT,
    textAlign: "center",
    paddingVertical: 18,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 10,
  },

  resetBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  resetBtnText: {
    color: DANGER,
  },

  applyBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
});
