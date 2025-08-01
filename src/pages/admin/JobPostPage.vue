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
          <q-td :props="props" class="action-column q-gutter-x-xs">
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
            <!-- Edit button -->
            <q-btn
              round
              flat
              color="orange"
              class="bg-orange-1"
              icon="edit"
              @click="editJobPost(props.row)"
            >
              <q-tooltip>Edit Job Post</q-tooltip>
            </q-btn>
            <!-- Delete icon only if applicants is 0 or falsy -->
            <q-btn
              v-if="canDeleteJob(props.row)"
              round
              flat
              color="negative"
              class="bg-red-1"
              icon="delete"
              @click="confirmDeleteJob(props.row)"
              :loading="deletingJobId === props.row.PositionID"
            >
              <q-tooltip>Delete Job Post</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-md text-grey">Jobpost is Empty</div>
        </template>
      </q-table>
    </div>

    <!-- Edit Job Post Modal -->
    <q-dialog v-model="showEditModal">
      <q-card
        class="q-pa-none"
        style="
          width: 900px;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        "
      >
        <q-card-section
          class="q-pa-md"
          style="position: sticky; top: 0; z-index: 2; background: white"
        >
          <div class="row justify-between">
            <div>
              <div class="text-h5 text-bold">Edit Job Post</div>
              <div class="text-body text-grey-8 text-bold">
                {{ editJobDetails.position }}
              </div>
              <q-chip dense>
                Position Level:
                <q-badge rounded dense color="green" class="text-white q-ml-sm">
                  {{ editJobDetails.level }}
                </q-badge>
              </q-chip>
            </div>
            <div>
              <q-btn icon="close" rounded flat @click="closeEditModal" />
            </div>
          </div>
        </q-card-section>

        <q-scroll-area class="q-px-md" style="height: 1000px">
          <q-card-section class="q-py-none">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input v-model="editJobDetails.office" label="Office" outlined dense disable />
              </div>
              <div class="col-6">
                <q-input
                  v-model="editJobDetails.division"
                  label="Division"
                  outlined
                  dense
                  disable
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input v-model="editJobDetails.section" label="Section" outlined dense disable />
              </div>
              <div class="col-6">
                <q-input v-model="editJobDetails.unit" label="Unit" outlined dense disable />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-6">
                <q-input
                  v-model="editJobDetails.startingDate"
                  label="Starting Date"
                  outlined
                  dense
                  mask="date"
                  disable
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="editJobDetails.endedDate"
                  label="Ended Date"
                  outlined
                  dense
                  mask="date"
                  :rules="[
                    (date) =>
                      date >= editJobDetails.startingDate || 'End date cannot be before start date',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="editJobDetails.endedDate"
                          :options="(date) => date >= editJobDetails.startingDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="text-h5 q-mb-sm text-bold">Qualification Standard</div>
            <q-table
              :rows="qsDataLoad"
              :columns="[
                { name: 'education', label: 'Education', field: 'Education', align: 'left' },
                { name: 'experience', label: 'Experience', field: 'Experience', align: 'left' },
                { name: 'training', label: 'Training', field: 'Training', align: 'left' },
                { name: 'eligibility', label: 'Eligibility', field: 'Eligibility', align: 'left' },
              ]"
              row-key="id"
              :loading="usePlantilla.qsLoad"
              hide-bottom
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td style="width: 100px; white-space: pre-line; word-break: break-word">
                    {{ props.row.Education }}
                  </q-td>
                  <q-td style="width: 100px; white-space: pre-line; word-break: break-word">
                    {{ props.row.Experience }}
                  </q-td>
                  <q-td style="width: 100px; white-space: pre-line; word-break: break-word">
                    {{ props.row.Training }}
                  </q-td>
                  <q-td style="width: 120px; white-space: pre-line; word-break: break-word">
                    {{ props.row.Eligibility }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>

          <!-- Current Document Display -->
          <q-card-section v-if="editJobDetails.currentDocument">
            <div class="text-h6 q-mb-sm">Current Document</div>
            <div class="row items-center q-gutter-md">
              <q-icon name="picture_as_pdf" size="md" color="red" />
              <div class="column">
                <div class="text-body2 text-weight-medium">
                  {{ editJobDetails.currentDocument.name }}
                </div>
                <div class="text-caption text-grey-6">
                  Uploaded on
                  {{ formatDate(editJobDetails.currentDocument.uploadDate, 'MMM D, YYYY') }}
                </div>
              </div>
              <q-btn
                flat
                color="primary"
                icon="download"
                label="Download"
                @click="downloadCurrentDocument"
              />
            </div>
          </q-card-section>

          <!-- Upload New Document Section -->
          <q-card-section>
            <div class="text-h6 q-mb-sm">
              Update Plantilla Funded PDF
              <span class="text-caption text-grey-6">
                (Optional - leave empty to keep current document)
              </span>
            </div>
            <q-file
              v-model="editJobDetails.newFile"
              borderless
              clearable
              accept=".pdf"
              :max-files="1"
              label="Upload new PDF file (Max 5MB)"
              style="width: 330px; border: 2px dashed #ccc; border-radius: 8px"
              class="q-mx-auto q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="upload_file" size="2em" color="grey-7" />
              </template>
            </q-file>
            <div class="text-caption text-grey-6 text-center" v-if="!editJobDetails.newFile">
              No new file selected. Current document will be retained.
            </div>
          </q-card-section>
        </q-scroll-area>

        <q-card-actions
          align="center"
          class="q-pa-md row justify-between items-center"
          style="position: sticky; bottom: 0; z-index: 2; background: white"
        >
          <q-input
            outlined
            dense
            label="Set Page No."
            type="number"
            v-model="editJobDetails.PageNo"
          />

          <div class="q-gutter-sm">
            <q-btn
              color="grey"
              label="Cancel"
              @click="closeEditModal"
              size="md"
              style="width: 120px"
              rounded
              flat
            />
            <q-btn
              color="primary"
              :loading="jobPostStore.loading"
              label="Update Post"
              @click="updateJobPost"
              size="md"
              style="width: 200px"
              rounded
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteConfirmation" persistent>
      <q-card style="min-width: 350px; border-radius: 6px">
        <q-card-section class="row items-center q-pb-md">
          <q-icon name="warning" color="negative" size="sm" class="q-mr-sm" />
          <span class="text-subtitle">Confirm Deletion</span>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-md">
          <div class="text-subtitle q-mb-sm">Are you sure you want to delete this job post?</div>
          <div class="q-pa-sm bg-grey-2 rounded-borders" v-if="jobToDelete">
            <div class="row q-col-gutter-sm q-mb-sm">
              <div class="col-4 text-weight-medium text-body1">Office:</div>
              <div class="col-8 text-body1">{{ jobToDelete.Office }}</div>
            </div>
            <div class="row q-col-gutter-sm q-mb-sm">
              <div class="col-4 text-weight-medium text-body1">Position:</div>
              <div class="col-8 text-body1">{{ jobToDelete.Position }}</div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-4 text-weight-medium text-body1">Posted:</div>
              <div class="col-8 text-body1">
                {{ formatDate(jobToDelete.post_date, 'MMM D, YYYY') }}
              </div>
            </div>
          </div>
          <div class="text-body1 text-negative q-mt-sm">
            <q-icon name="info" class="q-mr-xs" />
            This action cannot be undone.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-sm">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn
            label="Delete"
            color="negative"
            @click="deleteJob"
            :loading="jobPostStore.loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';

  const router = useRouter();
  const jobPostStore = useJobPostStore();
  const $q = useQuasar();

  const { formatDate } = date;

  // Page State
  const showingDetails = ref(false);
  const pagination = ref({
    sortBy: 'post_date',
    descending: true,
    page: 1,
    rowsPerPage: 10,
  });

  // Delete related state
  const showDeleteConfirmation = ref(false);
  const jobToDelete = ref(null);
  const deletingJobId = ref(null);

  // Edit related state
  const showEditModal = ref(false);
  const editJobDetails = ref({
    id: null,
    office: '',
    division: '',
    section: '',
    unit: '',
    position: '',
    level: '',
    startingDate: '',
    endedDate: '',
    PageNo: 1,
    currentDocument: null,
    newFile: null,
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
      style: 'width: 18%',
    },
    {
      name: 'position',
      label: 'Position',
      align: 'left',
      field: 'Position',
      sortable: true,
      style: 'width: 22%',
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
      name: 'total_applicants',
      align: 'center',
      label: 'Applicant',
      field: 'total_applicants',
      sortable: true,
      style: 'width: 9%',
    },
    {
      name: 'pending_count',
      align: 'center',
      label: 'Pending',
      field: 'pending_count',
      sortable: true,
      style: 'width: 9%',
    },
    {
      name: 'qualified_count',
      align: 'center',
      label: 'Qualified',
      field: 'qualified_count',
      sortable: true,
      style: 'width: 9%',
    },
    {
      name: 'unqualified_count',
      align: 'center',
      label: 'Unqualified',
      field: 'unqualified_count',
      sortable: true,
      style: 'width: 10%',
    },
    {
      name: 'action',
      align: 'center',
      label: 'Actions',
      field: 'action',
      sortable: false,
      style: 'width: 11%',
    },
  ];

  const jobs = ref([]);
  const qsDataLoad = ref([]);
  const usePlantilla = ref({ qsLoad: false });

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
          (job.post_date && formatDate(job.post_date, 'MMM D, YYYY').toLowerCase().includes(searchTerm)) ||
          (job.total_applicants !== undefined && job.total_applicants.toString().includes(searchTerm)) ||
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

  // Helper function to determine if a job can be deleted
  const canDeleteJob = (job) => {
    // Job can be deleted only if it has no applicants
    return !job.applicants || job.applicants === 0;
  };

  const viewJobDetails = (job) => {
    router.push({
      name: 'JobPost View',
      params: { PositionID: job.PositionID, ItemNo: job.ItemNo },
    });
  };

  // Edit job post functions
  const editJobPost = async (job) => {
    try {
      // Populate edit form with job data
      editJobDetails.value = {
        id: job.PositionID || job.id,
        office: job.Office,
        division: job.Division || '',
        section: job.Section || '',
        unit: job.Unit || '',
        position: job.Position,
        level: job.Level || '',
        startingDate: job.starting_date || job.startingDate || '',
        endedDate: job.ended_date || job.endedDate || '',
        PageNo: job.PageNo || 1,
        currentDocument: job.document
          ? {
              name: job.document.name || 'Current Document.pdf',
              uploadDate: job.document.uploadDate || job.post_date,
            }
          : null,
        newFile: null,
      };

      // Load qualification standards if needed
      if (job.PositionID) {
        await loadQualificationStandards(job.PositionID);
      }

      showEditModal.value = true;
    } catch (error) {
      console.error('Error loading job data for edit:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to load job data for editing',
        position: 'top',
      });
    }
  };

  const closeEditModal = () => {
    showEditModal.value = false;
    editJobDetails.value = {
      id: null,
      office: '',
      division: '',
      section: '',
      unit: '',
      position: '',
      level: '',
      startingDate: '',
      endedDate: '',
      PageNo: 1,
      currentDocument: null,
      newFile: null,
    };
  };

  const updateJobPost = async () => {
    try {
      // Validate required fields
      if (!editJobDetails.value.endedDate) {
        $q.notify({
          type: 'negative',
          message: 'Please select an end date',
          position: 'top',
        });
        return;
      }

      // Prepare update data
      const updateData = {
        id: editJobDetails.value.id,
        endedDate: editJobDetails.value.endedDate,
        PageNo: editJobDetails.value.PageNo,
      };

      // Add file if a new one was selected
      if (editJobDetails.value.newFile) {
        updateData.document = editJobDetails.value.newFile;
      }

      // Call the store's update method
      await jobPostStore.updateJobPost(updateData);

      // Refresh the job list
      await jobPostStore.job_post();
      jobs.value = jobPostStore.jobPosts;

      // Show success notification
      $q.notify({
        type: 'positive',
        message: 'Job post updated successfully',
        position: 'top',
      });

      // Close the modal
      closeEditModal();
    } catch (error) {
      console.error('Error updating job post:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to update job post. Please try again.',
        position: 'top',
      });
    }
  };

  const downloadCurrentDocument = () => {
    // Implement document download functionality
    // This would typically call an API endpoint to download the current document
    console.log('Downloading current document for job:', editJobDetails.value.id);
    $q.notify({
      type: 'info',
      message: 'Document download initiated',
      position: 'top',
    });
  };

  const loadQualificationStandards = async () => {
    try {
      usePlantilla.value.qsLoad = true;
      // Call your API to load qualification standards for the position
      // This should be replaced with your actual API call
      // const response = await jobPostStore.getQualificationStandards();
      // qsDataLoad.value = response.data;

      // Mock data for demonstration
      qsDataLoad.value = [
        {
          id: 1,
          Education: "Bachelor's degree relevant to the job",
          Experience: 'At least 1 year of relevant experience',
          Training: '4 hours of relevant training',
          Eligibility: 'Career Service (Professional) Second Level Eligibility',
        },
      ];
    } catch (error) {
      console.error('Error loading qualification standards:', error);
    } finally {
      usePlantilla.value.qsLoad = false;
    }
  };

  // Updated delete functions to use the store
  const confirmDeleteJob = (job) => {
    jobToDelete.value = job;
    showDeleteConfirmation.value = true;
  };

  // Updated deleteJob function to refresh the table after deletion
  const deleteJob = async () => {
    if (!jobToDelete.value) return;

    try {
      deletingJobId.value = jobToDelete.value.id;

      // Call the store's deleteJobPost method
      await jobPostStore.deleteJobPost({ id: jobToDelete.value.id });

      // Refresh the job list from the store to ensure consistency
      await jobPostStore.job_post();
      jobs.value = jobPostStore.jobPosts;

      // Show success notification
      $q.notify({
        type: 'negative',
        message: 'Job post deleted successfully',
        position: 'top',
      });

      // Close the dialog and reset state
      showDeleteConfirmation.value = false;
      jobToDelete.value = null;
    } catch (error) {
      console.error('Error deleting job post:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to delete job post. Please try again.',
        position: 'top',
      });
    } finally {
      deletingJobId.value = null;
    }
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

  const positionRequirements = ref({});

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
    await jobPostStore.job_post();
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
      width: 18%;
      white-space: normal;
      word-break: break-word;
    }

    .position-column {
      width: 22%;
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
      width: 11%;
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
    padding: 10px;
  }

  .q-pa-xs {
    padding: 4px;
  }

  .q-card-section {
    padding: 12px;
  }

  /* Edit button styling */
  .bg-orange-1 {
    background-color: rgba(255, 152, 0, 0.1);
  }

  /* Current document section styling */
  .current-document-section {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
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
