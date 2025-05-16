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
          <q-btn
            v-if="userRole === 'rater'"
            color="green"
            label="Submit Ratings"
            class="q-py-sm"
            @click="submitRatings"
          />
        </div>
      </div>

      <!-- Qualification Standards Table -->
      <div class="q-mb-lg">
        <q-table
          :rows="[qualificationStandards]"
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
              <q-td key="experience" :props="props" class="text-center">
                4 years relevant experience
              </q-td>
              <q-td key="training" :props="props" class="text-center">
                40 hours relevant training
              </q-td>
              <q-td key="eligibility" :props="props" class="text-center">
                Civil Service Professional/RA1080
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- Applicant Ratings Section using RaterPreview -->
      <div>
        <h5 class="q-mt-lg q-mb-md">Applicant Ratings</h5>
        <RaterPreview
          :criteria="criteria"
          :applicants="applicants"
          :mode="userRole === 'admin' ? 'preview' : 'input'"
          @update-rating="handleRatingUpdate"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import RaterPreview from 'components/RaterPreview.vue';

  const $q = useQuasar();

  // Simulated user role (replace with actual auth logic)
  const userRole = ref('rater'); // Set to 'admin' for preview mode, 'rater' for input mode

  // Qualification standard data
  const qualificationStandards = {
    id: 1,
    education: "Bachelor's Degree",
    experience: '4 years relevant experience',
    training: '40 hours relevant training',
    eligibility: 'Civil Service Professional/RA1080',
  };

  // Qualification Standards table columns
  const qualificationColumns = [
    { name: 'education', align: 'center', label: 'Education', field: 'education' },
    { name: 'experience', align: 'center', label: 'Experience', field: 'experience' },
    { name: 'training', align: 'center', label: 'Training', field: 'training' },
    { name: 'eligibility', align: 'center', label: 'Eligibility', field: 'eligibility' },
  ];

  // Removed unused applicantQSColumns variable

  // Criteria for RaterPreview
  const criteria = ref({
    education: {
      title1: 'HIGH SCORE INDICATOR',
      title2: 'Completion of relevant college degree',
      description: 'Master Degree / Professional Board / Doctorate Degree - 25%',
    },
    experience: {
      title1: 'RELEVANT EXPERIENCE',
      title2: 'Supervisory Experience',
      description1:
        'With direct supervisory experience with exemplary rating in at least 2 rating periods - Very Good = 15%',
      description2: 'With Work Experience = 10%, None = 0',
    },
    training: {
      title1: 'RELEVANT TRAINING',
      title2: 'Training Hours',
      description: 'Up to 40 hours of training = 15%, None or less than required = 0',
    },
    performance: {
      title: 'PDS Integrity/ PPSB',
      rating1: 'Outstanding = 15%',
      rating2: 'Very Satisfactory = 7%',
      rating3: 'Below VS rating = 0',
    },
  });

  // Sample applicant data (adapted for RaterPreview)
  const applicants = ref([
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
  ]);

  // Handle rating updates from RaterPreview
  const handleRatingUpdate = ({ applicantId, field, value }) => {
    const applicant = applicants.value.find((a) => a.id === applicantId);
    if (applicant) {
      applicant[field] = parseFloat(value) || 0;
      calculateTotals(applicant);
    }
  };

  // Calculate totals for an applicant
  const calculateTotals = (applicant) => {
    // Ensure all numerical values are properly converted
    const education = parseFloat(applicant.education) || 0;
    const experience = parseFloat(applicant.experience) || 0;
    const training = parseFloat(applicant.training) || 0;
    const performance = parseFloat(applicant.performance) || 0;

    applicant.totalQS = education + experience + training + performance;
    applicant.grandTotal = applicant.totalQS + (parseFloat(applicant.bei) || 0);
    updateRankings();
  };

  // Update rankings based on grand totals
  const updateRankings = () => {
    const sorted = [...applicants.value].sort((a, b) => b.grandTotal - a.grandTotal);
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
    // Initialize totals for all applicants
    applicants.value.forEach((applicant) => {
      calculateTotals(applicant);
    });
  });
</script>

<style lang="scss" scoped>
  .qualification-table,
  .applicant-qs-table {
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
