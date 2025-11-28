<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Activity Log</b></h5>
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
          <template v-slot:body-cell-Description="props">
  <q-td :props="props" class="text-wrap" style="max-width: 300px;">
              {{ props.value }}
            </q-td>
          </template>
          <!-- Add body cell template for position -->
          <template v-slot:body-cell-created_at_formatted="props">
            <q-td :props="props" style="width: 250px; white-space: normal">
              <q-badge rounded class="bg-purple" outline>
                {{
                  new Date(props.value).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                }}
              </q-badge>
            </q-td>
          </template>
          <!-- Add body cell template for useragent -->
<template v-slot:body-cell-userAgent="props">
  <q-td :props="props" class="text-wrap" style="max-width: 250px;">
              {{ props.value }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useLogsStore } from 'stores/logsStore';

  const logStore = useLogsStore();

  const logs = ref([]);

  const columns = [
    // { name: 'id', label: 'User ID', field: 'id' },
    { name: 'log_name', label: 'Activity', field: 'log_name' },
    { name: 'Description', label: 'Description', field: 'Description' },
    // { name: 'position', label: 'Position', field: 'position' },
    { name: 'created_at_formatted', label: 'Date', field: 'created_at_formatted' },
    { name: 'userAgent', label: 'User Agent', field: 'userAgent' },
    { name: 'ip', label: 'IP Address', field: 'ip' },
  ];

  onMounted(async () => {
    await logStore.fetchLogs();
    logs.value = logStore.logs;
  
  });
</script>
<style>
.text-wrap {
  white-space: normal !important;
  word-wrap: break-word !important;
  word-break: break-all; /* optional */
}
</style>
