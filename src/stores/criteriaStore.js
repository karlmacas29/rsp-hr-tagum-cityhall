import { defineStore } from 'pinia';
import { adminApi } from 'boot/axios_admin';
import { toast } from 'src/boot/toast';

export const useCriteriaStore = defineStore('criteria', {
  state: () => ({
    loading: false,
    error: null,
    criteriaList: [], // Store all criteria for easier access
    currentCriteria: null, // Store the currently viewed criteria details
  }),

  getters: {
    getCriteriaByJobId: (state) => (jobId) => {
      return state.criteriaList.find((criteria) =>
        Array.isArray(criteria.job_batches_rsp_id)
          ? criteria.job_batches_rsp_id.includes(jobId)
          : criteria.job_batches_rsp_id === jobId,
      );
    },

    // Getter to transform the current criteria into a more usable format
    formattedCurrentCriteria: (state) => {
      if (!state.currentCriteria) return null;

      const formatSection = (section) => {
        if (!section || !Array.isArray(section) || section.length === 0) {
          return {
            weight: 0,
            title: '',
            description: '',
            breakdownFields: [],
          };
        }

        return {
          weight: parseFloat(section[0]?.weight) || 0,
          title: section[0]?.Title || '',
          description: section[0]?.description || '',
          breakdownFields: section.map((item) => ({
            description: item.description || '',
            weight: parseInt(item.percentage || item.weight || 0),
          })),
        };
      };

      return {
        education: formatSection(state.currentCriteria.education),
        experience: formatSection(state.currentCriteria.experience),
        training: formatSection(state.currentCriteria.training),
        performance: formatSection(state.currentCriteria.performance),
        behavioral: formatSection(state.currentCriteria.behavioral),
      };
    },
  },

  actions: {
    /**
     * Save criteria
     * @param {Object} payload - The criteria payload
     */
    async saveCriteria(payload) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Store: Saving criteria with payload:', payload);

        const response = await adminApi.post('criteria/store', payload);

        console.log('Store: Full response:', response);
        console.log('Store: Response data:', response?.data);

        // Handle different response structures
        let savedCriteria;

        if (response && response.data) {
          savedCriteria = {
            id: response.data.id || response.data.criteria_rating_id || Date.now(),
            job_batches_rsp_id: payload.job_batches_rsp_id,
            education: response.data.education || payload.education,
            experience: response.data.experience || payload.experience,
            training: response.data.training || payload.training,
            performance: response.data.performance || payload.performance,
            behavioral: response.data.behavioral || payload.behavioral,
          };
        } else {
          savedCriteria = {
            id: Date.now(),
            job_batches_rsp_id: payload.job_batches_rsp_id,
            education: payload.education,
            experience: payload.experience,
            training: payload.training,
            performance: payload.performance,
            behavioral: payload.behavioral,
          };
        }

        console.log('Store: Saved criteria object:', savedCriteria);

        // Update local criteria list
        const jobId = payload.job_batches_rsp_id;
        this.criteriaList = this.criteriaList.filter((existing) => {
          if (Array.isArray(existing.job_batches_rsp_id)) {
            return !existing.job_batches_rsp_id.includes(jobId);
          }
          return existing.job_batches_rsp_id !== jobId;
        });

        this.criteriaList.push(savedCriteria);
        this.currentCriteria = savedCriteria;

        return savedCriteria;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Store: Error saving criteria:', err);
        console.error('Store: Error response:', err.response);
        toast.error(this.error || 'Failed to save criteria');
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch all criteria
     */
    async fetchAllCriteria() {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get('criteria/all');
        this.criteriaList = response.data || [];
        console.log('Store: Fetched all criteria:', this.criteriaList);
        return this.criteriaList;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Error fetching criteria:', this.error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch all salary grade criteria
     */
    async fetchAllCriteriaSG() {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get('criteria/library');
        this.criteriaList = response.data || [];
        console.log('Store: Fetched all SG criteria:', this.criteriaList);
        return this.criteriaList;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Error fetching SG criteria:', this.error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch salary grade criteria detail by ID
     */
    async fetchCriteriaSGDetail(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get(`criteria/library/details/${id}`);
        this.currentCriteria = response.data || null;
        console.log('Store: Fetched SG criteria detail:', this.currentCriteria);
        return this.currentCriteria;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Error fetching SG criteria detail:', this.error);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch suggested criteria based on salary grade
     * @param {string|number} salaryGrade - The salary grade to fetch criteria for
     */
    async fetchSuggestedCriteria(salaryGrade) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get(`criteria/sg/${salaryGrade}`);
        this.currentCriteria = response.data || null;
        console.log(
          'Store: Fetched suggested criteria for SG',
          salaryGrade,
          ':',
          this.currentCriteria,
        );
        return this.currentCriteria;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Error fetching suggested criteria:', this.error);
        // Don't throw error, just return null so we can use default criteria
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Save salary grade criteria
     */
    async saveCriteriaSG(payload) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Store: Saving SG criteria with payload:', payload);

        const response = await adminApi.post('criteria/library/store', payload);

        console.log('Store: SG criteria save response:', response.data);

        const savedCriteria = {
          id: response.data.id || response.data.criteria_library_id || Date.now(),
          ...response.data,
        };

        return savedCriteria;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Store: Error saving SG criteria:', err);
        toast.error(this.error || 'Failed to save criteria');
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update salary grade criteria
     */
    async updateCriteriaSG(id, payload) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Store: Updating SG criteria with ID:', id, 'payload:', payload);

        const response = await adminApi.post(`criteria/library/update/${id}`, payload);

        console.log('Store: SG criteria update response:', response.data);

        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Store: Error updating SG criteria:', err);
        toast.error(this.error || 'Failed to update criteria');
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete salary grade criteria
     * @param {number|string} id - The criteria library ID to delete
     */
    async deleteCriteriaSG(id) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Store: Deleting SG criteria with ID:', id);

        await adminApi.delete(`criteria/library/delete/${id}`);

        // Remove from local list
        this.criteriaList = this.criteriaList.filter((criteria) => criteria.id !== id);

        // Clear current criteria if it's the one being deleted
        if (this.currentCriteria?.id === id) {
          this.currentCriteria = null;
        }

        console.log('Store: Deleted SG criteria with ID:', id);
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Store: Error deleting SG criteria:', err);
        console.error('Store: Error response:', err.response);
        toast.error(this.error || 'Failed to delete criteria');
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch criteria by job ID
     */
    async fetchCriteriaById(jobBatchesRspId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get(`view/criteria/${jobBatchesRspId}`);
        console.log('Store: Fetched criteria by ID:', response.data);
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Error fetching criteria by ID:', this.error);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * View criteria by job_batches_rsp_id
     */
    async viewCriteria(jobBatchesRspId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get(`view/criteria/${jobBatchesRspId}`);
        this.currentCriteria = response.data;
        console.log('Store: Viewed criteria:', this.currentCriteria);
        return this.currentCriteria;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        if (err.response?.status === 404) {
          this.currentCriteria = null;
        }
        console.error('Error viewing criteria:', this.error);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete criteria
     */
    async deleteCriteria(id) {
      this.loading = true;
      this.error = null;
      try {
        await adminApi.delete(`criteria/${id}`);
        this.criteriaList = this.criteriaList.filter((criteria) => criteria.id !== id);

        if (this.currentCriteria?.id === id) {
          this.currentCriteria = null;
        }

        console.log('Store: Deleted criteria with ID:', id);
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Error deleting criteria:', this.error);
        toast.error(this.error);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear current criteria
     */
    clearCurrentCriteria() {
      this.currentCriteria = null;
      console.log('Store: Cleared current criteria');
    },

    /**
     * Clear all criteria
     */
    clearCriteria() {
      this.criteriaList = [];
      this.currentCriteria = null;
      console.log('Store: Cleared all criteria');
    },
  },
});
