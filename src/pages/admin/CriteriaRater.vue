<template>
  <div class="q-pa-md">
    <!-- Header with improved styling -->
    <div class="row justify-between items-center q-mb-lg">
      <div class="text-h5 text-weight-medium text-primary">Rating Criteria Setup</div>
      <q-btn
        color="primary"
        label="Save Criteria"
        icon="save"
        :loading="loading"
        @click="confirmSave"
        v-if="showRatingTable"
        rounded
      />
    </div>

    <!-- Form section with card styling -->
    <q-card flat bordered class="q-pa-md q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Office selector with improved layout -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-xs">Office</div>
            <q-select
              outlined
              v-model="formData.office"
              :options="filteredOfficeOptions"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filterOffices"
              @update:model-value="resetPosition"
              placeholder="Select or search for an office"
              class="q-mb-sm"
            >
              <template v-slot:prepend>
                <q-icon name="business" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Position selector with improved layout -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-xs">Position</div>
            <q-select
              outlined
              v-model="formData.position"
              :options="filteredPositionOptions"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filterPositions"
              :disable="!formData.office"
              @update:model-value="loadPositionDetails"
              placeholder="Select a position"
              class="q-mb-sm"
            >
              <template v-slot:prepend>
                <q-icon name="work" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Read-only fields with improved styling -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-xs">Salary Grade</div>
            <q-input
              outlined
              v-model="formData.salaryGrade"
              readonly
              disable
              placeholder="Will be populated after position selection"
            >
              <template v-slot:prepend>
                <q-icon name="payments" color="grey" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-xs">Plantilla Item No.</div>
            <q-input
              outlined
              v-model="formData.plantillaItemNo"
              readonly
              disable
              placeholder="Will be populated after position selection"
            >
              <template v-slot:prepend>
                <q-icon name="tag" color="grey" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Message when criteria editor is hidden -->
    <div v-if="!showRatingTable" class="text-center q-pa-xl bg-blue-1 rounded-borders">
      <q-icon name="tune" size="3rem" color="primary" class="q-mb-md" />
      <p class="text-subtitle1">Please select both an Office and Position to configure rating criteria.</p>
      <p class="text-caption text-grey-8">This will load the appropriate criteria template for your selected position.</p>
    </div>

    <!-- Criteria Editor - Only shown when office and position are selected -->
    <template v-if="showRatingTable">
      <div class="text-h6 q-my-md text-primary">Define Rating Criteria</div>

      <div class="row q-col-gutter-md">
        <!-- Education criteria card -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="text-subtitle1 text-weight-medium">Education (20%)</div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="criteria.education.title1"
                label="Minimum Qualification"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.education.title2"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.education.description"
                label="Description"
                dense
                outlined
                type="textarea"
                autogrow
                rows="3"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Experience criteria card -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="text-subtitle1 text-weight-medium">Experience (20%)</div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="criteria.experience.title1"
                label="Minimum Qualification"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.experience.title2"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.experience.description1"
                label="Description (With Experience)"
                dense
                outlined
                type="textarea"
                autogrow
                rows="2"
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.experience.description2"
                label="Description (Without Experience)"
                dense
                outlined
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Training criteria card -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="text-subtitle1 text-weight-medium">Training (15%)</div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="criteria.training.title1"
                label="Minimum Qualification"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.training.title2"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.training.description"
                label="Description"
                dense
                outlined
                type="textarea"
                autogrow
                rows="3"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Performance criteria card -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="text-subtitle1 text-weight-medium">Performance (15%)</div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="criteria.performance.title"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.performance.rating1"
                label="Outstanding Rating"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.performance.rating2"
                label="Very Satisfactory Rating"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="criteria.performance.rating3"
                label="Below VS Rating"
                dense
                outlined
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Replaced preview section with the new component -->
      <RaterPreview :criteria="criteria" />
    </template>

    <!-- Confirmation dialog with improved styling -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px" class="confirm-dialog">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Confirm Save</div>
        </q-card-section>

        <q-card-section class="row items-center q-py-md">
          <q-avatar icon="save" color="primary" text-color="white" class="q-mr-md" />
          <span>Save criteria for {{ formData.position }} in {{ formData.office }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="dark" v-close-popup />
          <q-btn label="Save" color="positive" @click="saveCriteria" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Loading overlay -->
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { toast } from 'src/boot/toast'
import RaterPreview from 'components/User/RaterPreview.vue'

export default {
  name: 'CriteriaRater',
  components: {
    RaterPreview
  },
  data() {
    return {
      loading: false,
      showRatingTable: false,
      confirmDialog: false,
      formData: {
        office: null,
        position: null,
        salaryGrade: '',
        plantillaItemNo: '',
      },
      criteria: {
        education: {
          title1: 'High School Graduate',
          title2: 'RELEVANT EDUCATION',
          description:
            "Completion of Bachelor's Degree and/or Master/ Doctorate/ Professional Ed or Position → 20%",
        },
        experience: {
          title1: 'None required',
          title2: 'RELEVANT EXPERIENCE',
          description1:
            'With Experience with higher Salary Grade/level with Office Order of Designation from the Local Chief → 20%',
          description2: 'Without Experience → 10%',
        },
        training: {
          title1: 'None required',
          title2: 'RELEVANT TRAINING',
          description:
            'With the Minimum hours of related Training to the position or at least 4 hours if required of the position → 15%',
        },
        performance: {
          title: 'IPCR Rating/OPV Rating',
          rating1: 'Outstanding → 15%',
          rating2: 'Very Satisfactory → 13%',
          rating3: 'Below VS rating → 10%',
        },
      },
      officeOptions: [
        'Human Resource Office',
        'Finance Department',
        'Legal Department',
        'Information Technology Department',
        'Operations Department',
        'Administrative Services',
      ],
      positionOptions: [
        'Administrative Officer',
        'Budget Officer',
        'Accountant',
        'Planning Officer',
        'Human Resource Officer',
        'IT Officer',
        'Engineer',
        'Project Development Officer',
        'Public Information Officer'
      ],
      filteredOfficeOptions: [],
      filteredPositionOptions: []
    }
  },
  methods: {
    confirmSave() {
      this.confirmDialog = true
    },
    saveCriteria() {
      // This would save the criteria to your database
      this.loading = true

      // Simulate API call
      setTimeout(() => {
        this.loading = false
        toast.success(`Criteria for ${this.formData.position} in ${this.formData.office} saved successfully`)
      }, 1000)
    },
    filterOffices(val, update) {
      update(() => {
        if (val === '') {
          this.filteredOfficeOptions = this.officeOptions
        } else {
          const needle = val.toLowerCase()
          this.filteredOfficeOptions = this.officeOptions.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    filterPositions(val, update) {
      update(() => {
        if (val === '') {
          this.filteredPositionOptions = this.positionOptions
        } else {
          const needle = val.toLowerCase()
          this.filteredPositionOptions = this.positionOptions.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    resetPosition() {
      this.formData.position = null
      this.formData.salaryGrade = ''
      this.formData.plantillaItemNo = ''
      this.showRatingTable = false // Hide criteria when office changes
    },
    loadPositionDetails() {
      if (!this.formData.position) return

      this.loading = true

      // Simulate API call to fetch position details
      setTimeout(() => {
        // In a real app, this data would come from your backend
        if (this.formData.position === 'Administrative Officer') {
          this.formData.salaryGrade = 'SG-24'
          this.formData.plantillaItemNo = 'ADMIN-2024-001'
        } else if (this.formData.position === 'Budget Officer') {
          this.formData.salaryGrade = 'SG-22'
          this.formData.plantillaItemNo = 'BUDG-2024-003'
        } else if (this.formData.position === 'Accountant') {
          this.formData.salaryGrade = 'SG-19'
          this.formData.plantillaItemNo = 'ACCT-2024-002'
        } else {
          this.formData.salaryGrade = 'SG-18'
          this.formData.plantillaItemNo = `${this.formData.position.substr(0, 4).toUpperCase()}-2024-005`
        }

        this.loadCriteriaForPosition()
        this.loading = false
      }, 800)
    },
    loadCriteriaForPosition() {
      // This would load existing criteria from your database
      this.loading = true

      // Simulate API call
      setTimeout(() => {
        // In a real app, you would fetch this data from your backend
        // For now, we're just setting some example criteria based on position
        if (this.formData.position === 'Administrative Officer') {
          this.criteria.education.title1 = "Bachelor's Degree"
          this.criteria.experience.title1 = "5 years of relevant experience"
        } else if (this.formData.position === 'Budget Officer') {
          this.criteria.education.title1 = "Bachelor's Degree in Accounting or Finance"
          this.criteria.experience.title1 = "3 years of relevant experience"
        }

        this.showRatingTable = true
        this.loading = false
      }, 500)
    }
  },
  created() {
    // Initialize filtered options with all options
    this.filteredOfficeOptions = [...this.officeOptions]
    this.filteredPositionOptions = [...this.positionOptions]
  }
}
</script>

<style scoped>
/* Modern UI improvements */
.criteria-card {
  height: 100%;
  transition: all 0.3s ease;
}

.criteria-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.confirm-dialog {
  border-radius: 8px;
}

.q-field--disabled {
  opacity: 0.8;
}

.q-field--disabled .q-field__control {
  background-color: #f5f5f5;
  color: #666;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .criteria-card {
    margin-bottom: 16px;
  }
}
</style>
