const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper function to perform client HTTP fetch requests with automatic JWT attachment
 * @param {string} endpoint - The target path, e.g., '/auth/login'
 * @param {Object} options - Standard fetch options (method, headers, body, etc.)
 * @returns {Promise<any>}
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('oneqr_token');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await response.json();
  } catch (err) {
    // Return empty object if JSON parsing fails (e.g. empty response)
  }

  if (!response.ok) {
    throw new Error(data.message || 'Network response was not OK. Please try again.');
  }

  return data;
};
