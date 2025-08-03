<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-md">
    <q-table title="Work Experience" :rows="props.experience" :columns="columns" row-key="id">
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">No Work Experience Available</div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
  const props = defineProps({
    experience: {
      type: Object,
      required: true,
    },
  });
  const columns = [
    {
      name: 'fromDate',
      label: 'From',
      field: 'work_date_from',
      align: 'left',
      // format: (val) => new Date(val).toLocaleDateString('en-PH')
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'work_date_to',
      align: 'left',
      // format: (val) => new Date(val).toLocaleDateString('en-PH')
    },
    {
      name: 'positionTitle',
      label: 'Position Title',
      field: 'position_title',
      align: 'left',
    },
    {
      name: 'department',
      label: 'Department',
      field: 'department',
      align: 'left',
    },
    {
      name: 'monthlySalary',
      label: 'Monthly Salary',
      field: 'monthly_salary',
      align: 'right',
      format: (val) => val.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }),
    },
    {
      name: 'salaryGrade',
      label: 'Salary Grade',
      field: 'salary_grade',
      align: 'left',
    },
    {
      name: 'appointmentStatus',
      label: 'Status of Appointment',
      field: 'status_of_appointment',
      align: 'left',
    },
    {
      name: 'govtService',
      label: "Gov't Service",
      field: 'government_service',
      align: 'left',
    },
  ];
</script>

<style scoped>
  .q-table__title {
    font-weight: bold;
  }
</style>
