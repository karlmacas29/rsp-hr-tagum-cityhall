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
      field: 'CivilServe',
      sortable: true,
      align: 'left',
    },
    {
      name: 'rating',
      label: 'Rating (If Applicable)',
      field: 'Rates',
      sortable: true,
      align: 'left',
    },
    {
      name: 'examDate',
      label: 'Date of Examination',
      field: 'Dates',
      sortable: true,
      align: 'left',
    },
    {
      name: 'examPlace',
      label: 'Place of Examination',
      field: 'Place',
      sortable: true,
      align: 'left',
    },
    {
      name: 'licenseNumber',
      label: 'License Number',
      field: 'LNumber',
      sortable: true,
      align: 'left',
    },
    {
      name: 'validityDate',
      label: 'Date of Validity',
      field: 'LDate',
      sortable: true,
      align: 'left',
    },
  ];
</script>
