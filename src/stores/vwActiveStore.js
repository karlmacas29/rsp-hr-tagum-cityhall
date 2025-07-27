import { defineStore } from 'pinia';
import { adminApi } from 'src/boot/axios_admin';
import { toast } from 'src/boot/toast'; // Import toast instance

export const use_vwActiveStore = defineStore('vwactive', {
  state: () => ({
    vw_active: [],
    vw_status: [],
    totalMale: 0,
    totalFemale: 0,
    countAll: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetch_vwActive() {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get('/vw-Active');
        // this.vw_active = response.data
        // console.log(response.data)
        return response.data.data;
      } catch {
        toast.error('Failed to Load vwactive');
      } finally {
        this.loading = false;
      }
    },
    //
    async fetchStatus(status) {
      this.loading = true;
      const jsonEncode = {
        status: status,
      };
      try {
        const response = await adminApi.post('/vw-Active/status', jsonEncode);
        this.vw_status = response.data.data;
      } catch (error) {
        this.vw_status = [];
        this.loading = false;
        console.log(error.response.data?.message);
        toast.warning(error.response.data?.message);
      } finally {
        this.loading = false;
      }
    },
    async fetchCountAll() {
      this.loading = true;
      try {
        const response = await adminApi.get('/vw-Active/count');
        // console.log(response.data);
        this.countAll = response.data.total;
      } catch (error) {
        this.countAll = 0;
        console.log(error.response.data?.message);
        toast.warning(error.response.data?.message);
      } finally {
        this.loading = false;
      }
    },
    async getSexCount() {
      this.loading = true;
      this.error = null;
      try {
        // Assuming the API endpoint is '/vw-Active/sex-count'
        // based on the Laravel controller method name.
        // Ensure this route is defined in your Laravel routes file.
        const response = await adminApi.get('/vw-Active/Sex');
        // Assuming you will add totalMale and totalFemale to your state
        this.totalMale = response.data.totalMale;
        this.totalFemale = response.data.totalFemale;
        // console.log(response.data);
      } catch (error) {
        this.totalMale = 0;
        this.totalFemale = 0;
        const errorMessage = error.response?.data?.message || 'Failed to fetch sex count';
        console.log(errorMessage); // Logging error message as in other actions
        toast.warning(errorMessage); // Using toast.warning consistent with other actions
      } finally {
        this.loading = false;
      }
    },
  },
});
