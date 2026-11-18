import { useEffect, useState } from "react";
import RecordForm from "../components/RecordForm.jsx";
import RecordList from "../components/RecordList.jsx";
import {
  createRecord,
  deleteRecordApi,
  getRecords,
  updateRecordApi,
} from "../services/recordsApi.js";

export default function RecordsPage({ currentUser, onOpenLogin, onLogout }) {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    getRecords()
      .then((recordsData) => {
        setRecords(recordsData);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  function showApiError(error) {
    if (error.fieldErrors) {
      setFieldErrors(error.fieldErrors);
    } else {
      setFieldErrors({ general: error.message });
    }
  }

  async function addRecord(recordData) {
    setFieldErrors({});
    try {
      const createdRecord = await createRecord(recordData);
      setRecords((current) => [createdRecord, ...current]);
    } catch (error) {
      showApiError(error);
    }
  }

  async function toggleStatus(record) {
    setFieldErrors({});
    try {
      const updated = await updateRecordApi(record.id, {
        title: record.title,
        requester_name: record.requester_name || "Anonymous",
        concern: record.concern || "General Inquiry",
        description: record.description || "",
        status: record.status === "open" ? "closed" : "open",
      });
      setRecords((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (error) {
      showApiError(error);
    }
  }

  async function handleUpdate(id, updatedFields) {
    setFieldErrors({});
    try {
      const updated = await updateRecordApi(id, updatedFields);
      setRecords((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      return true;
    } catch (error) {
      showApiError(error);
      return false;
    }
  }

  async function deleteRecord(id) {
    setFieldErrors({});
    try {
      await deleteRecordApi(id);
      setRecords((current) => current.filter((record) => record.id !== id));
    } catch (error) {
      showApiError(error);
    }
  }

  if (status === "loading") return <p>Loading records...</p>;
  if (status === "error") return <p>Unable to load records from Flask API.</p>;

return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Records Management</h1>
        {currentUser ? (
          <div className="session-banner">
            <span>
              Logged in as: <strong>{currentUser}</strong>
            </span>
            <button type="button" className="btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenLogin}
          >
            Login
          </button>
        )}
      </header>

      <RecordForm onAdd={addRecord} />
      {fieldErrors.title && <p role="alert" className="error">{fieldErrors.title}</p>}
      {fieldErrors.status && <p role="alert" className="error">{fieldErrors.status}</p>}
      {fieldErrors.general && <p role="alert" className="error">{fieldErrors.general}</p>}
      {!currentUser && (
        <p className="login-hint">
          <button type="button" className="btn-link" onClick={onOpenLogin}>
            Log in
          </button>{" "}
          to update or delete records.
        </p>
      )}
      <RecordList
        records={records}
        canModify={Boolean(currentUser)}
        onToggleStatus={toggleStatus}
        onUpdate={handleUpdate}
        onDelete={deleteRecord}
      />
    </main>
  );
}