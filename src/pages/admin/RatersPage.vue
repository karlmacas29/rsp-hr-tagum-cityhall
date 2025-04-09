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
                <div v-if="col.name !== 'actions' && col.search">
                  <div>{{ col.label }}</div>
                  <q-input
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

          <!-- Body cell templates -->
          <template v-slot:body-cell-pending="props">
            <q-td :props="props">
              {{ props.row.pending || 0 }}
            </q-td>
          </template>

          <template v-slot:body-cell-completed="props">
            <q-td :props="props">
              {{ props.row.completed || 0 }}
            </q-td>
          </template>

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

      <q-card-section v-else>
        <q-skeleton height="150px" square />
      </q-card-section>
    </q-card>

    <!-- Add Rater Modal -->
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

          <!-- 2. Select Positions (Dropdown with checkboxes) -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-medium">Select Positions to Rate</div>
            <q-select
              v-model="selectedPositions"
              multiple
              :options="positions"
              option-value="id"
              option-label="name"
              label="Select one or more positions"
              outlined
              dense
              use-chips
              emit-value
              map-options
              :disable="!selectedBatch"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-checkbox :model-value="scope.selected" />
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
              @filter="filterRaters"
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
import { useRaterStore } from 'stores/raterStore'
import { onMounted, ref, computed } from 'vue'

const filters = ref({
  ID: '',
  Rater: '',
  batchDate: '',
  Position: '',
  Office: ''
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
const showError = ref(false)
const isSubmitting = ref(false)

const selectedBatch = ref(null)
const selectedPositions = ref([])
const selectedOffice = ref(null)
const selectedRater = ref(null)

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
const raters = ref([
  {
    id: 1,
    Rater: 'John Doe',
    batchDate: '2024-03-15',
    Position: 'Frontend Developer',
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

const availableRaters = ref([
  { id: 1, name: 'John Doe', officeId: 1 },
  { id: 2, name: 'Jane Smith', officeId: 1 },
  { id: 3, name: 'Alice Johnson', officeId: 2 },
  { id: 4, name: 'Bob Williams', officeId: 3 },
  { id: 5, name: 'Charlie Brown', officeId: 3 },
])

const filteredAvailableRaters = computed(() => {
  if (!selectedOffice.value) return availableRaters.value
  return availableRaters.value.filter(rater =>
    rater.officeId === selectedOffice.value
  )
})

const columns = [
  {
    name: 'ID',
    label: 'ID',
    field: 'id',
    align: 'left',

    search: true
  },
  {
    name: 'Rater',
    label: 'Rater Name',
    field: 'Rater',
    align: 'left',

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

    search: true
  },
  {
    name: 'Office',
    label: 'Office',
    field: 'Office',
    align: 'left',
  
    search: true
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

const filterRaters = (val, update) => {
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
    ].filter(rater =>
      rater.name.toLowerCase().includes(searchTerm)
    )
  })
}

const addRater = () => {
  if (!selectedBatch.value || selectedPositions.value.length === 0 || !selectedRater.value || !selectedOffice.value) {
    showError.value = true
    return
  }

  showError.value = false
  isSubmitting.value = true

  const batchInfo = batches.value.find(b => b.id === selectedBatch.value) || {}
  const officeInfo = offices.value.find(o => o.id === selectedOffice.value) || {}
  const raterInfo = availableRaters.value.find(r => r.id === selectedRater.value) || {}

  selectedPositions.value.forEach(positionId => {
    const positionName = positions.value.find(p => p.id === positionId)?.name || ''

    const newRater = {
      id: raters.value.length + 1,
      Rater: raterInfo.name,
      batchDate: batchInfo.date,
      Position: positionName,
      Office: officeInfo.name,
      pending: Math.floor(Math.random() * 5),
      completed: Math.floor(Math.random() * 5)
    }

    raters.value.push(newRater)
  })

  closeModal()
  isSubmitting.value = false
}

const viewRater = (rater) => {
  console.log('Viewing rater:', rater)
  // Implement your view logic here
}

const editRater = (rater) => {
  console.log('Editing rater:', rater)
  // Implement your edit logic here
}

onMounted(async () => {
  await useRater.fetchRaters()
  // raters.value = useRater.raters // Uncomment when your store is ready
})
</script>

<style scoped>
.q-table {
  width: 100%;
}
</style>
