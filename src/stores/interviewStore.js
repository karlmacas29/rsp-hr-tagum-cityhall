import { defineStore } from 'pinia';
import { adminApi } from 'boot/axios_admin';

export const useInterviewStore = defineStore('interview', {
  state: () => ({
    interviews: [],
    availableApplicants: [],
    loading: false,
    loadingApplicants: false,
    error: null,
  }),

  actions: {
    async fetchInterviews() {
      try {
        this.loading = true;
        const response = await adminApi.get('/applicant/schedule/list');
        this.interviews = response.data;
        this.error = null;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching interviews:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchAvailableApplicants() {
      try {
        this.loadingApplicants = true;
        const response = await adminApi.get('/applicant/schedule');
        this.availableApplicants = response.data;
        this.error = null;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching available applicants:', err);
      } finally {
        this.loadingApplicants = false;
      }
    },

    async fetchBatchDetails(date, time = null) {
      try {
        this.loadingApplicants = true;

        // Build URL with parameters
        let url = `/applicant/schedule/details/${date}`;
        if (time && time !== 'Not Set') {
          // Clean time format - remove AM/PM if present
          const cleanTime = time.replace(/\s*(AM|PM)\s*/i, '').trim();
          url += `/${cleanTime}`;
        }

        const response = await adminApi.get(url);
        this.batchDetails = response.data?.data || response.data || null;
        this.error = null;
        return this.batchDetails;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching batch details:', err);
        throw err;
      } finally {
        this.loadingApplicants = false;
      }
    },

    async scheduleInterview(scheduleData) {
      try {
        this.loading = true;
        const response = await adminApi.post('/email/send/interview', scheduleData, {
          validateStatus: (status) => status < 500,
        });
        this.error = null;
        return response;
      } catch (err) {
        console.error('Error scheduling interview:', err.message || err);
        return { data: { success: false, message: 'An error occurred' } };
      } finally {
        this.loading = false;
      }
    },
  },
});
