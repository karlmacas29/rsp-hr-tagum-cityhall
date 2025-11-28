<template>
  <div class="positions-table-container q-pa-md">
    <h6 class="q-my-md text-weight-bold">Positions to Rate</h6>

    <!-- Search and filter -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-input v-model="search" outlined dense placeholder="Search positions..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="officeFilter"
          :options="officeOptions"
          outlined
          dense
          label="Filter by Office"
          clearable
          emit-value
          map-options
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          outlined
          dense
          label="Status"
          clearable
          emit-value
          map-options
        />
      </div>
    </div>

    <!-- Positions table -->
    <q-table
      :rows="filteredPositions"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      binary-state-sort
      flat
      bordered
      wrap-cells
      class="full-width"
      row-key="id"
    >
      <!-- Actions column -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <div class="row justify-center q-gutter-xs">
            <q-btn
              v-if="!props.row.submitted"
              dense
              flat
              round
              color="primary"
              icon="rate_review"
              size="md"
              class="action-btn"
              @click="openRatingModal(props.row)"
            >
              <q-tooltip>Rate</q-tooltip>
            </q-btn>
            <q-btn
              v-else
              dense
              flat
              round
              color="info"
              icon="visibility"
              size="md"
              class="action-btn"
              @click="openViewRatedModal(props.row)"
            >
              <q-tooltip>View</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <!-- No data message -->
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-lg">
          <q-icon name="assignment" size="3em" color="grey-5" />
          <span class="q-ml-sm">No positions found</span>
        </div>
      </template>
    </q-table>

    <!-- Rating Modal -->
    <RatingForm
      v-model="showRatingModal"
      :position="selectedPosition"
      :criteria="positionCriteria"
      :raw-criteria="rawCriteria"
      :applicants="positionApplicants"
      :loading="loadingModalData"
      @submit-ratings="handleRatingsSubmit"
      @save-draft="saveDraft"
      @close="handleRatingModalClose"
    />

    <!-- View Rated Modal -->
    <ViewRated
      v-model="showViewRatedModal"
      :position="selectedPosition"
      :criteria="positionCriteria"
      :raw-criteria="rawCriteria"
      :applicants="positionApplicants"
      :loading="loadingModalData"
      @close="handleViewRatedModalClose"
    />
  </div>
</template>

