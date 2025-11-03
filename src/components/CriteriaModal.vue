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
        <!-- Position -->
        <q-input
          v-model="jobData.Position"
          label="Position"
          dense
          outlined
          readonly
          :placeholder="'-'"
          class="q-mb-sm"
        />

        <div class="row q-col-gutter-sm q-mb-sm">
          <!-- LEFT COLUMN -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="jobData.Office"
              label="Office"
              dense
              outlined
              readonly
              :placeholder="'-'"
              class="q-mb-sm"
            />

            <q-input
              v-model="jobData.Group"
              label="Group"
              dense
              outlined
              readonly
              :placeholder="'-'"
              class="q-mb-sm"
            />

            <q-input
              v-model="jobData.Section"
              label="Section"
              dense
              outlined
              readonly
              :placeholder="'-'"
            />
          </div>

          <!-- RIGHT COLUMN -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="jobData.Office2"
              label="Sub-Office"
              dense
              outlined
              readonly
              :placeholder="'-'"
              class="q-mb-sm"
            />

            <q-input
              v-model="jobData.Division"
              label="Division"
              dense
              outlined
              readonly
              :placeholder="'-'"
              class="q-mb-sm"
            />

            <q-input
              v-model="jobData.Unit"
              label="Unit"
              dense
              outlined
              readonly
              :placeholder="'-'"
            />
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
            <q-input
              v-model="qualifications.Education"
              label="Education"
              dense
              outlined
              readonly
              :placeholder="'Not specified'"
            />
          </div>

          <div class="col-12 col-md-3">
            <q-input
              v-model="qualifications.Experience"
              label="Experience"
              dense
              outlined
              readonly
              :placeholder="'Not specified'"
            />
          </div>

          <div class="col-12 col-md-3">
            <q-input
              v-model="qualifications.Training"
              label="Training"
              dense
              outlined
              readonly
              :placeholder="'Not specified'"
            />
          </div>

          <div class="col-12 col-md-3">
            <q-input
              v-model="qualifications.Eligibility"
              label="Eligibility"
              dense
              outlined
              readonly
              :placeholder="'Not specified'"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <!-- Criteria -->
      <q-card-section v-if="showRatingTable && !loading" class="criteria-section">
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
                    :readonly="mode === 'view' || !hasPermission"
                  />

                  <!-- Additional Descriptions -->
                  <template v-if="mode === 'view' || !hasPermission">
                    <!-- View mode or no permission: Show comma-separated descriptions as read-only -->
                    <div
                      v-if="getCommaSeparatedDescriptions(section.key).length > 0"
                      class="q-mt-sm"
                    >
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

                  <template v-else-if="(mode === 'edit' || mode === 'create') && hasPermission">
                    <!-- Edit/Create mode with permission: Show editable additional fields -->
                    <div
                      v-if="editableCriteria[section.key].additionalFields.length > 0"
                      class="q-mt-sm"
                    >
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

  /**
   * Create audit log entry
   */
  function logAudit(action, description, status = 'SUCCESS', details = {}) {
    const auditLog = {
      timestamp: '2025-10-29 05:25:53',
      user: 'dsfsgs',
      action,
      description,
      module: 'Criteria_Management',
      status,
      details: JSON.stringify(details),
    };

    console.log('[AUDIT LOG]', auditLog);
    // TODO: Send to server via API: await auditApi.log(auditLog);
  }

  // Props - Changed from positionId/itemNo to jobId
  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    jobId: { type: [String, Number], default: null },
    mode: { type: String, default: 'create' },
    hasPermission: { type: Boolean, default: false },
  });

  // Emits
  const emit = defineEmits(['update:modelValue', 'saved', 'switch-to-edit']);

  // Quasar
  const $q = useQuasar();

  // Store
  const criteriaStore = useCriteriaStore();
  const jobPostStore = useJobPostStore();

  // ============================================================================
  // STATE
  // ============================================================================

  const show = ref(props.modelValue);
  const confirmDialog = ref(false);
  const showRatingTable = ref(false);
  const loading = ref(false);
  const jobData = ref(null);
  const qualifications = ref({});
  const existingCriteria = ref(null);
  const originalDescriptions = ref({});
  const isDataFetched = ref(false);

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

  // ============================================================================
  // WATCHERS
  // ============================================================================

  watch(
    () => props.modelValue,
    (val) => {
      show.value = val;
      if (val && props.jobId && !isDataFetched.value) {
        fetchJobData();
        logAudit('MODAL_OPENED', `Opening ${props.mode} criteria modal`, 'SUCCESS', {
          jobId: props.jobId,
          mode: props.mode,
        });
      }
    },
  );

  watch(show, (val) => {
    emit('update:modelValue', val);
    if (!val) {
      isDataFetched.value = false;
      logAudit('MODAL_CLOSED', `Closed ${props.mode} criteria modal`);
    }
  });

  watch(
    () => [props.jobId],
    ([newJobId]) => {
      if (show.value && newJobId && !isDataFetched.value) {
        fetchJobData();
      }
    },
    { immediate: true },
  );

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Fetch job data by job ID
   */
  async function fetchJobData() {
    if (!props.jobId || isDataFetched.value) return;

    isDataFetched.value = true;
    loading.value = true;
    showRatingTable.value = false;

    try {
      logAudit('FETCH_START', 'Starting to fetch job data by ID', 'INFO', {
        jobId: props.jobId,
      });

      // Fetch job details by ID
      const jobResponse = await jobPostStore.fetchJobDetails(props.jobId);

      jobData.value = {
        id: jobResponse.id,
        Position: jobResponse.Position,
        Office: jobResponse.Office,
        Office2: jobResponse.Office2,
        Group: jobResponse.Group,
        Division: jobResponse.Division,
        Section: jobResponse.Section,
        Unit: jobResponse.Unit,
      };

      // Set qualifications
      if (jobResponse.criteria) {
        qualifications.value = {
          Education: jobResponse.criteria.Education,
          Experience: jobResponse.criteria.Experience,
          Training: jobResponse.criteria.Training,
          Eligibility: jobResponse.criteria.Eligibility,
        };
      } else {
        qualifications.value = {};
      }

      logAudit('DATA_FETCHED', 'Successfully fetched job data', 'SUCCESS', {
        jobId: props.jobId,
        position: jobData.value?.Position,
        office: jobData.value?.Office,
      });

      // If in view or edit mode, fetch existing criteria
      if (props.mode === 'view' || props.mode === 'edit') {
        try {
          const existingResponse = await criteriaStore.viewCriteria(jobData.value.id);
          existingCriteria.value = existingResponse;
          if (existingResponse) {
            editableCriteria.value = convertApiCriteriaToModalFormat(existingResponse);
            logAudit('EXISTING_CRITERIA_LOADED', 'Loaded existing criteria', 'SUCCESS', {
              jobId: props.jobId,
            });
          }
        } catch {
          console.log('No existing criteria found, using default');
          editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
          logAudit('NO_EXISTING_CRITERIA', 'No existing criteria, using defaults');
        }
      } else {
        editableCriteria.value = JSON.parse(JSON.stringify(baseCriteria));
      }

      showRatingTable.value = true;
    } catch (error) {
      console.error('Error fetching job data:', error);
      logAudit('FETCH_ERROR', 'Failed to fetch job data', 'FAILED', {
        jobId: props.jobId,
        error: error.message,
      });
      $q.notify({
        type: 'negative',
        message: 'Failed to load job information',
      });
      showRatingTable.value = false;
      isDataFetched.value = false;
    } finally {
      loading.value = false;
    }
  }

  function getCommaSeparatedDescriptions(sectionKey) {
    if (props.mode !== 'view') return [];

    const originalDesc = originalDescriptions.value[sectionKey];
    if (!originalDesc || !originalDesc.includes(',')) return [];

    return originalDesc
      .split(',')
      .map((desc) => desc.trim())
      .filter((desc) => desc !== '')
      .slice(1);
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

          result[key].title = criteriaItem.Title || criteriaItem.title || '';

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

  function addAdditionalDescription(section) {
    editableCriteria.value[section].additionalFields.push('');
  }

  function removeAdditionalDescription(section, idx) {
    editableCriteria.value[section].additionalFields.splice(idx, 1);
    logAudit('DESCRIPTION_REMOVED', `Removed description ${idx + 2} from ${section}`, 'SUCCESS', {
      jobId: props.jobId,
      section,
    });
  }

  function closeModal() {
    show.value = false;
  }

  function switchToEditMode() {
    if (!canModify.value) {
      console.warn('User does not have permission to edit criteria');
      logAudit('PERMISSION_DENIED', 'Attempted to switch to edit without permission', 'WARNING', {
        jobId: props.jobId,
      });
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to edit criteria',
      });
      return;
    }

    logAudit('SWITCH_TO_EDIT', 'Switching from view to edit mode', 'SUCCESS', {
      jobId: props.jobId,
    });

    closeModal();
    nextTick(() => {
      emit('switch-to-edit', props.jobId);
    });
  }

  function confirmSave() {
    if (!canModify.value) {
      console.warn('User does not have permission to save criteria');
      logAudit('PERMISSION_DENIED', 'Attempted to save without permission', 'WARNING', {
        jobId: props.jobId,
      });
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to save criteria',
      });
      return;
    }

    if (totalWeight.value !== 100) {
      logAudit('VALIDATION_ERROR', 'Total weight not equal to 100%', 'WARNING', {
        jobId: props.jobId,
        totalWeight: totalWeight.value,
      });
      $q.notify({
        type: 'warning',
        message: 'The total weight must equal 100% before saving.',
      });
      return;
    }
    confirmDialog.value = true;
  }

  async function saveRatings() {
    if (!canModify.value) {
      console.warn('User does not have permission to save criteria');
      logAudit('PERMISSION_DENIED', 'Final save attempt without permission', 'FAILED', {
        jobId: props.jobId,
      });
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to save criteria',
      });
      return;
    }

    try {
      const jobBatchesRspIds = [jobData.value?.id].filter(Boolean);

      if (jobBatchesRspIds.length === 0) {
        throw new Error('No valid job ID found');
      }

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

      logAudit('CRITERIA_SAVED', 'Criteria saved successfully', 'SUCCESS', {
        jobId: props.jobId,
        position: jobData.value?.Position,
        office: jobData.value?.Office,
        weights: Object.fromEntries(
          Object.entries(editableCriteria.value).map(([k, v]) => [k, v.weight]),
        ),
      });

      $q.notify({ type: 'positive', message: 'Criteria saved successfully!' });
      emit('saved');
      closeModal();
    } catch (error) {
      console.error('Save criteria error:', error);
      logAudit('SAVE_ERROR', 'Failed to save criteria', 'FAILED', {
        jobId: props.jobId,
        error: error.message,
      });
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
