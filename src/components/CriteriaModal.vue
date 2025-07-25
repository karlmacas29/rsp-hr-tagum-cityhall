<template>
  <q-dialog v-model="show" persistent>
    <q-card style="max-width: 1200px; width: 95vw">
      <!-- Sticky Header -->
      <q-card-section class="row items-center q-pa-sm bg-primary text-white sticky-header">
        <div class="text-h6">Set Rating Criteria</div>
        <q-space />
        <q-btn icon="close" flat dense @click="closeModal" />
      </q-card-section>

      <!-- Display selected job info -->
      <q-card-section class="q-la-sm">
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Office</div>
            <div class="q-pa-xs text-12 text-weight-medium bg-grey-2 rounded-borders">
              {{ formData.office || '-' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Position</div>
            <div class="q-pa-xs text-12 text-weight-medium bg-grey-2 rounded-borders">
              {{ formData.position || '-' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Salary Grade</div>
            <div class="q-pa-xs text-11 text-weight-medium bg-grey-2 rounded-borders">
              {{ formData.salaryGrade || '-' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Plantilla Item No.</div>
            <div class="q-pa-xs text-12 text-weight-medium bg-grey-2 rounded-borders">
              {{ formData.plantillaItemNo || '-' }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <!-- Criteria -->
      <q-card-section v-if="showRatingTable" class="criteria-section">
        <div class="row q-mb-sm">
          <div class="col-12">
            <q-btn
              color="primary"
              icon="save"
              label="Save Criteria"
              :loading="loading"
              :disable="totalWeight !== 100"
              @click="confirmSave"
              unelevated
              dense
              class="q-px-md q-py-xs save-btn float-right text-12"
            />
            <q-chip
              :color="totalWeight !== 100 ? 'warning' : 'positive'"
              text-color="white"
              class="text-12"
            >
              <q-icon
                :name="totalWeight !== 100 ? 'warning' : 'check_circle'"
                size="xs"
                class="q-mr-xs"
              />
              Total Weight: {{ totalWeight }}%
              <span v-if="totalWeight !== 100" class="q-ml-xs text-12">Must equal 100%</span>
            </q-chip>
          </div>
        </div>
        <div class="row q-col-gutter-xs">
          <!-- Education -->
          <div class="col">
            <q-card flat bordered class="criteria-card">
              <q-card-section class="criteria-header bg-blue-1 q-py-xs">
                <div class="row items-center justify-between">
                  <div class="col">
                    <div class="text-subtitle2 text-weight-medium text-12">
                      <q-icon name="school" size="xs" class="q-mr-xs" />
                      Education
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="percentage-wrapper">
                      <q-input
                        v-model.number="editableCriteria.education.weight"
                        type="number"
                        min="0"
                        max="100"
                        dense
                        outlined
                        class="weight-input text-10"
                        @update:model-value="validatePercentage('education')"
                      >
                        <template v-slot:append>
                          <span class="percentage-sign">%</span>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-xs">
                <q-input
                  v-model="editableCriteria.education.title1"
                  label="Min Qualification"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.education.title2"
                  label="Title"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.education.description"
                  label="Description"
                  dense
                  outlined
                  type="textarea"
                  autogrow
                  class="modern-input text-12"
                />
              </q-card-section>
            </q-card>
          </div>
          <!-- Experience -->
          <div class="col">
            <q-card flat bordered class="criteria-card">
              <q-card-section class="criteria-header bg-blue-1 q-py-xs">
                <div class="row items-center justify-between">
                  <div class="col">
                    <div class="text-subtitle2 text-weight-medium text-12">
                      <q-icon name="work_history" size="xs" class="q-mr-xs" />
                      Experience
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="percentage-wrapper">
                      <q-input
                        v-model.number="editableCriteria.experience.weight"
                        type="number"
                        min="0"
                        max="100"
                        dense
                        outlined
                        class="weight-input text-10"
                        @update:model-value="validatePercentage('experience')"
                      >
                        <template v-slot:append>
                          <span class="percentage-sign">%</span>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-xs">
                <q-input
                  v-model="editableCriteria.experience.title1"
                  label="Min Qualification"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.experience.title2"
                  label="Title"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.experience.description1"
                  label="With Experience"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.experience.description2"
                  label="Without Experience"
                  dense
                  outlined
                  autogrow
                  class="modern-input text-12"
                />
              </q-card-section>
            </q-card>
          </div>
          <!-- Training -->
          <div class="col">
            <q-card flat bordered class="criteria-card">
              <q-card-section class="criteria-header bg-blue-1 q-py-xs">
                <div class="row items-center justify-between">
                  <div class="col">
                    <div class="text-subtitle2 text-weight-medium text-12">
                      <q-icon name="card_membership" size="xs" class="q-mr-xs" />
                      Training
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="percentage-wrapper">
                      <q-input
                        v-model.number="editableCriteria.training.weight"
                        type="number"
                        min="0"
                        max="100"
                        dense
                        outlined
                        class="weight-input text-10"
                        @update:model-value="validatePercentage('training')"
                      >
                        <template v-slot:append>
                          <span class="percentage-sign">%</span>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-xs">
                <q-input
                  v-model="editableCriteria.training.title1"
                  label="Min Qualification"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.training.title2"
                  label="Title"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.training.description"
                  label="Description"
                  dense
                  outlined
                  type="textarea"
                  autogrow
                  class="modern-input text-12"
                />
              </q-card-section>
            </q-card>
          </div>
          <!-- Performance -->
          <div class="col">
            <q-card flat bordered class="criteria-card">
              <q-card-section class="criteria-header bg-blue-1 q-py-xs">
                <div class="row items-center justify-between">
                  <div class="col">
                    <div class="text-subtitle2 text-weight-medium text-11">
                      <q-icon name="leaderboard" size="xs" class="q-mr-xs" />
                      Performance
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="percentage-wrapper">
                      <q-input
                        v-model.number="editableCriteria.performance.weight"
                        type="number"
                        min="0"
                        max="100"
                        dense
                        outlined
                        class="weight-input text-10"
                        @update:model-value="validatePercentage('performance')"
                      >
                        <template v-slot:append>
                          <span class="percentage-sign">%</span>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-xs">
                <q-input
                  v-model="editableCriteria.performance.title"
                  label="Title"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.performance.rating1"
                  label="Outstanding Rating"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.performance.rating2"
                  label="Very Satisfactory"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.performance.rating3"
                  label="Below VS Rating"
                  dense
                  outlined
                  autogrow
                  class="modern-input text-12"
                />
              </q-card-section>
            </q-card>
          </div>
          <!-- BEI -->
          <div class="col">
            <q-card flat bordered class="criteria-card">
              <q-card-section class="criteria-header bg-blue-1 q-py-xs">
                <div class="row items-center justify-between">
                  <div class="col">
                    <div class="text-subtitle2 text-weight-medium text-12">
                      <q-icon name="record_voice_over" size="xs" class="q-mr-xs" />
                      BEI
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="percentage-wrapper">
                      <q-input
                        v-model.number="editableCriteria.bei.weight"
                        type="number"
                        min="0"
                        max="100"
                        dense
                        outlined
                        class="weight-input text-10"
                        @update:model-value="validatePercentage('bei')"
                      >
                        <template v-slot:append>
                          <span class="percentage-sign">%</span>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-xs">
                <q-input
                  v-model="editableCriteria.bei.title"
                  label="Title"
                  dense
                  outlined
                  autogrow
                  class="q-mb-xs modern-input text-12"
                />
                <q-input
                  v-model="editableCriteria.bei.description"
                  label="Description"
                  dense
                  outlined
                  type="textarea"
                  autogrow
                  class="modern-input text-12"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <!-- Empty state -->
      <q-card-section v-else class="text-center q-pa-md bg-blue-1 rounded-borders empty-state-card">
        <q-icon name="tune" size="2rem" color="primary" class="q-mb-xs" />
        <div class="text-h6 q-mb-xs text-12">Position Details Required</div>
        <p class="text-body2 q-mb-none text-grey-8 text-12">
          Please select both an Office and Position to configure rating criteria.
        </p>
      </q-card-section>
    </q-card>

    <!-- Confirm dialog -->
    <q-dialog v-model="confirmDialog" persistent class="modern-dialog">
      <q-card style="width: 400px" class="no-shadow">
        <q-card-section class="bg-primary text-white q-pb-sm">
          <div class="text-subtitle1 q-mb-xs">
            <q-icon name="save" size="sm" class="q-mr-xs" />
            Confirm Save
          </div>
          <div class="text-caption">Review your changes before saving</div>
        </q-card-section>
        <q-card-section class="q-pt-md q-pb-sm">
          <div class="text-body2 q-mb-sm text-12">
            Are you sure you want to save the rating criteria for:
          </div>
          <q-list dense>
            <q-item>
              <q-item-section avatar>
                <q-icon name="work" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-12">Position</q-item-label>
                <q-item-label class="text-12">{{ formData.position }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="business" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-12">Office</q-item-label>
                <q-item-label class="text-12">{{ formData.office }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-sm">
          <q-btn flat dense label="Cancel" color="dark" v-close-popup class="q-mr-sm text-12" />
          <q-btn
            unelevated
            dense
            label="Save"
            color="primary"
            @click="saveRatings"
            v-close-popup
            class="text-12"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
  export default {
    name: 'CriteriaRaterModal',
    props: {
      modelValue: { type: Boolean, required: true },
      job: { type: Object, default: null },
    },
    data() {
      return {
        show: this.modelValue,
        loading: false,
        showRatingTable: false,
        confirmDialog: false,
        formData: {
          office: null,
          position: null,
          salaryGrade: '',
          plantillaItemNo: '',
        },
        baseCriteria: {
          education: { title1: '', title2: '', description: '', weight: 20 },
          experience: { title1: '', title2: '', description1: '', description2: '', weight: 20 },
          training: { title1: '', title2: '', description: '', weight: 15 },
          performance: { title: '', rating1: '', rating2: '', rating3: '', weight: 15 },
          bei: { title: '', description: '', weight: 10 },
        },
        editableCriteria: null,
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
          'Public Information Officer',
        ],
        filteredOfficeOptions: [],
        filteredPositionOptions: [],
      };
    },
    computed: {
      totalWeight() {
        if (!this.editableCriteria) return 0;
        return (
          (this.editableCriteria.education.weight || 0) +
          (this.editableCriteria.experience.weight || 0) +
          (this.editableCriteria.training.weight || 0) +
          (this.editableCriteria.performance.weight || 0) +
          (this.editableCriteria.bei.weight || 0)
        );
      },
    },
    watch: {
      modelValue(val) {
        this.show = val;
      },
      show(val) {
        this.$emit('update:modelValue', val);
      },
      job: {
        immediate: true,
        handler(job) {
          // Auto-populate formData from the passed job prop
          if (job) {
            this.formData.office = job.Office || '';
            this.formData.position = job.Position || '';
            this.formData.salaryGrade = job.salaryGrade || job.SalaryGrade || '';
            this.formData.plantillaItemNo = job.ItemNo || job.ItemNo || '';
            this.showRatingTable = !!(this.formData.office && this.formData.position);
          } else {
            this.formData.office = null;
            this.formData.position = null;
            this.formData.salaryGrade = '';
            this.formData.plantillaItemNo = '';
            this.showRatingTable = false;
          }
        },
      },
    },
    created() {
      this.editableCriteria = JSON.parse(JSON.stringify(this.baseCriteria));
      this.filteredOfficeOptions = [...this.officeOptions];
      this.filteredPositionOptions = [...this.positionOptions];
    },
    methods: {
      closeModal() {
        this.show = false;
      },
      confirmSave() {
        if (this.totalWeight !== 100) {
          this.$q.notify({
            type: 'warning',
            message: 'The total weight must equal 100% before saving.',
          });
          return;
        }
        this.confirmDialog = true;
      },
      saveRatings() {
        // Replace with actual save logic
        this.$q.notify({ type: 'positive', message: 'Criteria saved!' });
        this.closeModal();
      },
      filterOffices(val, update) {
        update(() => {
          if (val === '') {
            this.filteredOfficeOptions = this.officeOptions;
          } else {
            const needle = val.toLowerCase();
            this.filteredOfficeOptions = this.officeOptions.filter(
              (v) => v.toLowerCase().indexOf(needle) > -1,
            );
          }
        });
      },
      filterPositions(val, update) {
        update(() => {
          if (val === '') {
            this.filteredPositionOptions = this.positionOptions;
          } else {
            const needle = val.toLowerCase();
            this.filteredPositionOptions = this.positionOptions.filter(
              (v) => v.toLowerCase().indexOf(needle) > -1,
            );
          }
        });
      },
      resetPosition() {
        this.formData.position = null;
        this.formData.salaryGrade = '';
        this.formData.plantillaItemNo = '';
        this.showRatingTable = false;
        this.editableCriteria = JSON.parse(JSON.stringify(this.baseCriteria));
      },
      loadPositionDetails() {
        if (!this.formData.position) return;
        // Sample mock - can be replaced with backend call
        if (this.formData.position === 'Administrative Officer') {
          this.formData.salaryGrade = 'SG-24';
          this.formData.plantillaItemNo = 'ADMIN-2024-001';
          this.editableCriteria.education.title1 = "Bachelor's Degree";
          this.editableCriteria.experience.title1 = '5 years of relevant experience';
          this.editableCriteria.bei.description =
            'Behavioral competencies for administrative leadership';
        } else {
          this.formData.salaryGrade = '';
          this.formData.plantillaItemNo = '';
        }
        this.showRatingTable = true;
      },
      validatePercentage(field) {
        if (this.editableCriteria[field].weight < 0) {
          this.editableCriteria[field].weight = 0;
        } else if (this.editableCriteria[field].weight > 100) {
          this.editableCriteria[field].weight = 100;
        }
      },
    },
  };
</script>

<style scoped>
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .text-12 {
    font-size: 12px !important;
    line-height: 1.4;
  }
  .text-10 {
    font-size: 10px !important;
    line-height: 1.2;
  }
  .empty-state-card {
    border: 1px dashed rgba(0, 0, 0, 0.08);
    background-color: #f8fbff !important;
    border-radius: 4px;
  }
  .criteria-header {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .criteria-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
  }
  .modern-select,
  .modern-input {
    border-radius: 3px;
  }
  .modern-select .q-field__control,
  .modern-input .q-field__control {
    height: 28px;
    min-height: 28px;
  }
  .percentage-wrapper {
    width: 80px;
  }
  .weight-input {
    width: 100%;
    border-radius: 3px;
  }
  .weight-input .q-field__control {
    height: 22px;
    min-height: 22px;
    padding: 0 2px 0 8px;
  }
  .weight-input .q-field__native {
    padding-right: 0;
    text-align: right;
  }
  .percentage-sign {
    font-size: 10px;
    padding: 0 5px 0 2px;
    color: rgba(0, 0, 0, 0.7);
  }
  .save-btn {
    border-radius: 3px;
    font-weight: 500;
  }
  .float-right {
    float: right;
  }
  .criteria-section {
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media (max-width: 1200px) {
    .col {
      min-width: 100%;
      margin-bottom: 8px;
    }
  }
  @media (min-width: 1200px) {
    .col {
      padding: 0 2px;
    }
  }
</style>
