<template>
  <q-dialog v-model="show" persistent>
    <q-card style="max-width: 1200px; width: 95vw">
      <!-- Sticky Header -->
      <q-card-section class="row items-center q-pa-sm bg-primary text-white sticky-header">
        <div class="text-h6">{{ getModalTitle() }} Rating Criteria</div>
        <q-space />
        <q-btn icon="close" flat dense @click="closeModal" />
      </q-card-section>

      <!-- Display selected job info -->
      <q-card-section class="q-pa-sm">
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

      <!-- Debug Info (remove in production) -->
      <q-card-section class="q-pa-sm bg-grey-1" v-if="debugMode">
        <div class="text-caption">
          Debug: showRatingTable={{ showRatingTable }}, mode={{ mode }}, hasJobData={{
            !!(formData.office && formData.position)
          }}, criteriaCount={{ Object.keys(editableCriteria).length }}
        </div>
        <div class="text-caption q-mt-xs">
          Additional Fields Debug:
          <pre class="text-10">{{ JSON.stringify(editableCriteria, null, 2) }}</pre>
        </div>
      </q-card-section>

      <!-- Criteria -->
      <q-card-section v-if="showRatingTable" class="criteria-section">
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
                  <!-- Min Qualification (readonly) -->
                  <q-input
                    :model-value="criteriaFields[section.key]"
                    label="Min Qualification"
                    dense
                    outlined
                    autogrow
                    class="q-mb-xs modern-input text-12"
                    readonly
                    v-if="
                      section.key === 'education' ||
                      section.key === 'experience' ||
                      section.key === 'training'
                    "
                  />

                  <!-- Required label -->
                  <div class="q-mb-xs text-weight-medium text-12 text-bold">
                    <span class="text-grey-9">Required:</span>
                  </div>

                  <!-- Description -->
                  <q-input
                    v-model="editableCriteria[section.key].description"
                    label="Description"
                    dense
                    outlined
                    autogrow
                    class="modern-input text-12 q-mb-xs"
                    :readonly="mode === 'view'"
                  />

                  <!-- Additional Fields -->
                  <div
                    class="q-mt-sm"
                    v-if="
                      editableCriteria[section.key].additionalFields.length > 0 ||
                      mode === 'edit' ||
                      mode === 'create'
                    "
                  >
                    <!-- Show additional fields in view mode -->
                    <template v-if="mode === 'view'">
                      <div
                        v-for="(field, idx) in getFilteredAdditionalFields(section.key)"
                        :key="section.key + '-view-' + idx"
                        class="q-mb-xs"
                      >
                        <q-input
                          :model-value="field"
                          :label="`Additional Field ${idx + 1}`"
                          dense
                          outlined
                          autogrow
                          class="modern-input text-12"
                          readonly
                        />
                      </div>
                    </template>

                    <!-- Show additional fields in edit/create mode -->
                    <template v-else>
                      <div
                        v-for="(field, idx) in editableCriteria[section.key].additionalFields"
                        :key="section.key + '-add-' + idx"
                        class="row items-center q-mb-xs q-gutter-xs"
                      >
                        <div class="col">
                          <q-input
                            v-model="editableCriteria[section.key].additionalFields[idx]"
                            :label="`Additional Field ${idx + 1}`"
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
                            @click="removeField(section.key, idx)"
                          />
                        </div>
                      </div>
                      <div class="row justify-center">
                        <q-btn
                          color="primary"
                          icon="add"
                          flat
                          class="q-mb-xs q-mt-xs text-12 font-weight-medium"
                          @click="addField(section.key)"
                        >
                          Add Field
                        </q-btn>
                      </div>
                    </template>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </div>
      </q-card-section>

      <q-card-section v-else class="text-center q-pa-md bg-blue-1 rounded-borders empty-state-card">
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

