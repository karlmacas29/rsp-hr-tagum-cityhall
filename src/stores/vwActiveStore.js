import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { toast } from 'src/boot/toast' // Import toast instance

export const use_vwActiveStore = defineStore('vwactive', {
  state: () => ({
    vw_active: [],
    vw_status: [],
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
      } catch {
        toast.error('Failed to Load vwactive')
      } finally {
        this.loading = false
      }
    },
    //
    async fetchStatus(status) {
      this.loading = true
      const jsonEncode = {
        status: status,
      }
      try {
        const response = await api.post('/vw-Active/status', jsonEncode)
        this.vw_status = response.data.data
      } catch (error) {
        this.vw_status = []
        this.loading = false
        console.log(error.response.data?.message)
        toast.warning(error.response.data?.message)
      } finally {
        this.loading = false
      }
    },
  },
})
