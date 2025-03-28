import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [], // Store employee data
  }),

  actions: {
    async fetchEmployees() {
      try {
        const response = await api.get('/employees');
        this.employees = response.data; // Save employee data in the store
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    },
  },
});
