<template>
  <q-page>
    <div class="positions-container">
      <div class="q-pa-md">
        <h6 class="q-my-md text-weight-bold">Positions to Rate</h6>

        <!-- Search and filter -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <q-input
              v-model="search"
              outlined
              dense
              placeholder="Search positions..."
              clearable
              class="filter-component"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-3">
            <q-select
              v-model="filterByOffice"
              :options="officeOptions"
              outlined
              dense
              label="Filter by Office"
              clearable
              emit-value
              map-options
              class="filter-component"
            />
          </div>
          <div class="col-3">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              outlined
              dense
              label="Status"
              clearable
              emit-value
              map-options
              class="filter-component"
            />
          </div>
        </div>

        <!-- Positions table -->
        <div class="table-container">
          <q-table
            :rows="filteredPositions"
            :columns="columns"
            :pagination="pagination"
            :loading="loading"
            binary-state-sort
            flat
            bordered
            class="consistent-font full-width"
            wrap-cells
          >
            <!-- Custom header slot -->
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  :class="
                    col.name === 'status'
                      ? 'status-column'
                      : col.name === 'actions'
                        ? 'action-column'
                        : ''
                  "
                >
                  {{ col.label }}
                </q-th>
                <q-th class="action-column">Actions</q-th>
              </q-tr>
            </template>

            <!-- Custom body slot -->
            <template v-slot:body="props">
              <q-tr
                :props="props"
                class="cursor-pointer hover-row"
                @click="openRatingForm(props.row)"
              >
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  :class="
                    col.name === 'status'
                      ? 'status-column'
                      : col.name === 'actions'
                        ? 'action-column'
                        : ''
                  "
                >
                  <template v-if="col.name === 'status'">
                    <q-badge :color="getStatusColor(props.row.status)" class="status-badge">
                      {{ props.row.status || 'Not Started' }}
                    </q-badge>
                  </template>
                  <template v-else>
                    <div class="cell-content">{{ col.value }}</div>
                  </template>
                </q-td>
                <q-td class="action-column">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="edit"
                    @click.stop="openRatingForm(props.row)"
                  />
                </q-td>
              </q-tr>
            </template>

            <!-- No data slot -->
            <template v-slot:no-data>
              <div class="full-width row flex-center q-pa-lg">
                <q-icon name="assignment" size="3em" color="grey-5" />
                <span class="q-ml-sm">No positions found</span>
              </div>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- Rating Form Component -->
    <RatingForm
      v-model="showRatingForm"
      :position="selectedPosition"
      :criteria="modalCriteria"
      :applicants="modalApplicants"
      :loading="fetchingModalData"
      @submit-ratings="handleSubmitRatings"
    />
  </q-page>
</template>

