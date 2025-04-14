import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useLogsStore = defineStore('logs', {
  state: () => ({
    logs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchLogs() {
      try {
        this.loading = true
        const response = await api.get('/logs')
        this.logs = response.data
        console.log(response.data)
        this.error = null
      } catch (err) {
        this.error = err.message
        console.error('Error fetching logs:', err)
      } finally {
        this.loading = false
      }
    },
    async logAction(actions) {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1]
      try {
        await api.post(
          '/logs/auth',
          { action: actions },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      } catch (e) {
        console.log(e)
      }
    },
  },
})
