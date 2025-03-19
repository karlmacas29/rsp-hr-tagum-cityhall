<template>
  <q-page class="q-pa-md">
    <div class="column no-gap">
      <!-- Welcome Message -->
      <div class="q-mb-sm q-gutter-xs">
        <h4 class="text-h4 text-weight-bolder"><b>Welcome back, Gov!</b></h4>
        <p class="text-body2">Let’s take a look at the updated performance of the company.</p>
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
          <q-table
            class="applicants-table"
            flat
            bordered
            title="Applicants"
            :rows="applicants"
            :columns="columns"
            row-key="job"
            separator="cell"
            hide-
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
        { job: 'Computer Programmer', applicants: 10, pending: 2, qualified: 5, unqualified: 3 },
        { job: 'Data Analyst', applicants: 10, pending: 2, qualified: 5, unqualified: 3 },
        { job: 'Sample', applicants: 10, pending: 2, qualified: 5, unqualified: 3 },
        { job: 'Sample', applicants: 10, pending: 2, qualified: 5, unqualified: 3 },
      ],
      columns: [
        { name: 'job', label: 'Job Applied', align: 'left', field: 'job' },
        { name: 'applicants', label: 'No. of Applicants', align: 'center', field: 'applicants' },
        { name: 'pending', label: 'Pending', align: 'center', field: 'pending' },
        { name: 'qualified', label: 'Qualified', align: 'center', field: 'qualified' },
        { name: 'unqualified', label: 'Unqualified', align: 'center', field: 'unqualified' },
      ],
    }
  },
}
</script>

<style scoped>
/* Reduce spacing and padding */
.q-page-container {
  padding-top: 0px !important;
}

.column.no-gap {
  padding-top: 0px;
  margin-top: 0px;
  gap: 0px; /* Remove extra gaps */
}

.q-mb-sm {
  margin-bottom: 4px !important; /* Reduce spacing below */
}

h5.text-h5 {
  margin-top: 0px !important;
  padding-top: 0px !important;
}

/* Reduce navbar height */
.header {
  height: 50px;
}

/* Improve card styling */
.stat-card {
  flex: 1;
  max-width: calc(100% / 7 - 8px);
  text-align: center;
  border-radius: 12px; /* Smooth rounded corners */
  background: #fff; /* Ensure consistent background */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  padding: 16px; /* Adjust inner spacing */
}

/* Hover effect for interactivity */
.stat-card:hover {
  transform: translateY(-5px); /* Slight lift effect */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); /* Soft shadow */
}

/* Adjust spacing between cards */
.row.justify-between {
  gap: 8px;
}

/* Make table take up more space */
.table-container {
  flex: 1;
  min-width: 75%;
}

/* Active Job Post card */
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
