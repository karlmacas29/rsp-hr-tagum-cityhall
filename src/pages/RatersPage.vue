<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Raters</div>
        <q-btn color="primary" label="Add Rater" @click="addRater" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table flat bordered :rows="raters" :columns="columns" row-key="id" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const raters = ref([
  { id: 1, name: 'John Doe', position: 'Senior Rater' },
  { id: 2, name: 'Jane Smith', position: 'Junior Rater' },
])

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'position', label: 'Position', field: 'position', align: 'left' },
]

const addRater = () => {
  console.log('Add Rater Clicked')
}
</script>
