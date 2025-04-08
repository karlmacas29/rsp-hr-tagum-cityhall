<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Raters</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Raters" />
          <q-breadcrumbs-el class="text-bold" label="Raters List" />
        </q-breadcrumbs>
      </div>
    </div>

    <q-card>
      <q-card-section class="row justify-between items-center">
        <div class="text-h5 text-bold">Raters List</div>
        <q-btn color="primary" label="Add Rater" @click="showModal = true" icon="add" />
      </q-card-section>
      <q-separator />
      <!--  -->
      <q-card-section v-if="!useRater.loading">
        <q-table
          flat
          bordered
          :rows="filteredRaters"
          :columns="columns"
          row-key="id"
        >
          <!-- Header slots for searchable columns -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                <div v-if="col.name !== 'actions'">
                  <div>{{ col.label }}</div>
                  <q-input
                    v-if="col.search"
                    dense
                    outlined
                    v-model="filters[col.field]"
                    :placeholder="`Search ${col.label}`"
                    class="q-mt-xs"
                    style="min-width: 100px"
                  >
                    <template v-slot:append>
                      <q-icon 
                        v-if="filters[col.field]" 
                        name="clear" 
                        class="cursor-pointer" 
                        @click.stop="filters[col.field] = ''" 
                      />
                    </template>
                  </q-input>
                </div>
                <div v-else>
                  {{ col.label }}
                </div>
              </q-th>
            </q-tr>
          </template>

          <!-- Your existing body-cell templates -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status != 'Completed' ? 'green' : 'orange'">
                {{ props.row?.status || 'Completed' }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round dense icon="visibility" @click="viewRater(props.row)">
                <q-tooltip>View</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <!--  -->
      <q-card-section v-else>
        <q-markup-table flat bordered>
          <thead>
            <tr>
              <th class="text-left" style="width: 150px">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
              <th class="text-right">
                <q-skeleton animation="blink" type="text" />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="n in 5" :key="n">
              <td class="text-left">
                <q-skeleton animation="blink" type="text" width="85px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="50px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="35px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="65px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="25px" />
              </td>
              <td class="text-right">
                <q-skeleton animation="blink" type="text" width="85px" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <!-- Add Rater Modal -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="width: 400px">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6"><b>Add Rater</b></div>
          <q-btn icon="close" flat round dense @click="showModal = false" />
        </q-card-section>

        <q-card-section>
          <!-- Select Batch -->
          <q-select v-model="selectedBatch" :options="batches" option-value="id" option-label="display"
            label="Select Batch" outlined emit-value map-options @update:model-value="fetchPositions" />

          <q-separator class="q-mt-md q-mb-md" />

          <!-- Select Position -->
          <q-select v-model="selectedPosition" :options="positions" option-value="id" option-label="name"
            label="Select Position" outlined emit-value map-options :disable="!selectedBatch" />

          <q-separator class="q-mt-md q-mb-md" />

          <!-- Search and Select Rater -->
          <q-select v-model="selectedRater" :options="availableRaters" option-value="id" option-label="name"
            label="Search Rater" use-input outlined emit-value map-options @filter="filterRaters">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Add Rater" color="primary" @click="addRater"
            :disable="!selectedRater || !selectedBatch || !selectedPosition" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useRaterStore } from 'stores/raterStore'
import { onMounted, ref, computed } from 'vue'

const filters = ref({
  ID: '',
  Rater: '',
  batchDate: '',
  Position: '',
  status: ''
})

const filteredRaters = computed(() => {
  return raters.value.filter(row => {
    return Object.entries(filters.value).every(([key, value]) => {
      if (!value) return true // Skip if filter is empty
      const rowValue = row[key]?.toString().toLowerCase() || ''
      return rowValue.includes(value.toLowerCase())
    })
  })
})

const useRater = useRaterStore()
const showModal = ref(false)
const selectedBatch = ref(null)
const selectedPosition = ref(null)
const selectedRater = ref(null)

const batches = ref([
  { id: 1, display: 'Software Engineer Hiring (Posted: 2024-03-15)', date: '2024-03-15' },
  { id: 2, display: 'Marketing Team Expansion (Posted: 2024-02-28)', date: '2024-02-28' },
  { id: 3, display: 'Customer Support Hiring (Posted: 2024-01-20)', date: '2024-01-20' },
])

const positions = ref([])

const raters = ref([])

const availableRaters = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
  { id: 4, name: 'Bob Williams' },
  { id: 5, name: 'Charlie Brown' },
])

const columns = [
  { 
    name: 'ID', 
    label: 'ID', 
    field: 'ID', 
    align: 'left', 
    sortable: false,
    search: true 
  },
  { 
    name: 'Rater', 
    label: 'Raters Name', 
    field: 'Rater', 
    align: 'left', 
    sortable: false,
    search: true 
  },
  { 
    name: 'batchDate', 
    label: 'Assigned Batch', 
    field: 'batchDate', 
    align: 'left',
    search: true 
  },
  { 
    name: 'Position', 
    label: 'Position', 
    field: 'Position', 
    align: 'left', 
    sortable: false,
    search: true 
  },
  { 
    name: 'status', 
    label: 'Status', 
    field: 'status', 
    align: 'left',
    search: true 
  },
  { 
    name: 'actions', 
    label: 'Action', 
    align: 'center' 
  }
]

// Dummy Positions for Each Batch
const batchPositions = {
  1: [
    { id: 101, name: 'Frontend Developer' },
    { id: 102, name: 'Backend Developer' },
    { id: 103, name: 'Full Stack Developer' },
  ],
  2: [
    { id: 201, name: 'Social Media Manager' },
    { id: 202, name: 'SEO Specialist' },
  ],
  3: [
    { id: 301, name: 'Customer Support Representative' },
    { id: 302, name: 'Technical Support' },
  ],
}

// Load Positions When a Batch is Selected
const fetchPositions = (batchId) => {
  positions.value = batchPositions[batchId] || []
}

// Search & Filter Available Raters
const filterRaters = (val, update) => {
  if (val === '') {
    update(() => {
      availableRaters.value = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' },
        { id: 4, name: 'Bob Williams' },
        { id: 5, name: 'Charlie Brown' },
      ]
    })
    return
  }

  update(() => {
    availableRaters.value = availableRaters.value.filter((rater) =>
      rater.name.toLowerCase().includes(val.toLowerCase())
    )
  })
}

// Add Rater to the Table
const addRater = () => {
  const batchInfo = batches.value.find(b => b.id === selectedBatch.value) || {}
  const positionName = positions.value.find(p => p.id === selectedPosition.value)?.name || ''
  const raterName = availableRaters.value.find(r => r.id === selectedRater.value)?.name || ''

  const newRater = {
    id: raters.value.length + 1,
    name: raterName,
    batchDate: batchInfo.date,
    position: positionName,
    status: 'Pending',
  }

  raters.value.push(newRater)

  // Reset fields and close modal
  selectedBatch.value = null
  selectedPosition.value = null
  selectedRater.value = null
  showModal.value = false
}

// Handle View Button Click
const viewRater = (rater) => {
  console.log('Viewing rater:', rater)
}


onMounted(async () => {
  await useRater.fetchRaters()
  raters.value = useRater.raters
})
</script>
