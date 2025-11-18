<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 700px; max-width: 90vw">
      <q-card-section class="q-pa-md">
        <div class="row justify-between items-center">
          <div>
            <div class="text-h6 text-weight-bold">
              {{ details?.data[0]?.n_personal_info?.firstname }}
              {{ details?.data[0]?.n_personal_info?.lastname }}
            </div>
            <div class="text-caption text-grey-7">
              {{ formatDate(details?.data[0]?.n_personal_info?.date_of_birth) }}
            </div>
          </div>
          <q-btn icon="close" flat round dense @click="closeDialog" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="applicantStore.loading" class="q-pa-lg">
        <div class="row justify-center">
          <q-spinner color="primary" size="3em" />
        </div>
      </q-card-section>

      <!-- Applications Table -->
      <q-card-section v-else-if="details" class="q-pa-md">
        <q-table
          :rows="details.data"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          class="applications-table"
          hide-bottom
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-position="props">
            <q-td :props="props">
              <div class="text-body2 text-weight-medium">{{ props.row.job_post?.Position }}</div>
              <div class="text-caption text-grey-7">{{ props.row.job_post?.Office }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-salary="props">
            <q-td :props="props" class="text-center">
              <div class="text-body2">{{ props.row.job_post?.SalaryGrade }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props" class="text-center">
              <q-badge rounded :color="getStatusColor(props.row.status)" class="q-px-md q-py-xs">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey">No applications found</div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { useApplicantStore } from 'stores/applicantStore';
  import { date } from 'quasar';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    applicant: {
      type: Object,
      default: () => null,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const applicantStore = useApplicantStore();
  const showDialog = ref(props.modelValue);
  const details = ref(null);

  const columns = [
    {
      name: 'position',
      label: 'Position',
      align: 'left',
      field: 'position',
      sortable: true,
      style: 'width: 50%',
    },
    {
      name: 'salary',
      label: 'SG',
      align: 'center',
      field: 'salary',
      sortable: true,
      style: 'width: 15%',
    },
    {
      name: 'status',
      label: 'Status',
      align: 'center',
      field: 'status',
      sortable: true,
      style: 'width: 35%',
    },
  ];

  watch(
    () => props.modelValue,
    async (newVal) => {
      showDialog.value = newVal;
      if (newVal && props.applicant) {
        await fetchDetails();
      }
    },
  );

  watch(showDialog, (newVal) => {
    emit('update:modelValue', newVal);
  });

  const fetchDetails = async () => {
    if (!props.applicant) return;

    try {
      const response = await applicantStore.fetchApplicantDetail(
        props.applicant.firstname,
        props.applicant.lastname,
        props.applicant.date_of_birth,
      );
      details.value = response;
    } catch (error) {
      console.error('Error fetching applicant details:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return date.formatDate(dateString, 'MMM DD, YYYY');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'qualified':
        return 'green';
      case 'unqualified':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'grey';
    }
  };

  const closeDialog = () => {
    showDialog.value = false;
  };
</script>

<style scoped lang="scss">
  .applications-table {
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
  }

  .q-table tbody tr td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
</style>
