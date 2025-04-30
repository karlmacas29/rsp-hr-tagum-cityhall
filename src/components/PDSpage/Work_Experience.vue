<template>
  <div class="q-pa-md">
    <q-table title="Work Experience" :rows="props.experience" :columns="columns" row-key="id" />
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
      field: 'WFrom',
      align: 'left',
      // format: (val) => new Date(val).toLocaleDateString('en-PH')
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'WTo',
      align: 'left',
      // format: (val) => new Date(val).toLocaleDateString('en-PH')
    },
    {
      name: 'positionTitle',
      label: 'Position Title',
      field: 'WPosition',
      align: 'left',
    },
    {
      name: 'department',
      label: 'Department',
      field: 'WCompany',
      align: 'left',
    },
    {
      name: 'monthlySalary',
      label: 'Monthly Salary',
      field: 'WSalary',
      align: 'right',
      format: (val) => val.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }),
    },
    {
      name: 'salaryGrade',
      label: 'Salary Grade',
      field: 'WGrade',
      align: 'left',
    },
    {
      name: 'appointmentStatus',
      label: 'Status of Appointment',
      field: 'Status',
      align: 'left',
    },
    {
      name: 'govtService',
      label: "Gov't Service",
      field: 'WGov',
      align: 'left',
    },
  ];
</script>

<style scoped>
  .q-table__title {
    font-weight: bold;
  }
</style>
