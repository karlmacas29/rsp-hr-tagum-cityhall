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

      <!-- Employee View -->
      <template v-if="variant === 'employee'">
        <div class="row q-pa-md no-wrap" style="min-height: 550px">
          <!-- Left Card (Employee Info) -->
          <q-card class="col-3 q-mr-md">
            <q-card-section class="column items-center q-pa-md">
              <img
                :src="employeeData.photo || '/img/default-avatar.png'"
                style="border-radius: 100px"
                alt="Employee Photo"
                width="150"
                height="150"
              />

              <div class="text-h6 text-center q-mb-sm">{{ employeeData.name }}</div>
              <q-badge color="positive" class="q-mb-md">Active</q-badge>

              <div class="full-width">
                <div class="text-center q-mb-sm">
                  <div class="text-caption text-grey-7">Current Position</div>
                  <div class="text-weight-medium">{{ employeeData.position }}</div>
                </div>

                <q-separator class="q-my-md" />

                <div class="text-center q-mb-sm">
                  <div class="text-caption text-grey-7">Employment Type</div>
                  <div class="text-weight-medium">
                    <q-icon name="check" color="positive" size="sm" />
                    {{ employeeData.employmentType }}
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
                    <tr v-for="(edu, index) in employeeData.education" :key="'edu-'+index">
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
                    <tr v-for="(exp, index) in employeeData.experience" :key="'exp-'+index">
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
                    <tr v-for="(train, index) in employeeData.training" :key="'train-'+index">
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
                    <tr v-for="(elig, index) in employeeData.eligibility" :key="'elig-'+index">
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
      </template>

      <!-- Applicant View -->
      <template v-else>
        <div class="row q-pa-md no-wrap" style="min-height: 550px">
          <!-- Left Card (Applicant Info) -->
          <q-card class="col-3 q-mr-md">
            <q-card-section class="column items-center q-pa-md">
              <q-avatar size="120px">
                <img :src="applicantData.photo || '/img/default-avatar.png'" />
              </q-avatar>

              <div class="text-h6 text-center q-mb-sm">{{ applicantData.name }}</div>
              <q-badge :color="statusColor" class="q-mb-md">{{ applicantData.status }}</q-badge>

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
                  <div class="text-caption text-grey-7">Overall Status</div>
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
              <!-- Education Tab -->
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

              <!-- Experience Tab -->
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

              <!-- Training Tab -->
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

              <!-- Eligibility Tab -->
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
      </template>

      <!-- Footer Actions -->
      <q-card-actions align="right" class="q-px-md q-py-md">
        <template v-if="variant === 'employee'">
          <q-btn label="UPDATE" color="primary" @click="onUpdate" />
        </template>
        <template v-else>
          <q-btn label="View PDS" color="primary" outline @click="onViewPDS" />
          <q-btn
            :label="applicantData.status === 'Qualified' ? 'Mark Unqualified' : 'Mark Qualified'"
            :color="applicantData.status === 'Qualified' ? 'negative' : 'positive'"
            @click="toggleQualificationStatus"
          />
          <q-btn label="Submit Evaluation" color="positive" @click="onSubmit" />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'

export default defineComponent({
  name: 'QualificationStandardModal',
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
    employeeData: {
      type: Object,
      default: () => ({
        name: 'Employee Name',
        photo: '',
        position: 'Current Position',
        employmentType: 'Regular',
        education: [
          { degree: "Bachelor's Degree", institution: "University of Example", year: "2018" }
        ],
        experience: [
          { position: "Software Developer", organization: "Tech Solutions Inc.", years: "3" }
        ],
        training: [
          { program: "Advanced Programming", provider: "Tech Academy", hours: "40" }
        ],
        eligibility: [
          { certification: "Professional License", authority: "State Board", year: "2020" }
        ]
      })
    },
    // Applicant props
    applicantData: {
      type: Object,
      default: () => ({
        name: 'Applicant Name',
        photo: '',
        position: 'Applied Position',
        status: 'Pending',
        applicationDate: '2023-01-01',
        education: [
          { degree: "Bachelor's Degree", institution: "University of Example", year: "2018" }
        ],
        experience: [
          { position: "Software Developer", organization: "Tech Solutions Inc.", years: "3" }
        ],
        training: [
          { program: "Advanced Programming", provider: "Tech Academy", hours: "40" }
        ],
        eligibility: [
          { certification: "Professional License", authority: "State Board", year: "2020" }
        ]
      })
    },
    positionRequirements: {
      type: Object,
      default: () => ({
        education: "Bachelor's Degree in related field",
        preferredEducation: "Master's Degree preferred",
        experience: "Minimum 3 years relevant experience",
        preferredExperience: "5+ years in leadership role",
        training: "Certification in relevant field",
        preferredTraining: "Multiple advanced certifications",
        eligibility: "Professional license required",
        preferredCertification: "Additional specialized certifications"
      })
    }
  },
  emits: ['update:show', 'update', 'view-pds', 'toggle-qualification', 'submit', 'close'],
  setup(props, { emit }) {
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

    const onClose = () => {
      emit('close')
    }

    const onUpdate = () => emit('update')
    const onViewPDS = () => emit('view-pds')
    const onSubmit = () => emit('submit')
    const toggleQualificationStatus = () => {
      const newStatus = props.applicantData.status === 'Qualified' ? 'Unqualified' : 'Qualified'
      emit('toggle-qualification', newStatus)
    }

    return {
      localShow,
      tab,
      statusColor,
      overallStatus,
      onClose,
      onUpdate,
      onViewPDS,
      onSubmit,
      toggleQualificationStatus
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
