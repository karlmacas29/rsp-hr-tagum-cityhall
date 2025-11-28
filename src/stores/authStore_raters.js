import { defineStore } from 'pinia';
import { ref } from 'vue';
import { raterApi } from 'boot/axios_rater';
import { toast } from 'src/boot/toast';
import { useLogsStore } from 'stores/raterlogsStore';

export const useRaterAuthStore = defineStore('rater_auth', () => {
  // State - Authentication
  const token = ref(null);
  const isAuthenticated = ref(false);
  const user = ref(null);
  const loading = ref(false);
  const loadUser = ref(false);
  const errors = ref([]);
  const users = ref([]);
  const selectedUser = ref(null);

  // State - Dashboard Data
  const assignedJobsCount = ref(0);
  const completedJobsCount = ref(0);
  const pendingJobsCount = ref(0);
  const completionRate = ref('0%');
  const assignedJobs = ref([]);

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

  function extractUserData(data) {
    // Extract user information
    user.value = {
      id: data.id,
      name: data.name,
      username: data.username,
      position: data.position,
      active: data.active,
      rspControl: data.rspControl,
    };

    // Extract dashboard statistics
    assignedJobsCount.value = data.assigned_jobs_count || 0;
    completedJobsCount.value = data.completed_jobs_count || 0;
    pendingJobsCount.value = data.pending_jobs_count || 0;
    completionRate.value = data.completion_rate || '0%';
    assignedJobs.value = data.assigned_jobs || [];

    console.log('Dashboard data extracted:', {
      user: user.value.name,
      assigned: assignedJobsCount.value,
      completed: completedJobsCount.value,
      pending: pendingJobsCount.value,
      rate: completionRate.value,
      jobsCount: assignedJobs.value.length,
    });
  }

  function clearAuthState() {
    token.value = null;
    isAuthenticated.value = false;
    user.value = null;
    errors.value = {};
    loading.value = false;

    // Clear dashboard data
    assignedJobsCount.value = 0;
    completedJobsCount.value = 0;
    pendingJobsCount.value = 0;
    completionRate.value = '0%';
    assignedJobs.value = [];
  }

  function clearCookies() {
    const cookieSettings = [
      'rater_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
      'rater_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
      'rater_token=; path=/; domain=' +
        window.location.hostname +
        '; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
    ];
    cookieSettings.forEach((setting) => (document.cookie = setting));
  }

  async function login(username, password) {
    errors.value = {};
    loading.value = true;

    try {
      const response = await raterApi.post('/rater/login', { username, password });

      if (response.data.status) {
        token.value = response.data.token;
        isAuthenticated.value = true;

        // Set cookie
        document.cookie = `rater_token=${response.data.token}; path=/`;

        toast.success('You are now logged in!');

        // Fetch complete user data and dashboard stats using checkAuth_rater
        await checkAuth_rater();
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
        toast.error('Please check your internet connection and try again later.');
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
      // Network error - silent or minimal notification
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
    const authToken = getToken();

    try {
      await raterApi.post('/rater/logout', null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      clearAuthState();
      clearCookies();

      toast.success('Logout Success!');
      this.router.push({ name: 'Rater Login' });
    } catch (error) {
      toast.error('An error occurred during logout or token error');
      console.log(error);
      clearAuthState();
      clearCookies();
      this.router.push({ name: 'Rater Login' });
    } finally {
      const logsStore = useLogsStore();
      await logsStore.logAction('Logged Out');
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

  /**
   * Check authentication and fetch all user data including dashboard statistics
   * This is the single source of truth for dashboard data
   */
  async function checkAuth_rater() {
    const authToken = getToken();

    if (authToken) {
      try {
        const res = await raterApi.get('/rater', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (res.data.status && res.data.data) {
          token.value = authToken;
          isAuthenticated.value = true;

          // Extract all user and dashboard data
          extractUserData(res.data.data);

          errors.value = {};
          loading.value = false;

          console.log('Auth check successful - Dashboard data loaded');
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (error.response?.data?.message) {
          toast.error('Error: ' + error.response.data.message);
        }

        clearAuthState();
        clearCookies();
      }
    } else {
      clearAuthState();
    }
  }

  /**
   * Fetch/refresh assigned jobs and dashboard statistics
   * This is an alias for checkAuth_rater to maintain compatibility
   */
  async function fetch_assigned_jobs() {
    loading.value = true;
    console.log('Fetching assigned jobs...');

    try {
      await checkAuth_rater();
      console.log('Jobs fetched successfully:', assignedJobs.value.length);
    } catch (error) {
      console.error('Error fetching assigned jobs:', error);
      handleError(error, 'Failed to fetch assigned jobs');
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(id) {
    loading.value = true;
    errors.value = {};

    try {
      const authToken = getToken();

      if (!authToken) {
        throw new Error('No authentication token found');
      }

      const response = await raterApi.delete(`/rater/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status) {
        // Remove the user from the users array
        users.value = users.value.filter((user) => user.id !== id);

        toast.success('Rater deleted successfully');
        loading.value = false;
        return true;
      } else {
        toast.error('Failed to delete rater');
        loading.value = false;
        return false;
      }
    } catch (error) {
      handleError(error, 'Failed to delete rater');
      loading.value = false;
      return false;
    } finally {
      const logsStore = useLogsStore();
      await logsStore.logAction(`Deleted User ID: ${id}`);
    }
  }

  // Return all refs and functions
  return {
    // Authentication State
    token,
    isAuthenticated,
    user,
    loading,
    loadUser,
    errors,
    users,
    selectedUser,

    // Dashboard State
    assignedJobsCount,
    completedJobsCount,
    pendingJobsCount,
    completionRate,
    assignedJobs,

    // Methods
    login,
    logout,
    deleteUser,
    getToken,
    checkAuth_rater,
    handleError,
    get_rater_usernames,
    changePassword,
    fetch_assigned_jobs, // Alias for checkAuth_rater
    clearAuthState,
  };
});
