<template>
  <q-page class="q-pa-md">
    <!-- Header area with improved spacing -->
    <div class="column q-mb-sm">
      <div class="column items-start justify-center q-mb-md">
        <h5 class="text-h5 q-ma-none"><b>Rater Management</b></h5>
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs class="q-ma-none">
            <template v-slot:separator>
              <q-icon size="1.2em" name="arrow_forward" />
            </template>
            <q-breadcrumbs-el label="Rater Management" icon="assignment_ind" />
            <q-breadcrumbs-el label="Criteria" icon="tune" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>

    <!-- Selection form card with optimized layout -->
    <q-card flat bordered class="selection-card q-mb-sm">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-3">
            <div class="text-subtitle2 q-mb-xs text-12">Office</div>
            <q-select
              outlined
              dense
              v-model="formData.office"
              :options="filteredOfficeOptions"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filterOffices"
              @update:model-value="resetPosition"
              placeholder="Select office"
              class="modern-select text-12"
            >
              <template v-slot:prepend>
                <q-icon name="business" color="primary" size="xs" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-subtitle2 q-mb-xs text-12">Position</div>
            <q-select
              outlined
              dense
              v-model="formData.position"
              :options="filteredPositionOptions"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filterPositions"
              :disable="!formData.office"
              @update:model-value="loadPositionDetails"
              placeholder="Select position"
              class="modern-select text-12"
            >
              <template v-slot:prepend>
                <q-icon name="work" color="primary" size="xs" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-subtitle2 q-mb-xs text-12">Salary Grade</div>
            <q-input
              outlined
              dense
              v-model="formData.salaryGrade"
              readonly
              disable
              placeholder="Auto-populated"
              class="modern-input bg-grey-1 text-12"
            >
              <template v-slot:prepend>
                <q-icon name="payments" color="grey-7" size="xs" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-subtitle2 q-mb-xs text-12">Plantilla Item No.</div>
            <q-input
              outlined
              dense
              v-model="formData.plantillaItemNo"
              readonly
              disable
              placeholder="Auto-populated"
              class="modern-input bg-grey-1 text-12"
            >
              <template v-slot:prepend>
                <q-icon name="tag" color="grey-7" size="xs" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Empty state with improved visual design -->
    <q-card
      v-if="!showRatingTable"
      flat
      bordered
      class="text-center q-pa-md bg-blue-1 rounded-borders q-mb-sm empty-state-card"
    >
      <q-icon name="tune" size="2rem" color="primary" class="q-mb-xs" />
      <div class="text-h6 q-mb-xs text-12">Position Details Required</div>
      <p class="text-body2 q-mb-none text-grey-8 text-12">
        Please select both an Office and Position to configure rating criteria.
      </p>
    </q-card>

    <!-- Rating criteria section with improved layout -->
    <div v-if="showRatingTable" class="criteria-section">
      <!-- Weight summary bar - moved to the top for better visibility -->
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

      <!-- Horizontally aligned criteria cards -->
      <div class="row q-col-gutter-xs">
        <!-- Education criteria -->
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

        <!-- Experience criteria -->
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

        <!-- Training criteria -->
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

        <!-- Performance criteria -->
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

        <!-- BEI criteria -->
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
    </div>

    <!-- Confirmation dialog with improved design -->
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

    <!-- Loading overlay with improved visual design -->
    <!-- <q-inner-loading :showing="loading" class="custom-loader">
      <div class="column items-center">
        <q-spinner-dots size="40px" color="primary" />
        <div class="text-body2 q-mt-sm text-grey-8 text-12">Processing...</div>
      </div>
    </q-inner-loading> -->
  </q-page>
</template>

