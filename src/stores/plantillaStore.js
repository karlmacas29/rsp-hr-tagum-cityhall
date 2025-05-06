import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { toast } from 'src/boot/toast'; // Import toast instance

export const usePlantillaStore = defineStore('plantilla', {
  state: () => ({
    plantilla: [],
    plantillaData: [],
    qsData: [],
    qsLoad: false,
    loading: false,
    error: null,
    selectedDetails: null,
  }),

  actions: {
    async fetchPlantilla() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/plantilla');

        // console.log(response.data) // Debugging

        if (Array.isArray(response.data)) {
          this.plantilla = response.data;
        } else {
          console.error('Unexpected response format', response.data);
          this.plantilla = [];
        }
      } catch (error) {
        this.loading = false;
        console.error('Fetch error:', error); // Debugging
        toast.error('Failed to Load Plantilla');
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchPlantillaData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/plantillaData');

        // console.log(response.data) // Debugging

        if (Array.isArray(response.data)) {
          this.plantillaData = response.data;
        } else {
          console.error('Unexpected response format', response.data);
          this.plantillaData = [];
        }
      } catch (error) {
        console.error('Fetch error:', error); // Debugging
        toast.error('Failed to Load Plantilla Data');
        this.error = error;
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },

    //
    async fetchQsData(PoitionID) {
      this.qsLoad = true;
      this.error = null;
      try {
        const response = await api.post('/plantillaData/qs', {
          PositionID: PoitionID,
        });
        console.log(response.data);
        // console.log(response.data) // Debugging

        if (Array.isArray(response.data)) {
          this.qsData = response.data;
        } else {
          console.error('Unexpected response format', response.data);
          this.qsData = [];
        }
      } catch (error) {
        console.error('Fetch error:', error); // Debugging
        toast.error('Failed to Load Qs Data');
        this.error = error;
        this.qsLoad = false;
      } finally {
        this.qsLoad = false;
      }
    },
  },
});
