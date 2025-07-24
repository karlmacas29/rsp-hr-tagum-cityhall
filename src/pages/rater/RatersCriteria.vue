<template>
  <q-page padding>
    <div class="positions-container">
      <div class="q-pa-md">
        <h6 class="q-my-md text-weight-bold">Positions to Rate</h6>

        <!-- Search and filter -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <q-input
              v-model="search"
              outlined
              dense
              placeholder="Search positions..."
              clearable
              class="filter-component"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-3">
            <q-select
              v-model="filterByOffice"
              :options="OfficeOptions"
              outlined
              dense
              label="Filter by Office"
              clearable
              emit-value
              map-options
              class="filter-component"
            />
          </div>
          <div class="col-3">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              outlined
              dense
              label="Status"
              clearable
              emit-value
              map-options
              class="filter-component"
            />
          </div>
        </div>

        <!-- Positions table -->
        <q-table
          :rows="filteredPositions"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          binary-state-sort
          flat
          bordered
          class="consistent-font"
        >
          <!-- Custom header slot -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                :style="{ width: col.width }"
              >
                {{ col.label }}
              </q-th>
              <q-th auto-width style="width: 5%">Actions</q-th>
            </q-tr>
          </template>

          <!-- Custom body slot -->
          <template v-slot:body="props">
            <q-tr
              :props="props"
              class="cursor-pointer hover-row"
              @click="openRatingForm(props.row)"
            >
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                :style="{ width: col.width }"
              >
                <template v-if="col.name === 'status'">
                  <q-badge :color="getStatusColor(props.row.status)" class="status-badge">
                    {{ props.row.status }}
                  </q-badge>
                </template>
                <template v-else>
                  {{ col.value }}
                </template>
              </q-td>
              <q-td auto-width style="width: 5%">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click.stop="openRatingForm(props.row)"
                />
              </q-td>
            </q-tr>
          </template>

          <!-- No data slot -->
          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-lg">
              <q-icon name="assignment" size="3em" color="grey-5" />
              <span class="q-ml-sm">No positions found</span>
            </div>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Rating Form Component -->
    <RatingForm
      v-model="showRatingForm"
      :position="selectedPosition"
      @submit-ratings="handleSubmitRatings"
    />
  </q-page>
</template>

