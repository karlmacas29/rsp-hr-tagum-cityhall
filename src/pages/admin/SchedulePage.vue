<template>
  <q-page class="q-pa-md">
    <!-- Page Header -->
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Interview Schedule</b></h5>
    </div>

    <div class="q-pa-sm">
      <!-- Search and Actions Row -->
      <div class="row justify-between items-center q-mb-md">
        <q-input
          v-model="globalSearch"
          outlined
          dense
          placeholder="Search interviews..."
          class="col-auto"
          style="max-width: 300px"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>

        <q-btn
          color="primary"
          label="Schedule Interview"
          icon="event"
          rounded
          @click="openScheduleDialog"
        />
      </div>

      <!-- Interviews Table -->
      <q-table
        :rows="filteredInterviews"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        class="interviews-table q-mt-md"
        :loading="interviewStore.loading"
        table-style="min-width: 100%"
      >
        <template v-slot:body-cell-batch_name="props">
          <q-td :props="props" class="batch-column">
            <div class="text-body2 text-weight-medium text-black">
              {{ props.row.batch_name || `Batch ${props.row.id}` }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-applicant_no="props">
          <q-td :props="props" class="count-column">
            <div class="text-center text-body2">
              <q-badge color="primary" class="q-px-sm">
                {{ props.row.applicant_no || 0 }}
              </q-badge>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-venue_interview="props">
          <q-td :props="props" class="venue-column">
            <div class="text-body2">
              {{ props.row.venue_interview || 'Not Set' }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-date_interview="props">
          <q-td :props="props" class="date-column">
            <q-badge rounded color="blue" class="text-caption q-px-sm">
              {{ formatInterviewDate(props.row.date_interview) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-time_interview="props">
          <q-td :props="props" class="time-column">
            <div class="text-body2 text-center">
              {{ formatInterviewTime(props.row.time_interview) }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props" class="action-column">
            <div class="row q-gutter-xs justify-center">
              <q-btn
                round
                flat
                color="blue"
                size="sm"
                class="bg-blue-1"
                icon="visibility"
                @click="viewInterview(props.row)"
              >
                <q-tooltip>View Details</q-tooltip>
              </q-btn>
              <q-btn
                round
                flat
                color="orange"
                size="sm"
                class="bg-orange-1"
                icon="edit"
                @click="editInterview(props.row)"
              >
                <q-tooltip>Edit Schedule</q-tooltip>
              </q-btn>
              <q-btn
                round
                flat
                color="red"
                size="sm"
                class="bg-red-1"
                icon="delete"
                @click="confirmDeleteInterview(props.row)"
              >
                <q-tooltip>Cancel Interview</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-md text-grey">
            <div class="column items-center">
              <q-icon name="event_busy" size="3em" class="q-mb-sm" />
              <div class="text-h6">No Scheduled Interviews</div>
              <div class="text-caption">Click "Schedule Interview" to get started</div>
            </div>
          </div>
        </template>
      </q-table>
    </div>

    <!-- Schedule Interview Dialog -->
    <q-dialog v-model="showScheduleDialog" persistent>
      <q-card style="min-width: 700px; max-width: 90vw">
        <q-card-section class="q-pa-md">
          <div class="row justify-between items-center">
            <div class="text-h6 text-weight-bold">Schedule Interview</div>
            <q-btn icon="close" flat round dense @click="closeScheduleDialog" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-md">
          <!-- Batch Name -->
          <q-input
            v-model="scheduleForm.batch_name"
            label="Batch Name (Optional)"
            outlined
            dense
            class="q-mb-sm"
            placeholder="e.g., Software Engineer Interview - Batch 1"
          />

          <!-- Venue -->
          <q-input
            v-model="scheduleForm.venue_interview"
            label="Venue (Optional)"
            outlined
            dense
            class="q-mb-sm"
            placeholder="e.g., City Hall Of Tagum - HR Office"
          />

          <!-- Interview Date -->
          <q-input
            v-model="scheduleForm.date_interview"
            label="Interview Date *"
            outlined
            dense
            mask="date"
            :rules="['date']"
            class="q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="scheduleForm.date_interview"
                    :options="dateOptions"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- Interview Time -->
          <q-input
            v-model="scheduleForm.time_interview"
            label="Interview Time (Optional)"
            outlined
            dense
            class="q-mb-sm"
            placeholder="e.g., 10:00 AM"
            mask="time"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="scheduleForm.time_interview" format24h :mask="'HH:mm'">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- Applicant Selection -->
          <div class="text-subtitle2 q-mb-sm">Select Applicants *</div>

          <!-- Search for Applicants -->
          <q-input
            v-model="applicantSearch"
            outlined
            dense
            placeholder="Search applicants..."
            class="q-mb-md"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>

          <!-- Applicants Table -->
          <q-table
            :rows="filteredApplicantRows"
            :columns="applicantColumns"
            row-key="submission_id"
            :pagination="applicantPagination"
            :loading="loadingApplicants"
            class="applicant-selection-table"
            selection="multiple"
            v-model:selected="scheduleForm.selected_applicants"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="text-body2 text-weight-medium">
                  {{ `${props.row.firstname} ${props.row.lastname}` }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-position="props">
              <q-td :props="props">
                <div class="positions-list">
                  <div
                    v-for="(position, index) in props.row.positions"
                    :key="index"
                    class="position-item"
                  >
                    {{ position }}
                  </div>
                </div>
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center q-pa-md text-grey">
                <div class="column items-center">
                  <q-icon name="info" size="2em" class="q-mb-sm" />
                  <div>Click search to load applicants</div>
                </div>
              </div>
            </template>
          </q-table>

          <!-- Selected Count -->
          <!-- <div class="text-caption text-primary q-mt-sm">
            {{ scheduleForm.selected_applicants.length }} applicant(s) selected
          </div> -->
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Cancel" color="grey" flat @click="closeScheduleDialog" />
          <q-btn
            label="Schedule"
            color="primary"
            @click="confirmSchedule"
            :disable="!isFormValid"
            :loading="interviewStore.loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- View Interview Details Dialog -->
    <q-dialog v-model="showViewDialog" persistent>
      <q-card style="min-width: 700px; max-width: 90vw">
        <q-card-section class="q-pa-md bg-primary text-white">
          <div class="row justify-between items-center">
            <div class="text-h6 text-weight-bold">Interview Details</div>
            <q-btn icon="close" flat round dense color="white" @click="closeViewDialog" />
          </div>
        </q-card-section>

        <q-separator />

        <!-- Loading State -->
        <div v-if="interviewStore.loadingApplicants" class="q-pa-xl text-center">
          <q-spinner size="2rem" color="primary" class="q-mb-sm" />
          <div class="text-subtitle2">Loading interview details...</div>
        </div>

        <!-- Interview Details -->
        <q-card-section v-else class="q-pa-md">
          <!-- Batch Information -->
          <div class="q-mb-md">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Batch Information</div>

            <q-input
              :model-value="viewData.batch_name || 'Not specified'"
              label="Batch Name"
              outlined
              dense
              readonly
              class="q-mb-sm"
            />

            <q-input
              :model-value="viewData.venue_interview || 'Not specified'"
              label="Venue"
              outlined
              dense
              readonly
              class="q-mb-sm"
            />

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  :model-value="formatInterviewDate(viewData.date_interview)"
                  label="Interview Date"
                  outlined
                  dense
                  readonly
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  :model-value="formatInterviewTime(viewData.time_interview)"
                  label="Interview Time"
                  outlined
                  dense
                  readonly
                />
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Scheduled Applicants -->
          <div>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              Scheduled Applicants
              <q-badge color="primary" class="q-ml-sm">
                {{ viewApplicants.length }}
              </q-badge>
            </div>

            <!-- Applicants Table -->
            <q-table
              :rows="viewApplicants"
              :columns="viewApplicantColumns"
              row-key="submission_id"
              :pagination="viewPagination"
              class="applicant-view-table"
              :rows-per-page-options="[5, 10, 20]"
            >
              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  <div class="text-body2 text-weight-medium">
                    {{ props.row.full_name || `${props.row.firstname} ${props.row.lastname}` }}
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-position="props">
                <q-td :props="props">
                  <div class="positions-list">
                    <div
                      v-for="(position, index) in props.row.positions || [props.row.position]"
                      :key="index"
                      class="position-item"
                    >
                      {{ position || 'N/A' }}
                    </div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-control_no="props">
                <q-td :props="props">
                  <q-badge color="grey-7" class="text-caption">
                    {{ props.row.ControlNo || props.row.control_no || 'N/A' }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="full-width row flex-center q-pa-md text-grey">
                  <div class="column items-center">
                    <q-icon name="person_off" size="2em" class="q-mb-sm" />
                    <div>No applicants scheduled for this interview</div>
                  </div>
                </div>
              </template>
            </q-table>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Close" color="primary" flat @click="closeViewDialog" />
          <q-btn
            label="Edit Schedule"
            color="primary"
            icon="edit"
            @click="editFromView"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useQuasar, date } from 'quasar';
  import { useInterviewStore } from 'stores/interviewStore';

  // ============================================================================
  // COMPOSABLES & STORE
  // ============================================================================
  const $q = useQuasar();
  const interviewStore = useInterviewStore();
  const { formatDate } = date;

  // ============================================================================
  // STATE
  // ============================================================================
  const globalSearch = ref('');
  const showScheduleDialog = ref(false);
  const showViewDialog = ref(false);
  const applicantSearch = ref('');
  const loadingApplicants = ref(false);
  const viewData = ref({});
  const viewApplicants = ref([]);

  const scheduleForm = ref({
    batch_name: '',
    venue_interview: '',
    date_interview: '',
    time_interview: '',
    selected_applicants: [],
  });

  const pagination = ref({
    sortBy: 'date_interview',
    descending: false,
    page: 1,
    rowsPerPage: 10,
  });

  const applicantPagination = ref({
    page: 1,
    rowsPerPage: 5,
  });

  const viewPagination = ref({
    page: 1,
    rowsPerPage: 10,
  });

  // ============================================================================
  // TABLE COLUMNS
  // ============================================================================
  const columns = [
    {
      name: 'batch_name',
      label: 'Batch Name',
      align: 'left',
      field: 'batch_name',
      sortable: true,
      style: 'width: 25%',
    },
    {
      name: 'applicant_no',
      label: 'No. of Applicants',
      align: 'center',
      field: 'applicant_no',
      sortable: true,
      style: 'width: 15%',
    },
    {
      name: 'venue_interview',
      label: 'Venue',
      align: 'left',
      field: 'venue_interview',
      sortable: true,
      style: 'width: 20%',
    },
    {
      name: 'date_interview',
      label: 'Interview Date',
      align: 'center',
      field: 'date_interview',
      sortable: true,
      style: 'width: 15%',
    },
    {
      name: 'time_interview',
      label: 'Time',
      align: 'center',
      field: 'time_interview',
      sortable: true,
      style: 'width: 15%',
    },
    {
      name: 'action',
      label: 'Action',
      align: 'center',
      field: 'action',
      sortable: false,
      style: 'width: 10%',
    },
  ];

  const applicantColumns = [
    {
      name: 'name',
      label: 'Applicant Name',
      align: 'left',
      field: 'name',
      sortable: true,
      style: 'width: 40%',
    },
    {
      name: 'position',
      label: 'Positions Applied',
      align: 'left',
      field: 'position',
      sortable: false,
      style: 'width: 60%;',
    },
  ];

  const viewApplicantColumns = [
    {
      name: 'name',
      label: 'Applicant Name',
      align: 'left',
      field: 'name',
      sortable: true,
      style: 'width: 35%',
    },

    {
      name: 'position',
      label: 'Position',
      align: 'left',
      field: 'position',
      sortable: false,
      style: 'width: 45%',
    },
  ];

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================
  const filteredInterviews = computed(() => {
    if (!globalSearch.value) return interviewStore.interviews || [];

    const searchTerm = globalSearch.value.toLowerCase();
    return (interviewStore.interviews || []).filter((interview) => {
      return (
        interview.batch_name?.toLowerCase().includes(searchTerm) ||
        interview.venue_interview?.toLowerCase().includes(searchTerm)
      );
    });
  });

  const transformedApplicants = computed(() => {
    const submissions = interviewStore.availableApplicants || [];

    return submissions.map((submission) => ({
      submission_id: submission.submission_id,
      nPersonalInfo_id: submission.nPersonalInfo_id,
      ControlNo: submission.ControlNo,
      firstname: submission.firstname,
      lastname: submission.lastname,
      positions: [submission.job_batch_rsp?.Position || 'N/A'],
      job_batches_rsp_id: submission.job_batches_rsp_id,
      _rawData: submission,
    }));
  });

  const filteredApplicantRows = computed(() => {
    if (!applicantSearch.value) return transformedApplicants.value;

    const searchTerm = applicantSearch.value.toLowerCase();
    return transformedApplicants.value.filter((applicant) => {
      const fullName = `${applicant.firstname} ${applicant.lastname}`.toLowerCase();
      const positions = applicant.positions.join(' ').toLowerCase();
      const controlNo = applicant.ControlNo?.toLowerCase() || '';

      return (
        fullName.includes(searchTerm) ||
        positions.includes(searchTerm) ||
        controlNo.includes(searchTerm)
      );
    });
  });

  const isFormValid = computed(() => {
    return scheduleForm.value.date_interview && scheduleForm.value.selected_applicants.length > 0;
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Format interview date for display
   */
  const formatInterviewDate = (dateStr) => {
    if (!dateStr) return 'Not Set';
    try {
      return formatDate(dateStr, 'MMM D, YYYY');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  /**
   * Format interview time for display
   */
  const formatInterviewTime = (timeStr) => {
    if (!timeStr) return 'Not Set';

    if (timeStr === '1900-01-01' || timeStr.startsWith('1900-01-01')) {
      return 'Not Set';
    }

    try {
      let timeToFormat = timeStr;
      if (timeStr.includes('T')) {
        timeToFormat = timeStr.split('T')[1].split('.')[0];
      } else if (timeStr.includes(' ')) {
        const parts = timeStr.split(' ');
        if (parts[0].includes('-')) {
          timeToFormat = parts[1] || parts[0];
        }
      }

      const timeParts = timeToFormat.split(':');
      if (timeParts.length >= 2) {
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];

        if (isNaN(hours) || hours < 0 || hours > 23) {
          return 'Not Set';
        }

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
      }
      return 'Not Set';
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Not Set';
    }
  };

  /**
   * Convert time for API
   */
  const formatTimeForApi = (timeStr) => {
    if (!timeStr) return null;

    if (timeStr.match(/^\d{2}:\d{2}$/)) {
      return `${timeStr}:00`;
    }

    if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return timeStr;
    }

    return null;
  };

  /**
   * Date options for picker
   */
  const dateOptions = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  };

  /**
   * Reset schedule form
   */
  const resetScheduleForm = () => {
    scheduleForm.value = {
      batch_name: '',
      venue_interview: '',
      date_interview: '',
      time_interview: '',
      selected_applicants: [],
    };
    applicantSearch.value = '';
  };

  // ============================================================================
  // DIALOG METHODS
  // ============================================================================

  /**
   * Open schedule dialog
   */
  const openScheduleDialog = async () => {
    showScheduleDialog.value = true;
    await searchApplicants();
  };

  /**
   * Close schedule dialog
   */
  const closeScheduleDialog = () => {
    showScheduleDialog.value = false;
    resetScheduleForm();
  };

  /**
   * Open view dialog
   */
  const openViewDialog = () => {
    showViewDialog.value = true;
  };

  /**
   * Close view dialog
   */
  const closeViewDialog = () => {
    showViewDialog.value = false;
    viewData.value = {};
    viewApplicants.value = [];
    interviewStore.clearBatchDetails();
  };

  /**
   * Edit from view dialog
   */
  const editFromView = () => {
    const interview = viewData.value;
    closeViewDialog();
    editInterview(interview);
  };

  /**
   * Confirm schedule
   */
  const confirmSchedule = () => {
    const applicantCount = scheduleForm.value.selected_applicants.length;
    const dateFormatted = formatDate(scheduleForm.value.date_interview, 'MMMM D, YYYY');
    const timeText = scheduleForm.value.time_interview
      ? formatInterviewTime(scheduleForm.value.time_interview)
      : 'Not specified';
    const venueText = scheduleForm.value.venue_interview || 'Not specified';

    $q.dialog({
      title: 'Confirm Interview Schedule',
      message: `
        <div class="q-mb-sm"><strong>Are you sure you want to schedule this interview?</strong></div>
        <div class="q-mt-md">
          <div class="q-mb-xs"><strong>Batch Name:</strong> ${scheduleForm.value.batch_name || 'Not specified'}</div>
          <div class="q-mb-xs"><strong>Venue:</strong> ${venueText}</div>
          <div class="q-mb-xs"><strong>Date:</strong> ${dateFormatted}</div>
          <div class="q-mb-xs"><strong>Time:</strong> ${timeText}</div>
          <div class="q-mb-xs"><strong>Applicants:</strong> ${applicantCount} applicant(s)</div>
        </div>
      `,
      html: true,
      ok: {
        label: 'Confirm',
        color: 'primary',
        flat: false,
      },
      cancel: {
        label: 'Cancel',
        color: 'grey',
        flat: true,
      },
      persistent: true,
    }).onOk(() => {
      submitSchedule();
    });
  };

  /**
   * Confirm delete
   */
  const confirmDeleteInterview = (interview) => {
    const displayName = interview.batch_name || `Batch ${interview.id}`;

    $q.dialog({
      title: 'Cancel Interview',
      message: `Are you sure you want to cancel the interview for <strong>${displayName}</strong>?`,
      html: true,
      ok: {
        label: 'Yes, Cancel',
        color: 'negative',
        flat: false,
      },
      cancel: {
        label: 'No',
        color: 'grey',
        flat: true,
      },
      persistent: true,
    }).onOk(() => {
      deleteInterview(interview);
    });
  };

  // ============================================================================
  // API METHODS
  // ============================================================================

  /**
   * Search applicants
   */
  const searchApplicants = async () => {
    loadingApplicants.value = true;
    try {
      await interviewStore.fetchAvailableApplicants();
    } catch (error) {
      console.error('Error fetching applicants:', error);
      $q.notify({
        type: 'negative',
        message: error?.message || 'Failed to load applicants',
        position: 'top',
      });
    } finally {
      loadingApplicants.value = false;
    }
  };

  /**
   * Submit schedule
   */
  const submitSchedule = async () => {
    try {
      const scheduleData = {
        batch_name: scheduleForm.value.batch_name || null,
        venue_interview: scheduleForm.value.venue_interview || null,
        date_interview: scheduleForm.value.date_interview,
        time_interview: formatTimeForApi(scheduleForm.value.time_interview),
        applicants: scheduleForm.value.selected_applicants.map((app) => app.submission_id),
      };

      const response = await interviewStore.scheduleInterview(scheduleData);

      if (response?.success || response?.data?.success) {
        $q.notify({
          type: 'positive',
          message:
            response?.message ||
            response?.data?.message ||
            `Interview scheduled successfully for ${scheduleForm.value.selected_applicants.length} applicant(s)`,
          position: 'top',
        });

        closeScheduleDialog();
        await interviewStore.fetchInterviews();
      } else {
        const errorMessage =
          response?.message || response?.data?.message || 'Failed to schedule interview';

        $q.notify({
          type: 'negative',
          message: errorMessage,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      $q.notify({
        type: 'negative',
        message: error?.response?.data?.message || error?.message || 'Failed to schedule interview',
        position: 'top',
      });
    }
  };

  /**
   * View interview details
   */
  const viewInterview = async (interview) => {
    try {
      viewData.value = interview;
      openViewDialog();

      // Fetch batch details
      const batchDetails = await interviewStore.fetchBatchDetails(
        interview.date_interview,
        interview.time_interview,
      );

      if (batchDetails) {
        // Handle different response structures
        if (Array.isArray(batchDetails)) {
          viewApplicants.value = batchDetails;
        } else if (batchDetails.applicants && Array.isArray(batchDetails.applicants)) {
          viewApplicants.value = batchDetails.applicants;
        } else if (batchDetails.data && Array.isArray(batchDetails.data)) {
          viewApplicants.value = batchDetails.data;
        } else {
          viewApplicants.value = [];
        }
      }
    } catch (error) {
      console.error('Error viewing interview:', error);
      $q.notify({
        type: 'negative',
        message: error?.message || 'Failed to load interview details',
        position: 'top',
      });
    }
  };

  /**
   * Edit interview
   */
  const editInterview = (interview) => {
    const displayName = interview.batch_name || `Batch ${interview.id}`;
    console.log('Edit interview:', interview);

    $q.notify({
      type: 'info',
      message: `Editing interview: ${displayName}`,
      position: 'top',
    });
    // TODO: Implement edit functionality
  };

  /**
   * Delete interview
   */
  const deleteInterview = async (interview) => {
    try {
      await interviewStore.deleteInterview(interview.id);

      $q.notify({
        type: 'positive',
        message: 'Interview cancelled successfully',
        position: 'top',
      });

      await interviewStore.fetchInterviews();
    } catch (error) {
      console.error('Error cancelling interview:', error);
      $q.notify({
        type: 'negative',
        message: error?.message || 'Failed to cancel interview',
        position: 'top',
      });
    }
  };

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  onMounted(async () => {
    try {
      await interviewStore.fetchInterviews();
    } catch (error) {
      console.error('Error loading interviews:', error);
      $q.notify({
        type: 'negative',
        message: error?.message || 'Failed to load interviews',
        position: 'top',
      });
    }
  });
</script>

<style scoped lang="scss">
  .text-h5 {
    font-size: 1.3rem;
    line-height: 1.7rem;
    margin-bottom: 0.5rem;
  }

  .interviews-table,
  .applicant-selection-table,
  .applicant-view-table {
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

    .batch-column,
    .count-column,
    .venue-column {
      white-space: normal;
      word-break: break-word;
    }
  }

  .interviews-table {
    .batch-column {
      width: 25%;
    }
    .count-column {
      width: 15%;
      text-align: center;
    }
    .venue-column {
      width: 20%;
    }
    .date-column,
    .time-column {
      text-align: center;
      width: 15%;
    }
    .action-column {
      width: 10%;
      text-align: center;
    }
  }

  .applicant-selection-table,
  .applicant-view-table {
    :deep(thead tr th:first-child) {
      text-align: center !important;
      vertical-align: middle !important;
      padding: 8px !important;
    }

    :deep(tbody tr td:first-child) {
      text-align: center !important;
      vertical-align: middle !important;
      padding: 8px !important;
    }

    :deep(th:first-child),
    :deep(td:first-child) {
      width: 48px !important;
      min-width: 48px !important;
      max-width: 48px !important;
    }

    :deep(.q-checkbox) {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .applicant-selection-table {
    td {
      vertical-align: top;
      padding: 20px;
    }
  }

  .positions-list {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .position-item {
      font-size: 0.9rem;
      line-height: 1.4;
      font-weight: 500;
    }
  }

  .bg-blue-1 {
    background-color: rgba(33, 150, 243, 0.1);
  }

  .bg-orange-1 {
    background-color: rgba(255, 152, 0, 0.1);
  }

  .bg-red-1 {
    background-color: rgba(244, 67, 54, 0.1);
  }

  @media (max-width: 1024px) {
    .interviews-table {
      th,
      td {
        padding: 6px 8px;
      }
    }
  }
</style>
