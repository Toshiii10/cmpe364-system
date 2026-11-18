import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecordCard from "../components/RecordCard";
import { getRecords } from "../services/api";

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
        .catch((err) => {
            console.log("Fetch error:", err.message);
            if (!active) return;
            setStatus("error");
        });

        return () => {
        active = false;
        };
    }, []);

  let content;
  if (status === "loading") {
    content = <ActivityIndicator size="large" />;
  } else if (status === "error") {
    content = (
      <Text style={styles.error}>
        Unable to load records. Check that Flask is running and that the phone
        can reach it.
      </Text>
    );
  } else if (records.length === 0) {
    content = <Text>No records found.</Text>;
  } else {
    content = (
      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <RecordCard record={item} />}
      />
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  error: {
    color: "#b91c1c",
  },
}
);