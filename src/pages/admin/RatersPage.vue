<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Rater Management</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <template v-slot:separator>
            <q-icon size="1.2em" name="arrow_forward" />
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
        <div v-if="authStore.user.permissions.isRaterM === '1'">
          <q-btn rounded color="primary" label="Add Rater" @click="showAddModal" icon="add" />
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
          :loading="isSubmitting"
        >
          <!-- Position column: flex wrap badges, fix column width, tooltip full value -->
          <!-- <template v-slot:body-cell-job_batches_rsp="props">
            <q-td :props="props">
              <div class="position-cell" :title="props.row.Position">
                <q-badge
                  v-for="(pos, index) in props.row.Position.split(', ')"
                  :key="index"
                  color="primary"
                  text-color="white"
                  class="q-pa-xs"
                >
                  {{ pos }}
                </q-badge>
              </div>
            </q-td>
          </template> -->
          <template v-slot:body-cell-job_batches_rsp="props">
  <q-td :props="props">
    <div class="position-cell" :title="props.row.job_batches_rsp">
      <q-badge
        v-for="(pos, index) in props.row.job_batches_rsp.split(',')"
        :key="index"
        color="primary"
        text-color="white"
        class="q-pa-xs q-mb-xs badge-block"
      >
        {{ pos.trim() }}
      </q-badge>
    </div>
  </q-td>
</template>
          <template v-slot:body-cell-Office="props">
            <q-td :props="props">
              <div style="white-space: normal; overflow-wrap: break-word">
                {{ props.row.Office }}
              </div>
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
              >
                <q-tooltip>View</q-tooltip>
              </q-btn>
              <template
                v-if="authStore.user.permissions.isRaterM === '1' && props.row.completed == 0"
              >
               <q-btn
  flat
  round
  dense
  icon="edit"
  @click="editRater(props.row)"
  class="q-ml-sm bg-teal-1"
  color="positive"
>
  <q-tooltip>Edit</q-tooltip>
