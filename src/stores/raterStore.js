import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { toast } from 'src/boot/toast' // Import toast instance

export const useRaterStore = defineStore('raters', {
  state: () => ({
    raters: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRaters() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/raters')
        this.raters = response.data
      } catch {
        toast.error('Failed to Load Raters')
      } finally {
        this.loading = false
      }
    },
  },
})
