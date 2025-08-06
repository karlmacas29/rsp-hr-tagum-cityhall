<template>
  <div class="q-pa-md">
    <q-table
      title="Work Experience"
      :rows="experienceData"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-fromDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.work_date_from) }}
        </q-td>
      </template>
      <template v-slot:body-cell-toDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.work_date_to) }}
        </q-td>
      </template>
      <template v-slot:body-cell-monthlySalary="props">
        <q-td :props="props">
          {{ formatCurrency(props.row.monthly_salary) }}
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">No Work Experience Available</div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    experience: {
      type: Array,
      required: false,
      default: () => [],
    },
  });

  // Transform and sort work experience data
  const experienceData = computed(() => {
    if (!Array.isArray(props.experience)) {
      return [];
    }

    // Sort by date (most recent first)
    return [...props.experience].sort((a, b) => {
      const dateA = new Date(a.work_date_from || 0);
      const dateB = new Date(b.work_date_from || 0);
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

  // Format currency helper function
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';

    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) return amount;

      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
      }).format(numAmount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return amount;
    }
  };

  const columns = [
    {
      name: 'fromDate',
      label: 'From',
      field: 'work_date_from',
      align: 'left',
      sortable: true,
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'work_date_to',
      align: 'left',
      sortable: true,
    },
    {
      name: 'positionTitle',
      label: 'Position Title',
      field: 'position_title',
      align: 'left',
      sortable: true,
    },
    {
      name: 'department',
      label: 'Department',
      field: 'department',
      align: 'left',
      sortable: true,
    },
    {
      name: 'monthlySalary',
      label: 'Monthly Salary',
      field: 'monthly_salary',
      align: 'right',
      sortable: true,
    },
    {
      name: 'salaryGrade',
      label: 'Salary Grade',
      field: 'salary_grade',
      align: 'left',
      sortable: true,
    },
    {
      name: 'appointmentStatus',
      label: 'Status of Appointment',
      field: 'status_of_appointment',
      align: 'left',
      sortable: true,
    },
    {
      name: 'govtService',
      label: "Gov't Service",
      field: 'government_service',
      align: 'left',
      sortable: true,
    },
  ];
</script>

<style scoped>
  .q-table__title {
    font-weight: bold;
  }
</style>
