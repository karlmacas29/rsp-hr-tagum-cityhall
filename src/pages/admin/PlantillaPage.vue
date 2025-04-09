<template>
  <q-page class="q-pa-md">
    <div class="q-mb-xl">
      <div class="q-ma-none q-gutter-sm">
        <PlantillaSelection></PlantillaSelection>
      </div>
    </div>
    
    <q-card>
      <q-card-section class="row justify-end">
        <q-btn color="primary" @click="clearFilters" icon="clear_all">Clear All</q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table 
          flat 
          bordered 
          :rows="filteredPositions" 
          :columns="columns" 
          row-key="id"
          :filter="filter"
        >
          <!-- Header with search boxes -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" :style="col.name === 'position' ? 'width: 200px; white-space: normal;' : ''">
              {{ col.label }}
              <q-input 
                v-if="col.name !== 'action' && col.name !== 'fd'" 
                dense 
                outlined 
                class="q-mt-sm" 
                v-model="filters[col.name]" 
                placeholder="Search" 
              />
              <q-select
                v-if="col.name === 'fd'"
                dense
                outlined
                class="q-mt-sm"
                v-model="filters[col.name]"
                :options="['All', 'Yes', 'No']"
                placeholder="Filter"
              />
              </q-th>
            </q-tr>
          </template>
          <!-- Add body cell template for PageNo -->
          <template v-slot:body-cell-PageNo="props">
            <q-td :props="props" style="width: 110px; white-space: normal;">
              {{ props.value }}
            </q-td>
          </template>

          <!-- Add body cell template for ItemNo -->
          <template v-slot:body-cell-ItemNo="props">
            <q-td :props="props" style="width: 110px; white-space: normal;">
              {{ props.value }}
            </q-td>
          </template>

          <!-- Add body cell template for Salary Grade -->
          <template v-slot:body-cell-SG="props">
            <q-td :props="props" style="width: 140px; white-space: normal;">
              {{ props.value }}
            </q-td>
          </template>

          <!-- Add body cell template for position -->
          <template v-slot:body-cell-position="props">
            <q-td :props="props" style="width: 300px; white-space: normal;">
              {{ props.value }}
            </q-td>
          </template>

          <template v-slot:body-cell-fd="props">
            <q-td :props="props">
              <q-toggle 
                v-model="props.row.Funded"
                true-value="1"
                false-value="0"
                color="green"
                @update:model-value="handleFundedToggle(props.row)"
                />
              </q-td>
            </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn 
              v-if="props.row.funded" 
              flat 
              dense 
              round 
              color="blue"
              :icon="props.row.funded && props.row.employee != '' ? 'visibility' : 'post_add'"
              @click="viewPosition(props.row)" 
              />
              <q-btn 
                v-if="props.row.employee" 
                flat 
                dense 
                round 
                color="green" 
                icon="print"
                @click="printPosition(props.row)" 
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Upload File Modal -->
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Upload Verification File</div>
        </q-card-section>

        <q-card-section>
          <q-file v-model="selectedFile" label="Choose a file" filled />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Confirm" color="green" :disabled="!selectedFile" @click="confirmUpload" />
          <q-btn label="Cancel" color="red" flat @click="cancelUpload" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Vacant Position Modal -->
    <q-dialog v-model="showVacantPositionModal">
      <q-card class="q-pa-lg" style="width: 900px; max-width: 80vw">
        <q-card-section>
          <div class="row justify-between">
            <div>
              <div class="text-h5 text-bold">Plantilla Job Post</div>
              <div class="text-subtitle2 text-grey">Software Engineer</div>
            </div>
            <div>
              <q-btn icon="close" rounded flat @click="showVacantPositionModal = !showVacantPositionModal" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="jobTitle" label="Job Title" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="jobRole" label="Job Role/Position" outlined dense />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-6">
              <q-input v-model="startingDate" label="Starting Date" outlined dense mask="date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="startingDate" :options="date => date >= endedDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="endedDate" label="Ended Date" outlined dense mask="date" :rules="[
                date => date >= startingDate || 'End date cannot be before start date'
              ]">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="endedDate" :options="date => date >= startingDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 q-mb-sm text-bold">Qualification Standard</div>
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th class="text-left">Education</th>
                <th class="text-left">Experience</th>
                <th class="text-left">Training</th>
                <th class="text-left">Eligibility</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <q-select v-model="education" :options="['Bachelor\'s Degree']" outlined dense />
                </td>
                <td><q-select v-model="experience" :options="['Something']" outlined dense /></td>
                <td><q-select v-model="training" :options="['Something']" outlined dense /></td>
                <td><q-select v-model="eligibility" :options="['Something']" outlined dense /></td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn color="primary" label="Create Post" @click="submitJobPost" size="md" style="width:200px;" rounded />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Quality Standard Modal (now a separate component) -->
    <QualityStandardModal 
      v-model:show="showFilledPositionModal" 
      :employee-name="selectedPosition?.employee"
      :current-position="currentPosition" 
      :higher-education="higherEducation" 
      @print="printPosition(selectedPosition)"
      @update="handleUpdatePosition" 
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import QualityStandardModal from 'components/QualityStandardModal.vue'
import PlantillaSelection from 'components/PlantillaSelection.vue'
import { usePlantillaStore } from 'stores/plantillaStore';

