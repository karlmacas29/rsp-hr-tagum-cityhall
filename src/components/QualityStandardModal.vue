<template>
  <q-dialog v-model="localShow" persistent>
    <q-card class="qualification-modal" style="width: 1200px; max-width: 95vw">
      <!-- Header Section -->
      <q-card-section class="row justify-between header text-black q-pa-md">
        <div>
          <div class="text-h5 text-bold">Qualification Standard</div>
          <div class="text-subtitle1">Application Information</div>
        </div>
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
      </q-card-section>

      <!-- Employee View -->
      <template v-if="variant === 'employee'">
        <div class="row q-pa-md no-wrap" style="min-height: 550px">
          <!-- Left Card (Employee Info) -->
          <q-card class="col-3 q-mr-md">
            <q-card-section class="column items-center q-pa-md">
              <img src="/img/examplePr.png" style="border-radius: 100px" alt="" width="150" height="150" />

              <div class="text-h6 text-center q-mb-sm">{{ employeeName }}</div>
              <q-badge color="positive" class="q-mb-md">Active</q-badge>

              <div class="full-width">
                <div class="text-center q-mb-sm">
                  <div class="text-caption text-grey-7">Current Position</div>
                  <div class="text-weight-medium">{{ currentPosition }}</div>
                </div>

                <q-separator class="q-my-md" />

                <div class="text-center q-mb-sm">
                  <div class="text-caption text-grey-7">Employment Type</div>
                  <div class="text-weight-medium">
                    <q-icon name="check" color="positive" size="sm" />
                    {{ employmentType }}
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="text-center">
                  <div class="text-caption text-grey-7">Application Status</div>
                  <div class="text-weight-medium text-positive">Qualified</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Right Card (Tabs) -->
          <q-card class="col">
            <q-tabs v-model="tab" dense class="text-grey-8" active-color="primary" indicator-color="primary"
              align="left">
              <q-tab name="education" label="Education" />
              <q-tab name="experience" label="Experience" />
              <q-tab name="training" label="Training" />
              <q-tab name="eligibility" label="Eligibility" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" class="q-pa-none">
              <!-- Education Tab -->
              <q-tab-panel name="education">
                <div class="text-h6 q-mb-md">Employee Education</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Degree</th>
                      <th class="text-left">Institution</th>
                      <th class="text-left">Year Graduated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(edu, index) in educationData" :key="'edu-' + index">
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
                      <td>{{ requiredDegree }}</td>
                      <td>{{ preferredQualification }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>

              <!-- Experience Tab -->
              <q-tab-panel name="experience">
                <div class="text-h6 q-mb-md">Employee Experience</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Position</th>
                      <th class="text-left">Organization</th>
                      <th class="text-left">Years</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(exp, index) in experienceData" :key="'exp-' + index">
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
                      <td>{{ requiredExperience }}</td>
                      <td>{{ preferredExperience }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>

              <!-- Training Tab -->
              <q-tab-panel name="training">
                <div class="text-h6 q-mb-md">Employee Training</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Training Program</th>
                      <th class="text-left">Provider</th>
                      <th class="text-left">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(train, index) in trainingData" :key="'train-' + index">
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
                      <td>{{ requiredTraining }}</td>
                      <td>{{ preferredTraining }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>

              <!-- Eligibility Tab -->
              <q-tab-panel name="eligibility">
                <div class="text-h6 q-mb-md">Employee Eligibility</div>
                <q-markup-table flat bordered class="qualification-table">
                  <thead>
                    <tr>
                      <th class="text-left">Certification</th>
                      <th class="text-left">Issuing Authority</th>
                      <th class="text-left">Year Obtained</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(elig, index) in eligibilityData" :key="'elig-' + index">
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
                      <td>{{ requiredEligibility }}</td>
                      <td>{{ preferredCertification }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </template>

      <!-- Applicant View -->
      <template v-else>
        <div class="row q-pa-md no-wrap" style="min-height: 400px">
          <q-card class="col-12">
            <q-card-section>
              <div class="text-h4 q-mb-md">{{ applicantName }}</div>

              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <div class="text-subtitle1">Application Details</div>
                  <q-list dense bordered>
                    <q-item>
                      <q-item-section>Applied Position:</q-item-section>
                      <q-item-section side>{{ appliedPosition }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Status:</q-item-section>
                      <q-item-section side>
                        <q-badge :color="applicationStatus === 'Qualified' ? 'positive' : 'warning'">
                          {{ applicationStatus }}
                        </q-badge>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div class="col-6">
                  <div class="text-subtitle1">Qualifications</div>
                  <q-list dense bordered>
                    <q-item v-for="(qual, index) in qualifications" :key="index">
                      <q-item-section>{{ qual.name }}</q-item-section>
                      <q-item-section side>
                        <q-icon :name="qual.met ? 'check' : 'close'" :color="qual.met ? 'positive' : 'negative'" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <!-- Footer Actions -->
      <q-card-actions align="right" class="q-px-md q-py-md">
        <template v-if="variant === 'employee'">
          <q-btn label="UPDATE" color="primary" @click="onUpdate" />
        </template>
        <template v-else>
          <q-btn label="View PDS" color="primary" outline @click="onViewPDS" />
          <q-btn :label="applicationStatus === 'Qualified' ? 'Mark Unqualified' : 'Mark Qualified'"
            :color="applicationStatus === 'Qualified' ? 'negative' : 'positive'" @click="toggleQualification" />
          <q-btn label="Submit" color="positive" @click="onSubmit" />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'QualityStandardModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    variant: {
      type: String,
      default: 'employee',
      validator: (value) => ['employee', 'applicant'].includes(value)
    },
    // Employee props
    employeeName: {
      type: String,
      default: 'Mahusay, Jograd M.'
    },
    currentPosition: {
      type: String,
      default: 'Computer Programmer II'
    },
    employmentType: {
      type: String,
      default: 'Casual'
    },
    educationData: {
      type: Array,
      default: () => [
        { degree: "Bachelor's Degree", institution: "University of Example", year: "2018" }
      ]
    },
    experienceData: {
      type: Array,
      default: () => [
        { position: "Software Developer", organization: "Tech Solutions Inc.", years: "3" }
      ]
    },
    trainingData: {
      type: Array,
      default: () => [
        { program: "Advanced Programming", provider: "Tech Academy", hours: "40" }
      ]
    },
    eligibilityData: {
      type: Array,
      default: () => [
        { certification: "Professional License", authority: "State Board", year: "2020" }
      ]
    },
    // Applicant props
    applicantName: {
      type: String,
      default: 'King, Fahad M.'
    },
    appliedPosition: {
      type: String,
      default: 'Computer Programmer II'
    },
    applicationStatus: {
      type: String,
      default: 'Pending'
    },
    applicantQualifications: {
      type: Array,
      default: () => [
        { name: 'Education', met: true },
        { name: 'Experience', met: true },
        { name: 'Training', met: false },
        { name: 'Eligibility', met: true }
      ]
    }
  },
  emits: ['update:show', 'update', 'view-pds', 'toggle-qualification', 'submit'],
  setup(props, { emit }) {
    const localShow = ref(props.show)
    const tab = ref('education')
    const qualifications = ref(props.applicantQualifications)

    watch(
      () => props.show,
      (newVal) => {
        localShow.value = newVal
      }
    )

    watch(localShow, (newVal) => {
      if (!newVal) {
        emit('update:show', false)
      }
    })

    const onUpdate = () => emit('update')
    const onViewPDS = () => emit('view-pds')
    const onSubmit = () => emit('submit')
    const toggleQualification = () => {
      const newStatus = props.applicationStatus === 'Qualified' ? 'Unqualified' : 'Qualified'
      emit('toggle-qualification', newStatus)
    }

    return {
      localShow,
      tab,
      qualifications,
      onUpdate,
      onViewPDS,
      onSubmit,
      toggleQualification
    }
  }
})
</script>

<style scoped>
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
</style>
