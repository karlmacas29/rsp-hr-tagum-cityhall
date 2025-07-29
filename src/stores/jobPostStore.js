import { defineStore } from 'pinia';
import { adminApi } from 'boot/axios_admin'; // Make sure you have Axios boot file configured in Quasar
import { toast } from 'src/boot/toast'; // Import toast instance

export const useJobPostStore = defineStore('jobPost', {
  state: () => ({
    jobPosts: [],
    applicant: [],

    loading: false,
    error: null,
  }),
  actions: {
    // criteria
    //  async fetch_office_position() {
    //   this.loading = true;
    //   try {
    //     // Adjust the endpoint as needed to join or fetch both details
    //     const { data } = await adminApi.get('/job-batches-rsp/office');
    //     this.office_position = data;
    //     this.error = null;
    //   } catch (err) {
    //     this.error = err;
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    //fetch the applicant base on the job post he apply
    async fetch_applicant(id) {
      this.loading = true;
      try {
        const { data } = await adminApi.get(`/job-batches-rsp/applicant/view/${id}`);
        this.applicant = data.applicants; // Make sure your API sends applicants array
        this.error = null;
      } catch (error) {
        this.error = error;
        toast.error('Failed to fetch applicants.');
      } finally {
        this.loading = false;
      }
    },

    //fetch job post
    async fetchJobPosts() {
      this.loading = true;
      try {
        // Adjust the endpoint as needed to join or fetch both details
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
        // Adjust the endpoint as needed to join or fetch both details
        const { data } = await adminApi.get('/job-batches-rsp/list');
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

      try {
        // Assuming the API endpoint is structured to accept PositionID and ItemNo as path parameters
        // e.g., /adminApi/job-batches-rsp/{PositionID}/{ItemNo}
        // Or as query parameters: /adminApi/job-batches-rsp?PositionID={PositionID}&ItemNo={ItemNo}
        // Adjust the URL formatting as per your API's actual route definition.
        // Using path parameters as it's common for 'show' methods with multiple identifiers.
        const { data } = await adminApi.get(`/job-batches-rsp/${PositionID}/${ItemNo}`);
        this.error = null;
        console.log(data);
        return data;
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
        // Assuming the API endpoint is structured to accept PositionID and ItemNo as path parameters
        // e.g., /adminApi/on-criteria-job/{PositionID}/{ItemNo}
        const { data } = await adminApi.get(`/on-criteria-job/${PositionID}/${ItemNo}`);
        this.error = null;
        // console.log('criteria data by PositionID and ItemNo:');
        // console.log(data);
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
        // Insert job_batches_rsp first
        const { data: batch } = await adminApi.post('/job-batches-rsp', jobBatch);

        // Insert on_criteria_job with PositionID from batch if needed
        criteria.PositionID = batch.PositionID || batch.id;
        await adminApi.post('/on-criteria-job', criteria);

        this.error = null;
        toast.success('Job post created successfully!');
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
        // Update job_batches_rsp
        const { data: batch } = await adminApi.put(`/job-batches-rsp/${id}`, jobBatch);

        // Update on_criteria_job
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

    async deleteJobPost({ id, criteriaId }) {
      this.loading = true;
      try {
        await adminApi.delete(`/job-batches-rsp/${id}`);
        await adminApi.delete(`/on-criteria-job/${criteriaId}`);
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