const usePlantilla = usePlantillaStore();

const showModal = ref(false)
const showVacantPositionModal = ref(false)
const showFilledPositionModal = ref(false)
const selectedFile = ref(null)
const currentRow = ref(null)
const selectedPosition = ref(null)
const filter = ref('')

// Add filter object to store search values for each column
const filters = ref({
  page_no: '',
  item_no: '',
  sg: '',
  position: '',
  employee: '',
  fd: 'All',
  status: ''
})

const jobTitle = ref('City Office of ...')
const jobRole = ref('Software Engineer')
const startingDate = ref('2019/02/01')
const endedDate = ref('2001/01/01')
const education = ref(null)
const experience = ref(null)
const training = ref(null)
const eligibility = ref(null)
const currentPosition = ref('')
const higherEducation = ref('')

const positions = ref([])

const columns = [
  { name: 'PageNo', label: 'Page No', field: 'PageNo', align: 'left', sortable: false },
  { name: 'ItemNo', label: 'Item No', field: 'ItemNo', align: 'left', sortable: false },
  { name: 'SG', label: 'Salary Grade', field: 'SG', align: 'left', sortable: false },
  { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: false },
  { name: 'Name2', label: 'Employee', field: 'Name2', align: 'left', sortable: false },
  {
    name: 'fd',
    label: 'Funded',
    field: 'Funded',
    align: 'left',
    sortable: false,
  },
  { name: 'Status', label: 'Status', field: 'Status', align: 'left', sortable: false },
  { name: 'action', label: 'Action', field: 'action', align: 'center' },
]

// Create a computed property to filter the positions based on search inputs
const filteredPositions = computed(() => {
  return positions.value.filter(row => {
    for (const key in filters.value) {
      if (filters.value[key]) {
        if (key === 'fd') {
          if (filters.value[key] !== 'All') {
            const isYes = filters.value[key] === 'Yes';
            if (isYes !== !!row.Funded) return false;
          }
        } else {
          const filterValue = String(filters.value[key]).toLowerCase();
          const rowValue = String(row[key] || '').toLowerCase();
          if (!rowValue.includes(filterValue)) return false;
        }
      }
    }
    return true;
  })
})

// eslint-disable-next-line no-unused-vars
const handleToggle = (row) => {
  if (!row.employee && !row.funded) {
    currentRow.value = row
    showModal.value = true
  }
}

const confirmUpload = () => {
  if (selectedFile.value && currentRow.value) {
    currentRow.value.funded = true
    showModal.value = false
    selectedFile.value = null
  }
}

const cancelUpload = () => {
  showModal.value = false
  selectedFile.value = null
}

const viewPosition = (row) => {
  selectedPosition.value = row
  if (row.employee) {
    currentPosition.value = row.position
    higherEducation.value = 'Bachelor of Science in Management'
    showFilledPositionModal.value = true
  } else {
    showVacantPositionModal.value = true
  }
}

const printPosition = (row) => {
  console.log('Printing:', row)
}

const submitJobPost = () => {
  console.log('Job Post Submitted')
  showVacantPositionModal.value = false
}
const handleUpdatePosition = () => {
  console.log('Update position logic here')
  // Add your update logic here
}

// not yet
const handleFundedToggle = async (row) => {
  try {
    // Update the store or make API call here
    await usePlantilla.updatePlantillaFunded(row.id, !!row.Funded);
  } catch (error) {
    console.error('Error updating funded status:', error);
    row.Funded = !row.Funded; // Revert on error
  }
}


// Clear filters function
const clearFilters = () => {
  Object.keys(filters.value).forEach(key => {
    if (key === 'funded') {
      filters.value[key] = 'All'
    } else {
      filters.value[key] = ''
    }
  })
}

onMounted(async() => {
  // Fetch data or perform any setup when the component is mounted
  startingDate.value = new Date().toISOString().split('T')[0].replace(/-/g, '/')
  endedDate.value = new Date().toISOString().split('T')[0].replace(/-/g, '/')

  await usePlantilla.fetchPlantillaData();
  positions.value = usePlantilla.plantillaData.map(item => ({
    ...item,
    status: item.status || 'Vacant',
  }))
})
</script>

<style lang="scss" scoped>
.custom-breadcrumbs {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 16px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  :deep(.q-breadcrumbs__el) {
    font-size: 14px;
    color: #1a202c;

    &:hover {
      color: #4299e1;
    }
  }
}

// Added styles for search inputs in table header
:deep(.q-table th) {
  white-space: normal;
  padding-bottom: 8px;
}

:deep(.q-table--dense .q-table th) {
  padding-top: 8px;
}

:deep(.q-field--outlined) {
  padding: 0;
  margin-top: 4px;
}
</style>