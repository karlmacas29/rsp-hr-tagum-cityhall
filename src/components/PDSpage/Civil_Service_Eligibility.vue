<template>
    <div class="q-pa-md">
        <q-table
            title="Civil Service Eligibility"
            :rows="eligibilityData"
            :columns="columns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
    { name: 'eligibility', label: 'Eligibility', field: 'eligibility', sortable: true },
    { name: 'rating', label: 'Rating (If Applicable)', field: 'rating', sortable: true },
    { name: 'examDate', label: 'Date of Examination', field: 'examDate', sortable: true },
    { name: 'examPlace', label: 'Place of Examination', field: 'examPlace', sortable: true },
    { name: 'licenseNumber', label: 'License Number', field: 'licenseNumber', sortable: true },
    { name: 'validityDate', label: 'Date of Validity', field: 'validityDate', sortable: true }
]

const eligibilityData = ref([])
</script>
