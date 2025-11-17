<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="row justify-between items-center">
        <div>
          <h5 class="text-h5 q-ma-none text-weight-bold">Criteria Management by Salary Grade</h5>
          <p class="text-caption text-grey q-mt-sm q-mb-none">
            Create, view, and manage rating criteria grouped by salary grade
          </p>
        </div>

        <!-- Back to Position View Button -->
        <q-btn
          unelevated
          color="primary"
          icon="arrow_back"
          label="Back to Position View"
          @click="goToPositionView"
          class="text-white"
        >
          <q-tooltip>Switch to Criteria Management by Position</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Filters -->
    <div class="row justify-between items-center q-mb-md">
      <!-- Date Range Picker -->
      <q-input
        v-model="dateRangeText"
        outlined
        dense
        readonly
        placeholder="Select Date Range"
        class="col-auto"
        style="max-width: 280px"
        @click="showDatePicker = true"
      >
        <template v-slot:prepend>
          <q-icon name="event" color="primary" class="cursor-pointer" />
        </template>
        <template v-slot:append>
          <q-icon name="arrow_drop_down" color="primary" class="cursor-pointer" />
        </template>
      </q-input>

      <!-- Date Picker Popup -->
      <q-popup-proxy v-model="showDatePicker" cover transition-show="scale" transition-hide="scale">
        <q-date
          v-model="dateRange"
          range
          landscape
          today-btn
          mask="YYYY-MM-DD"
          color="primary"
          @update:model-value="onDateRangeChange"
        >
          <div class="row items-center justify-end q-gutter-x-sm">
            <q-btn
              label="Clear"
              class="bg-negative text-white"
              rounded
              flat
              dense
              @click="clearDateRange"
              v-if="dateRange.from || dateRange.to"
            />
            <q-btn label="Okay" class="bg-primary text-white" rounded flat dense v-close-popup />
          </div>
        </q-date>
      </q-popup-proxy>

      <!-- Search Input -->
      <div class="row items-center">
        <q-input
          v-model="globalSearch"
          outlined
          dense
          placeholder="Search salary grade..."
          class="col-auto"
          style="max-width: 220px"
          clearable
          @clear="globalSearch = ''"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Table -->
    <q-card class="table-card">
      <q-linear-progress v-if="loading" indeterminate color="primary" />

      <q-table
        :rows="filteredSalaryGrades"
        :columns="columns"
        row-key="salary_grade"
        flat
        bordered
        class="minimal-table wrap-layout"
        v-model:pagination="pagination"
        :loading="loading"
        no-data-label="No salary grades found"
      >
        <!-- Salary Grade Column -->
        <template v-slot:body-cell-salaryGrade="props">
          <q-td class="col-salary-grade">
            <div class="cell-content">
              <q-badge
                color="purple"
                :label="`SG ${props.row.salary_grade}`"
                class="text-weight-bold"
              />
            </div>
          </q-td>
        </template>

        <!-- Position Count Column -->
        <template v-slot:body-cell-positionCount="props">
          <q-td class="col-position-count">
            <div class="cell-content text-center">
              <q-chip dense color="blue-2" text-color="blue-9">
                {{ props.row.position_count }} position(s)
              </q-chip>
            </div>
          </q-td>
        </template>

        <!-- Positions Column -->
        <template v-slot:body-cell-positions="props">
          <q-td class="col-positions">
            <div class="cell-content">
              <div class="positions-list">
                <q-chip
                  v-for="(position, index) in props.row.positions.slice(0, 3)"
                  :key="index"
                  dense
                  size="sm"
                  color="grey-3"
                  text-color="grey-8"
                  class="q-mr-xs q-mb-xs"
                >
                  {{ position }}
                </q-chip>
                <q-chip
                  v-if="props.row.positions.length > 3"
                  dense
                  size="sm"
                  color="primary"
                  text-color="white"
                  clickable
                  @click="showPositions(props.row)"
                >
                  +{{ props.row.positions.length - 3 }} more
                </q-chip>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Status Column -->
        <template v-slot:body-cell-status="props">
          <q-td class="col-status">
            <div class="cell-content text-center">
              <q-badge
                :color="getStatusColor(props.row.status)"
                :label="formatStatus(props.row.status)"
                class="text-11"
              />
            </div>
          </q-td>
        </template>

        <!-- Raters Column -->
        <template v-slot:body-cell-raters="props">
          <q-td class="col-raters">
            <div class="cell-content text-center">
              <span v-if="props.row.total_raters && props.row.total_raters > 0" class="text-12">
                {{ props.row.total_raters }} rater(s)
              </span>
              <span v-else class="text-grey text-12">-</span>
            </div>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-action="props">
          <q-td class="col-action">
            <div class="cell-content action-cell">
              <!-- View Button -->
              <q-btn
                v-if="hasCriteria(props.row)"
                flat
                round
                dense
                size="sm"
                icon="visibility"
                color="info"
                class="bg-blue-1"
                @click="openModal(props.row, 'view')"
                :disable="loading"
              >
                <q-tooltip>View Criteria</q-tooltip>
              </q-btn>

              <!-- Create Button -->
              <q-btn
                v-if="!hasCriteria(props.row) && canModify"
                flat
                round
                dense
                size="sm"
                icon="add_circle"
                color="positive"
                class="bg-green-1"
                @click="openModal(props.row, 'create')"
                :disable="loading"
              >
                <q-tooltip>Create Criteria</q-tooltip>
              </q-btn>

              <!-- Edit Button -->
              <q-btn
                v-if="hasCriteria(props.row) && canModify"
                flat
                round
                dense
                size="sm"
                icon="edit"
                color="primary"
                class="bg-orange-1"
                @click="openModal(props.row, 'edit')"
                :disable="loading"
              >
                <q-tooltip>Edit Criteria</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <!-- No Data State -->
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-lg text-grey">
            <div class="text-center">
              <q-icon name="inbox" size="2rem" class="q-mb-sm" />
              <div>No salary grades found</div>
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Positions List Dialog -->
    <q-dialog v-model="showPositionsDialog">
      <q-card style="min-width: 400px; max-width: 600px">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">
            Positions - Salary Grade {{ selectedSalaryGradeData?.salary_grade }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </q-card-section>

        <q-card-section>
          <q-list bordered separator>
            <q-item v-for="(position, index) in selectedSalaryGradeData?.positions" :key="index">
              <q-item-section avatar>
                <q-icon name="work" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ position }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Criteria Modal for Salary Grade -->
    <criteria-rater-modal
      v-model="showCriteriaModal"
      :job-id="selectedJobIds"
      :salary-grade="selectedSalaryGrade"
      :mode="modalMode"
      :has-permission="canModify"
      :is-salary-grade-mode="true"
      @saved="onCriteriaSaved"
      @switch-to-edit="handleSwitchToEdit"
    />
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { date } from 'quasar';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'stores/authStore';
  import { useJobPostStore } from 'stores/jobPostStore';
  import CriteriaRaterModal from 'src/components/CriteriaModal.vue';

  const router = useRouter();
  const authStore = useAuthStore();
  const jobPostStore = useJobPostStore();
  const { formatDate } = date;

  // ============================================================================
  // STATE
  // ============================================================================

  const loading = ref(false);
  const salaryGrades = ref([]);
  const globalSearch = ref('');
  const dateRange = ref({ from: '', to: '' });
  const showDatePicker = ref(false);

  // Modal State
  const showCriteriaModal = ref(false);
  const selectedSalaryGrade = ref(null);
  const selectedSalaryGradeData = ref(null);
  const selectedJobIds = ref([]);
  const modalMode = ref('create');

  // Positions Dialog
  const showPositionsDialog = ref(false);

  // Pagination
  const pagination = ref({
    sortBy: 'salary_grade',
    descending: false,
    page: 1,
    rowsPerPage: 10,
  });

  // ============================================================================
  // TABLE COLUMNS
  // ============================================================================

  const columns = [
    {
      name: 'salaryGrade',
      label: 'Salary Grade',
      field: 'salary_grade',
      align: 'left',
      sortable: true,
      classes: 'col-salary-grade',
    },
    {
      name: 'positionCount',
      label: 'Positions',
      field: 'position_count',
      align: 'center',
      sortable: true,
      classes: 'col-position-count',
    },
    {
      name: 'positions',
      label: 'Position Names',
      field: 'positions',
      align: 'left',
      sortable: false,
      classes: 'col-positions',
    },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'center',
      sortable: false,
      classes: 'col-status',
    },
    {
      name: 'raters',
      label: 'Raters',
      field: 'total_raters',
      align: 'center',
      sortable: false,
      classes: 'col-raters',
    },
    {
      name: 'action',
      label: 'Actions',
      field: 'action',
      align: 'center',
      sortable: false,
      classes: 'col-action',
    },
  ];

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Check if user has permission to modify criteria
   */
  const canModify = computed(() => {
    return authStore.user?.permissions?.modifyCriteria === '1';
  });

  /**
   * Format date range for display
   */
  const dateRangeText = computed(() => {
    if (!dateRange.value.from && !dateRange.value.to) return '';
    if (!dateRange.value.to) {
      return formatDate(dateRange.value.from, 'MMM D, YYYY');
    }
    return `${formatDate(dateRange.value.from, 'MMM D, YYYY')} - ${formatDate(dateRange.value.to, 'MMM D, YYYY')}`;
  });

  /**
   * Filter salary grades by date range and search term
   */
  const filteredSalaryGrades = computed(() => {
    let filtered = salaryGrades.value;

    // Date range filter
    if (dateRange.value.from && dateRange.value.to) {
      filtered = filtered.filter((sg) => {
        if (!sg.created_at) return true;
        const sgDate = new Date(sg.created_at);
        const from = new Date(dateRange.value.from);
        const to = new Date(dateRange.value.to);
        to.setHours(23, 59, 59, 999);
        return sgDate >= from && sgDate <= to;
      });
    }

    // Search filter
    if (globalSearch.value) {
      const term = globalSearch.value.toLowerCase();
      filtered = filtered.filter((sg) => {
        return (
          (sg.salary_grade && sg.salary_grade.toLowerCase().includes(term)) ||
          (sg.positions && sg.positions.some((pos) => pos.toLowerCase().includes(term)))
        );
      });
    }

    return filtered;
  });

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Navigate to position view
   */
  function goToPositionView() {
    router.push('/criteria');
  }

  /**
   * Set date range to current year
   */
  function setDateRange() {
    const now = new Date();
    const currentYear = now.getFullYear();
    dateRange.value = {
      from: formatDate(new Date(currentYear, 0, 1), 'YYYY-MM-DD'),
      to: formatDate(new Date(currentYear, 11, 31), 'YYYY-MM-DD'),
    };
  }

  /**
   * Clear date range
   */
  function clearDateRange() {
    dateRange.value = { from: '', to: '' };
  }

  /**
   * Handle date range change
   */
  function onDateRangeChange() {
    showDatePicker.value = false;
  }

  /**
   * Show positions dialog
   */
  function showPositions(salaryGradeData) {
    selectedSalaryGradeData.value = salaryGradeData;
    showPositionsDialog.value = true;
  }

  /**
   * Format status for display
   */
  function formatStatus(status) {
    if (!status) return 'Not Created';
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get status badge color
   */
  function getStatusColor(status) {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'created':
        return 'positive';
      case 'active':
        return 'info';
      case 'inactive':
        return 'negative';
      case 'not_created':
      case 'not created':
      default:
        return 'warning';
    }
  }

  /**
   * Check if salary grade has criteria
   */
  function hasCriteria(salaryGradeData) {
    return salaryGradeData.has_criteria === true;
  }

  /**
   * Open criteria modal
   */
  async function openModal(salaryGradeData, mode) {
    // Permission check
    if ((mode === 'create' || mode === 'edit') && !canModify.value) {
      console.warn(`User does not have permission to ${mode} criteria`);
      return;
    }

    selectedSalaryGrade.value = salaryGradeData.salary_grade;
    selectedSalaryGradeData.value = salaryGradeData;
    selectedJobIds.value = salaryGradeData.job_ids || [];
    modalMode.value = mode;
    showCriteriaModal.value = true;
  }

  /**
   * Handle criteria saved
   */
  function onCriteriaSaved() {
    loadSalaryGrades();
    showCriteriaModal.value = false;
    selectedSalaryGrade.value = null;
    selectedSalaryGradeData.value = null;
    selectedJobIds.value = [];
  }

  /**
   * Switch from view to edit mode
   */
  function handleSwitchToEdit() {
    if (!canModify.value) {
      console.warn('User does not have permission to edit criteria');
      return;
    }

    showCriteriaModal.value = false;
    nextTick(() => {
      modalMode.value = 'edit';
      showCriteriaModal.value = true;
    });
  }

  /**
   * Load and group job posts by salary grade
   */
  async function loadSalaryGrades() {
    loading.value = true;
    try {
      await jobPostStore.criteria_list();
      const jobs = jobPostStore.jobPosts || [];

      // Group jobs by salary grade
      const groupedData = jobs.reduce((acc, job) => {
        const sg = job.salary_grade || 'Unspecified';

        if (!acc[sg]) {
          acc[sg] = {
            salary_grade: sg,
            positions: [],
            position_count: 0,
            status: 'not_created',
            total_raters: 0,
            has_criteria: false,
            created_at: job.created_at,
            job_ids: [],
          };
        }

        // Add position
        if (job.Position) {
          acc[sg].positions.push(job.Position);
        }

        // Add job ID
        acc[sg].job_ids.push(job.id);

        // Update raters count
        if (job.assigned_raters && job.assigned_raters.length > 0) {
          acc[sg].total_raters += job.assigned_raters.length;
        }

        // Update criteria status
        if (job.criteria_ratings && job.criteria_ratings.length > 0) {
          acc[sg].has_criteria = true;
          acc[sg].status = 'created';
        }

        return acc;
      }, {});

      // Convert to array and calculate position count
      salaryGrades.value = Object.values(groupedData).map((sg) => ({
        ...sg,
        position_count: sg.positions.length,
      }));

      setDateRange();
    } catch (error) {
      console.error('Error loading salary grades:', error);
      salaryGrades.value = [];
    } finally {
      loading.value = false;
    }
  }

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  onMounted(() => {
    loadSalaryGrades();
  });
