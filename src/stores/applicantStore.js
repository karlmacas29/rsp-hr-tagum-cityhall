import { defineStore } from 'pinia';
import { adminApi } from 'boot/axios_admin';

export const useApplicantStore = defineStore('applicant', {
  state: () => ({
    applicants: [],
    applicantDetails: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchApplicants() {
      try {
        this.loading = true;
        const response = await adminApi.get('/applicant/list');
        this.applicants = response.data;
        this.error = null;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching applicants:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchApplicantDetail(firstname, lastname, date_of_birth) {
      try {
        this.loading = true;
        const response = await adminApi.post('/applicant/details', {
          firstname,
          lastname,
          date_of_birth,
        });
        this.applicantDetails = response.data;
        this.error = null;
        return response.data;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching applicant details:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
