import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { toast } from 'src/boot/toast' // Import toast instance

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    isAuthenticated: false,
    user: null, // Store user information
  }),

  actions: {
    async login(username, password) {
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
        } else {
          toast.error('Login Failed!')
        }
      } catch (error) {
        // Handle inactive user or other errors
        if (error.response?.status === 403) {
          toast.error('Your account is inactive. Please contact the administrator.')
        }
        toast.error('An error occurred during login')
      }
    },

    async logout() {
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
      } catch {
        toast.error('An error occurred during logout or token error')
      }
    },

    async checkAuth() {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1]

      if (token) {
        const res = await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // console.log(res.data)
        this.token = token
        this.isAuthenticated = true
        this.user = res.data
        // Optionally, fetch user info from the backend if needed
        // Example: this.fetchUser();
      } else {
        this.token = null
        this.isAuthenticated = false
        this.user = null
      }
    },
  },
})
