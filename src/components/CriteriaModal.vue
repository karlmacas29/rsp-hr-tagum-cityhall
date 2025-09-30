<template>
  <q-dialog v-model="show" persistent>
    <q-card style="max-width: 1200px; width: 95vw">
      <!-- Sticky Header -->
      <q-card-section class="row items-center q-pa-sm bg-primary text-white sticky-header">
        <div class="text-h6">{{ getModalTitle() }} Rating Criteria</div>
        <q-space />
        <q-btn icon="close" flat dense @click="closeModal" />
      </q-card-section>

      <!-- Loading State -->
      <div v-if="loading" class="q-pa-xl text-center">
        <q-spinner size="2rem" color="primary" class="q-mb-sm" />
        <div class="text-subtitle2">Loading job information...</div>
      </div>

      <!-- Display selected job info -->
      <q-card-section v-else-if="jobData" class="q-pa-sm">
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Office</div>
            <div class="q-pa-xs text-12 text-weight-medium bg-grey-2 rounded-borders">
              {{ jobData.Office || '-' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Position</div>
            <div class="q-pa-xs text-12 text-weight-medium bg-grey-2 rounded-borders">
              {{ jobData.Position || '-' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Division</div>
            <div class="q-pa-xs text-12 text-weight-medium bg-grey-2 rounded-borders">
              {{ jobData.Division || '-' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Unit</div>
            <div class="q-pa-xs text-12 text-weight-medium bg-grey-2 rounded-borders">
              {{ jobData.Unit || '-' }}
            </div>
          </div>
        </div>

        <!-- Qualifications Section -->
        <q-separator class="q-my-sm" />
        <div class="text-subtitle2 q-mb-sm text-weight-medium">
          <q-icon name="school" class="q-mr-xs" />
          Minimum Qualifications
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Education</div>
            <div class="q-pa-xs text-12 bg-blue-1 rounded-borders">
              {{ qualifications.Education || 'Not specified' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Experience</div>
            <div class="q-pa-xs text-12 bg-blue-1 rounded-borders">
              {{ qualifications.Experience || 'Not specified' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Training</div>
            <div class="q-pa-xs text-12 bg-blue-1 rounded-borders">
              {{ qualifications.Training || 'Not specified' }}
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-11 text-grey-8 q-mb-xs">Eligibility</div>
            <div class="q-pa-xs text-12 bg-blue-1 rounded-borders">
              {{ qualifications.Eligibility || 'Not specified' }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <!-- Criteria -->
      <q-card-section v-if="showRatingTable && !loading" class="criteria-section">
        <div class="row q-mb-sm">
          <div class="col-12">
            <!-- Action buttons based on mode -->
            <div class="float-right">
              <template v-if="mode === 'view'">
                <q-btn
                  color="primary"
                  icon="edit"
                  label="Edit Criteria"
                  @click="switchToEditMode"
                  unelevated
                  dense
                  class="q-px-md q-py-xs text-12 q-mr-sm"
                />
              </template>
              <template v-else-if="mode === 'edit' || mode === 'create'">
                <q-btn
                  color="primary"
                  icon="save"
                  label="Save Criteria"
                  :loading="criteriaStore.loading"
                  :disable="totalWeight !== 100"
                  @click="confirmSave"
                  unelevated
                  dense
                  class="q-px-md q-py-xs text-12"
                />
              </template>
            </div>

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
          <template v-for="section in sections" :key="section.key">
            <div class="col">
              <q-card flat bordered class="criteria-card">
                <q-card-section class="criteria-header bg-blue-1 q-py-xs">
                  <div class="row items-center justify-between">
                    <div class="col">
                      <div class="text-subtitle2 text-weight-medium text-12">
                        <q-icon :name="section.icon" size="xs" class="q-mr-xs" />
                        {{ section.label }}
                      </div>
                    </div>
                    <div class="col-auto">
                      <div class="percentage-wrapper">
                        <q-input
                          v-model.number="editableCriteria[section.key].weight"
                          type="number"
                          min="0"
                          max="100"
                          dense
                          outlined
                          class="weight-input text-12"
                          @update:model-value="validatePercentage(section.key)"
                          :readonly="mode === 'view'"
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
                  <!-- Required label -->
                  <div class="q-mb-xs text-weight-medium text-12 text-bold">
                    <span class="text-grey-9">Description:</span>
                  </div>

                  <!-- Main Description -->
                  <q-input
                    v-model="editableCriteria[section.key].description"
                    label="Description"
                    dense
                    outlined
                    autogrow
                    class="modern-input text-12 q-mb-xs"
                    :readonly="mode === 'view'"
                  />

                  <!-- Additional Descriptions -->
                  <template v-if="mode === 'view'">
                    <!-- View mode: Show comma-separated descriptions as read-only -->
                    <div
                      v-if="getCommaSeparatedDescriptions(section.key).length > 0"
                      class="q-mt-sm"
                    >
                      <!-- <div class="text-11 text-grey-8 q-mb-xs text-weight-medium">
                        Additional Descriptions:
                      </div> -->
                      <div
                        v-for="(desc, idx) in getCommaSeparatedDescriptions(section.key)"
                        :key="`${section.key}-comma-desc-${idx}`"
                        class="q-mb-xs"
                      >
                        <q-input
                          :model-value="desc"
                          :label="`Description ${idx + 2}`"
                          dense
                          outlined
                          autogrow
                          class="modern-input text-12 comma-desc-input"
                          readonly
                          bg-color="grey-1"
                        />
                      </div>
                    </div>
                  </template>

                  <template v-else-if="mode === 'edit' || mode === 'create'">
                    <!-- Edit/Create mode: Show editable additional fields -->
                    <div
                      v-if="editableCriteria[section.key].additionalFields.length > 0"
                      class="q-mt-sm"
                    >
                      <!-- <div class="text-11 text-grey-8 q-mb-xs text-weight-medium">
                        Additional Descriptions:
                      </div> -->
                      <div
                        v-for="(field, idx) in editableCriteria[section.key].additionalFields"
                        :key="section.key + '-edit-desc-' + idx"
                        class="row items-center q-mb-xs q-gutter-xs"
                      >
                        <div class="col">
                          <q-input
                            v-model="editableCriteria[section.key].additionalFields[idx]"
                            :label="`Description ${idx + 2}`"
                            dense
                            outlined
                            autogrow
                            class="modern-input text-12"
                          />
                        </div>
                        <div style="width: 36px">
                          <q-btn
                            icon="remove"
                            color="negative"
                            flat
                            round
                            class="remove-btn"
                            @click="removeAdditionalDescription(section.key, idx)"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Add Description Button -->
                    <div class="row justify-center q-mt-sm">
                      <q-btn
                        color="primary"
                        icon="add"
                        flat
                        class="q-mb-xs q-mt-xs text-12 font-weight-medium"
                        @click="addAdditionalDescription(section.key)"
                      >
                        Add Description
                      </q-btn>
                    </div>
                  </template>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </div>
      </q-card-section>

      <q-card-section
        v-if="!showRatingTable && !loading"
        class="text-center q-pa-md bg-blue-1 rounded-borders empty-state-card"
      >
        <q-icon name="tune" size="2rem" color="primary" class="q-mb-xs" />
        <div class="text-h6 q-mb-xs text-12">No available data</div>
        <div class="text-caption">Please ensure job data is loaded properly</div>
      </q-card-section>
    </q-card>

    <!-- Confirm Save Dialog -->
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
                <q-item-label class="text-12">{{ jobData?.Position }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="business" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-12">Office</q-item-label>
                <q-item-label class="text-12">{{ jobData?.Office }}</q-item-label>
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

<script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import { useQuasar } from 'quasar';
  import { useCriteriaStore } from 'stores/criteriaStore';
  import { useJobPostStore } from 'stores/jobPostStore';

  // Props
  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    positionId: { type: String, default: null },
    itemNo: { type: String, default: null },
    mode: { type: String, default: 'create' }, // 'create', 'view', 'edit'
  });

  // Emits
  const emit = defineEmits(['update:modelValue', 'saved', 'switch-to-edit']);

  // Quasar
  const $q = useQuasar();

  // Store
  const criteriaStore = useCriteriaStore();
  const jobPostStore = useJobPostStore();

  // State
  const show = ref(props.modelValue);
  const confirmDialog = ref(false);
  const showRatingTable = ref(false);
  const loading = ref(false);
  const jobData = ref(null);
  const qualifications = ref({});
  const existingCriteria = ref(null);
  const originalDescriptions = ref({});

  const baseCriteria = {
    education: { weight: 20, title: '', description: '', additionalFields: [] },
    experience: { weight: 20, title: '', description: '', additionalFields: [] },
    training: { weight: 15, title: '', description: '', additionalFields: [] },
    performance: { weight: 15, title: '', description: '', additionalFields: [] },
    bei: { weight: 30, title: '', description: '', additionalFields: [] },
  };

  const editableCriteria = ref(JSON.parse(JSON.stringify(baseCriteria)));

  const sections = [
    { key: 'education', label: 'Education', icon: 'school' },
    { key: 'experience', label: 'Experience', icon: 'work_history' },
    { key: 'training', label: 'Training', icon: 'card_membership' },
    { key: 'performance', label: 'Performance', icon: 'leaderboard' },
    { key: 'bei', label: 'BEI', icon: 'record_voice_over' },
  ];

  // Computed
  const totalWeight = computed(() => {
    if (!editableCriteria.value) return 0;
    return (
      (editableCriteria.value.education.weight || 0) +
      (editableCriteria.value.experience.weight || 0) +
      (editableCriteria.value.training.weight || 0) +
      (editableCriteria.value.performance.weight || 0) +
      (editableCriteria.value.bei.weight || 0)
    );
  });

  // Watchers
  watch(
    () => props.modelValue,
    (val) => {
      show.value = val;
      if (val && props.positionId && props.itemNo) {
        fetchJobData();
      }
    },
  );

  watch(show, (val) => emit('update:modelValue', val));

  // Watch for changes in positionId and itemNo
  watch(
    () => [props.positionId, props.itemNo],
    ([newPositionId, newItemNo]) => {
      if (show.value && newPositionId && newItemNo) {
        fetchJobData();
      }
    },
    { immediate: true },
  );

  // Methods
  async function fetchJobData() {
    if (!props.positionId || !props.itemNo) return;

    loading.value = true;
    showRatingTable.value = false;

    try {
      // Fetch job post data
      const jobResponse = await jobPostStore.fetchJobPostByPositionAndItemNo(
        props.positionId,
        props.itemNo,
      );
      jobData.value = jobResponse;

      // Fetch qualifications/criteria data
      const criteriaResponse = await jobPostStore.fetchCriteriaByPositionAndItemNo(
        props.positionId,
        props.itemNo,
      );
      qualifications.value = criteriaResponse;

      // If in view or edit mode, try to fetch existing criteria
      if (props.mode === 'view' || props.mode === 'edit') {
        try {
          // Assuming there's a method to get existing criteria ratings
          const existingResponse = await criteriaStore.viewCriteria(jobData.value.id);
          existingCriteria.value = existingResponse;
          if (existingResponse) {
            editableCriteria.value = convertApiCriteriaToModalFormat(existingResponse);
          }
        } catch {
          console.log('No existing criteria found, using default');
          editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
        }
      } else {
        // Create mode - use default criteria
        editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
      }

      showRatingTable.value = true;
    } catch (error) {
      console.error('Error fetching job data:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to load job information',
      });
      showRatingTable.value = false;
    } finally {
      loading.value = false;
    }
  }

  function getCommaSeparatedDescriptions(sectionKey) {
    // Only show comma-separated descriptions in view mode
    if (props.mode !== 'view') return [];

    const originalDesc = originalDescriptions.value[sectionKey];
    if (!originalDesc || !originalDesc.includes(',')) return [];

    return originalDesc
      .split(',')
      .map((desc) => desc.trim())
      .filter((desc) => desc !== '')
      .slice(1); // Skip the first one as it's shown in the main description field
  }

  function getModalTitle() {
    switch (props.mode) {
      case 'view':
        return 'View';
      case 'edit':
        return 'Edit';
      case 'create':
      default:
        return 'Create';
    }
  }

  function convertApiCriteriaToModalFormat(apiCriteria) {
    const result = JSON.parse(JSON.stringify(baseCriteria));
    const criteriaKeys = ['education', 'experience', 'training', 'performance'];

    // Reset original descriptions
    originalDescriptions.value = {};

    criteriaKeys.forEach((key) => {
      let criteriaSection =
        apiCriteria[key] || apiCriteria[key.charAt(0).toUpperCase() + key.slice(1)];

      if (criteriaSection) {
        if (Array.isArray(criteriaSection) && criteriaSection.length > 0) {
          const criteriaItem = criteriaSection[0];
          result[key].weight = parseInt(
            criteriaItem.Rate || criteriaItem.weight || result[key].weight,
          );
          const description = criteriaItem.description || '';
          originalDescriptions.value[key] = description;

          // Handle comma-separated descriptions
          if (description.includes(',')) {
            const parts = description
              .split(',')
              .map((part) => part.trim())
              .filter((part) => part !== '');
            result[key].description = parts[0] || '';
            // Convert comma-separated parts to additionalFields for editing
            result[key].additionalFields = [...parts.slice(1)];
          } else {
            result[key].description = description;
            result[key].additionalFields = [];
          }

          result[key].title = criteriaItem.Title || criteriaItem.title || '';

          // Add any additional items from the array
          if (criteriaSection.length > 1) {
            const additionalItems = criteriaSection
              .slice(1)
              .map((item) => item.description || '')
              .filter((desc) => desc.trim() !== '');
            result[key].additionalFields = [...result[key].additionalFields, ...additionalItems];
          }
        } else if (typeof criteriaSection === 'object') {
          result[key].weight = parseInt(
            criteriaSection.Rate || criteriaSection.weight || result[key].weight,
          );
          const description = criteriaSection.description || '';
          originalDescriptions.value[key] = description;

          // Handle comma-separated descriptions
          if (description.includes(',')) {
            const parts = description
              .split(',')
              .map((part) => part.trim())
              .filter((part) => part !== '');
            result[key].description = parts[0] || '';
            result[key].additionalFields = [...parts.slice(1)];
          } else {
            result[key].description = description;
            result[key].additionalFields = [];
          }
          result[key].title = criteriaSection.Title || criteriaSection.title || '';
        }
      }
    });

    // Handle BEI section similarly
    let beiSection =
      apiCriteria.behavioral || apiCriteria.Behavioral || apiCriteria.bei || apiCriteria.BEI;

    if (beiSection) {
      if (Array.isArray(beiSection) && beiSection.length > 0) {
        const behavioralItem = beiSection[0];
        result.bei.weight = parseInt(
          behavioralItem.Rate || behavioralItem.weight || result.bei.weight,
        );
        const description = behavioralItem.description || '';
        originalDescriptions.value.bei = description;

        // Handle comma-separated descriptions
        if (description.includes(',')) {
          const parts = description
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part !== '');
          result.bei.description = parts[0] || '';
          result.bei.additionalFields = [...parts.slice(1)];
        } else {
          result.bei.description = description;
          result.bei.additionalFields = [];
        }

        result.bei.title = behavioralItem.Title || behavioralItem.title || '';

        if (beiSection.length > 1) {
          const additionalItems = beiSection
            .slice(1)
            .map((item) => item.description || '')
            .filter((desc) => desc.trim() !== '');
          result.bei.additionalFields = [...result.bei.additionalFields, ...additionalItems];
        }
      } else if (typeof beiSection === 'object') {
        result.bei.weight = parseInt(beiSection.Rate || beiSection.weight || result.bei.weight);
        const description = beiSection.description || '';
        originalDescriptions.value.bei = description;

        // Handle comma-separated descriptions
        if (description.includes(',')) {
          const parts = description
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part !== '');
          result.bei.description = parts[0] || '';
          result.bei.additionalFields = [...parts.slice(1)];
        } else {
          result.bei.description = description;
          result.bei.additionalFields = [];
        }
        result.bei.title = beiSection.Title || beiSection.title || '';
      }
    }

    return result;
  }

  // New methods for handling additional descriptions
  function addAdditionalDescription(section) {
    editableCriteria.value[section].additionalFields.push('');
  }

  function removeAdditionalDescription(section, idx) {
    editableCriteria.value[section].additionalFields.splice(idx, 1);
  }

  // Legacy methods for backward compatibility
  // function addField(section) {
  //   addAdditionalDescription(section);
  // }

  // function removeField(section, idx) {
  //   removeAdditionalDescription(section, idx);
  // }

  function closeModal() {
    show.value = false;
  }

  function switchToEditMode() {
    closeModal();
    nextTick(() => {
      emit('switch-to-edit', props.positionId, props.itemNo);
    });
  }

  function confirmSave() {
    if (totalWeight.value !== 100) {
      $q.notify({
        type: 'warning',
        message: 'The total weight must equal 100% before saving.',
      });
      return;
    }
    confirmDialog.value = true;
  }

  async function saveRatings() {
    try {
      const jobBatchesRspIds = [jobData.value?.id].filter(Boolean);

      if (jobBatchesRspIds.length === 0) {
        throw new Error('No valid job ID found');
      }

      // Prepare criteria data for saving
      const criteriaToSave = {};
      Object.keys(editableCriteria.value).forEach((key) => {
        const criteria = editableCriteria.value[key];
        criteriaToSave[key] = {
          weight: criteria.weight,
          title: criteria.title,
          description: criteria.description,
          additionalFields: criteria.additionalFields.filter((field) => field && field.trim()),
        };
      });

      await criteriaStore.saveCriteria({
        jobBatchesRspIds,
        criteria: criteriaToSave,
      });

      $q.notify({ type: 'positive', message: 'Criteria saved successfully!' });
      emit('saved');
      closeModal();
    } catch (error) {
      console.error('Save criteria error:', error);
      $q.notify({
        type: 'negative',
        message: error.message || 'Failed to save criteria. Please try again.',
      });
    }
  }

  function validatePercentage(field) {
    const value = editableCriteria.value[field].weight;
    if (value < 0) {
      editableCriteria.value[field].weight = 0;
    } else if (value > 100) {
      editableCriteria.value[field].weight = 100;
    }
  }
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

  .text-11 {
    font-size: 11px !important;
    line-height: 1.3;
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

  .comma-desc-input .q-field__control {
    background-color: #f5f5f5;
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

  .float-right {
    float: right;
  }

  .criteria-section {
    animation: fadeIn 0.3s ease;
  }

  .remove-btn {
    min-width: 32px;
    height: 32px;
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

  /* Ensure proper spacing and alignment */
  .q-gutter-xs > .col {
    padding: 2px;
  }

  .q-mb-xs {
    margin-bottom: 4px;
  }

  .q-mt-xs {
    margin-top: 4px;
  }

  .q-mt-sm {
    margin-top: 8px;
  }

  /* Make sure inputs are properly sized */
  .modern-input :deep(.q-field__control) {
    min-height: 28px;
  }

  .modern-input :deep(.q-field__native) {
    min-height: 20px;
  }
</style>