</q-btn>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  @click="confirmDeleteRater(props.row)"
                  class="q-ml-sm bg-red-1"
                  color="negative"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </template>
            </q-td>
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
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Add Mode: Select Office FIRST, then Select Rater -->
          <template v-if="!isEditMode">
            <!-- Select Office in Add Mode -->
            <div class="q-mb-md">
    <q-select
                v-model="selectedOffice"
                :options="offices"
                option-value="id"
                option-label="name"
                label="Select an office"
                outlined
                dense
                emit-value
                map-options
                :disable="selectedPositions.length === 0"
                @update:model-value="handleOfficeChange"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-select>
            </div>

            <!-- Select Rater in Add Mode (AFTER office) -->
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
          </template>

          <!-- Edit Mode: Display Rater + Office (readonly) -->
          <template v-else>
            <!-- Select Office in Edit Mode (readonly but visible) -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-weight-medium">Select Office</div>
    <q-select
      v-model="selectedOffice"
      :options="offices"
      option-value="id"
      option-label="name"
      label="Select an office"
      outlined
      dense
      emit-value
      map-options
    >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
                <template v-slot:append>
                </template>
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
            :disable="
              isEditMode
                ? selectedPositions.length === 0
                : !selectedRater || !selectedOffice || selectedPositions.length === 0
            "
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

    <!-- View Rater Dialog - Updated to show real jobs data -->
    <q-dialog v-model="showViewDialog" persistent>
      <q-card style="width: 800px; max-width: 95vw; display: flex; flex-direction: column">
        <!-- Header with more padding and better alignment - Sticky -->
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

        <!-- Rater Information with better spacing - Sticky -->
        <q-card-section class="q-px-lg sticky-info">
          <div class="row q-col-gutter-md">
            <div class="col">
              <div class="text-subtitle1 q-mb-sm">
                <strong>Rater:</strong>
                {{ currentViewRater.Rater }}
              </div>
              <div class="text-subtitle1 q-mb-sm">
                <strong>Office:</strong>
                {{ currentViewRater.Office }}
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

        <!-- Table Section with proper spacing - Scrollable content -->
        <q-card-section class="q-pa-md q-mx-md scrollable-content">
          <q-table
            flat
            bordered
            :rows="filteredJobs"
            :columns="jobColumns"
            row-key="id"
            :loading="isLoadingJobs"
            :pagination="pagination"
            class="sticky-header-table no-horizontal-scroll"
            wrap-cells
            virtual-scroll
          >
            <!-- Position column with full text display -->
            <template v-slot:body-cell-position="props">
              <q-td :props="props" class="position-column">
                <div class="full-position-text" :title="props.row.position">
                  {{ props.row.position }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props" class="text-center">
                <div
                  v-if="props.row.status === 'completed'"
                  class="text-green flex items-center justify-center"
                >
                  <q-icon name="check_circle" size="xs" class="q-mr-xs" />
                  Completed
                </div>
                <div v-else class="text-orange flex items-center justify-center">
                  <q-icon name="schedule" size="xs" class="q-mr-xs" />
                  Pending
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-applicantCount="props">
              <q-td :props="props" class="text-center">
                <div class="text-grey-9">
                  {{ props.row.applicantCount }}
                  <q-icon name="people" size="xs" class="q-ml-xs" />
                </div>
              </q-td>
            </template>

            <!-- Fixed pagination display -->
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

        <!-- Summary section with proper spacing -->
        <q-card-section class="q-pt-md q-px-lg sticky-footer">
          <div class="row justify-between items-center">
            <div class="text-caption text-grey-7">Showing {{ filteredJobs.length }} jobs</div>
            <div class="row q-gutter-md">
              <div class="text-green flex items-center">
                <q-icon name="check_circle" size="sm" class="q-mr-xs" />
                Completed: {{ raterJobs.filter((j) => j.status === 'completed').length }}
              </div>
              <div class="text-orange flex items-center">
                <q-icon name="schedule" size="sm" class="q-mr-xs" />
                Pending: {{ raterJobs.filter((j) => j.status === 'pending').length }}
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Removed the footer section -->
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from 'stores/authStore';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { usePlantillaStore } from 'stores/plantillaStore';
  // import { useauthStore } from 'stores/authStore_raters';
  import { toast } from 'boot/toast';

  const jobPostStore = useJobPostStore();
  const authStore = useAuthStore();
  const plantillaStore = usePlantillaStore();
//  const  authStore = useauthStore();
  // Search
  const globalSearch = ref('');
  const jobSearch = ref('');

  // Data
  const raters = ref([]);
  // Using a separate ref for rater jobs
  const raterJobs = ref([]);

  const isLoadingJobs = ref(false);

  // Modal state
  const showModal = ref(false);
  const showError = ref(false);
  const isSubmitting = ref(false);
  const isEditMode = ref(false);
  const currentRaterId = ref(null);
  const currentRaterName = ref('');
  const currentRaterOffice = ref('');
  const currentOfficeId = ref(null);
  const currentOfficeRaters = ref([]);

  // View dialog state
  const showViewDialog = ref(false);
  const currentViewRater = ref({
    Rater: '',
    Position: '',
    Office: '',
  });

  // Pagination state
  const pagination = ref({
    sortBy: 'position',
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
  const selectedOffice = ref(null);

  // Options data
  const offices = ref([]);
  const positions = ref([]);

  const availableRaters = ref([]);

  const filteredRatersByOffice = ref([]);

  // Columns definition
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'Rater', label: 'Rater Name', field: 'Rater', align: 'left' },
  { name: 'job_batches_rsp', label: 'Jobs Position to Rate', field: 'job_batches_rsp', align: 'left' },
  { name: 'Office', label: 'Office', field: 'Office', align: 'left' },
  { name: 'pending', label: 'Pending', field: 'pending', align: 'center', sortable: false },
  { name: 'completed', label: 'Completed', field: 'completed', align: 'center', sortable: false },
  { name: 'active', align: 'left', label: 'Status', field: 'active', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' },
];
  // Job columns for the view dialog
  const jobColumns = [
    {
      name: 'position',
      label: 'Position',
      field: 'position',
      align: 'left',
      style: 'width: 40%', // Fixed width for position column
    },
    {
      name: 'slots',
      label: 'Slots',
      field: 'slots',
      align: 'center',
      style: 'width: 15%',
    },
    {
      name: 'applicantCount',
      label: 'Number of Applicants',
      field: 'applicantCount',
      align: 'center',
      style: 'width: 25%',
    },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'center',
      style: 'width: 20%',
    },
  ];

  // Computed properties
  const filteredRaters = computed(() => {
    if (!globalSearch.value) return raters.value;

    const searchTerm = globalSearch.value.toLowerCase();
    return raters.value.filter((rater) => {
      return (
        rater.id.toString().includes(searchTerm) ||
        rater.Rater.toLowerCase().includes(searchTerm) ||
        rater.Position.toLowerCase().includes(searchTerm) ||
        rater.Office.toLowerCase().includes(searchTerm)
      );
    });
  });

  const filteredJobs = computed(() => {
    if (!jobSearch.value) return raterJobs.value;

    const searchTerm = jobSearch.value.toLowerCase();
    return raterJobs.value.filter((job) => {
      return (
        job.position.toLowerCase().includes(searchTerm) ||
        job.status.toLowerCase().includes(searchTerm)
      );
    });
  });

  const positionsWithAllOption = computed(() => {
    if (!positions.value.length) return [];
    const allOption = { id: 'all', name: 'All Positions' };
    return [allOption, ...positions.value];
  });

  // Methods
  const showAddModal = () => {
    isEditMode.value = false;
    showModal.value = true;
    resetForm();
  };

  const isPositionSelected = (id) => {
    if (id === 'all') {
      return (
        positions.value.length > 0 &&
        positions.value.every((p) => selectedPositions.value.includes(p.id))
      );
    }
    return selectedPositions.value.includes(id);
  };

  const togglePosition = (id, checked) => {
    if (id === 'all') {
      if (checked) {
        selectedPositions.value = ['all', ...positions.value.map((p) => p.id)];
      } else {
        selectedPositions.value = [];
      }
    } else {
      let newSelection = [...selectedPositions.value];
      const allIndex = newSelection.indexOf('all');

      if (checked) {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }

        const allSelected = positions.value.every((p) => newSelection.includes(p.id));
        if (allSelected && allIndex === -1) {
          newSelection.push('all');
        }
      } else {
        newSelection = newSelection.filter((item) => item !== id);

        if (allIndex !== -1) {
          newSelection.splice(allIndex, 1);
        }
      }

      selectedPositions.value = newSelection;
    }
  };

  const handlePositionSelection = (newSelection) => {
    const allOptionId = 'all';
    const regularIds = positions.value.map((p) => p.id);

    if (newSelection.includes(allOptionId)) {
      selectedPositions.value = [allOptionId, ...regularIds];
    } else {
      selectedPositions.value = newSelection.filter((id) => id !== allOptionId);

      const allSelected =
        regularIds.length > 0 && regularIds.every((id) => newSelection.includes(id));

      if (allSelected) {
        selectedPositions.value = [allOptionId, ...regularIds];
      }
    }
  };

  const handleOfficeChange = (officeId) => {
    selectedRater.value = null; // Reset selected rater
    // Filter raters based on the selected office's ID
    // Assumes availableRaters items have { id, name, officeId }
    filteredRatersByOffice.value = availableRaters.value.filter(
      (rater) => rater.officeId === officeId,
    );
  };

  const filterRatersByOffice = (val, update) => {
    if (typeof update !== 'function') {
      return;
    }

    update(() => {
      if (!selectedOffice.value) {
        // selectedOffice.value holds the ID of the selected office
        filteredRatersByOffice.value = [];
        return;
      }

      // Assumes availableRaters items have { id, name, officeId }
      if (val === '') {
        // If search input is empty, list all raters for the selected office
        filteredRatersByOffice.value = availableRaters.value.filter(
          (rater) => rater.officeId === selectedOffice.value,
        );
      } else {
        // Otherwise, filter by name within the selected office
        const needle = val.toLowerCase();
        filteredRatersByOffice.value = availableRaters.value.filter(
          (rater) =>
            rater.officeId === selectedOffice.value && rater.name.toLowerCase().includes(needle),
        );
      }
    });
  };

  const resetForm = () => {
    selectedPositions.value = [];
    selectedRater.value = null;
    selectedOffice.value = null;
    filteredRatersByOffice.value = [];
    currentRaterId.value = null;
    currentRaterName.value = '';
    currentRaterOffice.value = '';
    currentOfficeId.value = null;
    currentOfficeRaters.value = [];
    showError.value = false;
  };

  const closeModal = () => {
    showModal.value = false;
    resetForm();
    isEditMode.value = false;
  };

  const viewRater = (rater) => {
    currentViewRater.value = {
      Rater: rater.Rater,
      Position: rater.Position,
      Office: rater.Office,
    };

    isLoadingJobs.value = true;

    // Reset pagination
    pagination.value.page = 1;
    // Get the positions this rater is assigned to
    const assignedPositions = rater.job_batches_rsp.split(', ');
    // Filter jobPosts to get only the ones this rater is assigned to rate
    const raterJobsData = jobPostStore.jobPosts
      .filter((job) => assignedPositions.includes(job.Position))
      .map((job) => {
        // For demo purposes, randomly decide if the job is completed or pending
        // In a real app, you would determine this based on actual data
        const isCompleted = Math.random() > 0.5;

        return {
          id: job.id,
          position: job.Position,
          slots: job.Plantilla || 1, // Use actual slots from job data if available
          applicantCount: job.ApplicantCount || Math.floor(Math.random() * 15) + 1, // Use actual count or random for demo
          status: isCompleted ? 'completed' : 'pending',
        };
      });

    // Small delay to simulate loading
    setTimeout(() => {
      raterJobs.value = raterJobsData;
      pagination.value.rowsNumber = raterJobsData.length;
      isLoadingJobs.value = false;
      showViewDialog.value = true;
    }, 500);
  };
