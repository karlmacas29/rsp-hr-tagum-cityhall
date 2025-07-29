<template>
  <q-dialog v-model="show" persistent>
    <q-card style="max-width: 1200px; width: 95vw">
      <!-- Sticky Header -->
      <q-card-section class="row items-center q-pa-sm bg-primary text-white sticky-header">
        <div class="text-h6">
          {{ isEditMode ? 'Edit' : existingCriteria ? 'View' : 'Create' }} Rating Criteria
        </div>
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
            <template v-if="isEditMode || !existingCriteria">
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
            </template>
            <template v-else>
              <q-btn
                color="primary"
                icon="edit"
                label="Edit Criteria"
                @click="enableEditMode"
                unelevated
                dense
                class="q-px-md q-py-xs save-btn float-right text-12"
              />
            </template>

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
                          :readonly="!isEditMode && existingCriteria"
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
                  <!-- Title as plain text, NOT an input box -->
                  <div class="q-mb-xs text-weight-medium text-12 text-bold">
                    <span class="text-grey-9">Required:</span>
                  </div>
                  <q-input
                    v-model="editableCriteria[section.key].description"
                    label="Description"
                    dense
                    outlined
                    autogrow
                    class="modern-input text-12 q-mb-xs"
                    :readonly="!isEditMode && existingCriteria"
                  />
                  <div
                    class="q-mt-sm"
                    v-if="
                      isEditMode ||
                      !existingCriteria ||
                      editableCriteria[section.key].additionalFields.length > 0
                    "
                  >
                    <div
                      v-for="(field, idx) in editableCriteria[section.key].additionalFields"
                      :key="section.key + '-add-' + idx"
                      class="row items-center q-mb-xs q-gutter-xs"
                    >
                      <div class="col">
                        <q-input
                          v-model="editableCriteria[section.key].additionalFields[idx]"
                          label="Additional Field"
                          dense
                          outlined
                          autogrow
                          class="modern-input text-12"
                          :readonly="!isEditMode && existingCriteria"
                        />
                      </div>
                      <div style="width: 36px" v-if="isEditMode || !existingCriteria">
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
                    <div class="row justify-center" v-if="isEditMode || !existingCriteria">
                      <q-btn
                        color="primary"
                        icon="add"
                        flat
                        class="q-mb-xs q-mt-xs text-12 font-weight-medium"
                        @click="addField(section.key)"
                      >
                        Add
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </div>
      </q-card-section>

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

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { useCriteriaStore } from 'stores/criteriaStore';

  // Props
  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    job: { type: Object, default: null },
    criteria: { type: Object, default: null },
  });

  // Emits
  const emit = defineEmits(['update:modelValue', 'saved']);

  // Quasar
  const $q = useQuasar();

  // Store
  const criteriaStore = useCriteriaStore();

  // State
  const show = ref(props.modelValue);
  const loading = ref(false);
  const showRatingTable = ref(false);
  const confirmDialog = ref(false);
  const isEditMode = ref(false);
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
    bei: { weight: 10, title: '', description: '', additionalFields: [] },
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

  const existingCriteria = computed(() => {
    return props.criteria && Object.keys(props.criteria).length > 0;
  });

  // Watchers
  watch(
    () => props.modelValue,
    (val) => {
      show.value = val;
      if (val) {
        // Reset edit mode when dialog opens
        isEditMode.value = false;
      }
    },
  );

  watch(show, (val) => emit('update:modelValue', val));

  watch(
    () => props.job,
    (job) => {
      if (job) {
        formData.value.office = job.Office || '';
        formData.value.position = job.Position || '';
        formData.value.salaryGrade = job.salaryGrade || job.SalaryGrade || '';
        formData.value.plantillaItemNo = job.ItemNo || job.ItemNo || '';
        showRatingTable.value = !!(formData.value.office && formData.value.position);
      } else {
        formData.value.office = null;
        formData.value.position = null;
        formData.value.salaryGrade = '';
        formData.value.plantillaItemNo = '';
        showRatingTable.value = false;
      }
    },
    { immediate: true },
  );

  watch(
    () => props.criteria,
    (criteria) => {
      if (criteria && Object.keys(criteria).length > 0) {
        // Map the API response to our editableCriteria format
        editableCriteria.value = {
          education: {
            weight: parseFloat(criteria.education?.[0]?.Rate) || 0,
            title: criteria.education?.[0]?.description?.split('->')[0]?.trim() || '',
            description: criteria.education?.[0]?.description || '',
            additionalFields: criteria.education?.[0]?.description?.split('\n').slice(1) || [],
          },
          experience: {
            weight: parseFloat(criteria.experience?.[0]?.Rate) || 0,
            title: criteria.experience?.[0]?.description?.split('->')[0]?.trim() || '',
            description: criteria.experience?.[0]?.description || '',
            additionalFields: criteria.experience?.[0]?.description?.split('\n').slice(1) || [],
          },
          training: {
            weight: parseFloat(criteria.training?.[0]?.Rate) || 0,
            title: criteria.training?.[0]?.description?.split('->')[0]?.trim() || '',
            description: criteria.training?.[0]?.description || '',
            additionalFields: criteria.training?.[0]?.description?.split('\n').slice(1) || [],
          },
          performance: {
            weight: parseFloat(criteria.performance?.[0]?.Rate) || 0,
            title: criteria.performance?.[0]?.description?.split('->')[0]?.trim() || '',
            description: criteria.performance?.[0]?.description || '',
            additionalFields: criteria.performance?.[0]?.description?.split('\n').slice(1) || [],
          },
          bei: {
            weight: parseFloat(criteria.behavioral?.[0]?.Rate) || 0,
            title: criteria.behavioral?.[0]?.description?.split('->')[0]?.trim() || '',
            description: criteria.behavioral?.[0]?.description || '',
            additionalFields: criteria.behavioral?.[0]?.description?.split('\n').slice(1) || [],
          },
        };
      } else {
        // Reset to base criteria if no existing criteria
        editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
      }
    },
    { immediate: true },
  );

  // Methods
  function addField(section) {
    editableCriteria.value[section].additionalFields.push('');
  }

  function removeField(section, idx) {
    editableCriteria.value[section].additionalFields.splice(idx, 1);
  }

  function closeModal() {
    show.value = false;
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
    loading.value = true;
    try {
      // Use id or JobBatchesRspId for job_batches_rsp_id array
      const jobBatchesRspIds = [props.job?.id || props.job?.JobBatchesRspId].filter(Boolean);
      await criteriaStore.saveCriteria({
        jobBatchesRspIds,
        criteria: editableCriteria.value,
      });
      $q.notify({ type: 'positive', message: 'Criteria saved!' });
      emit('saved');
      isEditMode.value = false;
      closeModal();
    } catch {
      // handled by store
    } finally {
      loading.value = false;
    }
  }

  function validatePercentage(field) {
    if (editableCriteria.value[field].weight < 0) {
      editableCriteria.value[field].weight = 0;
    } else if (editableCriteria.value[field].weight > 100) {
      editableCriteria.value[field].weight = 100;
    }
  }

  function enableEditMode() {
    isEditMode.value = true;
  }

  // Lifecycle
  onMounted(() => {
    editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
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
s
