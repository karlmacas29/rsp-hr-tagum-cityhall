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
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" style="white-space: normal; word-wrap: break-word">
              {{ props.row.actions }}
            </q-td>
          </template>
          <!-- Add body cell template for position -->
          <template v-slot:body-cell-date_performed="props">
            <q-td :props="props" style="width: 230px; white-space: normal">
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
          <template v-slot:body-cell-user_agent="props">
            <q-td :props="props" style="width: 230px; white-space: normal">
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
    { name: 'id', label: 'User ID', field: 'user_id' },
    { name: 'username', label: 'Username', field: 'username' },
    { name: 'actions', label: 'Action', field: 'actions' },
    { name: 'position', label: 'Position', field: 'position' },
    { name: 'date_performed', label: 'Date', field: 'date_performed' },
    { name: 'user_agent', label: 'User Agent', field: 'user_agent' },
    { name: 'ip_address', label: 'IP Address', field: 'ip_address' },
  ];

  onMounted(async () => {
    await logStore.fetchLogs();
    logs.value = logStore.logs;
  });
</script>