<script>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { useQuasar } from 'quasar';
  import RatingForm from 'src/components/RatingForm.vue';
  // import { use_rater_store } from 'stores/assignedJobStore.';
  import { use_rater_store } from 'stores/rater_store';
  import { storeToRefs } from 'pinia';

  export default {
    name: 'PositionsList',
    components: {
      RatingForm,
    },
    setup() {
      const $q = useQuasar();
      const assignedJobStore = use_rater_store();
      const { assignedJobs, loading, criteria_applicant } = storeToRefs(assignedJobStore);

      const search = ref('');
      const filterByOffice = ref(null);
      const statusFilter = ref(null);
      const showRatingForm = ref(false);
      const selectedPosition = ref({});
      const modalCriteria = ref({});
      const modalApplicants = ref([]);
      const fetchingModalData = ref(false);

      const pagination = ref({
        rowsPerPage: 10,
      });

      const columns = [
        {
          name: 'Office',
          label: 'Office',
          field: (row) => row.office || 'N/A',
          align: 'left',
          sortable: true,
        },
        {
          name: 'Position',
          label: 'Position',
          field: (row) => row.position || 'N/A',
          align: 'left',
          sortable: true,
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          sortable: true,
          align: 'center',
        },
      ];

      // Status color mapping
      const getStatusColor = (status) => {
        switch (status) {
          case 'Not Started':
            return 'grey';
          case 'In Progress':
            return 'orange';
          case 'Completed':
            return 'green';
          case 'Overdue':
            return 'red';
          default:
            return 'grey';
        }
      };

      // Computed values for filters
      const officeOptions = computed(() => {
        if (!Array.isArray(assignedJobs.value)) return [];

        const offices = [...new Set(assignedJobs.value.map((job) => job.office))];
        return offices.map((office) => ({ label: office, value: office }));
      });

      const statusOptions = [
        { label: 'Not Started', value: 'Not Started' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Overdue', value: 'Overdue' },
      ];

      const filteredPositions = computed(() => {
        let filtered = assignedJobs.value;
        // Apply search filter
        if (search.value) {
          const searchTerm = search.value.toLowerCase();
          filtered = filtered.filter(
            (job) =>
              (job.position && job.position.toLowerCase().includes(searchTerm)) ||
              (job.office && job.office.toLowerCase().includes(searchTerm)),
          );
        }

        // Apply office filter
        if (filterByOffice.value) {
          filtered = filtered.filter((job) => job.office === filterByOffice.value);
        }

        // Apply status filter
        if (statusFilter.value) {
          filtered = filtered.filter((job) => (job.status || 'Not Started') === statusFilter.value);
        }

        return filtered;
      });

      const openRatingForm = async (position) => {
        console.log('Opening rating form for position:', position.id);

        // Set selected position first
        selectedPosition.value = { ...position };

        // Reset modal data immediately and show loading state
        modalCriteria.value = {};
        modalApplicants.value = [];
        fetchingModalData.value = true;

        // Clear any previous data from store
        assignedJobStore.clearCriteriaApplicant();

        // Show modal immediately with loading state
        showRatingForm.value = true;

        try {
          console.log('Fetching data for job ID:', position.id);

          // Fetch fresh data for this specific job
          const result = await assignedJobStore.fetch_criteria_applicant(position.id);

          // Wait for Vue reactivity to complete
          await nextTick();

          console.log('Fetched result for job', position.id, ':', result);
          console.log('Store criteria_applicant after fetch:', criteria_applicant.value);

          // Process the fetched data from store
          if (result && result.criteria?.length > 0) {
            const criteriaData = result.criteria[0];

            modalCriteria.value = {
              education: criteriaData.educations?.[0] || {},
              experience: criteriaData.experiences?.[0] || {},
              training: criteriaData.trainings?.[0] || {},
              performance: criteriaData.performances?.[0] || {},
              behavioral: criteriaData.behaviorals?.[0] || {},
            };

            console.log('Processed modal criteria for job', position.id, ':', modalCriteria.value);
          } else {
            console.warn('No criteria found for job', position.id);
            modalCriteria.value = {};
          }

          // Process applicants
          if (result && result.applicants?.length > 0) {
            modalApplicants.value = result.applicants.map((applicant) => ({
              id: applicant.id,
              name: `${applicant.firstname} ${applicant.lastname}`,
              firstname: applicant.firstname,
              lastname: applicant.lastname,
              educationScore: 0,
              experienceScore: 0,
              trainingScore: 0,
              performance: 0,
              bei: 0,
              totalQS: 0,
              grandTotal: 0,
              ranking: 0,

              education: applicant.education || [],
              work_experience: applicant.work_experience || [],
              training: applicant.training || [],
              eligibility: applicant.eligibity || [], // Note: typo in your API response "eligibity"
            }));

            console.log(
              `Processed ${modalApplicants.value.length} applicants for job ${position.id}:`,
              modalApplicants.value,
            );
          } else {
            console.warn('No applicants found for job', position.id);
            modalApplicants.value = [];
          }
        } catch (error) {
          console.error('Error fetching criteria/applicants for job', position.id, ':', error);
          $q.notify({
            color: 'negative',
            message: 'Failed to load position data. Please try again.',
            icon: 'error',
            position: 'top',
          });

          // Reset data on error
          modalCriteria.value = {};
          modalApplicants.value = [];
        } finally {
          fetchingModalData.value = false;
        }
      };

      const handleSubmitRatings = (data) => {
        console.log('Ratings submitted:', data);
        $q.notify({
          color: 'positive',
          message: `Ratings for ${data.positionId} have been submitted successfully!`,
          icon: 'check_circle',
          position: 'top',
          timeout: 2000,
        });
        showRatingForm.value = false;
      };

      onMounted(async () => {
        await assignedJobStore.fetch_assigned_jobs();
        console.log('Fetched assigned jobs:', assignedJobStore.assignedJobs);
      });

      return {
        assignedJobs,
        columns,
        search,
        filterByOffice,
        statusFilter,
        loading,
        pagination,
        officeOptions,
        statusOptions,
        filteredPositions,
        showRatingForm,
        selectedPosition,
        modalCriteria,
        modalApplicants,
        fetchingModalData,
        getStatusColor,
        openRatingForm,
        handleSubmitRatings,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .positions-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .table-container {
    width: 100%;
    overflow-x: visible; /* Allow table to be fully visible */
  }

  .hover-row {
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }

  .consistent-font {
    font-size: 0.9rem;
  }

  :deep(.q-table) {
    table {
      width: 100%;
      table-layout: fixed;
    }

    th,
    td {
      font-size: 1rem;
      padding: 10px 16px;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    }

    th {
      font-weight: bold;
    }
  }

  /* Column specific widths */
  :deep(td:nth-child(1)),
  :deep(th:nth-child(1)) {
    width: 40%;
  }

  :deep(td:nth-child(2)),
  :deep(th:nth-child(2)) {
    width: 40%;
  }

  .status-column {
    width: 100px !important;
    text-align: center;
  }

  .action-column {
    width: 80px !important;
    text-align: center;
  }

  .cell-content {
    width: 100%;
    white-space: normal;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .status-badge {
    font-size: 0.9rem !important;
    font-weight: normal;
    padding: 2px 8px;
    white-space: nowrap;
  }

  .filter-component {
    :deep(.q-field__native),
    :deep(.q-field__prefix),
    :deep(.q-field__suffix),
    :deep(input),
    :deep(.q-field__label) {
      font-size: 1rem !important;
    }

    :deep(.q-field__marginal) {
      height: 40px;
    }
  }

  :deep(.q-menu) {
    .q-item,
    .q-item__label {
      font-size: 1rem !important;
      min-height: 32px;
      padding: 4px 16px;
    }
  }

  :deep(.q-select__dropdown-icon) {
    font-size: 2rem;
  }

  :deep(.q-select[label='Status']) {
    .q-item,
    .q-item__label {
      font-size: 0.9rem !important;
    }
  }

  :deep(.q-notification) {
    font-size: 1rem;
  }
</style>
