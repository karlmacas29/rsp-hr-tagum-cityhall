<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-md">
    <q-table title="Voluntary Work" :rows="props.voluntary" :columns="columns" row-key="id">
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">No Voluntary Work Available</div>
      </template>
    </q-table>
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
      field: 'organization_name',
    },
    {
      name: 'fromDate',
      align: 'left',
      label: 'From',
      field: 'inclusive_date_from',
      // format: (val) => new Date(val).toLocaleDateString(),
    },
    {
      name: 'toDate',
      align: 'left',
      label: 'To',
      field: 'inclusive_date_to',
      // format: (val) => new Date(val).toLocaleDateString(),
    },
    {
      name: 'hours',
      align: 'left',
      label: 'Number of Hours',
      field: 'number_of_hours',
    },
    {
      name: 'position',
      align: 'left',
      label: 'Position',
      field: 'position',
    },
  ];
</script>

<style scoped>
  /* Add custom styles if needed */
</style>
