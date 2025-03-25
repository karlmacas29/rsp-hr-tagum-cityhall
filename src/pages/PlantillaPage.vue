<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
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
                flat
                dense
                round
                color="blue"
                icon="visibility"
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

    <!-- Modal for Uploading File -->
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

    <!-- Modal for Vacant Position -->
    <q-dialog v-model="showVacantPositionModal">
      <q-card>
        <q-card-section class="bg-blue text-white">
          <div class="text-h6">Vacant Position Details</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6"><strong>Position:</strong> {{ selectedPosition.position }}</div>
            <div class="col-6"><strong>Item No:</strong> {{ selectedPosition.itemNo }}</div>
            <div class="col-6"><strong>Page No:</strong> {{ selectedPosition.pageNo }}</div>
            <div class="col-6"><strong>Salary Grade:</strong> {{ selectedPosition.sg }}</div>
            <div class="col-12">
              <strong>Status:</strong>
              <q-badge :color="selectedPosition.funded ? 'green' : 'red'">
                {{ selectedPosition.funded ? 'Funded' : 'Unfunded' }}
              </q-badge>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Close" color="primary" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal for Filled Position -->
    <q-dialog v-model="showFilledPositionModal" class="filled-position-modal">
      <q-card class="custom-modal">
        <q-card-section class="modal-header">
          <div class="text-h6">Filled Position Details</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="modal-content">
          <div class="row">
            <div class="col-6">
              <div class="modal-label">Employee</div>
              <div class="modal-value">{{ selectedPosition.employee }}</div>
            </div>
            <div class="col-6">
              <div class="modal-label">Position</div>
              <div class="modal-value">{{ selectedPosition.position }}</div>
            </div>
          </div>

          <div class="row q-mt-md">
            <div class="col-6">
              <div class="modal-label">Item No</div>
              <div class="modal-value">{{ selectedPosition.itemNo }}</div>
            </div>
            <div class="col-6">
              <div class="modal-label">Page No</div>
              <div class="modal-value">{{ selectedPosition.pageNo }}</div>
            </div>
          </div>

          <div class="row q-mt-md">
            <div class="col-6">
              <div class="modal-label">Salary Grade</div>
              <div class="modal-value">{{ selectedPosition.sg }}</div>
            </div>
            <div class="col-6">
              <div class="modal-label">Status</div>
              <div class="modal-value">
                <q-badge color="green">{{ selectedPosition.status }}</q-badge>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="modal-actions">
          <q-btn label="CLOSE" color="primary" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const selectedOffice = ref(null)

const officePositions = ref([
  { value: 'mayor', label: 'City Mayor', department: 'Executive Office' },
  { value: 'viceMayor', label: 'Vice Mayor', department: 'Executive Office' },
  {
    value: 'cityAdministrator',
    label: 'City Administrator',
    department: 'Administrative Services',
  },
  { value: 'financeDirector', label: 'Finance Director', department: 'Finance Department' },
  {
    value: 'humanResourcesManager',
    label: 'Human Resources Manager',
    department: 'Human Resources',
  },
  {
    value: 'publicWorksDirector',
    label: 'Public Works Director',
    department: 'Public Works Department',
  },
  { value: 'cityPlanner', label: 'City Planner', department: 'Urban Planning' },
  { value: 'healthOfficer', label: 'City Health Officer', department: 'Health Department' },
  { value: 'treasurerController', label: 'Treasurer/Controller', department: 'Finance Department' },
  { value: 'legalCounsel', label: 'City Legal Counsel', department: 'Legal Department' },
])

const onOfficeSelect = (selectedPosition) => {
  console.log('Selected Position:', selectedPosition)
}

// Positions data
const positions = ref([
  {
    id: 1,
    pageNo: 1,
    itemNo: 101,
    sg: '15',
    position: 'HR Manager',
    employee: 'John Doe',
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
])

// Table columns (Updated to be sortable)
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
  { name: 'action', label: 'Action', field: 'action', align: 'center' }, // Not sortable
]

// Modal & File Upload State
const showModal = ref(false)
const selectedFile = ref(null)
const currentRow = ref(null)

// New state for position modals
const showVacantPositionModal = ref(false)
const showFilledPositionModal = ref(false)
const selectedPosition = ref(null)

// Handle Toggle Click
const handleToggle = (row) => {
  if (!row.employee && !row.funded) {
    currentRow.value = row
    showModal.value = true
  }
}

// Confirm Upload (Switch to Yes)
const confirmUpload = () => {
  if (selectedFile.value && currentRow.value) {
    currentRow.value.funded = true
    showModal.value = false
    selectedFile.value = null
  }
}

// Cancel Upload (Keep it as No)
const cancelUpload = () => {
  showModal.value = false
}

// View Position Action
const viewPosition = (row) => {
  // Set the selected position
  selectedPosition.value = row

  // Determine which modal to show based on employee presence
  if (row.employee) {
    // Position is filled
    showFilledPositionModal.value = true
  } else {
    // Position is vacant
    showVacantPositionModal.value = true
  }
}

// Print Position Action
const printPosition = (row) => {
  console.log('Printing:', row)
}

// Add Position (Placeholder function)
const addPosition = () => {
  console.log('Add Position clicked')
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

.q-btn-with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.q-icon {
  transition: transform 0.3s ease;
}

.rotate-up {
  transform: rotate(180deg);
}

.rotate-down {
  transform: rotate(0deg);
}

.filled-position-modal {
  .custom-modal {
    width: 500px;
    max-width: 90vw;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4caf50;
    color: white;
    padding: 16px;
  }

  .modal-content {
    padding: 16px;
  }

  .modal-label {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    margin-bottom: 4px;
  }

  .modal-value {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.87);
  }

  .modal-actions {
    padding: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>
