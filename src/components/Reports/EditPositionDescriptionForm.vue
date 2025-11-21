<template>
  <q-form class="edit-form">
    <!-- Position Title Section -->
    <div class="section">
      <div class="section-header">1. Position Title</div>
      <div class="form-row">
        <q-input
          v-model="formData.NewDesignation"
          label="Position Title (as approved by authorized agency)"
          outlined
          dense
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Item Number & Salary Grade Section -->
    <div class="section">
      <div class="section-header">2-3. Item Number & Salary Grade</div>
      <div class="form-row">
        <q-input
          v-model="formData.ItemNo"
          label="Item Number"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.SG"
          label="Salary Grade"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Local Government Classification Section -->
    <div class="section">
      <div class="section-header">4. Local Government Unit Classification</div>
      <div class="form-row">
        <q-select
          v-model="formData.govUnit"
          :options="['Province', 'City', 'Municipality']"
          label="Government Unit"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-select
          v-model="formData.govClass"
          :options="[
            '1st Class',
            '2nd Class',
            '3rd Class',
            '4th Class',
            '5th Class',
            '6th Class',
            'Special',
          ]"
          label="Government Class"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Agency & Office Section -->
    <div class="section">
      <div class="section-header">5-6. Agency & Office</div>
      <div class="form-row">
        <q-input
          v-model="formData.Agency"
          label="Agency"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.NewOffice"
          label="Office"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Division & Workstation Section -->
    <div class="section">
      <div class="section-header">7-8. Division & Workstation</div>
      <div class="form-row">
        <q-input
          v-model="formData.Division"
          label="Division"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="form-row">
        <q-input
          v-model="formData.Workstation"
          label="Workstation / Place of Work"
          outlined
          dense
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Appropriation Act Section -->
    <div class="section">
      <div class="section-header">9-10. Appropriation Act</div>
      <div class="form-row">
        <q-input
          v-model="formData.PresAppro"
          label="Present Appropriation Act"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.PrevAppro"
          label="Previous Appropriation Act"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Salary Information Section -->
    <div class="section">
      <div class="section-header">11-12. Salary Information</div>
      <div class="form-row">
        <q-input
          v-model="formData.SalAuthorized"
          label="Salary Authorized"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.OtherComp"
          label="Other Compensation"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Supervision Section -->
    <div class="section">
      <div class="section-header">13-14. Supervision</div>
      <div class="form-row">
        <q-input
          v-model="formData.SupPosition"
          label="Position Title of Immediate Supervisor"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="form-row">
        <q-input
          v-model="formData.HSupPosition"
          label="Position Title of Next Higher Supervisor"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Equipment/Tools Section -->
    <div class="section">
      <div class="section-header">16. Machine, Equipment, Tools, etc.</div>
      <div class="form-row">
        <q-input
          v-model="formData.Tool"
          label="Equipment Used Regularly"
          outlined
          dense
          type="textarea"
          rows="3"
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Contacts/Clients Section -->
    <div class="section">
      <div class="section-header">17. Contacts / Clients / Stakeholders</div>

      <div class="subsection-title">Internal Contacts</div>
      <div class="form-row">
        <q-select
          v-model="formData.Contact1"
          :options="contactFrequencyOptions"
          emit-value
          map-options
          label="Executive / Managerial"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-select
          v-model="formData.Contact2"
          :options="contactFrequencyOptions"
          emit-value
          map-options
          label="Supervisors"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="form-row">
        <q-select
          v-model="formData.Contact3"
          :options="contactFrequencyOptions"
          emit-value
          map-options
          label="Non-Supervisors"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-select
          v-model="formData.Contact4"
          :options="contactFrequencyOptions"
          emit-value
          map-options
          label="Staff"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="subsection-title q-mt-md">External Contacts</div>
      <div class="form-row">
        <q-select
          v-model="formData.Contact5"
          :options="contactFrequencyOptions"
          emit-value
          map-options
          label="General Public"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-select
          v-model="formData.Contact6"
          :options="contactFrequencyOptions"
          emit-value
          map-options
          label="Other Agencies"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="form-row">
        <q-input
          v-model="formData.ContactOthers"
          label="Others (please specify)"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Working Condition Section -->
    <div class="section">
      <div class="section-header">18. Working Condition</div>
      <div class="form-row">
        <q-select
          v-model="formData.Working1"
          :options="contactFrequencyOptions"
          emit-value
          map-options
          label="Office Work"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-select
          v-model="formData.Working2"
          :options="contactFrequencyOptions"
          emit-value
          map-options
          label="Field Work"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="form-row">
        <q-input
          v-model="formData.WorkingOthers"
          label="Others (please specify)"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Brief Description of Unit Section -->
    <div class="section">
      <div class="section-header">19. Brief Description of General Function of Unit/Section</div>
      <div class="form-row">
        <q-input
          v-model="formData.DescriptionSection"
          label="Unit/Section Description"
          outlined
          dense
          type="textarea"
          rows="4"
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Job Summary Section -->
    <div class="section">
      <div class="section-header">
        20. Brief Description of General Function of Position (Job Summary)
      </div>
      <div class="form-row">
        <q-input
          v-model="formData.DescriptionFunction"
          label="Job Summary / General Function"
          outlined
          dense
          type="textarea"
          rows="6"
          autogrow
          class="form-field"
          hint="Use numbered lists (e.g., 1., 2., 3.) for better formatting"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Qualification Standards Section -->
    <div class="section">
      <div class="section-header">21. Qualification Standards</div>

      <div class="form-row">
        <q-input
          v-model="formData.StandardEduc"
          label="21A. Education"
          outlined
          dense
          type="textarea"
          rows="3"
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.StandardExp"
          label="21B. Experience"
          outlined
          dense
          type="textarea"
          rows="3"
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="form-row">
        <q-input
          v-model="formData.StandardTrain"
          label="21C. Training"
          outlined
          dense
          type="textarea"
          rows="3"
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.StandardElig"
          label="21D. Eligibility"
          outlined
          dense
          type="textarea"
          rows="3"
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Core Competencies Section -->
    <div class="section">
      <div class="section-header">21e. Core Competencies</div>
      <div class="form-row">
        <q-input
          v-model="formData.Core1"
          label="Core Competency"
          outlined
          dense
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.Corelevel1"
          label="Competency Level"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Leadership Competencies Section -->
    <div class="section">
      <div class="section-header">21f. Leadership Competencies</div>
      <div class="form-row">
        <q-input
          v-model="formData.Leader1"
          label="Leadership Competency"
          outlined
          dense
          class="form-field flex-2"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.leaderlevel1"
          label="Competency Level"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
      </div>
    </div>

    <!-- Acknowledgement Section -->
    <div class="section">
      <div class="section-header">23. Acknowledgement and Acceptance</div>
      <div class="form-row">
        <q-input
          v-model="formData.Name4"
          label="Employee's Name"
          outlined
          dense
          class="form-field"
          @update:model-value="emitUpdate"
        />
        <q-input
          v-model="formData.Supervisor"
          label="Supervisor's Name"
          outlined
          dense
          class="form-field"
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

  const contactFrequencyOptions = [
    { label: 'Not Applicable', value: '0' },
    { label: 'Occasional', value: '1' },
    { label: 'Frequent', value: '2' },
  ];

  const formData = ref({
    NewDesignation: '',
    ItemNo: '',
    SG: '',
    govUnit: 'City',
    govClass: '1st Class',
    Agency: 'LOCAL GOVERNMENT UNIT OF TAGUM CITY',
    NewOffice: '',
    NewOFfice: '', // Keep both spellings for compatibility
    Division: '',
    Workstation: 'CITY HALL GOVERNMENT CENTER, JV AYALA AVENUE, APOKON, TAGUM CITY',
    PresAppro: '',
    PrevAppro: '',
    SalAuthorized: '',
    OtherComp: '',
    SupPosition: '',
    HSupPosition: '',
    Tool: '',
    Contact1: '0',
    Contact2: '0',
    Contact3: '0',
    Contact4: '0',
    Contact5: '0',
    Contact6: '0',
    ContactOthers: '',
    Working1: '0',
    Working2: '0',
    WorkingOthers: '',
    DescriptionSection: '',
    DescriptionFunction: '',
    StandardEduc: '',
    StandardExp: '',
    StandardTrain: '',
    StandardElig: '',
    Core1: '',
    Corelevel1: '',
    Leader1: '',
    leaderlevel1: '',
    Name4: '',
    Supervisor: '',
    ...props.data,
  });

  watch(
    () => props.data,
    (newData) => {
      formData.value = { ...formData.value, ...newData };
    },
    { deep: true },
  );

  function emitUpdate() {
    // Sync both spelling variations
    if (formData.value.NewOffice) {
      formData.value.NewOFfice = formData.value.NewOffice;
    }
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

  .subsection-title {
    font-size: 14px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 12px;
    margin-top: 8px;
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
