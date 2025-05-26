<template>
  <q-page class="grid justify-start items-start">
    <!-- Full-page background container -->
    <div class="darkened-bg-container row justify-center items-center">
      <!-- Centered content -->
      <div class="centered-content text-center row justify-center items-center q-gutter-sm">
        <!-- Logo (replace with your actual logo) -->
        <img src="logo.png" alt="Logo" class="logo" />
        <!-- Text content -->
        <div class="text-white grid justify-start items-start">
          <div class="row justify-start items-start">Welcome to</div>
          <div class="text-weight-bold text-h4">Recruitment, Selection and Placement</div>
          <div class="row justify-start items-start">
            City of Tagum Human Resource Management Office
          </div>
        </div>
      </div>
    </div>
    <!-- Main content of the page -->
    <div class="grid justify-center items-center q-py-md q-px-xl">
      <div class="row justify-between items-center">
        <div>
          <h4 class="text-bold">Latest Job Posts</h4>
        </div>
        <div>
          <q-btn rounded color="primary" @click="router.push({ name: 'Joblist' })">See All</q-btn>
        </div>
      </div>
      <!-- Job List Table -->
      <q-table
        :rows="jobs"
        :columns="columns"
        row-key="id"
        :loading="jobPostStore.loading"
        :pagination="{ rowsPerPage: 3, sortBy: 'post_date', descending: true }"
        hide-bottom
      >
        <template v-slot:body-cell-Position="props">
          <q-td :props="props">
            <div style="width: 180px; white-space: normal">
              <span class="text-body1 text-weight-medium text-black line-clamp-2">
                {{ props.row.Position }}
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-Office="props">
          <q-td :props="props">
            <div style="width: 180px; white-space: normal">
              <span class="text-body1 text-weight-medium text-black">
                {{ props.row.Office }}
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-post_date="props">
          <q-td :props="props">
            <div style="width: 180px; white-space: normal">
              <q-chip class="text-body1 text-weight-medium bg-blue text-white">
                {{ formatDate(props.row.post_date, 'MMM D, YYYY') }}
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
              @click="handleJobClick(props.row.PositionID, props.row.ItemNo)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { date } from 'quasar';

  const { formatDate } = date;
  const jobPostStore = useJobPostStore();
  const router = useRouter();

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
    { name: 'actions', label: 'Actions', align: 'center' },
  ]);

  // Generate mock job data
  const jobs = ref([]);

  const handleJobClick = (PositionID, ItemNo) => {
    router.push(`/jobList/details/${PositionID}/${ItemNo}`);
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
    filter: brightness(0.5); /* Adjust darkness level (0.5 = 50% brightness) */
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

  .job-card {
    height: 100%;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    cursor: pointer;
  }

  .job-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
