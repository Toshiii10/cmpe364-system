import { useEffect, useState } from "react";
import RecordForm from "../components/RecordForm.jsx";
import RecordList from "../components/RecordList.jsx";
import { createRecord, getRecords } from "../services/recordsApi.js";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    getRecords()
      .then((data) => {
        setRecords(data);
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  async function addRecord(recordData) {
    setApiError("");
    try {
      const createdRecord = await createRecord(recordData);
      setRecords((current) => [createdRecord, ...current]);
    } catch (error) {
      setApiError(error.message);
    }
  }

  function deleteRecord(id) {
    setRecords((current) => current.filter((record) => record.id !== id));
  }

  if (status === "loading") {
    return <p>Loading records...</p>;
  }
  if (status === "error") {
    return <p>Unable to load records from the Flask API.</p>;
  }

  return (
    <main>
      <h1>Records</h1>
      <RecordForm onAdd={addRecord} />
      {apiError && <p role="alert">{apiError}</p>}
      <RecordList records={records} onDelete={deleteRecord} />
    </main>
  );
}