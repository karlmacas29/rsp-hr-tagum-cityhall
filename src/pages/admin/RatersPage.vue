<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Raters</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Raters" />
          <q-breadcrumbs-el class="text-bold" label="Raters Lists" />
          <!-- <q-breadcrumbs-el label="Breadcrumbs" /> -->
        </q-breadcrumbs>
      </div>
    </div>

    <q-card>
      <q-card-section class="row justify-between items-center">
        <div class="text-h5 text-bold">Raters List</div>
        <q-btn color="primary" label="Add Rater" @click="addRater" icon="add" />
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
