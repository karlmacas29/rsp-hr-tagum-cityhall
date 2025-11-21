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

      <div class="form-row">
        <q-input
          v-model="formData.TINNo"
          label="TIN Number"
          outlined
          dense
          class="form-field"
          hint="Tax Identification Number"
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
          v-model="formData.NewOffice"
          label="Office/Department/Unit"
          outlined
          dense
          class="form-field flex-2"
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
      </div>
    </div>

    <!-- Certification Dates Section -->
    <div class="section">
      <div class="section-header">Important Dates</div>

      <div class="form-row">
        <q-input
          v-model="formData.sepdate"
          label="Appointment/Assumption Date"
          type="date"
          outlined
          dense
          class="form-field"
          hint="Date used in all certifications"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Signatory Information Section -->
    <!-- <div class="section">
      <div class="section-header">Signatory Officials</div>

      <div class="form-row">
        <q-input
          v-model="formData.mayor"
          label="City Mayor Name"
          outlined
          dense
          class="form-field"
          hint="Primary appointing authority"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.vicemayor"
          label="Vice Mayor Name"
          outlined
          dense
          class="form-field"
          hint="For Vice Mayor's office appointments"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.cityaccountant"
          label="City Accountant Name"
          outlined
          dense
          class="form-field"
          hint="Signs fund availability certification"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.admin"
          label="City Administrator Name"
          outlined
          dense
          class="form-field"
          hint="Signs assumption to duty certification"
          @update:model-value="emitUpdate"
        />

        <q-input
          v-model="formData.HR"
          label="HR Management Officer Name"
          outlined
          dense
          class="form-field"
          hint="Attests to assumption certification"
          @update:model-value="emitUpdate"
        />
      </div>
    </div> -->

    <!-- Address Information Section -->
    <div class="section">
      <div class="section-header">Address Information</div>
      <div class="text-caption text-grey-7 q-mb-sm">Address information for oath of office</div>

      <div class="form-row">
        <q-input
          v-model="addressDisplay"
          label="Address"
          outlined
          dense
          class="form-field flex-2"
          readonly
          hint="Default: TAGUM CITY, DAVAO DEL NORTE"
        />
      </div>
    </div>

    <!-- Preview Data Section
    <div class="section bg-green-1">
      <div class="section-header text-green-9">
        <q-icon name="info" class="q-mr-sm" />
        Certification Preview Information
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Appointing Authority:</div>
          <div class="info-value">{{ signatoryDisplay.name }}</div>
        </div>

        <div class="info-item">
          <div class="info-label">Title:</div>
          <div class="info-value">{{ signatoryDisplay.title }}</div>
        </div>

        <div class="info-item">
          <div class="info-label">Formatted Date (English):</div>
          <div class="info-value">{{ formattedDateEnglish }}</div>
        </div>

        <div class="info-item">
          <div class="info-label">Formatted Date (Tagalog):</div>
          <div class="info-value">{{ formattedDateTagalog }}</div>
        </div>
      </div>
    </div> -->
  </q-form>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';

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

  // Computed properties for preview
  const addressDisplay = computed(() => {
    return 'TAGUM CITY, DAVAO DEL NORTE';
  });

  // const signatoryDisplay = computed(() => {
  //   if (
  //     formData.value.NewOffice?.includes('VICE MAYOR') ||
  //     formData.value.NewOffice?.includes('SANGGUNIANG PANLUNGSOD') ||
  //     formData.value.NewOffice?.includes('SANGGUNIAN')
  //   ) {
  //     return {
  //       name: formData.value.vicemayor || 'Not Set',
  //       title: 'City Vice Mayor',
  //     };
  //   } else {
  //     return {
  //       name: formData.value.mayor || 'Not Set',
  //       title: 'City Mayor',
  //     };
  //   }
  // });

  // const formattedDateEnglish = computed(() => {
  //   if (!formData.value.sepdate) return 'No date set';
  //   const date = new Date(formData.value.sepdate);
  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });
  // });

  // const formattedDateTagalog = computed(() => {
  //   if (!formData.value.sepdate) return 'No date set';
  //   const dateObj = new Date(formData.value.sepdate);
  //   const day = dateObj.getDate();
  //   const year = dateObj.getFullYear();

  //   const tagalogMonths = {
  //     0: 'Enero',
  //     1: 'Pebrero',
  //     2: 'Marso',
  //     3: 'Abril',
  //     4: 'Mayo',
  //     5: 'Hunyo',
  //     6: 'Hulyo',
  //     7: 'Agosto',
  //     8: 'Setyembre',
  //     9: 'Oktubre',
  //     10: 'Nobyembre',
  //     11: 'Disyembre',
  //   };

  //   const month = tagalogMonths[dateObj.getMonth()];
  //   return `ika-${day} ng ${month}, ${year}`;
  // });
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
    display: flex;
    align-items: center;
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

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .info-item {
    padding: 12px;
    background-color: white;
    border-radius: 4px;
    border-left: 3px solid #00b034;
  }

  .info-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
    font-weight: 500;
  }

  .info-value {
    font-size: 14px;
    color: #333;
    font-weight: 600;
  }

  .bg-blue-1 {
    background-color: #e3f2fd !important;
  }

  .text-blue-9 {
    color: #00b034 !important;
  }

  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
