<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Job Posts</b></h5>
    </div>

    <!-- Job List View -->
    <div v-if="!showingDetails" class="q-pa-sm">
      <div class="row justify-between items-center q-mb-md">
        <q-input
          outlined
          dense
          readonly
          v-model="dateRangeText"
          placeholder="Select Date Range"
          class="col-auto q-mr-md"
          style="max-width: 280px"
        >
          <template v-slot:prepend>
            <q-icon name="event" color="primary" class="cursor-pointer" />
          </template>
          <template v-slot:append>
            <q-icon name="arrow_drop_down" color="primary" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="dateRange"
                  range
                  landscape
                  today-btn
                  mask="YYYY-MM-DD"
                  color="primary"
                  @update:model-value="onDateRangeChange"
                >
                  <div class="row items-center justify-end q-gutter-x-sm">
                    <q-btn
                      label="Clear"
                      class="bg-negative text-white"
                      rounded
                      flat
                      dense
                      @click="dateRange = { from: '', to: '' }"
                      v-if="dateRange.from || dateRange.to"
                    />
                    <q-btn
                      label="Okay"
                      class="bg-primary text-white"
                      rounded
                      flat
                      dense
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          v-model="globalSearch"
          outlined
          dense
          placeholder="Search jobs..."
          class="col-auto"
          style="max-width: 220px"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>

      <q-table
        :rows="filteredJobs"
        :columns="columns"
        row-key="PositionID"
        :pagination="pagination"
        class="job-posts-table q-mt-md"
        :loading="jobPostStore.loading"
        table-style="min-width: 100%"
      >
        <template v-slot:body-cell-Office="props">
          <q-td :props="props" class="office-column">
            <div class="text-body2 text-weight-medium text-black">
              {{ props.row.Office }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-position="props">
          <q-td :props="props" class="position-column">
            <div class="text-body2 text-weight-medium text-black">
              {{ props.row.Position }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-post_date="props">
          <q-td :props="props" class="date-column">
            <q-badge rounded color="green" class="text-caption q-px-sm">
              {{ formatDate(props.row.post_date, 'MMM D, YYYY') }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-applicants="props">
          <q-td :props="props" class="count-column">
            <div class="text-center text-body2">{{ props.row.applicants }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-pending="props">
          <q-td :props="props" class="count-column">
            <div class="text-center text-body2">{{ props.row.pending }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-qualified="props">
          <q-td :props="props" class="count-column">
            <div class="text-center text-body2">{{ props.row.qualified }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-unqualified="props">
          <q-td :props="props" class="count-column">
            <div class="text-center text-body2">{{ props.row.unqualified }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props" class="action-column">
            <q-btn
              round
              flat
              color="blue"
              class="bg-blue-1"
              icon="visibility"
              @click="viewJobDetails(props.row)"
            >
              <q-tooltip>View Job Details</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-md text-grey">Jobpost is Empty</div>
        </template>
      </q-table>
    </div>

    <!-- Quality Standard Modal -->
    <QualityStandardModal
      v-model="showQSModal"
      variant="applicant"
      :applicant-data="applicantWithPendingStatus"
      :position-requirements="positionRequirements"
      @view-pds="viewApplicantPDS"
      @toggle-qualification="handleTemporaryQualificationToggle"
      @submit="promptSubmitEvaluation"
      @close="closeQualificationModal"
      @check-evaluation-status="refreshApplicantStatus"
      :is-submitted="false"
    />

    <!-- PDS Modal (Nested Dialog) -->
    <q-dialog v-model="showPDSModal" backdrop-opacity="0.7">
      <PDSModal v-model="showPDSModal" :applicant="selectedApplicant" @close="closePDSModal" />
    </q-dialog>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmationModal" persistent>
      <q-card style="min-width: 350px; border-radius: 6px">
        <q-card-section class="row items-center q-pb-md">
          <q-icon name="help_outline" color="primary" size="sm" class="q-mr-sm" />
          <span class="text-subtitle1">
            Confirm Evaluation {{ selectedApplicant.isSubmitted ? 'Update' : 'Submission' }}
          </span>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-md">
          <div class="text-body2 q-mb-sm">
            You are about to
            <span class="text-weight-bold">
              {{ selectedApplicant.isSubmitted ? 'update' : 'submit' }}
            </span>
            this evaluation:
          </div>
          <div class="q-pa-sm bg-grey-2 rounded-borders">
            <div class="row q-col-gutter-sm q-mb-sm">
              <div class="col-4 text-weight-medium text-caption">Applicant:</div>
              <div class="col-8 text-caption">{{ selectedApplicant.name }}</div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-4 text-weight-medium text-caption">Status:</div>
              <div class="col-8">
                <q-badge
                  :color="getStatusColor(pendingStatus)"
                  class="q-px-sm q-py-xs text-caption"
                >
                  {{ pendingStatus }}
                </q-badge>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-sm">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn
            :label="selectedApplicant.isSubmitted ? 'Confirm Update' : 'Confirm'"
            color="primary"
            @click="submitEvaluation"
            v-close-popup
          />
        </q-card-actions>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { date } from 'quasar';
  import QualityStandardModal from 'components/QualityStandardModal.vue';
  import PDSModal from 'components/PDSModal.vue';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const route = useRoute();
  const jobPostStore = useJobPostStore();

  const { formatDate } = date;
  // Page State
  const showingDetails = ref(false);
  const pagination = ref({
    sortBy: 'post_date',
    descending: true,
    page: 1,
    rowsPerPage: 10,
  });

  // Track the pending status separately from the actual status
  const pendingStatus = ref('Pending');

  // Global Search
  const globalSearch = ref('');

  // Date Range as an object
  const dateRange = ref({
    from: '',
    to: '',
  });

  // Computed property for display text
  const dateRangeText = computed(() => {
    if (!dateRange.value.from && !dateRange.value.to) return '';
    return `${formatDate(dateRange.value.from, 'MMM D, YYYY')} - ${formatDate(dateRange.value.to, 'MMM D, YYYY')}`;
  });

  // Modified setDateRange to show the entire current year by default
  const setDateRange = () => {
    const currentYear = new Date().getFullYear();
    const fromDate = new Date(currentYear, 0, 1); // January 1st of current year
    const toDate = new Date(currentYear, 11, 31); // December 31st of current year

    dateRange.value = {
      from: formatDate(fromDate, 'YYYY/MM/DD'),
      to: formatDate(toDate, 'YYYY/MM/DD'),
    };
  };

  const onDateRangeChange = (newRange) => {
    dateRange.value = newRange;
  };

  const columns = [
    {
      name: 'Office',
      label: 'Office',
      align: 'left',
      field: 'Office',
      sortable: true,
      style: 'width: 20%',
    },
    {
      name: 'position',
      label: 'Position',
      align: 'left',
      field: 'Position',
      sortable: true,
      style: 'width: 25%',
    },
    {
      name: 'post_date',
      align: 'center',
      label: 'Posted Date',
      field: 'post_date',
      sortable: true,
      style: 'width: 12%',
    },
    {
      name: 'applicants',
      align: 'center',
      label: 'Applicants',
      field: 'applicants',
      sortable: true,
      style: 'width: 9%',
    },
    {
      name: 'pending',
      align: 'center',
      label: 'Pending',
      field: 'pending',
      sortable: true,
      style: 'width: 9%',
    },
    {
      name: 'qualified',
      align: 'center',
      label: 'Qualified',
      field: 'qualified',
      sortable: true,
      style: 'width: 9%',
    },
    {
      name: 'unqualified',
      align: 'center',
      label: 'Unqualified',
      field: 'unqualified',
      sortable: true,
      style: 'width: 10%',
    },
    {
      name: 'action',
      align: 'center',
      label: 'Actions',
      field: 'action',
      sortable: false,
      style: 'width: 6%',
    },
  ];

  const jobs = ref([]);

  // Add this computed property to filter jobs by date range
  const filteredJobs = computed(() => {
    let filtered = jobs.value;

    // Apply date range filtering
    if (dateRange.value.from && dateRange.value.to) {
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.post_date);
        const from = new Date(dateRange.value.from);
        const to = new Date(dateRange.value.to);
        // Set time to end of day for "to" date to include the entire day
        to.setHours(23, 59, 59, 999);
        return jobDate >= from && jobDate <= to;
      });
    }

    // Apply global search filter if needed
    if (globalSearch.value) {
      const searchTerm = globalSearch.value.toLowerCase();
      filtered = filtered.filter((job) => {
        return (
          (job.Office && job.Office.toLowerCase().includes(searchTerm)) ||
          (job.Position && job.Position.toLowerCase().includes(searchTerm)) ||
          (job.post_date &&
            formatDate(job.post_date, 'MMM D, YYYY').toLowerCase().includes(searchTerm)) ||
          (job.applicants !== undefined && job.applicants.toString().includes(searchTerm)) ||
          (job.pending !== undefined && job.pending.toString().includes(searchTerm)) ||
          (job.qualified !== undefined && job.qualified.toString().includes(searchTerm)) ||
          (job.unqualified !== undefined && job.unqualified.toString().includes(searchTerm))
        );
      });
    }

    return filtered;
  });

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
  });

  const viewJobDetails = (job) => {
    router.push({
      name: 'JobPost View',
      params: { PositionID: job.PositionID, ItemNo: job.ItemNo },
    });
  };

  const applicants = ref([
    {
      id: 1,
      name: 'John Doe',
      appliedDate: '2025-04-02',
      status: 'Pending',
      isSubmitted: false,
    },
  ]);

  // Qualification Standard Modal
  const showQSModal = ref(false);
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
    personalInfo: {},
  });

  // Create a computed property that merges the selected applicant with the pending status
  const applicantWithPendingStatus = computed(() => {
    return {
      ...selectedApplicant.value,
      status: pendingStatus.value,
    };
  });

  // const positionRequirements = ref({
  //   education: "Bachelor's Degree in related field",
  //   preferredEducation: "Master's Degree preferred",
  //   experience: 'Minimum 3 years relevant experience',
  //   preferredExperience: '5+ years in leadership role',
  //   training: 'Certification in relevant field',
  //   preferredTraining: 'Multiple advanced certifications',
  //   eligibility: 'Professional license required',
  //   preferredCertification: 'Additional specialized certifications',
  // });

  // Confirmation Modal
  const showConfirmationModal = ref(false);

  const closeQualificationModal = () => {
    // Reset pending status when closing without submitting
    pendingStatus.value = selectedApplicant.value.status;
    showQSModal.value = false;
  };

  const refreshApplicantStatus = () => {
    if (selectedApplicant.value && selectedApplicant.value.id) {
      const currentApplicant = applicants.value.find((a) => a.id === selectedApplicant.value.id);
      if (currentApplicant) {
        selectedApplicant.value = {
          ...selectedApplicant.value,
          status: currentApplicant.status,
          isSubmitted: currentApplicant.isSubmitted,
        };
        // Reset pending status to match current status
        pendingStatus.value = currentApplicant.status;
      }
    }
  };

  const handleTemporaryQualificationToggle = (newStatus) => {
    // Always allow switching between Qualified or Unqualified
    pendingStatus.value = newStatus;
  };

  const promptSubmitEvaluation = () => {
    if (pendingStatus.value === 'Pending') {
      console.warn('Please select Qualified or Unqualified before submitting');
      return;
    }
    showConfirmationModal.value = true;
  };

  const submitEvaluation = () => {
    const applicantIndex = applicants.value.findIndex((a) => a.id === selectedApplicant.value.id);
    if (applicantIndex !== -1) {
      // If this is an update to an already submitted evaluation
      if (selectedApplicant.value.isSubmitted) {
        // Get previous status to update job counts
        const previousStatus = applicants.value[applicantIndex].status;

        // Update job counts if status changed
        if (previousStatus !== pendingStatus.value) {
          const jobIndex = jobs.value.findIndex((j) => j.id === selectedJob.value.id);
          if (jobIndex !== -1) {
            const job = jobs.value[jobIndex];

            // Decrement previous status count
            if (previousStatus === 'Qualified') {
              job.qualified--;
            } else if (previousStatus === 'Unqualified') {
              job.unqualified--;
            } else if (previousStatus === 'Pending') {
              job.pending--;
            }

            // Increment new status count
            if (pendingStatus.value === 'Qualified') {
              job.qualified++;
            } else if (pendingStatus.value === 'Unqualified') {
              job.unqualified++;
            } else if (pendingStatus.value === 'Pending') {
              job.pending++;
            }
          }
        }
      } else {
        // This is a new submission
        const jobIndex = jobs.value.findIndex((j) => j.id === selectedJob.value.id);
        if (jobIndex !== -1) {
          const job = jobs.value[jobIndex];

          if (pendingStatus.value === 'Qualified') {
            job.qualified++;
            job.pending--;
          } else if (pendingStatus.value === 'Unqualified') {
            job.unqualified++;
            job.pending--;
          }
        }
      }

      // Update the applicant status and mark as submitted
      applicants.value[applicantIndex] = {
        ...applicants.value[applicantIndex],
        status: pendingStatus.value,
        isSubmitted: true,
      };

      selectedApplicant.value.status = pendingStatus.value;
      selectedApplicant.value.isSubmitted = true;
    }

    showQSModal.value = false;
    showConfirmationModal.value = false;
  };

  // PDS Modal functions
  const showPDSModal = ref(false);
  const viewApplicantPDS = () => {
    if (selectedApplicant.value && selectedApplicant.value.id) {
      const fullApplicantData = applicants.value.find((a) => a.id === selectedApplicant.value.id);
      if (fullApplicantData) {
        selectedApplicant.value = { ...fullApplicantData, position: selectedJob.value.position };
      }
      showPDSModal.value = true;
    }
  };

  const closePDSModal = () => {
    showPDSModal.value = false;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Qualified':
        return 'positive';
      case 'Pending':
        return 'warning';
      case 'Unqualified':
        return 'negative';
      default:
        return 'grey';
    }
  };

  onMounted(async () => {
    // Fetch job posts from the store
    await jobPostStore.job_post_list();
    jobs.value = jobPostStore.jobPosts;
    // Set the date range to the last 30 days
    setDateRange();
  });
