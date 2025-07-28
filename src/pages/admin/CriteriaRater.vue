<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Criteria</b></h5>
    </div>
    <!-- Filters -->
    <div class="row justify-between items-center q-mb-md">
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
      :loading="jobPostStore.loading"
      table-style="min-width: 100%"
      selection="multiple"
      v-model:selected="selectedRows"
    >
      <template v-slot:body-cell-Office="props">
        <q-td :props="props" class="office-column">
          <div class="text-body2 text-weight-medium text-black">
            {{ props.row.Office }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-Position="props">
        <q-td :props="props" class="position-column">
          <div class="text-body2 text-weight-medium text-black">
            {{ props.row.Position }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-Status="props">
        <q-td :props="props" class="status-column">
          <span class="text-grey">N/A</span>
        </q-td>
      </template>
      <template v-slot:body-cell-Rater="props">
        <q-td :props="props" class="rater-column">
          <span class="text-grey">N/A</span>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="action-column q-gutter-x-xs">
          <q-btn
            v-if="!hasCriteria(props.row)"
            round
            flat
            color="green"
            class="bg-green-1"
            icon="notes"
            @click="openCriteriaModal(props.row)"
          >
            <q-tooltip>Create Criteria</q-tooltip>
          </q-btn>
          <q-btn
            v-else
            round
            flat
            color="blue"
            class="bg-blue-1"
            icon="visibility"
            @click="viewCriteria(props.row)"
          >
            <q-tooltip>View Criteria</q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">Jobpost is Empty</div>
      </template>
    </q-table>

    <!-- Criteria Modal -->
    <criteria-rater-modal
      v-model="showCriteriaModal"
      :job="selectedJob"
      :criteria="selectedCriteria"
      :is-view-mode="isViewMode"
      @saved="onCriteriaSaved"
    />
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { date } from 'quasar';
  import { useJobPostStore } from 'stores/jobPostStore';
  import CriteriaRaterModal from 'src/components/CriteriaModal.vue';

  const jobPostStore = useJobPostStore();
  const { formatDate } = date;

  const pagination = ref({
    sortBy: 'post_date',
    descending: true,
    page: 1,
    rowsPerPage: 7,
  });

  const globalSearch = ref('');
  const dateRange = ref({ from: '', to: '' });
  const dateRangeText = computed(() => {
    if (!dateRange.value.from && !dateRange.value.to) return '';
    return `${formatDate(dateRange.value.from, 'MMM D, YYYY')} - ${formatDate(dateRange.value.to, 'MMM D, YYYY')}`;
  });

  const setDateRange = () => {
    const currentYear = new Date().getFullYear();
    const fromDate = new Date(currentYear, 0, 1);
    const toDate = new Date(currentYear, 11, 31);
    dateRange.value = {
      from: formatDate(fromDate, 'YYYY/MM/DD'),
      to: formatDate(toDate, 'YYYY/MM/DD'),
    };
  };

  const onDateRangeChange = (newRange) => {
    dateRange.value = newRange;
  };

  const jobs = ref([]);
  const jobCriteriaMap = ref({});
  const filteredJobs = computed(() => {
    let filtered = jobs.value;
    if (dateRange.value.from && dateRange.value.to) {
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.post_date);
        const from = new Date(dateRange.value.from);
        const to = new Date(dateRange.value.to);
        to.setHours(23, 59, 59, 999);
        return jobDate >= from && jobDate <= to;
      });
    }
    if (globalSearch.value) {
      const searchTerm = globalSearch.value.toLowerCase();
      filtered = filtered.filter((job) => {
        return (
          (job.Office && job.Office.toLowerCase().includes(searchTerm)) ||
          (job.Position && job.Position.toLowerCase().includes(searchTerm))
        );
      });
    }
    return filtered;
  });

  const selectedRows = ref([]);
  const selectedJob = ref(null);
  const selectedCriteria = ref(null);
  const showCriteriaModal = ref(false);
  const isViewMode = ref(false);

  const columns = [
    {
      name: 'Office',
      label: 'Office',
      align: 'left',
      field: 'Office',
      sortable: true,
      style: 'width: 25%',
    },
    {
      name: 'Position',
      label: 'Position',
      align: 'left',
      field: 'Position',
      sortable: true,
      style: 'width: 35%',
    },
    {
      name: 'Status',
      label: 'Status',
      align: 'center',
      field: 'Status',
      sortable: false,
      style: 'width: 13%',
    },
    {
      name: 'Rater',
      label: 'Rater',
      align: 'center',
      field: 'Rater',
      sortable: false,
      style: 'width: 13%',
    },
    {
      name: 'action',
      align: 'center',
      label: 'Actions',
      field: 'action',
      sortable: false,
      style: 'width: 14%',
    },
  ];

  function hasCriteria(job) {
    // Use the job's id or JobBatchesRspId as the key
    const jobId = job.id || job.JobBatchesRspId;
    return jobCriteriaMap.value[jobId];
  }

  async function openCriteriaModal(job) {
    selectedJob.value = job;
    isViewMode.value = false;

    // Try to fetch existing criteria for this job
    try {
      selectedCriteria.value = await jobPostStore.fetchCriteriaByPositionAndItemNo(
        job.PositionID,
        job.ItemNo,
      );
    } catch {
      console.log('No existing criteria found, creating new');
      selectedCriteria.value = null;
    }

    showCriteriaModal.value = true;
  }

  function viewCriteria(job) {
    const jobId = job.id || job.JobBatchesRspId;
    const criteria = jobCriteriaMap.value[jobId];

    if (criteria) {
      selectedJob.value = job;
      selectedCriteria.value = convertApiCriteriaToModalFormat(criteria);
      isViewMode.value = true;
      showCriteriaModal.value = true;
    }
  }

  // Convert API criteria format to modal format
  function convertApiCriteriaToModalFormat(apiCriteria) {
    return {
      education: {
        weight: parseInt(apiCriteria.education?.Rate || 0),
        title: apiCriteria.education?.description?.[0] || '',
        description: apiCriteria.education?.description?.[1] || '',
        additionalFields: apiCriteria.education?.description?.slice(2) || [],
      },
      experience: {
        weight: parseInt(apiCriteria.experience?.Rate || 0),
        title: apiCriteria.experience?.description?.[0] || '',
        description: apiCriteria.experience?.description?.[1] || '',
        additionalFields: apiCriteria.experience?.description?.slice(2) || [],
      },
      training: {
        weight: parseInt(apiCriteria.training?.Rate || 0),
        title: apiCriteria.training?.description?.[0] || '',
        description: apiCriteria.training?.description?.[1] || '',
        additionalFields: apiCriteria.training?.description?.slice(2) || [],
      },
      performance: {
        weight: parseInt(apiCriteria.performance?.Rate || 0),
        title: apiCriteria.performance?.description?.[0] || '',
        description: apiCriteria.performance?.description?.[1] || '',
        additionalFields: apiCriteria.performance?.description?.slice(2) || [],
      },
      bei: {
        weight: parseInt(apiCriteria.behavioral?.Rate || apiCriteria.bei?.Rate || 0),
        title: apiCriteria.behavioral?.description?.[0] || apiCriteria.bei?.description?.[0] || '',
        description:
          apiCriteria.behavioral?.description?.[1] || apiCriteria.bei?.description?.[1] || '',
        additionalFields:
          apiCriteria.behavioral?.description?.slice(2) ||
          apiCriteria.bei?.description?.slice(2) ||
          [],
      },
    };
  }

  function onCriteriaSaved() {
    // Refresh the criteria data after saving
    loadCriteria();
    showCriteriaModal.value = false;
  }

  function handleSameAs() {
    console.log('Same as clicked for:', selectedRows.value);
  }

  async function loadCriteria() {
    try {
      const allCriteria = await jobPostStore.fetchAllCriteria();

      // Clear existing criteria map
      jobCriteriaMap.value = {};

      allCriteria.forEach((criteria) => {
        // Map criteria using job_batches_rsp_id
        if (Array.isArray(criteria.job_batches_rsp_id)) {
          criteria.job_batches_rsp_id.forEach((jobId) => {
            jobCriteriaMap.value[jobId] = criteria;
          });
        } else if (criteria.job_batches_rsp_id) {
          jobCriteriaMap.value[criteria.job_batches_rsp_id] = criteria;
        }

        // Also map by positionId-plantillaItemNo for backward compatibility
        if (criteria.positionId && criteria.plantillaItemNo) {
          const key = `${criteria.positionId}-${criteria.plantillaItemNo}`;
          jobCriteriaMap.value[key] = criteria;
        }
      });
    } catch (error) {
      console.error('Error loading criteria:', error);
    }
  }

  onMounted(async () => {
    await jobPostStore.fetchJobPosts();
    jobs.value = jobPostStore.jobPosts;
    setDateRange();
    await loadCriteria();
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
      width: 35%;
      white-space: normal;
      word-break: break-word;
    }

    .status-column,
    .rater-column {
      width: 13%;
      text-align: center;
    }

    .action-column {
      width: 14%;
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
