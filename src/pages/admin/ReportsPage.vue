<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Rater Management</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <template v-slot:separator>
            <q-icon size="1.2em" name="arrow_forward" />
          </template>
          <q-breadcrumbs-el icon="assignment_ind" label="Rater Management" />
          <q-breadcrumbs-el icon="assessment" label="Reports" />
        </q-breadcrumbs>
      </div>
    </div>
    <div>
      <q-table :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              round
              dense
              color="primary"
              icon="visibility"
              size="md"
              @click="$toast.success('This is a success toast!')"
            >
              <q-tooltip>View</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
  import { ref } from 'vue';

  const columns = ref([
    {
      name: 'plantilla_id',
      label: 'Plantilla Item ID',
      align: 'left',
      field: 'plantilla_id',
      sortable: true,
    },
    {
      name: 'office',
      label: 'Office',
      align: 'left',
      field: 'office',
      sortable: true,
    },
    {
      name: 'salary_grade',
      label: 'Salary Grade',
      align: 'left',
      field: 'salary_grade',
      sortable: true,
    },
    {
      name: 'position',
      label: 'Position',
      align: 'left',
      field: 'position',
      sortable: true,
    },
    {
      name: 'name',
      label: 'Name',
      align: 'left',
      field: 'name',
      sortable: true,
    },
    {
      name: 'actions',
      label: 'Actions',
      align: 'center',
      field: 'actions',
      sortable: false,
    },
  ]);

  const rows = ref([
    {
      plantilla_id: '1',
      office: 'City of Information',
      salary_grade: '10',
      position: 'Computer Programmer',
      name: 'Juan A. Reyes',
      actions: '',
    },
    {
      plantilla_id: '2',
      office: 'City of Information',
      salary_grade: '10',
      position: 'Computer Programmer',
      name: 'Maria E. Reyes',
      actions: '',
    },
    {
      plantilla_id: '3',
      office: 'City of Information',
      salary_grade: '10',
      position: 'System Analyst',
      name: 'Juan E. Reyes',
      actions: '',
    },
  ]);
</script>
