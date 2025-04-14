import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { toast } from 'src/boot/toast' // Import toast instance

export const useRaterStore = defineStore('raters', {
  state: () => ({
    raters: [],
    ratersBatch: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRatersBatch() {
      try {
        const response = await api.get('/raters_batch') // Replace with your Laravel API URL (this api perform CRUD so Read is Get to get data it was use by Laravel apiResources)
        this.ratersBatch = response.data
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to Load Raters Batch')
      }
    },
    async fetchRaters() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/raters')
        this.raters = response.data
        console.log(response.data)
      } catch {
        this.error = 'Failed to load raters.'
        toast.error('Failed to Load Raters')
      } finally {
        this.loading = false
      }
    },
  },
})
