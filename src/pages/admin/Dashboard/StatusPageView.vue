<template>
  <q-page padding>
    <q-btn color="black" round icon="arrow_back" @click="onClick" />
    <h3 style="text-transform: capitalize">{{ route.params.title }}</h3>

    <!-- Separate search inputs for each column -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h6 q-mb-sm">Name</div>
        <q-input v-model="nameSearch" dense outlined placeholder="Search Name">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col">
        <div class="text-h6 q-mb-sm">Office</div>
        <q-input v-model="officeSearch" dense outlined placeholder="Search Office">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col">
        <div class="text-h6 q-mb-sm">Position</div>
        <q-input v-model="positionSearch" dense outlined placeholder="Search Position">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      title="Employee Status"
      :rows="filteredRows"
      :columns="columns"
      row-key="name"
      v-model:pagination="pagination"
      :loading="useStatus.loading"
    >
      <!-- Add body cell template for position -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props" style="width: 230px; white-space: normal">
          {{ props.value }}
        </q-td>
      </template>
      <template v-slot:body-cell-office="props">
        <q-td :props="props" style="width: 230px; white-space: normal">
          {{ props.value }}
        </q-td>
      </template>
      <template v-slot:body-cell-position="props">
        <q-td :props="props" style="width: 230px; white-space: normal">
          {{ props.value }}
        </q-td>
      </template>

      <!-- <template v-slot:loading>
              <q-inner-loading showing color="primary">
                <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
              </q-inner-loading>
            </template> -->
    </q-table>
  </q-page>
</template>

<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { onMounted, ref, computed } from 'vue';
  import { use_vwActiveStore } from 'stores/vwActiveStore';

  const route = useRoute();
  const router = useRouter();
  const useStatus = use_vwActiveStore();

  const statusMapping = {
    Permanent: 'Regular',
    Elective: 'Elective',
    Appointed: 'Appointed',
    'Co-Terminous': 'Co-Terminous',
    Temporary: 'Temporary',
    Casual: 'Casual',
    'Job Order': 'Job Order',
    Honorarium: 'Honorarium',
  };

  const statusName = statusMapping[route.params.name] || route.params.name;

  const columns = [
    {
      name: 'name',
      required: true,
      label: 'Name',
      align: 'left',
      field: 'Name1',
      sortable: true,
    },
    {
      name: 'office',
      required: true,
      label: 'Office',
      align: 'left',
      field: 'Office',
      sortable: true,
    },
    {
      name: 'position',
      required: true,
      label: 'Position',
      align: 'left',
      field: 'Designation',
      sortable: true,
    },
  ];

  const rows = ref([]);

  const pagination = ref({
    sortBy: 'name',
    descending: false,
    page: 1,
    rowsPerPage: 10,
  });

  const onClick = () => {
    router.back();
  };

  // Replace searchText with three separate search refs
  const nameSearch = ref('');
  const officeSearch = ref('');
  const positionSearch = ref('');

  // Update filteredRows computed property
  const filteredRows = computed(() => {
    const nameTerm = nameSearch.value.toLowerCase();
    const officeTerm = officeSearch.value.toLowerCase();
    const positionTerm = positionSearch.value.toLowerCase();

    return rows.value.filter((row) => {
      const nameMatch = !nameTerm || row.Name1.toLowerCase().includes(nameTerm);
      const officeMatch = !officeTerm || row.Office.toLowerCase().includes(officeTerm);
      const positionMatch = !positionTerm || row.Designation.toLowerCase().includes(positionTerm);

      return nameMatch && officeMatch && positionMatch;
    });
  });

  onMounted(async () => {
    await useStatus.fetchStatus(statusName);
    rows.value = useStatus.vw_status;
  });
</script>
