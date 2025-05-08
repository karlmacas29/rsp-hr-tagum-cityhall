<template>
  <q-page class="q-pa-md">
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h4 q-ma-none"><b>Rater Management</b></h5>
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
        <div class="text-h5 text-bold">
          Raters List
          <template v-if="authStore.user.permissions.isRaterM === '0'">
            <q-badge>View Only</q-badge>
          </template>
        </div>
        <template v-if="authStore.user.permissions.isRaterM === '1'">
          <q-btn color="primary" label="Add Rater" @click="showAddModal" icon="add" />
        </template>
      </q-card-section>
      <q-separator />

      <q-card-section>
        <!-- Single powerful search bar -->
        <div class="q-mb-md">
          <q-input
            outlined
            v-model="globalSearch"
            placeholder="Search all raters..."
            clearable
            class="q-mb-md"
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

        <q-table
          flat
          bordered
          :rows="filteredRaters"
          :columns="columns"
          row-key="id"
          :loading="isSubmitting"
        >
          <!-- Position column with badges -->
          <template v-slot:body-cell-Position="props">
            <q-td :props="props">
              <div class="row q-gutter-xs">
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
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">
            <b>{{ isEditMode ? 'Edit Rater' : 'Add Rater' }}</b>
          </div>
          <q-btn icon="close" flat round dense @click="closeModal" />
        </q-card-section>

        <q-card-section>
          <q-banner v-if="showError" class="bg-red-2 text-red-10 q-mb-md">
            Please fill in all required fields.
          </q-banner>

          <!-- Select Positions -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-medium">Select Positions to Rate</div>
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

          <q-separator class="q-mt-md q-mb-md" />

          <!-- Add Mode: Select Office FIRST, then Select Rater -->
          <template v-if="!isEditMode">
            <!-- Select Office in Add Mode -->
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
                :disable="selectedPositions.length === 0"
                @update:model-value="handleOfficeChange"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-select>
            </div>

            <q-separator class="q-mt-md q-mb-md" />

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
              <div class="text-subtitle2 text-weight-medium">Office</div>
              <q-select
                outlined
                dense
                readonly
                :model-value="currentOfficeId"
                :options="offices"
                option-value="id"
                option-label="name"
                label="Current Office"
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
                <template v-slot:append>
                  <q-icon name="lock" size="xs" />
                </template>
              </q-select>
              <div class="text-caption text-grey q-mt-sm">
                <q-icon name="info" size="xs" class="q-mr-xs" />
                Office cannot be changed
              </div>
            </div>

            <q-separator class="q-mt-md q-mb-md" />

            <!-- Display Rater in Edit Mode (readonly) -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-weight-medium">Rater</div>
              <q-select
                outlined
                dense
                readonly
                :model-value="currentRaterId"
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
          <q-btn flat label="Cancel" color="primary" @click="closeModal" />
          <q-btn
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

    <!-- View Rater Dialog - Clean Version -->
    <q-dialog v-model="showViewDialog" persistent>
      <q-card style="width: 800px; max-width: 95vw">
        <q-card-section class="row items-center bg-grey-2 q-pb-none">
          <div class="text-h6">Applicant Ratings</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-mb-sm items-center">
            <div class="col">
              <div class="text-subtitle1">
                <strong>Rater:</strong>
                {{ currentViewRater.Rater }}
              </div>
              <div class="text-subtitle2">
                <strong>Position:</strong>
                {{ currentViewRater.Position }}
              </div>
            </div>
            <div class="col-auto">
              <q-input
                outlined
                v-model="applicantSearch"
                placeholder="Search applicants..."
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

          <q-table
            flat
            bordered
            :rows="filteredApplicants"
            :columns="applicantColumns"
            row-key="id"
            :loading="isLoadingApplicants"
            :pagination="{ rowsPerPage: 10 }"
            class="sticky-header-table"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  dense
                  :color="props.row.status === 'done' ? 'green-1' : 'orange-1'"
                  :text-color="props.row.status === 'done' ? 'green-10' : 'orange-10'"
                  :icon="props.row.status === 'done' ? 'done' : 'schedule'"
                  size="sm"
                >
                  {{ props.row.status === 'done' ? 'Completed' : 'Pending' }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-rating="props">
              <q-td :props="props">
                <div v-if="props.row.status === 'done'" class="text-bold" style="color: #2e7d32">
                  {{ props.row.rating }}
                  <q-icon name="star" color="yellow-8" size="xs" class="q-ml-xs" />
                </div>
                <div v-else class="text-grey-6">-</div>
              </q-td>
            </template>
          </q-table>

          <div class="row justify-between items-center q-mt-sm">
            <div class="text-caption text-grey-7">
              Showing {{ filteredApplicants.length }} records
            </div>
            <div>
              <q-chip color="green-1" text-color="green-10" icon="done" dense>
                Completed: {{ applicants.filter((a) => a.status === 'done').length }}
              </q-chip>
              <q-chip color="orange-1" text-color="orange-10" icon="schedule" dense class="q-ml-sm">
                Pending: {{ applicants.filter((a) => a.status === 'pending').length }}
              </q-chip>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1">
          <q-btn flat label="Close" color="grey-7" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAuthStore } from 'stores/authStore';

  const authStore = useAuthStore();

  // Search
  const globalSearch = ref('');
  const applicantSearch = ref('');

  // Data
  const raters = ref([
    {
      id: 1,
      Rater: 'John Smith',
      Position: 'Frontend Developer, Backend Developer',
      Office: 'Main Office',
      pending: 3,
      completed: 2,
    },
    {
      id: 2,
      Rater: 'Emily Johnson',
      Position: 'Social Media Manager',
      Office: 'Main Office',
      pending: 1,
      completed: 4,
    },
    {
      id: 3,
      Rater: 'Michael Williams',
      Position: 'Customer Support Representative',
      Office: 'Regional Office - North',
      pending: 0,
      completed: 5,
    },
  ]);

  // Applicants data
  const applicants = ref([
    { id: 1, name: 'Alice Johnson', position: 'Frontend Developer', status: 'done', rating: '4.5' },
    { id: 2, name: 'Bob Smith', position: 'Frontend Developer', status: 'pending', rating: '' },
    { id: 3, name: 'Charlie Brown', position: 'Backend Developer', status: 'done', rating: '3.8' },
    { id: 4, name: 'Diana Prince', position: 'Backend Developer', status: 'pending', rating: '' },
    { id: 5, name: 'Ethan Hunt', position: 'Backend Developer', status: 'pending', rating: '' },
  ]);

  const isLoadingApplicants = ref(false);

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
  });

  // Delete dialog state
  const showDeleteDialog = ref(false);
  const raterToDelete = ref(null);

  // Form selections
  const selectedPositions = ref([]);
  const selectedRater = ref(null);
  const selectedOffice = ref(null);

  // Options data
  const offices = ref([
    { id: 1, name: 'Main Office' },
    { id: 2, name: 'Regional Office - North' },
    { id: 3, name: 'Regional Office - South' },
  ]);

  const positions = ref([
    { id: 101, name: 'Frontend Developer' },
    { id: 102, name: 'Backend Developer' },
    { id: 103, name: 'Full Stack Developer' },
    { id: 201, name: 'Social Media Manager' },
    { id: 202, name: 'SEO Specialist' },
    { id: 301, name: 'Customer Support Representative' },
    { id: 302, name: 'Technical Support' },
  ]);

  const availableRaters = ref([
    { id: 1, name: 'John Smith', officeId: 1 },
    { id: 2, name: 'Emily Johnson', officeId: 1 },
    { id: 3, name: 'Michael Williams', officeId: 2 },
    { id: 4, name: 'Sarah Brown', officeId: 2 },
    { id: 5, name: 'David Jones', officeId: 3 },
  ]);

  const filteredRatersByOffice = ref([]);

  // Columns definition
  const columns = [
    { name: 'ID', label: 'ID', field: 'id', align: 'left' },
    { name: 'Rater', label: 'Rater Name', field: 'Rater', align: 'left' },
    { name: 'Position', label: 'Position to Rate', field: 'Position', align: 'left' },
    { name: 'Office', label: 'Office', field: 'Office', align: 'left' },
    { name: 'pending', label: 'Pending', field: 'pending', align: 'center', sortable: false },
    { name: 'completed', label: 'Completed', field: 'completed', align: 'center', sortable: false },
    { name: 'actions', label: 'Actions', align: 'center' },
  ];

  // Applicant columns
  const applicantColumns = [
    { name: 'id', label: 'ID', field: 'id', align: 'left' },
    { name: 'name', label: 'Applicant Name', field: 'name', align: 'left' },
    { name: 'position', label: 'Position', field: 'position', align: 'left' },
    { name: 'status', label: 'Status', field: 'status', align: 'center' },
    { name: 'rating', label: 'Rating', field: 'rating', align: 'center' },
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

  const filteredApplicants = computed(() => {
    if (!applicantSearch.value) return applicants.value;

    const searchTerm = applicantSearch.value.toLowerCase();
    return applicants.value.filter((applicant) => {
      return (
        applicant.id.toString().includes(searchTerm) ||
        applicant.name.toLowerCase().includes(searchTerm) ||
        applicant.position.toLowerCase().includes(searchTerm) ||
        applicant.status.toLowerCase().includes(searchTerm)
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
    selectedRater.value = null;
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
        filteredRatersByOffice.value = [];
        return;
      }

      if (val === '') {
        filteredRatersByOffice.value = availableRaters.value.filter(
          (rater) => rater.officeId === selectedOffice.value,
        );
      } else {
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
    };

    isLoadingApplicants.value = true;
    setTimeout(() => {
      isLoadingApplicants.value = false;
      showViewDialog.value = true;
    }, 500);
  };

  const editRater = (rater) => {
    isEditMode.value = true;
    currentRaterName.value = rater.Rater;
    currentRaterOffice.value = rater.Office;

    const office = offices.value.find((o) => o.name === rater.Office);
    currentOfficeId.value = office?.id || null;

    const raterData = availableRaters.value.find((r) => r.name === rater.Rater);
    currentRaterId.value = raterData?.id || null;

    currentOfficeRaters.value = availableRaters.value.filter(
      (r) => r.officeId === currentOfficeId.value,
    );

    const positionNames = rater.Position.split(', ');
    selectedPositions.value = positions.value
      .filter((pos) => positionNames.includes(pos.name))
      .map((pos) => pos.id);

    showModal.value = true;
  };

  const updateRater = () => {
    if (selectedPositions.value.length === 0) {
      showError.value = true;
      return;
    }

    showError.value = false;
    isSubmitting.value = true;

    setTimeout(() => {
      const selectedPositionNames = positions.value
        .filter((pos) => selectedPositions.value.includes(pos.id))
        .map((pos) => pos.name)
        .join(', ');

      const index = raters.value.findIndex((r) => r.Rater === currentRaterName.value);
      if (index !== -1) {
        raters.value[index] = {
          ...raters.value[index],
          Position: selectedPositionNames,
        };
      }

      closeModal();
      isSubmitting.value = false;
    }, 1000);
  };

  const addRater = () => {
    if (selectedPositions.value.length === 0 || !selectedOffice.value || !selectedRater.value) {
      showError.value = true;
      return;
    }
    showError.value = false;
    isSubmitting.value = true;

    setTimeout(() => {
      const selectedPositionNames = positions.value
        .filter((pos) => selectedPositions.value.includes(pos.id))
        .map((pos) => pos.name)
        .join(', ');

      const raterData = availableRaters.value.find((r) => r.id === selectedRater.value);
      const officeData = offices.value.find((o) => o.id === selectedOffice.value);

      raters.value.push({
        id: raters.value.length + 1,
        Rater: raterData?.name || '',
        Position: selectedPositionNames,
        Office: officeData?.name || '',
        pending: 0,
        completed: 0,
      });

      closeModal();
      isSubmitting.value = false;
    }, 1000);
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
</script>

<style scoped>
  .q-table {
    width: 100%;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
  }

  .status-done {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  .status-pending {
    background-color: #fff3e0;
    color: #e65100;
  }
</style>
