<template>
    <div class="q-pa-md">
        <q-table
            title="Learning and Development (L&D) Interventions"
            :rows="ldData"
            :columns="columns"
            row-key="title"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
    {
        name: 'title',
        label: 'Title',
        field: 'title',
        align: 'left',
    },
    {
        name: 'fromDate',
        label: 'From',
        field: 'fromDate',
        format: (val) => new Date(val).toLocaleDateString(),
        align: 'left',
    },
    {
        name: 'toDate',
        label: 'To',
        field: 'toDate',
        format: (val) => new Date(val).toLocaleDateString(),
        align: 'left',
    },
    {
        name: 'hours',
        label: 'Number of Hours',
        field: 'hours',
        align: 'left',
    },
    {
        name: 'type',
        label: 'Type',
        field: 'type',
        align: 'left',
    },
    {
        name: 'conductor',
        label: 'Conducted/Sponsored By',
        field: 'conductor',
        align: 'left',
    }
]

const ldData = ref([
    {
        title: 'Web Development Training',
        fromDate: '2023-01-01',
        toDate: '2023-01-05',
        hours: 40,
        type: 'Technical',
        conductor: 'IT Department'
    },
    // Add more data as needed
])
</script>

<style scoped>
.text-h6 {
    color: #666;
}
</style>