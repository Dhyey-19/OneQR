import { apiRequest } from './apiService';

/**
 * Authentication service for Managing Admin Session tokens and user profiles.
 */
export const authService = {
  /**
   * Performs admin login API request
   * @param {string} phone 
   * @param {string} password 
   * @returns {Promise<Object>} containing logged-in admin details
   */
  async login(phone, password) {
    const responseData = await apiRequest('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });

    if (responseData.status === 'success' && responseData.data) {
      const { admin, token } = responseData.data;
      
      // Store session details
      localStorage.setItem('oneqr_admin_token', token);
      localStorage.setItem('oneqr_admin_current_user', JSON.stringify(admin));

      // Notify other modules of session changes
      window.dispatchEvent(new Event('admin-auth-state-change'));
      
      return {
        admin,
        token,
        message: responseData.message,
      };
    }

    throw new Error(responseData.message || 'Authentication failed. Please check credentials.');
  },

  /**
   * Resets and clears the admin storage session
   */
  logout() {
    localStorage.removeItem('oneqr_admin_token');
    localStorage.removeItem('oneqr_admin_current_user');
    window.dispatchEvent(new Event('admin-auth-state-change'));
  },

  /**
   * Fetches the current admin profile from server
   * @returns {Promise<Object>} updated admin profile
   */
  async getProfile() {
    const responseData = await apiRequest('/admin/auth/me', {
      method: 'GET',
    });

    if (responseData.status === 'success' && responseData.data?.admin) {
      const adminProfile = responseData.data.admin;
      localStorage.setItem('oneqr_admin_current_user', JSON.stringify(adminProfile));
      return adminProfile;
    }

    throw new Error(responseData.message || 'Unable to retrieve admin profile.');
  },

  /**
   * Retrieves the cached admin information from localStorage
   * @returns {Object|null} admin details
   */
  getCurrentUser() {
    try {
      const cached = localStorage.getItem('oneqr_admin_current_user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error('Failed to parse cached admin:', e);
      return null;
    }
  },

  /**
   * Retrieves the cached session token from localStorage
   * @returns {string|null} token
   */
  getToken() {
    return localStorage.getItem('oneqr_admin_token');
  },

  /**
   * Checks if admin has a valid stored token session
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  }
};
