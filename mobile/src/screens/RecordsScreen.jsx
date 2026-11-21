import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecordCard from "../components/RecordCard";
import RecordForm from "../components/RecordForm";
import { createRecord, getRecords } from "../services/api";

export default function RecordsScreen() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    getRecords()
      .then((data) => {
        if (!active) return;
        setRecords(data);
        setStatus("success");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(payload) {
    const created = await createRecord(payload);
    setRecords((current) =>
      [...current, created].sort((a, b) => a.id - b.id)
    );
  }

  let content;
  if (status === "loading") {
    content = <ActivityIndicator size="large" />;
  } else if (status === "error") {
    content = (
      <Text style={styles.error}>
        Unable to load records. Check Flask and the LAN address, then reload the
        app.
      </Text>
    );
  } else {
    content = (
      <View style={styles.body}>
        <RecordForm onCreate={handleCreate} />
        <FlatList
          style={styles.list}
          data={records}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <RecordCard record={item} />}
          ListEmptyComponent={<Text>No records found.</Text>}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Records</Text>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f3f4f6" },
  heading: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
  body: { flex: 1 },
  list: { flex: 1 },
  error: { color: "#b91c1c" },
});