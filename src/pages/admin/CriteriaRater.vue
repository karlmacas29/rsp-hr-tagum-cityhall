<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="row justify-between items-center">
        <div>
          <h5 class="text-h5 q-ma-none text-weight-bold">Criteria Management</h5>
          <p class="text-caption text-grey q-mt-sm q-mb-none">
            Create, view, and manage rating criteria for job positions
          </p>
        </div>

        <!-- SG Criteria Navigation Button -->
        <q-btn
          unelevated
          color="purple"
          icon="workspace_premium"
          label="Salary Grade Criteria"
          @click="goToSGCriteria"
          class="text-white"
        >
          <q-tooltip>Switch to Criteria Management by Salary Grade</q-tooltip>
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
          placeholder="Search jobs..."
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
        :rows="filteredJobs"
        :columns="columns"
        row-key="id"
        flat
        bordered
        class="minimal-table wrap-layout"
        v-model:pagination="pagination"
        :loading="loading"
        no-data-label="No jobs found"
      >
        <!-- Office Column -->
        <template v-slot:body-cell-office="props">
          <q-td class="col-office">
            <div class="cell-content">{{ props.row.office || '-' }}</div>
          </q-td>
        </template>

        <!-- Position Column -->
        <template v-slot:body-cell-Position="props">
          <q-td class="col-position">
            <div class="cell-content">{{ props.row.Position || '-' }}</div>
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
              <span
                v-if="props.row.assigned_raters && props.row.assigned_raters.length > 0"
                class="text-12"
              >
                {{ props.row.assigned_raters.length }} rater(s)
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
              <div>No jobs found</div>
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Criteria Modal -->
    <criteria-rater-modal
      v-model="showCriteriaModal"
      :job-id="selectedJobId"
      :mode="modalMode"
      :has-permission="canModify"
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
  const jobs = ref([]);
  const globalSearch = ref('');
  const dateRange = ref({ from: '', to: '' });
  const showDatePicker = ref(false);

  // Modal State
  const showCriteriaModal = ref(false);
  const selectedJobId = ref(null);
  const modalMode = ref('create');

  // Pagination
  const pagination = ref({
    sortBy: 'created_at',
    descending: true,
    page: 1,
    rowsPerPage: 10,
  });

  // ============================================================================
  // TABLE COLUMNS
  // ============================================================================

  const columns = [
    {
      name: 'office',
      label: 'Office',
      field: 'office',
      align: 'left',
      sortable: true,
      classes: 'col-office',
    },
    {
      name: 'Position',
      label: 'Position',
      field: 'Position',
      align: 'left',
      sortable: true,
      classes: 'col-position',
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
      field: (row) => row.assigned_raters?.length || 0,
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
   * Filter jobs by date range and search term
   */
  const filteredJobs = computed(() => {
    let filtered = jobs.value;

    // Date range filter
    if (dateRange.value.from && dateRange.value.to) {
      filtered = filtered.filter((job) => {
        if (!job.created_at) return true;
        const jobDate = new Date(job.created_at);
        const from = new Date(dateRange.value.from);
        const to = new Date(dateRange.value.to);
        to.setHours(23, 59, 59, 999);
        return jobDate >= from && jobDate <= to;
      });
    }

    // Search filter
    if (globalSearch.value) {
      const term = globalSearch.value.toLowerCase();
      filtered = filtered.filter((job) => {
        return (
          (job.office && job.office.toLowerCase().includes(term)) ||
          (job.Position && job.Position.toLowerCase().includes(term))
        );
      });
    }

    return filtered;
  });

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Navigate to SG Criteria page
   */
  function goToSGCriteria() {
    router.push('/criteria/sg');
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
   * Check if job has criteria
   */
  function hasCriteria(job) {
    return job.criteria_ratings && job.criteria_ratings.length > 0;
  }

  /**
   * Open criteria modal
   */
  async function openModal(job, mode) {
    // Permission check
    if ((mode === 'create' || mode === 'edit') && !canModify.value) {
      console.warn(`User does not have permission to ${mode} criteria`);
      return;
    }

    selectedJobId.value = job.id;
    modalMode.value = mode;
    showCriteriaModal.value = true;
  }

  /**
   * Handle criteria saved
   */
  function onCriteriaSaved() {
    loadJobPosts();
    showCriteriaModal.value = false;
    selectedJobId.value = null;
  }

  /**
   * Switch from view to edit mode
   */
  function handleSwitchToEdit(jobId) {
    if (!canModify.value) {
      console.warn('User does not have permission to edit criteria');
      return;
    }

    showCriteriaModal.value = false;
    nextTick(() => {
      selectedJobId.value = jobId;
      modalMode.value = 'edit';
      showCriteriaModal.value = true;
    });
  }

  /**
   * Load job posts
   */
  async function loadJobPosts() {
    loading.value = true;
    try {
      await jobPostStore.criteria_list();
      jobs.value = jobPostStore.jobPosts || [];
      setDateRange();
    } catch (error) {
      console.error('Error loading job posts:', error);
      jobs.value = [];
    } finally {
      loading.value = false;
    }
  }

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  onMounted(() => {
    loadJobPosts();
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
  /* Column Width Definitions (Flexible) */
  /* ========================================================================== */

  .wrap-layout {
    :deep(.col-office) {
      width: 35%;
      min-width: 120px;
    }

    :deep(.col-position) {
      width: 35%;
      min-width: 140px;
    }

    :deep(.col-status) {
      width: 15%;
      min-width: 100px;
    }

    :deep(.col-raters) {
      width: 10%;
      min-width: 100px;
    }

    :deep(.col-action) {
      width: 10%;
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

      :deep(.col-office) {
        width: 25%;
        min-width: 100px;
      }

      :deep(.col-position) {
        width: 25%;
        min-width: 120px;
      }

      :deep(.col-status) {
        width: 20%;
        min-width: 90px;
      }

      :deep(.col-raters) {
        width: 15%;
        min-width: 90px;
      }

      :deep(.col-action) {
        width: 15%;
        min-width: 120px;
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

      :deep(.col-office) {
        width: 25%;
        min-width: 80px;
      }

      :deep(.col-position) {
        width: 25%;
        min-width: 100px;
      }

      :deep(.col-status) {
        width: 20%;
        min-width: 80px;
      }

      :deep(.col-raters) {
        width: 15%;
        min-width: 80px;
      }

      :deep(.col-action) {
        width: 15%;
        min-width: 100px;
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

      :deep(.col-office) {
        width: 25%;
        min-width: 70px;
      }

      :deep(.col-position) {
        width: 25%;
        min-width: 90px;
      }

      :deep(.col-status) {
        width: 20%;
        min-width: 70px;
      }

      :deep(.col-raters) {
        width: 15%;
        min-width: 70px;
      }

      :deep(.col-action) {
        width: 15%;
        min-width: 90px;
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
