<template>
    <div class="q-pa-md">
        <q-table
            title="Voluntary Work"
            :rows="rows"
            :columns="columns"
            row-key="name"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
    {
        name: 'organization',
        required: true,
        label: 'Name and Address of Organization',
        align: 'left',
        field: row => row.organization,
        format: val => `${val}`,
    },
    {
        name: 'fromDate',
        align: 'left',
        label: 'From',
        field: 'fromDate',
        format: val => new Date(val).toLocaleDateString(),
    },
    {
        name: 'toDate',
        align: 'left',
        label: 'To',
        field: 'toDate',
        format: val => new Date(val).toLocaleDateString(),
    },
    {
        name: 'hours',
        align: 'left',
        label: 'Number of Hours',
        field: 'hours',
    },
    {
        name: 'position',
        align: 'left',
        label: 'Position',
        field: 'position',
    }
]

const rows = ref([
    {
        organization: 'Red Cross Tagum City Chapter',
        fromDate: '2023-01-01',
        toDate: '2023-12-31',
        hours: 40,
        position: 'Volunteer'
    },
    // Add more rows as needed
])
</script>

<style scoped>
/* Add custom styles if needed */
</style>