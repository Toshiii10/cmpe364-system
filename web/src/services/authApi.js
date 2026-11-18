export async function login(credentials) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Login failed");
  }

  return response.json();
}

export async function getSessionStatus() {
  const response = await fetch("/api/session");
  if (!response.ok) {
    throw new Error("Could not fetch session status");
  }
  return response.json();
}

export async function logout() {
  const response = await fetch("/api/logout", { method: "POST" });
  if (!response.ok) {
    throw new Error("Logout failed");
  }
  return response.json();
}