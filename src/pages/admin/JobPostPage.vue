<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Job Posts</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Home" />
          <q-breadcrumbs-el class="text-bold" label="Job Posts" />
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Date Range Picker -->
    <div class="row items-center q-gutter-sm q-mb-md">
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

    <!-- Job Position Table -->
    <div class="q-pa-md">
      <q-card>
        <q-table
          :rows="filteredJobs"
          :columns="columns"
          row-key="position"
          :pagination="{ rowsPerPage: 10 }"
          class="my-sticky-header-table"
          flat
          bordered
          :grid="$q.screen.lt.md"
          style="width: 100%"
        >
          <!-- Grid mode slot for mobile/small screens -->
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

          <!-- Default slot for action column on desktop -->
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

    <!-- Job Details Dialog -->
    <q-dialog v-model="showJobDetails" persistent>
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Job Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-h5 text-center q-mb-md">{{ selectedJob.position }}</div>

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

        <q-card-actions align="right">
          <q-btn
            label="View Applicants"
            color="primary"
            @click="showApplicantsDialog"
            :disable="selectedJob.applicants === 0"
          />
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Applicants Dialog -->
    <q-dialog v-model="showApplicants" persistent>
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Applicants for {{ selectedJob.position }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
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
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  flat
                  color="primary"
                  label="View QS"
                  @click="openQualificationModal(props.row)"
                  size="sm"
                />
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-8 q-gutter-sm">
                <span>No applicants found</span>
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Back to Job Details" color="primary" @click="backToJobDetails" />
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Qualification Standard Modal -->
    <QualityStandardModal
      v-model="showQSModal"
      variant="applicant"
      :applicant-data="selectedApplicant"
      :position-requirements="positionRequirements"
      @view-pds="viewApplicantPDS"
      @toggle-qualification="handleQualificationToggle"
      @submit="submitEvaluation"
      @close="closeQualificationModal"
    />

    <!-- PDS Modal -->
    <PDSModal
      v-model="showPDSModal"
      :applicant="selectedApplicant"
      @close="closePDSModal"
      @view-qs="openQualificationFromPDS"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'
import QualityStandardModal from 'components/QualityStandardModal.vue'
import PDSModal from 'components/PDSModal.vue'

// Explicit component registration
defineOptions({
  components: { QualityStandardModal, PDSModal },
})

const { formatDate } = date

// Date Range Filter
const dateRange = ref({ from: '', to: '' })
const formattedDateRange = ref('')

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
    sortable: true,
  },
  {
    name: 'position',
    label: 'Position',
    align: 'left',
    field: 'position',
    sortable: true,
  },
  {
    name: 'postingDate',
    align: 'left',
    label: 'Posting Date',
    field: 'postingDate',
    format: (val) => formatDate(val, 'MMM D, YYYY'),
    sortable: true,
  },
  {
    name: 'applicants',
    align: 'center',
    label: 'Applicants',
    field: 'applicants',
    sortable: true,
  },
  {
    name: 'pending',
    align: 'center',
    label: 'Pending',
    field: 'pending',
    sortable: true,
  },
  {
    name: 'qualified',
    align: 'center',
    label: 'Qualified',
    field: 'qualified',
    sortable: true,
  },
  {
    name: 'unqualified',
    align: 'center',
    label: 'Unqualified',
    field: 'unqualified',
    sortable: true,
  },
  {
    name: 'action',
    align: 'center',
    label: 'Actions',
    field: 'action',
    sortable: false,
  },
]

const jobs = ref([
  {
    id: 1,
    officePosition: 'ICT Department',
    position: 'Computer Programmer II',
    postingDate: '2025-01-20',
    applicants: 10,
    pending: 0,
    qualified: 5,
    unqualified: 5,
    qualifications: [
      'Must be graduated any 4 year course',
      'Preferably BS/IT with relevant experience',
      'Fresh graduates are welcome to apply',
    ],
  },
  {
    id: 2,
    officePosition: 'ICT Department',
    position: 'Systems Analyst',
    postingDate: '2025-02-26',
    applicants: 20,
    pending: 0,
    qualified: 0,
    unqualified: 0,
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      'Minimum 3 years systems analysis experience',
      'Strong analytical and problem-solving skills',
    ],
  },
  {
    id: 3,
    officePosition: 'Human Resources',
    position: 'HR Manager',
    postingDate: '2025-03-15',
    applicants: 8,
    pending: 2,
    qualified: 3,
    unqualified: 3,
    qualifications: [
      "Bachelor's degree in Human Resources or related field",
      'Minimum 5 years HR experience',
      'Knowledge of labor laws and regulations',
    ],
  },
])

const filteredJobs = computed(() => {
  if (!dateRange.value.from || !dateRange.value.to) return jobs.value

  return jobs.value.filter((job) => {
    const jobDate = new Date(job.postingDate)
    const fromDate = new Date(dateRange.value.from)
    const toDate = new Date(dateRange.value.to)
    return jobDate >= fromDate && jobDate <= toDate
  })
})

// Job Details Dialog
const showJobDetails = ref(false)
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
  showJobDetails.value = true
}

