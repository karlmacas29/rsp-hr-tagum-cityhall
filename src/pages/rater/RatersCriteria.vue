<template>
  <q-page padding>
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
              v-model="filterByDepartment"
              :options="departmentOptions"
              outlined
              dense
              label="Filter by Department"
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
        <q-table
          :rows="filteredPositions"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          binary-state-sort
          flat
          bordered
          class="consistent-font"
        >
          <!-- Custom header slot -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                :style="{ width: col.width }"
              >
                {{ col.label }}
              </q-th>
              <q-th auto-width style="width: 5%">Actions</q-th>
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
                :style="{ width: col.width }"
              >
                <template v-if="col.name === 'status'">
                  <q-badge :color="getStatusColor(props.row.status)" class="status-badge">
                    {{ props.row.status }}
                  </q-badge>
                </template>
                <template v-else>
                  {{ col.value }}
                </template>
              </q-td>
              <q-td auto-width style="width: 5%">
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

    <!-- Rating Form Component -->
    <RatingForm
      v-model="showRatingForm"
      :position="selectedPosition"
      @submit-ratings="handleSubmitRatings"
    />
  </q-page>
</template>

<script>
  import { ref, computed, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import RatingForm from 'src/components/RatingForm.vue';

  export default {
    name: 'PositionsList',
    components: {
      RatingForm,
    },
    setup() {
      const $q = useQuasar();
      const positions = ref([]);
      const loading = ref(true);
      const search = ref('');
      const filterByDepartment = ref(null);
      const statusFilter = ref(null);

      // Rating form controls
      const showRatingForm = ref(false);
      const selectedPosition = ref({});

      // Pagination settings
      const pagination = ref({
        rowsPerPage: 10,
      });

      // Table columns with specific width percentages
      const columns = [
        {
          name: 'code',
          label: 'Plantilla Code',
          field: 'code',
          sortable: true,
          align: 'left',
          width: '15%',
        },
        {
          name: 'title',
          label: 'Position Title',
          field: 'title',
          sortable: true,
          align: 'left',
          width: '18%',
        },
        {
          name: 'department',
          label: 'Department',
          field: 'department',
          sortable: true,
          align: 'left',
          width: '22%',
        },
        {
          name: 'applicants',
          label: 'Applicants',
          field: (row) => row.applicants.length,
          sortable: true,
          align: 'center',
          width: '10%',
        },
        {
          name: 'deadline',
          label: 'Rating Deadline',
          field: 'deadline',
          sortable: true,
          align: 'left',
          width: '15%',
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          sortable: true,
          align: 'center',
          width: '15%',
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
      const departmentOptions = computed(() => {
        const departments = [...new Set(positions.value.map((p) => p.department))];
        return departments.map((dept) => ({ label: dept, value: dept }));
      });

      const statusOptions = computed(() => {
        const statuses = [...new Set(positions.value.map((p) => p.status))];
        return statuses.map((status) => ({ label: status, value: status }));
      });

      // Filtered positions based on search and filters
      const filteredPositions = computed(() => {
        return positions.value.filter((position) => {
          // Text search
          const searchMatch =
            search.value === '' ||
            position.title.toLowerCase().includes(search.value.toLowerCase()) ||
            position.code.toLowerCase().includes(search.value.toLowerCase()) ||
            position.department.toLowerCase().includes(search.value.toLowerCase());

          // Department filter
          const departmentMatch =
            !filterByDepartment.value || position.department === filterByDepartment.value;

          // Status filter
          const statusMatch = !statusFilter.value || position.status === statusFilter.value;

          return searchMatch && departmentMatch && statusMatch;
        });
      });

      // Open the rating form for a position
      const openRatingForm = (position) => {
        selectedPosition.value = { ...position };
        showRatingForm.value = true;
      };

      // Handle submit ratings from form
      const handleSubmitRatings = (data) => {
        // In a real app, you would save the ratings to an API here
        console.log('Ratings submitted:', data);

        // Update the position status
        const position = positions.value.find((p) => p.id === data.positionId);
        if (position) {
          position.status = 'Completed';
          $q.notify({
            color: 'positive',
            message: `Ratings for ${position.title} have been submitted successfully!`,
            icon: 'check_circle',
            position: 'top',
            timeout: 2000,
          });
        }
      };

      // Load sample data
      const loadPositions = () => {
        // Simulating API call with timeout
        setTimeout(() => {
          positions.value = [
            {
              id: 1,
              code: 'CDRRMO x-23',
              title: 'City Government Department Head',
              department: 'DRRM Office',
              deadline: '2025-06-30',
              status: 'Not Started',
              applicants: [
                {
                  id: 1,
                  name: 'ALCOBER, RUEL ANTO',
                  education: 'Masters in Disaster Management',
                  experience: '5 years as Assistant DRRM Officer',
                  training: '60 hours DRRM Training',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 15,
                  trainingScore: 15,
                  performance: 15,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 1,
                },
                {
                  id: 2,
                  name: 'SANTOS, MARIA CLARA',
                  education: 'Bachelor in Public Administration',
                  experience: '3 years in local government',
                  training: '40 hours leadership training',
                  eligibility: 'Civil Service Professional',
                  educationScore: 20,
                  experienceScore: 10,
                  trainingScore: 10,
                  performance: 10,
                  bei: 15,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 2,
                },
                {
                  id: 3,
                  name: 'REYES, JUAN MIGUEL',
                  education: 'PhD in Emergency Management',
                  experience: '8 years in Disaster Response',
                  training: '120 hours DRRM Advanced Training',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 25,
                  trainingScore: 15,
                  performance: 15,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 2,
              code: 'CITY-IT-12',
              title: 'Information Technology Officer',
              department: 'IT Department',
              deadline: '2025-06-25',
              status: 'In Progress',
              applicants: [
                {
                  id: 1,
                  name: 'LOPEZ, MICHAEL',
                  education: 'BS Computer Science',
                  experience: '7 years as IT Specialist',
                  training: '120 hours IT Security Training',
                  eligibility: 'Civil Service Professional',
                  educationScore: 23,
                  experienceScore: 22,
                  trainingScore: 14,
                  performance: 14,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'GARCIA, ANA MARIE',
                  education: 'Masters in Information Systems',
                  experience: '5 years as Systems Administrator',
                  training: '80 hours Network Security',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 18,
                  trainingScore: 14,
                  performance: 13,
                  bei: 19,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 3,
              code: 'CITY-PLAN-07',
              title: 'City Planner IV',
              department: 'Planning and Development',
              deadline: '2025-07-05',
              status: 'Not Started',
              applicants: [
                {
                  id: 1,
                  name: 'MENDOZA, RAFAEL',
                  education: 'Masters in Urban Planning',
                  experience: '9 years in Urban Development',
                  training: '100 hours GIS and Mapping',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 24,
                  trainingScore: 15,
                  performance: 14,
                  bei: 23,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'TAN, ELIZABETH',
                  education: 'PhD in Regional Planning',
                  experience: '12 years in City Planning',
                  training: '150 hours Urban Design',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 25,
                  trainingScore: 15,
                  performance: 15,
                  bei: 24,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 4,
              code: 'CHO-DOC-15',
              title: 'City Health Officer',
              department: 'Health Department',
              deadline: '2025-07-15',
              status: 'Overdue',
              applicants: [
                {
                  id: 1,
                  name: 'DE LEON, CRISTINA',
                  education: 'Doctor of Medicine',
                  experience: '7 years as Assistant Health Officer',
                  training: '200 hours Public Health Management',
                  eligibility: 'Medical Board Passer',
                  educationScore: 25,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 5,
              code: 'CENRO-ENV-08',
              title: 'Environmental Management Specialist',
              department: 'Environment and Natural Resources',
              deadline: '2025-06-28',
              status: 'Completed',
              applicants: [
                {
                  id: 1,
                  name: 'SANTOS, ROBERTO',
                  education: 'Masters in Environmental Science',
                  experience: '6 years in Environmental Planning',
                  training: '90 hours Environmental Impact Assessment',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 20,
                  trainingScore: 15,
                  performance: 13,
                  bei: 20,
                  totalQS: 92,
                  grandTotal: 92,
                  ranking: 1,
                },
                {
                  id: 2,
                  name: 'REYES, JULIETA',
                  education: 'BS Environmental Engineering',
                  experience: '5 years in Waste Management',
                  training: '75 hours Environmental Compliance',
                  eligibility: 'Civil Service Professional',
                  educationScore: 20,
                  experienceScore: 18,
                  trainingScore: 14,
                  performance: 12,
                  bei: 18,
                  totalQS: 82,
                  grandTotal: 82,
                  ranking: 2,
                },
              ],
            },
          ];
          loading.value = false;
        }, 500);
      };

      // Initialize data
      onMounted(() => {
        loadPositions();
      });

      return {
        positions,
        loading,
        columns,
        pagination,
        search,
        filterByDepartment,
        statusFilter,
        departmentOptions,
        statusOptions,
        filteredPositions,
        showRatingForm,
        selectedPosition,
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

  .hover-row {
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }

  // Apply consistent font size across all components
  .consistent-font {
    font-size: 0.85rem;
  }

  // Match font sizes with the rating form
  :deep(.q-table) {
    th,
    td {
      font-size: 0.85rem;
    }

    // Force table to respect column widths
    table {
      table-layout: fixed;
      width: 100%;
    }
  }

  // Status badge styling
  .status-badge {
    font-size: 0.85rem !important;
    font-weight: normal;
    padding: 2px 8px;
  }

  // Style for filter components to make font size consistent
  .filter-component {
    :deep(.q-field__native),
    :deep(.q-field__prefix),
    :deep(.q-field__suffix),
    :deep(input),
    :deep(.q-field__label) {
      font-size: 0.85rem !important;
    }

    :deep(.q-field__marginal) {
      height: 40px;
    }
  }

  // Make dropdown options consistent
  :deep(.q-menu) {
    .q-item,
    .q-item__label {
      font-size: 0.85rem !important;
      min-height: 32px;
      padding: 4px 16px;
    }
  }

  // Ensure dropdown option text has consistent size
  :deep(.q-select__dropdown-icon) {
    font-size: 0.85rem;
  }

  // Specifically target status filter dropdown items
  :deep(.q-select[label='Status']) {
    .q-item,
    .q-item__label {
      font-size: 0.85rem !important;
    }
  }

  // Style for notification messages to match
  :deep(.q-notification) {
    font-size: 0.85rem;
  }
</style>
