<template>
  <q-dialog v-model="show" persistent>
    <q-card style="max-width: 1600px; width: 95vw">
      <!-- Sticky Header -->
      <q-card-section class="row items-center q-pa-sm bg-primary text-white sticky-header">
        <div class="text-h6">
          {{ getModalTitle() }} Rating Criteria
          <span v-if="sgMin && sgMax" class="q-ml-sm">(SG {{ sgMin }} - {{ sgMax }})</span>
        </div>
        <q-space />
        <q-btn icon="close" flat dense @click="closeModal" />
      </q-card-section>

      <!-- Loading State -->
      <div v-if="loading" class="q-pa-xl text-center">
        <q-spinner size="2rem" color="primary" class="q-mb-sm" />
        <div class="text-subtitle2">Loading criteria information...</div>
      </div>

      <!-- Salary Grade Range Section -->
      <q-card-section v-else-if="showCriteriaForm" class="q-pa-sm">
        <div class="row q-col-gutter-sm q-mb-sm">
          <!-- Salary Grade Min -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="salaryGradeData.sg_min"
              label="Salary Grade (Min)"
              type="number"
              min="1"
              max="33"
              dense
              outlined
              :readonly="mode === 'view' || mode === 'edit'"
              :rules="[(val) => !!val || 'Minimum SG is required']"
              class="q-mb-sm"
            />
          </div>

          <!-- Salary Grade Max -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="salaryGradeData.sg_max"
              label="Salary Grade (Max)"
              type="number"
              min="1"
              max="33"
              dense
              outlined
              :readonly="mode === 'view' || mode === 'edit'"
              :rules="[
                (val) => !!val || 'Maximum SG is required',
                (val) => parseInt(val) >= parseInt(salaryGradeData.sg_min) || 'Max must be >= Min',
              ]"
              class="q-mb-sm"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <!-- Criteria -->
      <q-card-section v-if="showCriteriaForm && !loading" class="criteria-section">
        <div class="row q-mb-sm">
          <div class="col-12">
            <!-- Action buttons based on mode and permission -->
            <div class="float-right">
              <!-- VIEW MODE: Show Edit button only if user has modify permission -->
              <template v-if="mode === 'view'">
                <q-btn
                  v-if="hasPermission"
                  color="primary"
                  icon="edit"
                  label="Edit Criteria"
                  @click="switchToEditMode"
                  unelevated
                  dense
                  class="q-px-md q-py-xs text-12 q-mr-sm"
                />
              </template>

              <!-- EDIT/CREATE MODE: Show Save button only if user has modify permission -->
              <template v-if="(mode === 'edit' || mode === 'create') && hasPermission">
                <q-btn
                  color="primary"
                  icon="save"
                  label="Save Criteria"
                  :loading="criteriaStore.loading"
                  :disable="!isFormValid"
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
                <q-card-section class="criteria-header bg-green-1 q-py-xs">
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
                          :readonly="mode === 'view' || !hasPermission"
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
                  <!-- Breakdown Fields Label -->
                  <div class="q-mb-xs text-weight-medium text-12 text-bold">
                    <span class="text-grey-9">Breakdown Descriptions:</span>
                  </div>

                  <!-- Breakdown Fields with Independent Weights -->
                  <template v-if="mode === 'view' || !hasPermission">
                    <!-- View mode: Show read-only breakdown fields -->
                    <div
                      v-if="editableCriteria[section.key].breakdownFields.length === 0"
                      class="text-center q-pa-sm text-grey-6 text-11"
                    >
                      No breakdown descriptions added
                    </div>
                    <div v-else class="q-mt-xs">
                      <div
                        v-for="(field, idx) in editableCriteria[section.key].breakdownFields"
                        :key="`${section.key}-view-breakdown-${idx}`"
                        class="breakdown-row q-mb-xs"
                      >
                        <div class="row items-start q-gutter-xs">
                          <div class="col">
                            <q-input
                              :model-value="field.description"
                              :label="`Description ${idx + 1}`"
                              dense
                              outlined
                              autogrow
                              class="modern-input text-12"
                              readonly
                              bg-color="grey-1"
                            />
                          </div>
                          <div style="width: 80px">
                            <q-input
                              :model-value="field.weight"
                              type="number"
                              dense
                              outlined
                              class="weight-input text-12"
                              readonly
                              bg-color="grey-1"
                            >
                              <template v-slot:append>
                                <span class="percentage-sign">%</span>
                              </template>
                            </q-input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="(mode === 'edit' || mode === 'create') && hasPermission">
                    <!-- Edit/Create mode: Show editable breakdown fields -->
                    <div
                      v-if="editableCriteria[section.key].breakdownFields.length === 0"
                      class="text-center q-pa-sm text-grey-6 text-11"
                    >
                      No breakdown descriptions yet. Click "Add Breakdown" to start.
                    </div>
                    <div v-else class="q-mt-xs">
                      <div
                        v-for="(field, idx) in editableCriteria[section.key].breakdownFields"
                        :key="`${section.key}-edit-breakdown-${idx}`"
                        class="breakdown-row q-mb-xs"
                      >
                        <div class="row items-start q-gutter-xs">
                          <div class="col">
                            <q-input
                              v-model="
                                editableCriteria[section.key].breakdownFields[idx].description
                              "
                              :label="`Description ${idx + 1}`"
                              dense
                              outlined
                              autogrow
                              class="modern-input text-12"
                            />
                          </div>
                          <div style="width: 80px">
                            <q-input
                              v-model.number="
                                editableCriteria[section.key].breakdownFields[idx].weight
                              "
                              type="number"
                              min="0"
                              max="100"
                              dense
                              outlined
                              class="weight-input text-12"
                              @update:model-value="validateBreakdownWeight(section.key, idx)"
                            >
                              <template v-slot:append>
                                <span class="percentage-sign">%</span>
                              </template>
                            </q-input>
                          </div>
                          <div style="width: 36px">
                            <q-btn
                              icon="remove"
                              color="negative"
                              flat
                              round
                              size="xs"
                              class="remove-btn"
                              @click="removeBreakdownField(section.key, idx)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Add Breakdown Button -->
                    <div class="row justify-center q-mt-sm">
                      <q-btn
                        color="primary"
                        icon="add"
                        flat
                        size="sm"
                        class="q-mb-xs q-mt-xs text-12 font-weight-medium"
                        @click="addBreakdownField(section.key)"
                      >
                        Add Breakdown
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
        v-if="!showCriteriaForm && !loading"
        class="text-center q-pa-md bg-blue-1 rounded-borders empty-state-card"
      >
        <q-icon name="tune" size="2rem" color="primary" class="q-mb-xs" />
        <div class="text-h6 q-mb-xs text-12">No available data</div>
        <div class="text-caption">Please ensure criteria data is loaded properly</div>
      </q-card-section>
    </q-card>

    <!-- Confirm Save Dialog -->
    <q-dialog v-model="confirmDialog" persistent class="modern-dialog">
      <q-card style="width: 450px" class="no-shadow">
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
                <q-icon name="star" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-12">Salary Grade Range</q-item-label>
                <q-item-label class="text-12">
                  SG {{ salaryGradeData.sg_min }} - {{ salaryGradeData.sg_max }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Show criteria summary with breakdown -->
          <q-separator class="q-my-sm" />
          <div class="text-caption text-weight-medium q-mb-xs">Criteria Breakdown:</div>
          <div class="summary-container">
            <div
              v-for="section in sections"
              :key="'summary-' + section.key"
              class="text-caption q-mb-sm"
            >
              <div class="text-weight-bold">
                {{ section.label }}: {{ editableCriteria[section.key].weight }}%
              </div>
              <div
                v-if="editableCriteria[section.key].breakdownFields.length > 0"
                class="q-ml-md text-grey-7"
                style="max-height: 120px; overflow-y: auto"
              >
                <div
                  v-for="(field, idx) in editableCriteria[section.key].breakdownFields"
                  :key="'summary-field-' + idx"
                  class="q-mb-xs"
                >
                  <div class="row items-start q-gutter-xs no-wrap">
                    <div class="col-auto" style="min-width: 35px">
                      <q-badge color="primary" :label="`${field.weight}%`" />
                    </div>
                    <div class="col text-grey-8" style="font-size: 11px; line-height: 1.3">
                      {{ field.description || `Description ${idx + 1}` }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="q-ml-md text-grey-5 text-italic">(No breakdown descriptions)</div>
            </div>
          </div>
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

  /**
   * Create audit log entry
   */
  function logAudit(action, description, status = 'SUCCESS', details = {}) {
    const auditLog = {
      timestamp: '2025-11-20 06:10:14',
      user: 'dsfsgs',
      action,
      description,
      module: 'Criteria_SG_Management',
      status,
      details: JSON.stringify(details),
    };

    console.log('[AUDIT LOG]', auditLog);
    // TODO: Send to server via API: await auditApi.log(auditLog);
  }

  // Props
  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    criteriaId: { type: [String, Number], default: null },
    sgMin: { type: [String, Number], default: null },
    sgMax: { type: [String, Number], default: null },
    mode: { type: String, default: 'create' },
    hasPermission: { type: Boolean, default: false },
  });

  // Emits
  const emit = defineEmits(['update:modelValue', 'saved', 'switch-to-edit']);

  // Quasar
  const $q = useQuasar();

  // Store
  const criteriaStore = useCriteriaStore();

  // ============================================================================
  // STATE
  // ============================================================================

  const show = ref(props.modelValue);
  const confirmDialog = ref(false);
  const showCriteriaForm = ref(false);
  const loading = ref(false);
  const salaryGradeData = ref({
    sg_min: '',
    sg_max: '',
  });
  const existingCriteria = ref(null);
  const isDataFetched = ref(false);

  const baseCriteria = {
    education: {
      weight: 20,
      title: '',
      breakdownFields: [],
    },
    experience: {
      weight: 20,
      title: '',
      breakdownFields: [],
    },
    training: {
      weight: 15,
      title: '',
      breakdownFields: [],
    },
    performance: {
      weight: 15,
      title: '',
      breakdownFields: [],
    },
    bei: {
      weight: 30,
      title: '',
      breakdownFields: [],
    },
  };

  const editableCriteria = ref(JSON.parse(JSON.stringify(baseCriteria)));

  const sections = [
    { key: 'education', label: 'Education', icon: 'school' },
    { key: 'experience', label: 'Experience', icon: 'work_history' },
    { key: 'training', label: 'Training', icon: 'card_membership' },
    { key: 'performance', label: 'Performance', icon: 'leaderboard' },
    { key: 'bei', label: 'BEI', icon: 'record_voice_over' },
  ];

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  const canModify = computed(() => {
    return props.hasPermission === true;
  });

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

  const isFormValid = computed(() => {
    return (
      totalWeight.value === 100 &&
      salaryGradeData.value.sg_min &&
      salaryGradeData.value.sg_max &&
      parseInt(salaryGradeData.value.sg_max) >= parseInt(salaryGradeData.value.sg_min)
    );
  });

  // ============================================================================
  // VALIDATION METHODS
  // ============================================================================

  function validateBreakdownWeight(sectionKey, fieldIndex) {
    const field = editableCriteria.value[sectionKey].breakdownFields[fieldIndex];

    if (field.weight < 0) {
      field.weight = 0;
    } else if (field.weight > 100) {
      field.weight = 100;
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

  // ============================================================================
  // WATCHERS
  // ============================================================================

  watch(
    () => props.modelValue,
    (val) => {
      show.value = val;
      if (val && !isDataFetched.value) {
        initializeModal();
      }
    },
  );

  watch(show, (val) => {
    emit('update:modelValue', val);
    if (!val) {
      isDataFetched.value = false;
      resetForm();
      logAudit('MODAL_CLOSED', `Closed ${props.mode} criteria SG modal`);
    }
  });

  watch(
    () => [props.criteriaId, props.sgMin, props.sgMax],
    () => {
      if (show.value && !isDataFetched.value) {
        initializeModal();
      }
    },
    { immediate: true },
  );

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Initialize modal based on mode
   */
  async function initializeModal() {
    isDataFetched.value = true;
    loading.value = true;
    showCriteriaForm.value = false;

    try {
      logAudit('MODAL_OPENED', `Opening ${props.mode} criteria SG modal`, 'SUCCESS', {
        criteriaId: props.criteriaId,
        mode: props.mode,
      });

      if (props.mode === 'create') {
        // Create mode: Initialize with defaults
        salaryGradeData.value = {
          sg_min: props.sgMin || '',
          sg_max: props.sgMax || '',
        };
        editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
        showCriteriaForm.value = true;
      } else if (props.mode === 'view' || props.mode === 'edit') {
        // View/Edit mode: Fetch existing criteria
        if (!props.criteriaId) {
          throw new Error('Criteria ID is required for view/edit mode');
        }

        const response = await criteriaStore.fetchCriteriaSGDetail(props.criteriaId);
        existingCriteria.value = response;

        salaryGradeData.value = {
          sg_min: response.sg_min,
          sg_max: response.sg_max,
        };

        editableCriteria.value = convertApiCriteriaToModalFormat(response);

        logAudit('EXISTING_CRITERIA_LOADED', 'Loaded existing SG criteria', 'SUCCESS', {
          criteriaId: props.criteriaId,
        });

        showCriteriaForm.value = true;
      }
    } catch (error) {
      console.error('Error initializing modal:', error);
      logAudit('INIT_ERROR', 'Failed to initialize modal', 'FAILED', {
        criteriaId: props.criteriaId,
        error: error.message,
      });
      $q.notify({
        type: 'negative',
        message: error.message || 'Failed to load criteria information',
      });
      showCriteriaForm.value = false;
      isDataFetched.value = false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Reset form to default state
   */
  function resetForm() {
    salaryGradeData.value = {
      sg_min: '',
      sg_max: '',
    };
    editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
    existingCriteria.value = null;
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

  /**
   * Convert API criteria format to modal format
   */
  function convertApiCriteriaToModalFormat(apiCriteria) {
    const result = JSON.parse(JSON.stringify(baseCriteria));
    const criteriaKeys = ['education', 'experience', 'training', 'performance'];

    criteriaKeys.forEach((key) => {
      let criteriaSection = apiCriteria[key];

      if (criteriaSection && Array.isArray(criteriaSection) && criteriaSection.length > 0) {
        // Get the main weight from the first item
        const firstItem = criteriaSection[0];
        result[key].weight = parseInt(firstItem.weight || 0);

        // Map all items to breakdownFields with their individual percentages and IDs
        result[key].breakdownFields = criteriaSection.map((item) => ({
          id: item.id,
          criteria_library_id: item.criteria_library_id,
          description: item.description || '',
          weight: parseInt(item.percentage || item.weight || 0),
        }));
      }
    });

    // Handle BEI/Behavioral section
    let beiSection = apiCriteria.behavioral;

    if (beiSection && Array.isArray(beiSection) && beiSection.length > 0) {
      const firstItem = beiSection[0];
      result.bei.weight = parseInt(firstItem.weight || 0);

      // Map all items to breakdownFields with their individual percentages and IDs
      result.bei.breakdownFields = beiSection.map((item) => ({
        id: item.id,
        criteria_library_id: item.criteria_library_id,
        description: item.description || '',
        weight: parseInt(item.percentage || item.weight || 0),
      }));
    }

    return result;
  }

  /**
   * Convert modal format to API format for saving
   */
  function convertModalFormatToApiPayload(modalCriteria) {
    const payload = {
      sg_min: String(salaryGradeData.value.sg_min),
      sg_max: String(salaryGradeData.value.sg_max),
    };

    // If editing, include the ID
    if (props.mode === 'edit' && props.criteriaId) {
      payload.id = props.criteriaId;
    }

    // Helper to convert section to array of objects
    const convertSection = (sectionKey) => {
      const section = modalCriteria[sectionKey];
      const sectionWeight = String(section.weight);

      if (section.breakdownFields && section.breakdownFields.length > 0) {
        return section.breakdownFields.map((field) => ({
          weight: sectionWeight,
          description: field.description || '',
          percentage: String(field.weight),
        }));
      } else {
        // If no breakdown fields, return array with one item
        return [
          {
            weight: sectionWeight,
            description: '',
            percentage: sectionWeight,
          },
        ];
      }
    };

    // Convert all sections to arrays of objects
    payload.education = convertSection('education');
    payload.experience = convertSection('experience');
    payload.training = convertSection('training');
    payload.performance = convertSection('performance');
    payload.behavioral = convertSection('bei');

    console.log('=== FINAL PAYLOAD ===');
    console.log(JSON.stringify(payload, null, 2));
    console.log('=== END PAYLOAD ===');

    return payload;
  }

  function addBreakdownField(section) {
    editableCriteria.value[section].breakdownFields.push({
      description: '',
      weight: 0,
    });

    logAudit('BREAKDOWN_ADDED', `Added new breakdown field to ${section}`, 'SUCCESS', {
      criteriaId: props.criteriaId,
      section,
    });
  }

  function removeBreakdownField(section, idx) {
    const removedWeight = editableCriteria.value[section].breakdownFields[idx].weight;
    editableCriteria.value[section].breakdownFields.splice(idx, 1);

    logAudit('BREAKDOWN_REMOVED', `Removed breakdown field ${idx + 1} from ${section}`, 'SUCCESS', {
      criteriaId: props.criteriaId,
      section,
      removedWeight,
    });
  }

  function closeModal() {
    show.value = false;
  }

  function switchToEditMode() {
    if (!canModify.value) {
      console.warn('User does not have permission to edit criteria');
      logAudit('PERMISSION_DENIED', 'Attempted to switch to edit without permission', 'WARNING', {
        criteriaId: props.criteriaId,
      });
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to edit criteria',
      });
      return;
    }

    logAudit('SWITCH_TO_EDIT', 'Switching from view to edit mode', 'SUCCESS', {
      criteriaId: props.criteriaId,
    });

    closeModal();
    nextTick(() => {
      emit('switch-to-edit');
    });
  }

  function confirmSave() {
    if (!canModify.value) {
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to save criteria',
      });
      return;
    }

    if (!isFormValid.value) {
      $q.notify({
        type: 'warning',
        message: 'Please ensure all fields are valid and total weight equals 100%',
      });
      return;
    }

    confirmDialog.value = true;
  }

  /**
   * Save the criteria
   */
  async function saveRatings() {
    if (!canModify.value || !isFormValid.value) {
      return;
    }

    try {
      logAudit('SAVE_START', 'Starting to save SG criteria', 'INFO', {
        criteriaId: props.criteriaId,
        mode: props.mode,
      });

      // Convert modal format to API format
      const payload = convertModalFormatToApiPayload(editableCriteria.value);

      console.log('Modal: Payload before sending:', JSON.stringify(payload, null, 2));

      let response;
      if (props.mode === 'edit') {
        // Update existing criteria
        response = await criteriaStore.updateCriteriaSG(props.criteriaId, payload);
      } else {
        // Create new criteria
        response = await criteriaStore.saveCriteriaSG(payload);
      }

      console.log('Modal: Response from store:', response);

      logAudit('SAVE_SUCCESS', 'Successfully saved SG criteria', 'SUCCESS', {
        criteriaId: props.criteriaId,
        responseId: response?.id,
      });

      $q.notify({
        type: 'positive',
        message: 'Salary Grade Criteria saved successfully!',
        position: 'top',
      });

      emit('saved', response);
      closeModal();
    } catch (error) {
      console.error('Modal: Error saving SG criteria:', error);
      logAudit('SAVE_ERROR', 'Failed to save SG criteria', 'FAILED', {
        criteriaId: props.criteriaId,
        error: error.message,
      });

      $q.notify({
        type: 'negative',
        message: error.message || 'Failed to save salary grade criteria',
        position: 'top',
      });
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

  .breakdown-row {
    position: relative;
  }

  .summary-container {
    max-height: 250px;
    overflow-y: auto;
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

  .modern-input :deep(.q-field__control) {
    min-height: 28px;
  }

  .modern-input :deep(.q-field__native) {
    min-height: 20px;
  }
</style>
