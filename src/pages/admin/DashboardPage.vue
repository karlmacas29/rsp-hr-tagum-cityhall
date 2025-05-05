<template>
  <q-page class="q-pa-md">
    <div class="column no-gap">
      <!-- Welcome Message -->
      <q-img
        src="tagum-city-hall.webp"
        class="rounded-borders q-pa-lg column justify-center items-start"
        style="height: 100px; opacity: 1.5"
      >
        <div
          v-if="authStore.user != null"
          class="column justify-center"
          style="
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
          "
        >
          <div class="text-h4 text-weight-bolder q-ma-none">
            Welcome to RSP, {{ authStore.user.name }}!
          </div>
          <div class="text-body1 q-ma-none">
            Let's take a look at the updated performance of the city hall.
          </div>
        </div>
        <div v-else class="q-mb-sm q-gutter-xs">
          <h4 class="text-h4 text-weight-bolder q-my-none"><q-skeleton type="text" /></h4>
          <p class="text-body2"><q-skeleton type="text" /></p>
        </div>
      </q-img>

      <!-- STATISTICS HEADER -->
      <div class="row justify-start items-start q-my-md">
        <div class="q-pa-sm">
          <q-icon name="stacked_line_chart" size="50px" />
        </div>
        <div class="column">
          <h4 class="text-weight-bold q-ma-none">Statistics Overview</h4>
          <h5 class="q-my-sm row justify-start">
            Total Employees:
            <div class="text-bold text-primary q-mx-md">
              {{ Number(vwActiveStore.countAll).toLocaleString() }}
            </div>
          </h5>
        </div>
      </div>

      <!-- STATISTICS CARDS -->
      <StatusOverview class="q-mx-auto" />

      <!-- Jobpost HEADER -->
      <div class="row justify-start items-start q-my-md">
        <div class="q-pa-sm">
          <q-icon name="work_history" size="50px" />
        </div>
        <div class="column">
          <h4 class="text-weight-bold q-ma-none">Jobs Overview</h4>
          <h5 class="q-my-sm row justify-start">
            Total Active Job Posts:
            <div class="text-bold text-primary q-mx-md">5</div>
          </h5>
        </div>
      </div>
      <!-- MAIN CONTENT -->
      <div class="row justify-between">
        <q-card class="q-mx-auto" style="width: 70vw">
          <q-table
            class="applicants-table"
            :rows="applicants"
            :columns="columns"
            row-key="job"
            :pagination="{ rowsPerPage: 5 }"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useAuthStore } from 'src/stores/authStore';
  import StatusOverview from 'src/components/Dashboard/StatusOverview.vue';
  import { use_vwActiveStore } from 'src/stores/vwActiveStore';

  const vwActiveStore = use_vwActiveStore();
  const authStore = useAuthStore();

  const applicants = [
    {
      job: 'Computer Programmer',
      applicants: 10,
      pending: 2,
      qualified: 5,
      unqualified: 3,
      date: '2025-03-21',
      active: true,
    },
    {
      job: 'Data Analyst',
      applicants: 10,
      pending: 2,
      qualified: 5,
      unqualified: 3,
      date: '2025-03-19',
      active: true,
    },
    {
      job: 'Administrative Assistant',
      applicants: 8,
      pending: 1,
      qualified: 6,
      unqualified: 1,
      date: '2025-03-18',
      active: true,
    },
    {
      job: 'Sample Inactive Job',
      applicants: 10,
      pending: 2,
      qualified: 5,
      unqualified: 3,
      date: '2025-03-15',
      active: false,
    },
    {
      job: 'Sample Old Job',
      applicants: 10,
      pending: 2,
      qualified: 5,
      unqualified: 3,
      date: '2025-02-20',
      active: false,
    },
  ];

  const columns = [
    { name: 'job', label: 'Job Applied', align: 'left', field: 'job', sortable: true },
    {
      name: 'applicants',
      label: 'No. of Applicants',
      align: 'center',
      field: 'applicants',
      sortable: true,
    },
    { name: 'pending', label: 'Pending', align: 'center', field: 'pending', sortable: true },
    { name: 'qualified', label: 'Qualified', align: 'center', field: 'qualified', sortable: true },
    {
      name: 'unqualified',
      label: 'Unqualified',
      align: 'center',
      field: 'unqualified',
      sortable: true,
    },
  ];

  onMounted(async () => {
    await vwActiveStore.fetchCountAll();
  });
</script>

<style scoped>
  .stat-card {
    border-radius: 12px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }

  .date-filter {
    max-width: 180px;
  }

  .table-container {
    flex: 1;
    min-width: 75%;
    padding: 5px 16px;
    border-radius: 8px;
  }

  .job-card-container {
    width: 23%;
    margin-left: 8px;
  }

  .applicants-table {
    width: 100%;
  }
</style>
