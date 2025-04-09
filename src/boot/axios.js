import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.1.10:8000/api', // Ensure this matches your backend URL
})

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1]

  if (token) {
    config.headers.Authorization = `Bearer ${token}` // Include the token in the Authorization header
  }

  return config
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
