export async function getRecords() {
  const response = await fetch("/api/records");
  if (!response.ok) {
    throw new Error(`Could not load records (${response.status})`);
  }
  return response.json();
}

export async function createRecord(payload) {
  const response = await fetch("/api/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `Could not create record (${response.status})`);
    error.fieldErrors = data.errors || null;
    throw error;
  }
  return data;
}