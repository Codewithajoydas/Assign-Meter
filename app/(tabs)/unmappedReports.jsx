import { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

const API_URL =
  "https://assign-meter-backend.onrender.com/api/generate_unmapped_report_for_supervisor";

const STATUS_FILTERS = ["All", "Mapped", "Unmapped", "Pending", "Never Comm."];

const STATUS_COLORS = {
  Mapped: { bg: "#E6F7EE", text: "#1E9E5A" },
  Unmapped: { bg: "#FDEAEA", text: "#D9463D" },
  Pending: { bg: "#FFF6E0", text: "#B8860B" },
  "Never Comm.": { bg: "#EFEFEF", text: "#6B6B6B" },
};

// Column order for the exported CSV
const CSV_COLUMNS = [
  "MSN",
  "Date of Issue",
  "Name of Sub-contractor",
  "Type of Meter",
  "Store",
  "Name of Employee",
  "Last Communication Date",
  "Mapping Status",
];

export default function UnmappedReports() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchUnmappedReport = async (isRefresh = false) => {
    try {
      // eslint-disable-next-line no-unused-expressions
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const token = await SecureStore.getItemAsync("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (!response.ok || json.status === "error") {
        throw new Error(json.message || "Failed to fetch report");
      }

      const seen = new Set();
      const deduped = (Array.isArray(json.data) ? json.data : []).filter(
        (item) => {
          const key = `${item.MSN}-${item["Mapping Status"]}-${item["Last Communication Date"]}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }
      );

      setRawData(deduped);
    } catch (err) {
      console.error("Error fetching unmapped report:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUnmappedReport();
  }, []);

  const onRefresh = useCallback(() => {
    fetchUnmappedReport(true);
  }, []);

  const filteredData = useMemo(() => {
    let data = rawData;

    if (activeFilter !== "All") {
      data = data.filter((item) => item["Mapping Status"] === activeFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter((item) =>
        [
          item.MSN,
          item["Name of Sub-contractor"],
          item["Name of Employee"],
          item.Store,
        ]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q))
      );
    }

    return data;
  }, [rawData, search, activeFilter]);

  // Escapes a value for CSV (wraps in quotes, doubles internal quotes)
  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const buildCsv = (rows) => {
    const header = CSV_COLUMNS.map(escapeCsvValue).join(",");
    const lines = rows.map((row) =>
      CSV_COLUMNS.map((col) => escapeCsvValue(row[col])).join(",")
    );
    return [header, ...lines].join("\n");
  };

  const handleDownload = async () => {
  if (filteredData.length === 0) {
    Alert.alert("Nothing to export", "There are no rows matching the current filter.");
    return;
  }

  try {
    setDownloading(true);

    const csv = buildCsv(filteredData);

    const filterLabel = activeFilter === "All" ? "all" : activeFilter.replace(/\s|\./g, "");
    const fileName = `unmapped-report-${filterLabel}-${Date.now()}.csv`;

    const file = new File(Paths.document, fileName);
    file.write(csv);

    const canShare = await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "text/csv",
        dialogTitle: "Save or share report",
        UTI: "public.comma-separated-values-text",
      });
    } else {
      Alert.alert("Saved", `Report saved to:\n${file.uri}`);
    }
  } catch (err) {
    console.error("Error downloading report:", err);
    Alert.alert("Download failed", err.message || "Something went wrong");
  } finally {
    setDownloading(false);
  }
};

  const renderStatusBadge = (status) => {
    const colors = STATUS_COLORS[status] || {
      bg: "#EFEFEF",
      text: "#6B6B6B",
    };
    return (
      <View style={[styles.badge, { backgroundColor: colors.bg }]}>
        <Text style={[styles.badgeText, { color: colors.text }]}>
          {status}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.msn}>MSN: {item.MSN}</Text>
        {renderStatusBadge(item["Mapping Status"])}
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Sub-contractor</Text>
        <Text style={styles.value} numberOfLines={1}>
          {item["Name of Sub-contractor"] || "-"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Employee</Text>
        <Text style={styles.value} numberOfLines={1}>
          {item["Name of Employee"] || "-"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Store</Text>
        <Text style={styles.value}>{item.Store || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Meter Type</Text>
        <Text style={styles.value}>{item["Type of Meter"] || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Last Comm.</Text>
        <Text style={styles.value}>
          {item["Last Communication Date"] || "Never"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Issued</Text>
        <Text style={styles.value}>{item["Date of Issue"] || "-"}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Unmapped Reports</Text>
          <Text style={styles.subtitle}>
            {filteredData.length} of {rawData.length} meters
          </Text>
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
          disabled={downloading || loading || filteredData.length === 0}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.downloadButtonText}>Download</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search MSN, contractor, employee, store..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterWrapper}>
        <FlatList
          data={STATUS_FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterChip,
                activeFilter === item && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === item && styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.listArea}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2F6FED" />
            <Text style={styles.loadingText}>Loading report...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchUnmappedReport()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredData.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No meters found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => `${item.MSN}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  downloadButton: {
    backgroundColor: "#3E7CA6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 92,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    color: "#1A1A1A",
  },
  filterWrapper: {
    height: 44,
    marginBottom: 10,
  },
  filterRow: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#3E7CA6",
    borderColor: "#3E7CA6",
  },
  filterChipText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  listArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  msn: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  label: {
    fontSize: 12,
    color: "#999",
  },
  value: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#777",
  },
  errorText: {
    color: "#D9463D",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#2F6FED",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
});