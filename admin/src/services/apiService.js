const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper function to perform admin HTTP fetch requests with automatic JWT attachment
 * @param {string} endpoint - The target path, e.g., '/admin/auth/login'
 * @param {Object} options - Standard fetch options (method, headers, body, etc.)
 * @returns {Promise<any>}
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('oneqr_admin_token');

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
    // Return empty object if JSON parsing fails
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('oneqr_admin_token');
      localStorage.removeItem('oneqr_admin_current_user');
      window.dispatchEvent(new Event('admin-auth-state-change'));
    }
    throw new Error(data.message || 'Network response was not OK. Please try again.');
  }

  return data;
};
