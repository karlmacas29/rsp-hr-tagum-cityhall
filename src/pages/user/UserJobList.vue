<template>
  <q-page class="q-px-xl q-py-md">
    <div class="row justify-between items-center">
      <div>
        <h4 class="text-bold">Available Job Posts</h4>
      </div>
      <div>
        <div class="row items-center q-gutter-md">
          <q-input outlined dense v-model="search" placeholder="Search jobs..." class="col-grow">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn rounded @click="openFilter" color="primary" icon="filter_list" label="Filter" />
        </div>
      </div>
    </div>
    <q-card class="q-mt-md q-mx-auto" style="width: 700px">
      <q-card-section class="row justify-center items-center q-gutter-md">
        <div><q-icon name="info" size="xl" /></div>
        <div class="text-h3 text-bold text-center">Notice</div>
      </q-card-section>
      <q-card-section>
        <p class="text-center text-body">
          Please be advised that applicants are limited to applying for a maximum of three (3) job
          positions.
        </p>
      </q-card-section>
    </q-card>

    <div>
      <div class="grid justify-center items-center q-py-md q-px-xl">
        <!-- Job List Table -->
        <q-table
          :rows="jobs"
          :columns="columns"
          row-key="id"
          :loading="jobPostStore.loading"
          :filter="search"
          :pagination="{ rowsPerPage: 10, sortBy: 'post_date', descending: true }"
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
                rounded
                color="primary"
                size="sm"
                label="Apply Now"
                @click="handleJobClick(props.row.PositionID, props.row.ItemNo)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="filterDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6">Filters</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input v-model="filters.position" label="Position" outlined dense class="q-mb-md" />
          <q-input v-model="filters.office" label="Office" outlined dense class="q-mb-md" />
          <q-select
            v-model="filters.type"
            :options="['Full-time', 'Part-time', 'Contract', 'Internship']"
            label="Type"
            outlined
            dense
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Clear All" />
          <q-btn flat label="Done" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { date } from 'quasar';

  const { formatDate } = date;
  const router = useRouter();
  const jobPostStore = useJobPostStore();

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

  const filterDialog = ref(false);
  const openFilter = () => {
    filterDialog.value = true;
  };

  const filters = reactive({
    position: '',
    office: '',
    type: '',
  });

  const search = ref('');
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
