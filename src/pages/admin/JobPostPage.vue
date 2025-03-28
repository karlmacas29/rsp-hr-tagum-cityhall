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
      <q-input
        dense
        outlined
        readonly
        v-model="formattedDateRange"
        label="Selected Date Range"
      >
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
          :rows="rows"
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
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6">{{ props.row.position }}</div>
                  <div class="text-subtitle2">Posted: {{ props.row.postingDate }}</div>
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

    <template v-slot:body-cell-status="props">
  <q-td :props="props">
    <q-badge :color="getStatusColor(props.row.status)" class="q-pa-sm">
      {{ props.row.status }}
      <q-tooltip v-if="props.row.status === 'Pending'">
        Click "View QS" to evaluate
      </q-tooltip>
    </q-badge>
  </q-td>
</template>
   <!-- Job Details Dialog -->
<q-dialog v-model="showJobDetails" persistent>
  <q-card style="width: 800px; max-width: 90vw;">
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
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="text-h6 q-mb-sm">Qualification Standard/Requirements</div>
      <div class="q-pl-md">
        <div class="text-subtitle2 q-mb-xs">BASIC QUALIFICATIONS:</div>
        <ol class="q-pl-md">
          <li>Must be graduated any 4 year course</li>
          <li>Preferably BS/IT with relevant experience</li>
          <li>Fresh graduates are welcome to apply</li>
        </ol>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="View Applicants" color="primary" @click="showApplicantsDialog" />
      <q-btn flat label="Close" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

    <!-- Applicants Dialog -->
    <q-dialog v-model="showApplicants" persistent>
      <q-card style="width: 800px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Applicants for {{ selectedJob.position }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="applicants"
            :columns="applicantColumns"
            row-key="id"
            flat
            bordered
            hide-pagination=""
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
                  @click="viewApplicantQS(props.row)"
                  size="sm"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Back to Job Details" color="primary" @click="backToJobDetails" />
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Quality Standard Modal -->
<QualityStandardModal
  v-model="showQSModal"
  :mode="qsModalMode"
  :employee-name="selectedApplicant.name"
  :applied-position="selectedJob.position"
  :application-status="selectedApplicant.status"
  @qualified="markAsQualified"
  @unqualified="markAsUnqualified"
  @view-pds="viewApplicantPDS"
  @submit="submitEvaluation"
/>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import QualityStandardModal from 'components/QualityStandardModal.vue'


const dateRange = ref({ from: '', to: '' })
const formattedDateRange = ref('')

const updateFormattedDate = () => {
  const { from, to } = dateRange.value
  formattedDateRange.value = from && to ? `${from} - ${to}` : ''
}

// Quality Standard Modal state
const showQSModal = ref(false)
const qsModalMode = ref('applicant')
const selectedApplicant = ref({
  id: null,
  name: '',
  status: ''
})
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
    sortable: true,
  },
  {
    name: 'applicants',
    align: 'center',
    label: 'No. of Applicants',
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
    label: 'Action',
    field: 'action',
    sortable: false,
  },
]

const rows = [
  {
    officePosition: 'ICT Department',
    position: 'Computer Programmer II',
    postingDate: '01-20-2025',
    applicants: 10,
    pending: 0,
    qualified: 5,
    unqualified: 5,
    action: '',
  },
  {
    officePosition: 'ICT Department',
    position: 'Systems Analyst',
    postingDate: '02-26-2025',
    applicants: 20,
    pending: 0,
    qualified: 0,
    unqualified: 0,
    action: '',
  },
  {
    officePosition: 'ICT Department',
    position: 'Data Analyst',
    postingDate: '03-20-2025',
    applicants: 0,
    pending: 0,
    qualified: 0,
    unqualified: 0,
    action: '',
  },
]

const showJobDetails = ref(false)
const showApplicants = ref(false)
const selectedJob = ref({
  officePosition: '',
  position: '',
  postingDate: '',
  applicants: 0,
  pending: 0,
  qualified: 0,
  unqualified: 0
})

const applicantColumns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'appliedDate', label: 'Applied Date', field: 'appliedDate', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  {
    name: 'action',
    label: 'Action',
    field: 'action',
    align: 'center',
    sortable: false
  }
]

const applicants = ref([
  { id: 1, name: 'John Doe', appliedDate: '2025-01-25', status: 'Qualified' },
  { id: 2, name: 'Jane Smith', appliedDate: '2025-01-26', status: 'Pending' },
  { id: 3, name: 'Robert Johnson', appliedDate: '2025-01-27', status: 'Unqualified' }
])

const viewJobDetails = (job) => {
  selectedJob.value = job
  showJobDetails.value = true
}

const showApplicantsDialog = () => {
  showJobDetails.value = false
  showApplicants.value = true
}

const backToJobDetails = () => {
  showApplicants.value = false
  showJobDetails.value = true
}

const viewApplicantQS = (applicant) => {
  selectedApplicant.value = {
    id: applicant.id,
    name: applicant.name,
    status: applicant.status
  }
  showQSModal.value = true
}

const getStatusColor = (status) => {
  switch(status) {
    case 'Qualified': return 'positive'
    case 'Pending': return 'warning'
    case 'Unqualified': return 'negative'
    default: return 'grey'
  }
}
const markAsQualified = () => {
  // Update applicant status in your data
  const applicant = applicants.value.find(a => a.id === selectedApplicant.value.id)
  if (applicant) {
    applicant.status = 'Qualified'
  }
  showQSModal.value = false
  // You might want to add API call here to persist the change
}

const markAsUnqualified = () => {
  // Update applicant status in your data
  const applicant = applicants.value.find(a => a.id === selectedApplicant.value.id)
  if (applicant) {
    applicant.status = 'Unqualified'
  }
  showQSModal.value = false
  // You might want to add API call here to persist the change
}

const viewApplicantPDS = () => {
  // Implement PDS viewing logic
  console.log('View PDS for:', selectedApplicant.value.name)
  // You might want to open another dialog or route here
  showQSModal.value = false
}

const submitEvaluation = () => {
  // Implement submission logic
  console.log('Submit evaluation for:', selectedApplicant.value.name)
  showQSModal.value = false
}
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
  }
}

h5 {
  margin-bottom: 0;
}

.q-gutter-md {
  margin-bottom: 4px;
}

.job-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.job-card:hover {
  transform: scale(1.03);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}

.q-dialog__inner--minimized > div {
  max-width: 90vw;
}

.q-tab-panels {
  background: none;
  border-radius: 0;
}

.q-card-section ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}
.q-card-section li {
  margin-bottom: 0.5em;
}
</style>