<script>
  import { ref, computed, onMounted } from 'vue';
  import { use_rater_store } from 'stores/rater_store';
  import { storeToRefs } from 'pinia';
  import { useQuasar } from 'quasar';
  import RatingForm from 'components/RatingForm.vue';
  import ViewRated from 'components/ViewRatedModal.vue';

  export default {
    name: 'PositionsTable',
    components: {
      RatingForm,
      ViewRated,
    },
    setup() {
      const $q = useQuasar();

      // Store
      const raterStore = use_rater_store();
      const { assignedJobs, loading } = storeToRefs(raterStore);

      // Filters
      const search = ref('');
      const officeFilter = ref(null);
      const statusFilter = ref(null);

      // Pagination
      const pagination = ref({
        rowsPerPage: 10,
      });

      // Modal state
      const showRatingModal = ref(false);
      const showViewRatedModal = ref(false);
      const selectedPosition = ref({});
      const positionCriteria = ref({});
      const rawCriteria = ref(null);
      const positionApplicants = ref([]);
      const loadingModalData = ref(false);

      // Table columns
      const columns = [
        {
          name: 'office',
          label: 'Office',
          field: (row) => row.office || row.Office || 'N/A',
          align: 'left',
          sortable: true,
          style: 'width: 40%',
        },
        {
          name: 'position',
          label: 'Position',
          field: (row) => row.position || row.Position || 'N/A',
          align: 'left',
          sortable: true,
          style: 'width: 30%',
        },
        {
          name: 'actions',
          label: 'Actions',
          field: 'actions',
          align: 'center',
          sortable: false,
          style: 'width: 30%',
        },
      ];

      // Office options
      const officeOptions = computed(() => {
        if (!Array.isArray(assignedJobs.value)) return [];
        const offices = [
          ...new Set(assignedJobs.value.map((job) => job.office || job.Office).filter(Boolean)),
        ];
        return offices.map((office) => ({ label: office, value: office }));
      });

      // Status options
      const statusOptions = computed(() => {
        if (!Array.isArray(assignedJobs.value)) return [];
        const statuses = [...new Set(assignedJobs.value.map((job) => job.status).filter(Boolean))];
        if (assignedJobs.value.some((job) => !job.status)) statuses.push('not_started');
        return statuses.map((status) => ({
          label: formatStatus(status),
          value: status,
        }));
      });

      // Filtered positions
      const filteredPositions = computed(() => {
        if (!Array.isArray(assignedJobs.value)) return [];
        return assignedJobs.value.filter((job) => {
          const searchTerm = search.value.toLowerCase();
          const matchesSearch =
            !searchTerm ||
            (job.position || job.Position || '').toLowerCase().includes(searchTerm) ||
            (job.office || job.Office || '').toLowerCase().includes(searchTerm);
          const matchesOffice =
            !officeFilter.value ||
            job.office === officeFilter.value ||
            job.Office === officeFilter.value;
          const matchesStatus = !statusFilter.value || job.status === statusFilter.value;
          return matchesSearch && matchesOffice && matchesStatus;
        });
      });

      const formatStatus = (status) => {
        if (!status) return 'Not Started';
        return status
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      /**
       * Transform criteria data from API format to modal format
       * This ensures all criteria items with their percentages are properly passed
       */
      const transformCriteriaData = (criteriaData) => {
        if (!criteriaData) return {};

        // Get the weight (max rate) from the first item of each array
        // All items in the same category should have the same weight
        const educationWeight = criteriaData.educations?.[0]?.weight || '20';
        const experienceWeight = criteriaData.experiences?.[0]?.weight || '20';
        const trainingWeight = criteriaData.trainings?.[0]?.weight || '15';
        const performanceWeight = criteriaData.performances?.[0]?.weight || '15';
        const behavioralWeight = criteriaData.behaviorals?.[0]?.weight || '30';

        return {
          education: {
            Rate: educationWeight,
            items: (criteriaData.educations || []).map((item) => ({
              percentage: item.percentage,
              description: item.description,
            })),
          },
          experience: {
            Rate: experienceWeight,
            items: (criteriaData.experiences || []).map((item) => ({
              percentage: item.percentage,
              description: item.description,
            })),
          },
          training: {
            Rate: trainingWeight,
            items: (criteriaData.trainings || []).map((item) => ({
              percentage: item.percentage,
              description: item.description,
            })),
          },
          performance: {
            Rate: performanceWeight,
            items: (criteriaData.performances || []).map((item) => ({
              percentage: item.percentage,
              description: item.description,
            })),
          },
          behavioral: {
            Rate: behavioralWeight,
            items: (criteriaData.behaviorals || []).map((item) => ({
              percentage: item.percentage,
              description: item.description,
            })),
          },
        };
      };

      // Open rating modal for a position
      const openRatingModal = async (position) => {
        selectedPosition.value = position;
        loadingModalData.value = true;
        showRatingModal.value = true;

        try {
          const result = await raterStore.fetch_criteria_applicant(position.id);

          console.log('Fetched criteria result:', result);

          if (result && result.criteria && result.criteria.length > 0) {
            const criteriaData = result.criteria[0];

            // Store the raw criteria data
            rawCriteria.value = criteriaData;

            // Transform the criteria data to include all items with their percentages
            positionCriteria.value = transformCriteriaData(criteriaData);

            console.log('Raw criteria:', rawCriteria.value);
            console.log('Transformed criteria:', positionCriteria.value);
          } else {
            positionCriteria.value = {};
            rawCriteria.value = null;
          }

          positionApplicants.value = result && result.applicants ? result.applicants : [];
        } catch (error) {
          console.error('Error fetching position data:', error);
          $q.notify({
            color: 'negative',
            message: 'Failed to load position data',
            icon: 'error',
            position: 'top',
          });
          showRatingModal.value = false;
        } finally {
          loadingModalData.value = false;
        }
      };

      // Open view rated modal for a position
      const openViewRatedModal = async (position) => {
        selectedPosition.value = position;
        loadingModalData.value = true;
        showViewRatedModal.value = true;

        try {
          const result = await raterStore.fetch_criteria_applicant(position.id);

          if (result && result.criteria && result.criteria.length > 0) {
            const criteriaData = result.criteria[0];

            // Store the raw criteria data
            rawCriteria.value = criteriaData;

            // Transform the criteria data to include all items with their percentages
            positionCriteria.value = transformCriteriaData(criteriaData);
          } else {
            positionCriteria.value = {};
            rawCriteria.value = null;
          }

          positionApplicants.value = result && result.applicants ? result.applicants : [];
        } catch (error) {
          console.error('Error fetching position data:', error);
          $q.notify({
            color: 'negative',
            message: 'Failed to load position data',
            icon: 'error',
            position: 'top',
          });
          showViewRatedModal.value = false;
        } finally {
          loadingModalData.value = false;
        }
      };

      const saveDraft = async (data) => {
        try {
          if (typeof raterStore.saveDraft !== 'function') {
            throw new Error('Draft ratings functionality is not available');
          }
          const result = await raterStore.saveDraft(data.applicants, data.positionId);
          if (result && result.success) {
            $q.notify({
              color: 'info',
              message: 'Draft ratings saved successfully!',
              icon: 'save',
              position: 'top',
              timeout: 2000,
            });
            await raterStore.fetch_assigned_jobs();
          } else {
            throw new Error((result && result.error) || 'Failed to save draft ratings');
          }
        } catch (error) {
          $q.notify({
            color: 'negative',
            message: error.message || 'An error occurred while saving draft ratings',
            icon: 'error',
            position: 'top',
          });
        }
      };

      // Handle ratings submission
      const handleRatingsSubmit = async (data) => {
        try {
          const result = await raterStore.submitRatings(data.applicants, data.positionId);
          if (result.success) {
            $q.notify({
              color: 'positive',
              message: 'Ratings submitted successfully!',
              icon: 'check_circle',
              position: 'top',
              timeout: 2000,
            });
            showRatingModal.value = false;
            await raterStore.fetch_assigned_jobs();
          } else {
            throw new Error(result.error || 'Failed to submit ratings');
          }
        } catch (error) {
          $q.notify({
            color: 'negative',
            message: error.message || 'An error occurred while submitting ratings',
            icon: 'error',
            position: 'top',
          });
        }
      };

      // When modal is closed after save or cancel
      const handleRatingModalClose = () => {
        showRatingModal.value = false;
      };

      // When view rated modal is closed
      const handleViewRatedModalClose = () => {
        showViewRatedModal.value = false;
      };

      onMounted(() => {
        raterStore.fetch_assigned_jobs();
      });

      return {
        search,
        officeFilter,
        statusFilter,
        columns,
        pagination,
        loading,
        officeOptions,
        statusOptions,
        filteredPositions,

        // Modal state
        showRatingModal,
        showViewRatedModal,
        selectedPosition,
        positionCriteria,
        rawCriteria,
        positionApplicants,
        loadingModalData,

        // Methods
        openRatingModal,
        openViewRatedModal,
        handleRatingsSubmit,
        saveDraft,
        handleRatingModalClose,
        handleViewRatedModalClose,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .positions-table-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  /* Table styling */
  :deep(.q-table) {
    th,
    td {
      padding: 10px 16px;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    th {
      font-weight: bold;
    }
  }
  /* Action buttons styling */
  .action-btn {
    margin: 0 2px;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
</style>
