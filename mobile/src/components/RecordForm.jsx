import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RecordForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  async function submit() {
    if (submittingRef.current) return;

    const clean = title.trim();
    setError("");

    if (!clean) {
      setError("Title is required.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onCreate({ title: clean, status: "open" });
      setTitle("");
    } catch (err) {
      const fields = err.fieldErrors;
      setError(
        fields?.title ||
          fields?.status ||
          err.message ||
          "Could not save. Please try again."
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Record title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Record title"
        accessibilityLabel="Record title"
        editable={!isSubmitting}
        style={styles.input}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <Pressable
        onPress={submit}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSubmitting }}
        style={styles.button}
      >
        <Text>{isSubmitting ? "Saving..." : "Add Record"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginBottom: 16, gap: 8 },
  label: { fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#9ca3af",
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  error: { color: "#b91c1c" },
  button: {
    borderWidth: 1,
    borderColor: "#374151",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});