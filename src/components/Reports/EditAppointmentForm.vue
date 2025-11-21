<template>
  <q-form class="edit-form">
    <!-- Personal Information Section -->
    <div class="section">
      <div class="section-header">Personal Information</div>

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

        <q-input
          v-model="formData.Name4"
          label="Full Name"
          outlined
          dense
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Position Information Section -->
    <div class="section">
      <div class="section-header">Position Information</div>

      <div class="form-row">
        <q-input
          v-model="formData.NewDesignation"
          label="Position Title"
          outlined
          dense
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
          class="form-field"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.Step"
          label="Step"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.MRate"
          label="Monthly Rate"
          type="number"
          outlined
          dense
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
          class="form-field"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.NewOffice"
          label="Office/Department/Unit"
          outlined
          dense
          class="form-field flex-2"
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

        <q-input
          v-model="formData.vicecause"
          label="Vice/Reason"
          outlined
          dense
          class="form-field"
          hint="e.g., Retired, Transferred, Resigned"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.ItemNo"
          label="Plantilla Item No."
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.Pages"
          label="Page No."
          outlined
          dense
          class="form-field"
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

    <!-- Signatory Information Section -->
    <!-- <div class="section">
      <div class="section-header">Signatory Information</div>

      <div class="form-row">
        <q-input
          v-model="formData.mayor"
          label="City Mayor Name"
          outlined
          dense
          class="form-field"
          hint="For Office of the City Mayor"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.vicemayor"
          label="Vice Mayor Name"
          outlined
          dense
          class="form-field"
          hint="For Office of the Vice Mayor"
          @update:model-value="emitUpdate"
        />
      </div>
    </div> -->

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
  </q-form>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update']);

  const formData = ref({ ...props.data });

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