<script>
  import { toast } from 'src/boot/toast';
  import { rankApplicants } from 'src/assets/Utils/RatingCalculations.js';
  import { useRaterStore } from 'src/stores/raterStore';
  import { storeToRefs } from 'pinia';
  import { api } from 'src/boot/axios';

  export default {
    name: 'CriteriaRater',
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
        baseCriteria: {
          education: {
            title1: 'High School Graduate',
            title2: 'RELEVANT EDUCATION',
            description:
              "Completion of Bachelor's Degree and/or Master/ Doctorate/ Professional Ed or Position → 20%",
            weight: 20,
          },
          experience: {
            title1: 'None required',
            title2: 'RELEVANT EXPERIENCE',
            description1:
              'With Experience with higher Salary Grade/level with Office Order of Designation from the Local Chief → 20%',
            description2: 'Without Experience → 10%',
            weight: 20,
          },
          training: {
            title1: 'None required',
            title2: 'RELEVANT TRAINING',
            description:
              'With the Minimum hours of related Training to the position or at least 4 hours if required of the position → 15%',
            weight: 15,
          },
          performance: {
            title: 'IPCR Rating/OPV Rating',
            rating1: 'Outstanding → 15%',
            rating2: 'Very Satisfactory → 13%',
            rating3: 'Below VS rating → 10%',
            weight: 15,
          },
          bei: {
            title: 'Behavioral Event Interview',
            description:
              'Score based on behavioral competencies (e.g., leadership, teamwork, problem-solving) → 10%',
            weight: 10,
          },
        },
        editableCriteria: null,
        displayCriteria: null,
        applicants: [
          {
            id: 1,
            name: 'Applicant 1',
            education: 0,
            experience: 0,
            training: 0,
            performance: 0,
            bei: 0,
          },
          {
            id: 2,
            name: 'Applicant 2',
            education: 0,
            experience: 0,
            training: 0,
            performance: 0,
            bei: 0,
          },
          {
            id: 3,
            name: 'Applicant 3',
            education: 0,
            experience: 0,
            training: 0,
            performance: 0,
            bei: 0,
          },
        ],
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
        savingAttempts: 0,
        currentDateTime: '2025-07-11 06:10:49',
        currentUser: 'dsfsgs',
      };
    },
    computed: {
      formattedDateTime() {
        return this.currentDateTime;
      },
      rankedApplicants() {
        return rankApplicants(this.applicants, this.displayCriteria);
      },
      canSave() {
        return (
          this.formData.office &&
          this.formData.position &&
          this.editableCriteria &&
          this.totalWeight === 100
        );
      },
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
    created() {
      this.editableCriteria = JSON.parse(JSON.stringify(this.baseCriteria));
      this.displayCriteria = JSON.parse(JSON.stringify(this.baseCriteria));
      this.filteredOfficeOptions = [...this.officeOptions];
      this.filteredPositionOptions = [...this.positionOptions];
      this.fetchInitialData();
    },
    setup() {
      const raterStore = useRaterStore();
      const { raters, loading: storeLoading, error: storeError } = storeToRefs(raterStore);

      return {
        raterStore,
        raters,
        storeLoading,
        storeError,
      };
    },
    methods: {
      validatePercentage(field) {
        if (this.editableCriteria[field].weight < 0) {
          this.editableCriteria[field].weight = 0;
        } else if (this.editableCriteria[field].weight > 100) {
          this.editableCriteria[field].weight = 100;
        }
      },
      async fetchInitialData() {
        try {
          await this.raterStore.fetchRaters();
          await this.raterStore.fetchRatersBatch();
          await this.loadApplicants();
        } catch (error) {
          console.error('Error fetching initial data:', error);
          toast.error('Failed to load initial data. Please refresh the page.');
        }
      },
      confirmSave() {
        if (!this.canSave) {
          if (this.totalWeight !== 100) {
            toast.warning('The total weight must equal 100% before saving.');
          } else {
            toast.warning('Please complete all required fields before saving.');
          }
          return;
        }
        this.confirmDialog = true;
      },
      async saveRatings() {
        if (!this.canSave) {
          if (this.totalWeight !== 100) {
            toast.warning('The total weight must equal 100% before saving.');
          } else {
            toast.warning('Please complete all required fields before saving.');
          }
          return;
        }

        this.loading = true;
        this.savingAttempts++;

        try {
          const criteriaForStorage = JSON.parse(JSON.stringify(this.editableCriteria));
          criteriaForStorage.education.weight = criteriaForStorage.education.weight / 100;
          criteriaForStorage.experience.weight = criteriaForStorage.experience.weight / 100;
          criteriaForStorage.training.weight = criteriaForStorage.training.weight / 100;
          criteriaForStorage.performance.weight = criteriaForStorage.performance.weight / 100;
          criteriaForStorage.bei.weight = criteriaForStorage.bei.weight / 100;

          const payload = {
            position: this.formData.position,
            office: this.formData.office,
            plantillaItemNo: this.formData.plantillaItemNo,
            salaryGrade: this.formData.salaryGrade,
            criteria: criteriaForStorage,
          };

          const result = await this.raterStore.savePositionCriteria(payload);

          if (result) {
            result.education.weight = result.education.weight * 100;
            result.experience.weight = result.experience.weight * 100;
            result.training.weight = result.training.weight * 100;
            result.performance.weight = result.performance.weight * 100;
            result.bei.weight = result.bei.weight * 100;

            this.displayCriteria = JSON.parse(JSON.stringify(result));
            toast.success(`Criteria for ${this.formData.position} saved successfully`);
            this.savingAttempts = 0;

            await this.saveApplicantRatings();

            return result;
          }
          throw new Error('No result returned from save operation');
        } catch (error) {
          console.error('Save error:', error);

          if (this.savingAttempts >= 2) {
            return this.saveRatingsFallback();
          }

          toast.error(`Failed to save criteria: ${error.message}`);
          this.editableCriteria = JSON.parse(JSON.stringify(this.displayCriteria));
        } finally {
          this.loading = false;
        }
      },

      async saveApplicantRatings() {
        try {
          const payload = {
            position: this.formData.position,
            office: this.formData.office,
            applicants: this.rankedApplicants,
          };

          await api.post('/applicant-ratings', payload);
        } catch (error) {
          console.error('Failed to save applicant ratings:', error);
        }
      },

      async saveRatingsFallback() {
        try {
          this.loading = true;

          const criteriaForStorage = JSON.parse(JSON.stringify(this.editableCriteria));
          criteriaForStorage.education.weight = criteriaForStorage.education.weight / 100;
          criteriaForStorage.experience.weight = criteriaForStorage.experience.weight / 100;
          criteriaForStorage.training.weight = criteriaForStorage.training.weight / 100;
          criteriaForStorage.performance.weight = criteriaForStorage.performance.weight / 100;
          criteriaForStorage.bei.weight = criteriaForStorage.bei.weight / 100;

          const payload = {
            position: this.formData.position,
            office: this.formData.office,
            criteria: criteriaForStorage,
          };

          const response = await api.post('/criteria', payload);

          if (response.data) {
            response.data.education.weight = response.data.education.weight * 100;
            response.data.experience.weight = response.data.experience.weight * 100;
            response.data.training.weight = response.data.training.weight * 100;
            response.data.performance.weight = response.data.performance.weight * 100;
            response.data.bei.weight = response.data.bei.weight * 100;

            this.displayCriteria = JSON.parse(JSON.stringify(response.data));
            toast.success(`Criteria saved successfully (via fallback)`);
            this.savingAttempts = 0;
            return response.data;
          }
        } catch (error) {
          console.error('Fallback save error:', error);
          toast.error('All save methods failed. Please check your connection.');
        } finally {
          this.loading = false;
        }
      },

      handleRatingUpdate({ applicantId, field, value }) {
        const applicant = this.applicants.find((a) => a.id === applicantId);
        if (applicant) {
          applicant[field] = Number(value);
        }
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
        this.displayCriteria = JSON.parse(JSON.stringify(this.baseCriteria));
      },
      async loadPositionDetails() {
        if (!this.formData.position) return;

        this.loading = true;

        try {
          const existingCriteria = await this.fetchExistingCriteria();

          if (existingCriteria) {
            existingCriteria.education.weight = existingCriteria.education.weight * 100;
            existingCriteria.experience.weight = existingCriteria.experience.weight * 100;
            existingCriteria.training.weight = existingCriteria.training.weight * 100;
            existingCriteria.performance.weight = existingCriteria.performance.weight * 100;
            existingCriteria.bei.weight = existingCriteria.bei.weight * 100;

            this.editableCriteria = JSON.parse(JSON.stringify(existingCriteria));
            this.displayCriteria = JSON.parse(JSON.stringify(existingCriteria));
          } else {
            this.loadMockPositionDetails();
          }

          await this.loadApplicants();
        } catch (error) {
          console.error('Failed to fetch position details:', error);
          this.loadMockPositionDetails();
        } finally {
          this.loading = false;
          this.showRatingTable = true;
        }
      },
      async fetchExistingCriteria() {
        try {
          if (!this.formData.position || !this.formData.office) {
            return null;
          }

          const criteria = await this.raterStore.getCriteria(
            this.formData.position,
            this.formData.office,
          );

          if (
            criteria &&
            criteria.education &&
            criteria.experience &&
            criteria.training &&
            criteria.performance &&
            criteria.bei
          ) {
            return criteria;
          }

          return null;
        } catch (error) {
          console.error('Error fetching existing criteria:', error);
          return null;
        }
      },
      loadMockPositionDetails() {
        if (this.formData.position === 'Administrative Officer') {
          this.formData.salaryGrade = 'SG-24';
          this.formData.plantillaItemNo = 'ADMIN-2024-001';
          this.editableCriteria.education.title1 = "Bachelor's Degree";
          this.editableCriteria.experience.title1 = '5 years of relevant experience';
          this.editableCriteria.bei.description =
            'Behavioral competencies for administrative leadership';
        } else if (this.formData.position === 'Budget Officer') {
          this.formData.salaryGrade = 'SG-22';
          this.formData.plantillaItemNo = 'BUDG-2024-003';
          this.editableCriteria.education.title1 = "Bachelor's Degree in Accounting or Finance";
          this.editableCriteria.experience.title1 = '3 years of relevant experience';
          this.editableCriteria.bei.description =
            'Behavioral competencies for financial decision-making';
        } else if (this.formData.position === 'Accountant') {
          this.formData.salaryGrade = 'SG-19';
          this.formData.plantillaItemNo = 'ACCT-2024-002';
          this.editableCriteria.education.title1 = "Bachelor's Degree in Accounting";
          this.editableCriteria.experience.title1 = '2 years of accounting experience';
          this.editableCriteria.bei.description =
            'Behavioral competencies for accounting precision';
        } else {
          this.formData.salaryGrade = 'SG-18';
          this.formData.plantillaItemNo = `${this.formData.position.substr(0, 4).toUpperCase()}-2024-005`;
          this.editableCriteria.education.title1 = "Bachelor's Degree";
          this.editableCriteria.experience.title1 = '1 year of relevant experience';
          this.editableCriteria.bei.description = 'General behavioral competencies';
        }

        this.displayCriteria = JSON.parse(JSON.stringify(this.editableCriteria));
      },
      async loadApplicants() {
        try {
          if (this.raters && this.raters.length > 0) {
            this.applicants = this.raters.map((rater) => ({
              id: rater.id,
              name: rater.name || `Applicant ${rater.id}`,
              education: rater.education || 0,
              experience: rater.experience || 0,
              training: rater.training || 0,
              performance: rater.performance || 0,
              bei: rater.bei || 0,
            }));
          } else {
            await this.raterStore.fetchRaters();
            if (this.raters && this.raters.length > 0) {
              this.applicants = this.raters.map((rater) => ({
                id: rater.id,
                name: rater.name || `Applicant ${rater.id}`,
                education: rater.education || 0,
                experience: rater.experience || 0,
                training: rater.training || 0,
                performance: rater.performance || 0,
                bei: rater.bei || 0,
              }));
            }
          }
        } catch (error) {
          console.error('Failed to load applicants:', error);
        }
      },
    },
    watch: {
      storeLoading(newVal) {
        this.loading = newVal;
      },
      storeError(newVal) {
        if (newVal) {
          toast.error(newVal);
        }
      },
    },
  };
