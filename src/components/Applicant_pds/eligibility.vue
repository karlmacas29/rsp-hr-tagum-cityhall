<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-md">
    <q-table
      title="Civil Service Eligibility"
      :rows="props.eligibility"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">
          No Civil Service Eligibility Available
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
  const props = defineProps({
    eligibility: {
      type: Object,
    },
  });
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
