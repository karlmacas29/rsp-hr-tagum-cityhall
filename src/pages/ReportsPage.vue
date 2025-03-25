<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Raters Report</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <q-breadcrumbs-el class="text-bold" label="Home" />
          <q-breadcrumbs-el class="text-bold" label="Report Lists" />
          <!-- <q-breadcrumbs-el label="Breadcrumbs" /> -->
        </q-breadcrumbs>
      </div>
    </div>
    <div>
      <q-table :rows="rows" :columns="columns" row-key="name" flat bordered>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-icon :name="props.value === 'Active' ? 'check_circle' : 'cancel'"
              :color="props.value === 'Active' ? 'positive' : 'negative'" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ReportsPage',
  data() {
    return {
      columns: [
        {
          name: 'plantilla_id',
          label: 'Plantilla Item ID',
          align: 'left',
          field: 'plantilla_id'
        },
        {
          name: 'office',
          label: 'Office',
          align: 'left',
          field: 'office'
        },
        {
          name: 'salary_grade',
          label: 'Salary Grade',
          align: 'left',
          field: 'salary_grade'
        },
        {
          name: 'position',
          label: 'Position',
          align: 'left',
          field: 'position'
        },
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: 'name'
        },
        {
          name: 'status',
          label: 'Status',
          align: 'center',
          field: 'status'
        }
      ],
      rows: [
        {
          plantilla_id: '1',
          office: 'City of Information',
          salary_grade: '10',
          position: 'Computer Programmer',
          name: 'Juan A. Reyes',
          status: 'Active'
        },
        {
          plantilla_id: '2',
          office: 'City of Information',
          salary_grade: '10',
          position: 'Computer Programmer',
          name: 'Maria E. Reyes',
          status: 'Active'
        },
        {
          plantilla_id: '3',
          office: 'City of Information',
          salary_grade: '10',
          position: 'System Analyst',
          name: 'Juan E. Reyes',
          status: 'Active'
        }
      ]
    }
  }
}
</script>
