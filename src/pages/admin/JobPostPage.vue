<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Job Posts</b></h5>
      <div class="q-pa-sm q-gutter-sm">
        <q-breadcrumbs class="q-ma-none" active-color="green">
          <template v-slot:separator>
            <q-icon size="1.2em" name="arrow_forward" />
          </template>
          <q-breadcrumbs-el label="Job Posts" icon="post_add" />
          <!-- <q-breadcrumbs-el label="Job Posts" icon="home" /> -->
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Job List View -->
    <div v-if="!showingDetails" class="q-pa-md">
      <div class="row justify-between items-center q-mb-md">
        <q-input
          outlined
          dense
          readonly
          v-model="dateRangeText"
          placeholder="Select date range"
          class="col-auto"
          style="max-width: 300px"
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
                  today-btn
                  mask="YYYY-MM-DD"
                  color="primary"
                  minimal
                />
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
          style="max-width: 250px"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>

      <q-table
        :rows="jobs"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        class="job-posts-table"
        :loading="jobPostStore.loading"
      >
        <template v-slot:body-cell-Office="props">
          <q-td :props="props">
            <div style="width: 180px; white-space: normal">
              <span class="text-body1 text-weight-medium text-black">
                {{ props.row.Office }}
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-position="props">
          <q-td :props="props">
            <div style="width: 80px; white-space: normal">
              <span class="text-body1 text-weight-medium text-black">
                {{ props.row.Position }}
              </span>
            </div>
          </q-td>
        </template>
        <!--  -->
        <template v-slot:body-cell-applicants="props">
          <q-td :props="props">
            <div class="text-center">{{ props.row.applicants }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-pending="props">
          <q-td :props="props">
            <div class="text-center">{{ props.row.pending }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-qualified="props">
          <q-td :props="props">
            <div class="text-center">{{ props.row.qualified }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-unqualified="props">
          <q-td :props="props">
            <div class="text-center">{{ props.row.unqualified }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn flat dense color="primary" icon="visibility" @click="viewJobDetails(props.row)">
              <q-tooltip>View Details</q-tooltip>
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
      <q-card style="min-width: 400px; border-radius: 8px">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="help_outline" color="primary" size="md" class="q-mr-sm" />
          <span class="text-h5">
            Confirm Evaluation {{ selectedApplicant.isSubmitted ? 'Update' : 'Submission' }}
          </span>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <div class="text-body1 q-mb-md">
            You are about to
            <span class="text-weight-bold">
              {{ selectedApplicant.isSubmitted ? 'update' : 'submit' }}
            </span>
            this evaluation:
          </div>

          <div class="q-pa-sm bg-grey-2 rounded-borders">
            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-medium">Applicant:</div>
              <div class="col-8">{{ selectedApplicant.name }}</div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-4 text-weight-medium">Status:</div>
              <div class="col-8">
                <q-badge :color="getStatusColor(pendingStatus)" class="q-px-sm q-py-xs">
                  {{ pendingStatus }}
                </q-badge>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup size="md" />
          <q-btn
            :label="selectedApplicant.isSubmitted ? 'Confirm Update' : 'Confirm Submission'"
            color="primary"
            @click="submitEvaluation"
            v-close-popup
            size="md"
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
    sortBy: 'postingDate',
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

  // Only keeping the setDateRange method as it's used in onMounted
  const setDateRange = (days) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);

    dateRange.value = {
      from: formatDate(fromDate, 'YYYY/MM/DD'),
      to: formatDate(toDate, 'YYYY/MM/DD'),
    };
  };

  // Job Posts Data
  const columns = [
    {
      name: 'Office',
      label: 'Office',
      align: 'left',
      field: 'Office',
      sortable: true,
    },
    {
      name: 'position',
      label: 'Position',
      align: 'left',
      field: 'Position',
      sortable: true,
    },
    {
      name: 'postingDate',
      align: 'left',
      label: 'Posting Date',
      field: 'post_date',
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
  ];

  const jobs = ref([]);

  // const filteredJobs = computed(() => {
  //   let filtered = jobs.value;

  //   // Date filtering with new range object
  //   if (dateRange.value.from && dateRange.value.to) {
  //     filtered = filtered.filter((job) => {
  //       const jobDate = new Date(job.postingDate);
  //       const from = new Date(dateRange.value.from);
  //       const to = new Date(dateRange.value.to);
  //       return jobDate >= from && jobDate <= to;
  //     });
  //   }

  //   // Global search filtering
  //   if (globalSearch.value) {
  //     const searchTerm = globalSearch.value.toLowerCase();
  //     filtered = filtered.filter((job) => {
  //       return (
  //         (job.officePosition && job.officePosition.toLowerCase().includes(searchTerm)) ||
  //         (job.position && job.position.toLowerCase().includes(searchTerm)) ||
  //         (job.postingDate &&
  //           formatDate(job.postingDate, 'MMM D, YYYY').toLowerCase().includes(searchTerm)) ||
  //         (job.applicants && job.applicants.toString().includes(searchTerm)) ||
  //         (job.pending && job.pending.toString().includes(searchTerm)) ||
  //         (job.qualified && job.qualified.toString().includes(searchTerm)) ||
  //         (job.unqualified && job.unqualified.toString().includes(searchTerm))
  //       );
  //     });
  //   }

  //   return filtered;
  // });

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
    router.push({ name: 'JobPost View', params: { id: job.PositionID } });
    // selectedJob.value = { ...job };
    // showingDetails.value = true;
    // applicants.value = applicants.value.map((applicant) => ({
    //   ...applicant,
    //   status: 'Pending',
    //   isSubmitted: false,
    // }));
  };

  // const goBackToList = () => {
  //   showingDetails.value = false;
  // };

  // Applicants View
  // const loadingApplicants = ref(false);
  // const applicantColumns = [
  //   { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  //   {
  //     name: 'appliedDate',
  //     label: 'Applied Date',
  //     field: 'appliedDate',
  //     align: 'left',
  //     format: (val) => formatDate(val, 'MMM D, YYYY'),
  //   },
  //   {
  //     name: 'status',
  //     label: 'Status',
  //     field: 'status',
  //     align: 'center',
  //   },
  //   {
  //     name: 'action',
  //     label: 'Action',
  //     field: 'action',
  //     align: 'center',
  //     sortable: false,
  //   },
  // ];

  const applicants = ref([
    {
      id: 1,
      name: 'John Doe',
      appliedDate: '2025-04-02',
      status: 'Pending',
      isSubmitted: false,
    },
  ]);

  // const filteredApplicants = computed(() => {
  //   return applicants.value.filter(
  //     (applicant) => applicant.appliedDate >= selectedJob.value.postingDate,
  //   );
  // });

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

  const positionRequirements = ref({
    education: "Bachelor's Degree in related field",
    preferredEducation: "Master's Degree preferred",
    experience: 'Minimum 3 years relevant experience',
    preferredExperience: '5+ years in leadership role',
    training: 'Certification in relevant field',
    preferredTraining: 'Multiple advanced certifications',
    eligibility: 'Professional license required',
    preferredCertification: 'Additional specialized certifications',
  });

  // Confirmation Modal
  const showConfirmationModal = ref(false);

  // const openQualificationModal = (applicant) => {
  //   selectedApplicant.value = {
  //     ...applicant,
  //     position: selectedJob.value.position,
  //     applicationDate: formatDate(applicant.appliedDate, 'MMM D, YYYY'),
  //   };
  //   // Reset pending status to current status when opening modal
  //   pendingStatus.value = applicant.status;
  //   showQSModal.value = true;
  // };

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
    await jobPostStore.fetchJobPosts();
    jobs.value = jobPostStore.jobPosts;
    // Set the date range to the last 30 days
    setDateRange(30);
  });
</script>

<style scoped lang="scss">
  /* Typography improvements */
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h5,
  .text-h6 {
    letter-spacing: -0.015em;
  }

  /* Main page title */
  .text-h3 {
    font-size: 2rem;
    line-height: 2.5rem;
    margin-bottom: 1.5rem;
  }

  /* Section headings */
  .text-h5 {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  /* Subsection headings */
  .text-h6 {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  /* Table improvements */
  .job-posts-table,
  .applicants-table {
    font-size: 1rem;

    th {
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    td {
      font-size: 1rem;
    }
  }

  /* Status badges */
  .status-badge {
    font-size: 0.9rem;
    padding: 4px 8px;
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

  /* Spacing improvements */
  .q-mb-sm {
    margin-bottom: 12px;
  }

  .q-mb-lg {
    margin-bottom: 28px;
  }

  .q-my-lg {
    margin-top: 28px;
    margin-bottom: 28px;
  }

  /* Button sizing */
  .q-btn {
    font-size: 0.95rem;
  }

  /* Qualification list styling */
  .text-body1 {
    font-size: 1rem;
    line-height: 1.5rem;
  }
</style>
