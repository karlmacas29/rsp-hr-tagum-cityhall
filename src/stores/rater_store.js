// stores/rater_store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { raterApi } from 'boot/axios_rater';

export const use_rater_store = defineStore('rater', () => {
  const assignedJobs = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const criteria_applicant = ref({
    criteria: [],
    applicants: []
  });

  const fetch_criteria_applicant = async (id) => {
    loading.value = true;
    error.value = null;

    // CRITICAL FIX: Reset data immediately when starting new request
    criteria_applicant.value = {
      criteria: [],
      applicants: []
    };

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('rater_token='))
        ?.split('=')[1];

      if (!token) throw new Error('No authentication token found');

      console.log(`Fetching data for job ID: ${id}`);

      const { data } = await raterApi.get(`/rater/criteria/applicant/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('API Response for job', id, ':', data);

      if (data.status) {
        // Store the data directly as received from API
        criteria_applicant.value = {
          criteria: data.criteria || [],
          applicants: data.applicants || []
        };

        console.log(`Stored criteria_applicant for job ${id}:`, criteria_applicant.value);
        console.log(`Number of applicants for job ${id}:`, criteria_applicant.value.applicants.length);
      } else {
        console.warn(`API returned status false for job ${id}`);
        criteria_applicant.value = { criteria: [], applicants: [] };
      }

      return criteria_applicant.value;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      console.error(`Failed to fetch criteria and applicants for job ${id}:`, err);
      criteria_applicant.value = { criteria: [], applicants: [] };
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Add a method to clear criteria_applicant data
  const clearCriteriaApplicant = () => {
    criteria_applicant.value = {
      criteria: [],
      applicants: []
    };
  };

  const fetch_assigned_jobs = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('rater_token='))
        ?.split('=')[1];

      if (!token) throw new Error('No authentication token found');

      const { data } = await raterApi.get('/rater/assigned-job-batches', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.status && data.assigned_jobs?.length) {
        assignedJobs.value = data.assigned_jobs.map(job => ({
          id: job.id,
          position: job.Position,
          office: job.Office,
          status: 'Not Started',
        }));
      } else {
        assignedJobs.value = [];
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      console.error('Failed to fetch assigned jobs:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    assignedJobs,
    loading,
    error,
    fetch_assigned_jobs,
    criteria_applicant,
    fetch_criteria_applicant,
    clearCriteriaApplicant
  };
});
