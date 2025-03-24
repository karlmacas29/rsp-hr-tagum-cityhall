<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Job Lists</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Home" />
          <q-breadcrumbs-el class="text-bold" label="Job Lists" />
          <!-- <q-breadcrumbs-el label="Breadcrumbs" /> -->
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Date Range Picker -->
    <div class="row items-center q-gutter-sm">
      <q-input dense outlined readonly v-model="formattedDateRange" label="Selected Date Range" class="col-6">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="dateRange" range @update:model-value="updateFormattedDate" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <!-- Job Position Table -->
    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="position" :pagination="{ rowsPerPage: 10 }"
        class="my-sticky-header-table" flat bordered :grid="$q.screen.lt.md" style="width: 100%;">
        <!-- Grid mode slot for mobile/small screens -->
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" :key="props.row.position">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">{{ props.row.position }}</div>
                <div class="text-subtitle2">Posted: {{ props.row.postingDate }}</div>
              </q-card-section>

              <q-separator />

              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption class="text-bold">Applicants</q-item-label>
                    <q-item-label>{{ props.row.applicants }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Pending</q-item-label>
                    <q-item-label>{{ props.row.pending }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Qualified</q-item-label>
                    <q-item-label>{{ props.row.qualified }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Unqualified</q-item-label>
                    <q-item-label>{{ props.row.unqualified }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat round color="primary" icon="visibility" @click="viewDetails(props.row)">
                  <q-tooltip>View</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>

        <!-- Default slot for action column on desktop -->
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn round dense color="primary" icon="visibility" @click="viewDetails(props.row)" size="sm">
              <q-tooltip>View</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const dateRange = ref({ from: '', to: '' })
const formattedDateRange = ref('')

const updateFormattedDate = () => {
  const { from, to } = dateRange.value
  formattedDateRange.value = from && to ? `${from} - ${to}` : ''
}

const columns = [
  {
    name: 'officePosition',
    required: true,
    label: 'Office',
    align: 'left',
    field: row => row.officePosition,
    sortable: true
  },
  {
    name: 'position',
    label: 'Position',
    align: 'left',
    field: 'position',
    sortable: true
  },
  {
    name: 'postingDate',
    align: 'left',
    label: 'Posting Date',
    field: 'postingDate',
    sortable: true
  },
  {
    name: 'applicants',
    align: 'center',
    label: 'No. of Applicants',
    field: 'applicants',
    sortable: true
  },
  {
    name: 'pending',
    align: 'center',
    label: 'Pending',
    field: 'pending',
    sortable: true
  },
  {
    name: 'qualified',
    align: 'center',
    label: 'Qualified',
    field: 'qualified',
    sortable: true
  },
  {
    name: 'unqualified',
    align: 'center',
    label: 'Unqualified',
    field: 'unqualified',
    sortable: true
  },
  {
    name: 'action',
    align: 'center',
    label: 'Action',
    field: 'action',
    sortable: false
  }
]

const rows = [
  {
    officePosition: 'ICT Department',
    position: 'Computer Programmer II',
    postingDate: '01-20-2025',
    applicants: 10,
    pending: 0,
    qualified: 5,
    unqualified: 5,
    action: ''
  },
  {
    officePosition: 'ICT Department',
    position: 'Systems Analyst',
    postingDate: '02-26-2025',
    applicants: 20,
    pending: 0,
    qualified: 0,
    unqualified: 0,
    action: ''
  },
  {
    officePosition: 'ICT Department',
    position: 'Data Analyst',
    postingDate: '03-20-2025',
    applicants: 0,
    pending: 0,
    qualified: 0,
    unqualified: 0,
    action: ''
  }
]

const viewDetails = (row) => {
  console.log('View details for:', row.position)
  // Add your logic to view details
}


</script>

<style scoped lang="scss">
.my-sticky-header-table {

  .q-table__top {
    padding: 12px 20px;
  }

  thead tr:first-child th {
    background-color: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 16px;
    /* Larger font for headers */
    padding: 16px;
    /* More padding */
  }

  tbody td {
    padding: 14px 16px;
    /* More padding for cells */
    font-size: 15px;
    /* Larger font for content */
  }

  .q-table__grid-item {
    margin-bottom: 12px;
  }

  /* Make the card view larger too */
  .q-card {
    font-size: 16px;
  }
}

h5 {
  margin-bottom: 0;
}

/* Reduce spacing between input and text */
.q-gutter-md {
  margin-bottom: 4px;
}

/* Improved card spacing */
.job-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.job-card:hover {
  transform: scale(1.03);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
