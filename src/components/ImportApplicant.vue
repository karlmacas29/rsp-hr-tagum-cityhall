<template>
  <q-dialog v-model="isVisible" persistent @update:model-value="handleVisibilityChange" maximized>
    <q-card style="width: 90vw; max-width: 1000px; height: 85vh">
      <!-- Header -->
      <q-card-section class="row items-center bg-primary text-white q-pa-md">
        <q-icon name="person_add" size="lg" class="q-mr-md" />
        <div>
          <div class="text-h6 text-bold">Import Previous Applicants</div>
          <div class="text-caption">{{ currentPosition }}</div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="white" />
      </q-card-section>

      <!-- Content -->
      <q-card-section class="q-pa-md scroll" style="height: calc(100% - 140px); overflow-y: auto">
        <!-- Loading State -->
        <div v-if="jobPostStore.previousApplicantsLoading" class="text-center q-pa-lg">
          <q-spinner color="primary" size="50px" />
          <div class="q-mt-md text-grey-6">Loading previous applicants...</div>
        </div>

        <template v-else>
          <!-- Search and Filter Section -->
          <div class="row items-center justify-between q-mb-lg gap-md">
            <div class="col-auto">
              <q-input
                v-model="searchQuery"
                placeholder="Search by name, email..."
                dense
                outlined
                rounded
                class="search-input"
                style="width: 300px"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
                <template #append>
                  <q-icon
                    v-if="searchQuery"
                    name="close"
                    @click="searchQuery = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>

            <div class="col-auto">
              <q-select
                v-model="selectedStatus"
                :options="statusOptions"
                label="Filter by Status"
                dense
                outlined
                rounded
                clearable
                emit-value
                map-options
                style="width: 200px"
              />
            </div>

            <div class="col-auto">
              <q-badge class="q-pa-md" color="primary" text-color="white">
                <q-icon name="check_circle" class="q-mr-xs" />
                Selected:
                <strong>{{ selectedApplicants.length }}</strong>
                /{{ filteredApplicants.length }}
              </q-badge>
            </div>
          </div>

          <!-- Stats Info -->
          <div class="row q-mb-md gap-md">
            <q-chip
              color="blue-1"
              text-color="blue-9"
              icon="people"
              label="Total Available"
              size="sm"
            >
              <strong>{{ jobPostStore.previousApplicants.length }}</strong>
            </q-chip>
            <q-chip
              color="green-1"
              text-color="green-9"
              icon="filter_alt"
              label="Filtered Results"
              size="sm"
            >
              <strong>{{ filteredApplicants.length }}</strong>
            </q-chip>
            <q-chip
              v-if="selectedApplicants.length > 0"
              color="orange-1"
              text-color="orange-9"
              icon="done_all"
              label="Selected"
              size="sm"
            >
              <strong>{{ selectedApplicants.length }}</strong>
            </q-chip>
          </div>

          <!-- Select All Checkbox -->
          <div class="q-mb-md">
            <q-checkbox
              v-model="selectAll"
              label="Select All Filtered Applicants"
              @update:model-value="toggleSelectAll"
              color="primary"
              size="lg"
            />
          </div>

          <!-- Empty State -->
          <div v-if="filteredApplicants.length === 0" class="text-center q-pa-lg">
            <q-icon name="person_outline" size="4em" color="grey-3" />
            <p class="text-h6 text-grey-6 q-mt-md">No applicants found</p>
            <p v-if="jobPostStore.previousApplicants.length > 0" class="text-caption text-grey-5">
              Try adjusting your search or filter criteria
            </p>
            <p v-else class="text-caption text-grey-5">No previous applicants available</p>
          </div>

          <!-- Applicants Table -->
          <q-table
            v-else
            :rows="filteredApplicants"
            :columns="columns"
            row-key="id"
            flat
            bordered
            dense
            separator="cell"
            class="applicants-import-table"
            :pagination="{ rowsPerPage: 10 }"
          >
            <!-- Select Column -->
            <template #body-cell-select="props">
              <q-td :props="props" class="text-center">
                <q-checkbox
                  :model-value="selectedApplicants.includes(props.row.id)"
                  @update:model-value="toggleApplicantSelection(props.row.id)"
                  color="primary"
                />
              </q-td>
            </template>

            <!-- ID Column -->
            <template #body-cell-id="props">
              <q-td :props="props" class="text-center">
                <span class="text-caption text-grey-6">
                  {{ props.row.id || props.row.ControlNo }}
                </span>
              </q-td>
            </template>

            <!-- Name Column with Avatar -->
            <template #body-cell-name="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-avatar
                    v-if="props.row.image_url"
                    :src="props.row.image_url"
                    size="40px"
                    class="q-mr-md"
                    @error="onImageError"
                  />
                  <q-avatar v-else color="primary" text-color="white" size="40px" class="q-mr-md">
                    {{ getInitials(props.row.firstname, props.row.lastname) }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold">
                      {{ props.row.firstname }} {{ props.row.lastname }}
                      <span v-if="props.row.name_extension" class="text-grey-6">
                        {{ props.row.name_extension }}
                      </span>
                    </div>
                    <div class="text-caption text-grey-6">{{ props.row.email }}</div>
                  </div>
                </div>
              </q-td>
            </template>

            <!-- Status Column -->
            <template #body-cell-status="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  rounded
                  :color="getStatusColor(props.row.previousStatus)"
                  :text-color="getStatusTextColor(props.row.previousStatus)"
                  class="text-caption q-px-md"
                >
                  {{ props.row.previousStatus }}
                </q-badge>
              </q-td>
            </template>

            <!-- Source Column -->
            <template #body-cell-source="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  rounded
                  :color="props.row.source === 'Internal' ? 'blue-2' : 'orange-2'"
                  :text-color="props.row.source === 'Internal' ? 'blue-9' : 'orange-9'"
                  class="text-caption q-px-md"
                >
                  <q-icon
                    :name="props.row.source === 'Internal' ? 'business' : 'person'"
                    class="q-mr-xs"
                  />
                  {{ props.row.source }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </template>
      </q-card-section>

      <!-- Footer -->
      <q-card-section class="row items-center justify-between q-pa-md bg-grey-1 border-top">
        <div class="text-caption text-grey-7">
          <strong>{{ selectedApplicants.length }}</strong>
          applicant(s) selected for import
        </div>
        <div class="row items-center gap-sm">
          <q-btn
            label="Cancel"
            color="grey"
            flat
            rounded
            padding="sm md"
            @click="handleClose"
            :disable="jobPostStore.previousApplicantsLoading"
          />
          <q-btn
            label="Import Selected"
            color="primary"
            unelevated
            rounded
            padding="sm md"
            @click="handleImport"
            icon-right="file_download"
            :disable="selectedApplicants.length === 0 || jobPostStore.previousApplicantsLoading"
            :loading="jobPostStore.previousApplicantsLoading"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { toast } from 'src/boot/toast';

  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    currentJobId: {
      type: [String, Number],
      required: true,
    },
    currentPosition: {
      type: String,
      default: 'Unknown Position',
    },
  });

  const emit = defineEmits(['update:show', 'imported', 'close']);

  const jobPostStore = useJobPostStore();

  // State
  const isVisible = ref(false);
  const searchQuery = ref('');
  const selectedStatus = ref(null);
  const selectedApplicants = ref([]);
  const selectAll = ref(false);

  // Status filter options
  const statusOptions = [
    { label: 'Qualified', value: 'Qualified' },
    { label: 'Unqualified', value: 'Unqualified' },
    { label: 'Pending', value: 'Pending' },
  ];

  // Table columns
  const columns = [
    {
      name: 'select',
      label: 'Select',
      field: 'select',
      align: 'center',
      style: 'width: 60px',
      headerStyle: 'width: 60px',
    },
    {
      name: 'id',
      label: 'Applicant ID',
      field: 'id',
      align: 'center',
      style: 'width: 80px',
      headerStyle: 'width: 80px',
    },
    {
      name: 'name',
      label: 'Name',
      field: 'name',
      align: 'left',
      sortable: true,
    },
    {
      name: 'status',
      label: 'Previous Status',
      field: 'status',
      align: 'center',
      sortable: true,
    },
    {
      name: 'source',
      label: 'Source',
      field: 'source',
      align: 'center',
      sortable: true,
    },
  ];

  // Computed property using store data
  const filteredApplicants = computed(() => {
    let results = jobPostStore.previousApplicants;

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      results = results.filter(
        (applicant) =>
          (applicant.firstname && applicant.firstname.toLowerCase().includes(query)) ||
          (applicant.lastname && applicant.lastname.toLowerCase().includes(query)) ||
          (applicant.email && applicant.email.toLowerCase().includes(query)),
      );
    }

    // Filter by status
    if (selectedStatus.value && selectedStatus.value.trim() !== '') {
      results = results.filter((applicant) => {
        const appStatus = applicant.previousStatus?.trim();
        const filterStatus = selectedStatus.value?.trim();
        return appStatus === filterStatus;
      });
    }

    return results;
  });

  // Helper functions
  const getInitials = (firstname, lastname) => {
    const first = firstname ? firstname.charAt(0).toUpperCase() : '';
    const last = lastname ? lastname.charAt(0).toUpperCase() : '';
    return first + last;
  };

  const getStatusColor = (status) => {
    if (!status) return 'grey-2';
    const normalizedStatus = status.toLowerCase().trim();
    switch (normalizedStatus) {
      case 'qualified':
        return 'green-2';
      case 'unqualified':
        return 'red-2';
      case 'pending':
        return 'orange-2';
      default:
        return 'grey-2';
    }
  };

  const getStatusTextColor = (status) => {
    if (!status) return 'grey-9';
    const normalizedStatus = status.toLowerCase().trim();
    switch (normalizedStatus) {
      case 'qualified':
        return 'green-9';
      case 'unqualified':
        return 'red-9';
      case 'pending':
        return 'orange-9';
      default:
        return 'grey-9';
    }
  };

  const onImageError = (event) => {
    event.target.style.display = 'none';
  };

  // Selection methods
  const toggleApplicantSelection = (applicantId) => {
    const index = selectedApplicants.value.indexOf(applicantId);
    if (index > -1) {
      selectedApplicants.value.splice(index, 1);
    } else {
      selectedApplicants.value.push(applicantId);
    }
    updateSelectAllCheckbox();
  };

  const toggleSelectAll = () => {
    if (selectAll.value) {
      selectedApplicants.value = filteredApplicants.value.map((a) => a.id);
    } else {
      selectedApplicants.value = [];
    }
  };

  const updateSelectAllCheckbox = () => {
    selectAll.value =
      filteredApplicants.value.length > 0 &&
      selectedApplicants.value.length === filteredApplicants.value.length;
  };

  // ✅ UPDATED: Load applicants (fetch every time, no cache check)
  const loadPreviousApplicants = async () => {
    if (!props.currentJobId) {
      console.error('Current Job ID is required');
      toast.error('Job ID is missing');
      return;
    }

    try {
      console.log('Loading previous applicants for job ID:', props.currentJobId);
      await jobPostStore.fetchPreviousApplicants(props.currentJobId);
      console.log('Loaded:', jobPostStore.previousApplicants.length, 'applicants');
    } catch (error) {
      console.error('Error loading applicants:', error);
    }
  };

  // Import applicants
  const handleImport = async () => {
    if (selectedApplicants.value.length === 0) {
      toast.warning('Please select at least one applicant to import');
      return;
    }

    try {
      const selectedData = jobPostStore.previousApplicants.filter((a) =>
        selectedApplicants.value.includes(a.id),
      );

      console.log('Importing', selectedData.length, 'applicants');
      await jobPostStore.importApplicants(props.currentJobId, selectedData);

      emit('imported', selectedData);
      handleClose();
    } catch (error) {
      console.error('Error importing applicants:', error);
    }
  };

  // ✅ UPDATED: Handle visibility changes - always fetch when opened
  const handleVisibilityChange = (newValue) => {
    console.log('Dialog visibility changed to:', newValue);
    isVisible.value = newValue;

    if (newValue) {
      // ✅ ALWAYS load data when modal opens
      console.log('Modal opened, loading data...');
      loadPreviousApplicants();
    } else {
      console.log('Modal closed, emitting update:show false');
      emit('update:show', false);
    }
  };

  const handleClose = () => {
    console.log('Handle close called');
    isVisible.value = false;
    selectedApplicants.value = [];
    selectAll.value = false;
    searchQuery.value = '';
    selectedStatus.value = null;
    emit('update:show', false);
    emit('close');
  };

  // ✅ UPDATED: Watch show prop - always fetch
  watch(
    () => props.show,
    (newValue) => {
      console.log('Props.show watcher - newValue:', newValue, 'isVisible:', isVisible.value);
      if (newValue !== isVisible.value) {
        isVisible.value = newValue;
        if (newValue) {
          // ✅ ALWAYS load when show becomes true
          console.log('Loading data from show watcher');
          loadPreviousApplicants();
        }
      }
    },
  );

  // ✅ UPDATED: Reset on job ID change
  watch(
    () => props.currentJobId,
    (newJobId) => {
      console.log('Job ID changed to:', newJobId);
      if (newJobId) {
        jobPostStore.clearPreviousApplicants();
        selectedApplicants.value = [];
        selectAll.value = false;

        if (isVisible.value) {
          console.log('Job ID changed and modal is open, reloading...');
          loadPreviousApplicants();
        }
      }
    },
  );
</script>

<style scoped>
  .search-input {
    transition: all 0.3s ease;
  }

  .search-input:focus-within {
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }

  .applicants-import-table {
    background-color: white;
    border-radius: 4px;
  }

  .applicants-import-table tbody tr {
    transition: background-color 0.2s ease;
  }

  .applicants-import-table tbody tr:hover {
    background-color: #f5f5f5;
  }

  .gap-md {
    gap: 16px;
  }

  .gap-sm {
    gap: 8px;
  }

  .border-top {
    border-top: 1px solid #e0e0e0;
  }

  .scroll::-webkit-scrollbar {
    width: 8px;
  }

  .scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .scroll::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  .scroll::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
