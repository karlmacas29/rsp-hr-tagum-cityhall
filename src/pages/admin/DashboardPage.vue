<template>
  <q-page class="q-pa-md">
    <div class="column no-gap">
      <!-- Welcome Message -->
      <div class="bg-primary text-white rounded-borders q-pa-lg column justify-center items-start">
        <div v-if="authStore.user != null" class="column justify-center q-pa-md q-gutter-xs">
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
      </div>

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
      <StatusOverview />

      <!-- MAIN CONTENT -->
      <div class="row q-mt-md justify-between">
        <div class="table-container">
          <div class="row justify-between q-mb-sm items-center">
            <h5 class="text-h5 text-weight-bold q-ma-none">Jobpost Overview</h5>
            <q-select
              v-model="selectedDateFilter"
              :options="dateFilters"
              dense
              outlined
              class="date-filter"
              @update:model-value="applyDateFilter"
            />
          </div>

          <q-table
            class="applicants-table"
            flat
            bordered
            :rows="filteredApplicants"
            :columns="columns"
            row-key="job"
            separator="cell"
            :pagination="{ rowsPerPage: 5 }"
          />
        </div>

        <div class="job-card-container q-px-xl">
          <q-card
            class="text-dark stat-card"
            style="
              background-color: #fff;
              width: 100%;
              border-top: 8px solid #00b034;
              border-radius: 12px;
            "
          >
            <q-card-section class="q-pa-lg row justify-between items-center">
              <div>
                <div class="text-subtitle1 text-bold">Active Job Post</div>
                <div class="text-h4">{{ activeJobPost }}</div>
                <div class="text-caption">Post</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from 'src/stores/authStore';
  import StatusOverview from 'src/components/Dashboard/StatusOverview.vue';
  import { use_vwActiveStore } from 'src/stores/vwActiveStore';

  const vwActiveStore = use_vwActiveStore();
  const authStore = useAuthStore();
  const activeJobPost = ref(0);
  const selectedDateFilter = ref('Weekly');
  const filteredApplicants = ref([]);

  const dateFilters = ['Weekly', 'Monthly', 'Yearly'];

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
    { name: 'job', label: 'Job Applied', align: 'left', field: 'job' },
    { name: 'applicants', label: 'No. of Applicants', align: 'center', field: 'applicants' },
    { name: 'pending', label: 'Pending', align: 'center', field: 'pending' },
    { name: 'qualified', label: 'Qualified', align: 'center', field: 'qualified' },
    { name: 'unqualified', label: 'Unqualified', align: 'center', field: 'unqualified' },
  ];

  const countActiveJobs = () => {
    activeJobPost.value = filteredApplicants.value.filter((job) => job.active).length;
  };

  const applyDateFilter = () => {
    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay(),
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    filteredApplicants.value = applicants.filter((applicant) => {
      const applicantDate = new Date(applicant.date);
      switch (selectedDateFilter.value) {
        case 'Weekly':
          return applicantDate >= startOfWeek;
        case 'Monthly':
          return applicantDate >= startOfMonth;
        case 'Yearly':
          return applicantDate >= startOfYear;
        default:
          return true;
      }
    });

    countActiveJobs();
  };

  onMounted(async () => {
    applyDateFilter();
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
    background-color: #f9f9f9;
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
