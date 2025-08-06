import { defineStore } from 'pinia';
import { adminApi } from 'src/boot/axios_admin';
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
        const response = await adminApi.get('/plantilla');

        // console.log(response.data); // Debugging

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

    async fetch_office_rater() {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get('/plantilla/office/rater');

        // console.log(response.data); // Debugging

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
        const response = await adminApi.get('/plantillaData');

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
        const response = await adminApi.post('/plantillaData/qs', {
          PositionID: PoitionID,
        });
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


//    async fetchAppointmentData(ControlNo) {
//   this.loading = true;
//   this.error = null;
//   try {
//     const response = await adminApi.get(`plantilla/appointment/${ControlNo}`);

//     console.log('Appointment data:', response.data); // Debugging

//     if (response.data && response.data.length > 0) {
//       // Transform the data to match your template structure
//       const appointmentData = response.data[0];
//       const plantillaInfo = appointmentData.plantilla;
//       const tempRegInfo = appointmentData.temp_reg_appointments?.[0];

//       return {
//         Name4: plantillaInfo?.Name4 || '',
//         NewDesignation: tempRegInfo?.NewDesignation || tempRegInfo?.Designation || '',
//         SG: tempRegInfo?.SG || '',
//         Step: tempRegInfo?.Step || '',
//         Status: tempRegInfo?.Status || '',
//         NewOffice: tempRegInfo?.NewOffice || tempRegInfo?.Office || '',
//         MRate: tempRegInfo?.MRate || '',
//         Renew: tempRegInfo?.Renew || '',
//         vicecause: tempRegInfo?.vicecause || '',
//         ItemNo: tempRegInfo?.ItemNo || '',
//         Pages: tempRegInfo?.Pages || '',
//         FromDate: appointmentData.FromDate || '',
//         ToDate: appointmentData.ToDate || '',
//         // Add more fields as needed
//         mayor: 'REY T. UY', // Default or from data
//         resolution: '', // Add if available in your data
//         resolutionYear: '', // Add if available in your data
//       };
//     }

//     return null;
//   } catch (error) {
//     console.error('Fetch appointment error:', error);
//     toast.error('Failed to load appointment data');
//     this.error = error;
//     return null;
//   } finally {
//     this.loading = false;
//   }
// }


async fetchAppointmentData(ControlNo) {
  this.loading = true;
  this.error = null;
  try {
    const response = await adminApi.get(`plantilla/appointment/${ControlNo}`);

    console.log('Appointment data:', response.data); // Debugging

    if (response.data && response.data.length > 0) {
      // Transform the data to match your template structure
      const appointmentData = response.data[0];

      // Fix: plantilla is an array, so access the first element
      const plantillaInfo = appointmentData.plantilla?.[0]; // <- Changed this line
      const tempRegInfo = appointmentData.temp_reg_appointments?.[0];

      const transformedData = {
        Name4: plantillaInfo?.Name4 || '',
        NewDesignation: tempRegInfo?.NewDesignation || tempRegInfo?.Designation || '',
        SG: tempRegInfo?.SG || '',
        Step: tempRegInfo?.Step || '',
        Status: tempRegInfo?.Status || '',
        NewOffice: tempRegInfo?.NewOffice || tempRegInfo?.Office || '',
        MRate: tempRegInfo?.MRate || '',
        Renew: tempRegInfo?.Renew || '',
        vicecause: tempRegInfo?.vicecause || '',
        sepcause: tempRegInfo?.sepcause || '', // Added this field
        ItemNo: tempRegInfo?.ItemNo || '',
        Pages: tempRegInfo?.Pages || '',
        FromDate: appointmentData.FromDate || '',
        ToDate: appointmentData.ToDate || '',
        // Add more fields as needed
        mayor: 'REY T. UY', // Default or from data
        resolution: '', // Add if available in your data
        resolutionYear: '', // Add if available in your data
      };

      console.log('Transformed data:', transformedData); // Debug the transformed data

      return transformedData;
    }

    return null;
  } catch (error) {
    console.error('Fetch appointment error:', error);
    toast.error('Failed to load appointment data');
    this.error = error;
    return null;
  } finally {
    this.loading = false;
  }
}
  },
});
