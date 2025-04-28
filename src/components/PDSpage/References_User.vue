<template>
    <div class="q-pa-md">
        <q-table
            title="References"
            :rows="references"
            :columns="columns"
            row-key="name"
            class="my-sticky-header-table"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
    {
        name: 'name',
        required: true,
        label: 'Full Name',
        align: 'left',
        field: 'name',
        sortable: true
    },
    {
        name: 'address',
        align: 'left',
        label: 'Address',
        field: 'address',
        sortable: true
    },
    {
        name: 'contactNumber',
        align: 'left',
        label: 'Contact Number',
        field: 'contactNumber',
        sortable: true
    }
]

const references = ref([
    {
        name: 'John Doe',
        address: '123 Sample St., City',
        contactNumber: '+63 912 345 6789'
    },
    {
        name: 'Jane Smith',
        address: '456 Example Ave., Town',
        contactNumber: '+63 923 456 7890'
    }
])
</script>

<style scoped>
.my-sticky-header-table {
    /* height or max-height is important */
    max-height: 400px;
}
</style>