<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Plantilla</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none" separator="/">
          <q-breadcrumbs-el
            v-for="(item, index) in breadcrumbItems"
            :key="index"
            :label="item.label"
          />
          <q-breadcrumbs-el v-for="(dropdown, index) in dropdowns" :key="index">
            <q-btn flat @click="toggleDropdown(index)">
              <span>{{ dropdown.selectedOption }}</span>
              <q-icon
                name="arrow_drop_down"
                :class="{ 'rotate-up': dropdown.open, 'rotate-down': !dropdown.open }"
              />
            </q-btn>
            <q-menu v-model="dropdown.open" anchor="bottom left" self="top left">
              <q-list>
                <q-item
                  v-for="(option, optIndex) in dropdown.options"
                  :key="optIndex"
                  clickable
                  v-ripple
                  @click="selectOption(index, option)"
                >
                  <q-item-section>{{ option }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
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
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Breadcrumb items
const breadcrumbItems = ref([])

// Dropdown state and options
const dropdowns = ref([
  {
    selectedOption: 'Select an option',
    options: ['Option 1', 'Option 2', 'Option 3'],
    open: false,
  },
  {
    selectedOption: 'Select an option2',
    options: ['Option 1', 'Option 2', 'Option 3'],
    open: false,
  },
])

const toggleDropdown = (index) => {
  dropdowns.value.forEach((dropdown, i) => {
    dropdown.open = i === index ? !dropdown.open : false
  })
}

const selectOption = (index, option) => {
  dropdowns.value[index].selectedOption = option
  dropdowns.value[index].open = false
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
