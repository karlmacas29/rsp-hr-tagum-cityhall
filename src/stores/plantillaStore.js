import { defineStore } from 'pinia';
import { adminApi } from 'src/boot/axios_admin';
import { toast } from 'src/boot/toast'; // Import toast instance

export const usePlantillaStore = defineStore('plantilla', {
  state: () => ({
    plantilla: [],
    office: [],
    plantillaData: [],
    qsData: [],
    qsLoad: false,
    loading: false,
    error: null,
    selectedDetails: null,
  }),

  actions: {
    // async fetchPlantilla() {
    //   this.loading = true;
    //   this.error = null;
    //   try {
    //     const response = await adminApi.get('/plantilla');

    //     // console.log(response.data); // Debugging

    //     if (Array.isArray(response.data)) {
    //       this.plantilla = response.data;
    //     } else {
    //       console.error('Unexpected response format', response.data);
    //       this.plantilla = [];
    //     }
    //   } catch (error) {
    //     this.loading = false;
    //     console.error('Fetch error:', error); // Debugging
    //     toast.error('Failed to Load Plantilla');
    //     this.error = error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async fetchPlantilla() {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get('/plantilla');
        this.plantilla = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to Load Plantilla');
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    //  // NEW: fetch plantilla filtered by office
    //     async fetchPlantillaByOffice(office) {
    //       this.loading = true;
    //       this.error = null;
    //       try {
    //         const response = await adminApi.get('/plantilla', {
    //           params: { office },
    //         });
    //         this.plantilla = Array.isArray(response.data) ? response.data : [];
    //       } catch (error) {
    //         console.error('Fetch error:', error);
    //         toast.error('Failed to Load Plantilla for selected office');
    //         this.plantilla = [];
    //         this.error = error;
    //       } finally {
    //         this.loading = false;
    //       }
    //     },

    async fetch_office_rater() {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get('/office');

        // console.log(response.data); // Debugging

        if (Array.isArray(response.data)) {
          this.office = response.data;
        } else {
          console.error('Unexpected response format', response.data);
          this.office = [];
        }
      } catch (error) {
        this.loading = false;
        console.error('Fetch error:', error); // Debugging
        toast.error('Failed to Load office');
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchEmployeeList() {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get('/employee/list');

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

    async fetchAppointmentData(ControlNo) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.get(`plantilla/appointment/${ControlNo}`);

        console.log('Appointment data:', response.data); // Debugging

        if (response.data && response.data.length > 0) {
          // Transform the data to match your template structure
          const appointmentData = response.data[0];

          // Access the first element of each array
          const plantillaInfo = appointmentData.active?.[0];
          const tempRegInfo = appointmentData.temp_reg_appointments?.[0];
          const reorgExtInfo = appointmentData.temp_reg_appointment_reorg_ext?.[0];
          const x_personal = appointmentData.x_personal?.[0];

          const transformedData = {
            // Basic Info
            SalaryAnnual: appointmentData.RateYear || '',
            TINNo: x_personal?.TINNo || '',
            Sex: plantillaInfo?.Sex,
            Name4: plantillaInfo?.Name4 || '',

            // Position Info
            NewDesignation: tempRegInfo?.NewDesignation || tempRegInfo?.Designation || '',
            SG: tempRegInfo?.SG || '',
            Step: tempRegInfo?.Step || '',
            Status: tempRegInfo?.Status || '',
            NewOffice: tempRegInfo?.NewOffice || tempRegInfo?.Office || '',
            MRate: tempRegInfo?.MRate || '',
            ItemNo: tempRegInfo?.ItemNo || '',
            Pages: tempRegInfo?.Pages || '',

            // Appointment Details
            Renew: tempRegInfo?.Renew || '',
            vicecause: tempRegInfo?.vicecause || '',
            sepcause: tempRegInfo?.sepcause || '',
            sepdate: tempRegInfo?.sepdate || '',

            // Date Range
            FromDate: appointmentData.FromDate || '',
            ToDate: appointmentData.ToDate || '',

            // Extended Info from temp_reg_appointment_reorg_ext
            PresAppro: reorgExtInfo?.PresAppro || '',
            PrevAppro: reorgExtInfo?.PrevAppro || '',
            SalAuthorized: reorgExtInfo?.SalAuthorized || '',
            OtherComp: reorgExtInfo?.OtherComp || '',
            SupPosition: reorgExtInfo?.SupPosition || '',
            HSupPosition: reorgExtInfo?.HSupPosition || '',
            Tool: reorgExtInfo?.Tool || '',

            // Contact Requirements
            Contact1: reorgExtInfo?.Contact1 || '',
            Contact2: reorgExtInfo?.Contact2 || '',
            Contact3: reorgExtInfo?.Contact3 || '',
            Contact4: reorgExtInfo?.Contact4 || '',
            Contact5: reorgExtInfo?.Contact5 || '',
            Contact6: reorgExtInfo?.Contact6 || '',
            ContactOthers: reorgExtInfo?.ContactOthers || '',

            // Working Conditions
            Working1: reorgExtInfo?.Working1 || '',
            Working2: reorgExtInfo?.Working2 || '',
            WorkingOthers: reorgExtInfo?.WorkingOthers || '',

            // Descriptions
            DescriptionSection: reorgExtInfo?.DescriptionSection || '',
            DescriptionFunction: reorgExtInfo?.DescriptionFunction || '',

            // Standards/Qualifications
            StandardEduc: reorgExtInfo?.StandardEduc || '',
            StandardExp: reorgExtInfo?.StandardExp || '',
            StandardTrain: reorgExtInfo?.StandardTrain || '',
            StandardElig: reorgExtInfo?.StandardElig || '',

            // Supervisor
            Supervisor: reorgExtInfo?.Supervisor || '',

            // Competency Levels
            Core1: reorgExtInfo?.Core1 || '0',
            Core2: reorgExtInfo?.Core2 || '0',
            Core3: reorgExtInfo?.Core3 || '0',
            Corelevel1: reorgExtInfo?.Corelevel1 || '0',
            Corelevel2: reorgExtInfo?.Corelevel2 || '0',
            Corelevel3: reorgExtInfo?.Corelevel3 || '0',
            Corelevel4: reorgExtInfo?.Corelevel4 || '0',

            // Leadership Levels
            Leader1: reorgExtInfo?.Leader1 || '0',
            Leader2: reorgExtInfo?.Leader2 || '0',
            Leader3: reorgExtInfo?.Leader3 || '0',
            Leader4: reorgExtInfo?.Leader4 || '0',
            leaderlevel1: reorgExtInfo?.leaderlevel1 || '0',
            leaderlevel2: reorgExtInfo?.leaderlevel2 || '0',
            leaderlevel3: reorgExtInfo?.leaderlevel3 || '0',
            leaderlevel4: reorgExtInfo?.leaderlevel4 || '0',

            // Structure ID
            StructureID: tempRegInfo?.StructureID || reorgExtInfo?.structureid || '',

            // Additional Fields
            DivCode: tempRegInfo?.DivCode || '',
            SecCode: tempRegInfo?.SecCode || '',
            OffCode: tempRegInfo?.OffCode || '',
            DesigCode: tempRegInfo?.DesigCode || '',
            Official: tempRegInfo?.Official || '0',
            Groupcode: tempRegInfo?.Groupcode || '',
            group: tempRegInfo?.group || '',
            unitcode: tempRegInfo?.unitcode || '',

            // Default/Configurable Values
            vicemayor: 'ATTY. EVA LORRAINE E. ESTABILLO',
            cityaccountant: 'RAMIL Y. TIU, CPA',
            HR: 'JANYLENE A. PALERMO, MM',
            admin: 'EDGAR C. DE GUZMAN',
            mayor: 'REY T. UY',
            resolution: '',
            resolutionYear: '',
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
    },
  },
});
