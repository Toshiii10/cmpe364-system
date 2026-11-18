import { StyleSheet, Text, View } from "react-native";

export default function RecordCard({ record }) {
  const isClosed = record.status === "closed";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.meta}>
          #{record.id} • {record.concern || "General"}
        </Text>
        <Text style={[styles.badge, isClosed ? styles.closed : styles.open]}>
          {record.status}
        </Text>
      </View>

      <Text style={styles.title}>{record.title}</Text>

      {Boolean(record.description) && (
        <Text style={styles.description}>{record.description}</Text>
      )}

      <Text style={styles.requester}>
        By: {record.requester_name || "Anonymous"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: "#4b5563",
  },
  badge: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  open: {
    color: "#15803d",
  },
  closed: {
    color: "#6b7280",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  requester: {
    fontSize: 12,
    color: "#6b7280",
  },
});