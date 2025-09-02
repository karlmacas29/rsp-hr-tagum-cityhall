<template>
  <div class="q-pa-md">
    <div class="text-h6 text-bold">L&D Interventions</div>
    <q-table :rows="trainingData" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 10 }">
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
        <div class="full-width row flex-center q-pa-md text-grey">
          No Learning and Development Interventions Available
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    ldData: {
      type: Array,
      required: false,
      default: () => [],
    },
  });

  // Transform and sort training data
  const trainingData = computed(() => {
    if (!Array.isArray(props.ldData)) {
      return [];
    }

    // Sort by date (most recent first)
    return [...props.ldData].sort((a, b) => {
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
      name: 'title',
      label: 'Title',
      field: 'training_title',
      align: 'left',
      sortable: true,
    },
    {
      name: 'fromDate',
      label: 'From',
      field: 'inclusive_date_from',
      align: 'left',
      sortable: true,
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'inclusive_date_to',
      align: 'left',
      sortable: true,
    },
    {
      name: 'hours',
      label: 'Number of Hours',
      field: 'number_of_hours',
      align: 'left',
      sortable: true,
    },
    {
      name: 'type',
      label: 'Type',
      field: 'type',
      align: 'left',
      sortable: true,
    },
    {
      name: 'conductor',
      label: 'Conducted/Sponsored By',
      field: 'conducted_by',
      align: 'left',
      sortable: true,
    },
  ];
</script>

<style scoped></style>
