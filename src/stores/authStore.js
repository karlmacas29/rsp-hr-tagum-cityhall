import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { toast } from 'src/boot/toast'; // Import toast instance
import { useLogsStore } from 'stores/logsStore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    isAuthenticated: false,
    user: null, // Store user information
    loading: false,
    loadUser: false,
    errors: [],
    users: [], // Store list of users for management
    selectedUser: null, // Store selected user details
  }),

  actions: {
    // Login function
    async login(username, password) {
      this.errors = {}; // Clear previous errors
      this.loading = true; // Set loading state
      try {
        const response = await api.post('/login', { username, password });

        if (response.data.status) {
          this.token = response.data.token;
          this.isAuthenticated = true;
          this.user = response.data.user; // Save user info, including name and position

          // Save the token in a cookie
          document.cookie = `auth_token=${this.token}; path=/; SameSite=None; Secure`;

          // Redirect to the dashboard
          toast.success('You are now logged in!');
          this.router.push({ name: 'Admin Dashboard' });
          this.loading = false; // Set loading state
        } else {
          this.loading = false; // Set loading state
          toast.error('Login Failed!');
        }
      } catch (error) {
        // Handle inactive user or other errors
        if (error.response?.status === 403) {
          this.loading = false; // Set loading state
          toast.error('Your account is inactive. Please contact the administrator.');
        } else if (error.response?.status === 0 || !error.response) {
          this.loading = false;
          toast.error('Unable to connect to the server. Please check your internet connection.');
        } else {
          this.loading = false;
        }
        // console.log(error.response.data.errors)
        this.loading = false; // Set loading state
        this.errors = error.response.data.errors;
        // toast.error('An error occurred during login')
      } finally {
        const logsStore = useLogsStore();
        await logsStore.logAction('Logged In');
      }
    },
    // Logout function when it has token
    async logout() {
      this.loading = true; // Set loading state
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];
      try {
        await api.post('/logout', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Clear the local state
        this.token = null;
        this.isAuthenticated = false;
        this.user = null;
        this.errors = {}; // Clear previous errors
        this.loading = false; // Set loading state
        // Remove the token from cookies (try multiple variants to ensure deletion)
        const cookieSettings = [
          'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
          'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
          'auth_token=; path=/; domain=' +
            window.location.hostname +
            '; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
        ];
        cookieSettings.forEach((setting) => (document.cookie = setting));

        toast.success('Logout Success!');
        this.router.push({ name: 'Admin Login' });
      } catch (error) {
        toast.error('An error occurred during logout or token error');
        console.log(error);
        this.router.push({ name: 'Admin Login' });
      }
    },
    // checking if the user is authenticated
    async checkAuth() {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (token) {
        try {
          const res = await api.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // console.log(res);
          this.token = token;
          this.isAuthenticated = true;
          this.user = res.data.data;
          this.errors = {};
          this.loading = false;
        } catch (error) {
          toast.error('Error: ' + error.response.data.message);
          // Clear all auth-related state and cookies
          this.token = null;
          this.isAuthenticated = false;
          this.user = null;
          this.errors = {};
          this.loading = false;
          const cookieSettings = [
            'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
            'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
            'auth_token=; path=/; domain=' +
              window.location.hostname +
              '; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
          ];
          cookieSettings.forEach((setting) => (document.cookie = setting));
          this.router.push({ name: 'Admin Login' });
        }
      } else {
        this.token = null;
        this.isAuthenticated = false;
        this.user = null;
        this.errors = {};
        this.loading = false;
      }
    },

    // User Management Functions

    // Get all users
    async getAllUsers() {
      this.loadUser = true;
      this.errors = {};

      try {
        const token = this.getToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          this.users = response.data.data;
          this.loadUser = false;
          console.log(this.users);
          return this.users;
        } else {
          toast.error('Failed to retrieve users');
          this.loadUser = false;
          return [];
        }
      } catch (error) {
        this.handleError(error, 'Failed to retrieve users');
        this.loadUser = false;
        return [];
      } finally {
        const logsStore = useLogsStore();
        await logsStore.logAction('Retrieved User List');
      }
    },

    // Get a specific user by ID
    async getUserById(id) {
      this.loading = true;
      this.errors = {};
      this.selectedUser = null;

      try {
        const token = this.getToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await api.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          this.selectedUser = response.data.data;
          this.loading = false;
          return this.selectedUser;
        } else {
          toast.error('User not found');
          this.loading = false;
          return null;
        }
      } catch (error) {
        this.handleError(error, 'Failed to retrieve user details');
        this.loading = false;
        return null;
      } finally {
        const logsStore = useLogsStore();
        await logsStore.logAction(`Viewed User ID: ${id}`);
      }
    },

    // Update user details
    async updateUser(id, userData) {
      this.loading = true;
      this.errors = {};

      try {
        const token = this.getToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Format permissions for the API
        const formattedData = {
          ...userData,
          // Only include permissions if they exist
          ...(userData.permissions && {
            permissions: {
              isFunded: userData.permissions.isFunded || false,
              isUserM: userData.permissions.isUserM || false,
              isRaterM: userData.permissions.isRaterM || false,
              isCriteria: userData.permissions.isCriteria || false,
            },
          }),
        };

        const response = await api.put(`/users/${id}`, formattedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          // If the updated user is the current logged-in user, update the user state
          if (this.user && this.user.id === response.data.data.id) {
            this.user = {
              ...this.user,
              name: response.data.data.name,
              position: response.data.data.position,
              // Update permissions for currently logged-in user if applicable
              rsp_control: response.data.data.rsp_control,
            };
          }

          // Update the user in the users array if it exists
          const index = this.users.findIndex((user) => user.id === id);
          if (index !== -1) {
            this.users[index] = response.data.data;
          }

          toast.success('User updated successfully');
          this.loading = false;
          return response.data.data;
        } else {
          toast.error('Failed to update user');
          this.loading = false;
          return null;
        }
      } catch (error) {
        this.handleError(error, 'Failed to update user');
        this.loading = false;
        return null;
      } finally {
        const logsStore = useLogsStore();
        await logsStore.logAction(`Updated User ID: ${id}`);
      }
    },

    // Delete a user
    async deleteUser(id) {
      this.loading = true;
      this.errors = {};

      try {
        const token = this.getToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await api.delete(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          // Remove the user from the users array
          this.users = this.users.filter((user) => user.id !== id);

          toast.success('User deleted successfully');
          this.loading = false;
          return true;
        } else {
          toast.error('Failed to delete user');
          this.loading = false;
          return false;
        }
      } catch (error) {
        this.handleError(error, 'Failed to delete user');
        this.loading = false;
        return false;
      } finally {
        const logsStore = useLogsStore();
        await logsStore.logAction(`Deleted User ID: ${id}`);
      }
    },

    // Register new user (Admin function)
    async registerUser(userData) {
      this.loading = true;
      this.errors = {};

      try {
        const token = this.getToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Format permissions for the API
        const formattedData = {
          ...userData,
          // Only include permissions if they exist
          ...(userData.permissions && {
            permissions: {
              isFunded: userData.permissions.isFunded || false,
              isUserM: userData.permissions.isUserM || false,
              isRaterM: userData.permissions.isRaterM || false,
              isCriteria: userData.permissions.isCriteria || false,
            },
          }),
        };

        const response = await api.post('/registration', formattedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          // Refresh user list after adding a new user
          await this.getAllUsers();

          toast.success('User registered successfully');
          this.loading = false;
          return true;
        } else {
          toast.error('Failed to register user');
          this.loading = false;
          return false;
        }
      } catch (error) {
        this.handleError(error, 'Failed to register user');
        this.loading = false;
        return false;
      } finally {
        const logsStore = useLogsStore();
        await logsStore.logAction('Registered New User');
      }
    },

    // Helper function to get token
    getToken() {
      if (this.token) {
        return this.token;
      }

      return document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];
    },

    // Helper function to handle errors
    handleError(error, defaultMessage) {
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        this.logout();
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.response?.status === 422) {
        this.errors = error.response.data.errors;
        toast.error('Validation error. Please check the form.');
      } else if (error.response?.status === 0 || !error.response) {
        toast.error('Unable to connect to the server. Please check your internet connection.');
      } else {
        console.error(error);
        toast.error(defaultMessage);
      }
    },
  },
});
