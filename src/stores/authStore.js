//auth store.js
import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { toast } from 'src/boot/toast'; // Import toast instance
import { useLogsStore } from 'stores/logsStore';
import { usePlantillaStore } from 'stores/plantillaStore';


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

    async login(username, password) {
  this.errors = {}; // Clear previous errors
  this.loading = true; // Set loading state
  try {
    const response = await api.post('/login', { username, password });

    if (response.data.status) {
      this.token = response.data.token;
      this.isAuthenticated = true;
      this.user = response.data.user;

      document.cookie = `admin_token=${this.token}; path=/; SameSite=None; Secure`;

      toast.success('You are now logged in!');
      this.router.push({ name: 'Admin Dashboard' });
      this.loading = false;
    } else {
      this.loading = false;
      // Handle backend message
      if (response.data.errors?.role_id) {
        toast.error(response.data.errors.role_id[0] || 'Login Failed!');
      } else {
        toast.error(response.data.message || 'Login Failed!');
      }
    }
  } catch (error) {
    // Handle inactive user or other errors
      if (error.response?.status === 403) {
        // Handle error from backend for non-admin login
        if (error.response.data.errors?.role_id) {
          toast.error(error.response.data.errors.role_id[0]);
        } else {
          toast.error(error.response.data.message || 'Your account is inactive. Please contact the administrator.');
        }
      } else if (error.response?.status === 0 || !error.response) {
        toast.error(' Please check your internet connection and try again later.');
      } else {
        toast.error('Login Failed!');
      }
      this.errors = error.response?.data?.errors || {};
      this.loading = false;
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
        .find((row) => row.startsWith('admin_token='))
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
          'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
          'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
          'admin_token=; path=/; domain=' +
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
        .find((row) => row.startsWith('admin_token='))
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
          // console.log(res.data.data);
        } catch (error) {
          toast.error('Error: ' + error.response.data.message);
          // Clear all auth-related state and cookies
          this.token = null;
          this.isAuthenticated = false;
          this.user = null;
          this.errors = {};
          this.loading = false;
          const cookieSettings = [
            'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
            'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
            'admin_token=; path=/; domain=' +
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



    async updateUser(id, userData) {
      this.loading = true;
      this.errors = {};

      try {
        const token = this.getToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('AuthStore: Sending update request with data:', userData); // Debug log

        const response = await api.put(`/users/${id}`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // console.log('AuthStore: Received response:', response.data); // Debug log
        toast.success('User updated successfully');
        if (response.data.status) {
          // Update the user in state if it's the current user
          if (this.user && this.user.id === id) {
            this.user = {
              ...this.user,
              ...response.data.data,
            };
          }

          this.loading = false;
          return response.data.data;
        }

        this.loading = false;
        return null;
      } catch (error) {
        toast.error('Error Update User');
        console.error('AuthStore: Error in updateUser:', error.response || error); // Debug log
        this.loading = false;
        throw error;
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
              isDashboardStat: userData.permissions.isDashboardStat || false,
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
        .find((row) => row.startsWith('admin_token='))
        ?.split('=')[1];
    },


    async get_all_raters() {
   this.loadUser= true;

  try {
    const token = this.getToken();
    console.log('Auth token:', token);

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get('/rater/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('API response:', response);

    if (response.data.status) {
      console.log('Response data:', response.data.data);

      // Handle both array and object responses
      const ratersData = Array.isArray(response.data.data)
        ? response.data.data
        : Object.values(response.data.data);

      console.log('Parsed ratersData:', ratersData);

      this.users = ratersData.map(rater => ({
        id: rater.id,
        Rater: rater.name,
        Office: rater.office || 'No office assigned',
        job_batches_rsp: rater.job_batches_rsp || 'No positions assigned',
        pending: rater.pending || 0,
        completed: rater.completed || 0,
      }));
      console.log('Final users:', this.users.value);
      this.loadUser = false;
      return this.users.value;
    } else {
      console.error('Failed response message:', response.data.message);
      toast.error(response.data.message || 'Failed to retrieve raters');
      this.loadUser.value = false;
      return [];
    }
  } catch (error) {
    console.error('Request error:', error);
    this.handleError(error, 'Failed to retrieve raters');
    this.loadUser = false;
    return [];
  }
},

  // creating accoun for the rater
  async  Rater_register(userData) {
    this.loading= true;
    this.errors= {};
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const plantillaStore = usePlantillaStore();
      await plantillaStore.fetch_office_rater();
      const raterInfo = plantillaStore.plantilla.find(
        person => person.ControlNo === userData.controlNo
      );

      if (!raterInfo) {
        throw new Error('Rater not found in plantilla data');
      }

      if (!raterInfo.BirthDate) {
        throw new Error('Birthdate not available for this rater');
      }
      const date = new Date(raterInfo.BirthDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const birthdatePassword = `${year}${month}${day}`;
      const username = userData.name.replace(/\s+/g, '').toLowerCase();
      const formattedData = {
        name: username,
        username: username,
        job_batches_rsp_id: userData.job_batches_rsp_id || [],
        position: userData.position || raterInfo.Designation,
        office: userData.Office || raterInfo.Office,
        password: birthdatePassword,
        controlNo: userData.controlNo,
      };
      const response = await api.post('rater/register', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        await this.get_all_raters();
        toast.success('Rater registered successfully');
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        toast.error(response.data.message || 'Failed to register rater');
        return {
          success: false,
          message: response.data.message || 'Failed to register rater'
        };
      }
    } catch (error) {
      this.handleError(error, error.message || 'Failed to register rater');
      return {
        success: false,
        message: error.message || 'Failed to register rater'
      };
    } finally {
      this.loading = false;
      const logsStore = useLogsStore();
      await logsStore.logAction('Registered New Rater');
    }
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
