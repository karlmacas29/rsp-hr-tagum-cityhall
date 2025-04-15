<template>
  <q-card>
    <q-table
      :rows="filteredJobs"
      :columns="columns"
      row-key="position"
      :pagination="pagination"
      class="my-sticky-header-table"
      flat
      bordered
      :grid="$q.screen.lt.md"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div class="column">
              <div>{{ col.label }}</div>
              <q-input
                v-if="col.searchable !== false && col.name !== 'action'"
                v-model="localSearchFilters[col.name]"
                dense
                outlined
                clearable
                class="q-mt-xs"
                :placeholder="`Search ${col.label}`"
                @update:model-value="handleSearchInput(col.name, $event)"
              />
            </div>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            round
            dense
            color="primary"
            icon="visibility"
            @click="$emit('view-job-details', props.row)"
            size="sm"
          >
            <q-tooltip>View Details</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered class="job-card">
            <q-card-section>
              <div class="text-h6">{{ props.row.position }}</div>
              <div class="text-subtitle2">Posted: {{ formatDate(props.row.postingDate) }}</div>
            </q-card-section>

            <q-separator />

            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label caption class="text-bold">Applicants</q-item-label>
                  <q-item-label>{{ props.row.applicants }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Pending</q-item-label>
                  <q-item-label>{{ props.row.pending }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Qualified</q-item-label>
                  <q-item-label>{{ props.row.qualified }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Unqualified</q-item-label>
                  <q-item-label>{{ props.row.unqualified }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                flat
                round
                color="primary"
                icon="visibility"
                @click="$emit('view-job-details', props.row)"
              >
                <q-tooltip>View Details</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { date } from 'quasar'

const { formatDate } = date

const props = defineProps({
  filteredJobs: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  pagination: {
    type: Object,
    required: true
  },
  searchFilters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:searchFilters', 'view-job-details'])

const localSearchFilters = ref({...props.searchFilters})

watch(localSearchFilters, (newFilters) => {
  emit('update:searchFilters', newFilters)
}, { deep: true })

const handleSearchInput = (fieldName, value) => {
  localSearchFilters.value[fieldName] = value
}
</script>

<style scoped>
.job-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.job-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
