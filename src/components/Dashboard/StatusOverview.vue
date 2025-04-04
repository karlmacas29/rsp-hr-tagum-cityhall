<template>
    <div>
        <div v-if="!vwActiveStore.loading" class="row justify-evenly ">
            <!-- <div class="row justify-between">
                <q-card v-for="(stat, index) in stats" :key="index" class="stat-card text-dark"
                    :style="{ backgroundColor: stat.color }">
                    <q-card-section class="q-pa-sm">
                        <q-icon :name="stat.icon" size="30px" class="q-mb-sm" />
                        <div class="text-subtitle1">{{ stat.title }}</div>
                        <div class="text-h5">{{ stat.value }}</div>
                        <div class="text-caption">{{ stat.caption }}</div>
                    </q-card-section>
                </q-card>
            </div> -->

            <q-card v-for="(dataR, index) in dataR" :key="index" class=" text-dark "
                style="background-color: #FFF ; width:190px ; border-top: 8px solid green; border-radius: 12px;">
                <q-card-section class="q-pa-lg row justify-between items-center">
                    <div>
                        <div class="text-subtitle1 text-bold">{{ dataR.status }}</div>
                        <div class="text-h4">{{ dataR.count }}</div>
                        <div class="text-caption">{{ dataR?.caption || 'Employee' }}</div>
                    </div> 
                    <div><q-icon name='post_add' size="30px" /></div>
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
const regular = ref(0)
const coTerminous = ref(0)
const elective = ref(0)

// eslint-disable-next-line no-unused-vars
const stats = ref([
    {
        title: 'Elective',
        value: elective,
        caption: 'Employee',
        color: '#C8E6C9',
        icon: 'how_to_vote',
    },
    {
        title: 'Appointed',
        value: 0,
        caption: 'Employee',
        color: '#FFF9C4',
        icon: 'assignment_ind',
    },
    {
        title: 'Co-Terminus',
        value: coTerminous,
        caption: 'Employee',
        color: '#BBDEFB',
        icon: 'hourglass_empty',
    },
    {
        title: 'Permanent',
        value: regular,
        caption: 'Employee',
        color: '#E1BEE7',
        icon: 'verified',
    },
    { title: 'Casual', value: 0, caption: 'Employee', color: '#FFCDD2', icon: 'work', },
    {
        title: 'Job Order',
        value: 0,
        caption: 'Employee',
        color: '#FFE0B2',
        icon: 'description',
    },
    {
        title: 'Honorarium',
        value: 0,
        caption: 'Employee',
        color: '#DCEDC8',
        icon: 'monetization_on',
    },
])

onMounted(async () => {
    dataR.value = await vwActiveStore.fetch_vwActive()
})
</script>

<style scoped>
/* Adjust statistics cards */
.stat-card {
    text-align: center;
    flex: 1;
    max-width: calc(100% / 7 - 8px);
    text-align: center;
    border-radius: 12px;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    padding: 16px;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}
</style>