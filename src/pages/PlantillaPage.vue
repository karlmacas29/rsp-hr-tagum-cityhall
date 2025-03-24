<template>
  <q-page class="q-pa-md">
    <div class="column items-start q-mb-md q-pa-md">
      <h5 class="text-h3 q-ma-none"><b>Plantilla</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-pa-md" separator="/">
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
            <q-menu anchor="bottom left" self="top left">
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
        <q-table flat bordered :rows="positions" :columns="columns" row-key="id" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Breadcrumb items
const breadcrumbItems = ref([])

// Dropdown state and options
const dropdowns = ref([
  {
    selectedOption: 'Select a option',
    options: ['Option 1', 'Option 2', 'Option 3'],
    open: false,
  },
  {
    selectedOption: 'Select a option2',
    options: ['Option 1', 'Option 2', 'Option 3'],
    open: false,
  },
])

// Handlers
const toggleDropdown = (index) => {
  dropdowns.value.forEach((dropdown, i) => {
    dropdown.open = i === index ? !dropdown.open : false
  })
}

const selectOption = (index, option) => {
  dropdowns.value[index].selectedOption = option
  dropdowns.value[index].open = false
}

const positions = ref([
  {
    id: 1,
    pageNo: 1,
    itemNo: 101,
    sg: '15',
    position: 'HR Manager',
    employee: 'John Doe',
    funded: 'Yes',
    status: 'Active',
    action: '',
  },
  {
    id: 2,
    pageNo: 2,
    itemNo: 102,
    sg: '18',
    position: 'Software Engineer',
    employee: 'Jane Smith',
    funded: 'No',
    status: 'Inactive',
    action: '',
  },
])

const columns = [
  { name: 'page_no', label: 'Page No', field: 'page_no', align: 'left' },
  { name: 'item_no', label: 'Item No', field: 'item_no', align: 'left' },
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
  { name: 'action', label: 'Action', field: 'action', align: 'left' },
]

const addPosition = () => {
  console.log('Add Position Clicked')
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

.domain-dropdown,
.db-dropdown {
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
