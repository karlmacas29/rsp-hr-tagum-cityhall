<template>
  <q-dialog v-model="localShow" persistent>
    <q-card class="qualification-modal" style="width: 1200px; max-width: 95vw">
      <!-- Header Section -->
      <q-card-section class="row justify-between header text-black q-pa-md">
        <div>
          <div class="text-h5 text-bold">Qualification Standard</div>
          <div class="text-subtitle1">Application Information</div>
        </div>
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" @click="onClose" />
      </q-card-section>

      <!-- Applicant View -->
      <div class="row q-pa-md no-wrap" style="min-height: 550px">
        <!-- Left Card (Applicant Info) -->
        <q-card class="col-3 q-mr-md">
          <q-card-section class="column items-center q-pa-md">
            <q-avatar size="120px">
              <img :src="applicantData.photo || '/img/default-avatar.png'" />
            </q-avatar>

            <div class="text-h6 text-center q-mb-sm">{{ applicantData.Name1 }}</div>
            <q-badge :color="statusColor" class="q-mb-md">
              {{ applicantData.status }}
              <q-icon v-if="isSubmitted" name="lock" class="q-ml-xs" />
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
        <q-card class="col">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey-8"
            active-color="primary"
            indicator-color="primary"
            align="left"
          >
            <q-tab name="education" label="Education" />
            <q-tab name="experience" label="Experience" />
            <q-tab name="training" label="Training" />
            <q-tab name="eligibility" label="Eligibility" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" class="q-pa-none">
            <!-- Education Panel -->
            <q-tab-panel name="education">
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
                  <tr v-for="(edu, index) in applicantData.education" :key="'edu-'+index">
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
            <q-tab-panel name="experience">
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
                  <tr v-for="(exp, index) in applicantData.experience" :key="'exp-'+index">
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
            <q-tab-panel name="training">
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
                  <tr v-for="(train, index) in applicantData.training" :key="'train-'+index">
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
            <q-tab-panel name="eligibility">
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
                  <tr v-for="(elig, index) in applicantData.eligibility" :key="'elig-'+index">
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

      <!-- Footer Actions -->
      <q-card-actions align="right" class="q-px-md q-py-md">
        <q-btn
          label="View PDS"
          color="primary"
          outline
          @click="onViewPDS"
          class="q-mr-sm"
        />
        <q-btn
          :label="applicantData.status === 'Qualified' ? 'Mark Unqualified' : 'Mark Qualified'"
          :color="applicantData.status === 'Qualified' ? 'negative' : 'positive'"
          @click="toggleQualificationStatus"
          :disable="isSubmitted"
        />
        <q-btn
          label="Submit Evaluation"
          color="positive"
          @click="onSubmit"
          :disable="isSubmitted || applicantData.status === 'Pending'"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  variant: {
    type: String,
    default: 'employee',
    validator: (value) => ['employee', 'applicant'].includes(value)
  },
  applicantData: Object,
  positionRequirements: Object,
  isSubmitted: Boolean
})

const emit = defineEmits(['update:show', 'view-pds', 'toggle-qualification', 'submit', 'close'])

const localShow = ref(props.show)
const tab = ref('education')

const statusColor = computed(() => {
  switch (props.applicantData.status) {
    case 'Qualified': return 'positive'
    case 'Pending': return 'warning'
    case 'Unqualified': return 'negative'
    default: return 'grey'
  }
})

const overallStatus = computed(() => {
  return props.applicantData.status === 'Qualified' ? 'Meets Requirements' : 'Under Review'
})

watch(() => props.show, (newVal) => {
  localShow.value = newVal
})

watch(localShow, (newVal) => {
  emit('update:show', newVal)
})

const onClose = () => emit('close')
const onViewPDS = () => emit('view-pds')
const onSubmit = () => {
  if (!props.isSubmitted && props.applicantData.status !== 'Pending') {
    emit('submit')
  }
}
const toggleQualificationStatus = () => {
  if (!props.isSubmitted) {
    const newStatus = props.applicantData.status === 'Qualified' ? 'Unqualified' : 'Qualified'
    emit('toggle-qualification', newStatus)
  }
}
</script>

<style scoped lang="scss">
.qualification-modal {
  border-radius: 8px;
  overflow: hidden;
}

.header {
  position: relative;
  background-color: #f5f5f5;
}

.close-btn {
  margin: 8px;
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
  background-color: #fefefe;
}

.qualification-table td,
.qualification-table th {
  padding: 12px 16px;
}

.q-list--bordered {
  border-radius: 8px;
}

.q-tab-panels {
  background: none;
  border-radius: 0;
}

.q-markup-table {
  width: 100%;
}

.q-markup-table th,
.q-markup-table td {
  padding: 8px 12px;
}

.q-markup-table thead tr {
  background-color: #f5f5f5;
}
</style>
