<template>
  <q-page class="q-pa-md">
    <div class="column items-start q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Plantilla</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none" separator="/">
          <q-breadcrumbs-el>
            <q-select
              style="width: 280px"
              v-model="selectedOffice"
              :options="officePositions"
              label="City Hall Office Positions"
              outlined
              emit-value
              map-options
              @update:model-value="onOfficeSelect"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :class="{ 'bg-grey-2': scope.selected }">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.department }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-breadcrumbs-el>
        </q-breadcrumbs>
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="text-h6">Plantilla</div>
        <q-btn color="primary" label="Add Position" @click="addPosition" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table flat bordered :rows="positions" :columns="columns" row-key="id">
          <template v-slot:body-cell-funded="props">
            <q-td :props="props">
              <q-toggle
                :model-value="props.row.funded"
                :color="props.row.funded ? 'green' : 'red'"
                checked-icon="check"
                unchecked-icon="close"
                :disable="props.row.funded || props.row.employee !== ''"
                @click="handleToggle(props.row)"
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
                icon="post_add"
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
      <q-card class="q-pa-lg" style="width: 80vw">
        <q-card-section>
          <div class="text-h6">Plantilla Job Post</div>
          <div class="text-subtitle2 text-grey">Administrative & Fiscal Management Group</div>
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
              <q-input v-model="startingDate" label="Starting Date" type="date" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="endedDate" label="Ended Date" type="date" outlined dense />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Qualification Standard</div>
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
                <td><q-select v-model="education" :options="['Bachelor\'s Degree']" outlined dense /></td>
                <td><q-select v-model="experience" :options="['Something']" outlined dense /></td>
                <td><q-select v-model="training" :options="['Something']" outlined dense /></td>
                <td><q-select v-model="eligibility" :options="['Something']" outlined dense /></td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn color="primary" label="Post" @click="submitJobPost" class="full-width" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Filled Position Modal -->
    <q-dialog v-model="showFilledPositionModal" persistent>
      <q-card class="full-width" style="max-width: 600px">
        <q-card-section class="row items-center">
          <div class="col">
            <div class="text-h6">Qualification Standard</div>
            <div class="text-subtitle2">Application Information</div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="row">
          <div class="col-4">
            <q-avatar size="200px" color="grey-3" />
            <div class="text-center q-mt-md">
              <div class="text-subtitle1">{{ selectedPosition?.employee || 'Employee Name' }}</div>
              <q-badge color="green" outline>Active</q-badge>
            </div>
          </div>
          <div class="col-8">
            <q-tabs v-model="tab" active-color="primary" indicator-color="primary" align="justify">
              <q-tab name="education" label="Education" />
              <q-tab name="experience" label="Experience" />
              <q-tab name="training" label="Training" />
              <q-tab name="eligibility" label="Eligibility" />
            </q-tabs>

            <q-tab-panels v-model="tab">
              <q-tab-panel name="education">
                <div class="text-subtitle1 q-mb-md">Current Position</div>
                <q-input :model-value="currentPosition" label="Position" outlined readonly />
                <div class="text-subtitle1 q-mt-md q-mb-md">Higher Education</div>
                <q-input :model-value="higherEducation" label="Degree" outlined readonly />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Print" color="grey" flat />
          <q-btn label="Update" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const selectedOffice = ref(null)
const showModal = ref(false)
const showVacantPositionModal = ref(false)
const showFilledPositionModal = ref(false)
const selectedFile = ref(null)
const currentRow = ref(null)
const selectedPosition = ref(null)
const tab = ref('education')

const jobTitle = ref('')
const jobRole = ref('')
const startingDate = ref('')
const endedDate = ref('')
const education = ref(null)
const experience = ref(null)
const training = ref(null)
const eligibility = ref(null)
const currentPosition = ref('')
const higherEducation = ref('')

const officePositions = [
  { value: 'mayor', label: 'City Mayor', department: 'Executive Office' },
  { value: 'viceMayor', label: 'Vice Mayor', department: 'Executive Office' },
  { value: 'cityAdministrator', label: 'City Administrator', department: 'Administrative Services' },
  { value: 'financeDirector', label: 'Finance Director', department: 'Finance Department' },
  { value: 'humanResourcesManager', label: 'Human Resources Manager', department: 'Human Resources' },
  { value: 'publicWorksDirector', label: 'Public Works Director', department: 'Public Works Department' },
  { value: 'cityPlanner', label: 'City Planner', department: 'Urban Planning' },
  { value: 'healthOfficer', label: 'City Health Officer', department: 'Health Department' },
  { value: 'treasurerController', label: 'Treasurer/Controller', department: 'Finance Department' },
  { value: 'legalCounsel', label: 'City Legal Counsel', department: 'Legal Department' },
  { value: 'informationCommunicationTechnology', label: 'ICT Department', department: 'ICT Department' },
]

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
  { name: 'funded', label: 'Funded', field: (row) => (row.funded ? 'Yes' : 'No'), align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'action', label: 'Action', field: 'action', align: 'center' },
]

const onOfficeSelect = (selectedPosition) => {
  console.log('Selected Position:', selectedPosition)
}

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

const addPosition = () => {
  console.log('Add Position clicked')
}

const submitJobPost = () => {
  console.log('Job Post Submitted')
  showVacantPositionModal.value = false
}
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
