<template>
  <q-form class="edit-form">
    <!-- Position Information Section -->
    <div class="section">
      <div class="section-header">Position Information</div>

      <div class="form-row">
        <q-input
          v-model="formData.NewDesignation"
          label="Position Title"
          outlined
          dense
          readonly
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.SG"
          label="Salary Grade"
          outlined
          dense
          readonly
          class="form-field"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.Step"
          label="Step"
          outlined
          dense
          readonly
          class="form-field"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.MRate"
          label="Monthly Rate"
          type="number"
          outlined
          dense
          readonly
          prefix="₱"
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-select
          v-model="formData.Status"
          :options="['PERMANENT', 'TEMPORARY', 'CO-TERMINOUS', 'Elective', 'CASUAL', 'CONTRACTUAL']"
          label="Employment Status"
          outlined
          dense
          readonly
          class="form-field"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.NewOffice"
          label="Office/Department/Unit"
          outlined
          dense
          readonly
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.ItemNo"
          label="Plantilla Item No."
          outlined
          dense
          readonly
          class="form-field"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.Pages"
          label="Page No."
          outlined
          dense
          readonly
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Personal Information Section -->
    <div class="section">
      <div class="section-header">Personal Information</div>
      <div class="form-row">
        <q-input
          v-model="formData.Firstname"
          label="First Name"
          outlined
          dense
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.MIddlename"
          label="Middle Name"
          outlined
          dense
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.Surname"
          label="Last Name"
          outlined
          dense
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-select
          v-model="formData.Sex"
          :options="['MALE', 'FEMALE']"
          label="Sex"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Appointment Details Section -->
    <div class="section">
      <div class="section-header">Appointment Details</div>
      <div class="form-row">
        <q-select
          v-model="formData.Renew"
          :options="['ORIGINAL', 'PROMOTION', 'TRANSFER', 'REAPPOINTMENT', 'RECLASSIFICATION']"
          label="Nature of Appointment"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>

      <!-- Vice Employee Information with Load Button -->
      <div class="q-mb-md">
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle2 text-primary">Previous Employee Information</div>
          <q-space />
          <q-btn
            color="primary"
            icon="refresh"
            label="Load Previous Employee"
            size="sm"
            unelevated
            :loading="loadingVice"
            @click="showViceDialog"
          />
        </div>
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.vicename"
          label="Vice Name (Previous Employee)"
          outlined
          dense
          class="form-field"
          hint="Name of previous employee in this position"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.vicecause"
          label="Vice Cause (Reason for Vacancy)"
          outlined
          dense
          class="form-field"
          hint="e.g., RETIREMENT, RESIGNATION, TRANSFER"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.signingDate"
          label="Date of Signing"
          type="date"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Publication/Posting Dates Section -->
    <div class="section">
      <div class="section-header">Publication & Posting Information</div>
      <div class="text-caption text-grey-7 q-mb-sm">
        (Not applicable for CO-TERMINOUS or Elective positions)
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.post_date"
          label="Publication/Posting Start Date"
          type="date"
          outlined
          dense
          class="form-field"
          :disable="formData.Status === 'CO-TERMINOUS' || formData.Status === 'Elective'"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.end_date"
          label="Publication/Posting End Date"
          type="date"
          outlined
          dense
          class="form-field"
          :disable="formData.Status === 'CO-TERMINOUS' || formData.Status === 'Elective'"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Dialog for selecting previous employee -->
    <q-dialog v-model="viceDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Select Previous Employee</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="viceDialog = false" />
        </q-card-section>

        <q-card-section>
          <div v-if="loadingVice" class="column items-center q-pa-md">
            <q-spinner color="primary" size="48px" />
            <div class="q-mt-md text-grey-7">Loading previous employees...</div>
          </div>

          <div v-else-if="viceEmployees.length === 0" class="text-center q-pa-md text-grey-7">
            <q-icon name="info" size="48px" class="q-mb-md" />
            <div>No previous employees found for this position</div>
          </div>

          <q-list v-else separator>
            <q-item
              v-for="employee in viceEmployees"
              :key="employee.ControlNo"
              clickable
              v-ripple
              @click="selectViceEmployee(employee)"
            >
              <q-item-section>
                <q-item-label>
                  {{ formatEmployeeName(employee) }}
                </q-item-label>
                <q-item-label caption>
                  {{ employee.Designation }}
                </q-item-label>
                <q-item-label caption v-if="employee.SepCause">
                  Separation: {{ employee.SepCause }}
                  <span v-if="employee.SepDate">({{ formatDateDisplay(employee.SepDate) }})</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { useQuasar } from 'quasar';
  import { usePlantillaStore } from 'src/stores/plantillaStore.js';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update']);

  const $q = useQuasar();
  const plantillaStore = usePlantillaStore();

  const formData = ref({ ...props.data });
  const loadingVice = ref(false);
  const viceDialog = ref(false);
  const viceEmployees = ref([]);

  watch(
    () => props.data,
    (newData) => {
      formData.value = { ...newData };
    },
    { deep: true },
  );

  function emitUpdate() {
    emit('update', { ...formData.value });
  }

  function formatEmployeeName(employee) {
    return `${employee.Firstname} ${employee.Middlename} ${employee.Surname}`.trim();
  }

  function formatDate(dateString) {
    if (!dateString) return '';

    // Handle MM/DD/YYYY format
    if (dateString.includes('/')) {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Handle YYYY-MM-DD format or datetime
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }

    return dateString;
  }

  function formatDateDisplay(dateString) {
    if (!dateString) return '';

    try {
      const formatted = formatDate(dateString);
      const date = new Date(formatted);

      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }

    return dateString;
  }

  async function showViceDialog() {
    if (!formData.value.NewDesignation) {
      $q.notify({
        type: 'warning',
        message: 'Position designation is required',
        position: 'top',
      });
      return;
    }

    viceDialog.value = true;
    await loadPreviousEmployees();
  }

  async function loadPreviousEmployees() {
    try {
      loadingVice.value = true;
      viceEmployees.value = [];

      console.log('Loading previous employees for:', formData.value.NewDesignation);

      // Fetch all employees for this designation with 'REGULAR' status
      const viceData = await plantillaStore.fetchVice(formData.value.NewDesignation, 'REGULAR');

      console.log('Vice data received:', viceData);

      if (viceData && Array.isArray(viceData)) {
        // Sort by separation status - separated employees first, then by date
        viceEmployees.value = viceData.sort((a, b) => {
          // Prioritize employees with SepCause
          if (a.SepCause && !b.SepCause) return -1;
          if (!a.SepCause && b.SepCause) return 1;

          // Then sort by separation date (most recent first)
          if (a.SepDate && b.SepDate) {
            return new Date(formatDate(b.SepDate)) - new Date(formatDate(a.SepDate));
          }

          return 0;
        });
      }

      if (viceEmployees.value.length === 0) {
        $q.notify({
          type: 'info',
          message: 'No previous employees found for this position',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error loading previous employees:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to load previous employees',
        position: 'top',
      });
    } finally {
      loadingVice.value = false;
    }
  }

  function selectViceEmployee(employee) {
    // Construct full name
    const viceName = formatEmployeeName(employee);

    // Update form data
    formData.value.vicename = viceName;

    // sepcause is the vice cause - populate vicecause from employee's SepCause
    if (employee.SepCause) {
      formData.value.vicecause = employee.SepCause; // This is the vice cause
      formData.value.sepcause = employee.SepCause; // Also set sepcause
    }

    // Auto-populate separation date if available (but not in vicecause)
    if (employee.SepDate) {
      const formattedDate = formatDate(employee.SepDate);
      formData.value.sepdate = formattedDate;
    }

    emitUpdate();

    $q.notify({
      type: 'positive',
      message: `Selected: ${viceName} - ${employee.SepCause || 'Active'}`,
      position: 'top',
    });

    viceDialog.value = false;
  }
</script>

<style scoped>
  .edit-form {
    max-width: 100%;
    padding: 16px;
  }

  .section {
    margin-bottom: 24px;
    padding: 16px;
    background-color: #fffefe;
    border-radius: 8px;
  }

  .section-header {
    font-size: 16px;
    font-weight: 600;
    color: #00b034;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #00b034;
  }

  .form-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  .form-row:last-child {
    margin-bottom: 0;
  }

  .form-field {
    flex: 1;
    min-width: 0;
  }

  .flex-2 {
    flex: 2;
  }

  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
    }
  }
</style>
