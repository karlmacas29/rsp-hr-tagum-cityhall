<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-md">
    <q-table
      title="Educational Background"
      :rows="props.education"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    ></q-table>
  </div>
</template>
<script setup>
  const props = defineProps({
    education: {
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
      field: 'level',
      sortable: true,
    },
    {
      name: 'schoolName',
      required: true,
      label: 'Name of School',
      align: 'left',
      field: 'school_name',
      sortable: true,
    },
    {
      name: 'course',
      required: true,
      label: 'Basic Education/Degree/Course',
      align: 'left',
      field: 'degree',
      sortable: true,
    },
    {
      name: 'fromYear',
      required: true,
      label: 'From',
      align: 'left',
      // field: (row) =>
      //   row.DateAttend.includes('-') ? row.DateAttend.split('-')[0].trim() : row.DateAttend,
      field: 'attendance_from',
      sortable: true,
    },
    {
      name: 'toYear',
      required: true,
      label: 'To',
      align: 'left',
      // field: (row) =>
      //   row.DateAttend.includes('-') ? row.DateAttend.split('-')[1].trim() : row.DateAttend,
      field: 'attendance_to',
      sortable: true,
    },
    {
      name: 'highestLevel',
      required: true,
      label: 'Highest Level/Units Earned',
      align: 'left',
      field: 'highest_units',
      sortable: true,
    },
    {
      name: 'yearGraduated',
      required: true,
      label: 'Year Graduated',
      align: 'left',
      // field: (row) =>
      //   row.DateAttend.includes('-') ? row.DateAttend.split('-')[1].trim() : row.DateAttend,
      field: 'year_graduated',
      sortable: true,
    },
    {
      name: 'honors',
      required: true,
      label: 'Scholarship/Academic Honors Received',
      align: 'left',
      field: 'scholarship',
      sortable: true,
    },
  ];
</script>

<style scoped>
  .q-table {
    background: white;
  }
</style>
