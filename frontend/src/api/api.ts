// API utility for connecting frontend to json-server backend
// const API_BASE = 'http://localhost:3000';
const API_BASE = `${window.location.protocol}//${window.location.hostname}:3000`;


export async function getBirthRecords() {
  const res = await fetch(`${API_BASE}/birthRecords`);
  if (!res.ok) throw new Error('Failed to fetch birth records');
  return res.json();
}

export async function deleteBirthRecord(id: string) {
  const res = await fetch(`${API_BASE}/birthRecords/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete birth record');
  return true;
}

export async function getDeathRecords() {
  const res = await fetch(`${API_BASE}/deathRecords`);
  if (!res.ok) throw new Error('Failed to fetch death records');
  return res.json();
}

export async function deleteDeathRecord(id: string) {
  const res = await fetch(`${API_BASE}/deathRecords/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete death record');
  return true;
}
// Add more API functions as needed for create/update 