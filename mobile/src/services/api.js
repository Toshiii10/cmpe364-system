export const API_BASE_URL = "http://192.168.0.100:5000";

export async function getRecords() {
  const response = await fetch(`${API_BASE_URL}/api/records`);

  if (!response.ok) {
    throw new Error(`Could not load records (${response.status})`);
  }

  return response.json();
}

export async function createRecord(payload) {
  const response = await fetch(`${API_BASE_URL}/api/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.error || `Could not create record (${response.status})`
    );
    error.status = response.status;
    error.fieldErrors = data?.errors || null;
    throw error;
  }

  if (
    !data ||
    !Number.isInteger(data.id) ||
    typeof data.title !== "string" ||
    !["open", "closed"].includes(data.status)
  ) {
    throw new Error(
      "Unexpected create response. Reload the list before retrying."
    );
  }

  return data;
}