<template>
  <div>
    <div v-if="!vwActiveStore.loading" class="row q-gutter-y-md">
      <q-card
        v-for="(stat, index) in stats"
        :key="index"
        class="stat-card text-dark cursor-pointer q-pr-md"
        :style="{
          backgroundColor: stat.color,
          width: '120px',
          borderTop: '8px solid #00b034',
          borderRadius: '12px',
          margin: '9px',
        }"
        @click="showEmployeeDialog(stat.title)"
      >
        <q-card-section class="q-pa-sm row items-center">
          <div>
            <div class="text-subtitle1 text-bold">{{ stat.title }}</div>
            <div class="text-h4">{{ getStatValue(stat.valueKey) }}</div>
            <div class="text-caption">{{ stat.caption }}</div>
          </div>
          <!-- <div><q-icon :name="stat.icon" size="30px" /></div> -->
        </q-card-section>
      </q-card>
  </div>
    <div v-else class="row justify-center items-center q-mx-auto">
      <q-spinner-dots size="100px" color="primary" class="q-ma-md" />
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { use_vwActiveStore } from 'src/stores/vwActiveStore'
import {useRouter} from 'vue-router'

const vwActiveStore = use_vwActiveStore()
const dataR = ref([])
const router = useRouter()

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
    title: 'Co-Terminous',
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
    valueKey: 'CONTRACTUAL',
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
  const statusMapping = {
    Elective: 'ELECTIVE',
    Appointed: 'APPOINTED',
    'Co-Terminous': 'CO-TERMINOUS',
    Permanent: 'REGULAR',
    Temporary: 'TEMPORARY',
    Casual: 'CASUAL',
    'Job Order': 'CONTRACTUAL',
    Honorarium: 'HONORARIUM',
  };

  const status_title = statusMapping[status] || status;
  router.push(`/dashboard/status/${status_title}`);
};

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
