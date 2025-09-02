async fetch_applicant_score(id) { this.loading = true; try { const { data } = await
adminApi.get(`/show/${id}`); this.applicant = data.applicants; this.error = null; } catch (error) {
this.error = error; toast.error('Failed to fetch applicants.'); } finally { this.loading = false; }
},{ "34": { "firstname": "Deniel", "lastname": "Tomenio", "education": "23.00", "experience":
"18.50", "training": "13.50", "performance": "9.00", "bei": "18.00", "total_qs": "64.00",
"grand_total": "82.00", "nPersonalInfo_id": "34", "job_batches_rsp_id": "40061", "rank": 1 }, "33":
{ "firstname": "Alvin", "lastname": "Monsanto", "education": "16.50", "experience": "17.50",
"training": "12.50", "performance": "7.50", "bei": "19.00", "total_qs": "54.00", "grand_total":
"73.00", "nPersonalInfo_id": "33", "job_batches_rsp_id": "40061", "rank": 2 }, "32": { "firstname":
"Millan", "lastname": "Cliford", "education": "13.00", "experience": "13.00", "training": "10.00",
"performance": "10.00", "bei": "13.00", "total_qs": "46.00", "grand_total": "59.00",
"nPersonalInfo_id": "32", "job_batches_rsp_id": "40061", "rank": 3 } }
<template>
  <div class="q-pa-md bg-grey-1">
    <!-- Job Details Card -->
    <q-card class="q-mb-lg shadow-3" flat bordered style="max-width: 1000px; margin: auto">
      <q-inner-loading :showing="jobPostStore.loading">
        <q-spinner size="32px" color="primary" />
      </q-inner-loading>

      <q-card-section v-if="!jobPostStore.loading" class="q-pa-lg">
        <div class="row items-center justify-between q-mb-lg">
          <q-btn icon="arrow_back" round flat color="primary" @click="goBack" size="md" dense />
          <q-btn
            rounded
            color="primary"
            @click="viewFundedDocument"
            icon="description"
            label="View Funded"
            size="md"
            no-caps
            flat
            dense
          />
        </div>

        <div class="text-h6 text-primary text-weight-bold q-mb-xs">
          {{ selectedJob?.Position || 'Job Title' }}
          {{ selectedJob?.id || 'Job ID' }}
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
      <q-inner-loading :showing="jobPostStore.loading">
        <q-spinner size="32px" color="primary" />
      </q-inner-loading>

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
              <!-- Assessment status badge -->
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
                  {{ props.row.firstname }}{{ props.row.lastname }}
                  <span v-if="props.row.name_extension">&nbsp;{{ props.row.name_extension }}</span>
                </q-td>
              </template>
              <template #body-cell-appliedDate="props">
                <q-td :props="props">
                  {{ props.row.appliedDate || '-' }}
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
              <!-- Assessment status badge -->
              <div class="assessment-status">
                <q-badge class="q-pa-xs">
                  <q-icon name="assessment" class="q-mr-xs" />
                  Rated: {{ assessedCount }}/{{ totalApplicants }} raters
                </q-badge>
              </div>
            </div>
            <q-table
              :rows="formattedApplicants"
              :columns="ratingColumns"
              row-key="id"
              flat
              bordered
              class="rating-table"
              dense
              v-if="ratingColumns.length"
              separator="cell"
              color="primary"
            >
              <template #body-cell-name="props">
                <q-td :props="props">
                  {{ props.row.firstname }}{{ props.row.lastname }}
                  <span v-if="props.row.name_extension">&nbsp;{{ props.row.name_extension }}</span>
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
              <template #body-cell-ranking="props">
                <q-td :props="props">
                  <q-badge
                    v-if="props.row.ranking"
                    color="orange"
                    class="text-caption q-px-sm"
                    rounded
                  >
                    {{ props.row.ranking }}
                  </q-badge>
                  <span v-else>-</span>
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
    <q-dialog v-model="pdfModalVisible">
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

    <!-- Qualification Modal -->
    <QualificationModal
      v-if="qualificationModalVisible"
      :show="qualificationModalVisible"
      :applicant-data="selectedApplicantData"
      :education="selectedApplicantData.education"
      :position-requirements="selectedCriteria"
      :is-submitted="false"
      @update:show="qualificationModalVisible = $event"
      @view-pds="onViewPDS"
      @toggle-qualification="onToggleQualification"
      @submit="submitEvaluation"
      @close="onCloseQualificationModal"
    />

    <ScoreModal
      v-if="scoreModal.visible"
      :show="scoreModal.visible"
      :applicant="scoreModal.applicant"
      @update:show="scoreModal.visible = $event"
      @close="closeScoreModal"
    />
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { onMounted, ref, computed } from 'vue';
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

  // Tab state
  const activeTab = ref('applicants');

  // Modal state
  const qualificationModalVisible = ref(false);
  const scoreModal = ref({ visible: false, applicant: null });
  const selectedApplicantData = ref({});

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

  const pdfModalVisible = ref(false);
  const pdfFileUrl = ref('');
  const isLoadingPdf = ref(false);
  const pdfErrorMessage = ref('');

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
      // Remove '/api' from the apiUrl if present
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
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
    {
      name: 'appliedDate',
      label: 'Applied Date',
      field: 'appliedDate',
      align: 'center',
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
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'center',
    },
    {
      name: 'ranking',
      label: 'Rank',
      field: 'ranking',
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

  // Format applicants data for the table
  const formattedApplicants = computed(() => {
    if (!jobPostStore.applicant) return [];

    return jobPostStore.applicant.map((a) => {
      // fallback for API structure: applicant.n_personal_info
      return {
        id: a.id,
        firstname: a.firstname || '',
        lastname: a.lastname || '',
        name_extension: a.name_extension || '',
        image_url: a.image_url || 'https://placehold.co/100',
        appliedDate:
          a.appliedDate ||
          (a.application_date ? formatDate(a.application_date, 'MMM D, YYYY') : '-'),
        status: a.status || '-',
        ranking: a.ranking,
        education: a.education || [],
        raw: a, // for details action

        education_remark: a.education_remark,
        experience_remark: a.experience_remark,
        training_remark: a.training_remark,
        eligibility_remark: a.eligibility_remark,
      };
    });
  });

  // Updated viewApplicantDetails function to open the modal
  function viewApplicantDetails(row) {
    // Set the selected applicant's data and id
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

  function viewApplicantScore(applicantRow) {
    scoreModal.value = {
      visible: true,
      applicant: applicantRow.raw || applicantRow,
    };
  }

  function closeScoreModal() {
    scoreModal.value = { visible: false, applicant: null };
  }

  // Update the onToggleQualification function
  const onToggleQualification = (status) => {
    // Update the applicant's qualification status locally
    selectedApplicantData.value.status = status;
    console.log(`Qualification status changed to: ${status}`);
  };

  // Update the submitEvaluation function to use id
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

      // Call the store method with the applicant id instead of nPersonalInfo_id
      await jobPostStore.evaluation(evaluationData);

      // Update the local status
      selectedApplicantData.value.status = evaluationData.status;

      // Close the modal
      qualificationModalVisible.value = false;

      // Refresh the applicants list to show updated status
      if (selectedJob.value && selectedJob.value.id) {
        await jobPostStore.fetch_applicant(selectedJob.value.id);
      }

      toast.success('Evaluation submitted successfully!');
    } catch (error) {
      console.error('Evaluation submission error:', error);
      toast.error('Failed to submit evaluation');
    }
  };

  const onCloseQualificationModal = () => {
    qualificationModalVisible.value = false;
    selectedApplicantData.value = {};
  };

  // Define onViewPDS function if it's needed (referenced but not defined in the original code)
  const onViewPDS = () => {
    // Implementation would go here if needed
    console.log('View PDS requested for:', selectedApplicantData.value.name);
    // You might want to implement this function to view Personal Data Sheet
  };

  onMounted(async () => {
    await jobPostStore.fetchJobPostByPositionAndItemNo(P_ID, I_No).then((job) => {
      selectedJob.value = job;
      if (job && job.id) {
        // Fetch applicants for this job
        jobPostStore.fetch_applicant(job.id);
      }
    });

    await jobPostStore.fetchCriteriaByPositionAndItemNo(P_ID, I_No).then((criteria) => {
      selectedCriteria.value = criteria;
    });
  });
</script>

<style scoped>
  .chips-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* Add horizontal padding on both sides */
  .chip-padding {
    padding-left: 18px;
    padding-right: 18px;
  }

  /* Match the chip colors from the image */
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

  /* Tab styling */
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

  /* Add a subtle hover effect for table rows */
  .q-table tr:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
</style>
