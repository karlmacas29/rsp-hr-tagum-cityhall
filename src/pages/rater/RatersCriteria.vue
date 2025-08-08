<template>
  <div class="positions-table-container q-pa-md">
    <h6 class="q-my-md text-weight-bold">Positions to Rate</h6>

    <!-- Search and filter -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Search input -->
      <div class="col-12 col-md-6">
        <q-input v-model="search" outlined dense placeholder="Search positions..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Office filter -->
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

      <!-- Status filter -->
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
    >
      <!-- Status column formatter -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.value)" class="status-badge">
            {{ formatStatus(props.value) }}
          </q-badge>
        </q-td>
      </template>

      <!-- Actions column -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <div class="row justify-center q-gutter-xs">
            <q-btn
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

            <q-btn dense flat round color="secondary" icon="print" size="md" class="action-btn">
              <q-tooltip>Print</q-tooltip>
            </q-btn>

            <q-btn dense flat round color="info" icon="visibility" size="md" class="action-btn">
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
      :applicants="positionApplicants"
      :loading="loadingModalData"
      @submit-ratings="handleRatingsSubmit"
    />
  </div>
</template>

<script>
  import { ref, computed, onMounted } from 'vue';
  import { use_rater_store } from 'stores/rater_store';
  import { storeToRefs } from 'pinia';
  import { useQuasar } from 'quasar';
  import RatingForm from 'components/RatingForm.vue';

  export default {
    name: 'PositionsTable',
    components: {
      RatingForm,
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

      // Rating modal state
      const showRatingModal = ref(false);
      const selectedPosition = ref({});
      const positionCriteria = ref({});
      const positionApplicants = ref([]);
      const loadingModalData = ref(false);

      // Table columns - use correct field accessors matching data structure
      const columns = [
        {
          name: 'office',
          label: 'Office',
          field: (row) => row.office || 'N/A',
          align: 'left',
          sortable: true,
          style: 'width: 40%',
        },
        {
          name: 'position',
          label: 'Position',
          field: (row) => row.position || 'N/A',
          align: 'left',
          sortable: true,
          style: 'width: 30%',
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'center',
          sortable: true,
          style: 'width: 10%',
        },
        {
          name: 'actions',
          label: 'Actions',
          field: 'actions',
          align: 'center',
          sortable: false,
          style: 'width: 20%',
        },
      ];

      // Office options computed from available data
      const officeOptions = computed(() => {
        if (!Array.isArray(assignedJobs.value)) return [];

        const offices = [...new Set(assignedJobs.value.map((job) => job.office).filter(Boolean))];

        return offices.map((office) => ({ label: office, value: office }));
      });

      // Status options computed from available data
      const statusOptions = computed(() => {
        if (!Array.isArray(assignedJobs.value)) return [];

        // Extract unique statuses from data
        const statuses = [...new Set(assignedJobs.value.map((job) => job.status).filter(Boolean))];

        // Add "Not Started" for null/empty values if needed
        if (assignedJobs.value.some((job) => !job.status)) {
          statuses.push('not_started');
        }

        // Map to option objects
        return statuses.map((status) => ({
          label: formatStatus(status),
          value: status,
        }));
      });

      // Filtered positions based on search and filters
      const filteredPositions = computed(() => {
        if (!Array.isArray(assignedJobs.value)) return [];

        return assignedJobs.value.filter((job) => {
          // Search filter
          const searchTerm = search.value.toLowerCase();
          const matchesSearch =
            !searchTerm ||
            (job.position && job.position.toLowerCase().includes(searchTerm)) ||
            (job.office && job.office.toLowerCase().includes(searchTerm));

          // Office filter
          const matchesOffice = !officeFilter.value || job.office === officeFilter.value;

          // Status filter
          const matchesStatus = !statusFilter.value || job.status === statusFilter.value;

          return matchesSearch && matchesOffice && matchesStatus;
        });
      });

      // Status helpers
      const getStatusColor = (status) => {
        switch (status) {
          case 'assessed':
            return 'blue';
          case 'pending':
            return 'orange';
          case 'completed':
            return 'green';
          case 'rated':
            return 'purple';
          default:
            return 'grey';
        }
      };

      const formatStatus = (status) => {
        if (!status) return 'Not Started';

        return status
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      // Open rating modal when clicking on the rate button
      const openRatingModal = async (position) => {
        selectedPosition.value = position;
        loadingModalData.value = true;
        showRatingModal.value = true;

        try {
          // Fetch criteria and applicants for this position
          const result = await raterStore.fetch_criteria_applicant(position.id);

          if (result && result.criteria && result.criteria.length > 0) {
            const criteriaData = result.criteria[0];
            positionCriteria.value = {
              education: criteriaData.educations?.[0] || {},
              experience: criteriaData.experiences?.[0] || {},
              training: criteriaData.trainings?.[0] || {},
              performance: criteriaData.performances?.[0] || {},
              behavioral: criteriaData.behaviorals?.[0] || {},
            };
          } else {
            positionCriteria.value = {};
          }

          // Process applicants data
          if (result && result.applicants) {
            positionApplicants.value = result.applicants;
          } else {
            positionApplicants.value = [];
          }
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

      // Handle ratings submission
      const handleRatingsSubmit = async (data) => {
        try {
          // Submit ratings using the store method
          const result = await raterStore.submitRatings(data.applicants, data.positionId);

          if (result.success) {
            $q.notify({
              color: 'positive',
              message: 'Ratings submitted successfully!',
              icon: 'check_circle',
              position: 'top',
              timeout: 2000,
            });

            // Refresh the list to update status
            await raterStore.fetch_assigned_jobs();
          } else {
            throw new Error(result.error || 'Failed to submit ratings');
          }
        } catch (error) {
          console.error('Error submitting ratings:', error);
          $q.notify({
            color: 'negative',
            message: error.message || 'An error occurred while submitting ratings',
            icon: 'error',
            position: 'top',
          });
        }
      };

      // Fetch data on component mount
      onMounted(() => {
        raterStore.fetch_assigned_jobs();
      });

      return {
        // Data
        search,
        officeFilter,
        statusFilter,
        columns,
        pagination,
        loading,
        officeOptions,
        statusOptions,
        filteredPositions,

        // Rating modal
        showRatingModal,
        selectedPosition,
        positionCriteria,
        positionApplicants,
        loadingModalData,

        // Methods
        getStatusColor,
        formatStatus,
        openRatingModal,
        handleRatingsSubmit,
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

  /* Status badge styling */
  .status-badge {
    font-size: 0.9rem;
    font-weight: normal;
    padding: 4px 8px;
  }

  /* Action buttons styling */
  .action-btn {
    margin: 0 2px;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
</style>