</script>

<style scoped>
  /* Base Styles */
  .text-12 {
    font-size: 12px !important;
    line-height: 1.4;
  }

  .text-10 {
    font-size: 10px !important;
    line-height: 1.2;
  }

  .selection-card,
  .criteria-card,
  .empty-state-card {
    border-radius: 4px;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .selection-card:hover,
  .criteria-card:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  .criteria-section {
    animation: fadeIn 0.3s ease;
  }

  /* Card Styles */
  .criteria-header {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .criteria-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .empty-state-card {
    border: 1px dashed rgba(0, 0, 0, 0.08);
    background-color: #f8fbff !important;
  }

  /* Form Element Styles */
  .modern-select,
  .modern-input {
    border-radius: 3px;
    transition: all 0.2s ease;
  }

  .modern-select .q-field__control,
  .modern-input .q-field__control {
    height: 28px;
    min-height: 28px;
  }

  .modern-select:hover .q-field__control,
  .modern-input:hover .q-field__control {
    border-color: #1976d2;
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
    padding: 0 2px 0 8px; /* Adjusted padding */
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

  /* Button Styles */
  .save-btn {
    border-radius: 3px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .save-btn:not(:disabled):hover {
    box-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
  }

  .float-right {
    float: right;
  }

  /* Dialog Styles */
  .modern-dialog .q-card {
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  /* Loading Styles */
  .custom-loader {
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(2px);
  }

  /* Animations */
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

  /* Responsive Adjustments */
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
