import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    isAuthenticated: false,
    user: null, // Store user information
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/login', { email, password });

        if (response.data.status) {
          this.token = response.data.token;
          this.isAuthenticated = true;
          this.user = response.data.user; // Save user info, including name and position

          // Save the token in a cookie
          document.cookie = `auth_token=${this.token}; path=/; SameSite=None; Secure`;

          return true; // Login successful
        } else {
          throw new Error(response.data.message || 'Login failed');
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || 'An error occurred during login');
      }
    },

    async logout() {
      try {
        await api.post('/logout');

        // Clear the local state
        this.token = null;
        this.isAuthenticated = false;
        this.user = null;

        // Remove the token from cookies
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },

    checkAuth() {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (token) {
        this.token = token;
        this.isAuthenticated = true;

        // Optionally, fetch user info from the backend if needed
        // Example: this.fetchUser();
      } else {
        this.token = null;
        this.isAuthenticated = false;
        this.user = null;
      }
    },
  },
});
