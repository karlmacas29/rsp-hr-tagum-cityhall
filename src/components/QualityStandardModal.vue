<template>
  <q-dialog v-model="localShow" persistent @show="onModalShow">
    <q-card
      class="qualification-modal"
      style="
        width: 1050px;
        max-width: 95vw;
        height: 90vh;
        max-height: 95vh;
        display: flex;
        flex-direction: column;
      "
    >
      <!-- Header Section -->
      <q-card-section class="row justify-between header text-black q-px-md q-py-sm">
        <div>
          <div class="text-h5 text-bold">Qualification Standard (QS)</div>
          <div class="text-subtitle1">Application Information</div>
        </div>
        <q-btn icon="close" flat round dense class="close-btn" @click="onClose" />
      </q-card-section>

      <!-- Applicant View - Main Content Area -->
      <q-card-section class="main-content-section" style="flex: 1; overflow: hidden">
        <div class="row no-wrap full-height">
          <!-- Left Card (Applicant Info) -->
          <q-card class="col-3 q-mr-md">
            <q-card-section class="column items-center q-pa-md">
              <q-img
                src="https://placehold.co/100"
                class="bg-grey-4"
                style="width: 100px; height: 100px; border-radius: 10px"
                alt="Applicant Photo"
              />
              <div class="text-body text-bold text-center q-mb-sm">
                {{ applicantData?.name || 'John Doe' }}
              </div>
              <q-badge
                class="q-pa-xs"
                :class="
                  applicantData.status == 'ELECTIVE'
                    ? 'bg-blue'
                    : applicantData.status == 'APPOINTED'
                      ? 'bg-purple'
                      : applicantData.status == 'CO-TERMINOUS'
                        ? 'bg-brown'
                        : applicantData.status == 'REGULAR'
                          ? 'bg-green'
                          : applicantData.status == 'TEMPORARY'
                            ? 'bg-yellow text-black'
                            : applicantData.status == 'CASUAL'
                              ? 'bg-grey-4'
                              : applicantData.status == 'CONTRACTUAL'
                                ? 'bg-light-blue'
                                : applicantData.status == 'HONORARIUM'
                                  ? 'bg-black'
                                  : 'bg-grey'
                "
              >
                {{ applicantData?.status || 'PENDING' }}
                <q-icon v-if="evaluationLocked" name="lock" class="q-ml-xs" />
              </q-badge>

              <div class="full-width">
                <div class="text-center q-mb-sm">
                  <div v-if="applicantData.status != null">
                    <div class="text-caption text-grey-7">Position</div>
                  </div>
                  <div v-else>
                    <div class="text-caption text-grey-7">Applied Position</div>
                  </div>
                  <div class="text-body2 text-bold">
                    {{ applicantData?.position || 'Office of the ...' }}
                  </div>
                  <q-chip dense>
                    Position Level:
                    <q-badge rounded dense color="green" class="text-white q-ml-sm">
                      {{ applicantData?.level || 'A' }}
                    </q-badge>
                  </q-chip>
                </div>

                <div v-if="applicantData.applicationDate" class="text-center q-mb-sm">
                  <div class="text-caption text-grey-7">Application Date</div>
                  <div class="text-weight-medium">
                    {{ applicantData?.applicationDate || '#### ##, ####' }}
                  </div>
                </div>

                <div v-if="overallStatus != '#####'" class="text-center">
                  <div class="text-caption text-grey-7">Evaluation Status</div>
                  <div class="text-weight-medium" :class="`text-${statusColor}`">
                    {{ overallStatus }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Right Card (Tabs) -->
          <q-card class="col" style="display: flex; flex-direction: column">
            <div class="row justify-between items-center q-px-md" style="min-height: 40px">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey-8"
                active-color="primary"
                indicator-color="primary"
                align="left"
                style="min-height: 40px"
              >
                <q-tab name="education" label="EDUCATION" class="text-weight-medium" />
                <q-tab name="experience" label="EXPERIENCE" class="text-weight-medium" />
                <q-tab name="training" label="TRAINING" class="text-weight-medium" />
                <q-tab name="eligibility" label="ELIGIBILITY" class="text-weight-medium" />
              </q-tabs>
              <q-btn label="VIEW PDS" color="primary" outline @click="onViewPDS" />
            </div>

            <q-separator />

            <q-tab-panels v-model="tab" class="q-pa-none" style="flex: 1; overflow: auto">
              <!-- Education Panel -->
              <q-tab-panel name="education" class="row q-pa-none">
                <div class="col q-pa-sm" style="border-right: 1px solid #e0e0e0">
                  <q-scroll-area style="height: 100%">
                    <div class="text-h6 q-mb-md">Applicant Education</div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :rows="xEdu"
                        :columns="xEduCol"
                        row-key="id"
                        :pagination="{ rowsPerPage: 10 }"
                        :loading="xPDS.loading"
                      >
                        <!-- <template v-slot:loading>
                          <q-inner-loading showing color="primary">
                            <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
                          </q-inner-loading>
                        </template> -->
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>

                <div class="col q-pa-sm">
                  <q-scroll-area style="height: 100%">
                    <div class="text-h6 q-mb-md">Position Qualification Standard</div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :columns="educationCol"
                        :rows="positionQS"
                        hide-bottom
                        :loading="usePlantilla.qsLoad"
                      >
                        <!-- <template v-slot:loading>
                          <q-inner-loading showing color="primary">
                            <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
                          </q-inner-loading>
                        </template> -->
                        <template v-slot:body-cell-Education="props">
                          <q-td
                            :props="props"
                            style="width: 300px; white-space: normal; word-wrap: break-word"
                          >
                            {{ props.row.Education }}
                          </q-td>
                        </template>
                        <template v-slot:no-data>
                          <div class="full-width row flex-center q-pa-md text-grey">
                            <q-icon name="info" size="24px" class="q-mr-sm" />
                            No qualification standards available
                          </div>
                        </template>
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>
              </q-tab-panel>

              <!-- Experience Panel -->
              <q-tab-panel name="experience" class="row q-pa-none">
                <div class="col q-pa-sm" style="border-right: 1px solid #e0e0e0">
                  <q-scroll-area style="height: 100%">
                    <div class="text-h6 q-mb-md">Applicant Experience</div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :rows="xExperience"
                        :columns="xExperienceCol"
                        row-key="id"
                        :pagination="{ rowsPerPage: 10 }"
                      ></q-table>
                    </q-card>
                  </q-scroll-area>
                </div>

                <div class="col q-pa-sm">
                  <q-scroll-area style="height: 100%">
                    <div class="text-h6 q-mb-md">Position Qualification Standard</div>
                    <q-card class="q-ma-sm">
                      <q-table :columns="ExperienceCol" :rows="positionQS" hide-bottom>
                        <template v-slot:body-cell-Experience="props">
                          <q-td
                            :props="props"
                            style="width: 300px; white-space: normal; word-wrap: break-word"
                          >
                            {{ props.row.Experience }}
                          </q-td>
                        </template>
                        <template v-slot:no-data>
                          <div class="full-width row flex-center q-pa-md text-grey">
                            <q-icon name="info" size="24px" class="q-mr-sm" />
                            No qualification standards available
                          </div>
                        </template>
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>
              </q-tab-panel>

              <!-- Training Panel -->
              <q-tab-panel name="training" class="row q-pa-none">
                <div class="col q-pa-sm" style="border-right: 1px solid #e0e0e0">
                  <q-scroll-area style="height: 100%">
                    <div class="text-h6 q-mb-md">Applicant Training</div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :rows="xTraining"
                        :columns="xTrainingCol"
                        row-key="id"
                        :pagination="{ rowsPerPage: 10 }"
                      ></q-table>
                    </q-card>
                  </q-scroll-area>
                </div>

                <div class="col q-pa-sm">
                  <q-scroll-area style="height: 100%">
                    <div class="text-h6 q-mb-md">Position Qualification Standard</div>
                    <q-card class="q-ma-sm">
                      <q-table :columns="trainingCol" :rows="positionQS" hide-bottom>
                        <template v-slot:body-cell-Training="props">
                          <q-td
                            :props="props"
                            style="width: 300px; white-space: normal; word-wrap: break-word"
                          >
                            {{ props.row.Training }}
                          </q-td>
                        </template>
                        <template v-slot:no-data>
                          <div class="full-width row flex-center q-pa-md text-grey">
                            <q-icon name="info" size="24px" class="q-mr-sm" />
                            No qualification standards available
                          </div>
                        </template>
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>
              </q-tab-panel>

              <!-- Eligibility Panel -->
              <q-tab-panel name="eligibility" class="row q-pa-none">
                <div class="col q-pa-sm" style="border-right: 1px solid #e0e0e0">
                  <q-scroll-area style="height: 100%">
                    <div class="text-h6 q-mb-md">Applicant Eligibility</div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :rows="xEligibility"
                        :columns="xEligibilityCol"
                        row-key="id"
                        :pagination="{ rowsPerPage: 10 }"
                      ></q-table>
                    </q-card>
                  </q-scroll-area>
                </div>

                <div class="col q-pa-sm">
                  <q-scroll-area style="height: 100%">
                    <div class="text-h6 q-mb-md">Position Qualification Standard</div>
                    <q-card class="q-ma-sm">
                      <q-table :columns="eligibilityCol" :rows="positionQS" hide-bottom>
                        <template v-slot:body-cell-Eligibility="props">
                          <q-td
                            :props="props"
                            style="width: 300px; white-space: normal; word-wrap: break-word"
                          >
                            {{ props.row.Eligibility }}
                          </q-td>
                        </template>
                        <template v-slot:no-data>
                          <div class="full-width row flex-center q-pa-md text-grey">
                            <q-icon name="info" size="24px" class="q-mr-sm" />
                            No qualification standards available
                          </div>
                        </template>
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </q-card-section>

      <!-- Footer Actions - Updated with Radio Buttons and without VIEW PDS -->
      <q-card-section class="footer-actions bg-grey-2 q-py-sm">
        <div class="row justify-between items-center">
          <div class="row items-center">
            <q-btn
              flat
              dense
              :icon="showControlNo ? 'visibility_off' : 'visibility'"
              @click="showControlNo = !showControlNo"
              class="q-mr-sm"
            />
            <q-badge v-if="showControlNo" color="grey">
              Control No. {{ applicantData?.controlno || '0' }}
            </q-badge>
          </div>

          <div v-if="!props.isPlantilla && !evaluationLocked" class="column items-center">
            <!-- Improved radio buttons with better styling -->
            <div class="text-caption text-grey-7 q-mb-xs">Evaluation Status</div>
            <div class="row justify-center q-gutter-md">
              <q-radio
                v-model="qualificationStatus"
                val="Qualified"
                label="Qualified"
                color="positive"
                :disable="evaluationLocked"
                class="radio-button"
              >
                <q-tooltip>Candidate meets all requirements</q-tooltip>
              </q-radio>
              <q-radio
                v-model="qualificationStatus"
                val="Unqualified"
                label="Unqualified"
                color="negative"
                :disable="evaluationLocked"
                class="radio-button"
              >
                <q-tooltip>Candidate doesn't meet requirements</q-tooltip>
              </q-radio>
            </div>
          </div>

          <div class="row justify-end">
            <q-btn
              v-if="!props.isPlantilla && !evaluationLocked"
              label="SUBMIT EVALUATION"
              color="positive"
              @click="onSubmit"
              :disable="qualificationStatus === 'Pending'"
              class="q-mx-sm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { usePlantillaStore } from 'stores/plantillaStore';
  import { usexPDS } from 'stores/xUserPDS';

  const xPDS = usexPDS();

  const xEdu = ref([]);
  const xEligibility = ref([]);
  const xExperience = ref([]);
  const xTraining = ref([]);

  const xEduCol = [
    {
      name: 'level',
      required: true,
      label: 'Level',
      align: 'left',
      field: 'Education',
      sortable: true,
    },
    {
      name: 'schoolName',
      required: true,
      label: 'Name of School',
      align: 'left',
      field: 'School',
      sortable: true,
    },
    {
      name: 'course',
      required: true,
      label: 'Basic Education/Degree/Course',
      align: 'left',
      field: 'Degree',
      sortable: true,
    },
    {
      name: 'fromYear',
      required: true,
      label: 'From',
      align: 'left',
      field: (row) =>
        row.DateAttend.includes('-') ? row.DateAttend.split('-')[0].trim() : row.DateAttend,
      // field: 'DateAttend',
      sortable: true,
    },
    {
      name: 'toYear',
      required: true,
      label: 'To',
      align: 'left',
      field: (row) =>
        row.DateAttend.includes('-') ? row.DateAttend.split('-')[1].trim() : row.DateAttend,
      // field: 'DateAttend',
      sortable: true,
    },
    {
      name: 'highestLevel',
      required: true,
      label: 'Highest Level/Units Earned',
      align: 'left',
      field: (row) => row?.YearLevel || 'None' + '/' + row.NumUnits,
      sortable: true,
    },
    {
      name: 'yearGraduated',
      required: true,
      label: 'Year Graduated',
      align: 'left',
      field: (row) =>
        row.DateAttend.includes('-') ? row.DateAttend.split('-')[1].trim() : row.DateAttend,
      // field: 'DateAttend',
      sortable: true,
    },
    {
      name: 'honors',
      required: true,
      label: 'Scholarship/Academic Honors Received',
      align: 'left',
      field: (row) => row?.Honors || 'None',
      sortable: true,
    },
  ];

  const xEligibilityCol = [
    {
      name: 'eligibility',
      label: 'Eligibility',
      field: 'CivilServe',
      sortable: true,
      align: 'left',
    },
    {
      name: 'rating',
      label: 'Rating (If Applicable)',
      field: 'Rates',
      sortable: true,
      align: 'left',
    },
    {
      name: 'examDate',
      label: 'Date of Examination',
      field: 'Dates',
      sortable: true,
      align: 'left',
    },
    {
      name: 'examPlace',
      label: 'Place of Examination',
      field: 'Place',
      sortable: true,
      align: 'left',
    },
    {
      name: 'licenseNumber',
      label: 'License Number',
      field: 'LNumber',
      sortable: true,
      align: 'left',
    },
    {
      name: 'validityDate',
      label: 'Date of Validity',
      field: 'LDate',
      sortable: true,
      align: 'left',
    },
  ];

  const xExperienceCol = [
    {
      name: 'fromDate',
      label: 'From',
      field: 'WFrom',
      align: 'left',
      // format: (val) => new Date(val).toLocaleDateString('en-PH')
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'WTo',
      align: 'left',
      // format: (val) => new Date(val).toLocaleDateString('en-PH')
    },
    {
      name: 'positionTitle',
      label: 'Position Title',
      field: 'WPosition',
      align: 'left',
    },
    {
      name: 'department',
      label: 'Department',
      field: 'WCompany',
      align: 'left',
    },
    {
      name: 'monthlySalary',
      label: 'Monthly Salary',
      field: 'WSalary',
      align: 'right',
      format: (val) => val.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }),
    },
    {
      name: 'salaryGrade',
      label: 'Salary Grade',
      field: 'WGrade',
      align: 'left',
    },
    {
      name: 'appointmentStatus',
      label: 'Status of Appointment',
      field: 'Status',
      align: 'left',
    },
    {
      name: 'govtService',
      label: "Gov't Service",
      field: 'WGov',
      align: 'left',
    },
  ];

  const xTrainingCol = [
    {
      name: 'title',
      label: 'Title',
      field: 'Training',
      align: 'left',
    },
    {
      name: 'fromDate',
      label: 'From',
      field: 'DateFrom',
      // format: (val) => new Date(val).toLocaleDateString(),
      align: 'left',
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'DateTo',
      // format: (val) => new Date(val).toLocaleDateString(),
      align: 'left',
    },
    {
      name: 'hours',
      label: 'Number of Hours',
      field: 'NumHours',
      align: 'left',
    },
    {
      name: 'type',
      label: 'Type',
      field: 'type',
      align: 'left',
    },
    {
      name: 'conductor',
      label: 'Conducted/Sponsored By',
      field: 'Conductor',
      align: 'left',
    },
  ];

  const usePlantilla = usePlantillaStore();
  const showControlNo = ref(false);

  const positionQS = ref([]);

  const educationCol = ref([
    { name: 'Education', label: 'Education', align: 'left', field: 'Education' },
  ]);

  const ExperienceCol = ref([
    { name: 'Experience', label: 'Experience', align: 'left', field: 'Experience' },
  ]);
  const trainingCol = ref([
    { name: 'Training', label: 'Training', align: 'left', field: 'Training' },
  ]);
  const eligibilityCol = ref([
    { name: 'Eligibility', label: 'Eligibility', align: 'left', field: 'Eligibility' },
  ]);

  const props = defineProps({
    show: Boolean,
    isPlantilla: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'employee',
      validator: (value) => ['employee', 'applicant'].includes(value),
    },
    applicantData: Object,
    positionRequirements: Object,
    isSubmitted: Boolean,
  });

  const emit = defineEmits(['update:show', 'view-pds', 'toggle-qualification', 'submit', 'close']);

  const localShow = ref(props.show);
  const tab = ref('education');

  // Use a separate ref for the qualification status to track the radio selection
  const qualificationStatus = ref(props.applicantData?.status || 'Pending');

  // Watch for changes in the qualification status
  watch(qualificationStatus, (newStatus) => {
    if (newStatus !== props.applicantData?.status) {
      emit('toggle-qualification', newStatus);
    }
  });

  // Watch for changes in the applicantData to keep qualificationStatus in sync
  watch(
    () => props.applicantData?.status,
    (newStatus) => {
      if (newStatus) {
        qualificationStatus.value = newStatus;
      }
    },
    { immediate: true },
  );

  const evaluationLocked = computed(() => props.isSubmitted);

  const statusColor = computed(() => {
    switch (props.applicantData.status) {
      case 'Qualified':
        return 'positive';
      case 'Pending':
        return 'warning';
      case 'Unqualified':
        return 'negative';
      default:
        return 'grey';
    }
  });

  const overallStatus = computed(() => {
    switch (props.applicantData.status) {
      case 'Qualified':
        return 'Meets Requirements';
      case 'Unqualified':
        return 'Does not meet the requirements';
      default:
        return '#####';
    }
  });

  watch(
    () => props.show,
    (newVal) => {
      localShow.value = newVal;
    },
  );

  watch(localShow, (newVal) => {
    emit('update:show', newVal);
  });

  const onModalShow = async () => {
    tab.value = 'education';

    // Fetch QS data when modal shows
    if (props.applicantData?.PositionID) {
      await usePlantilla.fetchQsData(props.applicantData.PositionID);
      positionQS.value = usePlantilla.qsData;

      await xPDS.fetchxPDS(props.applicantData.controlno);
      xEdu.value = xPDS.xPDS.Education;
      xEligibility.value = xPDS.xPDS.Eligibility;
      xExperience.value = xPDS.xPDS.Experience;
      xTraining.value = xPDS.xPDS.Training;
    }
  };

  const onClose = () => {
    emit('close');
    positionQS.value = [];
    xEdu.value = [];
    xEligibility.value = [];
    xExperience.value = [];
    xTraining.value = [];
  };
  const onViewPDS = () => emit('view-pds');
  const onSubmit = () => {
    if (!props.isSubmitted && qualificationStatus.value !== 'Pending') {
      emit('submit');
    }
  };
</script>

<style scoped lang="scss">
  .qualification-modal {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }

  .header {
    background-color: #f5f5f5;
  }

  .main-content-section {
    flex: 1;
    overflow: hidden;
    padding: 16px;
  }

  .footer-actions {
    flex: 0 0 auto;
  }

  .full-height {
    height: 100%;
  }

  .close-btn {
    margin: 0;
  }

  .text-center {
    text-align: center;
  }

  .full-width {
    width: 100%;
  }

  .text-positive {
    color: var(--q-positive);
  }

  .qualification-table {
    width: 100%;
  }

  .qualification-table th {
    font-weight: bold;
    background-color: #fafafa;
    padding: 12px 16px;
  }

  .qualification-table td {
    padding: 12px 16px;
  }

  .q-tab {
    letter-spacing: 0.5px;
  }

  .q-markup-table {
    width: 100%;
  }

  .q-markup-table thead tr {
    background-color: #f5f5f5;
    .radio-button {
      padding: 8px 12px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 4px;
        border: 1px solid transparent;
        transition: all 0.3s ease;
      }

      &.q-radio--active::before {
        border-color: currentColor;
      }
    }

    .q-radio__label {
      margin-left: 8px;
      font-weight: 500;
    }
  }
</style>
