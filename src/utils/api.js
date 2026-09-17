// Base API URL: Defaults to relative '/api' for same-origin or proxied deployments (Nginx, Docker Compose, Single Service)
// Configurable via VITE_API_URL (e.g. https://api.projectalma.com) for decoupled deployments (Vercel + Render)
const RAW_API_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const API_URL = RAW_API_URL ? (RAW_API_URL.endsWith('/api') ? RAW_API_URL : `${RAW_API_URL}/api`) : '/api';

/**
 * Resolves uploaded or static asset URLs across monolithic and decoupled architectures.
 * @param {string} filePath - Path such as '/uploads/avatar-123.png' or external URL
 * @returns {string} Fully qualified or normalized URL
 */
export function getFileUrl(filePath) {
  if (!filePath) return '';
  if (filePath.startsWith('data:') || filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('blob:')) {
    return filePath;
  }
  const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return RAW_API_URL ? `${RAW_API_URL}${cleanPath}` : cleanPath;
}

/**
 * Upload a media file (Image, Video, or PDF) to the backend upload endpoint.
 * Works seamlessly whether hosted on the same origin or decoupled (e.g. Vercel + Render).
 * @param {FormData} formData - FormData containing the 'file' field
 * @returns {Promise<{success: boolean, url: string, fileName: string, mediaType: string}>}
 */
export async function uploadFile(formData) {
  const uploadUrl = RAW_API_URL ? `${API_URL}/upload` : '/api/upload';
  const options = {
    method: 'POST',
    body: formData,
    credentials: 'include'
  };

  try {
    const stored = window.localStorage.getItem('alumni_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        options.headers = {
          'Authorization': `Bearer ${parsed.token}`
        };
      }
    }
  } catch {
    // Ignore parse errors
  }

  const res = await fetch(uploadUrl, options);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || `Upload failed with status ${res.status}`);
  }
  return res.json();
}

export async function apiRequest(path, method = 'GET', data = null) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
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

  const response = await fetch(`${API_URL}${normalizedPath}`, options);
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed with status ${response.status}`);
  }
  
  return response.json();
}
