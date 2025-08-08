<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Criteria</b></h5>
    </div>

    <!-- Filters -->
    <div class="row justify-between items-center q-mb-md">
      <!-- Date Range Picker -->
      <q-input
        outlined
        dense
        readonly
        v-model="dateRangeText"
        placeholder="Select Date Range"
        class="col-auto q-mr-md"
        style="max-width: 280px"
      >
        <template v-slot:prepend>
          <q-icon name="event" color="primary" class="cursor-pointer" />
        </template>
        <template v-slot:append>
          <q-icon name="arrow_drop_down" color="primary" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
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
                    @click="dateRange = { from: '', to: '' }"
                    v-if="dateRange.from || dateRange.to"
                  />
                  <q-btn
                    label="Okay"
                    class="bg-primary text-white"
                    rounded
                    flat
                    dense
                    v-close-popup
                  />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- Search and Actions -->
      <div class="row items-center">
        <q-input
          v-model="globalSearch"
          outlined
          dense
          placeholder="Search jobs..."
          class="col-auto"
          style="max-width: 220px"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
        <q-btn
          v-if="selectedRows.length > 0"
          class="q-ml-sm"
          color="primary"
          label="Same as"
          @click="handleSameAs"
        />
      </div>
    </div>

    <!-- Table -->
    <q-table
      :rows="filteredJobs"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      class="job-posts-table q-mt-md"
      :loading="loading"
      table-style="min-width: 100%"
      selection="multiple"
      v-model:selected="selectedRows"
    >
      <!-- Office Column -->
      <template v-slot:body-cell-office="props">
        <q-td :props="props" class="office-column">
          <div class="text-body2 text-weight-medium text-black">
            {{ props.row.office }}
          </div>
        </q-td>
      </template>

      <!-- Position Column -->
      <template v-slot:body-cell-Position="props">
        <q-td :props="props" class="position-column">
          <div class="text-body2 text-weight-medium text-black">
            {{ props.row.Position }}
          </div>
        </q-td>
      </template>

      <!-- Status Column -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props" class="status-column">
          <q-chip
            :color="getStatusColor(props.row.status)"
            text-color="white"
            dense
            class="text-body2"
          >
            {{ formatStatus(props.row.status) }}
          </q-chip>
        </q-td>
      </template>

      <!-- Rater Column -->
      <template v-slot:body-cell-raters="props">
        <q-td :props="props" class="rater-column">
          <div v-if="props.row.assigned_raters.length > 0" class="text-body2">
            {{ formatRaters(props.row.assigned_raters) }}
          </div>
          <span v-else class="text-grey">Not Assigned</span>
        </q-td>
      </template>

      <!-- Action Column -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="action-column q-gutter-x-xs">
          <q-btn
            v-if="!hasCriteria(props.row)"
            round
            flat
            color="green"
            class="bg-green-1"
            icon="add"
            @click="openCriteriaModal(props.row, 'create')"
          >
            <q-tooltip>Create Criteria</q-tooltip>
          </q-btn>
          <template v-else>
            <q-btn
              round
              flat
              color="blue"
              class="bg-blue-1"
              icon="visibility"
              @click="openCriteriaModal(props.row, 'view')"
            >
              <q-tooltip>View Criteria</q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              color="orange"
              class="bg-orange-1"
              icon="edit"
              @click="openCriteriaModal(props.row, 'edit')"
            >
              <q-tooltip>Edit Criteria</q-tooltip>
            </q-btn>
          </template>
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">No job posts found</div>
      </template>
    </q-table>

    <!-- Criteria Modal -->
    <criteria-rater-modal
      v-model="showCriteriaModal"
      :job="selectedJob"
      :criteria="selectedCriteria"
      :mode="modalMode"
      @saved="onCriteriaSaved"
      @switch-to-edit="handleSwitchToEdit"
    />
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { date } from 'quasar';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { useCriteriaStore } from 'stores/criteriaStore';
  import CriteriaRaterModal from 'src/components/CriteriaModal.vue';

  const jobPostStore = useJobPostStore();
  const criteriaStore = useCriteriaStore();
  const { formatDate } = date;

  // Table configuration
  const columns = [
    {
      name: 'office',
      label: 'Office',
      align: 'left',
      field: 'office',
      sortable: true,
      style: 'width: 25%',
    },
    {
      name: 'Position',
      label: 'Position',
      align: 'left',
      field: 'Position',
      sortable: true,
      style: 'width: 30%',
    },
    {
      name: 'status',
      label: 'Status',
      align: 'center',
      field: 'status',
      sortable: false,
      style: 'width: 13%',
    },
    {
      name: 'raters',
      label: 'Raters',
      align: 'center',
      field: (row) => row.assigned_raters.length,
      sortable: false,
      style: 'width: 15%',
    },
    {
      name: 'action',
      align: 'center',
      label: 'Actions',
      field: (row) => row.criteria_ratings.length,
      sortable: false,
      style: 'width: 17%',
    },
  ];

  // Reactive data
  const loading = ref(false);
  const jobs = ref([]);
  const selectedRows = ref([]);
  const selectedJob = ref(null);
  const selectedCriteria = ref(null);
  const showCriteriaModal = ref(false);
  const modalMode = ref('create');
  const globalSearch = ref('');
  const dateRange = ref({ from: '', to: '' });

  // Pagination
  const pagination = ref({
    sortBy: 'created_at',
    descending: true,
    page: 1,
    rowsPerPage: 7,
  });

  // Computed properties
  const dateRangeText = computed(() => {
    if (!dateRange.value.from && !dateRange.value.to) return '';
    return `${formatDate(dateRange.value.from, 'MMM D, YYYY')} - ${formatDate(dateRange.value.to, 'MMM D, YYYY')}`;
  });

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

    // Global search filter
    if (globalSearch.value) {
      const searchTerm = globalSearch.value.toLowerCase();
      filtered = filtered.filter((job) => {
        return (
          (job.office && job.office.toLowerCase().includes(searchTerm)) ||
          (job.Position && job.Position.toLowerCase().includes(searchTerm))
        );
      });
    }

    return filtered;
  });

  // Methods
  function setDateRange() {
    const currentYear = new Date().getFullYear();
    const fromDate = new Date(currentYear, 0, 1);
    const toDate = new Date(currentYear, 11, 31);
    dateRange.value = {
      from: formatDate(fromDate, 'YYYY/MM/DD'),
      to: formatDate(toDate, 'YYYY/MM/DD'),
    };
  }

  function onDateRangeChange(newRange) {
    dateRange.value = newRange;
  }

  function formatStatus(status) {
    if (!status) return 'not created';
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  }

  function getStatusColor(status) {
    if (!status) return 'grey';
    switch (status.toLowerCase()) {
      case 'created':
        return 'positive';
      case 'not created':
        return 'negative';
      default:
        return 'info';
    }
  }

  function formatRaters(raters) {
    return raters.map((r) => r.name).join(', ');
  }

  function hasCriteria(job) {
    return job.criteria_ratings && job.criteria_ratings.length > 0;
  }

  async function openCriteriaModal(job, mode) {
    console.log('Opening criteria modal:', { job, mode });

    selectedJob.value = job;
    modalMode.value = mode;

    if (mode === 'create') {
      selectedCriteria.value = null;
      criteriaStore.clearCurrentCriteria();
      console.log('Create mode: cleared criteria');
    } else if (mode === 'view' || mode === 'edit') {
      try {
        console.log('Fetching criteria for job:', job.id);
        await criteriaStore.viewCriteria(job.id);
        selectedCriteria.value = criteriaStore.currentCriteria;
        console.log('Fetched criteria:', selectedCriteria.value);
      } catch (error) {
        console.error('Error fetching criteria:', error);
        selectedCriteria.value = null;
        // If we can't fetch criteria for edit mode, switch to create mode
        if (mode === 'edit') {
          modalMode.value = 'create';
          console.log('Switched to create mode due to missing criteria');
        }
      }
    }

    showCriteriaModal.value = true;
    console.log('Modal opened with mode:', modalMode.value);
  }

  function onCriteriaSaved() {
    console.log('Criteria saved, refreshing job posts');
    loadJobPosts();
    showCriteriaModal.value = false;
    criteriaStore.clearCurrentCriteria();
    // Reset selections
    selectedJob.value = null;
    selectedCriteria.value = null;
  }

  function handleSwitchToEdit(job) {
    console.log('Switching to edit mode for job:', job);
    // Close current modal and reopen in edit mode
    showCriteriaModal.value = false;

    // Use nextTick to ensure modal is fully closed
    nextTick(() => {
      openCriteriaModal(job, 'edit');
    });
  }

  function handleSameAs() {
    // Implement your "Same As" functionality here
    console.log('Same as clicked for:', selectedRows.value);
  }

  async function loadJobPosts() {
    loading.value = true;
    try {
      await jobPostStore.job_post_list();
      jobs.value = jobPostStore.jobPosts;
      setDateRange();
    } catch (error) {
      console.error('Error loading job posts:', error);
    } finally {
      loading.value = false;
    }
  }

  // Lifecycle hooks
  onMounted(() => {
    loadJobPosts();
  });
</script>

<style scoped lang="scss">
  .text-h5 {
    font-size: 1.3rem;
    line-height: 1.7rem;
    margin-bottom: 0.5rem;
  }

  .job-posts-table {
    font-size: 0.9rem;
    table-layout: fixed;
    width: 100%;

    th {
      font-size: 0.95rem;
      font-weight: 600;
      padding: 8px 12px;
      background-color: #f5f5f5;
    }

    td {
      font-size: 0.9rem;
      padding: 8px 12px;
      vertical-align: middle;
    }

    .office-column {
      width: 25%;
      white-space: normal;
      word-break: break-word;
    }

    .position-column {
      width: 30%;
      white-space: normal;
      word-break: break-word;
    }

    .status-column {
      width: 15%;
      text-align: center;
    }

    .rater-column {
      width: 15%;
      text-align: center;
    }

    .action-column {
      width: 17%;
      text-align: center;
    }
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  @media (max-width: 1024px) {
    .job-posts-table {
      th,
      td {
        padding: 6px 8px;
      }
    }
  }
</style>
