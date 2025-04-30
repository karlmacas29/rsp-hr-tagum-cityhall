<template>
  <div class="q-pa-md">
    <q-table title="Voluntary Work" :rows="props.voluntary" :columns="columns" row-key="id" />
  </div>
</template>

<script setup>
  const props = defineProps({
    voluntary: {
      type: Object,
    },
  });

  const columns = [
    {
      name: 'organization',
      required: true,
      label: 'Name and Address of Organization',
      align: 'left',
      field: 'OrgName',
    },
    {
      name: 'fromDate',
      align: 'left',
      label: 'From',
      field: 'DateFrom',
      // format: (val) => new Date(val).toLocaleDateString(),
    },
    {
      name: 'toDate',
      align: 'left',
      label: 'To',
      field: 'DateTo',
      // format: (val) => new Date(val).toLocaleDateString(),
    },
    {
      name: 'hours',
      align: 'left',
      label: 'Number of Hours',
      field: 'NoHours',
    },
    {
      name: 'position',
      align: 'left',
      label: 'Position',
      field: 'OrgPosition',
    },
  ];
</script>

<style scoped>
  /* Add custom styles if needed */
</style>
