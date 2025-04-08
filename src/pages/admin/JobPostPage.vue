<template>
  <q-page class="q-pa-md">
    <!-- Navigation and Job Posts Header -->
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Job Posts</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Home" />
          <q-breadcrumbs-el class="text-bold" label="Job Posts" />
          <q-breadcrumbs-el v-if="showingDetails" class="text-bold" :label="selectedJob.position" />
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Date Range Picker (only visible in list view) -->
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
          <!-- Header with search inputs -->
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
                    v-if="col.name !== 'action'"
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

    <!-- Job Details View (Instead of Dialog) -->
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

      <!-- Applicants Section (Always shown on job details page if there are applicants) -->
      <q-card v-if="selectedJob.applicants > 0" flat bordered>
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
                  :label="props.row.isSubmitted ? 'View QS (Locked)' : 'View QS'"
                  @click="openQualificationModal(props.row)"
                  size="sm"
                  :icon="props.row.isSubmitted ? 'lock' : undefined"
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
      </q-card>
    </div>

    <!-- Keep the modals for QS and PDS -->
    <QualityStandardModal
      v-model="showQSModal"
      variant="applicant"
      :applicant-data="selectedApplicant"
      :position-requirements="positionRequirements"
      @view-pds="viewApplicantPDS"
      @toggle-qualification="handleQualificationToggle"
      @submit="promptSubmitEvaluation"
      @close="closeQualificationModal"
    />

    <PDSModal
      v-model="showPDSModal"
      :applicant="selectedApplicant"
      @close="closePDSModal"
      @view-qs="openQualificationFromPDS"
    />

    <!-- Confirmation Dialog for Evaluation Submission -->
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

        <q-card-section>
          <div class="text-caption text-negative">
            <q-icon name="warning" color="negative" class="q-mr-xs" />
            Once submitted, the status cannot be changed.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            color="grey-7"
            v-close-popup
            class="q-px-md"
          />
          <q-btn
            label="Confirm Submission"
            color="primary"
            @click="submitEvaluation"
            v-close-popup
            class="q-px-md"
            unelevated
          />
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

// Explicit component registration
defineOptions({
  components: { QualityStandardModal, PDSModal },
})

const { formatDate } = date

// Page State
const showingDetails = ref(false)

