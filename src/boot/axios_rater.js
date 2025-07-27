import { boot } from 'quasar/wrappers';
import axios from 'axios';

const raterApi = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  // withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

raterApi.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('rater_token='))?.split('=')[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default boot(({ app }) => {
  app.config.globalProperties.$raterApi = raterApi;
});

export { raterApi };
