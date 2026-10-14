import { useEffect, useState } from "react";
import RecordForm from "../components/RecordForm.jsx";
import RecordList from "../components/RecordList.jsx";
import {
  createRecord,
  deleteRecordApi,
  getRecords,
  updateRecord,
} from "../services/recordsApi.js";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading");
  const [apiError, setApiError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  function fetchAllRecords() {
    getRecords()
      .then((data) => {
        setRecords(data);
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }

  useEffect(() => {
    fetchAllRecords();
  }, []);

  function handleRefresh() {
    setStatus("loading");
    fetchAllRecords();
  }

  async function addRecord(recordData) {
    setApiError("");
    try {
      const createdRecord = await createRecord(recordData);
      setRecords((current) => [createdRecord, ...current]);
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function handleUpdateRecord(id, updatedFields) {
    setApiError("");
    try {
      const savedRecord = await updateRecord(id, updatedFields);
      setRecords((current) =>
        current.map((rec) => (rec.id === id ? savedRecord : rec))
      );
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function handleDeleteRecord(id) {
    setApiError("");
    try {
      await deleteRecordApi(id);
      setRecords((current) => current.filter((record) => record.id !== id));
    } catch (error) {
      setApiError(error.message);
    }
  }

  const totalCount = records.length;
  const openCount = records.filter((r) => r.status === "open").length;
  const closedCount = records.filter((r) => r.status === "closed").length;

  const filteredRecords = records.filter((rec) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      rec.title.toLowerCase().includes(query) ||
      (rec.requester_name && rec.requester_name.toLowerCase().includes(query)) ||
      (rec.concern && rec.concern.toLowerCase().includes(query)) ||
      (rec.description && rec.description.toLowerCase().includes(query));
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (status === "loading") {
    return (
      <main className="dashboard">
        <p className="status-msg">Loading records...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="dashboard">
        <p className="status-msg error">Unable to load records from the Flask API.</p>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Records Management</h1>
          <p className="subtitle">CMPE 364</p>
        </div>
        <button type="button" className="btn-refresh" onClick={handleRefresh}>
          ↻ Sync DB
        </button>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Records</span>
          <strong className="kpi-value">{totalCount}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Open Active</span>
          <strong className="kpi-value text-open">{openCount}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Closed Resolved</span>
          <strong className="kpi-value text-closed">{closedCount}</strong>
        </div>
      </div>

      <RecordForm onAdd={addRecord} />

      {apiError && <p role="alert" className="alert-error">{apiError}</p>}

      <div className="toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search by title, name, concern, or details...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-tabs">
          {["all", "open", "closed"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${statusFilter === tab ? "active" : ""}`}
              onClick={() => setStatusFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <RecordList
        records={filteredRecords}
        onDelete={handleDeleteRecord}
        onUpdate={handleUpdateRecord}
      />
    </main>
  );
}