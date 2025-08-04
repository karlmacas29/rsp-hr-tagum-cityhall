import { defineStore } from 'pinia';
import { adminApi } from 'boot/axios_admin';
import { toast } from 'src/boot/toast';

export const useJobPostStore = defineStore('jobPost', {
  state: () => ({
    jobPosts: [],
    applicant: [],
    jobPostsrater: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Evaluation now expects a single object (payload)
    async evaluation(evaluationData) {
      this.error = null;
      try {
        console.log('Calling evaluation API with:', evaluationData);

        const response = await adminApi.post(
          `/job-batches-rsp/applicant/evaluation/${evaluationData.id}`,
          {
            status: evaluationData.status,
            education_remark: evaluationData.education_remark,
            experience_remark: evaluationData.experience_remark,
            training_remark: evaluationData.training_remark,
            eligibility_remark: evaluationData.eligibility_remark, // <-- correct spelling!
          },
        );

        console.log('Evaluation response:', response.data);
        toast.success('Evaluation submitted successfully!');
        return response.data;
      } catch (error) {
        console.error('Evaluation API error:', error);
        this.error = error;
        toast.error('Error submitting evaluation.');
        throw error;
      }
    },

    async fetch_applicant(id) {
      this.loading = true;
      try {
        const { data } = await adminApi.get(`/job-batches-rsp/applicant/view/${id}`);
        this.applicant = data.applicants;
        this.error = null;
      } catch (error) {
        this.error = error;
        toast.error('Failed to fetch applicants.');
      } finally {
        this.loading = false;
      }
    },

    async checkJobHasApplicants(id) {
      try {
        await this.fetch_applicant(id);
        return this.applicant && this.applicant.length > 0;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return false;
        }
        console.error('Error checking applicants:', error);
        return true;
      }
    },

    async fetchJobPosts() {
      this.loading = true;
      try {
        const { data } = await adminApi.get('/job-batches-rsp');
        this.jobPosts = data;
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async job_post_list() {
      this.loading = true;
      try {
        const { data } = await adminApi.get('/job-batches-rsp/list');
        this.jobPosts = data;
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async job_post() {
      this.loading = true;
      try {
        const { data } = await adminApi.get('/job-post');
        this.jobPosts = data;
        this.error = null;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async fetchJobPostByPositionAndItemNo(PositionID, ItemNo) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get(`/job-batches-rsp/${PositionID}/${ItemNo}`);
        this.jobPosts = response.data;
        return response.data;
      } catch (err) {
        this.error = err;
        toast.error('Failed to fetch job post: ' + (err.response?.data?.message || err.message));
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchCriteriaByPositionAndItemNo(PositionID, ItemNo) {
      this.loading = true;
      try {
        const { data } = await adminApi.get(`/on-criteria-job/${PositionID}/${ItemNo}`);
        this.error = null;
        return data;
      } catch (err) {
        this.error = err;
        toast.error('Failed to fetch Criteria: ' + (err.response?.data?.message || err.message));
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async insertJobPost({ jobBatch, criteria }) {
      console.log('result:');
      console.log(jobBatch);
      console.log(criteria);
      this.loading = true;
      try {
        const { data: batch } = await adminApi.post('/job-batches-rsp', jobBatch);
        criteria.PositionID = batch.PositionID || batch.id;
        await adminApi.post('/on-criteria-job', criteria);

        this.error = null;
        return batch;
      } catch (err) {
        this.error = err;
        console.error('Error inserting job post:', err);
        toast.error('Failed => ' + err);
      } finally {
        this.loading = false;
      }
    },

    async updateJobPost({ id, jobBatch, criteria, criteriaId }) {
      this.loading = true;
      try {
        const { data: batch } = await adminApi.put(`/job-batches-rsp/${id}`, jobBatch);
        await adminApi.put(`/on-criteria-job/${criteriaId}`, criteria);

        this.error = null;
        return batch;
      } catch (err) {
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteJobPost({ id }) {
      this.loading = true;
      try {
        await adminApi.delete(`/job/delete/${id}`);
        this.error = null;
      } catch (err) {
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
