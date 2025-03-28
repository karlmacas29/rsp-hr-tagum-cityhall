<template>
  <q-page class="q-pa-md">
    <div class="column no-gap">
      <!-- Welcome Message -->
      <div class="q-mb-sm q-gutter-xs">
        <h4 class="text-h4 text-weight-bolder q-my-none"><b>Welcome back, Gov!</b></h4>
        <p class="text-body2">Let’s take a look at the updated performance of the company.</p>
      </div>

      <!-- STATISTICS HEADER -->
      <div class="row justify-between items-center">
        <h5 class="text-h5 text-weight-bold q-my-md">Statistics Overview</h5>
        <q-select
          v-model="selectedDateFilter"
          :options="dateFilters"
          dense
          outlined
          class="date-filter"
          @update:model-value="applyDateFilter"
        />
      </div>

      <!-- STATISTICS CARDS -->
      <div class="row justify-between">
        <q-card
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-card text-dark"
          :style="{ backgroundColor: stat.color }"
        >
          <q-card-section class="q-pa-sm">
            <q-icon :name="stat.icon" size="30px" class="q-mb-sm" />
            <div class="text-subtitle1">{{ stat.title }}</div>
            <div class="text-h5">{{ stat.value }}</div>
            <div class="text-caption">{{ stat.caption }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- MAIN CONTENT -->
      <div class="row q-mt-md justify-between">
        <div class="table-container">
          <h5 class="text-h5 text-weight-bold q-mb-sm q-mt-none">Applicants Overview</h5>
          <q-table
            class="applicants-table"
            flat
            bordered
            :rows="filteredApplicants"
            :columns="columns"
            row-key="job"
            separator="cell"
            :pagination="initialPagination"
          />
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

<script>
export default {
  data() {
    return {
      stats: [
        {
          title: 'Elective',
          value: 3342,
          caption: 'Employee',
          color: '#C8E6C9',
          icon: 'how_to_vote',
        },
        {
          title: 'Appointed',
          value: 3342,
          caption: 'Employee',
          color: '#FFF9C4',
          icon: 'assignment_ind',
        },
        {
          title: 'Co-Terminus',
          value: 3342,
          caption: 'Employee',
          color: '#BBDEFB',
          icon: 'hourglass_empty',
        },
        {
          title: 'Permanent',
          value: 3342,
          caption: 'Employee',
          color: '#E1BEE7',
          icon: 'verified',
        },
        { title: 'Casual', value: 3342, caption: 'Employee', color: '#FFCDD2', icon: 'work' },
        {
          title: 'Job Order',
          value: 3342,
          caption: 'Employee',
          color: '#FFE0B2',
          icon: 'description',
        },
        {
          title: 'Honorarium',
          value: 3342,
          caption: 'Employee',
          color: '#DCEDC8',
          icon: 'monetization_on',
        },
      ],
      activeJobPost: 3342,
      applicants: [
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
      ],
      columns: [
        { name: 'job', label: 'Job Applied', align: 'left', field: 'job' },
        { name: 'applicants', label: 'No. of Applicants', align: 'center', field: 'applicants' },
        { name: 'pending', label: 'Pending', align: 'center', field: 'pending' },
        { name: 'qualified', label: 'Qualified', align: 'center', field: 'qualified' },
        { name: 'unqualified', label: 'Unqualified', align: 'center', field: 'unqualified' },
      ],
      dateFilters: ['Weekly', 'Monthly', 'Yearly'],
      selectedDateFilter: 'Weekly',
      filteredApplicants: [],
    }
  },
  created() {
    this.applyDateFilter()
  },
  methods: {
    applyDateFilter() {
      const today = new Date()
      const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay(),
      )
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startOfYear = new Date(today.getFullYear(), 0, 1)

      this.filteredApplicants = this.applicants.filter((applicant) => {
        const applicantDate = new Date(applicant.date)
        switch (this.selectedDateFilter) {
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
    },
  },
}
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
