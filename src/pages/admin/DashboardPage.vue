<template>
  <q-page class="q-pa-md">
    <div class="column no-gap">
      <!-- Welcome Message -->
      <div>
        <div v-if="authStore.user != null" class="q-mb-sm q-gutter-xs">
          <h4 class="text-h4 text-weight-bolder q-my-none"><b>Welcome to RSP, {{ authStore.user.name }}!</b></h4>
          <p class="text-body2">Let’s take a look at the updated performance of the city hall.</p>
        </div>
        <div v-else class="q-mb-sm q-gutter-xs">
          <h4 class="text-h4 text-weight-bolder q-my-none"><q-skeleton type="text" /></h4>
          <p class="text-body2"><q-skeleton type="text" /></p>
        </div>
      </div>

      <!-- STATISTICS HEADER -->
      <div class="row justify-between items-center">
        <h5 class="text-h5 text-weight-bold q-my-md">Statistics Overview</h5>
        <q-select v-model="selectedDateFilter" :options="dateFilters" dense outlined class="date-filter"
          @update:model-value="applyDateFilter" />
      </div>

      <!-- STATISTICS CARDS -->
      <StatusOverview />

      <!-- MAIN CONTENT -->
      <div class="row q-mt-md justify-between">
        <div class="table-container">
          <h5 class="text-h5 text-weight-bold q-mb-sm q-mt-none">Applicants Overview</h5>
          <q-table class="applicants-table" flat bordered :rows="filteredApplicants" :columns="columns" row-key="job"
            separator="cell" />
        </div>

        <div class="job-card-container">
          <q-card class="text-dark active-job-card">
            <q-card-section>
              <q-icon name="work" size="40px" class="q-mb-sm" />
              <div class="text-subtitle1">Active Job Post</div>
              <div class="text-h5">{{ activeJobPost }}</div>
              <div class="text-caption">Post</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/authStore';

const authStore = useAuthStore();

import StatusOverview from 'src/components/Dashboard/StatusOverview.vue'


const activeJobPost = ref(0)
const selectedDateFilter = ref('Weekly')
const filteredApplicants = ref([])

const dateFilters = ['Weekly', 'Monthly', 'Yearly']

const applicants = [
  {
    job: 'Computer Programmer',
    applicants: 10,
    pending: 2,
    qualified: 5,
    unqualified: 3,
    date: '2025-03-21',
  },
  {
    job: 'Data Analyst',
    applicants: 10,
    pending: 2,
    qualified: 5,
    unqualified: 3,
    date: '2025-03-19',
  },
  {
    job: 'Sample',
    applicants: 10,
    pending: 2,
    qualified: 5,
    unqualified: 3,
    date: '2025-03-15',
  },
  {
    job: 'Sample',
    applicants: 10,
    pending: 2,
    qualified: 5,
    unqualified: 3,
    date: '2025-02-20',
  },
]

const columns = [
  { name: 'job', label: 'Job Applied', align: 'left', field: 'job' },
  { name: 'applicants', label: 'No. of Applicants', align: 'center', field: 'applicants' },
  { name: 'pending', label: 'Pending', align: 'center', field: 'pending' },
  { name: 'qualified', label: 'Qualified', align: 'center', field: 'qualified' },
  { name: 'unqualified', label: 'Unqualified', align: 'center', field: 'unqualified' },
]

const applyDateFilter = () => {
  const today = new Date()
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay(),
  )
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfYear = new Date(today.getFullYear(), 0, 1)

  filteredApplicants.value = applicants.filter((applicant) => {
    const applicantDate = new Date(applicant.date)
    switch (selectedDateFilter.value) {
      case 'Weekly':
        return applicantDate >= startOfWeek
      case 'Monthly':
        return applicantDate >= startOfMonth
      case 'Yearly':
        return applicantDate >= startOfYear
      default:
        return true
    }
  })
}

onMounted(() => {
  applyDateFilter()
})


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
