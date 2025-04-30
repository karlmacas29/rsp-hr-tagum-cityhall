import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { toast } from 'src/boot/toast';

export const useRaterStore = defineStore('raters', {
  state: () => ({
    raters: [],
    ratersBatch: [],
    savedCriteria: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRatersBatch() {
      try {
        this.loading = true;
        const response = await api.get('/raters_batch');
        this.ratersBatch = response.data;
      } catch (error) {
        this.error = error.message || 'Failed to load raters batch';
        console.error('Error fetching raters batch:', error);
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async fetchRaters() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/raters');
        this.raters = response.data;
      } catch (error) {
        this.error = error.message || 'Failed to load raters';
        console.error('Error fetching raters:', error);
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async saveRating(ratingData) {
      this.loading = true;
      this.error = null;
      try {
        if (!api) {
          throw new Error('API client not initialized');
        }

        const response = await api.post('/ratings', ratingData);

        if (response.data && response.data.success) {
          // Update the rater's criteria in both arrays
          this.updateRaterCriteria(ratingData.raterId, ratingData.criteria);

          // Store the saved criteria separately
          this.savedCriteria = ratingData.criteria;

          toast.success('Rating saved successfully');
          return response.data;
        } else {
          throw new Error(response.data?.message || 'Failed to save rating');
        }
      } catch (error) {
        this.error = error.message || 'Failed to save rating';
        console.error('Save rating error:', error);
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    updateRaterCriteria(raterId, newCriteria) {
      // Update in main raters array
      const raterIndex = this.raters.findIndex((r) => r.id === raterId);
      if (raterIndex !== -1) {
        this.raters[raterIndex].criteria = newCriteria;
      }

      // Update in ratersBatch array
      const batchIndex = this.ratersBatch.findIndex((r) => r.id === raterId);
      if (batchIndex !== -1) {
        this.ratersBatch[batchIndex].criteria = newCriteria;
      }
    },

    async getCriteria(position, office) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/ratings/criteria', {
          params: { position, office },
        });
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to load criteria';
        console.error('Error fetching criteria:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
