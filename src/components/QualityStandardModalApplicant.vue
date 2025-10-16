<template>
  <q-dialog v-model="localShow" persistent @show="onModalShow">
    <q-card
      class="qualification-modal"
      style="
        width: 1500px;
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
        <q-btn icon="close" flat round dense @click="onClose" />
      </q-card-section>

      <!-- Main Content Area -->
      <q-card-section class="main-content-section" style="flex: 1; overflow: hidden">
        <div class="row no-wrap full-height">
          <!-- Left Card (Applicant Info) -->
          <q-card class="col-2 q-mr-md">
            <q-card-section class="column justify-between items-center q-pa-md">
              <q-img
                :src="applicantData?.image_url || 'https://placehold.co/100'"
                class="bg-grey-4 q-mb-md"
                style="width: 100px; height: 100px; border-radius: 10px"
                alt="Applicant Photo"
              />
              <div class="text-body text-bold text-center q-mb-xs">
                {{ applicantData?.name || 'Please wait' }}
              </div>
              <q-badge
                rounded
                class="q-pa-xs q-mb-sm"
                :class="getStatusClass(applicantData?.status)"
              >
                {{ applicantData?.status || 'PENDING' }}
                <q-icon v-if="evaluationLocked || isJobOccupied" name="lock" class="q-ml-xs" />
              </q-badge>

              <div class="full-width">
                <div class="text-center q-mb-md">
                  <div class="text-caption text-grey-7 q-mb-xs">Applied Position</div>
                  <div class="text-body2 text-bold">
                    {{ applicantData?.position || 'Office of the ...' }}
                  </div>
                </div>

                <div class="text-center q-mb-sm">
                  <div class="text-caption text-grey-7 q-mb-xs">Application Date</div>
                  <div class="text-weight-medium">
                    {{ applicantData?.appliedDate || '#### ##, ####' }}
                  </div>
                </div>

                <div v-if="overallStatus !== '#####'" class="text-center">
                  <div class="text-caption text-grey-7 q-mb-xs">Evaluation Status</div>
                  <div class="text-weight-medium" :class="`text-${statusColor}`">
                    {{ overallStatus }}
                  </div>
                </div>
              </div>
              <q-btn class="q-mt-md" label="View PDS" color="primary" rounded @click="onViewPDS" />
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

              <q-btn
                v-if="!applicantData?.ControlNo"
                label="View Supporting Docs"
                color="orange-9"
                rounded
                style="font-size: 8pt"
                @click="showSupportingDocs"
              />
            </div>

            <q-separator />

            <q-tab-panels v-model="tab" class="q-pa-none" style="flex: 1; overflow: auto">
              <!-- Education Panel -->
              <q-tab-panel name="education" class="row q-pa-none" style="display: flex">
                <div class="col-9 q-pa-sm" style="border-right: 1px solid #e0e0e0">
                  <q-scroll-area style="height: 100%">
                    <div class="text-subtitle3">Applicant Education</div>

                    <q-card class="q-ma-sm">
                      <q-table
                        :rows="formattedEducation"
                        :columns="xEduCol"
                        row-key="id"
                        wrap-cells
                      >
                        <template v-slot:no-data>
                          <div class="full-width row flex-center q-pa-md text-grey">
                            <q-icon name="info" size="24px" class="q-mr-sm" />
                            No education records found
                          </div>
                        </template>
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>

                <div class="col-3 q-pa-sm">
                  <q-scroll-area style="height: 100%">
                    <div class="text-subtitle3 q-mb-md">Position Qualification Standard</div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :columns="educationCol"
                        :rows="positionQS"
                        hide-bottom
                        :loading="usePlantilla.qsLoad"
                      >
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
                    <q-input
                      v-model="education_remark"
                      label="Remarks"
                      autogrow
                      outlined
                      dense
                      class="q-mt-md modern-input"
                      :readonly="isJobOccupied || evaluationLocked"
                      :bg-color="isJobOccupied || evaluationLocked ? 'grey-3' : 'white'"
                    />
                  </q-scroll-area>
                </div>
              </q-tab-panel>

              <!-- Experience Panel -->
              <q-tab-panel name="experience" class="row q-pa-none" style="display: flex">
                <div class="col-9 q-pa-sm" style="border-right: 1px solid #e0e0e0">
                  <q-scroll-area style="height: 100%">
                    <div class="row items-center justify-between q-mb-md">
                      <div class="text-subtitle3">Applicant Experience</div>
                      <div class="row items-center q-gutter-sm">
                        <q-badge
                          color="green"
                          class="q-px-sm q-py-xs"
                          :label="formatTotalExperience(totalExperienceMonths)"
                        />
                        <q-tooltip class="bg-white text-dark shadow-4">
                          <div class="q-pa-sm">
                            <div class="text-weight-bold q-mb-xs">Experience Breakdown:</div>
                            <div v-if="xExperience.length === 0" class="text-grey-6">
                              No experience records found
                            </div>
                            <div v-else>
                              <div
                                v-for="(exp, index) in experienceWithDuration"
                                :key="index"
                                class="text-caption q-mb-xs"
                              >
                                <div class="text-weight-medium">
                                  {{ exp.position_title || 'Untitled Position' }}
                                </div>
                                <div class="text-grey-7">
                                  {{ formatDateRange(exp.work_date_from, exp.work_date_to) }}
                                </div>
                                <div class="text-primary">Duration: {{ exp.durationText }}</div>
                                <q-separator class="q-my-xs" />
                              </div>
                              <div class="text-weight-bold q-mt-sm">
                                Total Experience: {{ formatTotalExperience(totalExperienceMonths) }}
                              </div>
                            </div>
                          </div>
                        </q-tooltip>
                      </div>
                    </div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :rows="experienceWithDuration"
                        :columns="xExperienceCol"
                        row-key="id"
                        :pagination="{ rowsPerPage: 5 }"
                        wrap-cells
                      >
                        <template v-slot:body-cell-monthlySalary="props">
                          <q-td :props="props">
                            {{ formatSalary(props.row.monthly_salary) }}
                          </q-td>
                        </template>
                        <template v-slot:body-cell-duration="props">
                          <q-td :props="props" class="text-center">
                            <q-badge
                              :color="props.row.durationMonths > 0 ? 'positive' : 'grey'"
                              :label="props.row.durationText"
                              class="q-px-xs"
                            />
                          </q-td>
                        </template>
                        <template v-slot:no-data>
                          <div class="full-width row flex-center q-pa-md text-grey">
                            <q-icon name="info" size="24px" class="q-mr-sm" />
                            No experience records found
                          </div>
                        </template>
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>

                <div class="col-3 q-pa-sm">
                  <q-scroll-area style="height: 100%">
                    <div class="text-subtitle3 q-mb-md">Position Qualification Standard</div>
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
                    <q-input
                      v-model="experience_remark"
                      label="Remarks"
                      autogrow
                      outlined
                      dense
                      class="q-mt-md modern-input"
                      :readonly="isJobOccupied || evaluationLocked"
                      :bg-color="isJobOccupied || evaluationLocked ? 'grey-3' : 'white'"
                    />
                  </q-scroll-area>
                </div>
              </q-tab-panel>

              <!-- Training Panel -->
              <q-tab-panel name="training" class="row q-pa-none" style="display: flex">
                <div class="col-9 q-pa-sm" style="border-right: 1px solid #e0e0e0">
                  <q-scroll-area style="height: 100%">
                    <div class="row items-center justify-between q-mb-md">
                      <div class="text-subtitle3">Applicant Training</div>
                      <div class="row items-center q-gutter-sm">
                        <q-badge
                          color="primary"
                          class="q-px-sm q-py-xs"
                          :label="`Total Hours: ${totalTrainingHours}`"
                        />
                        <q-tooltip class="bg-white text-dark shadow-4">
                          <div class="q-pa-sm">
                            <div class="text-weight-bold q-mb-xs">Training Hours Breakdown:</div>
                            <div v-if="xTraining.length === 0" class="text-grey-6">
                              No training records found
                            </div>
                            <div v-else>
                              <div
                                v-for="(training, index) in xTraining"
                                :key="index"
                                class="text-caption q-mb-xs"
                              >
                                {{ training.training_title || 'Untitled Training' }}:
                                {{ parseTrainingHours(training.number_of_hours) }} hours
                              </div>
                              <q-separator class="q-my-xs" />
                              <div class="text-weight-bold">
                                Total: {{ totalTrainingHours }} hours
                              </div>
                            </div>
                          </div>
                        </q-tooltip>
                      </div>
                    </div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :rows="xTraining"
                        :columns="xTrainingCol"
                        row-key="id"
                        :pagination="{ rowsPerPage: 5 }"
                        wrap-cells
                      >
                        <template v-slot:body-cell-hours="props">
                          <q-td :props="props" class="text-center">
                            <q-badge
                              :color="
                                parseTrainingHours(props.row.number_of_hours) > 0
                                  ? 'positive'
                                  : 'grey'
                              "
                              :label="parseTrainingHours(props.row.number_of_hours)"
                            />
                          </q-td>
                        </template>
                        <template v-slot:no-data>
                          <div class="full-width row flex-center q-pa-md text-grey">
                            <q-icon name="info" size="24px" class="q-mr-sm" />
                            No training records found
                          </div>
                        </template>
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>

                <div class="col-3 q-pa-sm">
                  <q-scroll-area style="height: 100%">
                    <div class="text-subtitle3 q-mb-md">Position Qualification Standard</div>
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
                    <q-input
                      v-model="training_remark"
                      label="Remarks"
                      autogrow
                      outlined
                      dense
                      class="q-mt-md modern-input"
                      :readonly="isJobOccupied || evaluationLocked"
                      :bg-color="isJobOccupied || evaluationLocked ? 'grey-3' : 'white'"
                    />
                  </q-scroll-area>
                </div>
              </q-tab-panel>

              <!-- Eligibility Panel -->
              <q-tab-panel name="eligibility" class="row q-pa-none" style="display: flex">
                <div class="col-9 q-pa-sm" style="border-right: 1px solid #e0e0e0">
                  <q-scroll-area style="height: 100%">
                    <div class="text-subtitle3 q-mb-md">Applicant Eligibility</div>
                    <q-card class="q-ma-sm">
                      <q-table
                        :rows="xEligibility"
                        :columns="xEligibilityCol"
                        row-key="id"
                        :pagination="{ rowsPerPage: 5 }"
                        wrap-cells
                      >
                        <template v-slot:no-data>
                          <div class="full-width row flex-center q-pa-md text-grey">
                            <q-icon name="info" size="24px" class="q-mr-sm" />
                            No eligibility records found
                          </div>
                        </template>
                      </q-table>
                    </q-card>
                  </q-scroll-area>
                </div>

                <div class="col-3 q-pa-sm">
                  <q-scroll-area style="height: 100%">
                    <div class="text-subtitle3 q-mb-md">Position Qualification Standard</div>
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
                    <q-input
                      v-model="eligibility_remark"
                      label="Remarks"
                      autogrow
                      outlined
                      dense
                      class="q-mt-md modern-input"
                      :readonly="isJobOccupied || evaluationLocked"
                      :bg-color="isJobOccupied || evaluationLocked ? 'grey-3' : 'white'"
                    />
                  </q-scroll-area>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </q-card-section>

      <SupportingDocumentsModal
        v-model:show="showSupportingDocsModal"
        :applicant-name="applicantData?.name || 'Unknown Applicant'"
        :supporting-documents="supportingDocuments"
      />

      <!-- Footer Actions -->
      <q-card-section class="footer-actions bg-grey-2 q-py-sm">
        <div class="row justify-between items-center">
          <div class="row items-center">
            <!-- <q-btn
              flat
              dense
              :icon="showControlNo ? 'visibility_off' : 'visibility'"
              @click="showControlNo = !showControlNo"
              class="q-mr-sm"
            />
            <q-badge v-if="showControlNo" color="grey">
              Control No. {{ applicantData?.id || '0' }}
            </q-badge> -->
          </div>

          <!-- Only show qualification status selection if not plantilla, not evaluation locked, and job is not occupied -->
          <div
            v-if="!props.isPlantilla && !evaluationLocked && !isJobOccupied"
            class="column items-center"
          >
            <div class="text-caption text-grey-7 q-mb-xs">Evaluation Status</div>
            <div class="row justify-center q-gutter-md">
              <q-radio
                v-model="qualificationStatus"
                val="Qualified"
                label="Qualified"
                color="positive"
                :disable="evaluationLocked || isJobOccupied"
                class="radio-button"
              >
                <q-tooltip>Candidate meets all requirements</q-tooltip>
              </q-radio>
              <q-radio
                v-model="qualificationStatus"
                val="Unqualified"
                label="Unqualified"
                color="negative"
                :disable="evaluationLocked || isJobOccupied"
                class="radio-button"
              >
                <q-tooltip>Candidate doesn't meet requirements</q-tooltip>
              </q-radio>
            </div>
          </div>

          <!-- Show message when job is occupied -->
          <div v-if="isJobOccupied && !props.isPlantilla" class="column items-center">
            <div class="text-caption text-orange-8 q-mb-xs">Job Status</div>
            <q-badge color="orange" class="text-caption q-px-sm">
              <q-icon name="lock" class="q-mr-xs" />
              Position is Occupied - Evaluation Disabled
            </q-badge>
          </div>

          <div class="row justify-end">
            <!-- Only show submit button if not plantilla, not evaluation locked, and job is not occupied -->
            <q-btn
              v-if="!props.isPlantilla && !evaluationLocked && !isJobOccupied"
              label="SUBMIT EVALUATION"
              color="positive"
              @click="onSubmit"
              :disable="!qualificationStatus"
              class="q-mx-sm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <PDSModalApplicant v-model="showPDSModal" :applicant="applicantData" />
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { usePlantillaStore } from 'stores/plantillaStore';
  import PDSModalApplicant from './PDSModalApplicant.vue';
  import SupportingDocumentsModal from './SuppDocs.vue';

  const xEdu = ref([]);
  const xEligibility = ref([]);
  const xExperience = ref([]);
  const xTraining = ref([]);

  // PDS Modal
  const showPDSModal = ref(false);

  const showSupportingDocsModal = ref(false);
  const supportingDocuments = ref({
    training_images: [],
    education_images: [],
    eligibility_images: [],
    experience_images: [],
  });

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
    education: { type: Array, default: () => [] },
  });

  const emit = defineEmits(['update:show', 'view-pds', 'toggle-qualification', 'submit', 'close']);
  const localShow = ref(props.show);

  const tab = ref('education');
  const qualificationStatus = ref('');

  // Experience duration calculation functions
  const parseDate = (dateString) => {
    if (!dateString) return null;

    // Handle various date formats
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const calculateMonthsDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end) return 0;

    // Calculate the difference in months
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const dayDiff = end.getDate() - start.getDate();

    let totalMonths = yearDiff * 12 + monthDiff;

    // If the end day is before the start day, subtract one month
    if (dayDiff < 0) {
      totalMonths -= 1;
    }

    return Math.max(0, totalMonths);
  };

  const formatDuration = (months) => {
    if (months === 0) return '0 months';

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start && !end) return 'Date not specified';
    if (!start) return `Until ${end.toLocaleDateString()}`;
    if (!end) return `From ${start.toLocaleDateString()}`;

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const formatTotalExperience = (totalMonths) => {
    if (totalMonths === 0) return 'No Experience';
    return `Total: ${formatDuration(totalMonths)}`;
  };

  // Computed property for experience with duration
  const experienceWithDuration = computed(() => {
    if (!xExperience.value || xExperience.value.length === 0) {
      return [];
    }

    return xExperience.value.map((exp, index) => {
      const durationMonths = calculateMonthsDifference(exp.work_date_from, exp.work_date_to);
      const durationText = formatDuration(durationMonths);

      return {
        ...exp,
        id: exp.id || index,
        durationMonths,
        durationText,
      };
    });
  });

  // Computed property for total experience in months
  const totalExperienceMonths = computed(() => {
    return experienceWithDuration.value.reduce((total, exp) => {
      return total + (exp.durationMonths || 0);
    }, 0);
  });

  // Function to parse training hours from various formats
  const parseTrainingHours = (hours) => {
    if (!hours) return 0;

    // Convert to string for consistent handling
    const hoursStr = hours.toString().trim();

    // If it's already a number, return it
    if (!isNaN(hoursStr) && hoursStr !== '') {
      return parseInt(hoursStr) || 0;
    }

    // Try to extract numbers from strings like "40 hours", "40hrs", "40 hrs"
    const match = hoursStr.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return parseInt(match[1]) || 0;
    }

    return 0;
  };

  // Computed property for total training hours
  const totalTrainingHours = computed(() => {
    if (!xTraining.value || xTraining.value.length === 0) {
      return 0;
    }

    return xTraining.value.reduce((total, training) => {
      const hours = parseTrainingHours(training.number_of_hours);
      return total + hours;
    }, 0);
  });

  // Computed property to check if job is occupied
  const isJobOccupied = computed(() => {
    return (
      props.applicantData?.Jobstatus === 'Occupied' || props.applicantData?.Jobstatus === 'occupied'
    );
  });

  // Helper function to extract personal info from multiple possible structures
  const getPersonalInfo = (applicantData) => {
    if (!applicantData) return {};

    // Check all possible paths to personal info
    const personalInfo =
      applicantData.n_personal_info ||
      applicantData.nPersonalInfo ||
      (applicantData.firstname ? applicantData : null) ||
      {};

    return personalInfo;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ELECTIVE':
        return 'bg-blue';
      case 'APPOINTED':
        return 'bg-purple';
      case 'CO-TERMINOUS':
        return 'bg-brown';
      case 'REGULAR':
        return 'bg-green';
      case 'TEMPORARY':
        return 'bg-yellow text-black';
      case 'CASUAL':
        return 'bg-grey-4';
      case 'CONTRACTUAL':
        return 'bg-light-blue';
      case 'HONORARIUM':
        return 'bg-black';
      default:
        return 'bg-grey';
    }
  };

  const formattedEducation = computed(
    () =>
      xEdu.value?.map((e) => ({
        level: e.level || '',
        school_name: e.school_name || '',
        degree: e.degree || '',
        attendance_from: e.attendance_from || '',
        attendance_to: e.attendance_to || '',
        highest_units: e.highest_units || '',
        year_graduated: e.year_graduated || '',
        scholarship: e.scholarship || '',
      })) ?? [],
  );

  const formatSalary = (val) => {
    if (!val) return '';
    return parseFloat(val).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
  };

  const xEduCol = [
    {
      name: 'level',
      label: 'Level',
      align: 'left',
      field: 'level',
      sortable: true,
    },
    {
      name: 'school_name',
      label: 'Name of School',
      align: 'left',
      field: 'school_name',
    },
    {
      name: 'course',
      label: 'Degree/Course',
      align: 'left',
      field: 'degree',
    },
    {
      name: 'fromYear',
      label: 'From',
      align: 'left',
      field: 'attendance_from',
    },
    {
      name: 'toYear',
      label: 'To',
      align: 'left',
      field: 'attendance_to',
    },
    {
      name: 'highestLevel',
      label: 'Units Earned',
      align: 'left',
      field: 'highest_units',
    },
    {
      name: 'yearGraduated',
      label: 'Year Graduated',
      align: 'left',
      field: 'year_graduated',
    },
    {
      name: 'honors',
      label: 'Honors',
      align: 'left',
      field: 'scholarship',
    },
  ];

  const xEligibilityCol = [
    {
      name: 'eligibility',
      label: 'Eligibility',
      field: 'eligibility',
      sortable: true,
      align: 'left',
    },
    {
      name: 'rating',
      label: 'Rating',
      field: 'rating',
      sortable: true,
      align: 'center',
    },
    {
      name: 'examDate',
      label: 'Date of Exam',
      field: 'date_of_examination',
      sortable: true,
      align: 'left',
    },
    {
      name: 'examPlace',
      label: 'Place',
      field: 'place_of_examination',
      sortable: true,
      align: 'left',
    },
    {
      name: 'licenseNumber',
      label: 'License #',
      field: 'license_number',
      sortable: true,
      align: 'left',
    },
    {
      name: 'validityDate',
      label: 'Validity',
      field: 'date_of_validity',
      sortable: true,
      align: 'left',
    },
  ];

  const xExperienceCol = [
    {
      name: 'fromDate',
      label: 'From',
      field: 'work_date_from',
      align: 'center',
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'work_date_to',
      align: 'center',
    },
    {
      name: 'positionTitle',
      label: 'Position Title',
      field: 'position_title',
      align: 'left',
    },
    {
      name: 'department',
      label: 'Department',
      field: 'department',
      align: 'left',
    },
    {
      name: 'monthlySalary',
      label: 'Monthly Salary',
      field: 'monthly_salary',
      align: 'right',
    },
    {
      name: 'salaryGrade',
      label: 'SG',
      field: 'salary_grade',
      align: 'center',
    },
    {
      name: 'appointmentStatus',
      label: 'Status',
      field: 'status_of_appointment',
      align: 'left',
    },
    {
      name: 'govtService',
      label: "Gov't",
      field: 'government_service',
      align: 'center',
    },
    {
      name: 'duration',
      label: 'Duration',
      field: 'durationText',
      align: 'center',
    },
  ];

  const xTrainingCol = [
    {
      name: 'title',
      label: 'Title',
      field: 'training_title',
      align: 'left',
    },
    {
      name: 'fromDate',
      label: 'From',
      field: 'inclusive_date_from',
      align: 'center',
    },
    {
      name: 'toDate',
      label: 'To',
      field: 'inclusive_date_to',
      align: 'center',
    },
    {
      name: 'hours',
      label: 'Hours',
      field: 'number_of_hours',
      align: 'center',
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
      field: 'conducted_by',
      align: 'left',
    },
  ];

  const usePlantilla = usePlantillaStore();
  // const showControlNo = ref(false);

  const positionQS = ref([]);

  const educationCol = ref([
    {
      name: 'Education',
      label: 'Education',
      align: 'left',
      field: 'Education',
    },
  ]);
  const ExperienceCol = ref([
    {
      name: 'Experience',
      label: 'Experience',
      align: 'left',
      field: 'Experience',
    },
  ]);
  const trainingCol = ref([
    {
      name: 'Training',
      label: 'Training',
      align: 'left',
      field: 'Training',
    },
  ]);
  const eligibilityCol = ref([
    {
      name: 'Eligibility',
      label: 'Eligibility',
      align: 'left',
      field: 'Eligibility',
    },
  ]);

  const education_remark = ref('');
  const experience_remark = ref('');
  const training_remark = ref('');
  const eligibility_remark = ref('');

  const evaluationLocked = computed(() => props.isSubmitted);

  const statusColor = computed(() => {
    switch (qualificationStatus.value) {
      case 'Qualified':
        return 'positive';
      case 'Unqualified':
        return 'negative';
      default:
        return 'grey';
    }
  });

  const overallStatus = computed(() => {
    switch (qualificationStatus.value) {
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

  const showSupportingDocs = () => {
    showSupportingDocsModal.value = true;
  };

  const onModalShow = async () => {
    tab.value = 'education';

    try {
      console.log('Applicant Data:', props.applicantData);

      // Load QS data
      if (props.applicantData?.PositionID) {
        await usePlantilla.fetchQsData(props.applicantData.PositionID);
        positionQS.value = usePlantilla.qsData || [];
      }

      // Get personal info from various possible data structures
      const personalInfo = getPersonalInfo(props.applicantData);
      console.log('Extracted Personal Info:', personalInfo);

      // Set education data
      if (props.education && props.education.length > 0) {
        xEdu.value = props.education;
      } else if (personalInfo?.education && personalInfo.education.length > 0) {
        xEdu.value = personalInfo.education;
      } else if (props.applicantData?.education && props.applicantData.education.length > 0) {
        xEdu.value = props.applicantData.education;
      } else {
        xEdu.value = [];
      }

      // Set other PDS data
      xEligibility.value = personalInfo?.eligibility || personalInfo?.eligibity || [];
      xExperience.value = personalInfo?.work_experience || [];
      xTraining.value = personalInfo?.training || [];

      // Set supporting documents from applicant data
      if (props.applicantData) {
        supportingDocuments.value = {
          training_images: props.applicantData.training_images || [],
          education_images: props.applicantData.education_images || [],
          eligibility_images: props.applicantData.eligibility_images || [],
          experience_images: props.applicantData.experience_images || [],
        };
      }

      // Set qualification status if available
      if (
        props.applicantData?.status === 'Qualified' ||
        props.applicantData?.status === 'Unqualified'
      ) {
        qualificationStatus.value = props.applicantData.status;
      } else {
        qualificationStatus.value = '';
      }

      // Set remarks
      education_remark.value = props.applicantData?.education_remark || '';
      experience_remark.value = props.applicantData?.experience_remark || '';
      training_remark.value = props.applicantData?.training_remark || '';
      eligibility_remark.value = props.applicantData?.eligibility_remark || '';
    } catch (error) {
      console.error('Error in onModalShow:', error);
    }
  };

  const onClose = () => {
    emit('close');
    positionQS.value = [];
    xEdu.value = [];
    xEligibility.value = [];
    xExperience.value = [];
    xTraining.value = [];
    qualificationStatus.value = '';
  };

  const onViewPDS = () => {
    // Show PDS Modal
    showPDSModal.value = true;
    // Also emit the event for parent components that may need it
    emit('view-pds');
  };

  watch(qualificationStatus, (newStatus) => {
    emit('toggle-qualification', newStatus);
  });

  const onSubmit = () => {
    if (!evaluationLocked.value && qualificationStatus.value && !isJobOccupied.value) {
      emit('submit', {
        status: qualificationStatus.value,
        id: props.applicantData?.id,
        education_remark: education_remark.value,
        experience_remark: experience_remark.value,
        training_remark: training_remark.value,
        eligibility_remark: eligibility_remark.value,
      });
    }
  };
</script>

<style scoped>
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

  :deep(.q-table) {
    font-size: 9pt !important;

    .q-table__top,
    .q-table__bottom,
    .q-td,
    .q-th {
      font-size: 8pt !important;
    }

    tbody tr td {
      font-size: 8pt !important;
    }

    thead tr th {
      font-size: 8pt !important;
    }
  }

  .footer-actions {
    flex: 0 0 auto;
  }

  .full-height {
    height: 100%;
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

  .text-negative {
    color: var(--q-negative);
  }

  .q-tab {
    letter-spacing: 0.5px;
  }

  .modern-input {
    :deep(.q-field__control) {
      background-color: #f9f9f9;
    }
  }

  .modern-input[readonly] {
    :deep(.q-field__control) {
      background-color: #e0e0e0;
    }
  }

  .radio-button {
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .q-radio__label {
      margin-left: 8px;
      font-weight: 500;
    }
  }
</style>
