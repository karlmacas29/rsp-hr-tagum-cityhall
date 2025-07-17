import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  optionSuccessStatus: 200,
  headers:{
    Accept:'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  },
    withCredentials: true,
});

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Include the token in the Authorization header
  }

  return config;
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
