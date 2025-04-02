<template>
  <q-page class="q-pa-md">
    <div class="column items-start q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Plantilla</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <PlantillaSelection></PlantillaSelection>
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="text-h6">Plantilla</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table flat bordered :rows="positions" :columns="columns" row-key="id">
          <template v-slot:body-cell-funded="props">
            <q-td :props="props">
              <q-toggle :model-value="props.row.funded" :color="props.row.funded ? 'green' : 'red'" checked-icon="check"
                unchecked-icon="close" :disable="props.row.funded || props.row.employee !== ''"
                @click="handleToggle(props.row)" />
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn v-if="props.row.funded" flat dense round color="blue"
                :icon="props.row.funded && props.row.employee != '' ? 'visibility' : 'post_add'"
                @click="viewPosition(props.row)" />
              <q-btn v-if="props.row.employee" flat dense round color="green" icon="print"
                @click="printPosition(props.row)" />
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
              <!-- <q-input v-model="startingDate" label="Starting Date" type="date" outlined dense /> -->
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
              <!-- <q-input v-model="endedDate" label="Ended Date" type="date" outlined dense /> -->
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
    <QualityStandardModal v-model:show="showFilledPositionModal" :employee-name="selectedPosition?.employee"
      :current-position="currentPosition" :higher-education="higherEducation" @print="printPosition(selectedPosition)"
      @update="handleUpdatePosition" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QualityStandardModal from 'components/QualityStandardModal.vue'
import PlantillaSelection from 'components/PlantillaSelection.vue'


const showModal = ref(false)
const showVacantPositionModal = ref(false)
const showFilledPositionModal = ref(false)
const selectedFile = ref(null)
const currentRow = ref(null)
const selectedPosition = ref(null)

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



const positions = [
  {
    id: 1,
    pageNo: 1,
    itemNo: 101,
    sg: '15',
    position: 'HR Manager',
    employee: 'Mahusay, Jograd M.',
    funded: true,
    status: 'Active',
  },
  {
    id: 2,
    pageNo: 2,
    itemNo: 102,
    sg: '18',
    position: 'Software Engineer',
    employee: '',
    funded: false,
    status: 'Inactive',
  },
]

const columns = [
  { name: 'page_no', label: 'Page No', field: 'pageNo', align: 'left', sortable: true },
  { name: 'item_no', label: 'Item No', field: 'itemNo', align: 'left', sortable: true },
  { name: 'sg', label: 'SG', field: 'sg', align: 'left', sortable: true },
  { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
  { name: 'employee', label: 'Employee', field: 'employee', align: 'left', sortable: true },
  {
    name: 'funded',
    label: 'Funded',
    field: (row) => (row.funded ? 'Yes' : 'No'),
    align: 'center',
    sortable: true,
  },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'action', label: 'Action', field: 'action', align: 'center' },
]



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

onMounted(() => {
  // Fetch data or perform any setup when the component is mounted
  startingDate.value = new Date().toISOString().split('T')[0].replace(/-/g, '/')
  endedDate.value = new Date().toISOString().split('T')[0].replace(/-/g, '/')
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
</style>
