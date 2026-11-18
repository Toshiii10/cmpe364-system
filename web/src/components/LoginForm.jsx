import { useState } from "react";

export default function LoginForm({ username, onLogin, onLogout, authError }) {
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const ok = await onLogin(inputUser.trim(), inputPass);
    if (ok) {
      setInputUser("");
      setInputPass("");
    }
  }

  if (username) {
    return (
      <section>
        <p>Logged in as: <strong>{username}</strong></p>
        <button type="button" onClick={onLogout}>Logout</button>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username{" "}
        <input
          value={inputUser}
          onChange={(e) => setInputUser(e.target.value)}
        />
      </label>
      <label>
        Password{" "}
        <input
          type="password"
          value={inputPass}
          onChange={(e) => setInputPass(e.target.value)}
        />
      </label>
      <button type="submit">Login</button>
      {authError && <p role="alert" style={{ color: "red" }}>{authError}</p>}
    </form>
  );
}