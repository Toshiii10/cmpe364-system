import { useEffect, useState } from "react";
import RecordsPage from "./pages/RecordsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { getSessionStatus, login, logout } from "./services/authApi.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("records"); // "records" | "login"

  useEffect(() => {
    getSessionStatus()
      .then((data) => setCurrentUser(data.username || null))
      .catch(() => setCurrentUser(null));
  }, []);

  async function handleLogin(credentials) {
    const user = await login(credentials);
    setCurrentUser(user.username);
    setView("records");
  }

  async function handleLogout() {
    await logout();
    setCurrentUser(null);
  }

  if (view === "login") {
    return (
      <LoginPage
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onBack={() => setView("records")}
      />
    );
  }

  return (
    <RecordsPage
      currentUser={currentUser}
      onOpenLogin={() => setView("login")}
      onLogout={handleLogout}
    />
  );
}