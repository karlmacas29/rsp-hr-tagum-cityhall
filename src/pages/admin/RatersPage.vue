<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Raters</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Raters" />
          <q-breadcrumbs-el class="text-bold" label="Raters List" />
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
        <q-table flat bordered :rows="raters" :columns="columns" row-key="id">
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'Completed' ? 'green' : 'orange'">
                {{ props.row.status }}
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

      <q-card-section v-else>
        <!-- Add skeleton here if needed -->
      </q-card-section>
    </q-card>

    <!-- Modal -->
    <q-dialog v-model="showModal" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 400px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6"><b>Add Rater</b></div>
          <q-btn icon="close" flat round dense @click="showModal = false" />
        </q-card-section>

        <q-card-section>
          <q-banner v-if="showError" class="bg-red-2 text-red-10 q-mb-md">
            Please fill in all required fields.
          </q-banner>

          <div class="text-subtitle1 q-mb-sm text-weight-medium">1. Select Batch</div>
          <q-select
            v-model="selectedBatch"
            :options="batches"
            option-value="id"
            option-label="display"
            label="Select Batch"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="fetchPositions"
          />

          <q-separator class="q-mt-md q-mb-md" />

          <div class="text-subtitle1 q-mb-sm text-weight-medium">2. Choose Position(s)</div>
          <q-checkbox
            v-model="selectAllPositions"
            label="Select All"
            @update:model-value="toggleAllPositions"
            :disable="!selectedBatch || positions.length === 0"
            dense
          />
          <div class="q-pa-sm scroll" style="max-height: 150px">
            <q-checkbox
              v-for="position in positions"
              :key="position.id"
              v-model="selectedPositions"
              :val="position.id"
              :label="position.name"
              :disable="!selectedBatch"
              dense
            />
          </div>

          <q-separator class="q-mt-md q-mb-md" />

          <div class="text-subtitle1 q-mb-sm text-weight-medium">3. Search & Add Rater</div>
          <q-select
            v-model="selectedRater"
            :options="availableRaters"
            option-value="id"
            option-label="name"
            label="Search Rater"
            use-input
            outlined
            dense
            emit-value
            map-options
            @filter="filterRaters"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Add Rater"
            color="primary"
            @click="addRater"
            :loading="isSubmitting"
            :disable="!selectedRater || !selectedBatch || selectedPositions.length === 0"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useRaterStore } from 'stores/raterStore'
import { onMounted, ref, watch } from 'vue'

const useRater = useRaterStore()

const showModal = ref(false)
const showError = ref(false)
const isSubmitting = ref(false)

const selectedBatch = ref(null)
const selectedPositions = ref([])
const selectAllPositions = ref(false)
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
  { name: 'ID', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'Rater', label: 'Raters Name', field: 'Rater', align: 'left', sortable: true },
  { name: 'batchDate', label: 'Assigned Batch', field: 'batchDate', align: 'left' },
  { name: 'Position', label: 'Position', field: 'Position', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: 'Action', align: 'center' },
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
  selectAllPositions.value = false
}

const toggleAllPositions = (val) => {
  selectedPositions.value = val ? positions.value.map(pos => pos.id) : []
}

watch(selectedPositions, (newVal) => {
  selectAllPositions.value = newVal.length === positions.value.length && positions.value.length > 0
})

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

const addRater = () => {
  if (!selectedBatch.value || selectedPositions.value.length === 0 || !selectedRater.value) {
    showError.value = true
    return
  }

  showError.value = false
  isSubmitting.value = true

  const batchInfo = batches.value.find(b => b.id === selectedBatch.value) || {}
  const raterName = availableRaters.value.find(r => r.id === selectedRater.value)?.name || ''

  selectedPositions.value.forEach(positionId => {
    const positionName = positions.value.find(p => p.id === positionId)?.name || ''

    const newRater = {
      id: raters.value.length + 1,
      Rater: raterName,
      batchDate: batchInfo.date,
      Position: positionName,
      status: 'Pending',
    }

    raters.value.push(newRater)
  })

  selectedBatch.value = null
  selectedPositions.value = []
  selectAllPositions.value = false
  selectedRater.value = null
  showModal.value = false
  isSubmitting.value = false
}

const viewRater = (rater) => {
  console.log('Viewing rater:', rater)
}

onMounted(async () => {
  await useRater.fetchRaters()
  raters.value = useRater.raters
})
</script>
