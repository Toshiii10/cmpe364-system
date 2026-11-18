import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RecordForm from "../components/RecordForm.jsx";
import RecordList from "../components/RecordList.jsx";
import { getSession, login, logout } from "../services/authApi.js";
import { createRecord, getRecords } from "../services/recordsApi.js";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading");
  const [username, setUsername] = useState(null);
  const [authError, setAuthError] = useState("");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    Promise.all([getRecords(), getSession()])
      .then(([recordsData, sessionData]) => {
        setRecords(recordsData);
        setUsername(sessionData.username || null);
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  async function handleLogin(user, pass) {
    setAuthError("");
    try {
      const data = await login(user, pass);
      setUsername(data.username);
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  }

  async function handleLogout() {
    setAuthError("");
    try {
      await logout();
      setUsername(null);
    } catch (error) {
      setAuthError(error.message);
    }
  }

  async function addRecord(recordData) {
    setApiError("");
    setFieldErrors({});
    try {
      const createdRecord = await createRecord(recordData);
      setRecords((current) => [createdRecord, ...current]);
    } catch (error) {
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        setApiError(error.message);
      }
    }
  }

  function deleteRecord(id) {
    setRecords((current) => current.filter((record) => record.id !== id));
  }

  if (status === "loading") return <p>Loading records...</p>;
  if (status === "error") return <p>Unable to load records.</p>;

  return (
    <main>
      <h1>Records</h1>
      <LoginForm
        username={username}
        onLogin={handleLogin}
        onLogout={handleLogout}
        authError={authError}
      />
      <RecordForm onAdd={addRecord} />
      {apiError && <p role="alert" style={{ color: "red" }}>{apiError}</p>}
      {fieldErrors.title && <p role="alert" style={{ color: "red" }}>{fieldErrors.title}</p>}
      {fieldErrors.status && <p role="alert" style={{ color: "red" }}>{fieldErrors.status}</p>}
      <RecordList records={records} onDelete={deleteRecord} />
    </main>
  );
}