<template>
  <q-page class="job-list-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-wrapper">
          <h4 class="text-bold page-title q-ma-none">Available Job Posts</h4>
        </div>
        <div class="search-filter-wrapper">
          <q-input
            outlined
            dense
            v-model="search"
            :placeholder="searchPlaceholder"
            class="search-input"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            rounded
            @click="openFilter"
            color="primary"
            icon="filter_list"
            :label="filterLabel"
            :size="buttonSize"
          />
        </div>
      </div>
    </div>

    <!-- Notice Card -->
    <q-card class="notice-card q-mt-md q-mx-auto">
      <q-card-section class="notice-header row justify-center items-center q-gutter-md">
        <div><q-icon name="info" :size="noticeIconSize" color="primary" /></div>
        <div class="notice-title text-bold text-center">Notice</div>
      </q-card-section>
      <q-card-section class="notice-content">
        <p class="text-center notice-text">
          Please be advised that applicants are limited to applying for a maximum of three (3) job
          positions.
        </p>
      </q-card-section>
    </q-card>

    <!-- Content Section -->
    <div class="content-section">
      <!-- Desktop/Tablet Table View -->
      <div class="table-wrapper gt-xs">
        <q-table
          :rows="jobs"
          :columns="columns"
          row-key="id"
          :loading="jobPostStore.loading"
          :filter="search"
          :pagination="{ rowsPerPage: 10, sortBy: 'post_date', descending: true }"
          flat
          bordered
          class="jobs-table"
        >
          <template v-slot:body-cell-Position="props">
            <q-td :props="props">
              <div class="position-cell">
                <span class="text-body1 text-weight-medium text-black line-clamp-2">
                  {{ props.row.Position }}
                </span>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-Office="props">
            <q-td :props="props">
              <div class="office-cell">
                <span class="text-body1 text-weight-medium text-black">
                  {{ props.row.Office }}
                </span>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-post_date="props">
            <q-td :props="props">
              <div class="date-cell">
                <q-chip class="text-body2 text-weight-medium bg-blue text-white" dense>
                  {{ formatDate(props.row.post_date, 'MMM D, YYYY') }}
                </q-chip>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-end_date="props">
            <q-td :props="props">
              <div class="date-cell">
                <q-chip class="text-body2 text-weight-medium bg-red-5 text-white" dense>
                  {{ formatDate(props.row.end_date, 'MMM D, YYYY') }}
                </q-chip>
              </div>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td align="center">
              <q-btn
                rounded
                color="primary"
                size="sm"
                label="Apply Now"
                @click="handleJobClick(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Mobile Card View -->
      <div class="cards-wrapper lt-sm q-pa-md">
        <q-card
          v-for="job in filteredJobs"
          :key="job.id"
          class="job-card-mobile q-mb-md"
          flat
          bordered
        >
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-xs line-clamp-2">
              {{ job.Position }}
            </div>
            <div class="text-body2 text-grey-7 q-mb-md">
              <q-icon name="business" size="xs" class="q-mr-xs" />
              {{ job.Office }}
            </div>

            <div class="dates-section q-mb-md">
              <div class="date-item q-mb-sm">
                <span class="text-caption text-grey-8">Posted:</span>
                <q-chip size="sm" class="bg-blue text-white q-pa-md" dense>
                  <q-icon name="event" size="xs" class="q-mr-xs" />
                  {{ formatDate(job.post_date, 'MMM D, YYYY') }}
                </q-chip>
              </div>
              <div class="date-item">
                <span class="text-caption text-grey-8">Deadline:</span>
                <q-chip size="sm" class="bg-red-5 text-white q-pa-md" dense>
                  <q-icon name="schedule" size="xs" class="q-mr-xs" />
                  {{ formatDate(job.end_date, 'MMM D, YYYY') }}
                </q-chip>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="center" class="q-pa-md q-pt-none">
            <q-btn
              color="primary"
              rounded
              unelevated
              class="full-width"
              size="md"
              label="Apply Now"
              icon-right="arrow_forward"
              @click="handleJobClick(job.id)"
            />
          </q-card-actions>
        </q-card>

        <!-- Loading State -->
        <div v-if="jobPostStore.loading" class="text-center q-pa-xl">
          <q-spinner color="primary" size="lg" />
          <div class="text-grey-7 q-mt-md">Loading jobs...</div>
        </div>

        <!-- Empty State -->
        <div v-if="!jobPostStore.loading && filteredJobs.length === 0" class="text-center q-pa-xl">
          <q-icon name="work_off" size="xl" color="grey-5" />
          <div class="text-grey-7 q-mt-md text-h6">No jobs found</div>
          <div class="text-grey-6 q-mt-sm">Try adjusting your search or filters</div>
        </div>

        <!-- Pagination for Mobile -->
        <div
          v-if="filteredJobs.length > 0 && !jobPostStore.loading"
          class="mobile-pagination q-mt-md"
        >
          <q-pagination
            v-model="mobilePage"
            :max="Math.ceil(filteredJobs.length / mobileRowsPerPage)"
            :max-pages="5"
            direction-links
            boundary-links
            color="primary"
            size="sm"
          />
        </div>
      </div>
    </div>

    <!-- Filter Dialog -->
    <q-dialog v-model="filterDialog">
      <q-card class="filter-dialog-card">
        <q-card-section class="row items-center">
          <div class="text-h6">Filters</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="filters.position"
            label="Position"
            outlined
            dense
            class="q-mb-md"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="work" />
            </template>
          </q-input>
          <q-input v-model="filters.office" label="Office" outlined dense class="q-mb-md" clearable>
            <template v-slot:prepend>
              <q-icon name="business" />
            </template>
          </q-input>
          <q-select
            v-model="filters.type"
            :options="['Full-time', 'Part-time', 'Contract', 'Internship']"
            label="Type"
            outlined
            dense
            class="q-mb-md"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-px-md q-pb-md">
          <q-btn flat label="Clear All" @click="clearFilters" />
          <q-btn unelevated color="primary" label="Apply Filters" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { date, useQuasar } from 'quasar';

  const { formatDate } = date;
  const router = useRouter();
  const jobPostStore = useJobPostStore();
  const $q = useQuasar();

  // Responsive computed properties
  const searchPlaceholder = computed(() => {
    return $q.screen.xs ? 'Search...' : 'Search jobs...';
  });

  const filterLabel = computed(() => {
    return $q.screen.xs ? '' : 'Filter';
  });

  const buttonSize = computed(() => {
    return $q.screen.xs ? 'sm' : 'md';
  });

  const noticeIconSize = computed(() => {
    if ($q.screen.xs) return 'md';
    if ($q.screen.sm) return 'lg';
    return 'xl';
  });

  // Define columns for the job table
  const columns = ref([
    { name: 'Position', label: 'Position', align: 'left', field: 'Position' },
    { name: 'Office', label: 'Office', align: 'left', field: 'Office' },
    {
      name: 'post_date',
      label: 'Posted Date',
      align: 'left',
      field: 'post_date',
      sortable: true,
      format: (val) => new Date(val).toLocaleDateString(),
    },
    {
      name: 'end_date',
      label: 'End Date',
      align: 'left',
      field: 'end_date',
      sortable: true,
      format: (val) => new Date(val).toLocaleDateString(),
    },
    { name: 'actions', label: 'Actions', align: 'center' },
  ]);

  const filterDialog = ref(false);
  const openFilter = () => {
    filterDialog.value = true;
  };

  const filters = reactive({
    position: '',
    office: '',
    type: '',
  });

  const clearFilters = () => {
    filters.position = '';
    filters.office = '';
    filters.type = '';
  };

  const search = ref('');
  const jobs = ref([]);
  const mobilePage = ref(1);
  const mobileRowsPerPage = ref(10);

  // Filtered jobs for mobile view
  const filteredJobs = computed(() => {
    let filtered = jobs.value;

    if (search.value) {
      const searchLower = search.value.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.Position.toLowerCase().includes(searchLower) ||
          job.Office.toLowerCase().includes(searchLower),
      );
    }

    return filtered.slice(
      (mobilePage.value - 1) * mobileRowsPerPage.value,
      mobilePage.value * mobileRowsPerPage.value,
    );
  });

  const handleJobClick = (id) => {
    router.push(`/jobList/details/${id}/`);
  };

  onMounted(async () => {
    await jobPostStore.fetchJobPosts();
    jobs.value = jobPostStore.jobPosts;
  });