<script setup>
  import { ref, computed, watch, onMounted, nextTick } from 'vue';
  import { useQuasar } from 'quasar';
  import { useCriteriaStore } from 'stores/criteriaStore';

  // Props
  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    job: { type: Object, default: null },
    criteria: { type: Object, default: null },
    mode: { type: String, default: 'create' }, // 'create', 'view', 'edit'
  });

  // Emits
  const emit = defineEmits(['update:modelValue', 'saved', 'switch-to-edit']);

  // Quasar
  const $q = useQuasar();

  // Store
  const criteriaStore = useCriteriaStore();

  // State
  const show = ref(props.modelValue);
  const confirmDialog = ref(false);
  const showRatingTable = ref(false);
  const debugMode = ref(true); // Set to true for debugging
  const formData = ref({
    office: null,
    position: null,
    salaryGrade: '',
    plantillaItemNo: '',
  });

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

  const criteriaFields = computed(() => ({
    education:
      (props.criteria && (props.criteria.Education || props.criteria.education)) ||
      (props.job && (props.job.Education || props.job.education)) ||
      '',
    experience:
      (props.criteria && (props.criteria.Experience || props.criteria.experience)) ||
      (props.job && (props.job.Experience || props.job.experience)) ||
      '',
    training:
      (props.criteria && (props.criteria.Training || props.criteria.training)) ||
      (props.job && (props.job.Training || props.job.training)) ||
      '',
  }));

  // Watchers
  watch(
    () => props.modelValue,
    (val) => {
      show.value = val;
    },
  );

  watch(show, (val) => emit('update:modelValue', val));

  watch(
    () => props.job,
    async (job) => {
      console.log('Job prop changed:', job);
      if (job) {
        // Handle different possible field names - be more flexible
        formData.value.office = job.office || job.Office || '';
        formData.value.position = job.Position || job.position || '';
        formData.value.salaryGrade = job.salaryGrade || job.SalaryGrade || job.salary_grade || '';
        formData.value.plantillaItemNo = job.ItemNo || job.plantillaItemNo || job.item_no || '';

        // Wait for next tick to ensure DOM updates
        await nextTick();

        // Always show rating table if we have office and position
        showRatingTable.value = !!(formData.value.office && formData.value.position);

        console.log('Form data updated:', formData.value);
        console.log('Show rating table:', showRatingTable.value);
      } else {
        formData.value.office = null;
        formData.value.position = null;
        formData.value.salaryGrade = '';
        formData.value.plantillaItemNo = '';
        showRatingTable.value = false;
      }
    },
    { immediate: true, deep: true },
  );

  watch(
    () => props.criteria,
    (criteria) => {
      console.log('Criteria prop changed:', criteria);
      console.log('Current mode:', props.mode);

      if (criteria && Object.keys(criteria).length > 0) {
        console.log('Converting API criteria to modal format');
        editableCriteria.value = convertApiCriteriaToModalFormat(criteria);
      } else {
        console.log('Using base criteria');
        editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
      }

      // Post-process to split comma-separated descriptions
      Object.keys(editableCriteria.value).forEach((key) => {
        const section = editableCriteria.value[key];
        if (
          section.description &&
          section.description.includes(',') &&
          section.additionalFields.length === 0
        ) {
          const parts = section.description
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part !== '');
          if (parts.length > 1) {
            section.description = parts[0];
            section.additionalFields = parts.slice(1);
          }
        }
      });

      console.log('Final editable criteria:', editableCriteria.value);
    },
    { immediate: true, deep: true },
  );

  // Watch mode changes
  watch(
    () => props.mode,
    (newMode) => {
      console.log('Mode changed to:', newMode);
      // Force reactivity update
      nextTick(() => {
        // This will trigger re-render
      });
    },
    { immediate: true },
  );

  // Methods
  // Methods
  function getFilteredAdditionalFields(sectionKey) {
    const fields = editableCriteria.value[sectionKey]?.additionalFields || [];
    return fields.filter((field) => field && field.trim());
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
    console.log('Converting API criteria:', apiCriteria);
    const result = JSON.parse(JSON.stringify(baseCriteria));

    // Handle each criteria section
    const criteriaKeys = ['education', 'experience', 'training', 'performance'];

    criteriaKeys.forEach((key) => {
      // Try different possible structures
      let criteriaSection =
        apiCriteria[key] || apiCriteria[key.charAt(0).toUpperCase() + key.slice(1)];

      if (criteriaSection) {
        if (Array.isArray(criteriaSection) && criteriaSection.length > 0) {
          const criteriaItem = criteriaSection[0]; // Get first item from array
          result[key].weight = parseInt(
            criteriaItem.Rate || criteriaItem.weight || result[key].weight,
          );
          result[key].description = criteriaItem.description || '';
          result[key].title = criteriaItem.Title || criteriaItem.title || '';

          // For additional fields, check if there are more items in the array
          if (criteriaSection.length > 1) {
            result[key].additionalFields = criteriaSection
              .slice(1)
              .map((item) => item.description || '')
              .filter((desc) => desc.trim() !== ''); // Filter out empty descriptions
          }
        } else if (typeof criteriaSection === 'object') {
          // Handle direct object format
          result[key].weight = parseInt(
            criteriaSection.Rate || criteriaSection.weight || result[key].weight,
          );

          // Check if description contains multiple items separated by commas
          const description = criteriaSection.description || '';
          if (description.includes(',')) {
            // Split by comma and treat first as main description, rest as additional fields
            const parts = description
              .split(',')
              .map((part) => part.trim())
              .filter((part) => part !== '');
            result[key].description = parts[0] || '';
            result[key].additionalFields = parts.slice(1);
          } else {
            result[key].description = description;
          }

          result[key].title = criteriaSection.Title || criteriaSection.title || '';
        }
      }
    });

    // Handle behavioral/bei (special case)
    let beiSection =
      apiCriteria.behavioral || apiCriteria.Behavioral || apiCriteria.bei || apiCriteria.BEI;

    if (beiSection) {
      if (Array.isArray(beiSection) && beiSection.length > 0) {
        const behavioralItem = beiSection[0];
        result.bei.weight = parseInt(
          behavioralItem.Rate || behavioralItem.weight || result.bei.weight,
        );
        result.bei.description = behavioralItem.description || '';
        result.bei.title = behavioralItem.Title || behavioralItem.title || '';

        if (beiSection.length > 1) {
          result.bei.additionalFields = beiSection
            .slice(1)
            .map((item) => item.description || '')
            .filter((desc) => desc.trim() !== '');
        }
      } else if (typeof beiSection === 'object') {
        result.bei.weight = parseInt(beiSection.Rate || beiSection.weight || result.bei.weight);

        // Check if description contains multiple items separated by commas
        const description = beiSection.description || '';
        if (description.includes(',')) {
          // Split by comma and treat first as main description, rest as additional fields
          const parts = description
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part !== '');
          result.bei.description = parts[0] || '';
          result.bei.additionalFields = parts.slice(1);
        } else {
          result.bei.description = description;
        }

        result.bei.title = beiSection.Title || beiSection.title || '';
      }
    }

    console.log('Converted result:', result);
    return result;
  }

  function addField(section) {
    editableCriteria.value[section].additionalFields.push('');
  }

  function removeField(section, idx) {
    editableCriteria.value[section].additionalFields.splice(idx, 1);
  }

  function closeModal() {
    show.value = false;
  }

  function switchToEditMode() {
    // Close current modal and emit to parent to reopen in edit mode
    closeModal();
    // Use nextTick to ensure modal is fully closed before reopening
    nextTick(() => {
      emit('switch-to-edit', props.job);
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
      // Use id or JobBatchesRspId for job_batches_rsp_id array
      const jobBatchesRspIds = [props.job?.id || props.job?.JobBatchesRspId].filter(Boolean);

      if (jobBatchesRspIds.length === 0) {
        throw new Error('No valid job ID found');
      }

      await criteriaStore.saveCriteria({
        jobBatchesRspIds,
        criteria: editableCriteria.value,
      });

      $q.notify({ type: 'positive', message: 'Criteria saved successfully!' });
      emit('saved');
      closeModal();
    } catch (error) {
      console.error('Error saving criteria:', error);
      $q.notify({
        type: 'negative',
        message: error.message || 'Failed to save criteria. Please try again.',
      });
    }
  }

  function validatePercentage(field) {
    if (editableCriteria.value[field].weight < 0) {
      editableCriteria.value[field].weight = 0;
    } else if (editableCriteria.value[field].weight > 100) {
      editableCriteria.value[field].weight = 100;
    }
  }

  // Initialize data when modal opens
  function initializeModalData() {
    console.log('Initializing modal data...');

    // Set form data from job
    if (props.job) {
      formData.value.office = props.job.office || props.job.Office || '';
      formData.value.position = props.job.Position || props.job.position || '';
      formData.value.salaryGrade =
        props.job.salaryGrade || props.job.SalaryGrade || props.job.salary_grade || '';
      formData.value.plantillaItemNo =
        props.job.ItemNo || props.job.plantillaItemNo || props.job.item_no || '';
    }

    // Set criteria data
    if (props.criteria && Object.keys(props.criteria).length > 0) {
      editableCriteria.value = convertApiCriteriaToModalFormat(props.criteria);
    } else {
      editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
    }

    // Post-process to split comma-separated descriptions
    Object.keys(editableCriteria.value).forEach((key) => {
      const section = editableCriteria.value[key];
      if (
        section.description &&
        section.description.includes(',') &&
        section.additionalFields.length === 0
      ) {
        const parts = section.description
          .split(',')
          .map((part) => part.trim())
          .filter((part) => part !== '');
        if (parts.length > 1) {
          section.description = parts[0];
          section.additionalFields = parts.slice(1);
        }
      }
    });

    // Determine if we should show the rating table
    showRatingTable.value = !!(formData.value.office && formData.value.position);

    console.log('Modal initialized:', {
      formData: formData.value,
      showRatingTable: showRatingTable.value,
      editableCriteria: editableCriteria.value,
      mode: props.mode,
    });
  }

  // Lifecycle
  onMounted(() => {
    console.log('Modal mounted with props:', {
      job: props.job,
      criteria: props.criteria,
      mode: props.mode,
    });

    initializeModalData();
  });

  // Watch for when modal is opened
  watch(show, (isOpen) => {
    if (isOpen) {
      console.log('Modal opened, reinitializing data...');
      nextTick(() => {
        initializeModalData();
      });
    }
  });
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
