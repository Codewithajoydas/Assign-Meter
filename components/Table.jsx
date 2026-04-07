import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import Text from "./Text";
import { useRouter } from "expo-router";

export default function Table({ headers = [], rows = [], loading = false }) {
  const router = useRouter();
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text bold>Loading...</Text>
      </View>
    );
  }

  const renderRow = ({ item: row, index: rowIndex }) => (
    <TouchableOpacity
      onPress={() => router.push(`/categories/${row[1]}`)}
      style={[styles.row, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}
    >
      {row.map((cell, cellIndex) => (
        <Text
          key={cellIndex}
          styles={[
            styles.cell,
            {
              textTransform: "capitalize",
              color: typeof cell === "number" ? "gray" : "#000",
              fontWeight: "650",
            },
            cell === "active" && styles.active,
            cell === "pending" && styles.pending,
            cell === "rejected" && styles.rejected,
          ]}
        >
          {cell}
        </Text>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.row, styles.headerRow]}>
        {headers.map((header, index) => (
          <View key={index} style={[styles.cell, styles.headerCell]}>
            <Text bold>{header.icon}</Text>
            <Text bold styles={{ color: "#fff" }}>
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
        />
      ) : (
        <Text styles={{ textAlign: "center", padding: 10 }}>No Data Found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    // marginTop: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 6,
    overflow: "hidden",
    height: "100%",
    flex:1
  },

  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },

  row: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
  },

  headerRow: {
    backgroundColor: "#6F9EF5",
  },

  cell: {
    textAlign: "center",
    fontSize: 14,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  headerCell: {
    fontWeight: "700",
    fontSize: 15,
    color: "#fff",
  },

  evenRow: {
    backgroundColor: "#fff",
  },

  oddRow: {},

  active: {
    backgroundColor: "#A8DF8E",
    paddingHorizontal: 10,
    borderRadius: 6,
    paddingVertical: 4,
  },

  pending: {
    backgroundColor: "#FFDBC5",
    paddingHorizontal: 10,
    borderRadius: 6,
    paddingVertical: 4,
  },

  rejected: {
    backgroundColor: "#DDDDDD",
    paddingHorizontal: 10,
    borderRadius: 6,
    paddingVertical: 4,
  },
});