</script>

<style scoped>
  .job-list-page {
    padding: 0;
  }

  .page-header {
    padding: 16px 48px;
    background: white;
    border-bottom: 1px solid #eee;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .search-filter-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
  }

  .search-input {
    min-width: 250px;
  }

  .notice-card {
    max-width: 700px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .notice-header {
    padding: 24px 16px 16px;
  }

  .notice-title {
    font-size: 2rem;
  }

  .notice-content {
    padding: 0 24px 24px;
  }

  .notice-text {
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }

  .content-section {
    padding: 16px 48px;
  }

  .table-wrapper {
    margin-top: 16px;
  }

  .position-cell {
    width: 180px;
    white-space: normal;
  }

  .office-cell {
    width: 180px;
    white-space: normal;
  }

  .date-cell {
    white-space: normal;
  }

  .job-card-mobile {
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .job-card-mobile:active {
    transform: scale(0.98);
  }

  .dates-section {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
  }

  .date-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .mobile-pagination {
    display: flex;
    justify-content: center;
  }

  .filter-dialog-card {
    min-width: 450px;
    max-width: 90vw;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Tablet breakpoint (600px - 1023px) */
  @media (max-width: 1023px) and (min-width: 600px) {
    .page-header {
      padding: 16px 24px;
    }

    .page-title {
      font-size: 1.5rem;
    }

    .content-section {
      padding: 16px 24px;
    }

    .notice-card {
      max-width: 90%;
    }

    .notice-title {
      font-size: 1.75rem;
    }

    .notice-text {
      font-size: 0.95rem;
    }

    .search-input {
      min-width: 200px;
    }

    .position-cell,
    .office-cell {
      width: 140px;
    }

    .filter-dialog-card {
      min-width: 400px;
    }
  }

  /* Mobile breakpoint (<600px) */
  @media (max-width: 599px) {
    .page-header {
      padding: 12px 16px;
    }

    .header-content {
      gap: 12px;
    }

    .title-wrapper {
      width: 100%;
    }

    .page-title {
      font-size: 1.25rem;
    }

    .search-filter-wrapper {
      width: 100%;
      gap: 8px;
    }

    .search-input {
      flex: 1;
      min-width: 0;
    }

    .content-section {
      padding: 0;
    }

    .notice-card {
      max-width: calc(100% - 32px);
      margin-left: 16px;
      margin-right: 16px;
    }

    .notice-header {
      padding: 16px 12px 12px;
      flex-direction: column;
      gap: 8px !important;
    }

    .notice-title {
      font-size: 1.5rem;
    }

    .notice-content {
      padding: 0 16px 16px;
    }

    .notice-text {
      font-size: 0.875rem;
    }

    .filter-dialog-card {
      min-width: 95vw;
    }
  }

  /* Extra small devices (<360px) */
  @media (max-width: 359px) {
    .page-header {
      padding: 8px 12px;
    }

    .page-title {
      font-size: 1.1rem;
    }

    .notice-card {
      max-width: calc(100% - 24px);
      margin-left: 12px;
      margin-right: 12px;
    }

    .notice-title {
      font-size: 1.25rem;
    }

    .notice-text {
      font-size: 0.8rem;
    }

    .job-card-mobile .text-h6 {
      font-size: 1rem;
    }
  }

  /* Large desktop optimization */
  @media (min-width: 1440px) {
    .page-header {
      padding: 24px 60px;
    }

    .content-section {
      padding: 24px 60px;
    }

    .page-title {
      font-size: 2rem;
    }

    .search-input {
      min-width: 300px;
    }
  }
</style>
