import { apiRequest } from './apiService';

/**
 * Authentication service for Managing Session tokens, User data caches, and API calls.
 */
export const authService = {
  /**
   * Performs user login API request
   * @param {string} phone 
   * @param {string} password 
   * @returns {Promise<Object>} containing logged-in user details
   */
  async login(phone, password) {
    const responseData = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });

    if (responseData.status === 'success' && responseData.data) {
      const { user, token } = responseData.data;
      
      // Store session details
      localStorage.setItem('oneqr_token', token);
      localStorage.setItem('oneqr_current_user', JSON.stringify(user));

      // Notify other modules of session changes
      window.dispatchEvent(new Event('auth-state-change'));
      
      return {
        user,
        token,
        message: responseData.message,
      };
    }

    throw new Error(responseData.message || 'Authentication failed. Please check credentials.');
  },

  /**
   * Performs user signup registration API request
   * @param {string} phone 
   * @param {string} password 
   * @returns {Promise<Object>} containing signup result status
   */
  async signup(phone, password) {
    const responseData = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    return responseData;
  },

  /**
   * Resets and clears the user storage session
   */
  logout() {
    localStorage.removeItem('oneqr_token');
    localStorage.removeItem('oneqr_current_user');
    window.dispatchEvent(new Event('auth-state-change'));
  },

  /**
   * Fetches the current user profile dynamically from server
   * @returns {Promise<Object>} updated user profile
   */
  async getProfile() {
    const responseData = await apiRequest('/auth/me', {
      method: 'GET',
    });

    if (responseData.status === 'success' && responseData.data?.user) {
      const userProfile = responseData.data.user;
      localStorage.setItem('oneqr_current_user', JSON.stringify(userProfile));
      return userProfile;
    }

    throw new Error(responseData.message || 'Unable to retrieve user profile.');
  },

  /**
   * Retrieves the cached user information from localStorage
   * @returns {Object|null} user details
   */
  getCurrentUser() {
    try {
      const cached = localStorage.getItem('oneqr_current_user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error('Failed to parse cached user:', e);
      return null;
    }
  },

  /**
   * Retrieves the cached session token from localStorage
   * @returns {string|null} token
   */
  getToken() {
    return localStorage.getItem('oneqr_token');
  },

  /**
   * Updates user account profile details (email, password)
   * @param {Object} data 
   * @param {string} [data.email] 
   * @param {string} [data.password] 
   * @returns {Promise<Object>} containing updated user details
   */
  async updateProfile(data) {
    const responseData = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (responseData.status === 'success' && responseData.data?.user) {
      const userProfile = responseData.data.user;
      localStorage.setItem('oneqr_current_user', JSON.stringify(userProfile));
      
      // Notify other modules of session changes
      window.dispatchEvent(new Event('auth-state-change'));
      
      return userProfile;
    }

    throw new Error(responseData.message || 'Unable to update user profile.');
  },

  /**
   * Checks if user has a valid stored token session
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  }
};
