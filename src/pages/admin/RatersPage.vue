<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Rater Management</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <template v-slot:separator>
            <q-icon size="1. 2em" name="arrow_forward" />
          </template>
          <q-breadcrumbs-el label="Rater Management" icon="assignment_ind" />
          <q-breadcrumbs-el label="Raters" icon="groups" />
        </q-breadcrumbs>
      </div>
    </div>
    <!-- Card -->
    <q-card>
      <q-card-section class="row justify-between items-center">
        <div>
          <q-input
            dense
            outlined
            v-model="globalSearch"
            placeholder="Search all raters..."
            clearable
            :disable="isLoadingTable"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="globalSearch !== ''"
                name="clear"
                class="cursor-pointer"
                @click="globalSearch = ''"
              />
            </template>
          </q-input>
        </div>
        <div v-if="authStore.user?.permissions?.modifyRater === '1'">
          <q-btn
            rounded
            color="primary"
            label="Add Rater"
            @click="showAddModal"
            icon="add"
            :disable="isLoadingTable"
          />
        </div>
      </q-card-section>
      <q-separator />

      <q-card-section>
        <q-table
          flat
          bordered
          :rows="filteredRaters"
          :columns="columns"
          row-key="id"
          :loading="isLoadingTable"
          loading-label="Loading raters..."
          no-data-label="No raters found"
        >
          <template v-slot:body-cell-job_batches_rsp="props">
            <q-td :props="props">
              <div class="position-cell">
                <q-badge
                  v-for="(pos, index) in props.row.job_batches_rsp_array"
                  :key="index"
                  color="primary"
                  text-color="white"
                  class="q-pa-xs q-mb-xs badge-block"
                >
                  {{ pos.position }}
                </q-badge>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-Office="props">
            <q-td :props="props">
              <div style="white-space: normal; overflow-wrap: break-word">
                {{ props.row.office }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-active="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.active ? 'green' : 'red'"
                :label="props.row.active ? 'Active' : 'Inactive'"
                class="q-pa-xs"
              />
            </q-td>
          </template>

          <!-- Actions column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                @click="viewRater(props.row)"
                color="info"
                class="bg-blue-1"
                :disable="isLoadingTable"
              >
                <q-tooltip>View</q-tooltip>
              </q-btn>
              <template v-if="authStore.user?.permissions?.modifyRater === '1'">
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  @click="editRater(props.row)"
                  class="q-ml-sm bg-teal-1"
                  color="positive"
                  :disable="isLoadingTable"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
              </template>
            </q-td>
          </template>

          <template v-slot:no-data="{ icon, message, filter }">
            <div class="full-width row flex-center q-gutter-sm text-grey" style="padding: 60px 0">
              <q-icon size="2em" :name="filter ? 'filter_alt_off' : icon || 'inbox'" />
              <span>
                {{
                  filter ? 'No raters match your search criteria' : message || 'No raters available'
                }}
              </span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Add/Edit Rater Modal -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section class="row items-center justify-between bg-primary text-white">
          <div class="text-h4">
            <b>{{ isEditMode ? 'Edit Rater' : 'Add a Rater' }}</b>
          </div>
          <q-btn icon="close" flat round dense @click="closeModal" />
        </q-card-section>

        <q-card-section>
          <q-banner v-if="showError" class="bg-red-2 text-red-10 q-mb-md">
            Please fill in all required fields.
          </q-banner>

          <!-- Select Positions -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-medium">Select Job Positions to Rate</div>
            <q-select
              v-model="selectedPositions"
              multiple
              :options="positionsWithAllOption"
              option-value="id"
              option-label="name"
              label="Select one or more positions"
              outlined
              dense
              use-chips
              emit-value
              map-options
              @update:model-value="handlePositionSelection"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-checkbox
                      :model-value="isPositionSelected(scope.opt.id)"
                      @update:model-value="(val) => togglePosition(scope.opt.id, val)"
                      @click.
                      stop
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Add Mode: Select Office FIRST, then Select Rater -->
          <template v-if="!isEditMode">
            <div class="q-mb-md">
              <q-select
                v-model="selectedOffice"
                :options="offices"
                option-label="label"
                option-value="value"
                label="Select an office"
                outlined
                dense
                emit-value
                map-options
                @update:model-value="handleOfficeChange"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-select>
            </div>

            <div class="q-mb-md">
              <div class="text-subtitle2 text-weight-medium">Select Rater</div>
              <q-select
                v-model="selectedRater"
                :options="filteredRatersByOffice"
                option-value="id"
                option-label="name"
                label="Search and select rater"
                use-input
                input-debounce="300"
                outlined
                dense
                emit-value
                map-options
                :loading="isLoadingRaters"
                :disable="!selectedOffice"
                @filter="filterRatersByOffice"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No raters found in this office
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Add/Edit: Toggle active/inactive -->
            <div class="q-mb-md">
              <q-toggle
                v-model="activeStatus"
                :true-value="true"
                :false-value="false"
                color="green"
                checked-icon="check"
                unchecked-icon="block"
              />
              <span class="text-body1 q-ml-sm" :class="activeStatus ? 'text-green' : 'text-red'">
                {{ activeStatus ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </template>

          <!-- Edit Mode: Display Rater + Office (name-only) -->
          <template v-else>
            <!-- Select Office in Edit Mode (name-only) -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-weight-medium">Select Office</div>
              <q-select
                v-model="selectedOffice"
                :options="offices"
                option-label="label"
                option-value="value"
                label="Select an office"
                outlined
                dense
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
                <template v-slot:append></template>
              </q-select>
            </div>

            <q-separator class="q-mt-md q-mb-md" />

            <!-- Display Rater in Edit Mode (readonly) -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-weight-medium">Rater</div>
              <q-select
                outlined
                dense
                readonly
                :model-value="currentRaterName"
                :options="currentOfficeRaters"
                option-value="id"
                option-label="name"
                label="Current Rater"
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
                <template v-slot:append>
                  <q-icon name="lock" size="xs" />
                </template>
              </q-select>
              <div class="text-caption text-grey q-mt-sm">
                <q-icon name="info" size="xs" class="q-mr-xs" />
                Rater name cannot be changed
              </div>
            </div>

            <!-- Add/Edit: Toggle active/inactive -->
            <div class="q-mb-md">
              <q-toggle
                v-model="activeStatus"
                :true-value="true"
                :false-value="false"
                color="green"
                checked-icon="check"
                unchecked-icon="block"
              />
              <span class="text-body1 q-ml-sm" :class="activeStatus ? 'text-green' : 'text-red'">
                {{ activeStatus ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </template>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn rounded flat label="Cancel" color="negative" @click="closeModal" />
          <q-btn
            rounded
            :label="isEditMode ? 'Update Rater' : 'Add Rater'"
            color="primary"
            @click="isEditMode ? updateRater() : addRater()"
            :loading="isSubmitting"
            :disable="isEditMode ? false : !selectedRater || !selectedOffice"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Delete</div>
        </q-card-section>

        <q-card-section>Are you sure you want to delete this rater?</q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteRater" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- View Rater Dialog -->
    <q-dialog v-model="showViewDialog" persistent>
      <q-card style="width: 800px; max-width: 95vw; display: flex; flex-direction: column">
        <q-card-section class="bg-grey-2 q-px-lg q-py-md sticky-header">
          <div class="text-h6">Jobs to Rate</div>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            class="absolute-top-right q-mt-sm q-mr-sm"
          />
        </q-card-section>

        <q-card-section class="q-px-lg sticky-info">
          <div class="row q-col-gutter-md">
            <div class="col">
              <div class="text-subtitle1 q-mb-sm">
                <strong>Rater:</strong>
                {{ currentViewRater.name }}
              </div>
              <div class="text-subtitle1 q-mb-sm">
                <strong>Office:</strong>
                {{ currentViewRater.office }}
              </div>
            </div>
            <div class="col-auto">
              <q-input
                outlined
                v-model="jobSearch"
                placeholder="Search jobs..."
                dense
                clearable
                style="width: 250px"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md q-mx-md scrollable-content">
          <!-- Loading state -->
          <div v-if="isLoadingJobs" class="flex flex-center q-py-xl">
            <q-spinner size="50px" color="primary" />
            <div class="q-ml-md">Loading assigned jobs...</div>
          </div>

          <!-- Error state -->
          <div v-else-if="jobLoadError" class="flex flex-center q-py-xl">
            <q-icon name="error" size="40px" color="negative" />
            <div class="q-ml-md text-negative">{{ jobLoadError }}</div>
          </div>

          <!-- Jobs table -->
          <q-table
            v-else
            flat
            bordered
            :rows="filteredJobs"
            :columns="jobColumns"
            row-key="id"
            :pagination="pagination"
            class="sticky-header-table no-horizontal-scroll"
            wrap-cells
            virtual-scroll
          >
            <template v-slot:body-cell-position="props">
              <q-td :props="props" class="position-column">
                <div class="full-position-text" :title="props.row.Position">
                  {{ props.row.Position }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-office="props">
              <q-td :props="props" class="office-column">
                <div class="full-office-text" :title="props.row.Office">
                  {{ props.row.Office }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-applicant="props">
              <q-td :props="props" class="text-center">
                <div class="text-grey-9">
                  {{ props.row.applicant }}
                  <q-icon name="people" size="xs" class="q-ml-xs" />
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props" class="text-center">
                <q-chip
                  :color="
                    props.row.status === 'pending'
                      ? 'amber'
                      : props.row.status === 'complete'
                        ? 'green'
                        : 'grey'
                  "
                  text-color="white"
                  class="q-pa-sm"
                  outline
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center q-gutter-sm text-grey">
                <q-icon size="2em" name="inbox" />
                <span>No jobs assigned to this rater</span>
              </div>
            </template>

            <template v-slot:bottom="scope">
              <div class="row items-center justify-between full-width q-px-md">
                <div>Records per page: {{ scope.pagination.rowsPerPage }}</div>
                <div>
                  {{ (scope.pagination.page - 1) * scope.pagination.rowsPerPage + 1 }}-{{
                    Math.min(
                      scope.pagination.page * scope.pagination.rowsPerPage,
                      filteredJobs.length,
                    )
                  }}
                  of {{ filteredJobs.length }}
                </div>
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-section class="q-pt-md q-px-lg sticky-footer">
          <div class="row justify-between items-center">
            <div class="text-caption text-grey-7">
              Showing {{ filteredJobs.length }} job{{ filteredJobs.length !== 1 ? 's' : '' }}
            </div>
            <div class="row q-gutter-md">
              <div class="text-primary flex items-center">
                <q-icon name="assignment" size="sm" class="q-mr-xs" />
                Total Jobs: {{ raterJobs.length }}
              </div>
              <div class="text-info flex items-center">
                <q-icon name="people" size="sm" class="q-mr-xs" />
                Total Applicants: {{ totalApplicants }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useAuthStore } from 'stores/authStore';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { usePlantillaStore } from 'stores/plantillaStore';

  import { toast } from 'boot/toast';
  import { adminApi } from 'boot/axios_admin';

  const jobPostStore = useJobPostStore();
  const authStore = useAuthStore();
  const plantillaStore = usePlantillaStore();

  // Search
  const globalSearch = ref('');
  const jobSearch = ref('');

  // Data
  const raters = ref([]);
  const raterJobs = ref([]);
  const isLoadingJobs = ref(false);
  const jobLoadError = ref('');

  // Loading state for the main table
  const isLoadingTable = ref(false);

  // Modal state
  const showModal = ref(false);
  const showError = ref(false);
  const isSubmitting = ref(false);
  const isEditMode = ref(false);
  const currentRaterId = ref(null);
  const currentRaterName = ref('');
  const currentRaterOffice = ref('');

  const currentOfficeRaters = ref([]);

  // View dialog state
  const showViewDialog = ref(false);
  const currentViewRater = ref({
    id: null,
    name: '',
    position: '',
    office: '',
  });

  // Pagination state
  const pagination = ref({
    sortBy: 'Position',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  });

  // Delete dialog state
  const showDeleteDialog = ref(false);
  const raterToDelete = ref(null);

  // Form selections
  const selectedPositions = ref([]);
  const selectedRater = ref(null);
  const selectedOffice = ref('');
  const activeStatus = ref(true);

  // Options data
  const offices = ref([]);
  const positions = ref([]);

  // Rater options for the selected office
  const filteredRatersByOffice = ref([]);
  const officeRatersRaw = ref([]);
  const isLoadingRaters = ref(false);

  // Columns definition
  const columns = [
    { name: 'id', label: 'ID', field: 'id', align: 'left', style: 'width: 5%' },
    {
      name: 'name',
      label: 'Rater Name',
      field: 'name',
      align: 'left',
      style: 'width: 15%; word-wrap: break-word; white-space: normal;',
    },
    {
      name: 'job_batches_rsp',
      label: 'Jobs Position to Rate',
      field: 'job_batches_rsp',
      align: 'left',
      style: 'width: 25%',
    },
    {
      name: 'office',
      label: 'Office',
      field: 'office',
      align: 'left',
      style: 'width: 20%; word-wrap: break-word; white-space: normal;',
    },
    {
      name: 'pending',
      label: 'Pending',
      field: 'pending',
      align: 'center',
      sortable: false,
      style: 'width: 10%',
    },
    {
      name: 'completed',
      label: 'Completed',
      field: 'completed',
      align: 'center',
      sortable: false,
      style: 'width: 10%',
    },
    {
      name: 'active',
      align: 'left',
      label: 'Status',
      field: 'active',
      sortable: true,
      style: 'width: 10%',
    },
    { name: 'actions', label: 'Actions', align: 'center', style: 'width: 5%' },
  ];

  // Updated job columns to match API response
  const jobColumns = [
    {
      name: 'position',
      label: 'Position',
      field: 'Position',
      align: 'left',
      style: 'width: 35%',
    },
    {
      name: 'office',
      label: 'Office',
      field: 'Office',
      align: 'left',
      style: 'width: 40%',
    },
    {
      name: 'applicant',
      label: 'Applicants',
      field: 'applicant',
      align: 'center',
      style: 'width: 10%',
    },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'center',
      style: 'width: 15',
    },
  ];

  // **NEW: Process raters to handle new API structure**
  const processedRaters = computed(() => {
    return raters.value.map((rater) => {
      // Handle job_batches_rsp being an array of objects
      const jobBatchesArray = Array.isArray(rater.job_batches_rsp) ? rater.job_batches_rsp : [];

      return {
        ...rater,
        job_batches_rsp_array: jobBatchesArray, // Store the array for display
        Rater: rater.name || rater.Rater, // Backwards compatibility
        Office: rater.office || rater.Office, // Backwards compatibility
      };
    });
  });

  // Computed
  const filteredRaters = computed(() => {
    if (!globalSearch.value) return processedRaters.value;
    const searchTerm = globalSearch.value.toLowerCase();
    return processedRaters.value.filter((rater) => {
      const positionsText = rater.job_batches_rsp_array
        .map((p) => p.position)
        .join(' ')
        .toLowerCase();
      return (
        String(rater.id).includes(searchTerm) ||
        (rater.name || '').toLowerCase().includes(searchTerm) ||
        positionsText.includes(searchTerm) ||
        (rater.office || '').toLowerCase().includes(searchTerm)
      );
    });
  });

  const filteredJobs = computed(() => {
    if (!jobSearch.value) return raterJobs.value;
    const searchTerm = jobSearch.value.toLowerCase();
    return raterJobs.value.filter((job) => {
      return (
        job.Position.toLowerCase().includes(searchTerm) ||
        job.Office.toLowerCase().includes(searchTerm)
      );
    });
  });

  const positionsWithAllOption = computed(() => {
    if (!positions.value.length) return [];
    const allOption = { id: 'all', name: 'All Positions' };
    return [allOption, ...positions.value];
  });

  // Calculate total applicants
  const totalApplicants = computed(() => {
    return raterJobs.value.reduce((total, job) => {
      return total + parseInt(job.applicant || 0);
    }, 0);
  });

  // Methods
  const showAddModal = () => {
    isEditMode.value = false;
    showModal.value = true;
    resetForm();
    activeStatus.value = true;
  };

  // **FIXED: Position selection methods**
  const isPositionSelected = (id) => {
    if (id === 'all') {
      return (
        positions.value.length > 0 &&
        selectedPositions.value.filter((p) => p !== 'all').length === positions.value.length
      );
    }
    return selectedPositions.value.includes(id);
  };

  const togglePosition = (id, checked) => {
    if (id === 'all') {
      if (checked) {
        selectedPositions.value = positions.value.map((p) => p.id);
      } else {
        selectedPositions.value = [];
      }
      return;
    }

    if (checked) {
      if (!selectedPositions.value.includes(id)) {
        selectedPositions.value = [...selectedPositions.value, id];
      }
    } else {
      selectedPositions.value = selectedPositions.value.filter((item) => item !== id);
    }
  };

  const handlePositionSelection = (newSelection) => {
    // Remove 'all' from the array - we don't store it, just use it for UI
    const filtered = newSelection.filter((id) => id !== 'all');

    // Remove duplicates using Set
    selectedPositions.value = [...new Set(filtered)];
  };

  // Fetch employees by selected office name (server-side filtered)
  const fetchEmployeesByOffice = async (officeName) => {
    isLoadingRaters.value = true;
    filteredRatersByOffice.value = [];
    officeRatersRaw.value = [];
    try {
      const resp = await adminApi.get('/active', { params: { office: officeName } });
      const list = (Array.isArray(resp.data) ? resp.data : [])
        .map((e) => ({
          id: e.ControlNo,
          name: e.Name4,
          Office: e.Office,
          Designation: e.Designation,
          BirthDate: e.BirthDate,
        }))
        .filter((e) => e.id && e.name);
      officeRatersRaw.value = list;
      filteredRatersByOffice.value = list;
      currentOfficeRaters.value = list;
    } catch (err) {
      console.error('Failed to fetch employees for office:', err);
      toast.error('Failed to load employees for selected office');
    } finally {
      isLoadingRaters.value = false;
    }
  };

  // When office is changed, fetch employees under that office
  const handleOfficeChange = async (OfficeName) => {
    selectedRater.value = null;
    if (!OfficeName) {
      filteredRatersByOffice.value = [];
      officeRatersRaw.value = [];
      currentOfficeRaters.value = [];
      return;
    }
    await fetchEmployeesByOffice(OfficeName);
  };

  // Local search within fetched employees for this office
  const filterRatersByOffice = (val, update) => {
    if (typeof update !== 'function') return;
    update(() => {
      if (!val) {
        filteredRatersByOffice.value = officeRatersRaw.value;
        return;
      }
      const needle = val.toLowerCase();
      filteredRatersByOffice.value = officeRatersRaw.value.filter((r) =>
        r.name.toLowerCase().includes(needle),
      );
    });
  };

  const resetForm = () => {
    selectedPositions.value = [];
    selectedRater.value = null;
    selectedOffice.value = '';
    filteredRatersByOffice.value = [];
    officeRatersRaw.value = [];
    currentRaterId.value = null;
    currentRaterName.value = '';
    currentRaterOffice.value = '';
    currentOfficeRaters.value = [];
    showError.value = false;
    activeStatus.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    resetForm();
    isEditMode.value = false;
  };

  // Updated viewRater method to properly handle the API response structure
  const viewRater = async (rater) => {
    currentViewRater.value = {
      id: rater.id,
      name: rater.name,
      position: rater.Position || 'N/A',
      office: rater.office,
      status: rater.status,
    };

    isLoadingJobs.value = true;
    jobLoadError.value = '';
    raterJobs.value = [];
    pagination.value.page = 1;
    showViewDialog.value = true;

    try {
      await jobPostStore.assign_job_list(rater.id);

      let jobsData = [];

      if (jobPostStore.jobPosts) {
        if (Array.isArray(jobPostStore.jobPosts)) {
          jobsData = jobPostStore.jobPosts;
        } else if (
          jobPostStore.jobPosts.job_batches_rsp &&
          Array.isArray(jobPostStore.jobPosts.job_batches_rsp)
        ) {
          jobsData = jobPostStore.jobPosts.job_batches_rsp;
        } else if (
          typeof jobPostStore.jobPosts === 'object' &&
          jobPostStore.jobPosts.job_batches_rsp
        ) {
          jobsData = Array.isArray(jobPostStore.jobPosts.job_batches_rsp)
            ? jobPostStore.jobPosts.job_batches_rsp
            : [jobPostStore.jobPosts.job_batches_rsp];
        }
      }

      if (jobsData.length > 0) {
        raterJobs.value = jobsData;
        pagination.value.rowsNumber = jobsData.length;
      } else {
        raterJobs.value = [];
        jobLoadError.value = 'No jobs assigned to this rater';
      }
    } catch (error) {
      console.error('Error fetching rater jobs:', error);
      jobLoadError.value = error.response?.data?.message || 'Failed to load assigned jobs';
      toast.error('Failed to load assigned jobs for this rater');
    } finally {
      isLoadingJobs.value = false;
    }
  };

  // **FIXED: Edit rater function to handle new API structure**
  const editRater = async (rater) => {
    try {
      isEditMode.value = true;
      currentRaterId.value = rater.id;
      currentRaterName.value = rater.name;
      activeStatus.value = !!rater.active;

      if (
        !offices.value.length &&
        Array.isArray(plantillaStore.office) &&
        plantillaStore.office.length
      ) {
        const names = Array.from(
          new Set(
            plantillaStore.office
              .map((row) =>
                typeof row === 'string' ? row.id : row?.Office || row?.office || row?.name,
              )
              .filter(Boolean),
          ),
        );
        offices.value = names.map((n) => ({ label: n, value: n }));
      }

      // Pre-select office by name
      selectedOffice.value = rater.office || '';

      // Populate rater list for that office
      if (selectedOffice.value) {
        await fetchEmployeesByOffice(selectedOffice.value);
        currentOfficeRaters.value = officeRatersRaw.value;
      }

      // **FIXED: Handle new API structure for job_batches_rsp**
      selectedPositions.value = [];

      // Get position IDs directly from the array of objects
      const jobBatchesArray = Array.isArray(rater.job_batches_rsp) ? rater.job_batches_rsp : [];

      console.log('Job batches from rater:', jobBatchesArray);
      console.log('Available positions:', positions.value);

      // Extract IDs directly from the job_batches_rsp array
      const matchedIds = [];
      jobBatchesArray.forEach((jobBatch) => {
        const id = jobBatch.id;
        if (id && !matchedIds.includes(id)) {
          matchedIds.push(id);
        }
      });

      console.log('Matched position IDs:', matchedIds);

      // Set the selected positions (no 'all', no duplicates)
      selectedPositions.value = matchedIds;

      showModal.value = true;
    } catch (error) {
      console.error('Error setting up edit mode:', error);
      toast.error('Failed to prepare edit form');
    }
  };

  const updateRater = async () => {
    if (selectedPositions.value.length === 0 || !selectedOffice.value) {
      showError.value = true;
      return;
    }

    showError.value = false;
    isSubmitting.value = true;

    try {
      const raterId = currentRaterId.value;
      if (!raterId) throw new Error('No rater selected for editing');

      const userData = {
        job_batches_rsp_id: selectedPositions.value.filter((id) => id !== 'all'),
        Office: selectedOffice.value,
        active: activeStatus.value,
      };

      const result = await authStore.rater_edit(raterId, userData);

      if (result.success) {
        await loadRaters();
        closeModal();
        toast.success('Rater updated successfully');
      } else {
        throw new Error(result.message || 'Failed to update rater');
      }
    } catch (error) {
      console.error('Error updating rater:', error);
      toast.error(error.message || 'Failed to update rater');
    } finally {
      isSubmitting.value = false;
    }
  };

  const addRater = async () => {
    if (selectedPositions.value.length === 0 || !selectedOffice.value || !selectedRater.value) {
      showError.value = true;
      return;
    }

    showError.value = false;
    isSubmitting.value = true;

    try {
      const raterData = officeRatersRaw.value.find((r) => r.id === selectedRater.value);
      if (!raterData) throw new Error('Rater data not found');

      const jobBatchIds = selectedPositions.value.filter((id) => id !== 'all');

      const userData = {
        name: raterData.name,
        controlNo: raterData.id,
        BirthDate: raterData.BirthDate || '',
        Designation: raterData.Designation || '',
        job_batches_rsp_id: jobBatchIds,
        Office: selectedOffice.value,
        active: activeStatus.value,
      };

      const result = await authStore.Rater_register(userData);

      if (result.success) {
        await loadRaters();
        closeModal();
        toast.success('Rater added successfully');
      } else {
        throw new Error(result.message || 'Failed to add rater');
      }
    } catch (error) {
      console.error('Error adding rater:', error);
      toast.error(error.message || 'Failed to add rater');
      showError.value = true;
    } finally {
      isSubmitting.value = false;
    }
  };

  // Centralized method to load raters with loading state
  const loadRaters = async () => {
    isLoadingTable.value = true;
    try {
      await authStore.get_all_raters();
      raters.value = authStore.users || [];
    } catch (error) {
      console.error('Error loading raters:', error);
      toast.error('Failed to load raters');
      raters.value = [];
    } finally {
      isLoadingTable.value = false;
    }
  };

  const deleteRater = () => {
    raters.value = raters.value.filter((r) => r.id !== raterToDelete.value);
    showDeleteDialog.value = false;
    raterToDelete.value = null;
  };

  onMounted(async () => {
    isLoadingTable.value = true;
    try {
      await Promise.all([
        jobPostStore.job_post_list(),
        loadRaters(),
        plantillaStore.fetch_office_rater(),
      ]);
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to load initial data');
    } finally {
      isLoadingTable.value = false;
    }

    // Positions for selection
    positions.value = jobPostStore.jobPosts.map((post) => ({ id: post.id, name: post.Position }));

    // Populate office options from store (name-only)
    if (Array.isArray(plantillaStore.office) && plantillaStore.office.length > 0) {
      const names = Array.from(
        new Set(
          plantillaStore.office
            .map((row) => (typeof row === 'string' ? row : row?.Office || row?.office || row?.name))
            .filter(Boolean),
        ),
      );
      offices.value = names.map((name) => ({ label: name, value: name }));
    }
  });

  watch(showModal, (val) => {
    if (val && isEditMode.value) {
      // already set in editRater
    } else if (val && !isEditMode.value) {
      activeStatus.value = true;
    }
  });
</script>

<style scoped>
  .q-table {
    width: 100%;
  }

  .position-cell {
    max-width: 230px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px 4px;
    align-items: flex-start;
    word-break: break-word;
    margin: 2px 0;
  }

  .position-cell .q-badge {
    white-space: normal;
    max-width: 100%;
    font-size: 12px;
    line-height: 1 3;
    padding-left: 8px;
    padding-right: 8px;
    box-sizing: border-box;
  }

  .sticky-header-table .q-table__top,
  .sticky-header-table .q-table__bottom,
  .sticky-header-table thead tr:first-child th {
    background-color: white;
  }

  .sticky-header-table thead tr th {
    position: sticky;
    z-index: 1;
  }

  .sticky-header-table thead tr:first-child th {
    top: 0;
  }

  /* No horizontal scrolling styles */
  .no-horizontal-scroll {
    table-layout: fixed;
    width: 100%;
  }

  .no-horizontal-scroll th,
  .no-horizontal-scroll td {
    overflow: hidden;
    white-space: normal;
    word-break: break-word;
  }

  /* Position column styles */
  .position-column {
    width: 35%;
    max-width: 300px;
  }

  /* Office column styles */
  .office-column {
    width: 40%;
    max-width: 350px;
  }

  /* Full text display for position and office */
  .full-position-text,
  .full-office-text {
    white-space: normal;
    word-break: break-word;
    line-height: 1.4;
    padding: 2px 0;
    width: 100%;
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0 1);
  }

  .sticky-info {
    position: sticky;
    top: 65px;
    z-index: 2;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0 05);
  }

  .scrollable-content {
    flex-grow: 1;
    overflow-y: auto;
    max-height: calc(80vh - 200px);
  }

  .sticky-footer {
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 2;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
</style>
