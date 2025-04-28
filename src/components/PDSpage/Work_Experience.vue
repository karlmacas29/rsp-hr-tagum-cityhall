<template>
    <div class="q-pa-md">
        <q-table
            title="Work Experience"
            :rows="workExperienceData"
            :columns="columns"
            row-key="id"
            
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
    {
        name: 'fromDate',
        label: 'From',
        field: 'fromDate',
        align: 'left',
        format: (val) => new Date(val).toLocaleDateString('en-PH')
    },
    {
        name: 'toDate',
        label: 'To',
        field: 'toDate',
        align: 'left',
        format: (val) => new Date(val).toLocaleDateString('en-PH')
    },
    {
        name: 'positionTitle',
        label: 'Position Title',
        field: 'positionTitle',
        align: 'left'
    },
    {
        name: 'department',
        label: 'Department',
        field: 'department',
        align: 'left'
    },
    {
        name: 'monthlySalary',
        label: 'Monthly Salary',
        field: 'monthlySalary',
        align: 'right',
        format: (val) => val.toLocaleString("en-PH", { style: 'currency', currency: 'PHP' })
    },
    {
        name: 'salaryGrade',
        label: 'Salary Grade',
        field: 'salaryGrade',
        align: 'left'
    },
    {
        name: 'appointmentStatus',
        label: 'Status of Appointment',
        field: 'appointmentStatus',
        align: 'left'
    },
    {
        name: 'govtService',
        label: "Gov't Service",
        field: 'govtService',
        align: 'left'
    }
]

// Sample data
const workExperienceData = ref([
    {
        id: 1,
        fromDate: '2020-01-01',
        toDate: '2023-06-30',
        positionTitle: 'Administrative Officer',
        department: 'Human Resources',
        monthlySalary: 45000,
        salaryGrade: '16-1',
        appointmentStatus: 'Regular',
        govtService: 'Yes'
    },
    // Add more sample data as needed
])
</script>

<style scoped>
.q-table__title {
    font-weight: bold;
}
</style>