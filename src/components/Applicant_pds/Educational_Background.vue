<template>
  <div class="q-pa-md">
    <q-table
      title="Educational Background"
      :rows="props.educ"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    ></q-table>
  </div>
</template>
<script setup>
  const props = defineProps({
    educ: {
      type: Object,
      required: true,
    },
  });

  const columns = [
    {
      name: 'level',
      required: true,
      label: 'Level',
      align: 'left',
      field: 'Education',
      sortable: true,
    },
    {
      name: 'schoolName',
      required: true,
      label: 'Name of School',
      align: 'left',
      field: 'School',
      sortable: true,
    },
    {
      name: 'course',
      required: true,
      label: 'Basic Education/Degree/Course',
      align: 'left',
      field: 'Degree',
      sortable: true,
    },
    {
      name: 'fromYear',
      required: true,
      label: 'From',
      align: 'left',
      field: (row) =>
        row.DateAttend.includes('-') ? row.DateAttend.split('-')[0].trim() : row.DateAttend,
      // field: 'DateAttend',
      sortable: true,
    },
    {
      name: 'toYear',
      required: true,
      label: 'To',
      align: 'left',
      field: (row) =>
        row.DateAttend.includes('-') ? row.DateAttend.split('-')[1].trim() : row.DateAttend,
      // field: 'DateAttend',
      sortable: true,
    },
    {
      name: 'highestLevel',
      required: true,
      label: 'Highest Level/Units Earned',
      align: 'left',
      field: (row) => row?.YearLevel || 'None' + '/' + row.NumUnits,
      sortable: true,
    },
    {
      name: 'yearGraduated',
      required: true,
      label: 'Year Graduated',
      align: 'left',
      field: (row) =>
        row.DateAttend.includes('-') ? row.DateAttend.split('-')[1].trim() : row.DateAttend,
      // field: 'DateAttend',
      sortable: true,
    },
    {
      name: 'honors',
      required: true,
      label: 'Scholarship/Academic Honors Received',
      align: 'left',
      field: (row) => row?.Honors || 'None',
      sortable: true,
    },
  ];
</script>

<style scoped>
  .q-table {
    background: white;
  }
</style>
