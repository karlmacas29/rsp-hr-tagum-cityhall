<template>
  <div class="q-pa-md">
    <q-table
      title="Civil Service Eligibility"
      :rows="props.eligibility"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    />
  </div>
</template>

<script setup>
  const props = defineProps({
    eligibility: {
      type: Object,
    },
  });
  const columns = [
    { name: 'eligibility', label: 'Eligibility', field: 'CivilServe', sortable: true },
    { name: 'rating', label: 'Rating (If Applicable)', field: 'Rates', sortable: true },
    { name: 'examDate', label: 'Date of Examination', field: 'Dates', sortable: true },
    { name: 'examPlace', label: 'Place of Examination', field: 'Place', sortable: true },
    { name: 'licenseNumber', label: 'License Number', field: 'LNumber', sortable: true },
    { name: 'validityDate', label: 'Date of Validity', field: 'LDate', sortable: true },
  ];
</script>
