export const API_BASE_URL = "http://192.168.0.100:5000";

export async function getRecords() {
  const response = await fetch(`${API_BASE_URL}/api/records`);

  if (!response.ok) {
    throw new Error(`Could not load records (${response.status})`);
  }

  return response.json();
}