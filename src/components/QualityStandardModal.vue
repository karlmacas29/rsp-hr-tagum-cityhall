<template>
  <q-dialog v-model="localShow" persistent @show="onModalShow">
    <q-card
      class="qualification-modal"
      style="
        width: 1050px;
        max-width: 95vw;
        height: 85vh;
        max-height: 95vh;
        display: flex;
        flex-direction: column;
      "
    >
      <!-- Header Section -->
      <q-card-section class="row justify-between header text-black q-pa-md">
        <div>
          <div class="text-h5 text-bold">Qualification Standard</div>
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
              <div class="text-h6 text-center q-mb-sm">{{ applicantData?.name || 'John Doe' }}</div>
              <q-badge :color="statusColor" class="q-mb-md">
                {{ applicantData.status }}
                <q-icon v-if="evaluationLocked" name="lock" class="q-ml-xs" />
              </q-badge>

              <div class="full-width">
                <div class="text-center q-mb-sm">
                  <div class="text-caption text-grey-7">Applied Position</div>
                  <div class="text-weight-medium">{{ applicantData.position }}</div>
                </div>

                <q-separator class="q-my-md" />

                <div class="text-center q-mb-sm">
                  <div class="text-caption text-grey-7">Application Date</div>
                  <div class="text-weight-medium">{{ applicantData.applicationDate }}</div>
                </div>

                <q-separator class="q-my-md" />

                <div class="text-center">
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

            <q-separator />

            <q-tab-panels v-model="tab" class="q-pa-none" style="flex: 1; overflow: auto">
              <!-- Education Panel -->
              <q-tab-panel name="education" class="q-pa-md">
                <div class="text-h6 q-mb-md">Applicant Education</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Degree</th>
                      <th class="text-left">Institution</th>
                      <th class="text-left">Year Graduated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(edu, index) in applicantData.education" :key="'edu-' + index">
                      <td>{{ edu.degree }}</td>
                      <td>{{ edu.institution }}</td>
                      <td>{{ edu.year }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>

                <div class="text-h6 q-mt-md q-mb-md">Position Qualification Standard</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Required Degree</th>
                      <th class="text-left">Preferred Qualification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ positionRequirements.education }}</td>
                      <td>{{ positionRequirements.preferredEducation }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>

              <!-- Experience Panel -->
              <q-tab-panel name="experience" class="q-pa-md">
                <div class="text-h6 q-mb-md">Applicant Experience</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Position</th>
                      <th class="text-left">Organization</th>
                      <th class="text-left">Years</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(exp, index) in applicantData.experience" :key="'exp-' + index">
                      <td>{{ exp.position }}</td>
                      <td>{{ exp.organization }}</td>
                      <td>{{ exp.years }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>

                <div class="text-h6 q-mt-md q-mb-md">Position Qualification Standard</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Required Experience</th>
                      <th class="text-left">Preferred Experience</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ positionRequirements.experience }}</td>
                      <td>{{ positionRequirements.preferredExperience }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>

              <!-- Training Panel -->
              <q-tab-panel name="training" class="q-pa-md">
                <div class="text-h6 q-mb-md">Applicant Training</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Training Program</th>
                      <th class="text-left">Provider</th>
                      <th class="text-left">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(train, index) in applicantData.training" :key="'train-' + index">
                      <td>{{ train.program }}</td>
                      <td>{{ train.provider }}</td>
                      <td>{{ train.hours }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>

                <div class="text-h6 q-mt-md q-mb-md">Position Qualification Standard</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Required Training</th>
                      <th class="text-left">Preferred Training</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ positionRequirements.training }}</td>
                      <td>{{ positionRequirements.preferredTraining }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>

              <!-- Eligibility Panel -->
              <q-tab-panel name="eligibility" class="q-pa-md">
                <div class="text-h6 q-mb-md">Applicant Eligibility</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Certification</th>
                      <th class="text-left">Issuing Authority</th>
                      <th class="text-left">Year Obtained</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(elig, index) in applicantData.eligibility" :key="'elig-' + index">
                      <td>{{ elig.certification }}</td>
                      <td>{{ elig.authority }}</td>
                      <td>{{ elig.year }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>

                <div class="text-h6 q-mt-md q-mb-md">Position Qualification Standard</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Required Eligibility</th>
                      <th class="text-left">Preferred Certification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ positionRequirements.eligibility }}</td>
                      <td>{{ positionRequirements.preferredCertification }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </q-card-section>

      <!-- Footer Actions - Updated to conditionally show buttons -->
      <q-card-section class="footer-actions bg-grey-2 q-py-md">
        <div class="row justify-end">
          <q-btn label="VIEW PDS" color="primary" outline @click="onViewPDS" class="q-mx-sm" />
          <!-- Only show these buttons if evaluation is not locked -->
          <template v-if="!evaluationLocked">
            <q-btn
              :label="applicantData.status === 'Qualified' ? 'MARK UNQUALIFIED' : 'MARK QUALIFIED'"
              :color="applicantData.status === 'Qualified' ? 'negative' : 'positive'"
              @click="toggleQualificationStatus"
              class="q-mx-sm"
            />
            <q-btn
              label="SUBMIT EVALUATION"
              color="positive"
              @click="onSubmit"
              :disable="applicantData.status === 'Pending'"
              class="q-mx-sm"
            />
          </template>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';

  const props = defineProps({
    show: Boolean,
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
        return 'Under Review';
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

  const onModalShow = () => {
    // Reset to education tab when modal opens
    tab.value = 'education';
  };

  const onClose = () => emit('close');
  const onViewPDS = () => emit('view-pds');
  const onSubmit = () => {
    if (!props.isSubmitted && props.applicantData.status !== 'Pending') {
      emit('submit');
    }
  };
  const toggleQualificationStatus = () => {
    if (!props.isSubmitted) {
      const newStatus = props.applicantData.status === 'Qualified' ? 'Unqualified' : 'Qualified';
      emit('toggle-qualification', newStatus);
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
    flex: 0 0 auto;
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
  }
</style>
