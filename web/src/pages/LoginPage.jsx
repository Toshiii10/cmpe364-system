import LoginForm from "../components/LoginForm.jsx";

export default function LoginPage({ currentUser, onLogin, onLogout, onBack }) {
  return (
    <main className="login-page">
      <button type="button" className="btn-secondary" onClick={onBack}>
        ← Back to Records
      </button>
      <LoginForm
        currentUser={currentUser}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </main>
  );
}