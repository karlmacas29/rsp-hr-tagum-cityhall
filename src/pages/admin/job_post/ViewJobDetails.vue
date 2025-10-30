<template>
  <q-inner-loading :showing="jobPostStore.loading">
    <q-spinner size="32px" color="primary" />
  </q-inner-loading>
  <div class="q-pa-md bg-grey-1">
    <!-- Job Details Card -->
    <q-card class="q-mb-lg shadow-3" flat bordered style="max-width: 1000px; margin: auto">
      <q-card-section v-if="!jobPostStore.loading" class="q-pa-lg">
        <!-- Search and Filter Section -->
        <div class="row items-center justify-between q-mb-lg">
          <q-btn icon="arrow_back" round flat color="primary" @click="goBack" size="md" dense />
          <div class="row items center">
            <!-- ✅ FIXED: Only show q-select when history exists -->
            <q-select
              v-if="historyOptions.length > 0"
              :model-value="displayHistoryId"
              :options="historyOptions"
              rounded
              dense
              outlined
              class="text-subtitle1"
              color="primary"
              label="View Old Post"
              option-label="label"
              option-value="value"
              style="width: 250px; padding-right: 15px"
              @update:model-value="onHistoryChange"
              emit-value
              map-options
            />
            <!-- ✅ FIXED: Show placeholder text when no history -->
            <div
              v-else
              class="text-subtitle1 q-pa-md"
              style="
                width: 250px;
                padding-right: 15px;
                color: #999;
                border: 1px solid #ccc;
                border-radius: 4px;
              "
            >
              No previous versions
            </div>

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
        </div>

        <div class="text-h6 text-primary q-mb-xs">
          {{ selectedJob?.Position || 'Job Title' }}
          <q-chip dense :color="statusColor" text-color="white" class="q-pa-sm">
            <span>
              Status:
              {{ (selectedJob?.status || 'Unknown').toLowerCase() }}
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
      <q-card-section v-if="!jobPostStore.loading" class="q-pa-md">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="applicants" label="Applicants" />
          <q-tab name="ratings" label="Rating Results" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <!-- Applicants Tab Panel -->
          <q-tab-panel name="applicants">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h6 text-primary text-bold">Applicants</div>
              <div class="row items-center">
                <q-btn
                  v-if="
                    canModifyJobPost &&
                    (selectedJob?.status != 'Republished' ||
                      selectedJob?.status != 'rated' ||
                      selectedJob?.status != 'Occupied')
                  "
                  label="Import Applicants"
                  color="orange-9"
                  rounded
                  style="font-size: 8pt; margin-right: 15px"
                  @click="showImportModal = true"
                  icon="person_add"
                />

                <div class="assessment-status">
                  <q-badge class="q-pa-xs">
                    <q-icon name="assessment" class="q-mr-xs" />
                    Assessed: {{ assessedCount }}/{{ totalApplicants }} applicants
                  </q-badge>
                </div>
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
                      props.row.status === 'Hired'
                        ? 'green'
                        : props.row.status === 'Qualified'
                          ? 'yellow-8'
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
                <q-btn
                  v-if="showUnoccupiedButton && canModifyJobPost"
                  label="Unoccupied"
                  color="red-9"
                  rounded
                  class="q-mr-sm"
                  style="font-size: 8pt"
                  @click="unoccupiedConfirmDialog = true"
                />
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
                <q-td :props="prop">
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

    <!-- Unoccupied Status Confirmation Dialog -->
    <q-dialog v-model="unoccupiedConfirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-primary">
            <q-icon name="warning" class="q-mr-sm" color="red-9" />
            Confirm Status Update
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-body1">
            Are you sure you want to update this job status to
            <strong>"Unoccupied"</strong>
            ?
          </p>
          <div class="text-caption text-grey-6 q-mt-sm">
            <strong>ID:</strong>
            {{ selectedJob?.id || 'N/A' }}
          </div>
          <div class="text-caption text-grey-6 q-mt-sm">
            <strong>Job:</strong>
            {{ selectedJob?.Position || 'N/A' }}
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" color="grey" v-close-popup :disable="jobPostStore.loading" />
          <q-btn
            unelevated
            label="Yes, Update to Unoccupied"
            color="negative"
            @click="updateJobStatusToUnoccupied"
            :loading="jobPostStore.loading"
            :disable="jobPostStore.loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Import Applicants Modal -->
    <ImportApplicantsModal
      :show="showImportModal"
      :current-job-id="jobId"
      :current-position="selectedJob?.Position || ''"
      @update:show="showImportModal = $event"
      @imported="onApplicantsImported"
      @close="showImportModal = false"
    />

    <!-- Modals - Now accessible without permission check -->
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
      @on-hired="onApplicantHired"
      @close="closeScoreModal"
    />
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { useAuthStore } from 'stores/authStore';
  import { onMounted, ref, computed, watch } from 'vue';
  import { date } from 'quasar';
  import axios from 'axios';
  import { toast } from 'src/boot/toast';
  import QualificationModal from 'src/components/QualityStandardModalApplicant.vue';
  import ScoreModal from 'src/components/Rater/ApplicantScore.vue';
  import ImportApplicantsModal from 'src/components/ImportApplicant.vue';

  const router = useRouter();
  const route = useRoute();
  const jobPostStore = useJobPostStore();
  const authStore = useAuthStore();

  // Permission check
  const canModifyJobPost = computed(() => {
    return authStore.user?.permissions?.modifyJobpostAccess == '1';
  });

  // Get job ID from route params
  const jobId = computed(() => route.params.id);

  // ✅ FIXED: displayHistoryId shows the active option
  const displayHistoryId = ref(null);

  // ✅ Flag to prevent duplicate requests during programmatic navigation
  const isNavigating = ref(false);

  // ✅ Track the last successfully loaded route ID
  const lastLoadedId = ref(null);

  const selectedJob = ref({
    Position: '',
    status: '',
    level: '',
    PageNo: '',
    ItemNo: '',
    SalaryGrade: '',
    Office: '',
    Division: '',
    Section: '',
    Unit: '',
    post_date: null,
    end_date: null,
    PositionID: '',
    id: null,
    history: [],
  });

  const selectedCriteria = ref({
    Education: '',
    Experience: '',
    Training: '',
    Eligibility: '',
  });

  const { formatDate } = date;

  // Tab state
  const activeTab = ref('applicants');
  const ratingsLoading = ref(false);

  // Modal state
  const qualificationModalVisible = ref(false);
  const scoreModal = ref({ visible: false, applicant: null });
  const selectedApplicantData = ref({});
  const showImportModal = ref(false);

  // PDF Modal state
  const pdfModalVisible = ref(false);
  const pdfFileUrl = ref('');
  const isLoadingPdf = ref(false);
  const pdfErrorMessage = ref('');

  const unoccupiedConfirmDialog = ref(false);

  // ✅ Computed property for history options
  const historyOptions = computed(() => {
    if (
      !selectedJob.value ||
      !selectedJob.value.history ||
      selectedJob.value.history.length === 0
    ) {
      return [];
    }

    const sortedHistory = [...selectedJob.value.history].sort((a, b) => {
      const dateA = new Date(a.post_date);
      const dateB = new Date(b.post_date);
      return dateB - dateA;
    });

    return sortedHistory.map((historyItem) => ({
      label: `${historyItem.id}: ${formatDate(historyItem.post_date, 'MMM D, YYYY')} - ${formatDate(historyItem.end_date, 'MMM D, YYYY')}`,
      value: historyItem.id,
      historyData: historyItem,
    }));
  });

  // ✅ FIXED: Handle selection change
  const onHistoryChange = (historyId) => {
    console.log('History selected:', historyId);
    if (!historyId) return;
    viewJobDetails(historyId);
  };

  // ✅ FIXED: Fetch all details before navigating
  const viewJobDetails = async (historyId) => {
    if (!historyId || historyId === selectedJob.value.id) {
      console.log('Same job selected or no ID provided');
      return;
    }

    console.log('Preparing to navigate to history ID:', historyId);

    // ✅ Set navigation flag
    isNavigating.value = true;

    try {
      jobPostStore.loading = true;

      const jobDetails = await jobPostStore.fetchJobDetails(historyId);

      if (!jobDetails) {
        throw new Error('Failed to fetch job details');
      }

      await jobPostStore.fetch_applicant(historyId).catch((err) => {
        console.warn('Failed to fetch applicants:', err);
      });

      await jobPostStore.fetch_applicant_rating(historyId).catch((err) => {
        console.warn('Failed to fetch ratings:', err);
      });

      // Update state BEFORE navigation
      selectedJob.value = {
        id: jobDetails.id || null,
        old_job_id: jobDetails.old_job_id || null,
        Position: jobDetails.Position || 'Unknown Position',
        status: jobDetails.status || 'Unknown',
        level: jobDetails.level || 'N/A',
        PageNo: jobDetails.PageNo || 'N/A',
        ItemNo: jobDetails.ItemNo || 'N/A',
        SalaryGrade: jobDetails.SalaryGrade || 'N/A',
        Office: jobDetails.Office || 'Unknown Office',
        Division: jobDetails.Division || 'N/A',
        Section: jobDetails.Section || 'N/A',
        Unit: jobDetails.Unit || 'N/A',
        post_date: jobDetails.post_date || null,
        end_date: jobDetails.end_date || null,
        PositionID: jobDetails.PositionID || '',
        tblStructureDetails_ID: jobDetails.tblStructureDetails_ID || null,
        history: jobDetails.history || [],
        ...jobDetails,
      };

      if (jobDetails.criteria && typeof jobDetails.criteria === 'object') {
        selectedCriteria.value = {
          id: jobDetails.criteria.id || null,
          Education: jobDetails.criteria.Education || 'Not specified',
          Experience: jobDetails.criteria.Experience || 'Not specified',
          Training: jobDetails.criteria.Training || 'Not specified',
          Eligibility: jobDetails.criteria.Eligibility || 'Not specified',
        };
      }

      // ✅ Update display BEFORE navigation
      displayHistoryId.value = historyId;

      // Navigate
      await router.push({
        name: 'JobPost View',
        params: { id: historyId },
      });

      // ✅ Update after successful navigation
      lastLoadedId.value = historyId;
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details. Please try again.');
    } finally {
      jobPostStore.loading = false;
      isNavigating.value = false;
    }
  };

  const refreshJobDetails = async (showLoading = false) => {
    if (showLoading) {
      jobPostStore.loading = true;
    }

    try {
      console.log('Refreshing job details for ID:', jobId.value);

      let jobDetails = await jobPostStore.fetchJobDetails(jobId.value);

      if (!jobDetails && jobPostStore.jobPosts) {
        jobDetails = jobPostStore.jobPosts;
      }

      if (!jobDetails) {
        throw new Error('No job details returned from server');
      }

      selectedJob.value = {
        id: jobDetails.id || null,
        old_job_id: jobDetails.old_job_id || null,
        Position: jobDetails.Position || 'Unknown Position',
        status: jobDetails.status || 'Unknown',
        level: jobDetails.level || 'N/A',
        PageNo: jobDetails.PageNo || 'N/A',
        ItemNo: jobDetails.ItemNo || 'N/A',
        SalaryGrade: jobDetails.SalaryGrade || 'N/A',
        Office: jobDetails.Office || 'Unknown Office',
        Division: jobDetails.Division || 'N/A',
        Section: jobDetails.Section || 'N/A',
        Unit: jobDetails.Unit || 'N/A',
        post_date: jobDetails.post_date || null,
        end_date: jobDetails.end_date || null,
        PositionID: jobDetails.PositionID || '',
        tblStructureDetails_ID: jobDetails.tblStructureDetails_ID || null,
        history: jobDetails.history || [],
        ...jobDetails,
      };

      // ✅ FIXED: Set displayHistoryId to show active option
      displayHistoryId.value = jobDetails.id;
      console.log('Set displayHistoryId to:', displayHistoryId.value);

      if (jobDetails.criteria && typeof jobDetails.criteria === 'object') {
        selectedCriteria.value = {
          id: jobDetails.criteria.id || null,
          Education: jobDetails.criteria.Education || 'Not specified',
          Experience: jobDetails.criteria.Experience || 'Not specified',
          Training: jobDetails.criteria.Training || 'Not specified',
          Eligibility: jobDetails.criteria.Eligibility || 'Not specified',
        };
      } else {
        selectedCriteria.value = {
          Education: 'No criteria available',
          Experience: 'No criteria available',
          Training: 'No criteria available',
          Eligibility: 'No criteria available',
        };
      }

      return jobDetails;
    } catch (error) {
      console.error('Error refreshing job details:', error);
      throw error;
    } finally {
      if (showLoading) {
        jobPostStore.loading = false;
      }
    }
  };

  const refreshApplicantData = async () => {
    if (!selectedJob.value.id) return;

    ratingsLoading.value = true;
    try {
      await Promise.all([
        jobPostStore.fetch_applicant(selectedJob.value.id).catch((err) => {
          console.warn('Failed to fetch applicants:', err);
          return null;
        }),
        jobPostStore.fetch_applicant_rating(selectedJob.value.id).catch((err) => {
          console.warn('Failed to fetch ratings:', err);
          return null;
        }),
      ]);

      console.log('Successfully refreshed applicant data');
    } catch (error) {
      console.error('Error refreshing applicant data:', error);
      toast.error('Failed to refresh applicant data');
    } finally {
      ratingsLoading.value = false;
    }
  };

  const updateJobStatusToUnoccupied = async () => {
    if (!selectedJob.value || !selectedJob.value.id) {
      toast.error('Job ID not found. Cannot update status.');
      unoccupiedConfirmDialog.value = false;
      return;
    }

    try {
      const payload = {
        id: selectedJob.value.id,
        status: 'Unoccupied',
      };

      await jobPostStore.updateJobStatus(selectedJob.value.id, payload);
      toast.success('Job status updated to Unoccupied successfully!');
      unoccupiedConfirmDialog.value = false;
      await refreshJobDetails();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status. Please try again.');
      unoccupiedConfirmDialog.value = false;
    }
  };

  const onApplicantsImported = async (importedApplicants) => {
    console.log('Applicants imported:', importedApplicants);
    toast.success(`Successfully imported ${importedApplicants.length} applicant(s)`);
    await refreshApplicantData();
  };

  const submitEvaluation = async (evaluationData) => {
    try {
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

      await Promise.all([refreshJobDetails(), refreshApplicantData()]);
      toast.success('Evaluation submitted successfully!');
    } catch (error) {
      console.error('Evaluation submission error:', error);
      toast.error('Failed to submit evaluation');
    }
  };

  const ratingData = computed(() => {
    if (!jobPostStore.applicant_rating) {
      return { total_completed: 0, total_assigned: 0 };
    }

    return {
      total_completed: jobPostStore.applicant_rating.total_completed || 0,
      total_assigned: jobPostStore.applicant_rating.total_assigned || 0,
    };
  });

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

  const onApplicantHired = async () => {
    try {
      // Refresh job details to update status
      await refreshJobDetails(true);

      // Refresh applicant data - this will update both the applicants and ratings tables
      await refreshApplicantData();

      // Close the score modal
      closeScoreModal();
    } catch (error) {
      console.error('Error refreshing after hire:', error);
      toast.error('Failed to refresh data after hiring.');
    }
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
        `${apiUrl}/on-funded-plantilla/by-funded/${selectedJob.value.id}`,
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

  const statusColor = computed(() => {
    const status = (selectedJob.value?.status || '').toLowerCase();

    switch (status) {
      case 'not started':
        return 'grey';
      case 'pending':
        return 'orange';
      case 'assessed':
        return 'blue';
      case 'rated':
        return 'purple';
      case 'occupied':
      case 'qualified':
        return 'green';
      case 'unqualified':
        return 'red';
      case 'unoccupied':
        return 'red-9';
      case 'republished':
        return 'yellow-8';
      default:
        return 'grey';
    }
  });

  const showUnoccupiedButton = computed(() => {
    const status = selectedJob.value?.status;
    if (!status) return false;

    const normalizedStatus = status.toLowerCase().trim();
    return normalizedStatus === 'rated' || normalizedStatus === 'rating completed';
  });

  const formattedApplicantRatings = computed(() => {
    if (!jobPostStore.applicant_rating) return [];

    let ratingsArray = [];

    if (
      jobPostStore.applicant_rating.applicants &&
      typeof jobPostStore.applicant_rating.applicants === 'object'
    ) {
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
        history: rating.history || [],
        originalData: rating,
        raw: rating,
      }))
      .sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

    return formatted;
  });

  function viewApplicantDetails(row) {
    selectedApplicantData.value = {
      ControlNo: row.raw?.ControlNo || row.ControlNo,
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
      education_images: row.educatiuon_images || row.raw?.education_images || null,
      experience_images: row.experience_images || row.raw?.experience_images || null,
      training_images: row.training_images || row.raw?.training_images || null,
      eligibility_images: row.eligibility_images || row.raw?.eligibility_images || null,
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

  function viewApplicantScore(applicantRow) {
    let historyData = [];

    if (applicantRow.originalData && applicantRow.originalData.history) {
      historyData = applicantRow.originalData.history;
    } else if (applicantRow.history) {
      historyData = applicantRow.history;
    } else if (applicantRow.raw && applicantRow.raw.history) {
      historyData = applicantRow.raw.history;
    }

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
        education: applicantRow.education,
        experience: applicantRow.experience,
        training: applicantRow.training,
        performance: applicantRow.performance,
        bei: applicantRow.bei,
        total_qs: applicantRow.total_qs,
        grand_total: applicantRow.grand_total,
        rank: applicantRow.rank,
        history: historyData,
      },
      jobDetails: selectedJob.value || {},
    };
  }

  const handleQualificationModalUpdate = (value) => {
    qualificationModalVisible.value = value;
  };

  const handleScoreModalUpdate = (value) => {
    scoreModal.value.visible = value;
  };

  function closeScoreModal() {
    scoreModal.value = { visible: false, applicant: null };
  }

  const onToggleQualification = (status) => {
    selectedApplicantData.value.status = status;
  };

  const onCloseQualificationModal = () => {
    qualificationModalVisible.value = false;
    selectedApplicantData.value = {};
  };

  const onViewPDS = () => {
    console.log('View PDS requested for:', selectedApplicantData.value.name);
  };

  onMounted(async () => {
    console.log('Component mounting, jobId:', jobId.value);

    if (!jobId.value) {
      console.error('No job ID provided in route params');
      toast.error('No job ID provided');
      router.push('/job-post');
      return;
    }

    try {
      isNavigating.value = false;
      lastLoadedId.value = jobId.value;

      await refreshJobDetails(true);

      console.log('Loading all job posts...');
      await jobPostStore.job_post();
      console.log('Job posts loaded:', jobPostStore.jobPosts);

      await refreshApplicantData();

      if (selectedJob.value.id) {
        displayHistoryId.value = selectedJob.value.id;
        console.log('Set displayHistoryId to:', displayHistoryId.value);
      }

      console.log('Initial data loading completed');
    } catch (error) {
      console.error('Error during initial data loading:', error);

      let errorMessage = 'Failed to load job details';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Job not found';
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      if (error.response?.status === 404) {
        setTimeout(() => {
          router.push('/job-post');
        }, 2000);
      }
    }
  });

  // ✅ Watch route changes (browser back/forward)
  watch(
    () => route.params.id,
    async (newId, oldId) => {
      // Skip if navigating programmatically
      if (isNavigating.value) {
        console.log('Skipping watcher - programmatic navigation in progress');
        return;
      }

      // Skip if same ID
      if (newId === lastLoadedId.value || !newId) {
        console.log('Skipping watcher - same ID or invalid');
        return;
      }

      console.log('Route changed (browser navigation):', oldId, '→', newId);

      try {
        lastLoadedId.value = newId;

        await refreshJobDetails(true);
        await refreshApplicantData();

        // Set display ID
        if (selectedJob.value.id) {
          displayHistoryId.value = selectedJob.value.id;
          console.log('Updated displayHistoryId to:', displayHistoryId.value);
        }
      } catch (error) {
        console.error('Error on route change:', error);
        toast.error('Failed to load job details');
      }
    },
  );
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
