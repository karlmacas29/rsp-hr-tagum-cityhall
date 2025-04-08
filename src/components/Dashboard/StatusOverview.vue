<template>
    <div>
        <div v-if="!vwActiveStore.loading" class="row justify-evenly q-gutter-y-md">
            <q-card v-for="(stat, index) in stats" :key="index" class="stat-card text-dark"
                :style="{ backgroundColor: stat.color, width: '120px', borderTop: '8px solid #00b034', borderRadius: '12px' }">
                <q-card-section class="q-pa-lg grid justify-between items-center">
                    <div><q-icon :name="stat.icon" size="30px" /></div>
                    <div>
                        <div class="text-subtitle1 text-bold">{{ stat.title }}</div>
                        <div class="text-h4">{{ getStatValue(stat.valueKey) }}</div>
                        <div class="text-caption">{{ stat.caption }}</div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
        <div v-else class="row justify-center items-center q-mx-auto">
            <q-spinner-dots size="100px" color="primary" class=" q-ma-md" />
        </div>
    </div>
</template>

<script setup>
import { use_vwActiveStore } from 'src/stores/vwActiveStore'
import { onMounted, ref } from 'vue'

const vwActiveStore = use_vwActiveStore()
const dataR = ref([])

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
        title: 'Casual', 
        valueKey: 'CASUAL',
        caption: 'Employee', 
        color: '#FFF', 
        icon: 'work' 
    },
    {
        title: 'Job Order',
        valueKey: 'jobOrder',
        caption: 'Employee',
        color: '#FFF',
        icon: 'description',
    },
    {
        title: 'Honorarium',
        valueKey: 'honorarium',
        caption: 'Employee',
        color: '#FFF',
        icon: 'monetization_on',
    },
    {
        title: 'Temporary',
        valueKey: 'TEMPORARY',
        caption: 'Employee',
        color: '#FFF',
        icon: 'work_history',
    },
])

const getStatValue = (title) => {
    if (!dataR.value || dataR.value.length === 0) return 0;
    
    // Find the matching status in dataR
    const found = dataR.value.find(item => item.status.toLowerCase() === title.toLowerCase());
    return found ? found.count : 0;
}

onMounted(async () => {
    dataR.value = await vwActiveStore.fetch_vwActive()
})
</script>

<style scoped>
/* Adjust statistics cards */
.stat-card {
    border-radius: 12px;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}
</style>