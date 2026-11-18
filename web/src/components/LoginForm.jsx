import { useState } from "react";

export default function LoginForm({ currentUser, onLogin, onLogout }) {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  if (currentUser) {
    return (
      <div className="session-banner">
        <p>
          Logged in as: <strong>{currentUser}</strong>
        </p>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await onLogin({ username, password: pwd });
      setUsername("");
      setPwd("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h3>Login</h3>
      {error && (
        <p role="alert" className="error-msg">
          {error}
        </p>
      )}
      <label>
        Username:
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}