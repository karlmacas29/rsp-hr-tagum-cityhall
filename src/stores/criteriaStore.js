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

    // New getter to transform the current criteria into a more usable format
    formattedCurrentCriteria: (state) => {
      if (!state.currentCriteria) return null;

      return {
        education: {
          weight: parseFloat(state.currentCriteria.education[0]?.Rate) || 0,
          title: state.currentCriteria.education[0]?.description?.split('->')[0]?.trim() || '',
          description: state.currentCriteria.education[0]?.description || '',
        },
        experience: {
          weight: parseFloat(state.currentCriteria.experience[0]?.Rate) || 0,
          title: state.currentCriteria.experience[0]?.description?.split('->')[0]?.trim() || '',
          description: state.currentCriteria.experience[0]?.description || '',
        },
        training: {
          weight: parseFloat(state.currentCriteria.training[0]?.Rate) || 0,
          title: state.currentCriteria.training[0]?.description?.split('->')[0]?.trim() || '',
          description: state.currentCriteria.training[0]?.description || '',
        },
        performance: {
          weight: parseFloat(state.currentCriteria.performance[0]?.Rate) || 0,
          title: state.currentCriteria.performance[0]?.description?.split('->')[0]?.trim() || '',
          description: state.currentCriteria.performance[0]?.description || '',
        },
        behavioral: {
          weight: parseFloat(state.currentCriteria.behavioral[0]?.Rate) || 0,
          title: state.currentCriteria.behavioral[0]?.description?.split('->')[0]?.trim() || '',
          description: state.currentCriteria.behavioral[0]?.description || '',
        },
      };
    },
  },

  actions: {
    async saveCriteria({ jobBatchesRspIds, criteria }) {
      this.loading = true;
      this.error = null;
      try {
        const payload = {
          job_batches_rsp_id: jobBatchesRspIds,
          education: {
            Rate: String(criteria.education.weight),
            description: [
              criteria.education.title,
              criteria.education.description,
              ...criteria.education.additionalFields.filter((f) => f && f.trim() !== ''),
            ].filter(Boolean),
          },
          experience: {
            Rate: String(criteria.experience.weight),
            description: [
              criteria.experience.title,
              criteria.experience.description,
              ...criteria.experience.additionalFields.filter((f) => f && f.trim() !== ''),
            ].filter(Boolean),
          },
          training: {
            Rate: String(criteria.training.weight),
            description: [
              criteria.training.title,
              criteria.training.description,
              ...criteria.training.additionalFields.filter((f) => f && f.trim() !== ''),
            ].filter(Boolean),
          },
          performance: {
            Rate: String(criteria.performance.weight),
            description: [
              criteria.performance.title,
              criteria.performance.description,
              ...criteria.performance.additionalFields.filter((f) => f && f.trim() !== ''),
            ].filter(Boolean),
          },
          behavioral: {
            Rate: String(criteria.bei.weight),
            description: [
              criteria.bei.title,
              criteria.bei.description,
              ...criteria.bei.additionalFields.filter((f) => f && f.trim() !== ''),
            ].filter(Boolean),
          },
        };

        const response = await adminApi.post('store/criteria', payload);

        const savedCriteria = {
          id: response.data.id || Date.now(),
          job_batches_rsp_id: jobBatchesRspIds,
          ...payload,
        };

        this.criteriaList = this.criteriaList.filter((existing) => {
          if (Array.isArray(existing.job_batches_rsp_id)) {
            return !existing.job_batches_rsp_id.some((id) => jobBatchesRspIds.includes(id));
          }
          return !jobBatchesRspIds.includes(existing.job_batches_rsp_id);
        });

        this.criteriaList.push(savedCriteria);
        toast.success('Criteria saved successfully!');
        return savedCriteria;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        toast.error(this.error);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllCriteria() {
      this.loading = true;
      try {
        const response = await adminApi.get('criteria/all');
        this.criteriaList = response.data || [];
        return this.criteriaList;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('Error fetching criteria:', this.error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchCriteriaById(id) {
      this.loading = true;
      try {
        const response = await adminApi.get(`criteria/${id}`);
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // New action to view criteria by job_batches_rsp_id
    async viewCriteria(jobBatchesRspId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get(`view/criteria/${jobBatchesRspId}`);
        this.currentCriteria = response.data;
        return this.currentCriteria;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        if (err.response?.status === 404) {
          this.currentCriteria = null;
        }
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteCriteria(id) {
      this.loading = true;
      try {
        await adminApi.delete(`criteria/${id}`);
        this.criteriaList = this.criteriaList.filter((criteria) => criteria.id !== id);
        toast.success('Criteria deleted successfully!');
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        toast.error(this.error);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Helper methods
    clearCurrentCriteria() {
      this.currentCriteria = null;
    },

    clearCriteria() {
      this.criteriaList = [];
      this.currentCriteria = null;
    },
  },
});
