<template>
  <q-dialog v-model="show" persistent>
    <q-card class="bg-white modal-card column no-wrap">
      <!-- Header -->
      <q-card-section class="row items-center justify-between q-pa-md bg-grey-2">
        <div class="text-h6">Edit Employee Reports</div>
        <q-btn flat dense icon="close" @click="close" aria-label="Close dialog" />
      </q-card-section>

      <q-separator />

      <!-- Loading State -->
      <div v-if="loading" class="column items-center justify-center q-pa-xl">
        <q-spinner color="primary" size="48px" />
        <div class="q-mt-md text-grey-7">Loading employee data...</div>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Tabs -->
        <q-tabs v-model="tab" class="bg-white text-primary" align="left" dense>
          <q-tab name="appointment" label="Appointment Report" />
          <q-tab name="certification" label="Certification" />
          <q-tab name="position" label="Position Description" />
        </q-tabs>

        <q-separator />

        <!-- Content (Scrollable Edit Forms) -->
        <div class="q-pa-md overflow-auto" style="flex: 1; min-height: 0">
          <AppointmentEditForm
            v-if="tab === 'appointment'"
            :data="editedData"
            @update="handleDataUpdate"
          />
          <CertificationEditForm
            v-else-if="tab === 'certification'"
            :data="editedData"
            @update="handleDataUpdate"
          />
          <PositionEditForm
            v-else-if="tab === 'position'"
            :data="editedData"
            @update="handleDataUpdate"
          />
        </div>

        <q-separator />

        <!-- Footer -->
        <q-card-actions align="right" class="q-pa-sm">
          <q-btn
            color="positive"
            icon="save"
            label="Save Changes"
            unelevated
            :disable="!hasChanges || saving"
            :loading="saving"
            @click="saveChanges"
          />
          <q-btn flat label="Close" color="primary" @click="close" />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { useQuasar } from 'quasar';
  import AppointmentEditForm from 'src/components/Reports/EditAppointmentForm.vue';
  import CertificationEditForm from 'src/components/Reports/EditCertificationForm.vue';
  import PositionEditForm from 'src/components/Reports/EditPositionDescriptionForm.vue';
  import { usePlantillaStore } from 'src/stores/plantillaStore.js';
  import { adminApi } from 'src/boot/axios_admin';

  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    employee: { type: Object, required: true },
  });
  const emit = defineEmits(['update:modelValue', 'close', 'saved']);

  const $q = useQuasar();
  const plantillaStore = usePlantillaStore();

  const show = ref(props.modelValue);
  const saving = ref(false);
  const loading = ref(false);
  const tab = ref('appointment');

  // Store edited data
  const editedData = ref({});
  const originalData = ref({});
  const completeEmployeeData = ref(null);

  watch(
    () => props.modelValue,
    (val) => (show.value = val),
  );

  watch(show, (val) => emit('update:modelValue', val));

  // Fetch complete employee data from backend
  async function fetchCompleteEmployeeData(controlNo) {
    loading.value = true;
    try {
      console.log('Fetching complete employee data for ControlNo:', controlNo);

      // Fetch the appointment data which includes all related tables
      const appointmentData = await plantillaStore.fetchAppointmentData(controlNo);

      if (appointmentData) {
        completeEmployeeData.value = appointmentData;
        originalData.value = JSON.parse(JSON.stringify(appointmentData));
        editedData.value = JSON.parse(JSON.stringify(appointmentData));

        console.log('Complete employee data loaded:', completeEmployeeData.value);
      } else {
        throw new Error('Failed to load employee data');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to load employee data',
        position: 'top',
      });
    } finally {
      loading.value = false;
    }
  }

  // Initialize data when modal opens
  watch(
    () => props.employee,
    async (employee) => {
      if (employee?.ControlNo && props.modelValue) {
        await fetchCompleteEmployeeData(employee.ControlNo);
      }
    },
    { immediate: true },
  );

  // Also fetch when modal opens
  watch(
    () => props.modelValue,
    async (isOpen) => {
      if (isOpen && props.employee?.ControlNo) {
        await fetchCompleteEmployeeData(props.employee.ControlNo);
      }
    },
  );

  // Check if there are unsaved changes
  const hasChanges = computed(() => {
    return JSON.stringify(editedData.value) !== JSON.stringify(originalData.value);
  });

  // Handle updates from edit forms
  function handleDataUpdate(updatedData) {
    editedData.value = { ...editedData.value, ...updatedData };
    console.log('Data updated:', editedData.value);
  }

  function close() {
    if (hasChanges.value) {
      $q.dialog({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to close?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        show.value = false;
        emit('close');
      });
    } else {
      show.value = false;
      emit('close');
    }
  }

  async function saveChanges() {
    if (!hasChanges.value) {
      $q.notify({
        type: 'info',
        message: 'No changes to save',
        position: 'top',
      });
      return;
    }

    try {
      saving.value = true;

      // Get the raw employee data to extract personal info
      let personalData = {};

      // Fetch personal data from the employee list
      try {
        const response = await adminApi.get(`/employee/${props.employee.ControlNo}`);
        if (response.data) {
          personalData = response.data;
          console.log('Personal data from API:', personalData);
        }
      } catch (error) {
        console.warn('Could not fetch personal data, using defaults:', error);
      }

      // Build complete payload with all required fields
      const payload = {
        // Personal Information (required by backend)
        tempId: personalData.value.tempId || '',
        Surname: editedData.value.Surname || '',
        Address: personalData.Address,
        Firstname: editedData.value.Firstname || '',
        MIddlename: editedData.value.MIddlename || '',
        Sex: editedData.value.Sex || personalData.Sex || '',
        CivilStatus: personalData.CivilStatus || editedData.value.CivilStatus || 'SINGLE',
        BirthDate: personalData.BirthDate || editedData.value.BirthDate || '',

        // Appointment Data (from edited data)
        ...editedData.value,

        // Ensure all required fields have values
        sepdate: editedData.value.sepdate || new Date().toISOString().split('T')[0],
        sepcause: editedData.value.sepcause || 'N/A',
        vicename: editedData.value.vicename || '',
        vicecause: editedData.value.vicecause || '',

        // Appropriation fields (required)
        PresAppro: editedData.value.PresAppro || 'N/A',
        PrevAppro: editedData.value.PrevAppro || 'N/A',
        SalAuthorized: editedData.value.SalAuthorized || editedData.value.MRate || '0',
        OtherComp: editedData.value.OtherComp || '0',

        // Supervision fields (required)
        SupPosition: editedData.value.SupPosition || 'N/A',
        HSupPosition: editedData.value.HSupPosition || 'N/A',

        // Contact fields with default '0' for frequency
        Contact1: editedData.value.Contact1 || '0',
        Contact2: editedData.value.Contact2 || '0',
        Contact3: editedData.value.Contact3 || '0',
        Contact4: editedData.value.Contact4 || '0',
        Contact5: editedData.value.Contact5 || '0',
        Contact6: editedData.value.Contact6 || '0',

        // Working condition fields
        Working1: editedData.value.Working1 || '0',
        Working2: editedData.value.Working2 || '0',

        // Competency levels
        Corelevel1: editedData.value.Corelevel1 || '0',
        Corelevel2: editedData.value.Corelevel2 || '0',
        Corelevel3: editedData.value.Corelevel3 || '0',
        Corelevel4: editedData.value.Corelevel4 || '0',

        // Leadership levels
        Leader1: editedData.value.Leader1 || '0',
        Leader2: editedData.value.Leader2 || '0',
        Leader3: editedData.value.Leader3 || '0',
        Leader4: editedData.value.Leader4 || '0',
        leaderlevel1: editedData.value.leaderlevel1 || '0',
        leaderlevel2: editedData.value.leaderlevel2 || '0',
        leaderlevel3: editedData.value.leaderlevel3 || '0',
        leaderlevel4: editedData.value.leaderlevel4 || '0',

        // Structure ID
        structureid: editedData.value.StructureID || editedData.value.structureid || '',
      };

      console.log('Saving to employee ControlNo:', props.employee.ControlNo);
      console.log('Complete payload:', payload);

      // Call the editEmployee function from plantilla store
      const response = await plantillaStore.editEmployee(props.employee.ControlNo, payload);

      console.log('Save response:', response);

      // Check for successful response
      if (response?.data?.success !== false && response?.status >= 200 && response?.status < 300) {
        $q.notify({
          type: 'positive',
          message: 'Employee report saved successfully!',
          position: 'top',
          timeout: 2000,
        });

        // Update original data to match saved data
        originalData.value = JSON.parse(JSON.stringify(editedData.value));

        emit('saved', editedData.value);

        // Refresh the data
        await fetchCompleteEmployeeData(props.employee.ControlNo);
      } else {
        $q.notify({
          type: 'negative',
          message: response?.data?.message || 'Failed to save changes',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error saving employee report:', error);

      // Extract detailed error message
      let errorMessage = 'An error occurred while saving';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      $q.notify({
        type: 'negative',
        message: errorMessage,
        position: 'top',
        timeout: 5000,
      });
    } finally {
      saving.value = false;
    }
  }
</script>

<style scoped>
  .modal-card {
    width: 100%;
    max-width: 900px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  }

  @media (max-width: 950px) {
    .modal-card {
      width: 95vw;
    }
  }
</style>
