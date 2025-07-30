import { defineStore } from 'pinia';
import { ref } from 'vue';
import { raterApi } from 'boot/axios_rater';
import { toast } from 'src/boot/toast';
import { useLogsStore } from 'stores/logsStore';
// import { usePlantillaStore } from 'stores/plantillaStore';

export const useRaterAuthStore = defineStore('rater_auth', () => {
  // State
  const token = ref(null);
  const isAuthenticated = ref(false);
  const user = ref(null);
  const loading = ref(false);
  const loadUser = ref(false);
  const errors = ref([]);
  const users = ref([]);
  const selectedUser = ref(null);

  // Helper functions
  function getToken() {
    if (token.value) {
      return token.value;
    }

    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('rater_token='))
      ?.split('=')[1];
  }

  async function login(username, password) {
    errors.value = {};
    loading.value = true;

    try {
      const response = await raterApi.post('/rater/login', { username, password });

      if (response.data.status) {
        token.value = response.data.token;
        isAuthenticated.value = true;
        user.value = response.data.user;

        document.cookie = `rater_token=${token.value}; path=/; SameSite=None; Secure`;

        toast.success('You are now logged in!');
        loading.value = false;
      } else {
        loading.value = false;
        if (response.data.errors?.role_id) {
          toast.error(response.data.errors.role_id[0] || 'Login Failed!');
        } else {
          toast.error(response.data.message || 'Login Failed!');
        }
      }
    } catch (error) {
      if (error.response?.status === 403) {
        if (error.response.data.errors?.role_id) {
          toast.error(error.response.data.errors.role_id[0]);
        } else {
          toast.error(
            error.response.data.message ||
              'Your account is inactive. Please contact the administrator.',
          );
        }
      } else if (error.response?.status === 0 || !error.response) {
        toast.error(' Please check your internet connection and try again later.');
      } else {
        toast.error('Login Failed!');
      }
      errors.value = error.response?.data?.errors || {};
      loading.value = false;
    } finally {
      const logsStore = useLogsStore();
      await logsStore.logAction('Logged In');
    }
  }

  function handleError(error, defaultMessage) {
    if (error.response?.status === 401) {
      toast.error('Your session has expired. Please log in again.');
      logout();
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
      toast.error('Validation error. Please check the form.');
    } else if (error.response?.status === 0 || !error.response) {
      // toast.error('Unable to connect to the server. Please check your internet connection.');
    } else {
      console.error(error);
      toast.error(defaultMessage);
    }
  }

  async function changePassword({ old_password, new_password, new_password_confirmation }) {
    errors.value = {};
    loading.value = true;

    try {
      const response = await raterApi.post(
        '/rater/changepassword',
        {
          old_password,
          new_password,
          new_password_confirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (response.data.status) {
        if (response.data.token) {
          token.value = response.data.token;
          document.cookie = `rater_token=${response.data.token}; path=/; secure; samesite=strict`;
        }

        if (user.value) {
          user.value.password_updated_at = new Date().toISOString();
        }
        toast.success('Password changed successfully!');
        return true;
      } else {
        if (response.data.errors) {
          errors.value = response.data.errors;
          // Show specific error messages if available
          if (response.data.errors.old_password) {
            toast.error(response.data.errors.old_password[0] || 'Current password is incorrect');
          } else {
            toast.error('Please check the form for errors');
          }
        } else {
          toast.error(response.data.message || 'Failed to change password');
        }
        return false;
      }
    } catch (error) {
      handleError(error, 'Failed to change password');
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    const authToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('rater_token='))
      ?.split('=')[1];

    try {
      await raterApi.post('/rater/logout', null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      token.value = null;
      isAuthenticated.value = false;
      user.value = null;
      errors.value = {};
      loading.value = false;

      const cookieSettings = [
        'rater_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
        'rater_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
        'rater_token=; path=/; domain=' +
          window.location.hostname +
          '; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
      ];
      cookieSettings.forEach((setting) => (document.cookie = setting));

      toast.success('Logout Success!');
      this.router.push({ name: 'Rater Login' });
    } catch (error) {
      toast.error('An error occurred during logout or token error');
      console.log(error);
      this.router.push({ name: 'Rater Login' });
    }
  }

  async function get_rater_usernames() {
    loadUser.value = true;
    try {
      const response = await raterApi.get('/rater/name');

      if (response.data.status) {
        users.value = response.data.data.map((rater) => ({
          id: rater.id,
          name: rater.name,
          office: rater.office || 'No office assigned',
          username: rater.username || rater.name.toLowerCase().replace(/\s+/g, ''),
        }));

        return users.value;
      } else {
        toast.error('Failed to retrieve raters');
        return [];
      }
    } catch (error) {
      handleError(error, 'Failed to retrieve raters');
      return [];
    } finally {
      loadUser.value = false;
    }
  }

  async function checkAuth_rater() {
    const authToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('rater_token='))
      ?.split('=')[1];

    if (authToken) {
      try {
        const res = await raterApi.get('/rater', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        token.value = authToken;
        isAuthenticated.value = true;
        user.value = res.data.data;
        errors.value = {};
        loading.value = false;
      } catch (error) {
        toast.error('Error: ' + error.response.data.message);
        token.value = null;
        isAuthenticated.value = false;
        user.value = null;
        errors.value = {};
        loading.value = false;

        const cookieSettings = [
          'rater_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
          'rater_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
          'rater_token=; path=/; domain=' +
            window.location.hostname +
            '; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
        ];
        cookieSettings.forEach((setting) => (document.cookie = setting));
      }
    } else {
      token.value = null;
      isAuthenticated.value = false;
      user.value = null;
      errors.value = {};
      loading.value = false;
    }
  }

  // Delete a user
  async function deleteUser(id) {
    this.loading = true;
    this.errors = {};

    try {
      const token = this.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await raterApi.delete(`/rater/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        // Remove the user from the users array
        this.users = this.users.filter((user) => user.id !== id);

        toast.success('Rater deleted successfully');
        this.loading = false;
        return true;
      } else {
        toast.error('Failed to delete rater');
        this.loading = false;
        return false;
      }
    } catch (error) {
      this.handleError(error, 'Failed to delete rater');
      this.loading = false;
      return false;
    } finally {
      const logsStore = useLogsStore();
      await logsStore.logAction(`Deleted User ID: ${id}`);
    }
  }

  // Return all refs and functions
  return {
    token,
    isAuthenticated,
    user,
    loading,
    loadUser,
    errors,
    users,
    selectedUser,
    // Rater_register,
    login,
    logout,
    deleteUser,
    // get_all_raters,
    getToken,
    checkAuth_rater,
    handleError,
    get_rater_usernames,
    changePassword,
  };
});
