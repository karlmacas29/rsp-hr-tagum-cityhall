// import { defineStore } from 'pinia';
// import { api } from 'src/boot/axios';
// import { toast } from 'src/boot/toast';

// export const useRaterStore = defineStore('raters', {
//   state: () => ({
//     raters: [],
//     ratersBatch: [],
//     savedCriteria: null,
//     loading: false,
//     error: null,
//   }),

//   actions: {

//     async fetchRatersBatch() {
//       try {
//         this.loading = true;
//         const response = await api.get('/raters_batch');
//         this.ratersBatch = response.data;
//       } catch (error) {
//         this.error = error.message || 'Failed to load raters batch';
//         console.error('Error fetching raters batch:', error);
//         toast.error(this.error);
//       } finally {
//         this.loading = false;
//       }
//     },

//     async fetchRaters() {
//       this.loading = true;
//       this.error = null;
//       try {
//         const response = await api.get('/raters');
//         this.raters = response.data;
//       } catch (error) {
//         this.error = error.message || 'Failed to load raters';
//         console.error('Error fetching raters:', error);
//         toast.error(this.error);
//       } finally {
//         this.loading = false;
//       }
//     },

//     async saveRating(ratingData) {
//       this.loading = true;
//       this.error = null;
//       try {
//         if (!api) {
//           throw new Error('API client not initialized');
//         }

//         if (!ratingData.criteria) {
//           throw new Error('Criteria data is missing');
//         }

//         const dataToSend = JSON.parse(JSON.stringify(ratingData));
//         const response = await api.post('/ratings', dataToSend);

//         if (response.data) {
//           if (response.data.error) {
//             throw new Error(response.data.error);
//           }

//           this.updateRaterCriteria(ratingData.raterId, ratingData.criteria);
//           this.savedCriteria = JSON.parse(JSON.stringify(ratingData.criteria));

//           toast.success('Rating saved successfully');
//           return response.data;
//         }
//         throw new Error('Invalid response from server');
//       } catch (error) {
//         this.error = error.message || 'Failed to save rating';
//         console.error('Save rating error:', {
//           error: error.response?.data || error.message,
//           requestData: ratingData
//         });
//         toast.error(this.error);
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     updateRaterCriteria(raterId, newCriteria) {
//       const raterIndex = this.raters.findIndex((r) => r.id === raterId);
//       if (raterIndex !== -1) {
//         this.raters[raterIndex].criteria = JSON.parse(JSON.stringify(newCriteria));
//       }

//       const batchIndex = this.ratersBatch.findIndex((r) => r.id === raterId);
//       if (batchIndex !== -1) {
//         this.ratersBatch[batchIndex].criteria = JSON.parse(JSON.stringify(newCriteria));
//       }
//     },

//     async savePositionCriteria(positionData) {
//       this.loading = true;
//       this.error = null;
//       try {
//         if (!api) {
//           throw new Error('API client not initialized');
//         }

//         if (!positionData.position || !positionData.office || !positionData.criteria) {
//           throw new Error('Position, office, and criteria are required');
//         }

//         const payload = {
//           position: positionData.position,
//           office: positionData.office,
//           criteria: positionData.criteria,
//           ...(positionData.salaryGrade && { salaryGrade: positionData.salaryGrade }),
//           ...(positionData.plantillaItemNo && { plantillaItemNo: positionData.plantillaItemNo })
//         };

//         const response = await api.post('/criteria', payload);

//         if (response.data) {
//           if (response.data.error) {
//             throw new Error(response.data.error);
//           }

//           this.savedCriteria = {
//             ...payload,
//             id: response.data.id || Date.now()
//           };

//           toast.success('Criteria saved successfully');
//           return response.data;
//         }
//         throw new Error('Invalid response from server');
//       } catch (error) {
//         this.error = error.message || 'Failed to save criteria';
//         console.error('Save criteria error:', {
//           error: error.response?.data || error.message,
//           requestData: positionData
//         });
//         toast.error(this.error);
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     async getCriteria(position, office) {
//       this.loading = true;
//       this.error = null;
//       try {
//         const response = await api.get('/ratings/criteria', {
//           params: { position, office },
//         });

//         if (response.data &&
//             response.data.education &&
//             response.data.experience &&
//             response.data.training &&
//             response.data.performance) {
//           return response.data;
//         }
//         return null;
//       } catch (error) {
//         this.error = error.message || 'Failed to load criteria';
//         console.error('Error fetching criteria:', error);
//         return null;
//       } finally {
//         this.loading = false;
//       }
//     },
//   },

//   getters: {
//     hasRaters: (state) => state.raters.length > 0,
//     hasBatchRaters: (state) => state.ratersBatch.length > 0,
//     isLoading: (state) => state.loading,
//     lastError: (state) => state.error,
//     getSavedCriteria: (state) => state.savedCriteria,
//   },
// });
