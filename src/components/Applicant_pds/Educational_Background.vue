<template>
  <div class="q-pa-md">
    <div class="text-h6 text-bold">Education Background</div>
    <q-table
      :rows="educationData"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    ></q-table>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    educ: {
      type: Array,
      required: false,
      default: () => [],
    },
  });

  // Transform the education data to match the expected format
  const educationData = computed(() => {
    if (!Array.isArray(props.educ)) {
      return [];
    }

    // Sort education data by level priority
    return [...props.educ].sort((a, b) => getLevelPriority(a.level) - getLevelPriority(b.level));
  });

  // Helper function to determine level priority for sorting
  const getLevelPriority = (level) => {
    if (!level) return 999;
    const levelLower = level.toLowerCase();
    if (levelLower.includes('elementary')) return 1;
    if (levelLower.includes('secondary')) return 2;
    if (levelLower.includes('vocational')) return 3;
    if (levelLower.includes('college')) return 4;
    if (levelLower.includes('graduate')) return 5;
    return 999;
  };

  const columns = [
    {
      name: 'level',
      required: true,
      label: 'Level',
      align: 'left',
      field: (row) => row.level ,
      sortable: true,
    },
    {
      name: 'schoolName',
      required: true,
      label: 'Name of School',
      align: 'left',
      field: (row) => row.school_name ,
      sortable: true,
    },
    {
      name: 'course',
      required: true,
      label: 'Basic Education/Degree/Course',
      align: 'left',
      field: (row) => row.degree ,
      sortable: true,
    },
    {
      name: 'fromYear',
      required: true,
      label: 'From',
      align: 'left',
      field: (row) => row.attendance_from ,
      sortable: true,
    },
    {
      name: 'toYear',
      required: true,
      label: 'To',
      align: 'left',
      field: (row) => row.attendance_to ,
      sortable: true,
    },
    {
      name: 'highestLevel',
      required: true,
      label: 'Highest Level/Units Earned',
      align: 'left',
      field: (row) => row.highest_units ,
      sortable: true,
    },
    {
      name: 'yearGraduated',
      required: true,
      label: 'Year Graduated',
      align: 'left',
      field: (row) => row.year_graduated ,
      sortable: true,
    },
    {
      name: 'honors',
      required: true,
      label: 'Scholarship/Academic Honors Received',
      align: 'left',
      field: (row) => row.scholarship ,
      sortable: true,
    },
  ];
</script>

<style scoped>
  .q-table {
    background: white;
  }
</style>
