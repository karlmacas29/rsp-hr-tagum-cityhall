<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Applicants</b></h5>
    </div>

    <!-- Applicants List -->
    <div class="q-pa-sm">
      <!-- Search Input -->
      <div class="row justify-end items-center q-mb-md">
        <q-input
          v-model="globalSearch"
          outlined
          dense
          placeholder="Search applicants..."
          class="col-auto"
          style="max-width: 300px"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>

      <q-table
        :rows="filteredApplicants"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        class="applicants-table q-mt-md"
        :loading="applicantStore.loading"
        table-style="min-width: 100%"
      >
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="name-column">
            <div class="text-body2 text-weight-medium text-black">
              {{ props.row.firstname }} {{ props.row.lastname }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-jobpost="props">
          <q-td :props="props" class="count-column">
            <div class="text-center text-body2">{{ props.row.jobpost || 0 }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props" class="action-column">
            <q-btn
              round
              flat
              color="blue"
              class="bg-blue-1"
              icon="visibility"
              @click="viewApplicant(props.row)"
            >
              <q-tooltip>View Applicant</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-md text-grey">No Applicants Found</div>
        </template>
      </q-table>
    </div>

    <!-- Applicant Detail Dialog -->
    <ApplicantDetailDialog v-model="showDetailDialog" :applicant="selectedApplicant" />
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { useApplicantStore } from 'stores/applicantStore';
  import ApplicantDetailDialog from 'components/ApplicantDetail.vue';

  const $q = useQuasar();
  const applicantStore = useApplicantStore();

  // Global Search
  const globalSearch = ref('');

  // Dialog state
  const showDetailDialog = ref(false);
  const selectedApplicant = ref(null);

  const pagination = ref({
    sortBy: 'name',
    descending: false,
    page: 1,
    rowsPerPage: 10,
  });

  const columns = [
    {
      name: 'name',
      label: 'Name',
      align: 'left',
      field: 'name',
      sortable: true,
      style: 'width: 60%',
    },
    {
      name: 'jobpost',
      align: 'center',
      label: 'No. of Applied Position',
      field: 'jobpost',
      sortable: true,
      style: 'width: 25%',
    },
    {
      name: 'action',
      align: 'center',
      label: 'Action',
      field: 'action',
      sortable: false,
      style: 'width: 15%',
    },
  ];

  const filteredApplicants = computed(() => {
    if (!globalSearch.value) {
      return applicantStore.applicants;
    }

    const searchTerm = globalSearch.value.toLowerCase();
    return applicantStore.applicants.filter((applicant) => {
      const fullName = `${applicant.firstname} ${applicant.lastname}`.toLowerCase();
      return (
        fullName.includes(searchTerm) ||
        (applicant.positions !== undefined && applicant.positions.toString().includes(searchTerm))
      );
    });
  });

  const viewApplicant = (applicant) => {
    selectedApplicant.value = applicant;
    showDetailDialog.value = true;
  };

  onMounted(async () => {
    try {
      await applicantStore.fetchApplicants();
    } catch (error) {
      console.error('Error loading applicants:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to load applicants',
        position: 'top',
      });
    }
  });
</script>

<style scoped lang="scss">
  /* Typography improvements */
  .text-h5 {
    font-size: 1.3rem;
    line-height: 1.7rem;
    margin-bottom: 0.5rem;
  }

  /* Table improvements */
  .applicants-table {
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

    .name-column {
      width: 60%;
      white-space: normal;
      word-break: break-word;
    }

    .count-column {
      width: 25%;
      text-align: center;
    }

    .action-column {
      width: 15%;
      text-align: center;
    }
  }

  .q-mb-md {
    margin-bottom: 16px;
  }

  .q-pa-md {
    padding: 12px;
  }

  .q-pa-sm {
    padding: 10px;
  }

  .q-table tbody tr td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .bg-blue-1 {
    background-color: rgba(33, 150, 243, 0.1);
  }

  @media (max-width: 1024px) {
    .applicants-table {
      th,
      td {
        padding: 6px 8px;
      }
    }
  }
</style>
