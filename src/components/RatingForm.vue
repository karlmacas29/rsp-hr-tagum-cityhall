<!-- criteria -->
<template>
  <q-dialog
    v-model="isOpen"
    transition-show="scale"
    transition-hide="scale"
    persistent
    @hide="closeForm"
  >
    <q-card class="rating-form-modal">
      <div class="page-container">
        <!-- Fixed Header Container -->
        <div class="fixed-header-container">
          <div class="row q-mb-sm page-header">
            <div class="col-9">
              <h5 class="q-mt-none q-mb-xs text-weight-bold">
                Rating Form for Qualification Standards
              </h5>
              <div class="text-subtitle1 q-mb-xs">Position Title: {{ position.title }}</div>
              <div class="text-caption">Slot: {{ position.slots }}</div>
            </div>
            <div class="col-3 text-right">
              <q-btn flat round dense icon="close" @click="closeForm" class="close-button" />
            </div>
          </div>

          <!-- Filter & Sort Controls -->
          <div class="filter-sort-controls q-mb-xs">
            <div class="row items-center q-col-gutter-md">
              <div class="col-4">
                <q-input
                  v-model="filterText"
                  dense
                  outlined
                  placeholder="Filter by name"
                  class="filter-input"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append v-if="filterText">
                    <q-icon name="close" @click="filterText = ''" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <div class="col-4">
                <q-select
                  v-model="sortBy"
                  :options="sortOptions"
                  dense
                  outlined
                  label="Sort by"
                  class="sort-select"
                />
              </div>
              <div class="col-4">
                <q-btn-toggle
                  v-model="sortOrder"
                  toggle-color="primary"
                  :options="[
                    { label: 'Ascending', value: 'asc' },
                    { label: 'Descending', value: 'desc' },
                  ]"
                  dense
                  spread
                  no-caps
                  class="full-width"
                  unelevated
                  rounded
                  style="height: 30px"
                />
              </div>
            </div>
          </div>

          <!-- Criteria Header -->
          <div class="criteria-header">
            <table class="q-table q-table--bordered full-width">
              <thead>
                <tr>
                  <th class="text-left compact-cell" style="width: 12%">Name of Applicant</th>
                  <th class="text-left compact-cell" style="width: 12%">
                    Education
                    <br />
                    {{ education.Rate }}%
                  </th>
                  <th class="text-left compact-cell" style="width: 18%">
                    Experience
                    <br />
                    {{ experience.Rate }}%
                  </th>
                  <th class="text-left compact-cell" style="width: 16%">
                    Training
                    <br />
                    {{ training.Rate }}%
                  </th>
                  <th class="text-left compact-cell" style="width: 18%">
                    Performance
                    <br />
                    {{ performance.Rate }}%
                  </th>
                  <th class="text-center compact-cell" style="width: 6%">
                    BEI
                    <br />
                    {{ behavioral.Rate }}%
                  </th>
                  <th class="text-center compact-cell" style="width: 6%">
                    TOTAL QS
                    <br />
                    (75%)
                  </th>

                  <th class="text-center compact-cell" style="width: 6%">
                    GRAND TOTAL
                    <br />
                    (100%)
                  </th>
                  <th class="text-center compact-cell" style="width: 6%">Ranking</th>
                </tr>
              </thead>
            </table>
          </div>

          <!-- Criteria Description -->
          <div class="criteria-description">
            <table class="q-table q-table--bordered full-width">
              <tbody>
                <tr class="bg-grey-2">
                  <td class="text-left compact-criteria-cell" style="width: 12%">
                    <div class="text-weight-bold text-caption">Criteria</div>
                  </td>
                  <td class="text-left compact-criteria-cell" style="width: 12%">
                    <div class="text-weight-bold text-caption">REQUIRED:</div>
                    <br />
                    <div
                      v-for="(item, index) in formatDescription(education.description)"
                      :key="'edu-' + index"
                      class="text-caption"
                    >
                      {{ item }}
                    </div>
                  </td>

                  <td class="text-left compact-criteria-cell" style="width: 18%">
                    <div class="text-weight-bold text-caption">REQUIRED:</div>
                    <br />
                    <div
                      v-for="(item, index) in formatDescription(experience.description)"
                      :key="'exp-' + index"
                      class="text-caption"
                    >
                      {{ item }}
                    </div>
                  </td>

                  <td class="text-left compact-criteria-cell" style="width: 16%">
                    <div class="text-weight-bold text-caption">REQUIRED:</div>
                    <!-- <div class="text-caption">{{ training.Min_qualification }}</div> -->
                    <br />
                    <!-- <div class="text-weight-bold text-caption">{{ training.Title }}</div> -->
                    <div
                      v-for="(item, index) in formatDescription(training.description)"
                      :key="'training-' + index"
                      class="text-caption"
                    >
                      {{ item }}
                    </div>
                  </td>
                  <td class="text-left compact-criteria-cell" style="width: 18%">
                    <div class="text-weight-bold text-caption">REQUIRED:</div>
                    <!-- <div class="text-caption">{{ performance.Title }}</div> -->
                    <br />
                    <div
                      v-for="(item, index) in formatDescription(performance.description)"
                      :key="'performance-' + index"
                      class="text-caption"
                    >
                      {{ item }}
                    </div>
                    <!-- <div class="text-caption">{{ performance.Very_satisfactory }}</div>
                    <div class="text-caption">{{ performance.Below_rating }}</div> -->
                  </td>
                  <td class="text-left compact-criteria-cell" style="width: 18%">
                    <div class="text-weight-bold text-caption">REQUIRED:</div>
                    <!-- <div class="text-caption">{{ behavioral.Title }}</div> -->
                    <br />
                    <div
                      v-for="(item, index) in formatDescription(behavioral.description)"
                      :key="'behavioral-' + index"
                      class="text-caption"
                    >
                      {{ item }}
                    </div>
                  </td>
                  <td class="text-center compact-criteria-cell" style="width: 6%"></td>
                  <td class="text-center compact-criteria-cell" style="width: 6%"></td>
                  <td class="text-center compact-criteria-cell" style="width: 6%"></td>
                  <td class="text-center compact-criteria-cell" style="width: 6%"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="scrollable-content">
          <!-- Loading spinner -->
          <div v-if="loading" class="text-center q-pa-lg">
            <q-spinner color="primary" size="3em" />
            <div class="q-mt-md">Loading criteria and applicants...</div>
          </div>

          <!-- Content when not loading -->
          <RaterPreview
            v-else
            :criteria="criteriaForPreview"
            :applicants="filteredSortedApplicants"
            mode="input"
            @update-rating="handleRatingUpdate"
          />
        </div>

        <div class="modal-footer">
          <div class="row justify-end">
            <q-btn
              color="green"
              label="Submit Ratings"
              icon-right="check"
              @click="showConfirmationModal"
              class="submit-button consistent-font"
              dense
            />
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <ConfirmationModal
        v-model:visible="confirmModalVisible"
        :applicants="applicants"
        :slot-count="parseInt(position.slots) || 1"
        @confirm="handleConfirmSubmit"
        @cancel="handleCancelSubmit"
      />
    </q-card>
  </q-dialog>
