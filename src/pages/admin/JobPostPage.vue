<template>
  <q-page class="q-pa-md">
    <!-- Navigation and Job Posts Header -->
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Job Posts</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Job Posts" />
          <q-breadcrumbs-el v-if="showingDetails" class="text-bold" :label="selectedJob.position" />
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Date Range Picker -->
    <div v-if="!showingDetails" class="row items-center q-gutter-sm q-mb-md">
      <q-input dense outlined readonly v-model="formattedDateRange" label="Selected Date Range">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="dateRange" range @update:model-value="updateFormattedDate" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <!-- Job List View -->
    <div v-if="!showingDetails" class="q-pa-md">
      <q-card>
        <q-table
          :rows="filteredJobs"
          :columns="columns"
          row-key="position"
          :pagination="pagination"
          class="my-sticky-header-table"
          flat
          bordered
          :grid="$q.screen.lt.md"
          style="width: 100%"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                <div class="column">
                  <div>{{ col.label }}</div>
                  <q-input
                    v-if="col.searchable !== false && col.name !== 'action'"
                    v-model="searchFilters[col.name]"
                    dense
                    outlined
                    clearable
                    class="q-mt-xs"
                    :placeholder="`Search ${col.label}`"
                  />
                </div>
              </q-th>
            </q-tr>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" :key="props.row.position">
              <q-card flat bordered class="job-card">
                <q-card-section>
                  <div class="text-h6">{{ props.row.position }}</div>
                  <div class="text-subtitle2">Posted: {{ formatDate(props.row.postingDate) }}</div>
                </q-card-section>

                <q-separator />

                <q-list dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption class="text-bold">Applicants</q-item-label>
                      <q-item-label>{{ props.row.applicants }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Pending</q-item-label>
                      <q-item-label>{{ props.row.pending }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Qualified</q-item-label>
                      <q-item-label>{{ props.row.qualified }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Unqualified</q-item-label>
                      <q-item-label>{{ props.row.unqualified }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-separator />

                <q-card-actions align="right">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="visibility"
                    @click="viewJobDetails(props.row)"
                  >
                    <q-tooltip>View</q-tooltip>
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
                round
                dense
                color="primary"
                icon="visibility"
                @click="viewJobDetails(props.row)"
                size="md"
              >
                <q-tooltip>View</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Job Details View -->
    <div v-if="showingDetails">
      <q-card class="q-mb-md" flat bordered>
        <q-card-section>
          <div class="row items-center">
            <q-btn icon="arrow_back" flat round dense class="q-mr-sm" @click="goBackToList"/>
            <div class="text-h5">{{ selectedJob.position }}</div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle1 q-mb-xs">
                <q-icon name="business" class="q-mr-sm" />
                <strong>Office:</strong> {{ selectedJob.officePosition }}
              </div>
              <div class="text-subtitle1 q-mb-xs">
                <q-icon name="work" class="q-mr-sm" />
                <strong>Position:</strong> {{ selectedJob.position }}
              </div>
              <div class="text-subtitle1 q-mb-xs">
                <q-icon name="event" class="q-mr-sm" />
                <strong>Posting Date:</strong> {{ formatDate(selectedJob.postingDate) }}
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-h6 q-mb-sm">Qualification Standard/Requirements</div>
          <div class="q-pl-md">
            <div class="text-subtitle2 q-mb-xs">BASIC QUALIFICATIONS:</div>
            <ol class="q-pl-md">
              <li v-for="(qual, index) in selectedJob.qualifications" :key="index">{{ qual }}</li>
            </ol>
          </div>
        </q-card-section>
      </q-card>

      <!-- Applicants Section -->
      <q-card flat bordered>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Applicants for {{ selectedJob.position }}</div>
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="filteredApplicants"
            :columns="applicantColumns"
            row-key="id"
            flat
            bordered
            hide-pagination
            :loading="loadingApplicants"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="getStatusColor(props.row.status)">
                  {{ props.row.isSubmitted ? `${props.row.status} (Locked)` : props.row.status }}
                  <q-icon v-if="props.row.isSubmitted" name="lock" class="q-ml-xs" size="xs" />
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  flat
                  color="primary"
                  :label="props.row.isSubmitted ? 'View Evaluation' : 'Evaluate'"
                  @click="openQualificationModal(props.row)"
                  size="sm"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Quality Standard Modal -->
    <QualityStandardModal
      v-model="showQSModal"
      variant="applicant"
      :applicant-data="selectedApplicant"
      :position-requirements="positionRequirements"
      @view-pds="viewApplicantPDS"
      @toggle-qualification="handleQualificationToggle"
      @submit="promptSubmitEvaluation"
      @close="closeQualificationModal"
      :is-submitted="selectedApplicant.isSubmitted"
    />

    <!-- PDS Modal -->
    <PDSModal
      v-model="showPDSModal"
      :applicant="selectedApplicant"
      @close="closePDSModal"
      @view-qs="openQualificationFromPDS"
    />

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmationModal" persistent>
      <q-card style="min-width: 400px; border-radius: 8px;">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="help_outline" color="primary" size="md" class="q-mr-sm" />
          <span class="text-h6">Confirm Evaluation Submission</span>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <div class="text-body1 q-mb-md">
            You are about to <strong>finalize</strong> this evaluation:
          </div>

          <div class="q-pa-sm bg-grey-2 rounded-borders">
            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-medium">Applicant:</div>
              <div class="col-8">{{ selectedApplicant.name }}</div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-4 text-weight-medium">Status:</div>
              <div class="col-8">
                <q-badge :color="getStatusColor(selectedApplicant.status)" class="q-px-sm q-py-xs">
                  {{ selectedApplicant.status }}
                </q-badge>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn label="Confirm Submission" color="primary" @click="submitEvaluation" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'
import QualityStandardModal from 'components/QualityStandardModal.vue'
import PDSModal from 'components/PDSModal.vue'

const { formatDate } = date

// Page State
const showingDetails = ref(false)
const pagination = ref({
  sortBy: 'postingDate',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

// Date Range Filter
const dateRange = ref({ from: '', to: '' })
const formattedDateRange = ref('')
const searchFilters = ref({
  officePosition: '',
  position: '',
  postingDate: '',
  applicants: '',
  pending: '',
  qualified: '',
  unqualified: ''
})

const updateFormattedDate = () => {
  const { from, to } = dateRange.value
  formattedDateRange.value =
    from && to ? `${formatDate(from, 'MMM D, YYYY')} - ${formatDate(to, 'MMM D, YYYY')}` : ''
}

// Job Posts Data
const columns = [
  {
    name: 'officePosition',
    required: true,
    label: 'Office',
    align: 'left',
    field: (row) => row.officePosition,
    searchable: true
  },
  {
    name: 'position',
    label: 'Position',
    align: 'left',
    field: 'position',
    searchable: true
  },
  {
    name: 'postingDate',
    align: 'left',
    label: 'Posting Date',
    field: 'postingDate',
    format: (val) => formatDate(val, 'MMM D, YYYY'),
    searchable: true
  },
  {
    name: 'applicants',
    align: 'center',
    label: 'Applicants',
    field: 'applicants',
    searchable: false
  },
  {
    name: 'pending',
    align: 'center',
    label: 'Pending',
    field: 'pending',
    searchable: false
  },
  {
    name: 'qualified',
    align: 'center',
    label: 'Qualified',
    field: 'qualified',
    searchable: false
  },
  {
    name: 'unqualified',
    align: 'center',
    label: 'Unqualified',
    field: 'unqualified',
    searchable: false
  },
  {
    name: 'action',
    align: 'center',
    label: 'Actions',
    field: 'action',
    searchable: false
  },
]

const jobs = ref([
  {
    id: 1,
    officePosition: 'Human Resources',
    position: 'HR Manager',
    postingDate: '2025-04-01',
    applicants: 10,
    pending: 5,
    qualified: 3,
    unqualified: 2,
    qualifications: [
      'Bachelor’s Degree in Human Resources or related field',
      'At least 5 years of experience in HR management',
      'Strong leadership and communication skills',
    ],
  },
  {
    id: 2,
    officePosition: 'Finance Department',
    position: 'Accountant',
    postingDate: '2025-03-15',
    applicants: 8,
    pending: 4,
    qualified: 2,
    unqualified: 2,
    qualifications: [
      'Bachelor’s Degree in Accounting or Finance',
      'CPA license is preferred',
      'Proficiency in financial software and tools',
    ],
  },
  {
    id: 3,
    officePosition: 'IT Department',
    position: 'Software Developer',
    postingDate: '2025-03-20',
    applicants: 15,
    pending: 7,
    qualified: 5,
    unqualified: 3,
    qualifications: [
      'Bachelor’s Degree in Computer Science or related field',
      'Experience with JavaScript, Vue.js, and Quasar Framework',
      'Strong problem-solving and debugging skills',
    ],
  },
])

const filteredJobs = computed(() => {
  let filtered = jobs.value
  if (dateRange.value.from && dateRange.value.to) {
    filtered = filtered.filter((job) => {
      const jobDate = new Date(job.postingDate)
      const fromDate = new Date(dateRange.value.from)
      const toDate = new Date(dateRange.value.to)
      return jobDate >= fromDate && jobDate <= toDate
    })
  }
  return filtered.filter(job => {
    return Object.entries(searchFilters.value).every(([key, value]) => {
      if (!value) return true
      const jobValue = job[key]
      if (jobValue === undefined) return true
      if (typeof jobValue === 'string') {
        return jobValue.toLowerCase().includes(value.toLowerCase())
      } else if (typeof jobValue === 'number') {
        return jobValue.toString().includes(value)
      } else if (jobValue instanceof Date) {
        return formatDate(jobValue, 'MMM D, YYYY').toLowerCase().includes(value.toLowerCase())
      }
      return true
    })
  })
})

const selectedJob = ref({
  id: null,
  officePosition: '',
  position: '',
  postingDate: '',
  applicants: 0,
  pending: 0,
  qualified: 0,
  unqualified: 0,
  qualifications: [],
})

const viewJobDetails = (job) => {
  selectedJob.value = { ...job }
  showingDetails.value = true
  applicants.value = applicants.value.map(applicant => ({
    ...applicant,
    status: 'Pending',
    isSubmitted: false
  }))
}

const goBackToList = () => {
  showingDetails.value = false
}

// Applicants View
const loadingApplicants = ref(false)
const applicantColumns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  {
    name: 'appliedDate',
    label: 'Applied Date',
    field: 'appliedDate',
    align: 'left',
    format: (val) => formatDate(val, 'MMM D, YYYY'),
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
  },
  {
    name: 'action',
    label: 'Action',
    field: 'action',
    align: 'center',
    sortable: false,
  },
]

const applicants = ref([
  {
    id: 1,
    name: 'John Doe',
    appliedDate: '2025-04-02',
    status: 'Pending',
    isSubmitted: false,
  },
  {
    id: 2,
    name: 'Jane Smith',
    appliedDate: '2025-04-03',
    status: 'Pending',
    isSubmitted: false,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    appliedDate: '2025-04-04',
    status: 'Pending',
    isSubmitted: false,
  },
  {
    id: 4,
    name: 'Bob Brown',
    appliedDate: '2025-04-05',
    status: 'Pending',
    isSubmitted: false,
  },
])

const filteredApplicants = computed(() => {
  return applicants.value.filter(
    (applicant) => applicant.appliedDate >= selectedJob.value.postingDate,
  )
})

// Qualification Standard Modal
const showQSModal = ref(false)
const selectedApplicant = ref({
  id: null,
  name: '',
  photo: '',
  position: '',
  status: 'Pending',
  isSubmitted: false,
  applicationDate: '',
  education: [],
  experience: [],
  training: [],
  eligibility: [],
  personalInfo: {}
})

const positionRequirements = ref({
  education: "Bachelor's Degree in related field",
  preferredEducation: "Master's Degree preferred",
  experience: 'Minimum 3 years relevant experience',
  preferredExperience: '5+ years in leadership role',
  training: 'Certification in relevant field',
  preferredTraining: 'Multiple advanced certifications',
  eligibility: 'Professional license required',
  preferredCertification: 'Additional specialized certifications',
})

// Confirmation Modal
const showConfirmationModal = ref(false)

const openQualificationModal = (applicant) => {
  selectedApplicant.value = {
    ...applicant,
    position: selectedJob.value.position,
    applicationDate: formatDate(applicant.appliedDate, 'MMM D, YYYY')
  }
  showQSModal.value = true
}

const closeQualificationModal = () => {
  showQSModal.value = false
}

const handleQualificationToggle = (newStatus) => {
  if (selectedApplicant.value.isSubmitted) {
    console.warn('Cannot change status after submission')
    return
  }
  selectedApplicant.value.status = newStatus
}

const promptSubmitEvaluation = () => {
  if (selectedApplicant.value.status === 'Pending') {
    console.warn('Please select Qualified or Unqualified before submitting')
    return
  }
  showConfirmationModal.value = true
}

const submitEvaluation = () => {
  const applicantIndex = applicants.value.findIndex(a => a.id === selectedApplicant.value.id)
  if (applicantIndex !== -1) {
    applicants.value[applicantIndex] = {
      ...applicants.value[applicantIndex],
      status: selectedApplicant.value.status,
      isSubmitted: true
    }
  }

  const jobIndex = jobs.value.findIndex(j => j.id === selectedJob.value.id)
  if (jobIndex !== -1) {
    const job = jobs.value[jobIndex]
    const status = selectedApplicant.value.status

    if (status === 'Qualified') {
      job.qualified++
      job.pending--
    } else if (status === 'Unqualified') {
      job.unqualified++
      job.pending--
    }
  }

  showQSModal.value = false
  showConfirmationModal.value = false
}

// PDS Modal functions
const showPDSModal = ref(false)
const viewApplicantPDS = () => {
  if (selectedApplicant.value && selectedApplicant.value.id) {
    const fullApplicantData = applicants.value.find(a => a.id === selectedApplicant.value.id)
    if (fullApplicantData) {
      selectedApplicant.value = { ...fullApplicantData, position: selectedJob.value.position }
    }
    showQSModal.value = false
    setTimeout(() => {
      showPDSModal.value = true
    }, 100)
  }
}
const closePDSModal = () => {
  showPDSModal.value = false
}
const openQualificationFromPDS = () => {
  showPDSModal.value = false
  setTimeout(() => {
    showQSModal.value = true
  }, 100)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Qualified': return 'positive'
    case 'Pending': return 'warning'
    case 'Unqualified': return 'negative'
    default: return 'grey'
  }
}

onMounted(() => {
  const today = new Date()
  const lastMonth = new Date()
  lastMonth.setMonth(today.getMonth() - 1)

  dateRange.value = {
    from: formatDate(lastMonth, 'YYYY/MM/DD'),
    to: formatDate(today, 'YYYY/MM/DD'),
  }
  updateFormattedDate()
})
</script>

<style scoped lang="scss">
.my-sticky-header-table {
  .q-table__top {
    padding: 12px 20px;
  }

  thead tr:first-child th {
    background-color: #FFF;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 16px;
    padding: 16px;

    .column {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .q-field {
      &__control {
        height: 32px;
        min-height: 32px;
      }

      &__native, &__prefix, &__suffix {
        padding: 0;
      }

      &__marginal {
        height: 32px;
      }
    }
  }

  tbody td {
    padding: 14px 16px;
    font-size: 15px;
  }

  .q-table__grid-item {
    margin-bottom: 12px;
  }

  .q-card {
    font-size: 16px;
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;

    &:hover {
      transform: scale(1.03);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    }
  }

  .q-table__bottom {
    border-top: 1px solid #ddd;
    padding: 8px 16px;

    .q-table__control {
      min-height: 40px;
    }

    .q-table__separator {
      margin: 0 8px;
    }
  }
}

h5 {
  margin-bottom: 0;
}

.q-gutter-md {
  margin-bottom: 4px;
}

.q-tab-panels {
  background: none;
  border-radius: 0;
}

.q-card-section {
  ol {
    padding-left: 1.5em;
    margin: 0.5em 0;
  }

  li {
    margin-bottom: 0.5em;
  }
}

.text-subtitle1,
.text-subtitle2 {
  font-weight: 500;
}

.q-card {
  &--bordered {
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}

.q-markup-table {
  width: 100%;

  th,
  td {
    padding: 8px 12px;
  }

  thead tr {
    background-color: #f5f5f5;
  }
}

.bg-grey-3 {
  background-color: #eee;
}

.q-btn {
  &__content {
    font-weight: 500;
  }
}
</style>
