<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Activity Log</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Admins Log" />
        </q-breadcrumbs>
      </div>
    </div>
    <q-card>
      
      <q-card-section>
        <q-table 
          flat 
          bordered 
          :rows="logs" 
          :columns="columns" 
          row-key="id"
          :loading="logStore.loading"
        >
            <!-- Add body cell template for position -->
            <template v-slot:body-cell-date_performed="props">
              <q-td :props="props" style="width: 230px; white-space: normal;">
              <q-badge class="bg-teal" outline>
                {{ new Date(props.value).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }) }}
              </q-badge>
              </q-td>
            </template>
            <!-- Add body cell template for useragent -->
            <template v-slot:body-cell-user_agent="props">
              <q-td :props="props" style="width: 230px; white-space: normal;">
              {{ props.value }}
              </q-td>
            </template>
            

            <template v-slot:loading>
              <q-inner-loading showing color="primary">
                <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
              </q-inner-loading>
            </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useLogsStore } from 'stores/logsStore'; 

const logStore = useLogsStore()

const logs = ref([])

const columns = [
        { name: 'id', label: 'User ID', field: 'user_id' },
        { name: 'username', label: 'Username', field: 'username' },
        { name: 'actions', label: 'Action', field: 'actions' },
        { name: 'position', label: 'Position', field: 'position' },
        { name: 'date_performed', label: 'Date', field: 'date_performed' },
        { name: 'user_agent', label: 'User Agent', field: 'user_agent' },
        { name: 'ip_address', label: 'IP Address', field: 'ip_address' }
]

onMounted(async()=>{
  await logStore.fetchLogs()
  logs.value = logStore.logs
})
</script>
