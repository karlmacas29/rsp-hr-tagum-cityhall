<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">References</div>

    <q-table
      :rows="referencesData"
      :columns="columns"
      row-key="id"
      class="my-sticky-header-table"
      :pagination="{ rowsPerPage: 0 }"
      hide-bottom
    >
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey-7">No references available</div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    references: {
      type: Array,
      required: false,
      default: () => [],
    },
  });

  // Transform incoming references to match the column structure
  const referencesData = computed(() => {
    if (!Array.isArray(props.references)) {
      return [];
    }

    return props.references.map((item) => ({
      id: item.id,
      full_name: item.full_name,
      address: item.address,
      contact_number: item.contact_number,
    }));
  });

  const columns = [
    {
      name: 'fullName',
      required: true,
      label: 'Full Name',
      align: 'left',
      field: 'full_name',
      sortable: true,
    },
    {
      name: 'address',
      align: 'left',
      label: 'Address',
      field: 'address',
      sortable: true,
    },
    {
      name: 'contactNumber',
      align: 'left',
      label: 'Contact Number',
      field: 'contact_number',
      sortable: true,
    },
  ];
</script>

<style scoped>
  .my-sticky-header-table {
    max-height: 400px;
  }

  .q-table__grid-content {
    min-height: 100px;
  }
</style>
