<template>
  <q-page>
    <div v-if="authStore.user.permissions.isDashboardStat == '1'" class="column no-gap">
      <!-- Welcome Message -->
      <q-img
        src="tgch.png"
        class="q-pa-lg column justify-center items-start"
        style="height: 120px; opacity: 1.5"
      >
        <div
          v-if="authStore.user"
          class="column justify-center"
          style="
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
          "
        >
          <div class="text-h4 text-weight-bolder q-ma-none">
            Welcome to RSP, {{ authStore.user.name }}!
          </div>
          <div class="text-body1 q-ma-none">
            Let's take a look at the updated performance of the city hall.
          </div>
        </div>
        <div v-else class="q-mb-sm q-gutter-xs">
          <h4 class="text-h4 text-weight-bolder q-my-none"><q-skeleton type="text" /></h4>
          <p class="text-body2"><q-skeleton type="text" /></p>
        </div>
      </q-img>

      <!-- STATISTICS HEADER -->
      <div class="row justify-start items-start q-my-md">
        <div class="q-pa-sm">
          <q-icon name="stacked_line_chart" size="50px" />
        </div>
        <div class="column">
          <h4 class="text-weight-bold q-ma-none">Statistics Overview</h4>
          <div class="row justify-start items-center q-gutter-x-sm">
            <q-chip dense class="q-my-sm row justify-start">
              Total Employees:
              <q-badge rounded dense class="text-bold q-ml-sm">
                {{ Number(vwActiveStore.countAll).toLocaleString() }}
              </q-badge>
            </q-chip>
            <q-chip dense class="q-my-sm row justify-start">
              Total Female Employees:
              <q-badge rounded dense color="pink" class="text-bold q-ml-sm">
                {{ Number(vwActiveStore.totalFemale).toLocaleString() }}
              </q-badge>
            </q-chip>
            <q-chip dense class="q-my-sm row justify-start">
              Total Male Employees:
              <q-badge rounded dense color="blue" class="text-bold q-ml-sm">
                {{ Number(vwActiveStore.totalMale).toLocaleString() }}
              </q-badge>
            </q-chip>
          </div>
        </div>
      </div>

      <!-- STATISTICS CARDS -->
      <StatusOverview class="q-mx-auto" />

      <!-- Jobpost HEADER -->
      <div class="row justify-start items-start q-my-md">
        <div class="q-pa-sm">
          <q-icon name="work_history" size="50px" />
        </div>
        <div class="column">
          <h4 class="text-weight-bold q-ma-none">Jobs Overview</h4>
          <q-chip dense class="q-my-sm row justify-start">
            Total Active Job Posts:
            <q-badge dense rounded color="green" class="text-bold q-ml-sm">
              {{ jobs.length }}
            </q-badge>
          </q-chip>
        </div>
      </div>
      <!-- MAIN CONTENT -->
      <div class="row justify-between">
        <q-card class="q-mx-auto" style="width: 70vw">
          <q-table
            class="applicants-table"
            :rows="jobs"
            :columns="columns"
            row-key="job"
            :loading="useJobPost.loading"
            :pagination="{ rowsPerPage: 5 }"
          >
            <template v-slot:body-cell-jobs="props">
              <q-td :props="props">
                <div class="text-body2" style="white-space: normal; width: 300px">
                  {{ props.row.Position }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn flat round dense color="blue" icon="visibility" @click="viewJob(props.row)">
                  <q-tooltip>View Job Details</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>

    <!-- Redesigned Minimalist Welcome with Background -->
    <div v-else class="welcome-container">
      <q-img src="tagum-city-hall.webp" class="welcome-bg" style="opacity: 0.8">
        <div class="absolute-full flex flex-center">
          <q-card
            class="welcome-card text-center q-pa-lg"
            style="
              background: rgba(255, 255, 255, 0.95);
              border-radius: 16px;
              max-width: 500px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            "
          >
            <q-avatar
              size="100px"
              color="primary"
              text-color="white"
              icon="person"
              class="q-mb-md"
            />
            <div v-if="authStore.user">
              <div class="text-h4 text-black text-weight-bold q-mb-sm">
                Welcome,
                <span class="text-primary">{{ authStore.user.name }}</span>
                !
              </div>
              <div class="text-subtitle1 text-grey-8 q-mb-md">
                to Recruitment, Selection & Placement Portal
              </div>
              <q-separator class="q-my-md" />
              <div class="text-body1 text-grey-7">
                Explore the portal to manage recruitment and access key features.
                <br />
                Navigate using the menu to get started.
              </div>
            </div>
            <div v-else>
              <q-skeleton type="text" class="q-mb-sm" style="height: 36px; width: 80%" />
              <q-skeleton type="text" class="q-mb-md" style="height: 24px; width: 60%" />
              <q-skeleton type="rect" style="height: 40px; width: 120px" />
            </div>
          </q-card>
        </div>
      </q-img>
    </div>
  </q-page>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useAuthStore } from 'src/stores/authStore';
  import StatusOverview from 'src/components/Dashboard/StatusOverview.vue';
  import { use_vwActiveStore } from 'src/stores/vwActiveStore';
  import { useJobPostStore } from 'src/stores/jobPostStore';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const useJobPost = useJobPostStore();
  const vwActiveStore = use_vwActiveStore();
  const authStore = useAuthStore();

  const jobs = ref([]);

  const columns = [
    { name: 'jobs', label: 'Position', align: 'left', field: 'Position', sortable: true },
    {
      name: 'applicants',
      label: 'No. of Applicants',
      align: 'center',
      field: 'applicants',
      sortable: true,
    },
    { name: 'pending', label: 'Pending', align: 'center', field: 'pending', sortable: true },
    { name: 'qualified', label: 'Qualified', align: 'center', field: 'qualified', sortable: true },
    {
      name: 'unqualified',
      label: 'Unqualified',
      align: 'center',
      field: 'unqualified',
      sortable: true,
    },
    {
      name: 'action',
      label: 'Action',
      align: 'center',
      field: 'action',
      sortable: false,
    },
  ];

  const viewJob = (row) => {
    router.push({
      name: 'JobPost View',
      params: { PositionID: row.PositionID, ItemNo: row.ItemNo },
    });
  };

  onMounted(async () => {
    await Promise.all([vwActiveStore.fetchCountAll(), vwActiveStore.getSexCount()]);
    await useJobPost.fetchJobPosts();
    jobs.value = useJobPost.jobPosts;
  });
</script>

<style scoped>
  .stat-card {
    border-radius: 12px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }

  .date-filter {
    max-width: 180px;
  }

  .table-container {
    flex: 1;
    min-width: 75%;
    padding: 5px 16px;
    border-radius: 8px;
  }

  .job-card-container {
    width: 23%;
    margin-left: 8px;
  }

  .applicants-table {
    width: 100%;
  }

  .welcome-container {
    position: relative;
    height: 85vh;
    overflow: hidden;
  }

  .welcome-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .welcome-card {
    transition: transform 0.3s ease;
  }

  .welcome-card:hover {
    transform: scale(1.02);
  }
</style>
