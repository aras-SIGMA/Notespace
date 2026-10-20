const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const json = await response.json();

    if (!response.ok || json.status !== 'success') {
      const errorMessage = json.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return json;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    }
    throw error;
  }
};

export const fetchActiveNotes = async () => {
  const result = await request('/notes', { method: 'GET' });
  return result.data || [];
};

export const fetchArchivedNotes = async () => {
  const result = await request('/notes/archived', { method: 'GET' });
  return result.data || [];
};

export const createNote = async ({ title, body }) => {
  const result = await request('/notes', {
    method: 'POST',
    body: JSON.stringify({ title, body }),
  });
  return result.data;
};

export const deleteNote = async (id) => {
  const result = await request(`/notes/${id}`, {
    method: 'DELETE',
  });
  return result;
};

export const archiveNote = async (id) => {
  const result = await request(`/notes/${id}/archive`, {
    method: 'POST',
  });
  return result;
};

export const unarchiveNote = async (id) => {
  const result = await request(`/notes/${id}/unarchive`, {
    method: 'POST',
  });
  return result;
};
