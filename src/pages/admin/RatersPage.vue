<template>
  <q-page class="q-pa-md">
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

    <!-- Add Rater Modal -->
    <q-dialog v-model="showModal" persistent>
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
                    <q-checkbox
                      :model-value="isPositionSelected(scope.opt.id)"
                      @update:model-value="(val) => togglePosition(scope.opt.id, val)"
                    />
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

const filteredAvailableRaters = ref([])

// Columns definition
const columns = [
  { name: 'ID', label: 'ID', field: 'id', align: 'left' },
  { name: 'Rater', label: 'Rater Name', field: 'Rater', align: 'left' },
  { name: 'batchDate', label: 'Assigned Batch', field: 'batchDate', align: 'left' },
  { name: 'Position', label: 'Position to Rate', field: 'Position', align: 'left' },
  { name: 'Office', label: 'Office', field: 'Office', align: 'left' },
  { name: 'pending', label: 'Pending', field: 'pending', align: 'center', sortable: false },
  { name: 'completed', label: 'Completed', field: 'completed', align: 'center', sortable: false },
  { name: 'actions', label: 'Actions', align: 'center' }
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

const fetchPositions = (batchId) => {
  positions.value = batchPositions[batchId] || []
  selectedPositions.value = []
  selectedOffice.value = null
  selectedRater.value = null
}

const positionsWithAllOption = computed(() => {
  if (!positions.value.length) return []
  const allOption = { id: 'all', name: 'All Positions' }
  return [allOption, ...positions.value]
})

const isPositionSelected = (id) => {
  if (id === 'all') {
    // Check if all positions are selected (excluding the 'all' option)
    return positions.value.length > 0 &&
           positions.value.every(p => selectedPositions.value.includes(p.id))
  }
  return selectedPositions.value.includes(id)
}

const togglePosition = (id, checked) => {
  if (id === 'all') {
    // Toggle all positions
    if (checked) {
      // Select all positions plus the 'all' option
      selectedPositions.value = ['all', ...positions.value.map(p => p.id)]
    } else {
      // Deselect all positions
      selectedPositions.value = []
    }
  } else {
    // Handle regular position toggle
    let newSelection = [...selectedPositions.value]
    const allIndex = newSelection.indexOf('all')

    if (checked) {
      // Add the position if not already selected
      if (!newSelection.includes(id)) {
        newSelection.push(id)
      }

      // Check if all positions are now selected
      const allSelected = positions.value.every(p => newSelection.includes(p.id))
      if (allSelected && allIndex === -1) {
        newSelection.push('all')
      }
    } else {
      // Remove the position
      newSelection = newSelection.filter(item => item !== id)

      // Remove 'all' option if it was selected
      if (allIndex !== -1) {
        newSelection.splice(allIndex, 1)
      }
    }

    selectedPositions.value = newSelection
  }
}

const handlePositionSelection = (newSelection) => {
  // This handles the case when selections are made via the dropdown rather than checkboxes
  const allOptionId = 'all'
  const regularIds = positions.value.map(p => p.id)

  if (newSelection.includes(allOptionId)) {
    // If "All" is selected, select all positions (plus "all" id)
    selectedPositions.value = [allOptionId, ...regularIds]
  } else {
    // Otherwise, only select the regular selections
    selectedPositions.value = newSelection.filter(id => id !== allOptionId)

    // Check if all positions are selected (without the 'all' option)
    const allSelected = regularIds.length > 0 &&
                       regularIds.every(id => newSelection.includes(id))

    if (allSelected) {
      selectedPositions.value = [allOptionId, ...regularIds]
    }
  }
}

const filterAvailableRaters = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    filteredAvailableRaters.value = availableRaters.value.filter(rater => {
      return rater.name.toLowerCase().includes(needle) && rater.officeId === selectedOffice.value
    })
  })
}

const closeModal = () => {
  showModal.value = false
  showError.value = false
  selectedBatch.value = null
  selectedPositions.value = []
  selectedOffice.value = null
  selectedRater.value = null
}

const viewRater = (rater) => {
  console.log('Viewing rater:', rater)
}

const editRater = (rater) => {
  console.log('Editing rater:', rater)
}

const addRater = () => {
  if (!selectedBatch.value || selectedPositions.value.length === 0 || !selectedOffice.value || !selectedRater.value) {
    showError.value = true
    return
  }
  showError.value = false
  isSubmitting.value = true

  setTimeout(() => {
    const selectedPositionNames = positions.value
      .filter(pos => selectedPositions.value.includes(pos.id))
      .map(pos => pos.name)
      .join(', ')

    raters.value.push({
      id: raters.value.length + 1,
      Rater: availableRaters.value.find(r => r.id === selectedRater.value)?.name || '',
      batchDate: batches.value.find(b => b.id === selectedBatch.value)?.date || '',
      Position: selectedPositionNames,
      Office: offices.value.find(o => o.id === selectedOffice.value)?.name || '',
      pending: 0,
      completed: 0
    })

    closeModal()
    isSubmitting.value = false
  }, 1000)
}
</script>

<style scoped>
.q-table {
  width: 100%;
}
</style>
