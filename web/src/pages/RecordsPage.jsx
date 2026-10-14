import { useEffect, useState } from "react";
import RecordForm from "../components/RecordForm.jsx";
import RecordList from "../components/RecordList.jsx";
import { getRecords, createRecord, deleteRecordApi } from "../services/recordsApi.js";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading");

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
    try {
      const createdRecord = await createRecord(recordData);
      setRecords((current) => [createdRecord, ...current]);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteRecord(id) {
    try {
      await deleteRecordApi(id);
      setRecords((current) => current.filter((record) => record.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  if (status === "loading") return <p>Loading records...</p>;
  if (status === "error") return <p>Unable to load records.</p>;

  return (
    <main>
      <h1>Records</h1>
      <RecordForm onAdd={addRecord} />
      <RecordList records={records} onDelete={deleteRecord} />
    </main>
  );
}