<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Raters</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Raters" />
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Card -->
    <q-card>
      <q-card-section class="row justify-between items-center">
        <div class="text-h5 text-bold">Raters List</div>
        <q-btn color="primary" label="Add Rater" @click="showModal = true" icon="add" />
      </q-card-section>
      <q-separator />

      <q-card-section>
        <!-- Single powerful search bar -->
        <div class="q-mb-md">
          <q-input
            outlined
            v-model="globalSearch"
            placeholder="Search all raters..."
            clearable
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="globalSearch !== ''"
                name="clear"
                class="cursor-pointer"
                @click="globalSearch = ''"
              />
            </template>
          </q-input>
        </div>

        <q-table
          flat
          bordered
          :rows="filteredRaters"
          :columns="columns"
          row-key="id"
          :loading="isSubmitting"
        >
          <!-- Position column with badges -->
          <template v-slot:body-cell-Position="props">
            <q-td :props="props">
              <div class="row q-gutter-xs">
                <q-badge
                  v-for="(pos, index) in props.row.Position.split(', ')"
                  :key="index"
                  color="primary"
                  text-color="white"
                  class="q-pa-xs"
                >
                  {{ pos }}
                </q-badge>
              </div>
            </q-td>
          </template>

          <!-- Actions column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round dense icon="visibility" @click="viewRater(props.row)">
                <q-tooltip>View</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="edit" @click="editRater(props.row)" class="q-ml-sm">
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Add Rater Modal (unchanged from your previous version) -->
    <q-dialog v-model="showModal" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6"><b>Add Rater</b></div>
          <q-btn icon="close" flat round dense @click="closeModal" />
        </q-card-section>

        <q-card-section>
          <q-banner v-if="showError" class="bg-red-2 text-red-10 q-mb-md">
            Please fill in all required fields.
          </q-banner>

          <!-- 1. Select Batch -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-medium">Select Batch</div>
            <q-select
              v-model="selectedBatch"
              :options="batches"
              option-value="id"
              option-label="display"
              label="Select a batch"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="fetchPositions"
            />
          </div>

          <q-separator class="q-mt-md q-mb-md" />

          <!-- 2. Select Positions -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-medium">Select Positions to Rate</div>
            <q-select
              v-model="selectedPositions"
              multiple
              :options="positionsWithAllOption"
              option-value="id"
              option-label="name"
              label="Select one or more positions"
              outlined
              dense
              use-chips
              emit-value
              map-options
              :disable="!selectedBatch"
              @update:model-value="handlePositionSelection"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-checkbox :model-value="isPositionSelected(scope.opt.id)" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <q-separator class="q-mt-md q-mb-md" />

          <!-- 3. Select Office -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-medium">Select Office</div>
            <q-select
              v-model="selectedOffice"
              :options="offices"
              option-value="id"
              option-label="name"
              label="Select office"
              outlined
              dense
              emit-value
              map-options
              :disable="!selectedBatch || selectedPositions.length === 0"
            />
          </div>

          <q-separator class="q-mt-md q-mb-md" />

          <!-- 4. Select Rater -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-medium">Select Rater</div>
            <q-select
              v-model="selectedRater"
              :options="filteredAvailableRaters"
              option-value="id"
              option-label="name"
              label="Search and select rater"
              use-input
              outlined
              dense
              emit-value
              map-options
              :disable="!selectedOffice"
              @filter="filterAvailableRaters"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-select>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Add Rater"
            color="primary"
            @click="addRater"
            :loading="isSubmitting"
            :disable="!selectedRater || !selectedBatch || selectedPositions.length === 0 || !selectedOffice"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

// Search
const globalSearch = ref('')

// Data
const raters = ref([
  {
    id: 1,
    Rater: 'John Doe',
    batchDate: '2024-03-15',
    Position: 'Frontend Developer, Backend Developer',
    Office: 'Main Office',
    pending: 3,
    completed: 2
  },
  {
    id: 2,
    Rater: 'Jane Smith',
    batchDate: '2024-02-28',
    Position: 'Social Media Manager',
    Office: 'Main Office',
    pending: 1,
    completed: 4
  },
  {
    id: 3,
    Rater: 'Alice Johnson',
    batchDate: '2024-01-20',
    Position: 'Customer Support Representative',
    Office: 'Regional Office - North',
    pending: 0,
    completed: 5
  }
])

// Filtered raters based on global search
const filteredRaters = computed(() => {
  if (!globalSearch.value) return raters.value

  const searchTerm = globalSearch.value.toLowerCase()
  return raters.value.filter(rater => {
    return (
      rater.id.toString().includes(searchTerm) ||
      rater.Rater.toLowerCase().includes(searchTerm) ||
      rater.batchDate.toLowerCase().includes(searchTerm) ||
      rater.Position.toLowerCase().includes(searchTerm) ||
      rater.Office.toLowerCase().includes(searchTerm)
    )
  })
})

// Modal state
const showModal = ref(false)
const showError = ref(false)
const isSubmitting = ref(false)

// Form selections
const selectedBatch = ref(null)
const selectedPositions = ref([])
const selectedOffice = ref(null)
const selectedRater = ref(null)

// Options data
const batches = ref([
  { id: 1, display: 'Software Engineer Hiring (Posted: 2024-03-15)', date: '2024-03-15' },
  { id: 2, display: 'Marketing Team Expansion (Posted: 2024-02-28)', date: '2024-02-28' },
  { id: 3, display: 'Customer Support Hiring (Posted: 2024-01-20)', date: '2024-01-20' },
])