</script>

<style scoped lang="scss">
  /* ========================================================================== */
  /* Typography */
  /* ========================================================================== */

  .text-11 {
    font-size: 11px;
    line-height: 1.4;
  }

  .text-12 {
    font-size: 12px;
    line-height: 1.4;
  }

  .text-grey {
    color: #999;
  }

  .cursor-pointer {
    cursor: pointer;
    user-select: none;
  }

  /* ========================================================================== */
  /* Cards */
  /* ========================================================================== */

  .table-card {
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  /* ========================================================================== */
  /* Cell Content Wrapper */
  /* ========================================================================== */

  .cell-content {
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    line-height: 1.5;
    padding: 4px 0;
  }

  .positions-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  /* ========================================================================== */
  /* Table Styles */
  /* ========================================================================== */

  .minimal-table {
    :deep(.q-table__card) {
      box-shadow: none;
    }

    :deep(.q-table__container) {
      border: none;
    }
  }

  .wrap-layout {
    :deep(table) {
      table-layout: auto;
      width: 100%;
      border-collapse: collapse;
    }

    :deep(.q-table__row) {
      height: auto;
      min-height: 48px;
    }

    :deep(.q-table__row--even) {
      background-color: #fafafa;
    }

    :deep(.q-table__row:hover) {
      background-color: #f0f7ff;
    }

    :deep(.q-table th) {
      background-color: #f5f5f5;
      font-weight: 600;
      font-size: 12px;
      padding: 12px 12px;
      border-bottom: 2px solid #e0e0e0;
      white-space: nowrap;
      vertical-align: middle;
    }

    :deep(.q-table td) {
      padding: 10px 12px;
      font-size: 13px;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: top;
      word-break: break-word;
      overflow-wrap: break-word;
    }
  }

  /* ========================================================================== */
  /* Column Width Definitions */
  /* ========================================================================== */

  .wrap-layout {
    :deep(.col-salary-grade) {
      width: 12%;
      min-width: 100px;
    }

    :deep(.col-position-count) {
      width: 12%;
      min-width: 100px;
    }

    :deep(.col-positions) {
      width: 38%;
      min-width: 200px;
    }

    :deep(.col-status) {
      width: 13%;
      min-width: 100px;
    }

    :deep(.col-raters) {
      width: 10%;
      min-width: 100px;
    }

    :deep(.col-action) {
      width: 15%;
      min-width: 140px;
    }
  }

  /* ========================================================================== */
  /* Actions */
  /* ========================================================================== */

  .action-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;

    :deep(.q-btn) {
      margin: 2px;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover:not(:disabled) {
        transform: scale(1.1);
      }
    }
  }

  /* ========================================================================== */
  /* Responsive Design */
  /* ========================================================================== */

  @media (max-width: 1200px) {
    .wrap-layout {
      :deep(.q-table th),
      :deep(.q-table td) {
        padding: 9px 10px;
        font-size: 12px;
      }

      :deep(.q-table__row) {
        min-height: 44px;
      }
    }
  }

  @media (max-width: 768px) {
    .wrap-layout {
      :deep(.q-table th),
      :deep(.q-table td) {
        padding: 8px 8px;
        font-size: 11px;
      }

      :deep(.q-table__row) {
        min-height: 40px;
      }
    }

    .cell-content {
      font-size: 11px;
    }

    .text-11 {
      font-size: 9px;
    }

    .text-12 {
      font-size: 10px;
    }
  }

  @media (max-width: 480px) {
    .wrap-layout {
      :deep(.q-table th),
      :deep(.q-table td) {
        padding: 6px 6px;
        font-size: 10px;
      }

      :deep(.q-table__row) {
        min-height: 36px;
      }
    }

    .action-cell {
      gap: 4px;
    }

    .cell-content {
      font-size: 10px;
      line-height: 1.4;
    }
  }

  /* ========================================================================== */
  /* Scrollbar Styling */
  /* ========================================================================== */

  .wrap-layout {
    :deep(.q-table__container) {
      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;

        &:hover {
          background: #555;
        }
      }
    }
  }

  /* ========================================================================== */
  /* Print Styles */
  /* ========================================================================== */

  @media print {
    .wrap-layout {
      :deep(.q-table__row) {
        page-break-inside: avoid;
      }
    }
  }
</style>