</script>

<style scoped lang="scss">
  /* Typography improvements */
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h5,
  .text-h6 {
    letter-spacing: -0.01em;
  }

  /* Main page title */
  .text-h3 {
    font-size: 1.8rem;
    line-height: 2.2rem;
    margin-bottom: 1rem;
  }

  /* Section headings */
  .text-h5 {
    font-size: 1.3rem;
    line-height: 1.7rem;
    margin-bottom: 0.5rem;
  }

  /* Subsection headings */
  .text-h6 {
    font-size: 1.1rem;
    line-height: 1.5rem;
  }

  /* Table improvements */
  .job-posts-table {
    font-size: 0.9rem;
    table-layout: fixed;
    width: 100%;

    th {
      font-size: 0.95rem;
      font-weight: 600;
      padding: 8px 12px;
      background-color: #f5f5f5;
    }

    td {
      font-size: 0.9rem;
      padding: 8px 12px;
      vertical-align: middle;
    }

    .office-column {
      width: 20%;
      white-space: normal;
      word-break: break-word;
    }

    .position-column {
      width: 25%;
      white-space: normal;
      word-break: break-word;
    }

    .date-column {
      width: 12%;
      text-align: center;
    }

    .count-column {
      width: 9%;
      text-align: center;
    }

    .action-column {
      width: 6%;
      text-align: center;
    }
  }

  /* Status badges */
  .status-badge {
    font-size: 0.85rem;
    padding: 3px 8px;
    border-radius: 4px;
  }

  /* Date picker improvements */
  .q-date__range {
    background-color: rgba(25, 118, 210, 0.08);
  }

  .q-date__range-from,
  .q-date__range-to {
    background-color: var(--q-primary);
    color: white;
    border-radius: 50%;
  }

  .q-date__range-between {
    background-color: rgba(25, 118, 210, 0.1);
  }

  /* Spacing improvements - increased for better readability */
  .q-mb-sm {
    margin-bottom: 10px;
  }

  .q-mb-md {
    margin-bottom: 16px;
  }

  .q-mb-lg {
    margin-bottom: 24px;
  }

  .q-my-md {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  /* Add spacing between rows */
  .q-table tbody tr td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  /* Button sizing */
  .q-btn {
    font-size: 0.9rem;
    padding: 0.4em 0.8em;
  }

  /* Qualification list styling */
  .text-body1 {
    font-size: 0.95rem;
    line-height: 1.4rem;
  }

  /* Padding adjustments - more breathing room */
  .q-pa-md {
    padding: 12px;
  }

  .q-pa-sm {
    padding: 8px;
  }

  .q-pa-xs {
    padding: 4px;
  }

  .q-card-section {
    padding: 12px;
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .job-posts-table {
      th,
      td {
        padding: 6px 8px;
      }
    }
  }
</style>
