// stores/rater_store.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { raterApi } from 'boot/axios_rater';

export const use_rater_store = defineStore('rater', () => {
  const assignedJobs = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const criteria_applicant = ref({
    criteria: [],
    applicants: [],
  });

  const dashboardStats = computed(() => {
    const stats = {
      totalAssignedJobs: assignedJobs.value.length,
      ratedPositions: 0, // Only count completed (submitted) jobs
    };

    console.log('Computing dashboard stats for jobs:', assignedJobs.value.length);

    assignedJobs.value.forEach((job) => {
      console.log(`Job ${job.id}: status=${job.status}, submitted=${job.submitted}`);

      // Count completed ratings - check if submitted is true (regardless of status)
      // or if status indicates completion
      if (
        job.submitted === true ||
        job.status === 'rated' ||
        job.status === 'assessed' ||
        job.status === 'Occupied'
      ) {
        stats.ratedPositions++;
        console.log(`Job ${job.id} counted as completed`);
      }
    });

    console.log('Final dashboard stats:', stats);
    return stats;
  });
  const saveDraft = async (applicantsData, jobId) => {
    loading.value = true;
    error.value = null;

    console.log('Raw applicant data received:', applicantsData);

    const payload = applicantsData.map((applicant) => {
      return {
        id: applicant.id,
        nPersonalInfo_id: applicant.nPersonalInfo_id,
        ControlNo: applicant.ControlNo,
        job_batches_rsp_id: jobId,
        education_score: parseFloat(applicant.education_score || applicant.educationScore || null),
        experience_score: parseFloat(
          applicant.experience_score || applicant.experienceScore || null,
        ),
        training_score: parseFloat(applicant.training_score || applicant.trainingScore || null),
        performance_score: parseFloat(
          applicant.performance_score || applicant.performanceScore || null,
        ),
        behavioral_score: parseFloat(
          applicant.behavioral_score || applicant.behavioralScore || null,
        ),
        total_qs: parseFloat(applicant.total_qs || null),
        grand_total: parseFloat(applicant.grand_total || null),
        ranking: parseInt(applicant.ranking || null),
      };
    });

    console.log('Final payload to submit to API:', JSON.stringify(payload, null, 2));

    try {
      const response = await raterApi.post('/rating/draft', payload);
      console.log('API Response:', response.data);

      if (response.data.success) {
        return response.data;
      } else {
        error.value = response.data.message || 'Something went wrong.';
        return { success: false, error: error.value };
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      console.error('Submit Ratings Error:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const submitRatings = async (applicantsData, jobId) => {
    loading.value = true;
    error.value = null;

    console.log('Raw applicant data received:', applicantsData);

    const payload = applicantsData.map((applicant) => {
      return {
        id: applicant.id,
        nPersonalInfo_id: applicant.nPersonalInfo_id,
        ControlNo: applicant.ControlNo,
        job_batches_rsp_id: jobId,
        education_score: parseFloat(applicant.education_score || applicant.educationScore || null),
        experience_score: parseFloat(
          applicant.experience_score || applicant.experienceScore || null,
        ),
        training_score: parseFloat(applicant.training_score || applicant.trainingScore || null),
        performance_score: parseFloat(
          applicant.performance_score || applicant.performanceScore || null,
        ),
        behavioral_score: parseFloat(
          applicant.behavioral_score || applicant.behavioralScore || null,
        ),
        total_qs: parseFloat(applicant.total_qs || null),
        grand_total: parseFloat(applicant.grand_total || null),
        ranking: parseInt(applicant.ranking || null),
      };
    });

    console.log('Final payload to submit to API:', JSON.stringify(payload, null, 2));

    try {
      const response = await raterApi.post('/rating/score', payload);
      console.log('API Response:', response.data);

      if (response.data.success) {
        await fetch_assigned_jobs();
        return response.data;
      } else {
        error.value = response.data.message || 'Something went wrong.';
        return { success: false, error: error.value };
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      console.error('Submit Ratings Error:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const fetch_criteria_applicant = async (id) => {
    loading.value = true;
    error.value = null;

    criteria_applicant.value = {
      criteria: [],
      applicants: [],
    };

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('rater_token='))
        ?.split('=')[1];

      if (!token) throw new Error('No authentication token found');

      console.log(`Fetching data for job ID: ${id}`);

      const { data } = await raterApi.get(`/rater/criteria/applicant/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API Response for job', id, ':', data);

      if (data.status) {
        criteria_applicant.value = {
          criteria: data.criteria || [],
          applicants: data.applicants || [],
        };

        console.log(`Stored criteria_applicant for job ${id}:`, criteria_applicant.value);
        console.log(
          `Number of applicants for job ${id}:`,
          criteria_applicant.value.applicants.length,
        );
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

  const clearCriteriaApplicant = () => {
    criteria_applicant.value = {
      criteria: [],
      applicants: [],
    };
  };

  const fetch_assigned_jobs = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('rater_token='))
        ?.split('=')[1];

      if (!token) throw new Error('No authentication token found');

      const { data } = await raterApi.get('/rater/assigned-job-batches', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.status && data.assigned_jobs?.length) {
        assignedJobs.value = data.assigned_jobs.map((job) => ({
          id: job.id,
          position: job.Position,
          office: job.Office,
          submitted: job.submitted,
          status: job.status,
          ...job,
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
    clearCriteriaApplicant,
    submitRatings,
    saveDraft,
    dashboardStats,
  };
});