// Applicants Dialog
const showApplicants = ref(false)
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
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
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
    name: 'John Smith',
    photo: 'https://cdn.quasar.dev/img/avatar.png',
    appliedDate: '2025-03-16',
    status: 'Pending',
    education: [
      { degree: "Bachelor's in HR Management", institution: 'State University', year: '2018' },
    ],
    experience: [{ position: 'HR Assistant', organization: 'Tech Corp', years: '3' }],
    training: [{ program: 'Advanced HR Certification', provider: 'HR Institute', hours: '40' }],
    eligibility: [],
    personalInfo: {
      dateOfBirth: 'January 01, 2003',
      placeOfBirth: 'Tagum City',
      sex: 'Male',
      civilStatus: 'Single',
      genderPreference: 'Man',
      height: '60',
      weight: '60kg',
      bloodType: 'A',
      telephone: '127455824',
      mobile: '098765432198'
    }
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    photo: 'https://cdn.quasar.dev/img/avatar2.jpg',
    appliedDate: '2025-03-17',
    status: 'Qualified',
    education: [
      {
        degree: "Master's in Organizational Psychology",
        institution: 'City College',
        year: '2020',
      },
    ],
    experience: [{ position: 'HR Specialist', organization: 'Global Solutions', years: '5' }],
    training: [{ program: 'Leadership Training', provider: 'Management Academy', hours: '60' }],
    eligibility: [
      { certification: 'Professional HR License', authority: 'National Board', year: '2021' },
    ],
    personalInfo: {
      dateOfBirth: 'February 15, 1995',
      placeOfBirth: 'Davao City',
      sex: 'Female',
      civilStatus: 'Married',
      genderPreference: 'Woman',
      height: '55',
      weight: '50kg',
      bloodType: 'B',
      telephone: '987654321',
      mobile: '09123456789'
    }
  },
  {
    id: 3,
    name: 'Michael Brown',
    photo: 'https://cdn.quasar.dev/img/avatar3.jpg',
    appliedDate: '2025-03-18',
    status: 'Unqualified',
    education: [
      { degree: "Bachelor's in Business Admin", institution: 'Community College', year: '2019' },
    ],
    experience: [{ position: 'Office Manager', organization: 'Small Business Inc.', years: '2' }],
    training: [],
    eligibility: [],
    personalInfo: {
      dateOfBirth: 'March 30, 1990',
      placeOfBirth: 'Cebu City',
      sex: 'Male',
      civilStatus: 'Single',
      genderPreference: 'Man',
      height: '58',
      weight: '65kg',
      bloodType: 'O',
      telephone: '123456789',
      mobile: '09234567890'
    }
  },
])

const filteredApplicants = computed(() => {
  return applicants.value.filter(
    (applicant) => applicant.appliedDate >= selectedJob.value.postingDate,
  )
})

const showApplicantsDialog = () => {
  showJobDetails.value = false
  showApplicants.value = true
}

const backToJobDetails = () => {
  showApplicants.value = false
  showJobDetails.value = true
}

// Qualification Standard Modal
const showQSModal = ref(false)
const selectedApplicant = ref({
  id: null,
  name: '',
  photo: '',
  position: '',
  status: 'Pending',
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

const openQualificationModal = (applicant) => {
  selectedApplicant.value = {
    ...applicant,
    position: selectedJob.value.position,
  }
  showQSModal.value = true
}

const closeQualificationModal = () => {
  showQSModal.value = false
}

const handleQualificationToggle = (newStatus) => {
  selectedApplicant.value.status = newStatus
  // Update the applicant in the applicants list
  const applicant = applicants.value.find((a) => a.id === selectedApplicant.value.id)
  if (applicant) {
    applicant.status = newStatus
  }

  // Update counts in the jobs list
  const job = jobs.value.find((j) => j.id === selectedJob.value.id)
  if (job) {
    if (newStatus === 'Qualified') {
      job.qualified++
      job.pending > 0 ? job.pending-- : job.unqualified--
    } else if (newStatus === 'Unqualified') {
      job.unqualified++
      job.pending > 0 ? job.pending-- : job.qualified--
    }
  }
}

// PDS Modal Functions
const showPDSModal = ref(false)

const viewApplicantPDS = () => {
  showPDSModal.value = true
  showQSModal.value = false
}

const closePDSModal = () => {
  showPDSModal.value = false
}

const openQualificationFromPDS = () => {
  showPDSModal.value = false
  showQSModal.value = true
}

// Utility Functions
const getStatusColor = (status) => {
  switch (status) {
    case 'Qualified':
      return 'positive'
    case 'Pending':
      return 'warning'
    case 'Unqualified':
      return 'negative'
    default:
      return 'grey'
  }
}

const submitEvaluation = () => {
  console.log('Submitted evaluation for:', selectedApplicant.value.name)
  showQSModal.value = false
}

// Initialize with some default date range
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
    background-color: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 16px;
    padding: 16px;
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
}

h5 {
  margin-bottom: 0;
}

.q-gutter-md {
  margin-bottom: 4px;
}

.q-dialog__inner--minimized > div {
  max-width: 90vw;
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

/* Add this to completely hide pagination */
.q-table__bottom {
  display: none;
}
</style>
