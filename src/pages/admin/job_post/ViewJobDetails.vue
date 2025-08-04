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
                <div class="text-caption text-grey-7">Education1</div>
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

    <!-- Applicants Table Card -->
    <q-card flat bordered class="shadow-2" style="max-width: 1000px; margin: auto">
      <q-inner-loading :showing="jobPostStore.loading">
        <q-spinner size="32px" color="primary" />
      </q-inner-loading>
      <q-card-section v-if="!jobPostStore.loading" class="q-pa-md">
        <div class="row items-center q-mb-sm">
          <div class="text-h6 text-primary">
            Applicants for
            <span class="text-weight-bold">{{ selectedJob?.Position || 'Test' }}</span>
          </div>
        </div>
        <q-table
          :rows="formattedApplicants"
          :columns="applicantColumns"
          row-key="id"
          flat
          bordered
          hide-pagination
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
    <!-- <QualificationModal
      v-if="qualificationModalVisible"
      :show="qualificationModalVisible"
      :applicant-data="selectedApplicantData"
      :position-requirements="selectedCriteria"
      :is-submitted="false"
      @update:show="qualificationModalVisible = $event"
      @view-pds="onViewPDS"
      @toggle-qualification="onToggleQualification"
      @submit="onSubmitEvaluation"
      @close="onCloseQualificationModal"
    /> -->

    <!-- Qualification Modal -->
    <!-- <QualificationModal
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
/> -->
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

  const router = useRouter();
  const route = useRoute();
  const jobPostStore = useJobPostStore();
  const P_ID = route.params.PositionID;
  const I_No = route.params.ItemNo;
  const selectedJob = ref([]);
  const { formatDate } = date;
  const selectedCriteria = ref([]);

  // Modal state
  const qualificationModalVisible = ref(false);
  const selectedApplicantData = ref({});

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

  const applicantColumns = [
    //  { name: 'id', label: 'id', field: 'id', align: 'left', sortable: true },

    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
    {
      name: 'appliedDate',
      label: 'Applied Date',
      field: 'appliedDate',
      align: 'left',
    },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'center',
    },
    {
      name: 'rank',
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
    console.log('Full row data:', row);
    console.log('Raw data:', row.raw);
    selectedApplicantData.value = {
      id: row.raw?.id || row.id,
      // nPersonalInfo_id: row.raw?.nPersonalInfo_id,
      job_batches_rsp_id: row.raw?.job_batches_rsp_id,
      status: row.status || 'Pending',
      name: `${row.firstname}${row.lastname}${row.name_extension ? ' ' + row.name_extension : ''}`,
      position: selectedJob.value?.Position || 'N/A',
      level: selectedJob.value?.level || 'N/A',
      appliedDate: row.appliedDate,
      PositionID: selectedJob.value?.PositionID,
      ItemNo: selectedJob.value?.ItemNo,
      education_remark: row.education_remark,
      experience_remark: row.experience_remark,
      training_remark: row.training_remark,
      eligibility_remark: row.eligibility_remark,

<<<<<<< Updated upstream
      // Use the education data from the formatted row first, then fallback to raw
=======

    // Use the education data from the formatted row first, then fallback to raw
    education: row.education || row.raw?.education || [],

    // Pass complete personal info structure
    n_personal_info: {
>>>>>>> Stashed changes
      education: row.education || row.raw?.education || [],

      // Pass complete personal info structure
      n_personal_info: {
        education: row.education || row.raw?.education || [],
        work_experience: row.work_experience || row.raw?.work_experience || [],
        training: row.training || row.raw?.training || [],
        eligibity: row.eligibity || row.raw?.eligibity || [],
      },

      raw: row.raw, // Include the full raw data
    };
    console.log('Selected applicant data:', selectedApplicantData.value);
    console.log('Applicant ID:', selectedApplicantData.value.id); // Log the id we'll
    console.log('Selected applicant data:', selectedApplicantData.value); // Debug log
    qualificationModalVisible.value = true;
  }

  // Modal event handlers
  const onViewPDS = () => {
    toast.info('View PDS functionality to be implemented');
    // Implement PDS viewing logic here
  };

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

  /* Make font a little smaller for a modern, compact look */
  .chip-label {
    font-size: 1rem;
    font-weight: 400;
    font-family: 'Montserrat', 'Roboto', Arial, sans-serif;
  }
  .chip-label b {
    font-weight: 700;
  }

  /* Adjust icon size and spacing for compact appearance */
  .q-chip__icon,
  .q-icon {
    font-size: 1.15em;
    margin-right: 4px;
  }
</style>