const editRater = async (rater) => {
  try {
    isEditMode.value = true;
    currentRaterId.value = rater.id;
    currentRaterName.value = rater.Rater;

    // Fetch the latest office data
    await plantillaStore.fetch_office_rater();

    // Set the current office selection
    const currentOffice = plantillaStore.plantilla.find(
      person => person.Name4 === rater.Rater
    );

    if (currentOffice) {
      selectedOffice.value = currentOffice.OfficeID;

      // Ensure offices list is up to date
      const uniqueOfficesData = plantillaStore.plantilla.reduce((acc, item) => {
        if (!acc.some((office) => office.name === item.office)) {
          acc.push({
            id: item.OfficeID,
            name: item.office,
          });
        }
        return acc;
      }, []);
      offices.value = uniqueOfficesData;
    }

    // Convert job_batches_rsp string to array of position IDs
    const positionNames = rater.job_batches_rsp.split(',').map(name => name.trim());
    selectedPositions.value = positions.value
      .filter((pos) => positionNames.includes(pos.name))
      .map((pos) => pos.id);

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
    if (!raterId) {
      throw new Error('No rater selected for editing');
    }

    // Get the office name from plantilla data
    await plantillaStore.fetch_office_rater();
    const selectedOfficeData = plantillaStore.plantilla.find(
      person => person.OfficeID === selectedOffice.value
    );

    if (!selectedOfficeData) {
      throw new Error('Selected office not found');
    }

    // Prepare the data for the edit request
    const userData = {
      job_batches_rsp_id: selectedPositions.value.filter(id => id !== 'all'),
      Office: selectedOfficeData.office,
    };

    // Call the rater_edit action
    const result = await authStore.rater_edit(raterId, userData);

    if (result.success) {
      // Refresh the raters list
      await authStore.get_all_raters();
      raters.value = authStore.users;
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
    const raterData = availableRaters.value.find((r) => r.id === selectedRater.value);
    const officeData = offices.value.find((o) => o.id === selectedOffice.value);

    if (!raterData || !officeData) {
      throw new Error('Rater or office data not found');
    }

    // Filter out 'all' if present and get actual position IDs
    const jobBatchIds = selectedPositions.value.filter(id => id !== 'all');

    const userData = {
      name: raterData.name,
      controlNo: raterData.id,
      job_batches_rsp_id: jobBatchIds,
      Office: officeData.name, // Include office name
      active:true,
    };

    const result = await authStore.Rater_register(userData);

    if (result.success) {
      // Refresh the raters list
      await authStore.get_all_raters();
      // Update local raters list
      raters.value = authStore.users;
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

  const confirmDeleteRater = (rater) => {
    raterToDelete.value = rater.id;
    showDeleteDialog.value = true;
  };

  const deleteRater = () => {
    raters.value = raters.value.filter((r) => r.id !== raterToDelete.value);
    showDeleteDialog.value = false;
    raterToDelete.value = null;
  };

  onMounted(async () => {
   try {
    await Promise.all([
      jobPostStore.job_post_list(),
      authStore.get_all_raters(),
      plantillaStore.fetch_office_rater()
    ]);

    raters.value = authStore.users || [];

  } catch (error) {
    console.error('Initialization error:', error);
    toast.error('Failed to load initial data');
  }

    //  raters.value = authStore.users;
    // Populate uniqueOffices
   const uniqueOfficesData = plantillaStore.plantilla.reduce((acc, item) => {
    if (!acc.some((office) => office.name === item.office)) {
      acc.push({
        id: item.OfficeID,
        name: item.office,
      });
    }
    return acc;
  }, []);
  offices.value = uniqueOfficesData;

  positions.value = jobPostStore.jobPosts.map((post) => {
    return {
      id: post.id,
      name: post.Position,
    };
  });

  if (plantillaStore.plantilla && plantillaStore.plantilla.length > 0) {
    availableRaters.value = plantillaStore.plantilla
      .map((person) => ({
        id: person.ControlNo,
        name: person.Name4,
        officeId: person.OfficeID,
      }))
      .filter((person) => person.id && person.name && person.officeId);
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
    line-height: 1.3;
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
    width: 40%;
    max-width: 300px;
  }

  /* Full text display for position */
  .full-position-text {
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .sticky-info {
    position: sticky;
    top: 65px;
    z-index: 2;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
