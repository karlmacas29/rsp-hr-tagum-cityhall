<template>
  <q-page>
    <div class="row justify-center items-center" style="height: 89vh">
      <!--  -->
      <div class="col-3 q-pa-sm">
        <PlantillaSelection
          :positions="positions"
          @structure-selected="handleStructureSelection"
        ></PlantillaSelection>
      </div>
      <!--  -->
      <div class="col-9 q-gutter-md">
        <q-card>
          <q-scroll-area class="q-pa-sm" style="height: 82vh">
            <q-card
              flat
              v-if="getStructureTitle() != ''"
              class="row justify-between items-center q-pa-md"
            >
              <div class="text-h4 text-bold" style="width: 500px">
                {{ getStructureTitle() }}
              </div>
              <div>
                <q-btn color="primary" @click="clearFilters" icon="clear_all">Clear All</q-btn>
              </div>
            </q-card>
            <q-card flat v-if="currentStructure">
              <q-separator />
              <q-card-section>
                <q-table
                  flat
                  bordered
                  :rows="filteredPositions"
                  :columns="columns"
                  row-key="id"
                  :filter="filter"
                  :q-pagination="pagination"
                  v-model:pagination="pagination"
                  :rows-per-page-options="[]"
                  :loading="usePlantilla.loading"
                >
                  <!-- Header with search boxes -->

                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        :style="col.name === 'position' ? 'width: 200px; white-space: normal;' : ''"
                      >
                        {{ col.label }}
                        <q-input
                          v-if="col.name !== 'action' && col.name !== 'fd'"
                          dense
                          outlined
                          class="q-mt-sm"
                          v-model="filters[col.name]"
                          placeholder="Search"
                        />
                        <q-select
                          v-if="col.name === 'fd'"
                          dense
                          outlined
                          class="q-mt-sm"
                          v-model="filters[col.name]"
                          :options="['All', 'Yes', 'No']"
                          placeholder="Filter"
                        />
                      </q-th>
                    </q-tr>
                  </template>
                  <!-- Add body cell template for PageNo -->
                  <template v-slot:body-cell-PageNo="props">
                    <q-td :props="props" style="width: 80px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <!-- Add body cell template for ItemNo -->
                  <template v-slot:body-cell-ItemNo="props">
                    <q-td :props="props" style="width: 70px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <!-- Add body cell template for Salary Grade -->
                  <template v-slot:body-cell-SG="props">
                    <q-td :props="props" style="width: 80px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <!-- Add body cell template for position -->
                  <template v-slot:body-cell-position="props">
                    <q-td :props="props" style="width: 230px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <!-- Add body cell template for position -->
                  <template v-slot:body-cell-Name1="props">
                    <q-td :props="props" style="width: 230px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>
                  <!-- for switch -->
                  <template v-slot:body-cell-fd="props">
                    <q-td :props="props">
                      <template v-if="authStore.user.permissions.isFunded == '1'">
                        <q-toggle
                          v-model="props.row.Funded"
                          color="green"
                          true-value="1"
                          false-value="0"
                          checked-icon="check"
                          unchecked-icon="clear"
                          @update:model-value="handleToggle(props.row)"
                          :disable="props.row.Funded === '1'"
                        />
                      </template>
                      <template v-else>
                        <q-badge :color="props.row.Funded === '1' ? 'positive' : 'negative'">
                          {{ props.row.Funded === '1' ? 'Yes' : 'No' }}
                        </q-badge>
                      </template>
                    </q-td>
                  </template>
                  <!-- Add body cell template for position -->
                  <template v-slot:body-cell-Status="props">
                    <q-td :props="props" style="width: 70px; white-space: normal">
                      <q-badge
                        class="q-pa-xs"
                        :class="
                          props.row.Status == 'ELECTIVE'
                            ? 'bg-blue'
                            : props.row.Status == 'APPOINTED'
                              ? 'bg-purple'
                              : props.row.Status == 'CO-TERMINOUS'
                                ? 'bg-brown'
                                : props.row.Status == 'REGULAR'
                                  ? 'bg-green'
                                  : props.row.Status == 'TEMPORARY'
                                    ? 'bg-yellow text-black'
                                    : props.row.Status == 'CASUAL'
                                      ? 'bg-grey-4'
                                      : props.row.Status == 'CONTRACTUAL'
                                        ? 'bg-light-blue'
                                        : props.row.Status == 'HONORARIUM'
                                          ? 'bg-black'
                                          : 'bg-grey'
                        "
                      >
                        {{ props.row.Status }}
                      </q-badge>
                    </q-td>
                  </template>

                  <template v-slot:body-cell-action="props">
                    <q-td :props="props">
                      <q-btn
                        v-if="props.row.Funded != '0'"
                        flat
                        dense
                        round
                        color="blue"
                        class="bg-blue-1"
                        :icon="
                          props.row.Funded == '1' && props.row.Name1 != null
                            ? 'visibility'
                            : 'post_add'
                        "
                        @click="
                          authStore.user.permissions.isFunded == '1'
                            ? viewPosition(props.row)
                            : null
                        "
                      >
                        <q-tooltip>
                          {{
                            props.row.Funded == '1' && props.row.Name1 != null
                              ? 'View QS'
                              : 'Create Job Post'
                          }}
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="props.row.Name1 != null"
                        flat
                        dense
                        round
                        color="green"
                        class="bg-green-1"
                        icon="print"
                        @click="printPosition(props.row)"
                      >
                        <q-tooltip>Print</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                  <!-- button next page -->
                  <template v-slot:bottom>
                    <div class="q-pa-sm row justify-end items-center" style="width: 100%">
                      <q-btn
                        flat
                        round
                        dense
                        icon="chevron_left"
                        :disable="pagination.page === 1"
                        @click="pagination.page--"
                      />
                      <span class="q-mx-sm">
                        Page {{ pagination.page }} /
                        {{ Math.ceil(filteredPositions.length / pagination.rowsPerPage) || 1 }}
                      </span>
                      <q-btn
                        flat
                        round
                        dense
                        icon="chevron_right"
                        :disable="
                          pagination.page * pagination.rowsPerPage >= filteredPositions.length
                        "
                        @click="pagination.page++"
                      />
                    </div>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>

            <div v-else class="text-center q-pa-xl">
              <q-icon name="info" size="3em" color="grey-7" />
              <p class="text-h6 text-grey-8 q-mt-md">
                Select Office from the sidebar to view positions
              </p>
            </div>
          </q-scroll-area>
        </q-card>
      </div>
    </div>

    <!-- separate for modal -->

    <!-- Upload File Modal -->
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Upload Verification File</div>
        </q-card-section>

        <q-card-section>
          <q-file v-model="selectedFile" label="Choose a file" filled />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Confirm" color="green" :disabled="!selectedFile" @click="confirmUpload" />
          <q-btn label="Cancel" color="red" flat @click="cancelUpload" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Vacant Position Modal -->
    <q-dialog v-model="showVacantPositionModal">
      <q-card
        class="q-pa-none"
        style="
          width: 900px;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        "
      >
        <!-- Sticky Header -->
        <q-card-section
          class="q-pa-lg"
          style="position: sticky; top: 0; z-index: 2; background: white"
        >
          <div class="row justify-between">
            <div>
              <div class="text-h4 text-bold">Post A Job</div>
              <div class="text-body text-grey">{{ postJobDetails.position }}</div>
              <q-badge>{{ postJobDetails.PositionID }}</q-badge>
            </div>
            <div>
              <q-btn
                icon="close"
                rounded
                flat
                @click="showVacantPositionModal = !showVacantPositionModal"
              />
            </div>
          </div>
        </q-card-section>

        <!-- Scrollable Body -->
        <q-scroll-area class="q-px-md" style="height: 1000px">
          <q-card-section class="q-py-none">
            <!--  -->
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input v-model="postJobDetails.office" label="Office" outlined dense disable />
              </div>
              <div class="col-6">
                <q-input
                  v-model="postJobDetails.division"
                  label="Division"
                  outlined
                  dense
                  disable
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input v-model="postJobDetails.section" label="Section" outlined dense disable />
              </div>
              <div class="col-6">
                <q-input v-model="postJobDetails.unit" label="Unit" outlined dense disable />
              </div>
            </div>
            <div class="row justify-center q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model="postJobDetails.position"
                  label="Position"
                  outlined
                  dense
                  disable
                />
              </div>
            </div>
            <!--  -->

            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-6">
                <q-input
                  v-model="postJobDetails.startingDate"
                  label="Starting Date"
                  outlined
                  dense
                  mask="date"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="postJobDetails.startingDate"
                          :options="(date) => date >= postJobDetails.endedDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input
                  v-model="postJobDetails.endedDate"
                  label="Ended Date"
                  outlined
                  dense
                  mask="date"
                  :rules="[
                    (date) =>
                      date >= postJobDetails.startingDate || 'End date cannot be before start date',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="postJobDetails.endedDate"
                          :options="(date) => date >= postJobDetails.startingDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="text-h5 q-mb-sm text-bold">Qualification Standard</div>
            <q-table
              :rows="qsDataLoad"
              :columns="[
                { name: 'education', label: 'Education', field: 'Education', align: 'left' },
                { name: 'experience', label: 'Experience', field: 'Experience', align: 'left' },
                { name: 'training', label: 'Training', field: 'Training', align: 'left' },
                { name: 'eligibility', label: 'Eligibility', field: 'Eligibility', align: 'left' },
              ]"
              row-key="id"
              :loading="usePlantilla.qsLoad"
              hide-bottom
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td style="width: 100px; white-space: pre-line; word-break: break-word">
                    {{ props.row.Education }}
                  </q-td>
                  <q-td style="width: 100px; white-space: pre-line; word-break: break-word">
                    {{ props.row.Experience }}
                  </q-td>
                  <q-td style="width: 100px; white-space: pre-line; word-break: break-word">
                    {{ props.row.Training }}
                  </q-td>
                  <q-td style="width: 120px; white-space: pre-line; word-break: break-word">
                    {{ props.row.Eligibility }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-scroll-area>

        <!-- Sticky Footer -->
        <q-card-actions
          align="right"
          class="q-pa-md"
          style="position: sticky; bottom: 0; z-index: 2; background: white"
        >
          <q-btn
            color="primary"
            :loading="usePlantilla.qsLoad"
            :disabled="jobPostStore.loading"
            label="Create Post"
            @click="submitJobPost"
            size="md"
            style="width: 200px"
            rounded
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Quality Standard Modal (now a separate component) -->
    <QualityStandardModal
      v-model:show="showFilledPositionModal"
      variant="employee"
      :applicant-data="selectedApplicant"
      :position-requirements="positionRequirements"
      @view-pds="viewApplicantPDS"
      @close="closeQualificationModal"
      :isPlantilla="true"
    />
    <q-dialog v-model="showPDSModal" backdrop-opacity="0.7">
      <PDSModal v-model="showPDSModal" :applicant="selectedApplicant" @close="closePDSModal" />
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import QualityStandardModal from 'components/QualityStandardModal.vue';
  import PlantillaSelection from 'components/PlantillaSelection.vue';
  import { usePlantillaStore } from 'stores/plantillaStore';
  import PDSModal from 'components/PDSModal.vue';
  import { useAuthStore } from 'stores/authStore';
  import { useJobPostStore } from 'stores/jobPostStore';

  const authStore = useAuthStore();
  const usePlantilla = usePlantillaStore();

  const showModal = ref(false);
  const showVacantPositionModal = ref(false);

  // Watch for modal close and emit event to clear qsDataLoad
  watch(showVacantPositionModal, (val) => {
    if (!val) {
      qsDataLoad.value = [];
      // Optionally emit an event if needed, e.g.:
      // emit('modal-closed', []);
    }
  });

  const closeQualificationModal = () => {
    showFilledPositionModal.value = false;
  };
  const showFilledPositionModal = ref(false);

  const selectedFile = ref(null);
  const currentRow = ref(null);
  const selectedPosition = ref(null);
  const filter = ref('');

  const closePDSModal = () => {
    showPDSModal.value = false;
  };
  const showPDSModal = ref(false);

  const qsDataLoad = ref([]);

  // Add filter object to store search values for each column
  const filters = ref({
    PageNo: '',
    ItemNo: '',
    SG: '',
    position: '',
    Name2: '',
    fd: 'All',
    Status: '',
  });

  const viewApplicantPDS = () => {
    showPDSModal.value = true;
  };

  const positionRequirements = ref({
    education: "Bachelor's Degree in related field",
    preferredEducation: "Master's Degree preferred",
    experience: 'Minimum 3 years relevant experience',
    preferredExperience: '5+ years in leadership role',
    training: 'Certification in relevant field',
    preferredTraining: 'Multiple advanced certifications',
    eligibility: 'Professional license required',
    preferredCertification: 'Additional specialized certifications',
  });

  const selectedApplicant = ref({
    id: null,
    PositionID: '',
    controlno: '',
    name: '',
    photo: '',
    position: '',
    status: 'Pending',
    isSubmitted: false,
    applicationDate: '',
    education: [],
    experience: [],
    training: [],
    eligibility: [],
    personalInfo: {},
  });

  const postJobDetails = ref({
    office: '',
    division: '',
    section: '',
    unit: '',
    position: '',
    startingDate: '',
    endedDate: '',
    PositionID: '',
    PageNo: '',
    ItemNo: '',
    SG: '',
  });

  const qsCriteria = ref({
    PositionID: '',
    Education: '',
    Eligibility: '',
    Experience: '',
    Training: '',
  });

  // Add current structure selection
  const currentStructure = ref(null);

  const pagination = ref({
    page: 1,
    rowsPerPage: 7,
  });

  // const currentPosition = ref('');
  // const higherEducation = ref('');

  const positions = ref([]);

  const columns = [
    { name: 'PageNo', label: 'Page No', field: 'PageNo', align: 'left', sortable: false },
    { name: 'ItemNo', label: 'Item No', field: 'ItemNo', align: 'left', sortable: false },
    { name: 'SG', label: 'Salary Grade', field: 'SG', align: 'left', sortable: false },
    { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: false },
    { name: 'Name1', label: 'Employee', field: 'Name1', align: 'left', sortable: false },
    {
      name: 'fd',
      label: 'Funded',
      field: 'Funded',
      align: 'left',
      sortable: false,
    },
    { name: 'Status', label: 'Status', field: 'Status', align: 'left', sortable: false },
    { name: 'action', label: 'Action', field: 'action', align: 'center' },
  ];

  // Create a computed property to filter the positions based on search inputs and structure selection
  const filteredPositions = computed(() => {
    if (!currentStructure.value) {
      return [];
    }

    let filtered = positions.value.filter((row) => {
      const s = currentStructure.value;

      // Always filter by office
      if (!row.office || row.office !== s.office) return false;

      // Now, filter by the "deepest" selected structure
      if (s.unit) {
        // Must match division, section, unit exactly
        return row.division === s.division && row.section === s.section && row.unit === s.unit;
      } else if (s.section) {
        // Must match division & section, unit must be empty/null
        return (
          row.division === s.division && row.section === s.section && (!row.unit || row.unit === '')
        );
      } else if (s.division) {
        // Must match division, section & unit must be empty/null
        return (
          row.division === s.division &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      } else {
        // Only office selected: division, section, unit must be empty/null
        return (
          (!row.division || row.division === '') &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      }
    });

    // Apply column text filters as before
    return filtered.filter((row) => {
      for (const key in filters.value) {
        if (filters.value[key]) {
          if (key === 'fd') {
            if (filters.value[key] !== 'All') {
              const isYes = filters.value[key] === 'Yes';
              const rowFunded = row.Funded === '1' || row.Funded === true;
              if (isYes !== rowFunded) return false;
            }
          } else {
            const filterValue = String(filters.value[key]).toLowerCase();
            const rowValue = String(row[key] || '').toLowerCase();
            if (!rowValue.includes(filterValue)) return false;
          }
        }
      }
      return true;
    });
  });

  // Handle structure selection from PlantillaSelection component
  const handleStructureSelection = (selectedData) => {
    currentStructure.value = selectedData;
    // Clear search filters when changing structure selection
    clearSearchFilters();
  };

  // Get a descriptive title for the current structure selection
  const getStructureTitle = () => {
    if (!currentStructure.value) return '';

    let title = currentStructure.value.office || '';

    // if (currentStructure.value.division) {
    //   title += ` > ${currentStructure.value.division}`;
    // }

    // if (currentStructure.value.section) {
    //   title += ` > ${currentStructure.value.section}`;
    // }

    // if (currentStructure.value.unit) {
    //   title += ` > ${currentStructure.value.unit}`;
    // }

    return title;
  };

  const handleToggle = (row) => {
    if (row.Funded == '1') {
      // currentRow.value = row;
      showModal.value = true;
    }
  };

  const confirmUpload = () => {
    if (selectedFile.value && currentRow.value) {
      currentRow.value.Funded = '1';
      showModal.value = false;
      selectedFile.value = null;
    }
  };

  const cancelUpload = () => {
    showModal.value = false;
    selectedFile.value = null;
  };
  // view qs
  const viewPosition = async (row) => {
    selectedPosition.value = row;
    if (row.Name1) {
      selectedApplicant.value.controlno = row.ControlNo;
      selectedApplicant.value.PositionID = row.PositionID;
      selectedApplicant.value.name = row.Name4;
      selectedApplicant.value.position = row.position;
      selectedApplicant.value.status = row.Status;
      // higherEducation.value = 'Bachelor of Science in Management';
      showFilledPositionModal.value = true;
    } else {
      showVacantPositionModal.value = true;
      postJobDetails.value.office = row.office;
      postJobDetails.value.division = row.division;
      postJobDetails.value.section = row.section;
      postJobDetails.value.unit = row.unit;
      postJobDetails.value.position = row.position;
      postJobDetails.value.PositionID = row.PositionID;
      postJobDetails.value.PageNo = row.PageNo;
      postJobDetails.value.ItemNo = row.ItemNo;
      postJobDetails.value.SG = row.SG;
      // console.log(postJobDetails.value);
      await usePlantilla.fetchQsData(row.PositionID);
      qsDataLoad.value = usePlantilla.qsData;
      // console.log(usePlantilla.qsData[0].Education);
      qsCriteria.value.Education = usePlantilla.qsData[0].Education;
      qsCriteria.value.Experience = usePlantilla.qsData[0].Experience;
      qsCriteria.value.Eligibility = usePlantilla.qsData[0].Eligibility;
      qsCriteria.value.Training = usePlantilla.qsData[0].Training;
      qsCriteria.value.PositionID = row.PositionID;
    }
  };

  const printPosition = (row) => {
    console.log('Printing:', row);
  };

  const jobPostStore = useJobPostStore();

  const submitJobPost = async () => {
    // Perform the job post submission logic here
    const jobBatch = {
      PositionID: parseInt(postJobDetails.value.PositionID),
      Office: postJobDetails.value.office,
      Office2: null,
      Group: null,
      Division: postJobDetails.value.division,
      Section: postJobDetails.value.section,
      Unit: postJobDetails.value.unit,
      Position: postJobDetails.value.position,
      post_date: postJobDetails.value.startingDate,
      end_date: postJobDetails.value.endedDate,
      PageNo: postJobDetails.value.PageNo,
      ItemNo: postJobDetails.value.ItemNo,
      SalaryGrade: postJobDetails.value.SG,
      salaryMin: null,
      salaryMax: null,
    };

    const jobCriteria = {
      PositionID: parseInt(qsCriteria.value.PositionID),
      EduPercent: '0',
      EliPercent: '0',
      TrainPercent: '0',
      ExperiencePercent: '0',
      Education: qsCriteria.value.Education,
      Eligibility: qsCriteria.value.Eligibility,
      Training: qsCriteria.value.Training,
      Experience: qsCriteria.value.Experience,
    };
    await jobPostStore.insertJobPost({
      jobBatch: jobBatch,
      criteria: jobCriteria,
    });

    showVacantPositionModal.value = false;
  };

  // Clear search filters only (not structure selection)
  const clearSearchFilters = () => {
    Object.keys(filters.value).forEach((key) => {
      if (key === 'fd') {
        filters.value[key] = 'All';
      } else {
        filters.value[key] = '';
      }
    });
  };

  // Clear all filters including structure selection
  const clearFilters = () => {
    clearSearchFilters();
    (filters.value.PageNo = ''),
      (filters.value.ItemNo = ''),
      (filters.value.SG = ''),
      (filters.value.position = ''),
      (filters.value.Name2 = ''),
      (filters.value.fd = 'All'),
      (filters.value.Status = '');
  };

  onMounted(async () => {
    // Fetch data or perform any setup when the component is mounted
    postJobDetails.value.startingDate = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    postJobDetails.value.endedDate = new Date().toISOString().split('T')[0].replace(/-/g, '/');

    await usePlantilla.fetchPlantilla();
    positions.value = usePlantilla.plantilla.map((item) => ({
      ...item,
      Status: item.Status || 'VACANT',
    }));
  });
</script>

<style lang="scss" scoped>
  .custom-breadcrumbs {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 16px;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    :deep(.q-breadcrumbs__el) {
      font-size: 14px;
      color: #1a202c;

      &:hover {
        color: #4299e1;
      }
    }
  }

  // Added styles for search inputs in table header
  :deep(.q-table th) {
    white-space: normal;
    padding-bottom: 8px;
  }

  :deep(.q-table--dense .q-table th) {
    padding-top: 8px;
  }

  :deep(.q-field--outlined) {
    padding: 0;
    margin-top: 4px;
  }
</style>
