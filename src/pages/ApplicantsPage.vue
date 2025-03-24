<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Applicants</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Home" />
          <q-breadcrumbs-el class="text-bold" label="Applicant Lists" />
          <!-- <q-breadcrumbs-el label="Breadcrumbs" /> -->
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Date Range Picker -->
    <div class="row items-center q-gutter-sm">
      <q-input dense outlined readonly v-model="formattedDateRange" label="Selected Date Range" class="col-6">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="dateRange" range @update:model-value="updateFormattedDate" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <!-- Job Position Cards -->
    <div class="row q-col-gutter-md q-mt-md">
      <div v-for="job in filteredJobs" :key="job.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="job-card cursor-pointer" @click="viewApplicants(job.id)">
          <q-card-section>
            <div class="text-h6">{{ job.title }}</div>
            <div class="text-caption text-grey">Posted on: {{ job.date }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="row justify-between">
            <q-badge color="blue" class="q-mb-xs">Applicants: {{ job.applicants }}</q-badge>
            <q-badge color="orange" class="q-mb-xs">Pending: {{ job.pending }}</q-badge>
            <q-badge color="green" class="q-mb-xs">Qualified: {{ job.qualified }}</q-badge>
            <q-badge color="red">Unqualified: {{ job.unqualified }}</q-badge>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn label="View" color="primary" icon="visibility" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const dateRange = ref({ from: '', to: '' })
const formattedDateRange = ref('')

const updateFormattedDate = () => {
  const { from, to } = dateRange.value
  formattedDateRange.value = from && to ? `${from} - ${to}` : ''
}

const jobs = ref([
  {
    id: 1,
    title: 'Computer Programmer II',
    date: '2025-01-20',
    applicants: 10,
    pending: 5,
    qualified: 5,
    unqualified: 5,
  },
  {
    id: 2,
    title: 'Systems Analyst',
    date: '2025-02-20',
    applicants: 20,
    pending: 0,
    qualified: 0,
    unqualified: 0,
  },
  {
    id: 3,
    title: 'Data Analyst',
    date: '2025-03-20',
    applicants: 15,
    pending: 3,
    qualified: 7,
    unqualified: 5,
  },
])

const filteredJobs = computed(() => jobs.value)

const viewApplicants = (id) => {
  console.log(`Viewing applicants for job ID: ${id}`)
}
</script>

<style scoped>
/* Reduce spacing between heading and position text */
h5 {
  margin-bottom: 0;
}

/* Reduce spacing between input and text */
.q-gutter-md {
  margin-bottom: 4px;
}

/* Improved card spacing */
.job-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.job-card:hover {
  transform: scale(1.03);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
