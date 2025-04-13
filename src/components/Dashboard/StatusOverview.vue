<template>
  <div>
    <div v-if="!vwActiveStore.loading" class="row justify-evenly q-gutter-y-md">
      <q-card
        v-for="(stat, index) in stats"
        :key="index"
        class="stat-card text-dark cursor-pointer"
        :style="{
          backgroundColor: stat.color,
          width: '175px',
          borderTop: '8px solid #00b034',
          borderRadius: '12px',
        }"
        @click="showEmployeeDialog(stat.title)"
      >
        <q-card-section class="q-pa-lg row justify-between items-center">
          <div>
            <div class="text-subtitle1 text-bold">{{ stat.title }}</div>
            <div class="text-h4">{{ getStatValue(stat.valueKey) }}</div>
            <div class="text-caption">{{ stat.caption }}</div>
          </div>
          <div><q-icon :name="stat.icon" size="30px" /></div>
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="row justify-center items-center q-mx-auto">
      <q-spinner-dots size="100px" color="primary" class="q-ma-md" />
    </div>

    <!-- Employee List Dialog -->
    <q-dialog v-model="employeeDialog" maximized>
      <q-card class="q-dialog-plugin">
        <q-bar class="bg-primary text-white">
          <q-icon :name="selectedStatusIcon" class="q-mr-sm" />
          <div class="text-h6">{{ selectedStatus }} Employees</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-none">
          <div class="row q-mb-md">
            <q-input
              v-model="employeeFilter"
              dense
              outlined
              placeholder="Search employees..."
              class="col"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <q-table
            :rows="employeeList"
            :columns="employeeColumns"
            row-key="id"
            :loading="loadingEmployees"
            :filter="employeeFilter"
            flat
            bordered
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-8 q-py-lg">
                <q-icon name="warning" size="sm" class="q-mr-xs" />
                No employees found
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { use_vwActiveStore } from 'src/stores/vwActiveStore'

const vwActiveStore = use_vwActiveStore()
const dataR = ref([])

// Dialog controls
const employeeDialog = ref(false)
const selectedStatus = ref('')
const selectedStatusIcon = computed(() => {
  const stat = stats.value.find(s => s.title === selectedStatus.value)
  return stat ? stat.icon : 'people'
})
const employeeList = ref([])
const loadingEmployees = ref(false)
const employeeFilter = ref('')

const employeeColumns = [
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
    classes: 'text-weight-bold'
  },
  {
    name: 'office',
    label: 'Office',
    align: 'left',
    field: 'office',
    sortable: true
  },
  {
    name: 'position',
    label: 'Position',
    align: 'left',
    field: 'position',
    sortable: true
  }
]

const stats = ref([
  {
    title: 'Elective',
    valueKey: 'ELECTIVE',
    caption: 'Employee',
    color: '#FFF',
    icon: 'how_to_vote',
  },
  {
    title: 'Appointed',
    valueKey: 'APPOINTED',
    caption: 'Employee',
    color: '#FFF',
    icon: 'assignment_ind',
  },
  {
    title: 'Co-Terminus',
    valueKey: 'CO-TERMINOUS',
    caption: 'Employee',
    color: '#FFF',
    icon: 'hourglass_empty',
  },
  {
    title: 'Permanent',
    valueKey: 'REGULAR',
    caption: 'Employee',
    color: '#FFF',
    icon: 'verified',
  },
  {
    title: 'Temporary',
    valueKey: 'TEMPORARY',
    caption: 'Employee',
    color: '#FFF',
    icon: 'work_history',
  },
  {
    title: 'Casual',
    valueKey: 'CASUAL',
    caption: 'Employee',
    color: '#FFF',
    icon: 'work',
  },
  {
    title: 'Job Order',
    valueKey: 'JOB ORDER',
    caption: 'Employee',
    color: '#FFF',
    icon: 'description',
  },
  {
    title: 'Honorarium',
    valueKey: 'HONORARIUM',
    caption: 'Employee',
    color: '#FFF',
    icon: 'monetization_on',
  },
  
])

const getStatValue = (valueKey) => {
  if (!dataR.value || dataR.value.length === 0) return 0
  const found = dataR.value.find(
    (item) => item.status && item.status.toUpperCase() === valueKey.toUpperCase()
  )
  return found ? found.count : 0
}

const showEmployeeDialog = async (status) => {
  selectedStatus.value = status
  loadingEmployees.value = true
  employeeDialog.value = true

  try {
    // Replace with actual API call:
    // const response = await api.get(`/employees?status=${status.toLowerCase()}`)
    // employeeList.value = response.data

    // Mock data:
    employeeList.value = [
      { id: 1, name: 'John Doe', office: 'Mayor\'s Office', position: 'Staff' },
      { id: 2, name: 'Jane Smith', office: 'HR Department', position: 'Manager' },
      { id: 3, name: 'Robert Johnson', office: 'Finance Department', position: 'Accountant' },
      { id: 4, name: 'Maria Garcia', office: 'Public Works', position: 'Engineer' },
    ]
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    loadingEmployees.value = false
  }
}

onMounted(async () => {
  try {
    dataR.value = await vwActiveStore.fetch_vwActive()
  } catch (error) {
    console.error("Failed to fetch active data:", error)
  }
})
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}
</style>
