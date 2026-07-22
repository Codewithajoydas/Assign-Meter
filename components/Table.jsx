import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import Text from "./Text";
import { useRouter } from "expo-router";

const BG = "#F6F7F9";
const SURFACE = "#FFFFFF";
const INK = "#2B3240";
const INK_FAINT = "#8A93A3";
const ACCENT = "#3E7CA6";
const LINE = "#EEF0F3";

export default function Table({ headers = [], rows = [], loading = false }) {
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text bold styles={{ color: INK_FAINT }}>
          Loading...
        </Text>
      </View>
    );
  }

  const renderRow = ({ item: row, index: rowIndex }) => (
    <TouchableOpacity
      onPress={() => router.push(`/categories/${row[1]}`)}
      style={[styles.row, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}
      activeOpacity={0.6}
    >
      {row.map((cell, cellIndex) => {
        const isRemarks = cellIndex === row.length - 1 && row.length > 3;
        return (
          <View
            key={cellIndex}
            style={[styles.cell, isRemarks && styles.remarksCell]}
          >
            <Text
              styles={[
                styles.cellText,
                {
                  color: typeof cell === "number" ? INK_FAINT : INK,
                },
                cell === "active" && styles.active,
                cell === "pending" && styles.pending,
                cell === "rejected" && styles.rejected,
                isRemarks && styles.remarksText,
              ]}
              numberOfLines={isRemarks ? 2 : 1}
            >
              {cell || (isRemarks ? "-" : cell)}
            </Text>
          </View>
        );
      })}
    </TouchableOpacity>
  );

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.row, styles.headerRow]}>
        {headers.map((header, index) => (
          <View key={index} style={[styles.cell, styles.headerCell]}>
            {header.icon}
            <Text bold styles={{ color: "#fff", fontSize: 13 }}>
              {header.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Body */}
      {rows.length > 0 ? (
        <FlatList
          data={rows}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderRow}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text styles={styles.emptyText}>No Data Found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: 14,
    overflow: "hidden",
    height: "100%",
    flex: 1,
    backgroundColor: SURFACE,
  },

  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    flex: 1,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  headerRow: {
    backgroundColor: ACCENT,
  },

  separator: {
    height: 1,
    backgroundColor: LINE,
    marginHorizontal: 10,
  },

  cell: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  remarksCell: {
    flex: 1.4,
  },

  headerCell: {
    gap: 6,
  },

  cellText: {
    fontSize: 13.5,
    textTransform: "capitalize",
    textAlign: "center",
  },

  remarksText: {
    fontSize: 12,
    color: INK_FAINT,
    textTransform: "none",
    textAlign: "left",
  },

  evenRow: {
    backgroundColor: SURFACE,
  },

  oddRow: {
    backgroundColor: BG,
  },

  active: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 4,
    overflow: "hidden",
  },

  pending: {
    backgroundColor: "#FEF3C7",
    color: "#B45309",
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 4,
    overflow: "hidden",
  },

  rejected: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 4,
    overflow: "hidden",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyText: {
    textAlign: "center",
    padding: 10,
    fontSize: 14,
    color: INK_FAINT,
    fontWeight: "600",
  },
});
