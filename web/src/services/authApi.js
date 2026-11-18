export async function getSession() {
  const response = await fetch("/api/session");
  if (!response.ok) {
    throw new Error(`Could not check session (${response.status})`);
  }
  return response.json();
}

export async function login(username, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Login failed (${response.status})`);
  }
  return data;
}

export async function logout() {
  const response = await fetch("/api/logout", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Logout failed (${response.status})`);
  }
  return response.json();
}