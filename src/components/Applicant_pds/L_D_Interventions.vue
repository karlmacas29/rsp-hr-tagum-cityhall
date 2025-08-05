<template>
  <div class="q-pa-md">
    <q-table
      title="Learning and Development (L&D) Interventions"
      :rows="props.ldData"
      :columns="columns"
      row-key="title"
    />
  </div>
</template>

<script setup>
  const props = defineProps({
    ldData: {
      type: Object,
    },
  });

  const columns = [
    {
      name: 'title',
      label: 'Title',
      field: 'Training',
      align: 'left',
    },
    {
      name: 'fromDate',
      label: 'From',
      field: 'DateFrom',
      // format: (val) => new Date(val).toLocaleDateString(),
      align: 'left',
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'DateTo',
      // format: (val) => new Date(val).toLocaleDateString(),
      align: 'left',
    },
    {
      name: 'hours',
      label: 'Number of Hours',
      field: 'NumHours',
      align: 'left',
    },
    {
      name: 'type',
      label: 'Type',
      field: 'type',
      align: 'left',
    },
    {
      name: 'conductor',
      label: 'Conducted/Sponsored By',
      field: 'Conductor',
      align: 'left',
    },
  ];
</script>

<style scoped>
  .text-h6 {
    color: #666;
  }
</style>
