import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

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
          .find((row) => row.startsWith('auth_token='))
          ?.split('=')[1];

        this.loading = true;
        const response = await api.post(
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
        console.log(response.data);
        this.error = null;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching xPDS:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});
