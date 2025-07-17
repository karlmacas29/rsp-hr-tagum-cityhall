import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import { toast } from 'src/boot/toast';
import { useLogsStore } from 'stores/logsStore';
import { usePlantillaStore } from 'stores/plantillaStore';

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

  // Actions
  async function Rater_register(userData) {
    loading.value = true;
    errors.value = {};

    try {
      const authToken = getToken();
      if (!authToken) {
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
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status) {
        await get_all_raters();
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
      handleError(error, error.message || 'Failed to register rater');
      return {
        success: false,
        message: error.message || 'Failed to register rater'
      };
    } finally {
      loading.value = false;
      const logsStore = useLogsStore();
      await logsStore.logAction('Registered New Rater');
    }
  }

  async function login(username, password) {
    errors.value = {};
    loading.value = true;
    
    try {
      const response = await api.post('/rater/login', { username, password });

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
          toast.error(error.response.data.message || 'Your account is inactive. Please contact the administrator.');
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

  async function logout() {
    loading.value = true;
    const authToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('rater_token='))
      ?.split('=')[1];
      
    try {
      await api.post('/logout', null, {
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

 async function get_all_raters() {
  loadUser.value = true;
  try {
    const authToken = getToken();
    if (!authToken) {
      throw new Error('No authentication token found');
    }

    const response = await api.get('/rater/list', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data.status) {
      users.value = Object.values(response.data.data).map(rater => ({
        id: rater.id,
        name: rater.name,  // Changed from Rater to name for consistency
        office: rater.office || 'No office assigned',
        username: rater.username || rater.name.toLowerCase().replace(/\s+/g, ''),
        job_batches_rsp: rater.job_batches_rsp || 'No positions assigned',
        pending: 0,
        completed: 0,
        actions: '',
      }));

      loadUser.value = false;
      return users.value;
    } else {
      toast.error('Failed to retrieve raters');
      loadUser.value = false;
      return [];
    }
  } catch (error) {
    handleError(error, 'Failed to retrieve raters');
    loadUser.value = false;
    return [];
  }
}


async function get_rater_usernames() {
  loadUser.value = true;
  try {
    const response = await api.get('/rater/name');

    if (response.data.status) {
      users.value = response.data.data.map(rater => ({
        id: rater.id,
        name: rater.name,
        office: rater.office || 'No office assigned',
        username: rater.username || rater.name.toLowerCase().replace(/\s+/g, '')
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

  async function checkAuth() {
    const authToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('rater_token='))
      ?.split('=')[1];

    if (authToken) {
      try {
        const res = await api.get('/user', {
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
    Rater_register,
    login,
    logout,
    get_all_raters,
    getToken,
    checkAuth,
    handleError,
    get_rater_usernames
  };
});