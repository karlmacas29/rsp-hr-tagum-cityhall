<template>
  <div class="q-pa-md">
    <q-table
      title="Educational Background"
      :rows="educationalRecords"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    >
      
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const columns = [
  {
    name: 'level',
    required: true,
    label: 'Level',
    align: 'left',
    field: 'level',
    sortable: true
  },
  {
    name: 'schoolName',
    required: true,
    label: 'Name of School',
    align: 'left',
    field: 'schoolName',
    sortable: true
  },
  {
    name: 'course',
    required: true,
    label: 'Basic Education/Degree/Course',
    align: 'left',
    field: 'course',
    sortable: true
  },
  {
    name: 'fromYear',
    required: true,
    label: 'From',
    align: 'left',
    field: 'fromYear',
    format: (val) => new Date(val).getFullYear(),
    sortable: true
  },
  {
    name: 'toYear',
    required: true,
    label: 'To',
    align: 'left',
    field: 'toYear',
    format: (val) => new Date(val).getFullYear(),
    sortable: true
  },
  {
    name: 'highestLevel',
    required: true,
    label: 'Highest Level/Units Earned',
    align: 'left',
    field: 'highestLevel',
    sortable: true
  },
  {
    name: 'yearGraduated',
    required: true,
    label: 'Year Graduated',
    align: 'left',
    field: 'yearGraduated',
    format: (val) => val ? new Date(val).getFullYear() : 'N/A',
    sortable: true
  },
  {
    name: 'honors',
    required: true,
    label: 'Scholarship/Academic Honors Received',
    align: 'left',
    field: 'honors',
    sortable: true
  }
];

const educationalRecords = ref([
  // Sample data
  {
    id: 1,
    level: 'Elementary',
    schoolName: 'Sample Elementary School',
    course: 'Elementary Education',
    fromYear: '2000-01-01',
    toYear: '2006-01-01',
    highestLevel: 'Completed',
    yearGraduated: '2006-01-01',
    honors: 'First Honors'
  }
]);

</script>

<style scoped>
.q-table {
  background: white;
}
</style>