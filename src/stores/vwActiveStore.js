import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const use_vwActiveStore = defineStore('vwactive', {
  state: () => ({
    vw_active: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetch_vwActive() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/vw-Active')
        // this.vw_active = response.data
        // console.log(response.data)
        return response.data.data
      } catch (err) {
        this.error = 'Failed to load raters.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})