</template>

<script>
  import { ref, computed, watch, nextTick } from 'vue';
  import RaterPreview from './RaterPreview.vue';
  import ConfirmationModal from 'components/Rater/ConfirmationModal.vue';

  export default {
    name: 'RatingForm',
    components: {
      RaterPreview,
      ConfirmationModal,
    },

    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      position: {
        type: Object,
        required: true,
        default: () => ({
          id: 0,
          title: '',
          slots: '',
          department: '',
          slotCount: 1,
          applicants: [],
        }),
      },
      loading: {
        type: Boolean,
        default: false,
      },
      criteria: {
        type: Object,
        default: () => ({
          education: {},
          experience: {},
          training: {},
          performance: {},
          behavioral: {},
        }),
      },
      applicants: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:modelValue', 'submit-ratings'],
    setup(props, { emit }) {
      const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value),
      });

      // Confirmation modal visibility
      const confirmModalVisible = ref(false);

      // Filter and sort controls
      const filterText = ref('');
      const sortBy = ref({ label: 'Name', value: 'name' });
      const sortOrder = ref('asc');

      // Sort options
      const sortOptions = [
        { label: 'Ranking', value: 'ranking' },
        { label: 'Name', value: 'name' },
        { label: 'Education Score', value: 'educationScore' },
        { label: 'Experience Score', value: 'experienceScore' },
        { label: 'Training Score', value: 'trainingScore' },
        { label: 'Performance Score', value: 'performance' },
        { label: 'Total QS', value: 'totalQS' },
        { label: 'BEI Score', value: 'bei' },
        { label: 'Grand Total', value: 'grandTotal' },
      ];

      // Reactive references for criteria - using props
      const education = computed(() => props.criteria.education || {});
      const experience = computed(() => props.criteria.experience || {});
      const training = computed(() => props.criteria.training || {});
      const performance = computed(() => props.criteria.performance || {});
      const behavioral = computed(() => props.criteria.behavioral || {});

      // Format criteria for RaterPreview component
      const criteriaForPreview = computed(() => ({
        education: education.value,
        experience: experience.value,
        training: training.value,
        performance: performance.value,
        behavioral: behavioral.value,
      }));

      // Use applicants from props
      const applicants = ref([]);

      // Function to calculate QS value
      const calculateQSValue = (applicant) => {
        const education = parseFloat(applicant.educationScore) || 0;
        const experience = parseFloat(applicant.experienceScore) || 0;
        const training = parseFloat(applicant.trainingScore) || 0;
        const performance = parseFloat(applicant.performance) || 0;
        return Math.min(education + experience + training + performance, 75);
      };

      // Function to calculate Grand Total value
      const calculateTotalValue = (applicant) => {
        const qs = calculateQSValue(applicant);
        const bei = parseFloat(applicant.bei) || 0;
        return Math.min(qs + bei, 100);
      };

      // Calculate totals for an applicant
      const calculateTotals = (applicant) => {
        const education = parseFloat(applicant.educationScore) || 0;
        const experience = parseFloat(applicant.experienceScore) || 0;
        const training = parseFloat(applicant.trainingScore) || 0;
        const performance = parseFloat(applicant.performance) || 0;

        applicant.totalQS = Math.min(education + experience + training + performance, 75);
        applicant.grandTotal = Math.min(applicant.totalQS + (parseFloat(applicant.bei) || 0), 100);
      };

      // Update rankings with ties - FIXED algorithm
      const updateRankingsWithTies = () => {
        const sortedByTotal = [...applicants.value].sort((a, b) => {
          const aTotal = parseFloat(calculateTotalValue(a));
          const bTotal = parseFloat(calculateTotalValue(b));
          return bTotal - aTotal;
        });

        const scoreMap = {};

        // First pass: collect all unique scores and their positions
        sortedByTotal.forEach((applicant, index) => {
          const total = parseFloat(calculateTotalValue(applicant)).toFixed(1);
          if (!scoreMap[total]) {
            scoreMap[total] = {
              firstPosition: index,
              count: 0,
            };
          }
          scoreMap[total].count++;
        });

        // Second pass: assign rankings
        sortedByTotal.forEach((applicant) => {
          const total = parseFloat(calculateTotalValue(applicant)).toFixed(1);
          const position = scoreMap[total].firstPosition;
          applicant.ranking = position + 1;
        });
      };

      // Handle rating updates from RaterPreview
      const handleRatingUpdate = ({ applicantId, field, value }) => {
        const applicant = applicants.value.find((a) => a.id === applicantId);
        if (applicant) {
          applicant[field] = parseFloat(value) || 0;
          calculateTotals(applicant);
          updateRankingsWithTies();
        }
      };

      // Computed property for filtered and sorted applicants
      const filteredSortedApplicants = computed(() => {
        const filtered = filterText.value
          ? applicants.value.filter((a) =>
              a.name.toLowerCase().includes(filterText.value.toLowerCase()),
            )
          : [...applicants.value];

        const sorted = [...filtered].sort((a, b) => {
          let aValue, bValue;

          if (sortBy.value.value === 'totalQS') {
            aValue = calculateQSValue(a);
            bValue = calculateQSValue(b);
          } else if (sortBy.value.value === 'grandTotal') {
            aValue = calculateTotalValue(a);
            bValue = calculateTotalValue(b);
          } else if (sortBy.value.value === 'name') {
            aValue = String(a[sortBy.value.value] || '').toLowerCase();
            bValue = String(b[sortBy.value.value] || '').toLowerCase();
          } else {
            aValue = a[sortBy.value.value];
            bValue = b[sortBy.value.value];

            if (!isNaN(parseFloat(aValue))) {
              aValue = parseFloat(aValue) || 0;
              bValue = parseFloat(bValue) || 0;
            }
          }

          if (typeof aValue === 'string') {
            return sortOrder.value === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else {
            return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
          }
        });

        return sorted;
      });

      // Show confirmation modal
      const showConfirmationModal = () => {
        confirmModalVisible.value = true;
      };

      // Handle confirm from modal
      const handleConfirmSubmit = (successfulApplicants) => {
        emit('submit-ratings', {
          positionId: props.position.id,
          applicants: applicants.value,
          successfulApplicants: successfulApplicants,
        });
        closeForm();
      };

      // Handle cancel from modal
      const handleCancelSubmit = () => {
        confirmModalVisible.value = false;
      };

      // Close the form
      const closeForm = () => {
        isOpen.value = false;
      };

      // Watch for prop changes
      watch(
        () => props.applicants,
        (newApplicants) => {
          if (newApplicants && newApplicants.length > 0) {
            initializeApplicants();
          }
        },
        { immediate: true },
      );

      // Initialize data when form opens
      watch(
        () => props.modelValue,
        (isOpen) => {
          if (isOpen) {
            initializeApplicants();
          }
        },
        { immediate: true },
      );

      // Watch for changes that should trigger re-ranking
      watch(
        [applicants],
        () => {
          updateRankingsWithTies();
        },
        { deep: true },
      );

      watch(
        [() => props.applicants, () => props.criteria],
        ([newApplicants, newCriteria]) => {
          console.log('RatingForm: Props changed', {
            applicantsCount: newApplicants?.length || 0,
            hasCriteria: !!newCriteria,
          });

          if (newApplicants && newApplicants.length > 0) {
            // Reset applicants data completely
            applicants.value = [];

            // Add a small delay to ensure clean state
            nextTick(() => {
              initializeApplicants();
            });
          } else {
            // Clear applicants if no new data
            applicants.value = [];
          }
        },
        { immediate: true, deep: true },
      );
      // In RatingForm.vue
      watch(
        applicants,
        (newVal) => {
          console.log('Applicants data:', newVal);
        },
        { deep: true },
      );

      // Initialize data when form opens - IMPROVED VERSION
      watch(
        () => props.modelValue,
        (isOpen) => {
          if (isOpen) {
            console.log('RatingForm: Modal opened, initializing...');

            // Clear any previous state
            applicants.value = [];

            // Initialize with current props
            if (props.applicants && props.applicants.length > 0) {
              nextTick(() => {
                initializeApplicants();
              });
            }
          } else {
            // Clear data when modal closes
            applicants.value = [];
          }
        },
        { immediate: true },
      );

      // Also update the initializeApplicants function to be more robust
      const initializeApplicants = () => {
        console.log('Initializing applicants with props:', props.applicants);

        if (props.applicants && props.applicants.length > 0) {
          // Create a deep copy to avoid reference issues
          applicants.value = props.applicants.map((applicant) => ({
            ...applicant,
            id: applicant.id, // This is the submission ID
            nPersonalInfo_id: applicant.nPersonalInfo_id, // Ensure this exists
            educationScore: Number(applicant.educationScore) || 0,
            experienceScore: Number(applicant.experienceScore) || 0,
            trainingScore: Number(applicant.trainingScore) || 0,
            performance: Number(applicant.performance) || 0,
            bei: Number(applicant.bei) || 0,
            totalQS: 0,
            grandTotal: 0,
            ranking: 0,
          }));

          // Calculate totals for each applicant
          applicants.value.forEach((applicant) => {
            calculateTotals(applicant);
          });

          // Update rankings
          updateRankingsWithTies();

          console.log('Initialized applicants:', applicants.value);
        } else {
          console.log('No applicants to initialize');
          applicants.value = [];
        }
      };

      // Add this inside your setup() function, before the return statement
      const formatDescription = (description) => {
        if (!description) return [];
        if (Array.isArray(description)) return description;
        return description.split(',').map((item) => item.trim());
      };
      return {
        isOpen,
        filterText,
        sortBy,
        sortOrder,
        sortOptions,
        education,
        experience,
        training,
        performance,
        behavioral,
        criteriaForPreview,
        filteredSortedApplicants,

        handleRatingUpdate,
        closeForm,
        confirmModalVisible,
        showConfirmationModal,
        handleConfirmSubmit,
        handleCancelSubmit,

        formatDescription,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .rating-form-modal {
    width: 1200px;
    max-width: 90vw;
    max-height: 90vh;
    height: 90vh;
    border-radius: 8px;
    overflow: hidden;
  }

  .page-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .fixed-header-container {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 8px;
  }

  .close-button {
    margin-top: 4px;
  }

  .page-header {
    padding-bottom: 4px;
    border-bottom: 1px solid #f0f0f0;
  }

  .filter-sort-controls {
    padding: 6px 0;
    background-color: white;
    border-bottom: 1px solid #f0f0f0;
  }

  .filter-input {
    .q-field__control {
      height: 32px;
      min-height: 32px;
    }

    :deep(input) {
      font-size: 1rem !important;
      line-height: 1.1 !important;
    }

    :deep(.q-field__native) {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .sort-select {
    .q-field__control {
      height: 32px;
      min-height: 32px;
    }

    :deep(.q-field__native) {
      font-size: 1rem !important;
      line-height: 1.1 !important;
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  :deep(.q-btn-toggle) {
    .q-btn {
      min-height: 32px;
      font-size: 1rem !important;
      line-height: 1.1 !important;
    }
  }

  .criteria-header,
  .criteria-description {
    margin-top: 0;
    margin-bottom: 0;

    th,
    td {
      white-space: normal;
    }
  }

  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .modal-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 12px 16px;
    background-color: #f5f5f5;
  }

  .consistent-font {
    font-size: 1rem !important;
  }

  .submit-button {
    min-width: 150px;

    :deep(.q-icon) {
      font-size: 1rem !important;
    }

    padding: 8px 16px !important;
  }

  .compact-cell {
    padding: 4px !important;
    font-size: 0.95rem;
    line-height: 1.2;
  }

  .compact-criteria-cell {
    padding: 4px !important;
    vertical-align: top;
  }

  .bg-light-green-1 {
    background-color: #e8f5e9 !important;
  }

  .q-table th {
    font-weight: 500;
  }

  .text-subtitle1,
  .text-subtitle2,
  .text-caption {
    font-size: 0.9rem;
    line-height: 1.2;
  }
</style>
