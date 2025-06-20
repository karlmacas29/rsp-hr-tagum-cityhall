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
          <!-- Page Title Section -->
          <div class="row q-mb-sm page-header">
            <div class="col-9">
              <h5 class="q-mt-none q-mb-xs text-weight-bold">
                Rating Form for Qualification Standards
              </h5>
              <div class="text-subtitle1 q-mb-xs">Position Title: {{ position.title }}</div>
              <div class="text-caption">Plantilla Code: {{ position.code }}</div>
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
                  style="height: 32px"
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
                    (25%)
                  </th>
                  <th class="text-left compact-cell" style="width: 18%">
                    Experience
                    <br />
                    (25%)
                  </th>
                  <th class="text-left compact-cell" style="width: 16%">
                    Training
                    <br />
                    (15%)
                  </th>
                  <th class="text-left compact-cell" style="width: 18%">
                    Performance
                    <br />
                    (15%)
                  </th>
                  <th class="text-center compact-cell" style="width: 6%">
                    TOTAL QS
                    <br />
                    (75%)
                  </th>
                  <th class="text-center compact-cell" style="width: 6%">
                    BEI
                    <br />
                    (25%)
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
                    <div class="text-caption">Bachelor's Degree</div>
                    <br />
                    <div class="text-weight-bold text-caption">HIGH SCORE INDICATOR</div>
                    <div class="text-caption">Completion of relevant education - 25%</div>
                    <div class="text-caption">Not meet required education - 0%</div>
                  </td>
                  <td class="text-left compact-criteria-cell" style="width: 18%">
                    <div class="text-weight-bold text-caption">REQUIRED:</div>
                    <div class="text-caption">4 years relevant experience</div>
                    <br />
                    <div class="text-weight-bold text-caption">RELEVANT EXPERIENCE</div>
                    <div class="text-caption">Supervisory Experience - 25%</div>
                    <div class="text-caption">Very Good - 15%</div>
                    <div class="text-caption">With Work Experience - 10%</div>
                    <div class="text-caption">None - 0%</div>
                  </td>
                  <td class="text-left compact-criteria-cell" style="width: 16%">
                    <div class="text-weight-bold text-caption">REQUIRED:</div>
                    <div class="text-caption">40 hours relevant training</div>
                    <br />
                    <div class="text-weight-bold text-caption">RELEVANT TRAINING</div>
                    <div class="text-caption">More or equal than required - 15%</div>
                    <div class="text-caption">None or less than required - 0%</div>
                  </td>
                  <td class="text-left compact-criteria-cell" style="width: 18%">
                    <div class="text-weight-bold text-caption">REQUIRED:</div>
                    <div class="text-caption">Civil Service Professional/RA1080</div>
                    <br />
                    <div class="text-weight-bold text-caption">PDS Integrity/ PPSB Outstanding</div>
                    <div class="text-caption">Very Satisfactory - 15%</div>
                    <div class="text-caption">Satisfactory - 7%</div>
                    <div class="text-caption">Below VS rating - 0%</div>
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
          <RaterPreview
            :criteria="criteria"
            :applicants="filteredSortedApplicants"
            mode="input"
            @update-rating="handleRatingUpdate"
          />
        </div>

        <!-- Footer with Submit Button -->
        <div class="modal-footer">
          <div class="row justify-end">
            <q-btn
              color="green"
              label="Submit Ratings"
              icon-right="check"
              @click="submitRatings"
              class="submit-button consistent-font"
              dense
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
  import { ref, onMounted, computed, watch } from 'vue';
  import { useQuasar } from 'quasar';
  import RaterPreview from './RaterPreview.vue';

  export default {
    name: 'RatingForm',
    components: {
      RaterPreview,
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
          code: '',
          department: '',
          applicants: [],
        }),
      },
    },
    emits: ['update:modelValue', 'submit-ratings'],
    setup(props, { emit }) {
      const $q = useQuasar();
      const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value),
      });

      // Filter and sort controls
      const filterText = ref('');
      const sortBy = ref({ label: 'Ranking', value: 'ranking' });
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

      // Criteria for RaterPreview
      const criteria = ref({
        education: {
          title1: 'HIGH SCORE INDICATOR',
          title2: 'Completion of relevant college degree',
          description: 'Master Degree / Professional Board / Doctorate Degree - 25%',
        },
        experience: {
          title1: 'RELEVANT EXPERIENCE',
          title2: 'Supervisory Experience',
          description1:
            'With direct supervisory experience with exemplary rating in at least 2 rating periods - Very Good = 15%',
          description2: 'With Work Experience = 10%, None = 0',
        },
        training: {
          title1: 'RELEVANT TRAINING',
          title2: 'Training Hours',
          description: 'Up to 40 hours of training = 15%, None or less than required = 0',
        },
        performance: {
          title: 'PDS Integrity/ PPSB',
          rating1: 'Outstanding = 15%',
          rating2: 'Very Satisfactory = 7%',
          rating3: 'Below VS rating = 0',
        },
      });

      // Applicants data
      const applicants = ref([]);

      // Initialize applicants from props
      const initializeApplicants = () => {
        if (props.position && props.position.applicants) {
          applicants.value = [...props.position.applicants];
          // Ensure totals are calculated
          applicants.value.forEach((applicant) => {
            calculateTotals(applicant);
          });
        }
      };

      // Computed property for filtered and sorted applicants
      const filteredSortedApplicants = computed(() => {
        // First filter by name
        const filtered = filterText.value
          ? applicants.value.filter((a) =>
              a.name.toLowerCase().includes(filterText.value.toLowerCase()),
            )
          : [...applicants.value];

        // Then sort by selected field
        const sorted = [...filtered].sort((a, b) => {
          const aValue =
            sortBy.value.value === 'totalQS'
              ? calculateQSValue(a)
              : sortBy.value.value === 'grandTotal'
                ? calculateTotalValue(a)
                : a[sortBy.value.value];

          const bValue =
            sortBy.value.value === 'totalQS'
              ? calculateQSValue(b)
              : sortBy.value.value === 'grandTotal'
                ? calculateTotalValue(b)
                : b[sortBy.value.value];

          // Handle numeric vs string comparison
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

      // Function to calculate QS value for sorting
      const calculateQSValue = (applicant) => {
        const education = parseFloat(applicant.educationScore) || 0;
        const experience = parseFloat(applicant.experienceScore) || 0;
        const training = parseFloat(applicant.trainingScore) || 0;
        const performance = parseFloat(applicant.performance) || 0;
        return Math.min(education + experience + training + performance, 75);
      };

      // Function to calculate Grand Total value for sorting
      const calculateTotalValue = (applicant) => {
        const qs = calculateQSValue(applicant);
        const bei = parseFloat(applicant.bei) || 0;
        return Math.min(qs + bei, 100);
      };

      // Handle rating updates from RaterPreview
      const handleRatingUpdate = ({ applicantId, field, value }) => {
        const applicant = applicants.value.find((a) => a.id === applicantId);
        if (applicant) {
          applicant[field] = parseFloat(value) || 0;
          calculateTotals(applicant);
        }
      };

      // Calculate totals for an applicant
      const calculateTotals = (applicant) => {
        // Ensure all numerical values are properly converted
        const education = parseFloat(applicant.educationScore) || 0;
        const experience = parseFloat(applicant.experienceScore) || 0;
        const training = parseFloat(applicant.trainingScore) || 0;
        const performance = parseFloat(applicant.performance) || 0;

        applicant.totalQS = education + experience + training + performance;
        applicant.grandTotal = applicant.totalQS + (parseFloat(applicant.bei) || 0);
        updateRankings();
      };

      // Update rankings based on grand totals
      const updateRankings = () => {
        const sorted = [...applicants.value].sort((a, b) => b.grandTotal - a.grandTotal);
        sorted.forEach((applicant, index) => {
          const matchingApplicant = applicants.value.find((a) => a.id === applicant.id);
          if (matchingApplicant) {
            matchingApplicant.ranking = index + 1;
          }
        });
      };

      // Submit ratings
      const submitRatings = () => {
        $q.notify({
          color: 'positive',
          message: 'Ratings submitted successfully',
          icon: 'check_circle',
        });

        emit('submit-ratings', {
          positionId: props.position.id,
          applicants: applicants.value,
        });

        closeForm();
      };

      // Close the form
      const closeForm = () => {
        isOpen.value = false;
      };

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

      onMounted(() => {
        initializeApplicants();
      });

      return {
        isOpen,
        filterText,
        sortBy,
        sortOrder,
        sortOptions,
        criteria,
        filteredSortedApplicants,
        handleRatingUpdate,
        submitRatings,
        closeForm,
      };
    },
  };
</script>

<style lang="scss" scoped>
  // Modal styling
  .rating-form-modal {
    width: 1200px;
    max-width: 90vw;
    max-height: 90vh;
    height: 90vh;
    border-radius: 8px;
    overflow: hidden;
  }

  // Set up the overall page structure
  .page-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  // Fixed header container
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

  // Close button styling
  .close-button {
    margin-top: 4px;
  }

  // Page header styling
  .page-header {
    padding-bottom: 4px;
    border-bottom: 1px solid #f0f0f0;
  }

  // Filter and sort controls
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
      font-size: 0.8rem !important;
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
      font-size: 0.8rem !important;
      line-height: 1.1 !important;
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  // Styling for the toggle buttons
  :deep(.q-btn-toggle) {
    .q-btn {
      min-height: 32px;
      font-size: 0.85rem !important;
      line-height: 1.1 !important;
    }
  }

  // Criteria tables
  .criteria-header,
  .criteria-description {
    margin-top: 0;
    margin-bottom: 0;

    th,
    td {
      white-space: normal;
    }
  }

  // Scrollable content area
  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  // Modal footer styling
  .modal-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 12px 16px;
    background-color: #f5f5f5;
  }

  // Apply consistent font size
  .consistent-font {
    font-size: 0.85rem !important;
  }

  // Submit button styling
  .submit-button {
    min-width: 150px;

    // Make sure icons are consistent size too
    :deep(.q-icon) {
      font-size: 1rem !important;
    }

    // Adjust padding for better proportions with smaller font
    padding: 8px 16px !important;
  }

  // Compact cells with less padding
  .compact-cell {
    padding: 4px !important;
    font-size: 0.85rem;
    line-height: 1.2;
  }

  // Compact criteria cell styling with less padding
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

  // Tighter line heights for text
  .text-subtitle1,
  .text-subtitle2,
  .text-caption {
    line-height: 1.2;
  }
</style>
