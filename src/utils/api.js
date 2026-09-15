const API_URL = '/api';

export async function apiRequest(path, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  };

  try {
    const stored = window.localStorage.getItem('alumni_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        options.headers['Authorization'] = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${path}`, options);
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed with status ${response.status}`);
  }
  
  return response.json();
}
