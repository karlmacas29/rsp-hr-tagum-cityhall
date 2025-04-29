<template>
  <q-page padding>
    <!-- Profile Header Section -->
    <div class="row q-mb-lg">
      <div class="col-12 bg-white rounded-borders shadow-1">
        <div class="row q-pa-md items-center">
          <!-- Avatar -->
          <div class="col-auto">
            <q-avatar size="200px" class="bg-grey-3">
              <!-- User avatar would go here -->
            </q-avatar>
          </div>

          <!-- User Info -->
          <div class="col q-ml-md">
            <div class="text-h2 text-weight-bold">Gavano E. Gavano</div>
            <div class="text-h5 text-grey">Department of ......................</div>
            <q-chip size="lg    " color="green" text-color="white" dense>Rater</q-chip>
          </div>
        </div>
      </div>
    </div>

    <!-- Applications Section -->
    <div class="row">
      <div class="col-12 bg-white rounded-borders shadow-1">
        <div class="row q-pa-md items-center">
          <div class="col">
            <div class="text-h5 text-bold">Applications</div>
          </div>
          <div class="col-auto">
            <q-btn round flat dense icon="filter_list" />
            <q-btn round flat dense icon="search" />
          </div>
        </div>

        <!-- Applications Table -->
        <q-table
          :rows="applications"
          :columns="columns"
          row-key="position"
          flat
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
        >
          <!-- Custom headers to match design -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-grey text-weight-medium"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <!-- Custom body cells -->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="position" :props="props">
                {{ props.row.position }}
              </q-td>
              <q-td key="jobApplied" :props="props">
                {{ props.row.jobApplied }}
              </q-td>
              <q-td key="dateApplied" :props="props">
                {{ props.row.dateApplied }}
              </q-td>
              <q-td key="status" :props="props">
                <q-chip
                  size="sm"
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  dense
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
              <q-td key="action" :props="props" class="text-center">
                <q-btn
                  flat
                  round
                  dense
                  color="grey"
                  icon="visibility"
                  @click="viewApplication(props.row)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref } from 'vue';

  // Table columns definition
  const columns = [
    { name: 'position', align: 'left', label: 'Position', field: 'position' },
    { name: 'jobApplied', align: 'left', label: 'Job Applied', field: 'jobApplied' },
    { name: 'dateApplied', align: 'left', label: 'Date Applied', field: 'dateApplied' },
    { name: 'status', align: 'left', label: 'Status', field: 'status' },
    { name: 'action', align: 'center', label: 'Action', field: 'action' },
  ];

  // Sample application data
  const applications = ref([
    {
      position: 'Security Technician',
      jobApplied: 'Technician',
      dateApplied: '07-27-2025',
      status: 'Hired',
    },
    {
      position: 'City Editor',
      jobApplied: 'System Analyst',
      dateApplied: '01-15-2025',
      status: 'Pending',
    },
    {
      position: 'Full Stack',
      jobApplied: 'Programmer I',
      dateApplied: '05-19-2025',
      status: 'Pending',
    },
    {
      position: 'Engineer',
      jobApplied: 'Engineer',
      dateApplied: '10-18-2024',
      status: 'Interview',
    },
  ]);

  // Get appropriate color for status chips
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'hired':
        return 'green';
      case 'pending':
        return 'purple';
      case 'interview':
        return 'orange';
      default:
        return 'grey';
    }
  };

  // View application details
  const viewApplication = (row) => {
    console.log('Viewing application:', row);
    // Implement your view logic here, like navigating to a details page
  };
</script>

<style scoped>
  .q-table th {
    font-weight: 500 !important;
  }
</style>
