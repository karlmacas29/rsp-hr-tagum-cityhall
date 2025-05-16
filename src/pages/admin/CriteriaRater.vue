<template>
  <div class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Rater Management</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <template v-slot:separator>
            <q-icon size="1.2em" name="arrow_forward" />
          </template>
          <q-breadcrumbs-el icon="assignment_ind" label="Rater Management" />
          <q-breadcrumbs-el icon="rule" label="Criteria" />
        </q-breadcrumbs>
      </div>
    </div>
    <div class="row justify-between items-center q-mb-lg">
      <div class="text-h4 text-weight-bold q-ma-none">Edit Criteria</div>
    </div>

    <q-card flat bordered class="q-pa-md q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md">
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
                  <q-item-section class="text-grey">No results</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

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
                  <q-item-section class="text-grey">No results</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

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

    <div v-if="!showRatingTable" class="text-center q-pa-xl bg-blue-1 rounded-borders">
      <q-icon name="tune" size="3rem" color="primary" class="q-mb-md" />
      <p class="text-subtitle1">
        Please select both an Office and Position to configure rating criteria.
      </p>
      <p class="text-caption text-grey-8">
        This will load the appropriate criteria template for your selected position.
      </p>
    </div>

    <template v-if="showRatingTable">
      <div class="text-h6 q-my-md text-primary">Define Rating Criteria</div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="row items-center justify-between">
                <div class="text-subtitle1 text-weight-medium">Education</div>
                <q-input
                  v-model.number="editableCriteria.education.weight"
                  type="number"
                  min="0"
                  max="100"
                  suffix="%"
                  dense
                  outlined
                  style="width: 100px"
                  @update:model-value="validatePercentage('education')"
                />
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="editableCriteria.education.title1"
                label="Minimum Qualification"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.education.title2"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.education.description"
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

        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="row items-center justify-between">
                <div class="text-subtitle1 text-weight-medium">Experience</div>
                <q-input
                  v-model.number="editableCriteria.experience.weight"
                  type="number"
                  min="0"
                  max="100"
                  suffix="%"
                  dense
                  outlined
                  style="width: 100px"
                  @update:model-value="validatePercentage('experience')"
                />
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="editableCriteria.experience.title1"
                label="Minimum Qualification"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.experience.title2"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.experience.description1"
                label="Description (With Experience)"
                dense
                outlined
                type="textarea"
                autogrow
                rows="2"
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.experience.description2"
                label="Description (Without Experience)"
                dense
                outlined
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="row items-center justify-between">
                <div class="text-subtitle1 text-weight-medium">Training</div>
                <q-input
                  v-model.number="editableCriteria.training.weight"
                  type="number"
                  min="0"
                  max="100"
                  suffix="%"
                  dense
                  outlined
                  style="width: 100px"
                  @update:model-value="validatePercentage('training')"
                />
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="editableCriteria.training.title1"
                label="Minimum Qualification"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.training.title2"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.training.description"
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

        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="row items-center justify-between">
                <div class="text-subtitle1 text-weight-medium">Performance</div>
                <q-input
                  v-model.number="editableCriteria.performance.weight"
                  type="number"
                  min="0"
                  max="100"
                  suffix="%"
                  dense
                  outlined
                  style="width: 100px"
                  @update:model-value="validatePercentage('performance')"
                />
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="editableCriteria.performance.title"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.performance.rating1"
                label="Outstanding Rating"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.performance.rating2"
                label="Very Satisfactory Rating"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.performance.rating3"
                label="Below VS Rating"
                dense
                outlined
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered class="criteria-card">
            <q-card-section class="bg-blue-1">
              <div class="row items-center justify-between">
                <div class="text-subtitle1 text-weight-medium">Behavioral Event Interview</div>
                <q-input
                  v-model.number="editableCriteria.bei.weight"
                  type="number"
                  min="0"
                  max="100"
                  suffix="%"
                  dense
                  outlined
                  style="width: 100px"
                  @update:model-value="validatePercentage('bei')"
                />
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="editableCriteria.bei.title"
                label="Title"
                dense
                outlined
                class="q-mb-sm"
              />
              <q-input
                v-model="editableCriteria.bei.description"
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
      </div>

      <div class="row justify-between items-center q-mt-lg">
        <q-banner rounded class="bg-grey-3 col-md-6 q-mr-md">
          <template v-slot:avatar>
            <q-icon name="info" color="primary" />
          </template>
          <div class="text-subtitle2">Total Weight: {{ totalWeight }}%</div>
          <div v-if="totalWeight !== 100" class="text-negative text-caption">
            The total weight must equal 100%
          </div>
        </q-banner>

        <q-btn
          color="primary"
          label="Save Criteria"
          icon="save"
          :loading="loading"
          @click="confirmSave"
          rounded
          padding="12px 24px"
          class="text-weight-bold"
          :disable="totalWeight !== 100"
        />
      </div>

      <RaterPreview
        :criteria="displayCriteria"
        :applicants="applicants"
        @update-rating="handleRatingUpdate"
      />
    </template>

    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px" class="confirm-dialog">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Confirm Save</div>
        </q-card-section>

        <q-card-section class="row items-center q-py-md">
          <q-avatar icon="save" color="primary" text-color="white" class="q-mr-md" />
          <span>Save all ratings for {{ formData.position }} in {{ formData.office }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="dark" v-close-popup />
          <q-btn label="Save" color="positive" @click="saveRatings" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
  import { toast } from 'src/boot/toast';
  import RaterPreview from 'components/RaterPreview.vue';
  import { rankApplicants } from 'src/assets/Utils/RatingCalculations.js';
  import { useRaterStore } from 'src/stores/raterStore';
  import { storeToRefs } from 'pinia';
  import { api } from 'src/boot/axios';

  export default {
    name: 'CriteriaRater',
    components: {
      RaterPreview,
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
      };
    },
    computed: {
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
          this.formData.plantillaItemNo = 'ADMIN-2024-001　　　　　';
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

  @media (max-width: 768px) {
    .criteria-card {
      margin-bottom: 16px;
    }
  }
</style>
