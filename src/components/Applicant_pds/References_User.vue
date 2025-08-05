<template>
  <div class="q-pa-md">
    <q-table
      title="References"
      :rows="props.references"
      :columns="columns"
      row-key="ID"
      class="my-sticky-header-table"
    />
  </div>
</template>

<script setup>
  const props = defineProps({
    references: {
      type: Object,
    },
  });

  const columns = [
    {
      name: 'name',
      required: true,
      label: 'Full Name',
      align: 'left',
      field: 'Names',
      sortable: true,
    },
    {
      name: 'address',
      align: 'left',
      label: 'Address',
      field: 'Address',
      sortable: true,
    },
    {
      name: 'contactNumber',
      align: 'left',
      label: 'Contact Number',
      field: 'TelNo',
      sortable: true,
    },
  ];
</script>

<style scoped>
  .my-sticky-header-table {
    /* height or max-height is important */
    max-height: 400px;
  }
</style>
