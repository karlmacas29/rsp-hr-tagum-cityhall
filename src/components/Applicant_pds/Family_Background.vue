<template>
  <div class="q-mb-sm">
    <div class="text-h6 text-bold">Spouse's Information</div>
  </div>
  <!-- 1 -->
  <div class="row q-col-gutter-md q-px-sm">
    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12 row justify-between q-gutter-x-sm">
          <div class="col-5">
            <div class="field-label">Spouse's Firstname:</div>
            <div class="field-value">{{ familyInfo.spouse_firstname}}</div>
          </div>
          <div class="col-5">
            <div class="field-label">Spouse's Surname:</div>
            <div class="field-value">{{ familyInfo.spouse_name}}</div>
          </div>
        </div>
        <div class="col-12">
          <div class="field-label">Occupation:</div>
          <div class="field-value">{{ familyInfo.spouse_occupation}}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Employers/Business Name:</div>
          <div class="field-value">{{ familyInfo.spouse_employer}}</div>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Spouse's Middlename:</div>
          <div class="field-value">{{ familyInfo.spouse_middlename}}</div>
        </div>

        <div class="col-12">
          <div class="field-label">Business Address:</div>
          <div class="field-value">{{ familyInfo.spouse_employer_address}}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Business Telephone Number:</div>
          <div class="field-value">{{ familyInfo.spouse_employer_telephone}}</div>
        </div>
      </div>
    </div>
  </div>

  <q-separator class="q-my-md" />
  <div class="q-mb-sm">
    <div class="text-h6 text-bold">Parent's Information</div>
  </div>

  <!-- 2 -->
  <div class="row q-col-gutter-md q-px-sm">
    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12 row justify-between q-gutter-x-sm">
          <div class="col-5">
            <div class="field-label">Father's Firstname:</div>
            <div class="field-value">{{ familyInfo.father_firstname}}</div>
          </div>
          <div class="col-5">
            <div class="field-label">Father's Surname:</div>
            <div class="field-value">{{ familyInfo.father_lastname}}</div>
          </div>
        </div>
        <div class="col-12 row justify-between q-gutter-x-sm">
          <div class="col-5">
            <div class="field-label">Mother's Firstname:</div>
            <div class="field-value">{{ familyInfo.mother_firstname}}</div>
          </div>
          <div class="col-5">
            <div class="field-label">Mother's Surname:</div>
            <div class="field-value">{{ familyInfo.mother_lastname}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Father's Middlename:</div>
          <div class="field-value">{{ familyInfo.father_middlename}}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Mother's Middlename:</div>
          <div class="field-value">{{ familyInfo.mother_middlename}}</div>
        </div>
      </div>
    </div>
  </div>

  <q-separator class="q-my-md" />
  <div class="q-mb-sm">
    <div class="text-h6 text-bold">Children's Information</div>
  </div>

  <div class="q-pa-md">
    <q-table
      :rows="childrenData"
      :columns="childrenColumns"
      row-key="id"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body-cell-birth_date="props">
        <q-td :props="props">
          {{ formatDate(props.row.birth_date) }}
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">No Children Available</div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    family: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  // Extract family information from the props
  const familyInfo = computed(() => {
    if (props.family?.nPersonalInfo?.family && props.family.nPersonalInfo.family.length > 0) {
      return props.family.nPersonalInfo.family[0];
    } else if (props.family?.family && props.family.family.length > 0) {
      return props.family.family[0];
    } else {
      return {};
    }
  });

  // Extract children data from props
  const childrenData = computed(() => {
    if (props.family?.nPersonalInfo?.children && props.family.nPersonalInfo.children.length > 0) {
      return props.family.nPersonalInfo.children;
    } else if (props.family?.children && props.family.children.length > 0) {
      return props.family.children;
    } else {
      return [];
    }
  });

  // Define columns for the children table
  const childrenColumns = [
    { name: 'name', label: 'Full Name', field: 'child_name', align: 'left', sortable: true },
    {
      name: 'birth_date',
      label: 'Date of Birth',
      field: 'birth_date',
      align: 'left',
      sortable: true,
    },
  ];

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'None';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
</script>

<style scoped>
  .field-label {
    color: #666;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .field-value {
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }

  .form-title-container {
    padding: 8px 0;
    margin-bottom: 10px;
  }
</style>
