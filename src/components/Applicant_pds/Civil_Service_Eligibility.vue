<template>
  <div class="q-pa-md">
    <q-table
      title="Civil Service Eligibility"
      :rows="eligibilityData"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-examDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.date_of_examination) }}
        </q-td>
      </template>
      <template v-slot:body-cell-validityDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.date_of_validity) }}
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">
          No Civil Service Eligibility Available
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    eligibility: {
      type: Array,
      required: false,
      default: () => [],
    },
  });

  // Transform and filter eligibility data
  const eligibilityData = computed(() => {
    if (!Array.isArray(props.eligibility)) {
      return [];
    }

    return props.eligibility.map((item) => ({
      ...item,
      // Add any transformations if needed
    }));
  });

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

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

  const columns = [
    {
      name: 'eligibility',
      label: 'Eligibility',
      field: 'eligibility',
      sortable: true,
      align: 'left',
    },
    {
      name: 'rating',
      label: 'Rating (If Applicable)',
      field: 'rating',
      sortable: true,
      align: 'left',
    },
    {
      name: 'examDate',
      label: 'Date of Examination',
      field: 'date_of_examination',
      sortable: true,
      align: 'left',
    },
    {
      name: 'examPlace',
      label: 'Place of Examination',
      field: 'place_of_examination',
      sortable: true,
      align: 'left',
    },
    {
      name: 'licenseNumber',
      label: 'License Number',
      field: 'license_number',
      sortable: true,
      align: 'left',
    },
    {
      name: 'validityDate',
      label: 'Date of Validity',
      field: 'date_of_validity',
      sortable: true,
      align: 'left',
    },
  ];
</script>

<style scoped>
  .q-table {
    background: white;
  }
</style>