// Pagination Configuration
const pagination = ref({
  sortBy: 'postingDate',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

// Date Range Filter
const dateRange = ref({ from: '', to: '' })
const formattedDateRange = ref('')

// Search filters for each column
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

  },
  {
    name: 'position',
    label: 'Position',
    align: 'left',
    field: 'position',

  },
  {
    name: 'postingDate',
    align: 'left',
    label: 'Posting Date',
    field: 'postingDate',
    format: (val) => formatDate(val, 'MMM D, YYYY'),

  },
  {
    name: 'applicants',
    align: 'center',
    label: 'Applicants',
    field: 'applicants',

  },
  {
    name: 'pending',
    align: 'center',
    label: 'Pending',
    field: 'pending',

  },
  {
    name: 'qualified',
    align: 'center',
    label: 'Qualified',
    field: 'qualified',

  },
  {
    name: 'unqualified',
    align: 'center',
    label: 'Unqualified',
    field: 'unqualified',
  },
  {
    name: 'action',
    align: 'center',
    label: 'Actions',
    field: 'action',
    
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
  {
    id: 4,
    officePosition: 'Finance Department',
    position: 'Senior Accountant',
    postingDate: '2025-01-10',
    applicants: 15,
    pending: 3,
    qualified: 8,
    unqualified: 4,
    qualifications: [
      "Bachelor's degree in Accounting",
      'CPA license required',
      'Minimum 5 years accounting experience',
    ],
  },
  {
    id: 5,
    officePosition: 'Marketing Department',
    position: 'Digital Marketing Specialist',
    postingDate: '2025-02-15',
    applicants: 12,
    pending: 1,
    qualified: 7,
    unqualified: 4,
    qualifications: [
      "Bachelor's degree in Marketing or related field",
      '2+ years digital marketing experience',
      'Experience with SEO and social media marketing',
    ],
  },
  {
    id: 6,
    officePosition: 'Operations',
    position: 'Operations Manager',
    postingDate: '2025-03-01',
    applicants: 9,
    pending: 0,
    qualified: 6,
    unqualified: 3,
    qualifications: [
      "Bachelor's degree in Business Administration",
      '5+ years operations management experience',
      'Strong leadership and organizational skills',
    ],
  },
  {
    id: 7,
    officePosition: 'Customer Support',
    position: 'Support Team Lead',
    postingDate: '2025-01-25',
    applicants: 7,
    pending: 1,
    qualified: 4,
    unqualified: 2,
    qualifications: [
      "Bachelor's degree preferred",
      '3+ years customer service experience',
      '1+ years in a leadership role',
    ],
  },
  {
    id: 8,
    officePosition: 'Research & Development',
    position: 'Research Scientist',
    postingDate: '2025-02-10',
    applicants: 5,
    pending: 0,
    qualified: 3,
    unqualified: 2,
    qualifications: [
      "PhD in relevant scientific field",
      '2+ years research experience',
      'Published research papers preferred',
    ],
  },
  {
    id: 9,
    officePosition: 'Legal Department',
    position: 'Corporate Lawyer',
    postingDate: '2025-03-05',
    applicants: 4,
    pending: 0,
    qualified: 2,
    unqualified: 2,
    qualifications: [
      "Juris Doctor degree",
      'Active bar membership',
      '3+ years corporate law experience',
    ],
  },
  {
    id: 10,
    officePosition: 'Administration',
    position: 'Executive Assistant',
    postingDate: '2025-01-15',
    applicants: 18,
    pending: 2,
    qualified: 10,
    unqualified: 6,
    qualifications: [
      "Bachelor's degree preferred",
      '5+ years executive support experience',
      'Excellent organizational and communication skills',
    ],
  },
  {
    id: 11,
    officePosition: 'Sales Department',
    position: 'Sales Representative',
    postingDate: '2025-02-20',
    applicants: 22,
    pending: 5,
    qualified: 12,
    unqualified: 5,
    qualifications: [
      "Bachelor's degree in Business or related field",
      '2+ years sales experience',
      'Proven track record of meeting sales targets',
    ],
  },
  {
    id: 12,
    officePosition: 'Quality Assurance',
    position: 'QA Engineer',
    postingDate: '2025-03-10',
    applicants: 11,
    pending: 1,
    qualified: 7,
    unqualified: 3,
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      '3+ years QA experience',
      'Experience with automated testing tools',
    ],
  },
  {
    id: 13,
    officePosition: 'Public Relations',
    position: 'PR Specialist',
    postingDate: '2025-01-30',
    applicants: 9,
    pending: 0,
    qualified: 5,
    unqualified: 4,
    qualifications: [
      "Bachelor's degree in Communications or related field",
      '3+ years PR experience',
      'Excellent writing and media relations skills',
    ],
  },
  {
    id: 14,
    officePosition: 'Facilities Management',
    position: 'Facilities Coordinator',
    postingDate: '2025-02-05',
    applicants: 6,
    pending: 0,
    qualified: 4,
    unqualified: 2,
    qualifications: [
      "Bachelor's degree in Facilities Management or related field",
      '2+ years facilities experience',
      'Knowledge of building systems and maintenance',
    ],
  },
  {
    id: 15,
    officePosition: 'Training Department',
    position: 'Training Specialist',
    postingDate: '2025-03-20',
    applicants: 8,
    pending: 1,
    qualified: 5,
    unqualified: 2,
    qualifications: [
      "Bachelor's degree in Education or related field",
      '3+ years training experience',
      'Excellent presentation and facilitation skills',
    ],
  },
  {
    id: 16,
    officePosition: 'Security Department',
    position: 'Security Analyst',
    postingDate: '2025-01-05',
    applicants: 7,
    pending: 0,
    qualified: 4,
    unqualified: 3,
    qualifications: [
      "Bachelor's degree in Cybersecurity or related field",
      'Security certifications preferred',
      '2+ years security analysis experience',
    ],
  },
  {
    id: 17,
    officePosition: 'Product Development',
    position: 'Product Manager',
    postingDate: '2025-02-15',
    applicants: 10,
    pending: 2,
    qualified: 6,
    unqualified: 2,
    qualifications: [
      "Bachelor's degree in Business or related field",
      '5+ years product management experience',
      'Strong analytical and leadership skills',
    ],
  },
  {
    id: 18,
    officePosition: 'Health & Safety',
    position: 'Safety Officer',
    postingDate: '2025-03-25',
    applicants: 5,
    pending: 0,
    qualified: 3,
    unqualified: 2,
    qualifications: [
      "Bachelor's degree in Occupational Safety or related field",
      'Safety certifications required',
      '3+ years safety management experience',
    ],
  },
])

