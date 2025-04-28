import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { toast } from 'src/boot/toast' // Import toast instance

export const useRaterStore = defineStore('raters', {
  state: () => ({
    raters: [],
    ratersBatch: [],
    positionDetails: {},
    criteria: {},
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRatersBatch() {
      try {
        this.loading = true
        const response = await api.get('/raters_batch') // Replace with your Laravel API URL (this api perform CRUD so Read is Get to get data it was use by Laravel apiResources)
        this.ratersBatch = response.data
      } catch (error) {
        this.loading = false
        console.error('Error fetching data:', error)
        toast.error('Failed to Load Raters Batch')
      } finally {
        this.loading = false
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

    async fetchPositionDetails(office, position) {
      this.loading = true
      this.error = null
      try {
        // In a real app, you would make an API call like:
        const response = await api.get(`/positions/${position}`, {
          params: { office },
        })
        this.positionDetails = response.data
        return response.data
      } catch (error) {
        this.error = 'Failed to load position details.'
        toast.error('Failed to load position details')
        throw error
      } finally {
        this.loading = false
      }
    },

    async saveRating(ratingData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/ratings', ratingData)
        toast.success('Rating saved successfully')
        return response.data
      } catch (error) {
        this.error = 'Failed to save rating.'
        toast.error('Failed to save rating')
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCriteria(positionId) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/criteria/${positionId}`)
        this.criteria = response.data
        return response.data
      } catch (error) {
        this.error = 'Failed to load criteria.'
        toast.error('Failed to load criteria')
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
