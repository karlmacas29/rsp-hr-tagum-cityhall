<!-- eslint-disable vue/multi-word-component-names -->
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
    learning: {
      type: Object,
    },
  });

  const columns = [
    {
      name: 'title',
      label: 'Title',
      field: 'training_title',
      align: 'left',
    },
    {
      name: 'fromDate',
      label: 'From',
      field: 'inclusive_date_from',
      // format: (val) => new Date(val).toLocaleDateString(),
      align: 'left',
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'inclusive_date_to',
      // format: (val) => new Date(val).toLocaleDateString(),
      align: 'left',
    },
    {
      name: 'hours',
      label: 'Number of Hours',
      field: 'number_of_hours',
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
      field: 'conducted_by',
      align: 'left',
    },
  ];
</script>

<style scoped>
  .text-h6 {
    color: #666;
  }
</style>
