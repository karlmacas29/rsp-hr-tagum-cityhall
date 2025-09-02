<template>
  <div class="q-pa-md">
    <div class="text-h6 text-bold">Voluntary Work</div>
    <q-table
      :rows="voluntaryData"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-fromDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.inclusive_date_from) }}
        </q-td>
      </template>
      <template v-slot:body-cell-toDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.inclusive_date_to) }}
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">No Voluntary Work Available</div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    voluntary: {
      type: Array,
      required: false,
      default: () => [],
    },
  });

  // Transform and sort voluntary work data
  const voluntaryData = computed(() => {
    if (!Array.isArray(props.voluntary)) {
      return [];
    }

    // Sort by date (most recent first)
    return [...props.voluntary].sort((a, b) => {
      const dateA = new Date(a.inclusive_date_from || 0);
      const dateB = new Date(b.inclusive_date_from || 0);
      return dateB - dateA; // Descending order (newest first)
    });
  });

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const columns = [
    {
      name: 'organization',
      required: true,
      label: 'Name and Address of Organization',
      align: 'left',
      field: 'organization_name',
      sortable: true,
    },
    {
      name: 'fromDate',
      align: 'left',
      label: 'From',
      field: 'inclusive_date_from',
      sortable: true,
    },
    {
      name: 'toDate',
      align: 'left',
      label: 'To',
      field: 'inclusive_date_to',
      sortable: true,
    },
    {
      name: 'hours',
      align: 'left',
      label: 'Number of Hours',
      field: 'number_of_hours',
      sortable: true,
    },
    {
      name: 'position',
      align: 'left',
      label: 'Position',
      field: 'position',
      sortable: true,
    },
  ];
</script>

<style scoped>
  .q-table__title {
    font-weight: bold;
  }
</style>
