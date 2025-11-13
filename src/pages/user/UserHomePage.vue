<template>
  <q-page class="grid justify-start items-start">
    <!-- Full-page background container -->
    <div class="darkened-bg-container row justify-center items-center">
      <!-- Centered content -->
      <div class="centered-content text-center row justify-center items-center q-gutter-sm">
        <!-- Logo (replace with your actual logo) -->
        <img src="logo.png" alt="Logo" class="logo" />
        <!-- Text content -->
        <div class="text-white grid justify-start items-start hero-text">
          <div class="row justify-start items-start welcome-text">Welcome to</div>
          <div class="text-weight-bold main-title">Recruitment, Selection and Placement</div>
          <div class="row justify-start items-start subtitle-text">
            City of Tagum Human Resource Management Office
          </div>
        </div>
      </div>
    </div>
    <!-- Main content of the page -->
    <div class="content-wrapper q-py-md q-px-xl">
      <div class="header-section row justify-between items-center q-mb-md">
        <div class="section-title-wrapper">
          <h4 class="text-bold section-title q-ma-none">Latest Job Posts</h4>
        </div>
        <div>
          <q-btn
            rounded
            color="primary"
            @click="router.push({ name: 'Joblist' })"
            :size="buttonSize"
            :label="seeAllLabel"
          />
        </div>
      </div>
      <!-- Job List Table - Desktop & Tablet -->
      <q-table
        class="job-table gt-xs"
        :rows="jobs"
        :columns="columns"
        row-key="id"
        :loading="jobPostStore.loading"
        :pagination="{ rowsPerPage: 3, sortBy: 'post_date', descending: true }"
        hide-bottom
        flat
        bordered
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
              color="primary"
              rounded
              size="sm"
              label="Apply Now"
              @click="handleJobClick(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>

      <!-- Job List Cards - Mobile -->
      <div class="job-cards-mobile lt-sm">
        <q-card
          v-for="job in jobs.slice(0, 3)"
          :key="job.id"
          class="job-card-mobile q-mb-md"
          flat
          bordered
        >
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-sm line-clamp-2">
              {{ job.Position }}
            </div>
            <div class="text-body2 text-grey-7 q-mb-md">
              {{ job.Office }}
            </div>

            <div class="row q-gutter-sm q-mb-md">
              <q-chip size="sm" class="bg-blue text-white" dense>
                <q-icon name="event" size="xs" class="q-mr-xs" />
                {{ formatDate(job.post_date, 'MMM D, YYYY') }}
              </q-chip>
              <q-chip size="sm" class="bg-red-5 text-white" dense>
                <q-icon name="schedule" size="xs" class="q-mr-xs" />
                {{ formatDate(job.end_date, 'MMM D, YYYY') }}
              </q-chip>
            </div>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              color="primary"
              rounded
              unelevated
              class="full-width"
              label="Apply Now"
              @click="handleJobClick(job.id)"
            />
          </q-card-actions>
        </q-card>

        <div class="text-center q-mt-md" v-if="jobs.length === 0 && !jobPostStore.loading">
          <q-icon name="work_off" size="xl" color="grey-5" />
          <div class="text-grey-7 q-mt-sm">No jobs available at the moment</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="jobPostStore.loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="lg" />
        <div class="text-grey-7 q-mt-md">Loading jobs...</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { date, useQuasar } from 'quasar';

  const { formatDate } = date;
  const jobPostStore = useJobPostStore();
  const router = useRouter();
  const $q = useQuasar();

  // Responsive button size
  const buttonSize = computed(() => {
    if ($q.screen.xs) return 'sm';
    return 'md';
  });

  // Responsive "See All" button label
  const seeAllLabel = computed(() => {
    if ($q.screen.xs) return 'See All';
    return 'See All Jobs';
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

  // Generate mock job data
  const jobs = ref([]);

  const handleJobClick = (id) => {
    router.push(`/jobList/details/${id}`);
  };

  onMounted(async () => {
    await jobPostStore.fetchJobPosts();
    jobs.value = jobPostStore.jobPosts;
  });
</script>

<style scoped>
  .darkened-bg-container {
    position: relative;
    width: 100%;
    height: 480px;
  }

  .darkened-bg-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('tagum-city-hall.webp');
    background-size: cover;
    background-position: center;
    filter: brightness(0.5);
    z-index: -1;
  }

  .centered-content {
    padding: 2rem;
    border-radius: 10px;
    max-width: 80%;
  }

  .logo {
    max-width: 150px;
    height: auto;
  }

  .hero-text {
    width: 100%;
  }

  .welcome-text {
    font-size: 1.2rem;
  }

  .main-title {
    font-size: 2.5rem;
    line-height: 1.2;
  }

  .subtitle-text {
    font-size: 1.1rem;
  }

  .content-wrapper {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }

  .header-section {
    width: 100%;
    flex-wrap: wrap;
    gap: 16px;
  }

  .section-title {
    font-size: 1.75rem;
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

  .line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Tablet breakpoint (600px - 1023px) */
  @media (max-width: 1023px) and (min-width: 600px) {
    .darkened-bg-container {
      height: 400px;
    }

    .centered-content {
      max-width: 90%;
      padding: 1.5rem;
    }

    .logo {
      max-width: 120px;
    }

    .main-title {
      font-size: 2rem;
    }

    .welcome-text {
      font-size: 1rem;
    }

    .subtitle-text {
      font-size: 1rem;
    }

    .content-wrapper {
      padding: 16px 24px !important;
    }

    .section-title {
      font-size: 1.5rem;
    }

    .position-cell,
    .office-cell {
      width: 140px;
    }
  }

  /* Mobile breakpoint (<600px) */
  @media (max-width: 599px) {
    .darkened-bg-container {
      height: 350px;
    }

    .centered-content {
      max-width: 95%;
      padding: 1rem;
      flex-direction: column;
    }

    .logo {
      max-width: 80px;
    }

    .main-title {
      font-size: 1.5rem;
    }

    .welcome-text {
      font-size: 0.9rem;
    }

    .subtitle-text {
      font-size: 0.85rem;
    }

    .content-wrapper {
      padding: 12px 16px !important;
    }

    .section-title {
      font-size: 1.25rem;
    }

    .header-section {
      gap: 12px;
    }

    .section-title-wrapper {
      flex: 1;
    }
  }

  /* Extra small devices (<360px) */
  @media (max-width: 359px) {
    .darkened-bg-container {
      height: 300px;
    }

    .centered-content {
      padding: 0.75rem;
    }

    .logo {
      max-width: 60px;
    }

    .main-title {
      font-size: 1.2rem;
    }

    .welcome-text {
      font-size: 0.8rem;
    }

    .subtitle-text {
      font-size: 0.75rem;
    }

    .content-wrapper {
      padding: 8px 12px !important;
    }

    .section-title {
      font-size: 1.1rem;
    }
  }

  /* Large desktop optimization */
  @media (min-width: 1440px) {
    .darkened-bg-container {
      height: 550px;
    }

    .main-title {
      font-size: 3rem;
    }

    .logo {
      max-width: 180px;
    }
  }
</style>
