import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { toast } from 'src/boot/toast' // Import toast instance
import { useLogsStore } from 'stores/logsStore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    isAuthenticated: false,
    user: null, // Store user information
    loading: false,
    errors: [],
  }),

  actions: {
    // Login function
    async login(username, password) {
      this.errors = {} // Clear previous errors
      this.loading = true // Set loading state
      try {
        const response = await api.post('/login', { username, password })

        if (response.data.status) {
          this.token = response.data.token
          this.isAuthenticated = true
          this.user = response.data.user // Save user info, including name and position

          // Save the token in a cookie
          document.cookie = `auth_token=${this.token}; path=/; SameSite=None; Secure`

          // Redirect to the dashboard
          toast.success('You are now logged in!')
          this.router.push({ name: 'Admin Dashboard' })
          this.loading = false // Set loading state
        } else {
          this.loading = false // Set loading state
          toast.error('Login Failed!')
        }
      } catch (error) {
        // Handle inactive user or other errors
        if (error.response?.status === 403) {
          this.loading = false // Set loading state
          toast.error('Your account is inactive. Please contact the administrator.')
        } else if (error.response?.status === 0 || !error.response) {
          this.loading = false
          toast.error('Unable to connect to the server. Please check your internet connection.')
        } else {
          this.loading = false
        }
        // console.log(error.response.data.errors)
        this.loading = false // Set loading state
        this.errors = error.response.data.errors
        // toast.error('An error occurred during login')
      } finally {
        const logsStore = useLogsStore()
        await logsStore.logAction('Logged In')
      }
    },
    // Logout function when it has token
    async logout() {
      this.loading = true // Set loading state
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1]
      try {
        await api.post('/logout', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Clear the local state
        this.token = null
        this.isAuthenticated = false
        this.user = null
        this.errors = {} // Clear previous errors
        this.loading = false // Set loading state
        // Remove the token from cookies (try multiple variants to ensure deletion)
        const cookieSettings = [
          'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
          'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
          'auth_token=; path=/; domain=' +
            window.location.hostname +
            '; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
        ]
        cookieSettings.forEach((setting) => (document.cookie = setting))

        toast.success('Logout Success!')
        this.router.push({ name: 'Admin Login' })
      } catch (error) {
        toast.error('An error occurred during logout or token error')
        console.log(error)
        this.router.push({ name: 'Admin Login' })
      }
    },
    // checking if the user is authenticated
    async checkAuth() {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1]

      if (token) {
        try {
          const res = await api.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          // console.log(res.data)
          this.token = token
          this.isAuthenticated = true
          this.user = res.data
          this.errors = {}
          this.loading = false
        } catch (error) {
          toast.error('Error: ' + error.response.data.message)
          // Clear all auth-related state and cookies
          this.token = null
          this.isAuthenticated = false
          this.user = null
          this.errors = {}
          this.loading = false
          const cookieSettings = [
            'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
            'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure;',
            'auth_token=; path=/; domain=' +
              window.location.hostname +
              '; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
          ]
          cookieSettings.forEach((setting) => (document.cookie = setting))
          this.router.push({ name: 'Admin Login' })
        }
      } else {
        this.token = null
        this.isAuthenticated = false
        this.user = null
        this.errors = {}
        this.loading = false
      }
    },
  },
})
