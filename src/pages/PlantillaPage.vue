<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Plantilla</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none" separator="/">

          <q-breadcrumbs-el>
            <q-select style="width:280px;" v-model="selectedOffice" :options="officePositions"
              label="City Hall Office Positions" outlined emit-value map-options @update:model-value="onOfficeSelect">
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
          <q-breadcrumbs-el>
            <!--  -->
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
              <q-toggle :model-value="props.row.funded" :color="props.row.funded ? 'green' : 'red'" checked-icon="check"
                unchecked-icon="close" :disable="props.row.funded || props.row.employee !== ''"
                @click="handleToggle(props.row)" />
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn flat dense round color="blue" icon="visibility" @click="viewPosition(props.row)" />
              <q-btn v-if="props.row.employee" flat dense round color="green" icon="print"
                @click="printPosition(props.row)" />
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
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const selectedOffice = ref(null)

const officePositions = ref([
  {
    value: 'mayor',
    label: 'City Mayor',
    department: 'Executive Office'
  },
  {
    value: 'viceMayor',
    label: 'Vice Mayor',
    department: 'Executive Office'
  },
  {
    value: 'cityAdministrator',
    label: 'City Administrator',
    department: 'Administrative Services'
  },
  {
    value: 'financeDirector',
    label: 'Finance Director',
    department: 'Finance Department'
  },
  {
    value: 'humanResourcesManager',
    label: 'Human Resources Manager',
    department: 'Human Resources'
  },
  {
    value: 'publicWorksDirector',
    label: 'Public Works Director',
    department: 'Public Works Department'
  },
  {
    value: 'cityPlanner',
    label: 'City Planner',
    department: 'Urban Planning'
  },
  {
    value: 'healthOfficer',
    label: 'City Health Officer',
    department: 'Health Department'
  },
  {
    value: 'treasurerController',
    label: 'Treasurer/Controller',
    department: 'Finance Department'
  },
  {
    value: 'legalCounsel',
    label: 'City Legal Counsel',
    department: 'Legal Department'
  }
])

const onOfficeSelect = (selectedPosition) => {
  // Optional method to handle selection
  console.log('Selected Position:', selectedPosition)
  // You can add additional logic here, such as:
  // - Fetching more details about the position
  // - Updating parent component
  // - Triggering additional actions
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

// Table columns
const columns = [
  { name: 'page_no', label: 'Page No', field: 'pageNo', align: 'left' },
  { name: 'item_no', label: 'Item No', field: 'itemNo', align: 'left' },
  { name: 'sg', label: 'SG', field: 'sg', align: 'left' },
  { name: 'position', label: 'Position', field: 'position', align: 'left' },
  { name: 'employee', label: 'Employee', field: 'employee', align: 'left' },
  {
    name: 'funded',
    label: 'Funded',
    field: 'funded',
    align: 'center',
    format: (val, row) => (row.funded ? 'Yes' : 'No'),
  },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  {
    name: 'action',
    label: 'Action',
    field: 'action',
    align: 'center',
    sortable: false,
  },
]

// Modal & File Upload State
const showModal = ref(false)
const selectedFile = ref(null)
const currentRow = ref(null)

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
  console.log('Viewing:', row)
}

// Print Position Action
const printPosition = (row) => {
  console.log('Printing:', row)
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
</style>
