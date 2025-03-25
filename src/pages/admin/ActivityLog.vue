<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Activity Log</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table flat bordered :rows="logs" :columns="columns" row-key="id" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const logs = ref([
  { id: 1, action: 'User logged in', timestamp: '2025-03-17 10:00 AM' },
  { id: 2, action: 'Admin updated job post', timestamp: '2025-03-17 11:30 AM' },
])

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'action', label: 'Action', field: 'action', align: 'left' },
  { name: 'timestamp', label: 'Timestamp', field: 'timestamp', align: 'left' },
]
</script>
