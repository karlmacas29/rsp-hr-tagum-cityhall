<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Header Section -->
      <div class="row q-mb-md">
        <div class="col-9">
          <h4 class="q-mt-none q-mb-sm text-weight-bold">
            Rating Form for Qualification Standards
          </h4>
          <div class="text-subtitle1">
            Position Title: City Government Department Head (Local Disaster Risk Reduction and
            Management Officer)
          </div>
          <div class="text-subtitle2">Plantilla Code: CDRRMO x-23</div>
        </div>
        <div class="col-3 flex justify-end">
          <q-btn color="green" label="Submit Ratings" class="q-py-sm" @click="submitRatings" />
        </div>
      </div>

      <!-- Qualification Standards Table -->
      <div class="q-mb-lg">
        <q-table
          :rows="[{}]"
          :columns="qualificationColumns"
          row-key="id"
          hide-bottom
          flat
          bordered
          class="qualification-table"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="bg-light-green-1 text-center"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="education" :props="props" class="text-center">Bachelor's Degree</q-td>
              <q-td key="experience" :props="props" class="text-center">Something</q-td>
              <q-td key="training" :props="props" class="text-center">Something</q-td>
              <q-td key="eligibility" :props="props" class="text-center">Something</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- Applicant QS Table -->
      <div class="q-mb-lg">
        <h5 class="q-mt-lg q-mb-md">Applicant QS</h5>
        <q-table
          :rows="applicants"
          :columns="applicantQSColumns"
          row-key="id"
          hide-bottom
          flat
          bordered
          class="applicant-qs-table"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props" class="text-weight-medium">
                {{ props.row.id }}. {{ props.row.name }}
              </q-td>
              <q-td key="education" :props="props">
                {{ props.row.education }}
                <div v-if="props.row.educationScore" class="text-right q-mt-xs">
                  {{ props.row.educationScore }}
                </div>
              </q-td>
              <q-td key="experience" :props="props">
                {{ props.row.experience }}
                <div v-if="props.row.experienceScore" class="text-right q-mt-xs">
                  {{ props.row.experienceScore }}
                </div>
              </q-td>
              <q-td key="training" :props="props">
                {{ props.row.training }}
                <div v-if="props.row.trainingScore" class="text-right q-mt-xs">
                  {{ props.row.trainingScore }}
                </div>
              </q-td>
              <q-td key="eligibility" :props="props">
                {{ props.row.eligibility }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- Applicant Ratings Section -->
      <div>
        <h5 class="q-mt-lg q-mb-md">Applicant Ratings</h5>
        <q-table
          :rows="applicants"
          :columns="ratingColumns"
          row-key="id"
          hide-bottom
          flat
          bordered
          class="ratings-table"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="bg-light-green-1"
                :style="col.style"
              >
                <div>{{ col.label }}</div>
                <div v-if="col.sublabel" class="text-caption">{{ col.sublabel }}</div>
              </q-th>
            </q-tr>
          </template>

          <template v-slot:top-row>
            <q-tr>
              <q-td></q-td>
              <q-td class="bg-grey-2">
                <div class="text-weight-bold">HIGH SCORE INDICATOR FOR EDUCATION</div>
                <div class="text-caption q-mt-sm">
                  Completion of relevant college degree (Master Degree / Professional Board /
                  Doctorate Degree)
                  <br />
                  25%
                </div>
              </q-td>
              <q-td class="bg-grey-2">
                <div class="text-weight-bold">RELEVANT EXPERIENCE</div>
                <div class="text-caption q-mt-sm">
                  None required - 0
                  <br />
                  With direct supervisory experience with exemplary rating in at least 2 rating
                  periods - the "Very Good" = 15%
                  <br />
                  None - 0
                  <br />
                  With Work Experience = 10%
                </div>
              </q-td>
              <q-td class="bg-grey-2">
                <div class="text-weight-bold">RELEVANT TRAINING</div>
                <div class="text-caption q-mt-sm">
                  None required - 0
                  <br />
                  Up to 40 hours of training = 15%
                  <br />
                  None or less than required training = 0
                </div>
              </q-td>
              <q-td class="bg-grey-2">
                <div class="text-weight-bold">PDS Integrity/ PPSB</div>
                <div class="text-caption q-mt-sm">
                  Outstanding = 15%
                  <br />
                  Very Satisfactory = 7%
                  <br />
                  Below VS rating = 0
                </div>
              </q-td>
              <q-td></q-td>
              <q-td></q-td>
              <q-td></q-td>
              <q-td></q-td>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props" class="text-weight-medium">
                {{ props.row.id }}. {{ props.row.name }}
              </q-td>

              <!-- Education Rating -->
              <q-td key="education" :props="props">
                <q-input
                  v-model.number="props.row.ratings.education"
                  type="number"
                  dense
                  min="0"
                  max="25"
                  @update:model-value="calculateTotals(props.row)"
                />
              </q-td>

              <!-- Experience Rating -->
              <q-td key="experience" :props="props">
                <q-input
                  v-model.number="props.row.ratings.experience"
                  type="number"
                  dense
                  min="0"
                  max="25"
                  @update:model-value="calculateTotals(props.row)"
                />
              </q-td>

              <!-- Training Rating -->
              <q-td key="training" :props="props">
                <q-input
                  v-model.number="props.row.ratings.training"
                  type="number"
                  dense
                  min="0"
                  max="15"
                  @update:model-value="calculateTotals(props.row)"
                />
              </q-td>

              <!-- Performance Rating -->
              <q-td key="performance" :props="props">
                <q-input
                  v-model.number="props.row.ratings.performance"
                  type="number"
                  dense
                  min="0"
                  max="15"
                  @update:model-value="calculateTotals(props.row)"
                />
              </q-td>

              <!-- Total QS -->
              <q-td key="totalQS" :props="props" class="text-center text-weight-medium">
                {{ props.row.totals.qs }}
              </q-td>

              <!-- BEI -->
              <q-td key="bei" :props="props">
                <q-input
                  v-model.number="props.row.ratings.bei"
                  type="number"
                  dense
                  min="0"
                  max="20"
                  @update:model-value="calculateTotals(props.row)"
                />
              </q-td>

              <!-- Grand Total -->
              <q-td key="grandTotal" :props="props" class="text-center text-weight-medium">
                {{ props.row.totals.grand }}
              </q-td>

              <!-- Ranking -->
              <q-td key="ranking" :props="props" class="text-center text-weight-medium">
                {{ props.row.ranking }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  // Qualification Standards table columns
  const qualificationColumns = [
    { name: 'education', align: 'center', label: 'Education', field: 'education' },
    { name: 'experience', align: 'center', label: 'Experience', field: 'experience' },
    { name: 'training', align: 'center', label: 'Training', field: 'training' },
    { name: 'eligibility', align: 'center', label: 'Eligibility', field: 'eligibility' },
  ];

  // Applicant QS table columns
  const applicantQSColumns = [
    { name: 'name', align: 'left', label: 'Name of Applicant', field: 'name' },
    { name: 'education', align: 'left', label: 'Education', field: 'education' },
    { name: 'experience', align: 'left', label: 'Experience', field: 'experience' },
    { name: 'training', align: 'left', label: 'Training', field: 'training' },
    { name: 'eligibility', align: 'left', label: 'Eligibility', field: 'eligibility' },
  ];

  // Rating table columns
  const ratingColumns = [
    {
      name: 'name',
      align: 'left',
      label: 'Name of Applicant',
      field: 'name',
      style: 'width: 150px',
    },
    {
      name: 'education',
      align: 'center',
      label: 'Education',
      sublabel: '(25%)',
      field: (row) => row.ratings.education,
      style: 'width: 100px',
    },
    {
      name: 'experience',
      align: 'center',
      label: 'Experience',
      sublabel: '(25%)',
      field: (row) => row.ratings.experience,
      style: 'width: 100px',
    },
    {
      name: 'training',
      align: 'center',
      label: 'Training',
      sublabel: '(15%)',
      field: (row) => row.ratings.training,
      style: 'width: 100px',
    },
    {
      name: 'performance',
      align: 'center',
      label: 'Performance',
      sublabel: '(15%)',
      field: (row) => row.ratings.performance,
      style: 'width: 100px',
    },
    {
      name: 'totalQS',
      align: 'center',
      label: 'TOTAL QS',
      sublabel: '(75%)',
      field: (row) => row.totals.qs,
      style: 'width: 80px',
    },
    {
      name: 'bei',
      align: 'center',
      label: 'BEI',
      sublabel: '(25%)',
      field: (row) => row.ratings.bei,
      style: 'width: 80px',
    },
    {
      name: 'grandTotal',
      align: 'center',
      label: 'GRAND TOTAL',
      sublabel: '(100%)',
      field: (row) => row.totals.grand,
      style: 'width: 100px',
    },
    {
      name: 'ranking',
      align: 'center',
      label: 'Ranking',
      field: 'ranking',
      style: 'width: 80px',
    },
  ];

  // Sample applicant data
  const applicants = ref([
    {
      id: 1,
      name: 'ALCOBER, RUEL ANTO',
      education: 'Something',
      experience: 'Something',
      training: 'Something',
      eligibility: 'Something',
      educationScore: '-4',
      experienceScore: '-3',
      trainingScore: '-3',
      ratings: {
        education: 0,
        experience: 0,
        training: 0,
        performance: 0,
        bei: 0,
      },
      totals: {
        qs: 0,
        grand: 0,
      },
      ranking: 1,
    },
  ]);

  // Calculate totals for an applicant
  const calculateTotals = (applicant) => {
    // Calculate QS total (75%)
    applicant.totals.qs =
      (applicant.ratings.education || 0) +
      (applicant.ratings.experience || 0) +
      (applicant.ratings.training || 0) +
      (applicant.ratings.performance || 0);

    // Calculate grand total (QS + BEI)
    applicant.totals.grand = applicant.totals.qs + (applicant.ratings.bei || 0);

    // Update rankings (would normally sort and assign)
    updateRankings();
  };

  // Update rankings based on grand totals
  const updateRankings = () => {
    // Sort applicants by grand total in descending order
    const sorted = [...applicants.value].sort((a, b) => b.totals.grand - a.totals.grand);

    // Assign rankings
    sorted.forEach((applicant, index) => {
      const matchingApplicant = applicants.value.find((a) => a.id === applicant.id);
      if (matchingApplicant) {
        matchingApplicant.ranking = index + 1;
      }
    });
  };

  // Submit ratings
  const submitRatings = () => {
    $q.notify({
      color: 'positive',
      message: 'Ratings submitted successfully',
      icon: 'check_circle',
    });

    console.log('Submitted ratings:', applicants.value);
  };

  onMounted(() => {
    // Initialize calculations
    applicants.value.forEach((applicant) => {
      calculateTotals(applicant);
    });
  });
</script>

<style lang="scss" scoped>
  .qualification-table,
  .applicant-qs-table,
  .ratings-table {
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th {
      background-color: #f5f5f5;
    }

    thead tr th {
      position: sticky;
      z-index: 1;
    }

    thead tr:first-child th {
      top: 0;
    }

    &.q-table--grid td:first-child {
      width: 100%;
    }

    td {
      white-space: normal;
    }
  }

  .bg-light-green-1 {
    background-color: #e8f5e9 !important;
  }

  .q-table th {
    font-weight: 500;
  }
</style>
