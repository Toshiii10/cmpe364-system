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
  if (!response.ok) {
    throw new Error(`Could not create record (${response.status})`);
  }
  return response.json();
}

export async function updateRecord(id, payload) {
  const response = await fetch(`/api/records/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Could not update record (${response.status})`);
  }
  return response.json();
}

export async function deleteRecordApi(id) {
  const response = await fetch(`/api/records/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Could not delete record (${response.status})`);
  }
  return response.json();
}