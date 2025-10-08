<template>
  <q-inner-loading :showing="jobPostStore.loading">
    <q-spinner size="32px" color="primary" />
  </q-inner-loading>
  <div class="q-pa-md bg-grey-1">
    <!-- Job Details Card -->
    <q-card class="q-mb-lg shadow-3" flat bordered style="max-width: 1000px; margin: auto">
      <q-card-section v-if="!jobPostStore.loading" class="q-pa-lg">
        <div class="row items-center justify-between q-mb-lg">
          <q-btn icon="arrow_back" round flat color="primary" @click="goBack" size="md" dense />
          <q-btn
            rounded
            color="primary"
            @click="viewFundedDocument"
            icon="description"
            label="View M.O."
            size="md"
            no-caps
            flat
            dense
          />
        </div>

        <div class="text-h6 text-primary text-weight-bold q-mb-xs">
          {{ selectedJob?.Position || 'Job Title' }}
          {{ selectedJob?.id || 'Job ID' }}
          <q-chip class="chip-padding status-chip" dense>
            <q-icon
              :name="selectedJob?.status === 'Occupied' ? 'warning' : 'check_circle'"
              class="q-mr-xs"
            />
            <span class="chip-label">
              Status:
              <b>{{ selectedJob?.status || 'Unknown' }}</b>
            </span>
          </q-chip>
        </div>
        <div class="chips-row">
          <q-chip class="chip-padding level-chip" dense>
            <q-icon name="work" class="q-mr-xs" />
            <span class="chip-label">
              Level:
              <b>{{ selectedJob?.level }}</b>
            </span>
          </q-chip>
          <q-chip class="chip-padding page-chip" dense>
            <q-icon name="layers" class="q-mr-xs" />
            <span class="chip-label">
              Page No:
              <b>{{ selectedJob?.PageNo }}</b>
            </span>
          </q-chip>
          <q-chip class="chip-padding item-chip" dense>
            <q-icon name="apps" class="q-mr-xs" />
            <span class="chip-label">
              Item No:
              <b>{{ selectedJob?.ItemNo }}</b>
            </span>
          </q-chip>
          <q-chip class="chip-padding salary-chip" dense>
            <q-icon name="star" class="q-mr-xs" />
            <span class="chip-label">
              Salary Grade:
              <b>{{ selectedJob?.SalaryGrade }}</b>
            </span>
          </q-chip>
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-sm-6">
            <div class="text-subtitle1 text-grey-8">
              <q-icon name="business" size="1em" class="q-mr-xs" />
              <b>Office:</b>
              {{ selectedJob?.Office || '-' }}
            </div>
            <div class="text-subtitle1 text-grey-8">
              <q-icon name="apartment" size="1em" class="q-mr-xs" />
              <b>Division:</b>
              {{ selectedJob?.Division || '-' }}
            </div>
            <div class="text-subtitle1 text-grey-8">
              <q-icon name="call_split" size="1em" class="q-mr-xs" />
              <b>Section:</b>
              {{ selectedJob?.Section || '-' }}
            </div>
            <div class="text-subtitle1 text-grey-8">
              <q-icon name="group_work" size="1em" class="q-mr-xs" />
              <b>Unit:</b>
              {{ selectedJob?.Unit || '-' }}
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="text-subtitle1 text-grey-8 q-mb-xs">
              <q-icon name="event" size="1em" class="q-mr-xs" />
              <b>Posting Date:</b>
              <span class="q-ml-xs">
                {{ formatDate(selectedJob?.post_date, 'MMM D, YYYY') || '-' }}
              </span>
            </div>
            <div class="text-subtitle1 text-grey-8">
              <q-icon name="event_busy" size="1em" class="q-mr-xs" />
              <b>End Date:</b>
              <span class="q-ml-xs">
                {{ formatDate(selectedJob?.end_date, 'MMM D, YYYY') || '-' }}
              </span>
            </div>
          </div>
        </div>

        <q-separator spaced />

        <div class="text-h6 text-weight-bold text-primary q-mb-sm">
          Qualification Standards / Requirements
        </div>
        <div>
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-12 col-md-6">
              <q-card flat bordered class="q-pa-sm q-mb-xs">
                <div class="text-caption text-grey-7">Education</div>
                <div class="text-body1">{{ selectedCriteria?.Education || 'None' }}</div>
              </q-card>
              <q-card flat bordered class="q-pa-sm">
                <div class="text-caption text-grey-7">Training</div>
                <div class="text-body1">{{ selectedCriteria?.Training || 'None' }}</div>
              </q-card>
            </div>
            <div class="col-12 col-md-6">
              <q-card flat bordered class="q-pa-sm q-mb-xs">
                <div class="text-caption text-grey-7">Experience</div>
                <div class="text-body1">{{ selectedCriteria?.Experience || 'None' }}</div>
              </q-card>
              <q-card flat bordered class="q-pa-sm">
                <div class="text-caption text-grey-7">Eligibility</div>
                <div class="text-body1">{{ selectedCriteria?.Eligibility || 'None' }}</div>
              </q-card>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabs Card for Applicants and Rating Results -->
    <q-card flat bordered class="shadow-2" style="max-width: 1000px; margin: auto">
      <!-- Removed key attribute to fix duplicate key error -->
      <q-card-section v-if="!jobPostStore.loading" class="q-pa-md">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          :key="tabsKey"
        >
          <q-tab name="applicants" label="Applicants" />
          <q-tab name="ratings" label="Rating Results" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated :key="tabPanelsKey">
          <!-- Applicants Tab Panel -->
          <q-tab-panel name="applicants">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h6 text-primary text-bold">Applicants</div>
              <div class="assessment-status">
                <q-badge class="q-pa-xs">
                  <q-icon name="assessment" class="q-mr-xs" />
                  Assessed: {{ assessedCount }}/{{ totalApplicants }} applicants
                </q-badge>
              </div>
            </div>
            <q-table
              :rows="formattedApplicants"
              :columns="applicantColumns"
              row-key="id"
              flat
              bordered
              class="applicants-table"
              dense
              v-if="applicantColumns.length"
              separator="cell"
              color="primary"
            >
              <template #body-cell-name="props">
                <q-td :props="props">
                  {{ props.row.firstname }} {{ props.row.lastname }}
                  <span v-if="props.row.name_extension">&nbsp;{{ props.row.name_extension }}</span>
                </q-td>
              </template>
              <template #body-cell-appliedDate="props">
                <q-td :props="props">
                  {{ props.row.appliedDate || '-' }}
                </q-td>
              </template>
              <template #body-cell-source="props">
                <q-td :props="props">
                  <q-badge
                    rounded
                    :color="props.row.source === 'Internal' ? 'blue' : 'orange'"
                    class="text-caption q-px-sm"
                  >
                    {{ props.row.source }}
                  </q-badge>
                </q-td>
              </template>
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    rounded
                    :color="
                      props.row.status === 'Qualified'
                        ? 'green'
                        : props.row.status === 'Unqualified'
                          ? 'red'
                          : 'grey'
                    "
                    class="text-caption q-px-sm"
                  >
                    {{ props.row.status || '-' }}
                  </q-badge>
                </q-td>
              </template>
              <template #body-cell-action="props">
                <q-td :props="props">
                  <q-btn
                    size="sm"
                    flat
                    icon="visibility"
                    color="primary"
                    @click="viewApplicantDetails(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
            <div v-else class="text-caption text-grey-6 q-mt-md q-ml-sm">
              No applicant data available.
            </div>
          </q-tab-panel>

          <!-- Rating Results Tab Panel -->
          <q-tab-panel name="ratings">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h6 text-primary text-bold">Rating Results</div>
              <div class="assessment-status">
                <q-badge class="q-pa-xs" color="primary" text-color="white">
                  <q-icon name="assessment" class="q-mr-xs" />
                  Rated: {{ ratingData.total_completed }}/{{ ratingData.total_assigned }}
                  completed ratings
                </q-badge>
              </div>
            </div>

            <div v-if="ratingsLoading" class="text-center q-pa-md">
              <q-spinner color="primary" size="32px" />
              <div class="q-mt-sm text-grey-6">Loading ratings...</div>
            </div>

            <q-table
              v-else-if="formattedApplicantRatings.length > 0"
              :rows="formattedApplicantRatings"
              :columns="ratingColumns"
              row-key="nPersonalInfo_id"
              flat
              bordered
              class="rating-table"
              dense
              separator="cell"
              color="primary"
            >
              <template #body-cell-name="props">
                <q-td :props="props">{{ props.row.firstname }} {{ props.row.lastname }}</q-td>
              </template>
              <template #body-cell-education="props">
                <q-td :props="props">
                  {{ props.row.education }}
                </q-td>
              </template>
              <template #body-cell-experience="props">
                <q-td :props="props">
                  {{ props.row.experience }}
                </q-td>
              </template>
              <template #body-cell-training="props">
                <q-td :props="props">
                  {{ props.row.training }}
                </q-td>
              </template>
              <template #body-cell-performance="props">
                <q-td :props="props">
                  {{ props.row.performance }}
                </q-td>
              </template>
              <template #body-cell-bei="props">
                <q-td :props="props">
                  {{ props.row.bei }}
                </q-td>
              </template>
              <template #body-cell-total_qs="props">
                <q-td :props="props">
                  <q-badge color="blue" class="text-caption q-px-sm" rounded>
                    {{ props.row.total_qs }}
                  </q-badge>
                </q-td>
              </template>
              <template #body-cell-grand_total="props">
                <q-td :props="props">
                  <q-badge color="green" class="text-caption q-px-sm" rounded>
                    {{ props.row.grand_total }}
                  </q-badge>
                </q-td>
              </template>
              <template #body-cell-rank="props">
                <q-td :props="props">
                  <q-badge
                    :color="props.row.rank <= 5 ? 'purple' : 'grey'"
                    class="text-caption q-px-sm"
                    rounded
                  >
                    {{ props.row.rank }}
                  </q-badge>
                </q-td>
              </template>
              <template #body-cell-action="props">
                <q-td :props="props">
                  <q-btn
                    size="sm"
                    flat
                    icon="visibility"
                    color="primary"
                    @click="viewApplicantScore(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
            <div v-else class="text-caption text-grey-6 q-mt-md q-ml-sm">
              No rating data available.
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <!-- PDF Dialog -->
    <q-dialog v-model="pdfModalVisible" maximized>
      <q-card style="width: 85vw; max-width: 1000px; height: 90vh">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6 text-bold">Funded Plantilla Document</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section style="height: calc(100% - 80px)">
          <q-inner-loading :showing="isLoadingPdf">
            <q-spinner size="32px" color="primary" />
          </q-inner-loading>
          <template v-if="!isLoadingPdf && pdfFileUrl">
            <iframe
              :src="pdfFileUrl"
              style="width: 100%; height: 100%; border: 2px solid #aaa; border-radius: 10px"
              title="Funded Plantilla PDF"
            ></iframe>
          </template>
          <template v-if="!isLoadingPdf && !pdfFileUrl">
            <div class="text-center q-pa-md">
              <q-icon name="error_outline" size="2em" color="negative" />
              <p>Could not load PDF document. The file might be missing or an error occurred.</p>
              <p v-if="pdfErrorMessage">{{ pdfErrorMessage }}</p>
            </div>
          </template>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modals -->
    <QualificationModal
      v-if="qualificationModalVisible"
      :show="qualificationModalVisible"
      :applicant-data="selectedApplicantData"
      :education="selectedApplicantData.education"
      :position-requirements="selectedCriteria"
      :is-submitted="false"
      @update:show="handleQualificationModalUpdate"
      @view-pds="onViewPDS"
      @toggle-qualification="onToggleQualification"
      @submit="submitEvaluation"
      @close="onCloseQualificationModal"
    />

    <ScoreModal
      v-if="scoreModal.visible"
      :show="scoreModal.visible"
      :applicant="scoreModal.applicant"
      :rating-data="ratingData"
      :job-details="scoreModal.jobDetails || selectedJob"
      @update:show="handleScoreModalUpdate"
      @close="closeScoreModal"
    />
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { onMounted, ref, computed, nextTick } from 'vue';
  import { date } from 'quasar';
  import axios from 'axios';
  import { toast } from 'src/boot/toast';
  import QualificationModal from 'src/components/QualityStandardModalApplicant.vue';
  import ScoreModal from 'src/components/Rater/ApplicantScore.vue';

  const router = useRouter();
  const route = useRoute();
  const jobPostStore = useJobPostStore();
  const P_ID = route.params.PositionID;
  const I_No = route.params.ItemNo;
  const selectedJob = ref([]);
  const { formatDate } = date;
  const selectedCriteria = ref([]);

  // Tab state with reactive keys for force re-render
  const activeTab = ref('applicants');
  const tabsKey = ref(0);
  const tabPanelsKey = ref(0);
  const ratingsLoading = ref(false);

  // Modal state
  const qualificationModalVisible = ref(false);
  const scoreModal = ref({ visible: false, applicant: null });
  const selectedApplicantData = ref({});

  // PDF Modal state
  const pdfModalVisible = ref(false);
  const pdfFileUrl = ref('');
  const isLoadingPdf = ref(false);
  const pdfErrorMessage = ref('');

  // Computed property for rating data
  const ratingData = computed(() => {
    if (!jobPostStore.applicant_rating) {
      return { total_completed: 0, total_assigned: 0 };
    }

    return {
      total_completed: jobPostStore.applicant_rating.total_completed || 0,
      total_assigned: jobPostStore.applicant_rating.total_assigned || 0,
    };
  });

  // Force re-render tabs when modal closes
  const forceTabsUpdate = () => {
    tabsKey.value += 1;
    tabPanelsKey.value += 1;
  };

  // Computed properties for applicant assessment statistics
  const totalApplicants = computed(() => {
    return formattedApplicants.value.length;
  });

  const assessedCount = computed(() => {
    return formattedApplicants.value.filter(
      (applicant) => applicant.status === 'Qualified' || applicant.status === 'Unqualified',
    ).length;
  });

  const goBack = () => {
    router.push('/job-post');
  };

  const viewFundedDocument = async () => {
    if (!selectedJob.value || !selectedJob.value.PositionID || !selectedJob.value.ItemNo) {
      toast.error('PositionID or ItemNo not found for the selected job. Cannot fetch document.');
      return;
    }
    isLoadingPdf.value = true;
    pdfModalVisible.value = true;
    pdfFileUrl.value = '';
    pdfErrorMessage.value = '';
    try {
      const apiUrl = process.env.VUE_APP_API_URL;
      const response = await axios.get(
        `${apiUrl}/on-funded-plantilla/by-funded/${selectedJob.value.PositionID}/${selectedJob.value.ItemNo}`,
      );
      let apiPDF = apiUrl.replace(/\/api\/?$/, '');
      if (response.data.status === 'success' && response.data.data.fileUpload) {
        pdfFileUrl.value = `${apiPDF}/storage/${response.data.data.fileUpload}`;
      } else {
        pdfErrorMessage.value =
          response.data.message || 'Failed to fetch PDF path or file is missing.';
        toast.error(pdfErrorMessage.value);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        pdfErrorMessage.value = error.response.data.message;
      } else {
        pdfErrorMessage.value = 'An unexpected error occurred while fetching the PDF.';
      }
      toast.error(pdfErrorMessage.value);
    } finally {
      isLoadingPdf.value = false;
    }
  };

  // Table column definitions
  const applicantColumns = [
    { name: 'id', label: 'No', field: 'id', align: 'center', sortable: true },
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
    {
      name: 'appliedDate',
      label: 'Applied Date',
      field: 'appliedDate',
      align: 'center',
    },
    {
      name: 'source',
      label: 'Source',
      field: 'source',
      align: 'center',
      sortable: true,
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
  ];

  // Updated rating columns to match the API response structure
  const ratingColumns = [
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
    { name: 'education', label: 'Education', field: 'education', align: 'center', sortable: true },
    {
      name: 'experience',
      label: 'Experience',
      field: 'experience',
      align: 'center',
      sortable: true,
    },
    { name: 'training', label: 'Training', field: 'training', align: 'center', sortable: true },
    {
      name: 'performance',
      label: 'Performance',
      field: 'performance',
      align: 'center',
      sortable: true,
    },
    { name: 'bei', label: 'BEI', field: 'bei', align: 'center', sortable: true },
    { name: 'total_qs', label: 'Total QS', field: 'total_qs', align: 'center', sortable: true },
    {
      name: 'grand_total',
      label: 'Grand Total',
      field: 'grand_total',
      align: 'center',
      sortable: true,
    },
    { name: 'rank', label: 'Rank', field: 'rank', align: 'center', sortable: true },
    { name: 'action', label: 'Action', field: 'action', align: 'center', sortable: false },
  ];

  // Format applicants data for the table
  const formattedApplicants = computed(() => {
    if (!jobPostStore.applicant) return [];

    return jobPostStore.applicant.map((a) => {
      return {
        id: a.id,
        firstname: a.firstname || '',
        lastname: a.lastname || '',
        name_extension: a.name_extension || '',
        image_url: a.image_url || 'https://placehold.co/100',
        appliedDate:
          a.appliedDate ||
          (a.application_date ? formatDate(a.application_date, 'MMM D, YYYY') : '-'),
        source: a.ControlNo || a.controlno ? 'Internal' : 'External',
        status: a.status || '-',
        ranking: a.ranking,
        education: a.education || [],
        raw: a,
        education_remark: a.education_remark,
        experience_remark: a.experience_remark,
        training_remark: a.training_remark,
        eligibility_remark: a.eligibility_remark,
      };
    });
  });

  // FIXED: Format applicant ratings data for the table with correct data structure handling
  const formattedApplicantRatings = computed(() => {
    if (!jobPostStore.applicant_rating) return [];

    // Handle your specific data structure: { jobpost_id, total_assigned, total_completed, applicants: { "32": {...}, "33": {...} } }
    let ratingsArray = [];

    if (
      jobPostStore.applicant_rating.applicants &&
      typeof jobPostStore.applicant_rating.applicants === 'object'
    ) {
      // Extract applicants from the nested object structure
      ratingsArray = Object.values(jobPostStore.applicant_rating.applicants);
    } else if (Array.isArray(jobPostStore.applicant_rating)) {
      ratingsArray = jobPostStore.applicant_rating;
    } else if (typeof jobPostStore.applicant_rating === 'object') {
      ratingsArray = Object.values(jobPostStore.applicant_rating);
    }

    const formatted = ratingsArray
      .map((rating) => ({
        submission_id: rating.submission_id,
        nPersonalInfo_id: rating.nPersonalInfo_id,
        firstname: rating.firstname || '',
        lastname: rating.lastname || '',
        education: rating.education || '0.00',
        experience: rating.experience || '0.00',
        training: rating.training || '0.00',
        performance: rating.performance || '0.00',
        bei: rating.bei || '0.00',
        total_qs: rating.total_qs || '0.00',
        grand_total: rating.grand_total || '0.00',
        rank: rating.rank || '-',
        image_url: rating.image_url || 'https://placehold.co/100',
        job_batches_rsp_id: rating.job_batches_rsp_id,
        history: rating.history || [], // ENSURE this is directly accessible
        // Store the complete raw data for the modal
        originalData: rating, // This contains everything including history
        raw: rating,
      }))
      .sort((a, b) => parseInt(a.rank) - parseInt(b.rank)); // Sort by rank

    console.log('Formatted applicant ratings:', formatted);
    return formatted;
  });

  // Updated viewApplicantDetails function to open the modal
  function viewApplicantDetails(row) {
    selectedApplicantData.value = {
      id: row.raw?.id || row.id,
      job_batches_rsp_id: row.raw?.job_batches_rsp_id,
      status: row.status || 'Pending',
      name: `${row.firstname} ${row.lastname}${row.name_extension ? ' ' + row.name_extension : ''}`,
      position: selectedJob.value?.Position || 'N/A',
      level: selectedJob.value?.level || 'N/A',
      appliedDate: row.appliedDate,
      PositionID: selectedJob.value?.PositionID,
      ItemNo: selectedJob.value?.ItemNo,
      Jobstatus: selectedJob.value?.status,
      image_url: row.image_url,
      education_remark: row.education_remark,
      experience_remark: row.experience_remark,
      training_remark: row.training_remark,
      eligibility_remark: row.eligibility_remark,
      education: row.education || row.raw?.education || [],
      n_personal_info: {
        education: row.education || row.raw?.education || [],
        work_experience: row.work_experience || row.raw?.work_experience || [],
        training: row.training || row.raw?.training || [],
        eligibity: row.eligibity || row.raw?.eligibity || [],
      },
      raw: row.raw,
    };
    qualificationModalVisible.value = true;
  }

  // FIXED: viewApplicantScore function to properly pass all data including history
  function viewApplicantScore(applicantRow) {
    console.log('Opening score modal for:', applicantRow);
    console.log('Original data:', applicantRow.originalData);
    console.log('History data:', applicantRow.history);

    // Extract history from multiple possible sources
    let historyData = [];

    // Try to get history from originalData first, then from direct property
    if (applicantRow.originalData && applicantRow.originalData.history) {
      historyData = applicantRow.originalData.history;
    } else if (applicantRow.history) {
      historyData = applicantRow.history;
    } else if (applicantRow.raw && applicantRow.raw.history) {
      historyData = applicantRow.raw.history;
    }

    console.log('Extracted history data:', historyData);

    scoreModal.value = {
      visible: true,
      applicant: {
        submission_id: applicantRow.submission_id,
        nPersonalInfo_id: applicantRow.nPersonalInfo_id,
        firstname: applicantRow.firstname,
        lastname: applicantRow.lastname,
        name_extension: applicantRow.name_extension || '',
        status: applicantRow.status || 'N/A',
        image_url: applicantRow.image_url,
        position: selectedJob.value?.Position || 'N/A',
        Jobstatus: selectedJob.value?.status,
        // Individual scores (final averaged scores)
        education: applicantRow.education,
        experience: applicantRow.experience,
        training: applicantRow.training,
        performance: applicantRow.performance,
        bei: applicantRow.bei,
        total_qs: applicantRow.total_qs,
        grand_total: applicantRow.grand_total,
        rank: applicantRow.rank,
        // Ensure history is properly passed
        history: historyData,
      },
      // Pass job details for the confirmation dialog
      jobDetails: selectedJob.value || {},
    };

    console.log('Modal applicant data:', scoreModal.value.applicant);
    console.log('Modal history:', scoreModal.value.applicant.history);
  }

  // Fixed modal handlers
  const handleQualificationModalUpdate = (value) => {
    qualificationModalVisible.value = value;
    if (!value) {
      nextTick(() => {
        forceTabsUpdate();
      });
    }
  };

  const handleScoreModalUpdate = (value) => {
    scoreModal.value.visible = value;
    if (!value) {
      nextTick(() => {
        forceTabsUpdate();
      });
    }
  };

  function closeScoreModal() {
    scoreModal.value = { visible: false, applicant: null };
    nextTick(() => {
      forceTabsUpdate();
    });
  }

  const onToggleQualification = (status) => {
    selectedApplicantData.value.status = status;
    console.log(`Qualification status changed to: ${status}`);
  };

  const submitEvaluation = async (evaluationData) => {
    try {
      console.log('Submitting evaluation:', evaluationData);

      if (!evaluationData.id) {
        toast.error('Missing applicant ID for evaluation submission');
        return;
      }

      if (!evaluationData.status || evaluationData.status === 'Pending') {
        toast.warning('Please select a qualification status before submitting.');
        return;
      }

      await jobPostStore.evaluation(evaluationData);
      selectedApplicantData.value.status = evaluationData.status;
      qualificationModalVisible.value = false;

      if (selectedJob.value && selectedJob.value.id) {
        await jobPostStore.fetch_applicant(selectedJob.value.id);
      }

      toast.success('Evaluation submitted successfully!');

      // Force tabs update after modal closes
      nextTick(() => {
        forceTabsUpdate();
      });
    } catch (error) {
      console.error('Evaluation submission error:', error);
      toast.error('Failed to submit evaluation');
    }
  };

  const onCloseQualificationModal = () => {
    qualificationModalVisible.value = false;
    selectedApplicantData.value = {};
    nextTick(() => {
      forceTabsUpdate();
    });
  };

  const onViewPDS = () => {
    console.log('View PDS requested for:', selectedApplicantData.value.name);
  };

  // Fetch all data when component mounts
  onMounted(async () => {
    jobPostStore.loading = true;
    try {
      // Fetch job details first
      const job = await jobPostStore.fetchJobPostByPositionAndItemNo(P_ID, I_No);
      selectedJob.value = job;

      // Fetch criteria
      const criteria = await jobPostStore.fetchCriteriaByPositionAndItemNo(P_ID, I_No);
      selectedCriteria.value = criteria;

      // If job exists, fetch both applicants and ratings data
      if (job && job.id) {
        // Start loading indicator for ratings
        ratingsLoading.value = true;

        try {
          // Fetch applicants and ratings concurrently
          await Promise.all([
            jobPostStore.fetch_applicant(job.id),
            jobPostStore.fetch_applicant_rating(job.id),
          ]);
        } catch (error) {
          console.error('Error fetching applicant data:', error);
          toast.error('Failed to load some applicant data');
        } finally {
          ratingsLoading.value = false;
        }
      }
    } catch (error) {
      console.error('Error during component initialization:', error);
      toast.error('Failed to load page data');
    }
  });
</script>

<style scoped>
  .chips-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .chip-padding {
    padding-left: 18px;
    padding-right: 18px;
  }

  .level-chip {
    background: #a8d5a4;
    color: #161616;
  }
  .page-chip {
    background: #e3f0fc;
    color: #2156a4;
  }
  .item-chip {
    background: #fff6df;
    color: #ff9800;
  }
  .salary-chip {
    background: #f3eafd;
    color: #6626a6;
  }

  .chip-label {
    font-size: 1rem;
    font-weight: 400;
    font-family: 'Montserrat', 'Roboto', Arial, sans-serif;
  }
  .chip-label b {
    font-weight: 700;
  }

  .q-chip__icon,
  .q-icon {
    font-size: 1.15em;
    margin-right: 4px;
  }

  .assessment-status .q-badge {
    font-size: 0.9rem;
    padding: 8px 12px;
    border-radius: 4px;
  }

  .q-tabs {
    background-color: #fff;
    border-radius: 8px 8px 0 0;
  }

  .q-tab {
    font-weight: 500;
    padding: 12px;
  }

  .q-tab-panels {
    background-color: white;
  }

  .q-tab-panel {
    padding: 16px;
  }

  .q-table tr:hover {
    background-color: #f5f5f5;
  }
</style>