const filteredJobs = computed(() => {
  let filtered = jobs.value

  // Apply date range filter if set
  if (dateRange.value.from && dateRange.value.to) {
    filtered = filtered.filter((job) => {
      const jobDate = new Date(job.postingDate)
      const fromDate = new Date(dateRange.value.from)
      const toDate = new Date(dateRange.value.to)
      return jobDate >= fromDate && jobDate <= toDate
    })
  }

  // Apply search filters
  return filtered.filter(job => {
    return Object.entries(searchFilters.value).every(([key, value]) => {
      if (!value) return true // Skip if no filter value

      const jobValue = job[key]
      if (jobValue === undefined) return true // Skip if column not in job object

      // Handle different data types
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

// Job Details page navigation
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
    format: (val, row) => row.isSubmitted ? `${val} (Locked)` : val
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
    name: 'John Smith',
    photo: 'https://cdn.quasar.dev/img/avatar.png',
    appliedDate: '2025-03-16',
    status: 'Pending',
    isSubmitted: false,
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
    isSubmitted: false,
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
    isSubmitted: false,
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

// Qualification Standard Modal - keep this as a modal
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
  }
  showQSModal.value = true
}

const closeQualificationModal = () => {
  showQSModal.value = false
}

const handleQualificationToggle = (newStatus) => {
  // Check if evaluation has been submitted
  if (selectedApplicant.value.isSubmitted) {
    console.warn('Cannot change status after submission');
    return;
  }

  selectedApplicant.value.status = newStatus;
  // Update the applicant in the applicants list
  const applicant = applicants.value.find((a) => a.id === selectedApplicant.value.id);
  if (applicant) {
    applicant.status = newStatus;
  }

  // Update counts in the jobs list
  const job = jobs.value.find((j) => j.id === selectedJob.value.id);
  if (job) {
    if (newStatus === 'Qualified') {
      job.qualified++;
      job.pending > 0 ? job.pending-- : job.unqualified--;
    } else if (newStatus === 'Unqualified') {
      job.unqualified++;
      job.pending > 0 ? job.pending-- : job.qualified--;
    }
  }
}

// Show confirmation dialog before submitting
const promptSubmitEvaluation = () => {
  showConfirmationModal.value = true;
}

// Actually submit the evaluation
const submitEvaluation = () => {
  console.log('Submitted evaluation for:', selectedApplicant.value.name);

  // Update the applicant's submission status
  const applicantIndex = applicants.value.findIndex(a => a.id === selectedApplicant.value.id);
  if (applicantIndex !== -1) {
    applicants.value[applicantIndex].isSubmitted = true;
  }

  showQSModal.value = false;
  showConfirmationModal.value = false;
}

// PDS Modal - keep this as a modal
const showPDSModal = ref(false)

const viewApplicantPDS = () => {
  if (selectedApplicant.value && selectedApplicant.value.id) {
    const fullApplicantData = applicants.value.find(a => a.id === selectedApplicant.value.id);
    if (fullApplicantData) {
      selectedApplicant.value = { ...fullApplicantData, position: selectedJob.value.position };
    }

    showQSModal.value = false;
    setTimeout(() => {
      showPDSModal.value = true;
    }, 100);
  } else {
    console.error('No applicant selected or incomplete applicant data');
  }
}

const closePDSModal = () => {
  showPDSModal.value = false;
}

const openQualificationFromPDS = () => {
  showPDSModal.value = false;
  setTimeout(() => {
    showQSModal.value = true;
  }, 100);
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

    /* New styles for header cells with inputs */
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

  /* Pagination styles */
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
