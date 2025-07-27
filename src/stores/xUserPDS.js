import { defineStore } from 'pinia';
import { adminApi } from 'src/boot/axios_admin';
import { toast } from 'src/boot/toast'; // Import toast instance

export const usexPDS = defineStore('xPDS', {
  state: () => ({
    xPDS: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchxPDS(controlno) {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('admin_token='))
          ?.split('=')[1];

        this.loading = true;
        const response = await adminApi.post(
          '/xPDS',
          {
            controlno,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        this.xPDS = response.data;
        // console.log(response.data);
        this.error = null;
      } catch (err) {
        this.error = err.message;
        toast.error('Error Fetching PDS');
      } finally {
        this.loading = false;
      }
    },
  },
});
