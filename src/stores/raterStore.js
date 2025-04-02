import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

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
        console.log(response.data)
      } catch (err) {
        this.error = 'Failed to load raters.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})
