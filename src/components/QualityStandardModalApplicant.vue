<template>
  <q-dialog v-model="localShow" persistent @show="onModalShow">
    <q-card
      class="qualification-modal"
      style="width: 1200px; max-width: 98vw; height: 90vh; display: flex; flex-direction: column"
    >
      <!-- Sticky Applicant Header -->
      <q-card-section class="row items-center header q-px-md q-py-sm">
        <q-img
          :src="applicantData?.image_url || 'https://placehold.co/100'"
          class="bg-grey-4"
          style="width: 90px; height: 90px; border-radius: 10px; margin-right: 24px"
          alt="Applicant Photo"
        />
        <div class="col">
          <div class="applicant-name">
            {{ applicantData?.name || 'Please wait' }}
          </div>
          <div class="applicant-info">
            {{ applicantData?.position || 'Office of the ...' }}
          </div>
          <div class="applicant-info">
            Applied: {{ applicantData?.appliedDate || '#### ##, ####' }}
          </div>
          <q-btn
            label="VIEW PDS"
            color="primary"
            rounded
            @click="onViewPDS"
            class="view-pds-btn"
            v-if="true"
          />
        </div>
        <div class="col-auto">
          <q-btn icon="close" flat round dense class="close-btn q-ml-md" @click="onClose" />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Scrollable Content Area -->
      <div class="content-wrapper">
        <!-- Tabs for each QS area -->
        <div>
          <div class="modern-tabs">
            <div
              v-for="tabName in ['education', 'experience', 'training', 'eligibility']"
              :key="tabName"
              @click="tab = tabName"
              class="modern-tab"
              :class="{ 'active-tab': tab === tabName }"
            >
              {{ tabName.toUpperCase() }}
            </div>
          </div>

          <q-separator />

          <q-tab-panels v-model="tab" class="q-pa-md scrollable-panels">
            <!-- Education Tab -->
            <q-tab-panel name="education" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <!-- Applicant Data -->
                <div class="col-9">
                  <div class="section-title">Applicant Education</div>
                  <q-card flat class="modern-table-card">
                    <q-table
                      :rows="formattedEducation"
                      :columns="xEduCol"
                      row-key="id"
                      wrap-cells
                      :hide-header="false"
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body="props">
                        <q-tr :props="props" class="modern-table-row">
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-cell"
                          >
                            {{ props.row[col.field] }}
                          </q-td>
                        </q-tr>
                      </template>
                      <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                          <q-icon name="info" size="18px" class="q-mr-sm" />
                          No education records found
                        </div>
                      </template>
                    </q-table>
                  </q-card>
                </div>
                <!-- QS Data -->
                <div class="col-3">
                  <div class="section-title">Position Qualification Standard</div>
                  <q-card flat class="modern-table-card">
                    <q-table
                      :rows="positionQS"
                      :columns="educationCol"
                      :loading="usePlantilla.qsLoad"
                      row-key="id"
                      dense
                      flat
                      hide-bottom
                      class="modern-table"
                      wrap-cells
                      :hide-header="false"
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body-cell-Education="props">
                        <q-td :props="props" class="standard-cell">
                          {{ props.row.Education }}
                        </q-td>
                      </template>
                      <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                          <q-icon name="info" size="18px" class="q-mr-sm" />
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
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- Experience Tab -->
            <q-tab-panel name="experience" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-9">
                  <div class="section-title">Applicant Experience</div>
                  <q-card flat class="modern-table-card">
                    <q-table
                      :rows="xExperience"
                      :columns="xExperienceCol"
                      row-key="id"
                      class="modern-table"
                      wrap-cells
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body="props">
                        <q-tr :props="props" class="modern-table-row">
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-cell"
                          >
                            <template v-if="col.name === 'monthlySalary'">
                              {{ formatSalary(props.row[col.field]) }}
                            </template>
                            <template v-else>
                              {{ props.row[col.field] }}
                            </template>
                          </q-td>
                        </q-tr>
                      </template>
                      <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                          <q-icon name="info" size="18px" class="q-mr-sm" />
                          No experience records found
                        </div>
                      </template>
                    </q-table>
                  </q-card>
                </div>
                <div class="col-3">
                  <div class="section-title">Position Qualification Standard</div>
                  <q-card flat class="modern-table-card">
                    <q-table
                      :rows="positionQS"
                      :columns="ExperienceCol"
                      dense
                      flat
                      hide-bottom
                      row-key="id"
                      class="modern-table"
                      wrap-cells
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body-cell-Experience="props">
                        <q-td :props="props" class="standard-cell">
                          {{ props.row.Experience }}
                        </q-td>
                      </template>
                      <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                          <q-icon name="info" size="18px" class="q-mr-sm" />
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
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- Training Tab -->
            <q-tab-panel name="training" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-9">
                  <div class="section-title">Applicant Training</div>
                  <q-card flat class="modern-table-card">
                    <q-table
                      :rows="xTraining"
                      :columns="xTrainingCol"
                      row-key="id"
                      class="modern-table"
                      wrap-cells
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body="props">
                        <q-tr :props="props" class="modern-table-row">
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-cell"
                          >
                            {{ props.row[col.field] }}
                          </q-td>
                        </q-tr>
                      </template>
                      <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                          <q-icon name="info" size="18px" class="q-mr-sm" />
                          No training records found
                        </div>
                      </template>
                    </q-table>
                  </q-card>
                </div>
                <div class="col-3">
                  <div class="section-title">Position Qualification Standard</div>
                  <q-card flat class="modern-table-card">
                    <q-table
                      :rows="positionQS"
                      :columns="trainingCol"
                      dense
                      flat
                      hide-bottom
                      row-key="id"
                      class="modern-table"
                      wrap-cells
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body-cell-Training="props">
                        <q-td :props="props" class="standard-cell">
                          {{ props.row.Training }}
                        </q-td>
                      </template>
                      <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                          <q-icon name="info" size="18px" class="q-mr-sm" />
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
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- Eligibility Tab -->
            <q-tab-panel name="eligibility" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-9">
                  <div class="section-title">Applicant Eligibility</div>
                  <q-card flat class="modern-table-card">
                    <q-table
                      :rows="xEligibility"
                      :columns="xEligibilityCol"
                      row-key="id"
                      class="modern-table"
                      :pagination="{ rowsPerPage: 5 }"
                      wrap-cells
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body="props">
                        <q-tr :props="props" class="modern-table-row">
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-cell"
                          >
                            {{ props.row[col.field] }}
                          </q-td>
                        </q-tr>
                      </template>
                      <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                          <q-icon name="info" size="18px" class="q-mr-sm" />
                          No eligibility records found
                        </div>
                      </template>
                    </q-table>
                  </q-card>
                </div>
                <div class="col-3">
                  <div class="section-title">Position Qualification Standard</div>
                  <q-card flat class="modern-table-card">
                    <q-table
                      :rows="positionQS"
                      :columns="eligibilityCol"
                      dense
                      flat
                      hide-bottom
                      row-key="id"
                      class="modern-table"
                      wrap-cells
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="modern-table-header"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body-cell-Eligibility="props">
                        <q-td :props="props" class="standard-cell">
                          {{ props.row.Eligibility }}
                        </q-td>
                      </template>
                      <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                          <q-icon name="info" size="18px" class="q-mr-sm" />
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
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>

      <!-- Sticky Footer Actions -->
      <q-separator />
      <q-card-section class="footer-actions bg-grey-2 q-py-sm">
        <div class="row justify-between items-center">
          <div>
            <q-btn
              flat
              dense
              :icon="showControlNo ? 'visibility_off' : 'visibility'"
              @click="showControlNo = !showControlNo"
              class="q-mr-sm"
            />
            <q-badge v-if="showControlNo" color="grey-7" class="control-badge">
              Control No. {{ applicantData?.id || '0' }}
            </q-badge>
          </div>
          <div v-if="!props.isPlantilla && !evaluationLocked">
            <div class="status-label">Evaluation Status</div>
            <q-radio
              v-model="qualificationStatus"
              val="Qualified"
              label="Qualified"
              color="green"
              class="qualification-radio"
            />
            <q-radio
              v-model="qualificationStatus"
              val="Unqualified"
              label="Unqualified"
              color="red"
              class="qualification-radio"
            />
          </div>
          <q-btn
            v-if="!props.isPlantilla && !evaluationLocked"
            label="SUBMIT"
            color="primary"
            @click="onSubmit"
            :disable="!qualificationStatus"
            class="q-mx-sm submit-btn"
          />
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

  const xEdu = ref([]);
  const xEligibility = ref([]);
  const xExperience = ref([]);
  const xTraining = ref([]);

  // PDS Modal
  const showPDSModal = ref(false);

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
  const showControlNo = ref(false);

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
    if (!evaluationLocked.value && qualificationStatus.value) {
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

<style scoped lang="scss">
  .qualification-modal {
    border-radius: 8px;
    background-color: #ffffff;
  }

  .header {
    background-color: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 10;
    flex-shrink: 0;
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .scrollable-panels {
    overflow-y: auto;
    flex: 1;
  }

  .footer-actions {
    background-color: #f5f5f5;
    position: sticky;
    bottom: 0;
    z-index: 10;
    flex-shrink: 0;
    border-top: 1px solid #eee;
  }

  .applicant-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }

  .view-pds-btn {
    font-size: 8px;
    padding: 4px 8px;
    height: 20px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .applicant-info {
    font-size: 10px;
    color: #666;
    margin-bottom: 2px;
  }

  .status-badge {
    font-size: 9px;
    font-weight: 500;
  }

  /* Modern Tabs Styling */
  .modern-tabs {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    background-color: #fff;
    flex-shrink: 0;
  }

  .modern-tab {
    padding: 12px 24px;
    cursor: pointer;
    color: #666;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    letter-spacing: 0.5px;

    &:hover {
      background-color: #f9f9f9;
    }

    &.active-tab {
      color: #4caf50;
      border-bottom: 3px solid #4caf50;
    }
  }

  /* Section titles */
  .section-title {
    font-size: 14px;
    font-weight: 400;
    color: #333;
    margin: 0 0 12px 0;
  }

  /* Modern Table Styling */
  .modern-table-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
    border-radius: 8px;
    border: 2px solid #eee !important;
    margin-bottom: 20px;
  }

  .modern-table {
    border-spacing: 0;
    width: 100%;
  }

  .modern-table-header {
    background-color: #fff !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    color: #333 !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid #eee;
  }

  .modern-table-row {
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9f9f9;
    }

    &:nth-child(even) {
      background-color: #fafafa;
    }
  }

  .modern-table-cell {
    padding: 12px 16px !important;
    font-size: 11px !important;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
  }

  .standard-cell {
    padding: 16px !important;
    font-size: 13px !important;
    line-height: 1.5;
  }

  /* Input styling */
  .modern-input {
    margin-top: 20px;

    :deep(.q-field__control) {
      background-color: #f9f9f9;
    }
  }

  .status-label {
    font-size: 10px;
    color: #666;
    margin-bottom: 3px;
  }

  .qualification-radio {
    font-size: 11px;
    margin-right: 16px;
  }

  .control-badge {
    font-size: 9px;
  }

  .submit-btn {
    font-size: 11px;
    font-weight: 500;
  }

  .close-btn {
    margin: 0;
  }

  /* Responsive fixes */
  @media (max-width: 1024px) {
    .modern-tab {
      padding: 10px 16px;
    }
  }
</style>
