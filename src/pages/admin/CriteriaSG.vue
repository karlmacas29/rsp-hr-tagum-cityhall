<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="row justify-between items-center">
        <div>
          <h5 class="text-h5 q-ma-none text-weight-bold">Criteria Library by Salary Grade</h5>
          <p class="text-caption text-grey q-mt-sm q-mb-none">
            Manage rating criteria templates grouped by salary grade ranges
          </p>
        </div>

        <!-- Back Button -->
        <div class="row q-gutter-sm">
          <q-btn
            v-if="canModify"
            unelevated
            color="positive"
            icon="add"
            label="Create New Criteria"
            @click="openCreateModal"
            class="text-white"
          >
            <q-tooltip>Create New Salary Grade Criteria</q-tooltip>
          </q-btn>

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
        :rows="filteredCriteria"
        :columns="columns"
        row-key="id"
        flat
        bordered
        class="minimal-table wrap-layout"
        v-model:pagination="pagination"
        :loading="loading"
        no-data-label="No salary grade criteria found"
      >
        <!-- Salary Grade Range Column -->
        <template v-slot:body-cell-salaryGradeRange="props">
          <q-td class="col-sg-range">
            <div class="cell-content text-center">
              <q-badge color="purple" text-color="white" class="text-weight-bold text-12">
                SG {{ props.row.sg_min }} - {{ props.row.sg_max }}
              </q-badge>
            </div>
          </q-td>
        </template>

        <!-- Created Date Column -->
        <template v-slot:body-cell-createdDate="props">
          <q-td class="col-created-date">
            <div class="cell-content text-center">
              <div class="text-12">
                <q-icon name="event" size="xs" class="q-mr-xs text-grey-6" />
                {{ formatCreatedDate(props.row.created_at) }}
              </div>
            </div>
          </q-td>
        </template>

        <!-- Updated Date Column -->
        <template v-slot:body-cell-updatedDate="props">
          <q-td class="col-updated-date">
            <div class="cell-content text-center">
              <div class="text-12 text-grey-7">
                {{ formatCreatedDate(props.row.updated_at) }}
              </div>
            </div>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-action="props">
          <q-td class="col-action">
            <div class="cell-content action-cell">
              <!-- View Button -->
              <q-btn
                flat
                round
                dense
                size="sm"
                icon="visibility"
                color="info"
                class="bg-blue-1"
                @click="openViewModal(props.row)"
                :disable="loading"
              >
                <q-tooltip>View Criteria</q-tooltip>
              </q-btn>

              <!-- Edit Button -->
              <q-btn
                v-if="canModify"
                flat
                round
                dense
                size="sm"
                icon="edit"
                color="primary"
                class="bg-orange-1"
                @click="openEditModal(props.row)"
                :disable="loading"
              >
                <q-tooltip>Edit Criteria</q-tooltip>
              </q-btn>

              <!-- Delete Button -->
              <q-btn
                v-if="canModify"
                flat
                round
                dense
                size="sm"
                icon="delete"
                color="negative"
                class="bg-red-1"
                @click="confirmDelete(props.row)"
                :disable="loading"
              >
                <q-tooltip>Delete Criteria</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <!-- No Data State -->
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-lg text-grey">
            <div class="text-center">
              <q-icon name="inbox" size="2rem" class="q-mb-sm" />
              <div>No salary grade criteria found</div>
              <q-btn
                v-if="canModify"
                color="primary"
                label="Create First Criteria"
                unelevated
                class="q-mt-md"
                @click="openCreateModal"
              />
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Criteria Modal -->
    <criteria-sg-modal
      v-model="showCriteriaModal"
      :criteria-id="selectedCriteriaId"
      :sg-min="selectedSgMin"
      :sg-max="selectedSgMax"
      :mode="modalMode"
      :has-permission="canModify"
      @saved="onCriteriaSaved"
      @switch-to-edit="handleSwitchToEdit"
    />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center bg-negative text-white">
          <q-icon name="warning" size="md" class="q-mr-sm" />
          <span class="text-h6">Confirm Delete</span>
        </q-card-section>

        <q-card-section>
          <p class="text-body1">
            Are you sure you want to delete the criteria for Salary Grade
            <strong>
              {{ selectedCriteriaToDelete?.sg_min }} - {{ selectedCriteriaToDelete?.sg_max }}
            </strong>
            ?
          </p>
          <p class="text-caption text-grey-7">This action cannot be undone.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            label="Delete"
            color="negative"
            @click="deleteCriteria"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { date, useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'stores/authStore';
  import { useCriteriaStore } from 'stores/criteriaStore';
  import CriteriaSgModal from 'src/components/CriteriaSGModal.vue';

  const router = useRouter();
  const $q = useQuasar();
  const authStore = useAuthStore();
  const criteriaStore = useCriteriaStore();
  const { formatDate } = date;

  // ============================================================================
  // STATE
  // ============================================================================

  const loading = ref(false);
  const deleting = ref(false);
  const criteriaList = ref([]);
  const globalSearch = ref('');
  const dateRange = ref({ from: '', to: '' });
  const showDatePicker = ref(false);

  // Modal State
  const showCriteriaModal = ref(false);
  const selectedCriteriaId = ref(null);
  const selectedSgMin = ref(null);
  const selectedSgMax = ref(null);
  const modalMode = ref('create');

  // Delete Dialog
  const showDeleteDialog = ref(false);
  const selectedCriteriaToDelete = ref(null);

  // Pagination
  const pagination = ref({
    sortBy: 'sg_min',
    descending: false,
    page: 1,
    rowsPerPage: 10,
  });

  // ============================================================================
  // TABLE COLUMNS
  // ============================================================================

  const columns = [
    {
      name: 'salaryGradeRange',
      label: 'Salary Grade Range',
      field: 'sg_range',
      align: 'center',
      sortable: true,
      classes: 'col-sg-range',
    },
    {
      name: 'createdDate',
      label: 'Created Date',
      field: 'created_at',
      align: 'center',
      sortable: true,
      classes: 'col-created-date',
    },
    {
      name: 'updatedDate',
      label: 'Last Updated',
      field: 'updated_at',
      align: 'center',
      sortable: true,
      classes: 'col-updated-date',
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
      return formatDate(dateRange.value.from, 'MMMM D, YYYY');
    }
    return `${formatDate(dateRange.value.from, 'MMMM D, YYYY')} - ${formatDate(dateRange.value.to, 'MMMM D, YYYY')}`;
  });

  /**
   * Filter criteria by date range and search term
   */
  const filteredCriteria = computed(() => {
    let filtered = criteriaList.value;

    // Date range filter
    if (dateRange.value.from && dateRange.value.to) {
      filtered = filtered.filter((item) => {
        if (!item.created_at) return true;
        const itemDate = new Date(item.created_at);
        const from = new Date(dateRange.value.from);
        const to = new Date(dateRange.value.to);
        to.setHours(23, 59, 59, 999);
        return itemDate >= from && itemDate <= to;
      });
    }

    // Search filter
    if (globalSearch.value) {
      const term = globalSearch.value.toLowerCase();
      filtered = filtered.filter((item) => {
        const sgRange = `${item.sg_min} - ${item.sg_max}`.toLowerCase();
        return sgRange.includes(term);
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
   * Format created date
   */
  function formatCreatedDate(dateString) {
    if (!dateString) return '-';
    return formatDate(dateString, 'MMMM D, YYYY');
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
   * Open create modal
   */
  function openCreateModal() {
    if (!canModify.value) {
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to create criteria',
      });
      return;
    }

    selectedCriteriaId.value = null;
    selectedSgMin.value = null;
    selectedSgMax.value = null;
    modalMode.value = 'create';
    showCriteriaModal.value = true;
  }

  /**
   * Open view modal
   */
  function openViewModal(criteria) {
    selectedCriteriaId.value = criteria.id;
    selectedSgMin.value = criteria.sg_min;
    selectedSgMax.value = criteria.sg_max;
    modalMode.value = 'view';
    showCriteriaModal.value = true;
  }

  /**
   * Open edit modal
   */
  function openEditModal(criteria) {
    if (!canModify.value) {
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to edit criteria',
      });
      return;
    }

    selectedCriteriaId.value = criteria.id;
    selectedSgMin.value = criteria.sg_min;
    selectedSgMax.value = criteria.sg_max;
    modalMode.value = 'edit';
    showCriteriaModal.value = true;
  }

  /**
   * Confirm delete
   */
  function confirmDelete(criteria) {
    if (!canModify.value) {
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to delete criteria',
      });
      return;
    }

    selectedCriteriaToDelete.value = criteria;
    showDeleteDialog.value = true;
  }

  /**
   * Delete criteria
   */
  async function deleteCriteria() {
    if (!selectedCriteriaToDelete.value) return;

    deleting.value = true;
    try {
      await criteriaStore.deleteCriteriaSG(selectedCriteriaToDelete.value.id);

      $q.notify({
        type: 'positive',
        message: 'Criteria deleted successfully',
      });

      showDeleteDialog.value = false;
      selectedCriteriaToDelete.value = null;
      loadCriteria();
    } catch (error) {
      console.error('Error deleting criteria:', error);
      $q.notify({
        type: 'negative',
        message: error.message || 'Failed to delete criteria',
      });
    } finally {
      deleting.value = false;
    }
  }

  /**
   * Handle criteria saved
   */
  function onCriteriaSaved() {
    loadCriteria();
    showCriteriaModal.value = false;
    selectedCriteriaId.value = null;
    selectedSgMin.value = null;
    selectedSgMax.value = null;
  }

  /**
   * Switch from view to edit mode
   */
  function handleSwitchToEdit() {
    if (!canModify.value) {
      $q.notify({
        type: 'warning',
        message: 'You do not have permission to edit criteria',
      });
      return;
    }

    showCriteriaModal.value = false;
    nextTick(() => {
      modalMode.value = 'edit';
      showCriteriaModal.value = true;
    });
  }

  /**
   * Load salary grade criteria
   */
  async function loadCriteria() {
    loading.value = true;
    try {
      const data = await criteriaStore.fetchAllCriteriaSG();
      criteriaList.value = data || [];
      setDateRange();
    } catch (error) {
      console.error('Error loading criteria:', error);
      criteriaList.value = [];
      $q.notify({
        type: 'negative',
        message: 'Failed to load criteria',
      });
    } finally {
      loading.value = false;
    }
  }

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  onMounted(() => {
    loadCriteria();
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
      vertical-align: middle;
    }
  }

  /* ========================================================================== */
  /* Column Width Definitions */
  /* ========================================================================== */

  .wrap-layout {
    :deep(.col-sg-range) {
      width: 30%;
      min-width: 150px;
    }

    :deep(.col-created-date) {
      width: 25%;
      min-width: 150px;
    }

    :deep(.col-updated-date) {
      width: 25%;
      min-width: 150px;
    }

    :deep(.col-action) {
      width: 20%;
      min-width: 150px;
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
    }
  }

  @media (max-width: 768px) {
    .wrap-layout {
      :deep(.q-table th),
      :deep(.q-table td) {
        padding: 8px 8px;
        font-size: 11px;
      }
    }

    .cell-content {
      font-size: 11px;
    }
  }
</style>
