<template>
  <q-page>
    <div class="row justify-center items-center" style="height: 89vh">
      <!-- Structure Selection Sidebar -->
      <div class="col-3 q-pa-sm">
        <PlantillaSelection
          :positions="positions"
          @structure-selected="handleStructureSelection"
        ></PlantillaSelection>
      </div>

      <!-- Main Content Area -->
      <div class="col-9 q-gutter-md">
        <q-card>
          <q-scroll-area class="q-pa-sm" style="height: 82vh">
            <!-- Structure Title and Clear Button -->
            <q-card
              flat
              v-if="getStructureTitle() != ''"
              class="row justify-between items-center q-pa-sm"
            >
              <div class="text-h6 text-bold q-mb-md" style="width: 500px">
                {{ getStructureTitle() }}
              </div>
              <div>
                <q-btn rounded color="primary" @click="clearFilters" icon="clear_all">
                  Clear All
                </q-btn>
              </div>
            </q-card>

            <!-- Positions Table -->
            <q-card flat v-if="currentStructure">
              <q-separator />
              <q-card-section>
                <q-table
                  :key="tableKey"
                  flat
                  bordered
                  :rows="filteredPositions"
                  :columns="columns"
                  :row-key="rowKey"
                  :filter="filter"
                  :pagination="pagination"
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

                  <!-- Table Body Cells -->
                  <template v-slot:body-cell-PageNo="props">
                    <q-td :props="props" style="width: 80px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-ItemNo="props">
                    <q-td :props="props" style="width: 80px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-SG="props">
                    <q-td :props="props" style="width: 80px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-position="props">
                    <q-td :props="props" style="width: 230px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-Name1="props">
                    <q-td :props="props" style="width: 230px; white-space: normal">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-fd="props">
                    <q-td :props="props">
                      <template v-if="authStore.user.permissions.isFunded == '1'">
                        <template v-if="props.row.Name1 && props.row.Name1 !== ''">
                          <q-toggle
                            :model-value="props.row.Funded"
                            color="green"
                            true-value="1"
                            false-value="0"
                            checked-icon="check"
                            unchecked-icon="clear"
                            :disable="true"
                          >
                            <template v-slot:label>
                              <q-tooltip>Position is locked because it has an employee.</q-tooltip>
                            </template>
                          </q-toggle>
                        </template>
                        <template v-else>
                          <q-toggle
                            :model-value="props.row.Funded"
                            color="green"
                            true-value="1"
                            false-value="0"
                            checked-icon="check"
                            unchecked-icon="clear"
                            :disable="hasJobPost(props.row) && props.row.Funded === '1'"
                            @update:model-value="(val) => handleToggle(props.row, val)"
                          >
                            <template
                              v-if="hasJobPost(props.row) && props.row.Funded === '1'"
                              v-slot:label
                            >
                              <q-tooltip>
                                Position cannot be unfunded because it has an active job post.
                              </q-tooltip>
                            </template>
                          </q-toggle>
                        </template>
                      </template>
                      <template v-else>
                        <q-badge
                          rounded
                          :color="props.row.Funded === '1' ? 'positive' : 'negative'"
                        >
                          {{ props.row.Funded === '1' ? 'Yes' : 'No' }}
                        </q-badge>
                      </template>
                    </q-td>
                  </template>

                  <template v-slot:body-cell-Status="props">
                    <q-td :props="props" style="width: 70px; white-space: normal">
                      <q-badge
                        rounded
                        dense
                        class="q-pa-xs text-white"
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

                  <!-- Action Buttons -->
                  <template v-slot:body-cell-action="props">
                    <q-td :props="props" class="q-gutter-x-sm">
                      <!-- Show job post button only if Funded==1, Name1 is null, and there is no existing job post for this funded position -->
                      <q-btn
                        v-if="
                          props.row.Funded == '1' &&
                          !props.row.Name1 &&
                          !hasJobPost(props.row) &&
                          props.row.status == 'assessed'
                        "
                        flat
                        dense
                        round
                        color="green"
                        class="bg-green-1"
                        icon="post_add"
                        @click="
                          authStore.user.permissions.isFunded == '1'
                            ? viewPosition(props.row)
                            : null
                        "
                      >
                        <q-tooltip>Create Job Post</q-tooltip>
                      </q-btn>

                      <!-- Show view job post icon if job post exists -->
                      <q-btn
                        v-if="hasJobPost(props.row)"
                        flat
                        dense
                        round
                        color="green"
                        class="bg-green-1"
                        icon="work"
                        @click="viewJobPost(props.row)"
                      >
                        <q-tooltip>View Job Post</q-tooltip>
                      </q-btn>

                      <!-- Show qualification/view if Funded==1 and Name1 exists -->
                      <q-btn
                        v-if="props.row.Funded == '1' && props.row.Name1"
                        flat
                        dense
                        round
                        color="blue"
                        class="bg-blue-1"
                        icon="visibility"
                        @click="
                          authStore.user.permissions.isFunded == '1'
                            ? viewPosition(props.row)
                            : null
                        "
                      >
                        <q-tooltip>View Qualification Standard</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="props.row.Name1"
                        flat
                        dense
                        round
                        color="black"
                        class="bg-grey-4"
                        icon="print"
                        @click="printPosition(props.row)"
                      >
                        <q-tooltip>Print PDS</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>

                  <!-- Pagination Controls -->
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

            <!-- Empty State -->
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

    <!-- Reports Modal -->
    <q-dialog v-model="showReportModal" persistent>
      <Reports v-model="showReportModal" :employee="reportRow" @close="showReportModal = false" />
    </q-dialog>

    <!-- Funded Toggle Confirmation Modal -->
    <q-dialog v-model="showFundedConfirmModal" persistent>
      <q-card style="width: 400px; max-width: 90vw">
        <q-card-section class="q-pa-md">
          <div class="row items-center q-mb-sm">
            <q-icon
              :name="fundedToggleValue === '1' ? 'check_circle' : 'highlight_off'"
              :color="fundedToggleValue === '1' ? 'positive' : 'negative'"
              size="36px"
              class="q-mr-md"
            />
            <div class="text-h6">
              Confirm {{ fundedToggleValue === '1' ? 'Funded' : 'Unfunded' }} Status
            </div>
          </div>
          <div class="q-mt-md text-subtitle1">
            Are you sure you want to set this position as
            <span
              class="text-bold"
              :class="fundedToggleValue === '1' ? 'text-positive' : 'text-negative'"
            >
              {{ fundedToggleValue === '1' ? 'Funded' : 'Unfunded' }}
            </span>
            ?
          </div>
          <div
            v-if="fundedToggleValue === '0' && hasJobPost(fundedToggleRow)"
            class="text-negative q-mt-md"
          >
            <q-icon name="warning" class="q-mr-xs" />
            This position cannot be unfunded because it has an active job post.
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            color="grey-8"
            @click="showFundedConfirmModal = false"
            class="q-mr-sm"
          />
          <q-btn
            :color="fundedToggleValue === '1' ? 'primary' : 'negative'"
            :label="fundedToggleValue === '1' ? 'Confirm Funded' : 'Confirm Unfunded'"
            @click="confirmSetFunded"
            :disable="fundedToggleValue === '0' && hasJobPost(fundedToggleRow)"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Job Posting Modal -->
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
        <q-card-section
          class="q-pa-md"
          style="position: sticky; top: 0; z-index: 2; background: white"
        >
          <div class="row justify-between">
            <div>
              <div class="text-h5 text-bold">Post A Job</div>
              <div class="text-body text-grey-8 text-bold">
                {{ postJobDetails.position }}
              </div>
              <q-chip dense>
                Position Level:
                <q-badge rounded dense color="green" class="text-white q-ml-sm">
                  {{ postJobDetails.level }}
                </q-badge>
              </q-chip>
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

        <q-scroll-area class="q-px-md" style="height: 1000px">
          <q-card-section class="q-py-none">
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

          <!-- Upload Funded File Section -->
          <q-card-section>
            <div class="text-h6 q-mb-sm">
              Upload Plantilla Funded PDF
              <span class="text-negative">*</span>
            </div>
            <q-file
              v-model="postJobDetails.selectedFile"
              borderless
              clearable
              accept=".pdf"
              :max-files="1"
              label="Upload PDF file (Max 5MB)"
              style="width: 330px; border: 2px dashed #ccc; border-radius: 8px"
              class="q-mx-auto q-mb-md"
              :rules="[(val) => !!val || 'Please upload the  PDF file .']"
            >
              <template v-slot:prepend>
                <q-icon name="upload_file" size="2em" color="grey-7" />
              </template>
            </q-file>
          </q-card-section>
        </q-scroll-area>

        <q-card-actions
          align="center"
          class="q-pa-md row justify-between items-center"
          style="position: sticky; bottom: 0; z-index: 2; background: white"
        >
          <q-input
            outlined
            dense
            label="Set Page No."
            type="number"
            v-model="postJobDetails.PageNo"
          />

          <q-btn
            color="primary"
            :loading="usePlantilla.qsLoad"
            :disabled="jobPostStore.loading || !postJobDetails.selectedFile"
            label="Create Post"
            @click="submitJobPost"
            size="md"
            style="width: 200px"
            rounded
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Quality Standard Modal -->
    <QualityStandardModal
      v-model:show="showFilledPositionModal"
      variant="employee"
      :applicant-data="selectedApplicant"
      :position-requirements="positionRequirements"
      @view-pds="viewApplicantPDS"
      @close="closeQualificationModal"
      :isPlantilla="true"
    />

    <!-- PDS Modal -->
    <q-dialog v-model="showPDSModal" backdrop-opacity="0.7">
      <PDSModal v-model="showPDSModal" :applicant="selectedApplicant" @close="closePDSModal" />
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import QualityStandardModal from 'components/QualityStandardModal.vue';
  import PlantillaSelection from 'components/PlantillaSelection.vue';
  import { usePlantillaStore } from 'stores/plantillaStore';
  import PDSModal from 'components/PDSModal.vue';
  import Reports from 'src/components/Reports/TabModal.vue';
  import { useAuthStore } from 'stores/authStore';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { toast } from 'src/boot/toast';
  import axios from 'axios';
  import { useLogsStore } from 'stores/logsStore';
  // import Experience from '@/components/Applicant_pds/experience.vue';

  const router = useRouter();
  const authStore = useAuthStore();
  const usePlantilla = usePlantillaStore();
  const logStore = useLogsStore();
  const jobPostStore = useJobPostStore();

  const showReportModal = ref(false);
  const reportRow = ref(null);
  const showFundedConfirmModal = ref(false);
  const fundedToggleRow = ref(null);
  const fundedToggleValue = ref('1');
  const showVacantPositionModal = ref(false);
  const showFilledPositionModal = ref(false);
  const showPDSModal = ref(false);
  const selectedPosition = ref(null);
  const filter = ref('');
  const qsDataLoad = ref([]);
  const currentStructure = ref(null);

  const selectedApplicant = ref({
    id: null,
    level: '',
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
    level: '',
    selectedFile: null,
  });

  const qsCriteria = ref({
    PositionID: '',
    Education: '',
    Eligibility: '',
    Experience: '',
    Training: '',
  });

  const positionRequirements = ref([]);

  const pagination = ref({
    page: 1,
    rowsPerPage: 7,
  });

  const positions = ref([]);

  const filters = ref({
    PageNo: '',
    ItemNo: '',
    SG: '',
    position: '',
    Name2: '',
    fd: 'All',
    Status: '',
  });

  const tableKey = ref(0);

  // Check if job post exists for a position by comparing with jobPostStore.jobPosts
  const hasJobPost = (row) => {
    if (!row || !jobPostStore.jobPosts) return false;

    const exists = jobPostStore.jobPosts.some(
      (jp) =>
        String(jp.PositionID) === String(row.PositionID) &&
        String(jp.ItemNo) === String(row.ItemNo),
    );

    return exists;
  };

  // Navigate to job post details page
  const viewJobPost = (row) => {
    router.push({
      name: 'JobPost View',
      params: {
        PositionID: row.PositionID,
        ItemNo: row.ItemNo,
      },
    });
  };

  const columns = [
    { name: 'PageNo', label: 'Page No', field: 'PageNo', align: 'left', sortable: false },
    { name: 'ItemNo', label: 'Item No', field: 'ItemNo', align: 'left', sortable: false },
    { name: 'SG', label: 'Salary Grade', field: 'SG', align: 'left', sortable: false },
    { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: false },
    { name: 'Name1', label: 'Employee', field: 'Name1', align: 'left', sortable: false },
    { name: 'fd', label: 'Funded', field: 'Funded', align: 'left', sortable: false },
    { name: 'Status', label: 'Status', field: 'Status', align: 'left', sortable: false },
    { name: 'action', label: 'Action', field: 'action', align: 'center' },
  ];

  const filteredPositions = computed(() => {
    if (!currentStructure.value) {
      return [];
    }

    let filtered = positions.value.filter((row) => {
      const s = currentStructure.value;

      if (!row.office || row.office !== s.office) return false;

      if (s.unit) {
        return row.division === s.division && row.section === s.section && row.unit === s.unit;
      } else if (s.section) {
        return (
          row.division === s.division && row.section === s.section && (!row.unit || row.unit === '')
        );
      } else if (s.division) {
        return (
          row.division === s.division &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      } else {
        return (
          (!row.division || row.division === '') &&
          (!row.section || row.section === '') &&
          (!row.unit || row.unit === '')
        );
      }
    });

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

  const handleStructureSelection = (selectedData) => {
    currentStructure.value = selectedData;
    clearSearchFilters();
  };

  const getStructureTitle = () => {
    if (!currentStructure.value) return '';
    return currentStructure.value.office || '';
  };

  const rowKey = (row) => `${row.PositionID}-${row.ItemNo}`;

  const viewPosition = async (row) => {
    selectedPosition.value = row;
    if (row.Name1) {
      selectedApplicant.value.controlno = row.ControlNo;
      selectedApplicant.value.PositionID = row.PositionID;
      selectedApplicant.value.name = row.Name4;
      selectedApplicant.value.position = row.position;
      selectedApplicant.value.status = row.Status;
      selectedApplicant.value.level = row.level;
      showFilledPositionModal.value = true;
    } else {
      showVacantPositionModal.value = true;
      postJobDetails.value = {
        office: row.office,
        division: row.division,
        section: row.section,
        unit: row.unit,
        position: row.position,
        PositionID: row.PositionID,
        PageNo: row.PageNo,
        ItemNo: row.ItemNo,
        SG: row.SG,
        startingDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
        endedDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
        level: row.level,
        selectedFile: null,
      };
      await usePlantilla.fetchQsData(row.PositionID);
      qsDataLoad.value = usePlantilla.qsData;
      if (usePlantilla.qsData && usePlantilla.qsData.length > 0) {
        qsCriteria.value = {
          Education: usePlantilla.qsData[0].Education,
          Experience: usePlantilla.qsData[0].Experience,
          Eligibility: usePlantilla.qsData[0].Eligibility,
          Training: usePlantilla.qsData[0].Training,
          PositionID: row.PositionID,
        };
      }
    }
  };

  // const printPosition = (row) => {
  //   reportRow.value = row;
  //   showReportModal.value = true;
  // };
  // In your main component, update the printPosition method:
  const printPosition = async (row) => {
    try {
      // Fetch appointment data using ControlNo
      const appointmentData = await usePlantilla.fetchAppointmentData(row.ControlNo);

      if (appointmentData) {
        // Set the appointment data and open the modal
        reportRow.value = {
          ...row,
          appointmentData: appointmentData,
        };
        showReportModal.value = true;
      } else {
        toast.error('No appointment data found for this employee');
      }
    } catch (error) {
      console.error('Error fetching appointment data:', error);
      toast.error('Failed to fetch appointment data');
    }
  };

  // Submit job post with proper state management
  const submitJobPost = async () => {
    if (!postJobDetails.value.selectedFile) {
      toast.error('Please upload funded plantilla PDF.');
      return;
    }

    try {
      // Upload funded file first
      await uploadFileToServer(
        postJobDetails.value.selectedFile,
        postJobDetails.value.PositionID,
        postJobDetails.value.ItemNo,
      );

      await updateFundedStatusAPI(
        postJobDetails.value.PositionID,
        true,
        postJobDetails.value.ItemNo,
      );

      // Then create job post
      const jobBatch = {
        PositionID: parseInt(postJobDetails.value.PositionID),
        Office: postJobDetails.value.office,
        Office2: null,
        Group: null,
        Division: postJobDetails.value.division,
        Section: postJobDetails.value.section,
        Unit: postJobDetails.value.unit,
        Position: postJobDetails.value.position,
        post_date: postJobDetails.value.startingDate.replace(/\//g, '-'),
        end_date: postJobDetails.value.endedDate.replace(/\//g, '-'),
        PageNo: postJobDetails.value.PageNo,
        ItemNo: postJobDetails.value.ItemNo,
        SalaryGrade: postJobDetails.value.SG,
        level: postJobDetails.value.level,
        salaryMin: null,
        salaryMax: null,
      };

      const jobCriteria = {
        ItemNo: parseInt(postJobDetails.value.ItemNo),
        PositionID: parseInt(qsCriteria.value.PositionID),
        Education: qsCriteria.value.Education,
        Experience: qsCriteria.value.Experience,
        Eligibility: qsCriteria.value.Eligibility,
        Training: qsCriteria.value.Training,
      };

      await jobPostStore.insertJobPost({
        jobBatch: jobBatch,
        criteria: jobCriteria,
      });

      await updatePageNoAPI(
        postJobDetails.value.PositionID,
        postJobDetails.value.PageNo,
        postJobDetails.value.ItemNo,
      );

      showVacantPositionModal.value = false;

      logStore.logAction(
        `${authStore.user.name} created a job post for ${postJobDetails.value.position}. PositionID: ${postJobDetails.value.PositionID}, ItemNo: ${postJobDetails.value.ItemNo}`,
      );

      // Update Funded status in positions list for immediate UI feedback
      const idx = positions.value.findIndex(
        (p) =>
          String(p.PositionID) === String(postJobDetails.value.PositionID) &&
          String(p.ItemNo) === String(postJobDetails.value.ItemNo),
      );
      if (idx !== -1) {
        positions.value[idx].Funded = '1';
      }

      // Fetch job posts from jobPostStore to update the UI
      await jobPostStore.job_post();

      // Force table to re-render
      tableKey.value++;

      toast.success('Job post successfully created, file uploaded, and details updated!');
    } catch (error) {
      console.error('Error creating job post:', error);
      toast.error('Failed to create job post. Please try again.');
    }
  };

  const clearSearchFilters = () => {
    Object.keys(filters.value).forEach((key) => {
      if (key === 'fd') {
        filters.value[key] = 'All';
      } else {
        filters.value[key] = '';
      }
    });
  };

  const clearFilters = () => {
    clearSearchFilters();
  };

  const closeQualificationModal = () => {
    showFilledPositionModal.value = false;
  };

  const closePDSModal = () => {
    showPDSModal.value = false;
  };

  const viewApplicantPDS = () => {
    showPDSModal.value = true;
  };

  const uploadFileToServer = (fileToUpload, positionId, itemNo) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('fileUpload', fileToUpload);
      formData.append('PositionID', positionId);
      formData.append('ItemNo', itemNo);

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('admin_token='))
        ?.split('=')[1];

      const requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      axios
        .post(`${process.env.VUE_APP_API_URL}/plantilla/funded`, formData, requestConfig)
        .then((response) => {
          resolve({
            url: response.data?.data?.fileUpload ?? '',
          });
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
          toast.error('Error -> ' + errorMessage);
          reject(new Error(errorMessage));
        });
    });
  };

  const updateFundedStatusAPI = (positionId, isFunded, itemNo) => {
    return new Promise((resolve, reject) => {
      if (!positionId || !itemNo) {
        const errorMessage = 'PositionID or ItemNo is required for updating funded status.';
        toast.error(errorMessage);
        return reject(new Error(errorMessage));
      }

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('admin_token='))
        ?.split('=')[1];

      const requestConfig = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      const payload = {
        PositionID: positionId,
        Funded: !!isFunded,
        ItemNo: itemNo,
      };

      axios
        .post(
          `${process.env.VUE_APP_API_URL}/structure-details/update-funded`,
          payload,
          requestConfig,
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message || error.message || 'Failed to update funded status.';
          toast.error('Error -> ' + errorMessage);
          reject(new Error(errorMessage));
        });
    });
  };

  const updatePageNoAPI = (positionId, pageNo, itemNo) => {
    return new Promise((resolve, reject) => {
      if (!positionId || !itemNo) {
        const errorMessage = 'PositionID or ItemNo is required for updating PageNo.';
        toast.error(errorMessage);
        return reject(new Error(errorMessage));
      }

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('admin_token='))
        ?.split('=')[1];

      const requestConfig = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      const payload = {
        PositionID: String(positionId),
        PageNo: String(pageNo),
        ItemNo: String(itemNo),
      };

      axios
        .post(
          `${process.env.VUE_APP_API_URL}/structure-details/update-pageno`,
          payload,
          requestConfig,
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          let errorMessage;
          if (error.response?.data?.errors) {
            errorMessage = Object.values(error.response.data.errors).flat().join('; ');
          } else {
            errorMessage =
              error.response?.data?.message || error.message || 'Failed to update PageNo.';
          }
          toast.error('Error -> ' + errorMessage);
          reject(new Error(errorMessage));
        });
    });
  };

  const handleToggle = (row, val) => {
    // Don't allow toggle to unfunded if there's an active job post
    if (val === '0' && hasJobPost(row)) {
      toast.warning('Cannot unfund a position with an active job post.');
      return;
    }

    fundedToggleRow.value = row;
    fundedToggleValue.value = val;
    showFundedConfirmModal.value = true;
  };

  const confirmSetFunded = async () => {
    if (fundedToggleRow.value) {
      try {
        // Double-check to prevent unfunding a position with a job post
        if (fundedToggleValue.value === '0' && hasJobPost(fundedToggleRow.value)) {
          toast.error(
            'Cannot unfund a position with an active job post. Please remove the job post first.',
          );
          showFundedConfirmModal.value = false;
          return;
        }

        await updateFundedStatusAPI(
          fundedToggleRow.value.PositionID,
          fundedToggleValue.value === '1',
          fundedToggleRow.value.ItemNo,
        );

        fundedToggleRow.value.Funded = fundedToggleValue.value;

        // Refresh job posts data if needed
        await jobPostStore.job_post(); // <- Make sure this is a function returning a Promise
        tableKey.value++; // <- Triggers table re-render if used as :key

        if (fundedToggleValue.value === '1') {
          toast.success('Position set as Funded');
        } else {
          toast.error('Position set as Unfunded');
        }
      } catch (error) {
        console.error('Error updating funded status:', error);
        toast.error('Failed to update funded status.');
      } finally {
        showFundedConfirmModal.value = false;
      }
    }
  };

  // Initialize component
  onMounted(async () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    postJobDetails.value.startingDate = today;
    postJobDetails.value.endedDate = today;

    try {
      await usePlantilla.fetchPlantilla();
      positions.value = usePlantilla.plantilla.map((item) => ({
        ...item,
        Status: item.Status || 'VACANT',
      }));

      // Fetch job posts from jobPostStore on mount
      await jobPostStore.job_post();
    } catch (error) {
      console.error('Error initializing component:', error);
      toast.error('Failed to load data. Please refresh the page.');
    }
  });

  // Watch for modal close to clean up data
  watch(showVacantPositionModal, (val) => {
    if (!val) {
      qsDataLoad.value = [];
    }
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
