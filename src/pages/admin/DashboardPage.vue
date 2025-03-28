<template>
  <q-page class="q-pa-md">
    <div class="column no-gap">
      <div class="table-container">
        <q-table
          class="employees-table"
          flat
          bordered
          :rows="employeeStore.employees"
          :columns="columns"
          row-key="id"
          separator="cell"
          :pagination="initialPagination"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { useEmployeeStore } from 'src/stores/employeeStore';

export default {
  setup() {
    const employeeStore = useEmployeeStore();

    // Fetch employees when the component is created
    employeeStore.fetchEmployees();

    return {
      employeeStore, // Expose the store to the template
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id' },
        { name: 'name', label: 'Name', align: 'left', field: 'name' },
        { name: 'mobile', label: 'Mobile', align: 'center', field: 'mobile' },
        { name: 'address', label: 'Address', align: 'left', field: 'address' },
      ],
      initialPagination: {
        page: 1,
        rowsPerPage: 10,
      },
    };
  },
};
</script>

<style scoped>
/* Align header and filter */
.row.justify-between.items-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Date Filter Dropdown */
.date-filter {
  max-width: 180px;
}

/* Table container */
.table-container {
  flex: 1;
  min-width: 75%;
  /* paading : y x */
  padding: 0 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* Adjust statistics cards */
.stat-card {
  flex: 1;
  max-width: calc(100% / 7 - 8px);
  text-align: center;
  border-radius: 12px;
  background: #fff;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  padding: 16px;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}

/* Active Job Card */
.job-card-container {
  width: 23%;
  margin-left: 8px;
}

.active-job-card {
  background: linear-gradient(to bottom right, #d1c4e9, #e1bee7);
  text-align: center;
  border-radius: 12px;
}
</style>