<script>
  import { ref, computed, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import RatingForm from 'src/components/RatingForm.vue';

  export default {
    name: 'PositionsList',
    components: {
      RatingForm,
    },
    setup() {
      const $q = useQuasar();
      const positions = ref([]);
      const loading = ref(true);
      const search = ref('');
      const filterByOffice = ref(null);
      const statusFilter = ref(null);

      const showRatingForm = ref(false);
      const selectedPosition = ref({});

      const pagination = ref({
        rowsPerPage: 10,
      });

      const columns = [
         {
          name: 'Office',
          label: 'Office',
          field: 'Office',
          sortable: true,
          align: 'left',
          width: '22%',
        },

        {
          name: 'title',
          label: 'Position Title',
          field: 'title',
          sortable: true,
          align: 'left',
          width: '23%',
        },

        {
          name: 'applicants',
          label: 'Applicants',
          field: (row) => row.applicants.length,
          sortable: true,
          align: 'center',
          width: '10%',
        },
       
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          sortable: true,
          align: 'center',
          width: '15%',
        },
      ];

      // Status color mapping
      const getStatusColor = (status) => {
        switch (status) {
          case 'Not Started':
            return 'grey';
          case 'In Progress':
            return 'orange';
          case 'Completed':
            return 'green';
          case 'Overdue':
            return 'red';
          default:
            return 'grey';
        }
      };

      // Computed values for filters
      const OfficeOptions = computed(() => {
        const Offices = [...new Set(positions.value.map((p) => p.Office))];
        return Offices.map((dept) => ({ label: dept, value: dept }));
      });

      const statusOptions = computed(() => {
        const statuses = [...new Set(positions.value.map((p) => p.status))];
        return statuses.map((status) => ({ label: status, value: status }));
      });

      const filteredPositions = computed(() => {
        return positions.value.filter((position) => {
          const searchMatch =
            search.value === '' ||
            position.title.toLowerCase().includes(search.value.toLowerCase()) ||
            position.slots.toLowerCase().includes(search.value.toLowerCase()) ||
            position.Office.toLowerCase().includes(search.value.toLowerCase());

          const OfficeMatch =
            !filterByOffice.value || position.Office === filterByOffice.value;

          const statusMatch = !statusFilter.value || position.status === statusFilter.value;

          return searchMatch && OfficeMatch && statusMatch;
        });
      });

      const openRatingForm = (position) => {
        selectedPosition.value = { ...position };
        showRatingForm.value = true;
      };

      const handleSubmitRatings = (data) => {
        console.log('Ratings submitted:', data);

        const position = positions.value.find((p) => p.id === data.positionId);
        if (position) {
          position.status = 'Completed';
          $q.notify({
            color: 'positive',
            message: `Ratings for ${position.title} have been submitted successfully!`,
            icon: 'check_circle',
            position: 'top',
            timeout: 2000,
          });
        }
      };

      const loadPositions = () => {
        setTimeout(() => {
          positions.value = [
            {
              id: 1,
              slots: '1',
              title: 'City Government Office Head',
              Office: 'DRRM Office',
              deadline: '2025-06-30',
              status: 'Overdue',
              applicants: [
                {
                  id: 1,
                  name: 'ALCOBER, RUEL ANTO',
                  education: 'Masters in Disaster Management',
                  experience: '5 years as Assistant DRRM Officer',
                  training: '60 hours DRRM Training',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 15,
                  trainingScore: 15,
                  performance: 15,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 1,
                },
                {
                  id: 2,
                  name: 'SANTOS, MARIA CLARA',
                  education: 'Bachelor in Public Administration',
                  experience: '3 years in local government',
                  training: '40 hours leadership training',
                  eligibility: 'Civil Service Professional',
                  educationScore: 20,
                  experienceScore: 10,
                  trainingScore: 10,
                  performance: 10,
                  bei: 15,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 2,
                },
                {
                  id: 3,
                  name: 'REYES, JUAN MIGUEL',
                  education: 'PhD in Emergency Management',
                  experience: '8 years in Disaster Response',
                  training: '120 hours DRRM Advanced Training',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 25,
                  trainingScore: 15,
                  performance: 15,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 4,
                  name: 'CRUZ, ANTONIO',
                  education: 'Masters in Public Safety Administration',
                  experience: '7 years in Emergency Management',
                  training: '90 hours Leadership and Crisis Response',
                  eligibility: 'Civil Service Professional',
                  educationScore: 23,
                  experienceScore: 22,
                  trainingScore: 14,
                  performance: 14,
                  bei: 19,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 5,
                  name: 'VILLANUEVA, PATRICIA',
                  education: 'Masters in Environmental Science',
                  experience: '6 years as Environmental Officer',
                  training: '75 hours Disaster Risk Reduction',
                  eligibility: 'Civil Service Professional',
                  educationScore: 22,
                  experienceScore: 20,
                  trainingScore: 13,
                  performance: 14,
                  bei: 18,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 2,
              slots: '2',
              title: 'Information Technology Officer',
              Office: 'IT Office',
              deadline: '2025-07-15',
              status: 'In Progress',
              applicants: [
                {
                  id: 1,
                  name: 'LOPEZ, MICHAEL',
                  education: 'BS Computer Science',
                  experience: '7 years as IT Specialist',
                  training: '120 hours IT Security Training',
                  eligibility: 'Civil Service Professional',
                  educationScore: 23,
                  experienceScore: 22,
                  trainingScore: 14,
                  performance: 14,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'GARCIA, ANA MARIE',
                  education: 'Masters in Information Systems',
                  experience: '5 years as Systems Administrator',
                  training: '80 hours Network Security',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 18,
                  trainingScore: 14,
                  performance: 13,
                  bei: 19,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 3,
                  name: 'TAN, JOSEPH',
                  education: 'Masters in Information Technology',
                  experience: '8 years as Network Administrator',
                  training: '100 hours Cybersecurity',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 4,
                  name: 'REYES, EDUARDO',
                  education: 'PhD in Computer Science',
                  experience: '10 years as IT Director',
                  training: '150 hours Enterprise Systems Management',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 25,
                  trainingScore: 15,
                  performance: 15,
                  bei: 23,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 5,
                  name: 'AQUINO, JENNIFER',
                  education: 'BS Information Technology',
                  experience: '6 years as Database Administrator',
                  training: '90 hours Database Management Systems',
                  eligibility: 'Civil Service Professional',
                  educationScore: 22,
                  experienceScore: 20,
                  trainingScore: 14,
                  performance: 13,
                  bei: 19,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 6,
                  name: 'MENDOZA, PAULO',
                  education: 'Masters in Cybersecurity',
                  experience: '7 years as Security Analyst',
                  training: '110 hours Ethical Hacking',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 14,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 7,
                  name: 'DELA CRUZ, REGINA',
                  education: 'BS Computer Engineering',
                  experience: '5 years as Network Engineer',
                  training: '85 hours Network Infrastructure',
                  eligibility: 'Civil Service Professional',
                  educationScore: 21,
                  experienceScore: 18,
                  trainingScore: 14,
                  performance: 13,
                  bei: 18,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 8,
                  name: 'SANTOS, ROBERTO',
                  education: 'Masters in Software Engineering',
                  experience: '8 years as Systems Developer',
                  training: '120 hours Agile Development',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 9,
                  name: 'BAUTISTA, MANUEL',
                  education: 'BS Computer Science, Certified Cloud Architect',
                  experience: '7 years in Cloud Computing',
                  training: '100 hours Cloud Infrastructure',
                  eligibility: 'Civil Service Professional',
                  educationScore: 23,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 14,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 10,
                  name: 'GONZALES, CRISTINA',
                  education: 'Masters in Data Science',
                  experience: '6 years as Data Analyst',
                  training: '95 hours Big Data Analytics',
                  eligibility: 'Civil Service Professional',
                  educationScore: 23,
                  experienceScore: 20,
                  trainingScore: 14,
                  performance: 13,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 3,
              slots: '2',
              title: 'City Planner IV',
              Office: 'Planning and Development',
              deadline: '2025-07-05',
              status: 'Overdue',
              applicants: [
                {
                  id: 1,
                  name: 'MENDOZA, RAFAEL',
                  education: 'Masters in Urban Planning',
                  experience: '9 years in Urban Development',
                  training: '100 hours GIS and Mapping',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 24,
                  trainingScore: 15,
                  performance: 14,
                  bei: 23,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'TAN, ELIZABETH',
                  education: 'PhD in Regional Planning',
                  experience: '12 years in City Planning',
                  training: '150 hours Urban Design',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 25,
                  trainingScore: 15,
                  performance: 15,
                  bei: 24,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 3,
                  name: 'DIZON, MANUEL',
                  education: 'Masters in Architecture and Urban Planning',
                  experience: '7 years in Urban Planning',
                  training: '85 hours Sustainable Development',
                  eligibility: 'Civil Service Professional',
                  educationScore: 23,
                  experienceScore: 22,
                  trainingScore: 14,
                  performance: 13,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 4,
                  name: 'MIRANDA, ROSARIO',
                  education: 'Masters in Urban and Regional Planning',
                  experience: '8 years in City Development',
                  training: '90 hours Land Use Planning',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 23,
                  trainingScore: 14,
                  performance: 14,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 5,
                  name: 'SANTOS, JAVIER',
                  education: 'BS in Civil Engineering with Urban Planning',
                  experience: '6 years in Infrastructure Planning',
                  training: '75 hours Transportation Planning',
                  eligibility: 'Civil Service Professional',
                  educationScore: 21,
                  experienceScore: 20,
                  trainingScore: 13,
                  performance: 13,
                  bei: 18,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 4,
              slots: '1',
              title: 'City Health Officer',
              Office: 'Health Office',
              deadline: '2025-07-15',
              status: 'Overdue',
              applicants: [
                {
                  id: 1,
                  name: 'DE LEON, CRISTINA',
                  education: 'Doctor of Medicine',
                  experience: '7 years as Assistant Health Officer',
                  training: '200 hours Public Health Management',
                  eligibility: 'Medical Board Passer',
                  educationScore: 25,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'MARTINEZ, CARLOS',
                  education: 'Doctor of Medicine, Masters in Public Health',
                  experience: '10 years in Public Health Administration',
                  training: '250 hours Healthcare Management',
                  eligibility: 'Medical Board Passer',
                  educationScore: 25,
                  experienceScore: 25,
                  trainingScore: 15,
                  performance: 15,
                  bei: 24,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 3,
                  name: 'SANTOS, ELENA',
                  education: 'Doctor of Medicine',
                  experience: '8 years in Rural Health Unit',
                  training: '180 hours Community Health',
                  eligibility: 'Medical Board Passer',
                  educationScore: 25,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 5,
              slots: '1',
              title: 'Environmental Management Specialist',
              Office: 'Environment and Natural Resources',
              deadline: '2025-06-28',
              status: 'Completed',
              applicants: [
                {
                  id: 1,
                  name: 'SANTOS, ROBERTO',
                  education: 'Masters in Environmental Science',
                  experience: '6 years in Environmental Planning',
                  training: '90 hours Environmental Impact Assessment',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 20,
                  trainingScore: 15,
                  performance: 13,
                  bei: 20,
                  totalQS: 92,
                  grandTotal: 92,
                  ranking: 1,
                },
                {
                  id: 2,
                  name: 'REYES, JULIETA',
                  education: 'BS Environmental Engineering',
                  experience: '5 years in Waste Management',
                  training: '75 hours Environmental Compliance',
                  eligibility: 'Civil Service Professional',
                  educationScore: 20,
                  experienceScore: 18,
                  trainingScore: 14,
                  performance: 12,
                  bei: 18,
                  totalQS: 82,
                  grandTotal: 82,
                  ranking: 2,
                },
                {
                  id: 3,
                  name: 'CRUZ, FERNANDO',
                  education: 'PhD in Environmental Management',
                  experience: '8 years in Environmental Protection',
                  training: '120 hours Sustainable Resource Management',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 99,
                  grandTotal: 99,
                  ranking: 0,
                },
              ],
            },
            {
              id: 6,
              slots: '2',
              title: 'Budget Officer III',
              Office: 'Finance Office',
              deadline: '2025-07-10',
              status: 'Not Started',
              applicants: [
                {
                  id: 1,
                  name: 'DELA CRUZ, ANTONIO',
                  education: 'Masters in Public Administration, Major in Fiscal Admin',
                  experience: '7 years as Budget Analyst',
                  training: '90 hours Public Financial Management',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 14,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'GONZALES, MARIA',
                  education: 'BS Accounting, CPA',
                  experience: '6 years in Government Accounting',
                  training: '80 hours Budget Operations',
                  eligibility: 'Civil Service Professional',
                  educationScore: 23,
                  experienceScore: 20,
                  trainingScore: 14,
                  performance: 13,
                  bei: 19,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 3,
                  name: 'VILLANUEVA, RAMON',
                  education: 'Masters in Business Administration',
                  experience: '8 years in Financial Management',
                  training: '100 hours Government Budgeting',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 4,
                  name: 'SANTOS, VICTORIA',
                  education: 'Masters in Economics',
                  experience: '9 years in Fiscal Planning',
                  training: '120 hours Budget Policy Development',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 24,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 7,
              slots: '1',
              title: 'Legal Officer IV',
              Office: 'Legal Office',
              deadline: '2025-07-20',
              status: 'Not Started',
              applicants: [
                {
                  id: 1,
                  name: 'REYES, FRANCISCO',
                  education: 'Bachelor of Laws',
                  experience: '8 years as City Attorney',
                  training: '120 hours Government Legal Practice',
                  eligibility: 'Bar Exam Passer',
                  educationScore: 25,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'BAUTISTA, ANGELA',
                  education: 'Bachelor of Laws, Masters in Public Administration',
                  experience: '10 years in Government Legal Service',
                  training: '150 hours Administrative Law',
                  eligibility: 'Bar Exam Passer',
                  educationScore: 25,
                  experienceScore: 25,
                  trainingScore: 15,
                  performance: 15,
                  bei: 24,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 3,
                  name: 'MENDOZA, JOSE',
                  education: 'Bachelor of Laws',
                  experience: '7 years as Legal Counsel',
                  training: '100 hours Municipal Law',
                  eligibility: 'Bar Exam Passer',
                  educationScore: 24,
                  experienceScore: 22,
                  trainingScore: 14,
                  performance: 13,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 8,
              slots: '3',
              title: 'Engineer III',
              Office: 'Engineering Office',
              deadline: '2025-07-12',
              status: 'In Progress',
              applicants: [
                {
                  id: 1,
                  name: 'SANTOS, RICARDO',
                  education: 'BS Civil Engineering',
                  experience: '6 years in Infrastructure Projects',
                  training: '90 hours Project Management',
                  eligibility: 'Licensed Civil Engineer',
                  educationScore: 23,
                  experienceScore: 20,
                  trainingScore: 14,
                  performance: 13,
                  bei: 19,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'CRUZ, MARICEL',
                  education: 'BS Civil Engineering, Masters in Structural Engineering',
                  experience: '8 years in Government Infrastructure',
                  training: '120 hours Advanced Engineering',
                  eligibility: 'Licensed Civil Engineer',
                  educationScore: 25,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 3,
                  name: 'DELA CRUZ, RAMON',
                  education: 'BS Civil Engineering',
                  experience: '7 years in Municipal Engineering',
                  training: '100 hours Construction Management',
                  eligibility: 'Licensed Civil Engineer',
                  educationScore: 23,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 14,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 4,
                  name: 'FERNANDEZ, GABRIEL',
                  education: 'BS Civil Engineering, Masters in Environmental Engineering',
                  experience: '9 years in Public Works',
                  training: '130 hours Infrastructure Development',
                  eligibility: 'Licensed Civil Engineer',
                  educationScore: 25,
                  experienceScore: 24,
                  trainingScore: 15,
                  performance: 14,
                  bei: 23,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 5,
                  name: 'AQUINO, TERESA',
                  education: 'BS Civil Engineering',
                  experience: '5 years in Construction Management',
                  training: '80 hours Quality Control',
                  eligibility: 'Licensed Civil Engineer',
                  educationScore: 22,
                  experienceScore: 18,
                  trainingScore: 13,
                  performance: 12,
                  bei: 18,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 6,
                  name: 'REYES, BENJAMIN',
                  education: 'BS Civil Engineering, Masters in Transportation Engineering',
                  experience: '7 years in Road Infrastructure',
                  training: '110 hours Transportation Planning',
                  eligibility: 'Licensed Civil Engineer',
                  educationScore: 24,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 13,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 9,
              slots: '1',
              title: 'Human Resource Management Officer',
              Office: 'Human Resources',
              deadline: '2025-06-30',
              status: 'Overdue',
              applicants: [
                {
                  id: 1,
                  name: 'GARCIA, PATRICIA',
                  education: 'Masters in Human Resource Management',
                  experience: '7 years in HR Operations',
                  training: '100 hours Personnel Management',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 14,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'MENDOZA, RODRIGO',
                  education: 'BS Psychology, Masters in Industrial Psychology',
                  experience: '8 years in Personnel Development',
                  training: '120 hours Organizational Development',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 3,
                  name: 'SANTOS, LOURDES',
                  education: 'BS Business Administration, Major in HR',
                  experience: '6 years in Government HR',
                  training: '90 hours Public Personnel Administration',
                  eligibility: 'Civil Service Professional',
                  educationScore: 22,
                  experienceScore: 20,
                  trainingScore: 14,
                  performance: 13,
                  bei: 19,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 4,
                  name: 'CRUZ, ANDRES',
                  education: 'Masters in Public Administration',
                  experience: '9 years in Personnel Management',
                  training: '130 hours Strategic HR',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 24,
                  trainingScore: 15,
                  performance: 14,
                  bei: 23,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
            {
              id: 10,
              slots: '2',
              title: 'Tourism Officer II',
              Office: 'Tourism Office',
              deadline: '2025-07-08',
              status: 'Not Started',
              applicants: [
                {
                  id: 1,
                  name: 'REYES, LUCIANA',
                  education: 'BS Tourism Management',
                  experience: '5 years in Tourism Promotion',
                  training: '80 hours Tourism Development',
                  eligibility: 'Civil Service Professional',
                  educationScore: 22,
                  experienceScore: 18,
                  trainingScore: 13,
                  performance: 12,
                  bei: 18,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 2,
                  name: 'GONZALES, EDUARDO',
                  education: 'Masters in Tourism Management',
                  experience: '7 years in Tourism Planning',
                  training: '100 hours Sustainable Tourism',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 13,
                  bei: 21,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 3,
                  name: 'SANTOS, GLORIA',
                  education: 'BS Hospitality Management',
                  experience: '6 years in Destination Marketing',
                  training: '90 hours Cultural Tourism',
                  eligibility: 'Civil Service Professional',
                  educationScore: 23,
                  experienceScore: 20,
                  trainingScore: 14,
                  performance: 13,
                  bei: 19,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 4,
                  name: 'DELA CRUZ, CARMEN',
                  education: 'Masters in Sustainable Tourism',
                  experience: '8 years in Tourism Development',
                  training: '120 hours Tourism Planning',
                  eligibility: 'Civil Service Professional',
                  educationScore: 25,
                  experienceScore: 23,
                  trainingScore: 15,
                  performance: 14,
                  bei: 22,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
                {
                  id: 5,
                  name: 'FERNANDEZ, MANUEL',
                  education: 'BS Tourism, Masters in Public Administration',
                  experience: '7 years in Event Management',
                  training: '110 hours Destination Marketing',
                  eligibility: 'Civil Service Professional',
                  educationScore: 24,
                  experienceScore: 22,
                  trainingScore: 15,
                  performance: 14,
                  bei: 20,
                  totalQS: 0,
                  grandTotal: 0,
                  ranking: 0,
                },
              ],
            },
          ];

          // Update overdue statuses based on current date
          const currentDate = new Date('2025-07-10');
          positions.value.forEach((position) => {
            const deadlineDate = new Date(position.deadline);
            if (deadlineDate < currentDate && position.status !== 'Completed') {
              position.status = 'Overdue';
            }
          });

          loading.value = false;
        }, 500);
      };

      onMounted(() => {
        loadPositions();
      });

      return {
        positions,
        loading,
        columns,
        pagination,
        search,
        filterByOffice,
        statusFilter,
        OfficeOptions,
        statusOptions,
        filteredPositions,
        showRatingForm,
        selectedPosition,
        getStatusColor,
        openRatingForm,
        handleSubmitRatings,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .positions-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .hover-row {
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }

  .consistent-font {
    font-size: 0.9rem;
  }

  :deep(.q-table) {
    th,
    td {
      font-size: 1rem;
    }

    table {
      table-layout: fixed;
      width: 100%;
    }
  }

  .status-badge {
    font-size: 0.9rem !important;
    font-weight: normal;
    padding: 2px 8px;
  }

  .filter-component {
    :deep(.q-field__native),
    :deep(.q-field__prefix),
    :deep(.q-field__suffix),
    :deep(input),
    :deep(.q-field__label) {
      font-size: 1rem !important;
    }

    :deep(.q-field__marginal) {
      height: 40px;
    }
  }

  :deep(.q-menu) {
    .q-item,
    .q-item__label {
      font-size: 1rem !important;
      min-height: 32px;
      padding: 4px 16px;
    }
  }

  :deep(.q-select__dropdown-icon) {
    font-size: 2rem;
  }

  :deep(.q-select[label='Status']) {
    .q-item,
    .q-item__label {
      font-size: 0.9rem !important;
    }
  }

  :deep(.q-notification) {
    font-size: 1rem;
  }
</style>
