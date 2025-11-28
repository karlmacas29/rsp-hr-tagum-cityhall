import { defineStore } from 'pinia';
import { adminApi } from 'src/boot/axios_admin';

export const useLogsStore = defineStore('logs', {
  state: () => ({
    logs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchLogs() {
      try {
        this.loading = true;
        // const response = await adminApi.get('/logs');
        const response = await adminApi.get('/activity_log');

        this.logs = response.data;
        console.log(response.data)
        this.error = null;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching logs:', err);
      } finally {
        this.loading = false;
      }
    },

    async logAction(actions) {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('admin_token='))
        ?.split('=')[1];
      try {
        await adminApi.post(
          '/logs/auth',
          { action: actions },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (e) {
        console.log(e);
      }
    },
  },
});
