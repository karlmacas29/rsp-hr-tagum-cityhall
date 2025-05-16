<template>
  <!-- Job Details View -->
  <div class="q-pa-md">
    <q-card class="q-mb-lg" flat bordered style="height: 100%; min-height: 300px">
      <q-inner-loading :showing="jobPostStore.loading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>

      <q-card-section v-if="!jobPostStore.loading">
        <q-card-section>
          <div class="grid items-center">
            <q-btn icon="arrow_back" round class="q-mr-sm" color="primary" @click="goBack" />
            <div class="text-h3">{{ selectedJob?.Position || 'Test' }}</div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-h6 q-mb-sm">
                <q-icon name="business" class="q-mr-sm" />
                <span class="text-weight-bold">Office:</span>
                {{ selectedJob?.Office || 'No Office' }}
              </div>
              <div class="text-h6 q-mb-sm">
                <q-icon name="business" class="q-mr-sm" />
                <span class="text-weight-bold">Division:</span>
                {{ selectedJob?.Division || 'No Division' }}
              </div>
              <div class="text-h6 q-mb-sm">
                <q-icon name="business" class="q-mr-sm" />
                <span class="text-weight-bold">Section:</span>
                {{ selectedJob?.Section || 'No Section' }}
              </div>
              <div class="text-h6 q-mb-sm">
                <q-icon name="business" class="q-mr-sm" />
                <span class="text-weight-bold">Unit:</span>
                {{ selectedJob?.Unit || 'No Unit' }}
              </div>
              <div class="text-h6 q-mb-sm">
                <q-icon name="work" class="q-mr-sm" />
                <span class="text-weight-bold">Position:</span>
                {{ selectedJob?.Position || 'No Position' }}
              </div>
              <div class="text-h6 q-mb-sm">
                <q-icon name="event" class="q-mr-sm" />
                <span class="text-weight-bold">Posting Date:</span>
                {{ formatDate(selectedJob?.post_date, 'MMM D, YYYY') || 'Test' }}
              </div>
              <div class="text-h6 q-mb-sm">
                <q-icon name="event" class="q-mr-sm" />
                <span class="text-weight-bold">End Date:</span>
                {{ formatDate(selectedJob?.end_date, 'MMM D, YYYY') || 'Test' }}
              </div>
              <q-separator></q-separator>
              <div class="text-h6 q-mb-sm q-gutter-x-md">
                <q-badge>PageNo {{ selectedJob?.PageNo || '0' }}</q-badge>
                <q-badge>ItemNo {{ selectedJob?.ItemNo || '0' }}</q-badge>
                <q-badge>Salary Grade {{ selectedJob?.SalaryGrade || '0' }}</q-badge>
              </div>
            </div>
          </div>

          <div class="text-h4 q-mb-md">Qualification Standard/Requirements</div>
          <div class="q-pl-md">
            <div class="text-h6 q-mb-sm text-weight-bold">BASIC QUALIFICATIONS:</div>
            <ol v-if="selectedCriteria" class="q-pl-md text-body1">
              <li>Education - {{ selectedCriteria.Education }}</li>
              <li>Experience - {{ selectedCriteria.Experience }}</li>
              <li>Training - {{ selectedCriteria.Training }}</li>
              <li>Eligibility - {{ selectedCriteria.Eligibility }}</li>
            </ol>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>

    <!-- Applicants Section -->
    <q-card flat bordered style="height: 100%; min-height: 300px">
      <q-inner-loading :showing="jobPostStore.loading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-card-section v-if="!jobPostStore.loading">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h4">Applicants for {{ selectedJob?.Position || 'Test' }}</div>
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="[]"
            :columns="applicantColumns"
            row-key="id"
            flat
            bordered
            hide-pagination
            class="applicants-table"
          >
            <!-- <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="getStatusColor(props.row.status)" class="status-badge">
                  {{ props.row.isSubmitted ? `${props.row.status} ` : props.row.status }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  flat
                  color="primary"
                  :label="props.row.isSubmitted ? 'Edit Evaluation' : 'Evaluate'"
                  @click="openQualificationModal(props.row)"
                  size="md"
                />
              </q-td>
            </template> -->
          </q-table>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { onMounted, ref } from 'vue';
  import { date } from 'quasar';

  const router = useRouter();
  const route = useRoute();
  const jobPostStore = useJobPostStore();
  const jobId = route.params.id;
  const selectedJob = ref([]);
  const { formatDate } = date;
  const selectedCriteria = ref([]);

  const goBack = () => {
    router.push('/job-post');
  };

  const applicantColumns = [
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
    {
      name: 'appliedDate',
      label: 'Applied Date',
      field: 'appliedDate',
      align: 'left',
      // format: (val) => formatDate(val, 'MMM D, YYYY'),
    },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'center',
    },
    {
      name: 'action',
      label: 'Action',
      field: 'action',
      align: 'center',
      sortable: false,
    },
  ];
  onMounted(async () => {
    await jobPostStore.fetchJobPostById(jobId).then((job) => {
      selectedJob.value = job;
    });
    await jobPostStore.fetchCriteriaById(jobId).then((criteria) => {
      selectedCriteria.value = criteria;
    });
  });
</script>