const offices = ref([
  { id: 1, name: 'Main Office' },
  { id: 2, name: 'Regional Office - North' },
  { id: 3, name: 'Regional Office - South' },
])

const positions = ref([])
const availableRaters = ref([
  { id: 1, name: 'John Doe', officeId: 1 },
  { id: 2, name: 'Jane Smith', officeId: 1 },
  { id: 3, name: 'Alice Johnson', officeId: 2 },
  { id: 4, name: 'Bob Williams', officeId: 3 },
  { id: 5, name: 'Charlie Brown', officeId: 3 },
])

const filteredAvailableRaters = computed(() => {
  if (!selectedOffice.value) return availableRaters.value
  return availableRaters.value.filter(rater => rater.officeId === selectedOffice.value)
})

// Columns definition (simplified without per-column search)
const columns = [
  {
    name: 'ID',
    label: 'ID',
    field: 'id',
    align: 'left'
  },
  {
    name: 'Rater',
    label: 'Rater Name',
    field: 'Rater',
    align: 'left'
  },
  {
    name: 'batchDate',
    label: 'Assigned Batch',
    field: 'batchDate',
    align: 'left'
  },
  {
    name: 'Position',
    label: 'Position to Rate',
    field: 'Position',
    align: 'left'
  },
  {
    name: 'Office',
    label: 'Office',
    field: 'Office',
    align: 'left'
  },
  {
    name: 'pending',
    label: 'Pending',
    field: 'pending',
    align: 'center',
    sortable: false
  },
  {
    name: 'completed',
    label: 'Completed',
    field: 'completed',
    align: 'center',
    sortable: false
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center'
  }
]

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

const positionsWithAllOption = computed(() => {
  if (!positions.value.length) return []
  const allOption = { id: 'all', name: 'All Positions' }
  return [allOption, ...positions.value]
})

const isPositionSelected = (id) => {
  if (id === 'all') {
    return selectedPositions.value.includes('all') ||
           selectedPositions.value.length === positions.value.length
  }
  return selectedPositions.value.includes(id) ||
         selectedPositions.value.includes('all')
}

const handlePositionSelection = (selected) => {
  if (selected.includes('all') && !selectedPositions.value.includes('all')) {
    selectedPositions.value = ['all', ...positions.value.map(p => p.id)]
    return
  }

  if (!selected.includes('all') && selectedPositions.value.includes('all')) {
    selectedPositions.value = []
    return
  }

  if (selectedPositions.value.includes('all') && selected.length < selectedPositions.value.length) {
    selectedPositions.value = selected.filter(id => id !== 'all')
    return
  }

  if (!selected.includes('all') && selected.length === positions.value.length) {
    selectedPositions.value = ['all', ...positions.value.map(p => p.id)]
    return
  }

  selectedPositions.value = selected
}

const fetchPositions = (batchId) => {
  positions.value = batchPositions[batchId] || []
  selectedPositions.value = []
  selectedOffice.value = null
  selectedRater.value = null
}

const closeModal = () => {
  showModal.value = false
  selectedBatch.value = null
  selectedPositions.value = []
  selectedOffice.value = null
  selectedRater.value = null
  showError.value = false
}

const filterAvailableRaters = (val, update) => {
  if (val === '') {
    update(() => {
      availableRaters.value = [
        { id: 1, name: 'John Doe', officeId: 1 },
        { id: 2, name: 'Jane Smith', officeId: 1 },
        { id: 3, name: 'Alice Johnson', officeId: 2 },
        { id: 4, name: 'Bob Williams', officeId: 3 },
        { id: 5, name: 'Charlie Brown', officeId: 3 },
      ]
    })
    return
  }

  update(() => {
    const searchTerm = val.toLowerCase()
    availableRaters.value = [
      { id: 1, name: 'John Doe', officeId: 1 },
      { id: 2, name: 'Jane Smith', officeId: 1 },
      { id: 3, name: 'Alice Johnson', officeId: 2 },
      { id: 4, name: 'Bob Williams', officeId: 3 },
      { id: 5, name: 'Charlie Brown', officeId: 3 },
    ].filter(rater => rater.name.toLowerCase().includes(searchTerm))
  })
}

const addRater = () => {
  let positionsToAdd = [...selectedPositions.value]

  if (positionsToAdd.includes('all')) {
    positionsToAdd = positions.value.map(p => p.id)
  }

  if (!selectedBatch.value || positionsToAdd.length === 0 || !selectedRater.value || !selectedOffice.value) {
    showError.value = true
    return
  }

  showError.value = false
  isSubmitting.value = true

  const batchInfo = batches.value.find(b => b.id === selectedBatch.value) || {}
  const officeInfo = offices.value.find(o => o.id === selectedOffice.value) || {}
  const raterInfo = availableRaters.value.find(r => r.id === selectedRater.value) || {}

  // Combine all selected positions into a single string
  const positionNames = positionsToAdd
    .map(positionId => positions.value.find(p => p.id === positionId)?.name || '')
    .filter(name => name)
    .join(', ')

  const newRater = {
    id: raters.value.length + 1,
    Rater: raterInfo.name,
    batchDate: batchInfo.date,
    Position: positionNames,
    Office: officeInfo.name,
    pending: Math.floor(Math.random() * 5),
    completed: Math.floor(Math.random() * 5)
  }

  raters.value.push(newRater)
  closeModal()
  isSubmitting.value = false
}

const viewRater = (rater) => {
  console.log('Viewing rater:', rater)
}

const editRater = (rater) => {
  console.log('Editing rater:', rater)
}
</script>

<style scoped>
.q-table {
  width: 100%;
}
</style>
