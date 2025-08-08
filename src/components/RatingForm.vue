<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="rating-modal">
      <!-- Header (Sticky) -->
      <q-card-section class="header sticky-header">
        <div class="row items-center justify-between">
          <div>
            <h6 class="q-ma-none text-weight-bold">Rating Form for Qualification Standards</h6>
            <div class="text-subtitle1">{{ position.position }}</div>
            <div class="text-caption">Office: {{ position.office }}</div>
          </div>
          <q-btn flat round dense icon="close" @click="closeForm" />
        </div>

        <!-- Filter & Sort Controls -->
        <div class="row q-mt-sm q-col-gutter-sm">
          <div class="col-4">
            <q-input
              v-model="filterText"
              dense
              outlined
              placeholder="Filter by name"
              class="filter-input"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-4">
            <q-select v-model="sortBy" :options="sortOptions" dense outlined label="Sort by" />
          </div>
          <div class="col-4">
            <q-btn-toggle
              v-model="sortOrder"
              toggle-color="primary"
              :options="[
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]"
              dense
              spread
              no-caps
              unelevated
              rounded
            />
          </div>
        </div>
      </q-card-section>

      <!-- Criteria Header (Sticky) -->
      <q-card-section class="criteria-section sticky-criteria q-pa-sm q-pb-none">
        <table class="rating-table">
          <thead>
            <tr>
              <th style="width: 200px">Name of Applicant</th>
              <th style="width: 110px">
                Education
                <div class="text-caption">{{ education.Rate || '25' }}%</div>
              </th>
              <th style="width: 110px">
                Experience
                <div class="text-caption">{{ experience.Rate || '25' }}%</div>
              </th>
              <th style="width: 110px">
                Training
                <div class="text-caption">{{ training.Rate || '15' }}%</div>
              </th>
              <th style="width: 110px">
                Performance
                <div class="text-caption">{{ performance.Rate || '10' }}%</div>
              </th>
              <th style="width: 110px">
                BEI
                <div class="text-caption">{{ behavioral.Rate || '25' }}%</div>
              </th>
              <th style="width: 80px" class="text-center">
                QS Total
                <div class="text-caption">({{ qsMaxRate }}%)</div>
              </th>
              <th style="width: 80px" class="text-center">
                Grand Total
                <div class="text-caption">({{ totalMaxRate }}%)</div>
              </th>
              <th style="width: 80px" class="text-center">Rank</th>
            </tr>
          </thead>
          <tbody class="criteria-description">
            <tr class="bg-grey-2">
              <td>
                <div class="text-weight-bold text-caption">Criteria</div>
              </td>
              <td>
                <div class="text-weight-bold text-caption">REQUIRED:</div>
                <div
                  v-for="(item, index) in formatDescription(education.description)"
                  :key="'edu-' + index"
                  class="text-caption"
                >
                  {{ item }}
                </div>
              </td>
              <td>
                <div class="text-weight-bold text-caption">REQUIRED:</div>
                <div
                  v-for="(item, index) in formatDescription(experience.description)"
                  :key="'exp-' + index"
                  class="text-caption"
                >
                  {{ item }}
                </div>
              </td>
              <td>
                <div class="text-weight-bold text-caption">REQUIRED:</div>
                <div
                  v-for="(item, index) in formatDescription(training.description)"
                  :key="'train-' + index"
                  class="text-caption"
                >
                  {{ item }}
                </div>
              </td>
              <td>
                <div class="text-weight-bold text-caption">REQUIRED:</div>
                <div
                  v-for="(item, index) in formatDescription(performance.description)"
                  :key="'perf-' + index"
                  class="text-caption"
                >
                  {{ item }}
                </div>
              </td>
              <td>
                <div class="text-weight-bold text-caption">REQUIRED:</div>
                <div
                  v-for="(item, index) in formatDescription(behavioral.description)"
                  :key="'bei-' + index"
                  class="text-caption"
                >
                  {{ item }}
                </div>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </q-card-section>

      <!-- Scrollable Content -->
      <q-card-section class="content-section scrollable-content">
        <div v-if="loading" class="text-center q-pa-md">
          <q-spinner color="primary" size="3em" />
          <div class="q-mt-sm">Loading applicants...</div>
        </div>

        <div v-else-if="filteredApplicants.length === 0" class="text-center q-pa-md">
          <q-icon name="search_off" size="2rem" color="grey-6" />
          <div class="q-mt-sm text-grey-8">No matching applicants found</div>
        </div>

        <div v-else>
          <table class="rating-table">
            <tbody>
              <template v-for="applicant in filteredApplicants" :key="applicant.id">
                <tr class="applicant-row" :class="{ expanded: expandedApplicant === applicant.id }">
                  <td style="width: 200px" @click="toggleApplicant(applicant.id)">
                    <div class="row items-center no-wrap">
                      <q-btn
                        flat
                        dense
                        round
                        size="xs"
                        :icon="expandedApplicant === applicant.id ? 'expand_less' : 'expand_more'"
                      />
                      <span class="text-caption ellipsis">
                        {{ applicant.firstname }} {{ applicant.lastname }}
                      </span>
                    </div>
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model.number="applicant.educationScore"
                      type="number"
                      dense
                      outlined
                      :min="0"
                      :max="parseFloat(education.Rate || 25)"
                      step="0.1"
                      class="score-input"
                      :rules="[
                        (val) =>
                          val <= parseFloat(education.Rate || 25) ||
                          'Exceeds maximum allowed score',
                      ]"
                      @update:model-value="updateRating(applicant.id, 'educationScore', $event)"
                      @click.stop
                    />
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model.number="applicant.experienceScore"
                      type="number"
                      dense
                      outlined
                      :min="0"
                      :max="parseFloat(experience.Rate || 25)"
                      step="0.1"
                      class="score-input"
                      :rules="[
                        (val) =>
                          val <= parseFloat(experience.Rate || 25) ||
                          'Exceeds maximum allowed score',
                      ]"
                      @update:model-value="updateRating(applicant.id, 'experienceScore', $event)"
                      @click.stop
                    />
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model.number="applicant.trainingScore"
                      type="number"
                      dense
                      outlined
                      :min="0"
                      :max="parseFloat(training.Rate || 15)"
                      step="0.1"
                      class="score-input"
                      :rules="[
                        (val) =>
                          val <= parseFloat(training.Rate || 15) || 'Exceeds maximum allowed score',
                      ]"
                      @update:model-value="updateRating(applicant.id, 'trainingScore', $event)"
                      @click.stop
                    />
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model.number="applicant.performanceScore"
                      type="number"
                      dense
                      outlined
                      :min="0"
                      :max="parseFloat(performance.Rate || 10)"
                      step="0.1"
                      class="score-input"
                      :rules="[
                        (val) =>
                          val <= parseFloat(performance.Rate || 10) ||
                          'Exceeds maximum allowed score',
                      ]"
                      @update:model-value="updateRating(applicant.id, 'performanceScore', $event)"
                      @click.stop
                    />
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model.number="applicant.behavioralScore"
                      type="number"
                      dense
                      outlined
                      :min="0"
                      :max="parseFloat(behavioral.Rate || 25)"
                      step="0.1"
                      class="score-input"
                      :rules="[
                        (val) =>
                          val <= parseFloat(behavioral.Rate || 25) ||
                          'Exceeds maximum allowed score',
                      ]"
                      @update:model-value="updateRating(applicant.id, 'behavioralScore', $event)"
                      @click.stop
                    />
                  </td>

                  <td style="width: 80px" class="text-center">
                    <div class="result-value">{{ calculateQS(applicant) }}</div>
                  </td>
                  <td style="width: 80px" class="text-center total-score">
                    <div class="result-value">{{ calculateTotal(applicant) }}</div>
                  </td>
                  <td style="width: 80px" class="text-center rank">
                    <div class="result-value">{{ applicant.ranking || '-' }}</div>
                  </td>
                </tr>

                <!-- Expandable Details -->
                <tr v-if="expandedApplicant === applicant.id">
                  <td colspan="9" class="applicant-details">
                    <div class="row q-col-gutter-sm q-py-sm">
                      <!-- Education Details -->
                      <div class="col-3">
                        <div class="detail-panel">
                          <div class="detail-title">Education</div>
                          <div v-if="applicant.education && applicant.education.length > 0">
                            <div
                              v-for="(edu, index) in applicant.education"
                              :key="index"
                              class="q-mb-xs"
                            >
                              <div class="text-weight-bold">{{ edu.level }}</div>
                              <div>{{ edu.school_name || 'N/A' }}</div>
                              <div>{{ edu.degree || 'N/A' }}</div>
                              <div v-if="edu.year_graduated">
                                Graduated: {{ edu.year_graduated }}
                              </div>
                              <hr v-if="index < applicant.education.length - 1" class="q-my-xs" />
                            </div>
                          </div>
                          <div v-else class="text-grey-6">No education data</div>
                        </div>
                      </div>

                      <!-- Work Experience Details -->
                      <div class="col-3">
                        <div class="detail-panel">
                          <div class="detail-title">Work Experience</div>
                          <div
                            v-if="applicant.work_experience && applicant.work_experience.length > 0"
                          >
                            <div
                              v-for="(work, index) in applicant.work_experience"
                              :key="index"
                              class="q-mb-xs"
                            >
                              <div class="text-weight-bold">{{ work.position_title }}</div>
                              <div>{{ work.department }}</div>
                              <div>
                                {{ formatDate(work.work_date_from) }} to
                                {{ formatDate(work.work_date_to) }}
                              </div>
                              <div>Salary: ₱{{ work.monthly_salary }}</div>
                              <div>{{ work.status_of_appointment }}</div>
                              <hr
                                v-if="index < applicant.work_experience.length - 1"
                                class="q-my-xs"
                              />
                            </div>
                          </div>
                          <div v-else class="text-grey-6">No work experience</div>
                        </div>
                      </div>

                      <!-- Training Details -->
                      <div class="col-3">
                        <div class="detail-panel">
                          <div class="detail-title">Training</div>
                          <div v-if="applicant.training && applicant.training.length > 0">
                            <div
                              v-for="(train, index) in applicant.training"
                              :key="index"
                              class="q-mb-xs"
                            >
                              <div class="text-weight-bold">{{ train.training_title }}</div>
                              <div>
                                {{ formatDate(train.inclusive_date_from) }} to
                                {{ formatDate(train.inclusive_date_to) }}
                              </div>
                              <div>{{ train.number_of_hours }} hours</div>
                              <div>{{ train.conducted_by }}</div>
                              <hr v-if="index < applicant.training.length - 1" class="q-my-xs" />
                            </div>
                          </div>
                          <div v-else class="text-grey-6">No training data</div>
                        </div>
                      </div>

                      <!-- Eligibility Details -->
                      <div class="col-3">
                        <div class="detail-panel">
                          <div class="detail-title">Eligibility</div>
                          <div v-if="applicant.eligibity && applicant.eligibity.length > 0">
                            <div
                              v-for="(elig, index) in applicant.eligibity"
                              :key="index"
                              class="q-mb-xs"
                            >
                              <div class="text-weight-bold">{{ elig.eligibility }}</div>
                              <div>Rating: {{ elig.rating }}%</div>
                              <div>Exam Date: {{ formatDate(elig.date_of_examination) }}</div>
                              <div>License: {{ elig.license_number }}</div>
                              <hr v-if="index < applicant.eligibity.length - 1" class="q-my-xs" />
                            </div>
                          </div>
                          <div v-else class="text-grey-6">No eligibility data</div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </q-card-section>

      <!-- Footer (Sticky) -->
      <q-card-section class="footer-section sticky-footer">
        <div class="row justify-end">
          <q-btn
            color="green"
            label="Submit Ratings"
            icon-right="check"
            @click="submitRatings"
            dense
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  // Props
  const props = defineProps({
    modelValue: Boolean,
    position: {
      type: Object,
      default: () => ({}),
    },
    criteria: {
      type: Object,
      default: () => ({}),
    },
    applicants: {
      type: Array,
      default: () => [],
    },
    loading: Boolean,
  });

  // Emits
  const emit = defineEmits(['update:modelValue', 'submit-ratings']);

  // Computed
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  const education = computed(() => props.criteria.education || {});
  const experience = computed(() => props.criteria.experience || {});
  const training = computed(() => props.criteria.training || {});
  const performance = computed(() => props.criteria.performance || {});
  const behavioral = computed(() => props.criteria.behavioral || {});

  const educationMaxRate = computed(() => parseFloat(education.value.Rate || 25));
  const experienceMaxRate = computed(() => parseFloat(experience.value.Rate || 25));
  const trainingMaxRate = computed(() => parseFloat(training.value.Rate || 15));
  const performanceMaxRate = computed(() => parseFloat(performance.value.Rate || 10));
  const behavioralMaxRate = computed(() => parseFloat(behavioral.value.Rate || 25));

  // Dynamic QS max rate (sum of all QS criteria rates)
  const qsMaxRate = computed(
    () =>
      educationMaxRate.value +
      experienceMaxRate.value +
      trainingMaxRate.value +
      performanceMaxRate.value,
  );

  // Dynamic total max rate (QS + BEI)
  const totalMaxRate = computed(() => qsMaxRate.value + behavioralMaxRate.value);

  // State
  const expandedApplicant = ref(null);
  const filterText = ref('');
  const sortBy = ref({ label: 'Name', value: 'name' });
  const sortOrder = ref('asc');
  const applicantsData = ref([]);

  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Education Score', value: 'educationScore' },
    { label: 'Experience Score', value: 'experienceScore' },
    { label: 'Training Score', value: 'trainingScore' },
    { label: 'Performance Score', value: 'performanceScore' },
    { label: 'BEI Score', value: 'behavioralScore' },
    { label: 'Total QS', value: 'qsTotal' },
    { label: 'Grand Total', value: 'grandTotal' },
    { label: 'Ranking', value: 'ranking' },
  ];

  const filteredApplicants = computed(() => {
    let result = applicantsData.value;

    if (filterText.value) {
      const searchTerm = filterText.value.toLowerCase();
      result = result.filter((applicant) =>
        `${applicant.firstname} ${applicant.lastname}`.toLowerCase().includes(searchTerm),
      );
    }

    result = [...result].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy.value.value) {
        case 'name':
          aValue = `${a.firstname} ${a.lastname}`.toLowerCase();
          bValue = `${b.firstname} ${b.lastname}`.toLowerCase();
          return sortOrder.value === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);

        case 'qsTotal':
          aValue = parseFloat(calculateQS(a));
          bValue = parseFloat(calculateQS(b));
          break;

        case 'grandTotal':
          aValue = parseFloat(calculateTotal(a));
          bValue = parseFloat(calculateTotal(b));
          break;

        default:
          aValue = parseFloat(a[sortBy.value.value]) || 0;
          bValue = parseFloat(b[sortBy.value.value]) || 0;
      }

      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return result;
  });

  // Methods
  const initializeApplicants = () => {
    if (props.applicants?.length > 0) {
      applicantsData.value = props.applicants.map((applicant) => {
        const ratingScore = applicant.rating_score || {};
        return {
          ...applicant,
          educationScore: parseFloat(ratingScore.education_score ?? 0),
          experienceScore: parseFloat(ratingScore.experience_score ?? 0),
          trainingScore: parseFloat(ratingScore.training_score ?? 0),
          performanceScore: parseFloat(ratingScore.performance_score ?? 0),
          behavioralScore: parseFloat(ratingScore.behavioral_score ?? 0),
          name: `${applicant.firstname} ${applicant.lastname}`,
          ranking: ratingScore.ranking || 0,
        };
      });

      calculateAllRankings();
    } else {
      applicantsData.value = [];
    }
  };

  const calculateQS = (applicant) => {
    if (!applicant) return '0.00';

    // Calculate QS based on criteria rates
    const eduScore = parseFloat(applicant.educationScore) || 0;
    const expScore = parseFloat(applicant.experienceScore) || 0;
    const trainingScore = parseFloat(applicant.trainingScore) || 0;
    const perfScore = parseFloat(applicant.performanceScore) || 0;

    // Sum all QS criteria scores (already weighted by their max percentage)
    const qsScore = eduScore + expScore + trainingScore + perfScore;

    // Ensure it doesn't exceed the max QS rate
    return Math.min(qsScore, qsMaxRate.value).toFixed(2);
  };

  const calculateTotal = (applicant) => {
    if (!applicant) return '0.00';

    // QS score is already calculated
    const qsScore = parseFloat(calculateQS(applicant));

    // BEI score is directly entered as weighted percentage
    const beiScore = parseFloat(applicant.behavioralScore) || 0;

    // Total is QS + BEI (max totalMaxRate)
    return Math.min(qsScore + beiScore, totalMaxRate.value).toFixed(2);
  };

  const calculateAllRankings = () => {
    if (!applicantsData.value.length) return;

    // Sort by total score (descending)
    const sortedApplicants = [...applicantsData.value].sort((a, b) => {
      return parseFloat(calculateTotal(b)) - parseFloat(calculateTotal(a));
    });

    // Map scores to rankings
    const scoreMap = {};
    sortedApplicants.forEach((applicant, index) => {
      const totalScore = calculateTotal(applicant);
      if (!scoreMap[totalScore]) {
        scoreMap[totalScore] = {
          firstPosition: index,
          count: 0,
        };
      }
      scoreMap[totalScore].count++;
    });

    // Assign rankings
    sortedApplicants.forEach((applicant) => {
      const totalScore = calculateTotal(applicant);
      const position = scoreMap[totalScore].firstPosition;

      const originalApplicant = applicantsData.value.find((a) => a.id === applicant.id);
      if (originalApplicant) {
        originalApplicant.ranking = position + 1;
      }
    });
  };

  const toggleApplicant = (applicantId) => {
    expandedApplicant.value = expandedApplicant.value === applicantId ? null : applicantId;
  };

  const updateRating = (applicantId, field, value) => {
    const applicant = applicantsData.value.find((a) => a.id === applicantId);
    if (applicant) {
      // Get the maximum allowed value for this field
      let maxValue;
      switch (field) {
        case 'educationScore':
          maxValue = educationMaxRate.value;
          break;
        case 'experienceScore':
          maxValue = experienceMaxRate.value;
          break;
        case 'trainingScore':
          maxValue = trainingMaxRate.value;
          break;
        case 'performanceScore':
          maxValue = performanceMaxRate.value;
          break;
        case 'behavioralScore':
          maxValue = behavioralMaxRate.value;
          break;
        default:
          maxValue = 100;
      }

      // Convert to number and validate
      const numValue = value === '' ? 0 : parseFloat(value);
      if (!isNaN(numValue)) {
        // Ensure the value doesn't exceed the max allowed
        applicant[field] = Math.min(numValue, maxValue);

        // Add debug logging to verify values are being updated
        console.log(`Updated ${field} for applicant ${applicant.id} to ${applicant[field]}`);

        calculateAllRankings();
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatDescription = (description) => {
    if (!description) return [];
    if (Array.isArray(description)) return description;

    return description.split(',').map((item) => item.trim());
  };

  const submitRatings = () => {
    // Create a formatted payload with all the necessary fields and proper values
    const formattedData = applicantsData.value.map((applicant) => {
      // Calculate QS and total scores
      const qsScore = parseFloat(calculateQS(applicant));
      const totalScore = parseFloat(calculateTotal(applicant));

      return {
        id: applicant.id,
        nPersonalInfo_id: applicant.nPersonalInfo_id,
        // Make sure to parse all values as floats to ensure they are numbers
        education_score: Number(applicant.educationScore || 0),
        experience_score: Number(applicant.experienceScore || 0),
        training_score: Number(applicant.trainingScore || 0),
        performance_score: Number(applicant.performanceScore || 0),
        behavioral_score: Number(applicant.behavioralScore || 0),
        total_qs: Number(qsScore),
        grand_total: Number(totalScore),
        ranking: applicant.ranking || 0,
        // status: 'rated',
      };
    });

    // Log the data being sent to help debug
    console.log('Submitting ratings with formatted data:', JSON.stringify(formattedData, null, 2));

    // Pass this data to the parent component
    emit('submit-ratings', {
      positionId: props.position.id,
      applicants: formattedData,
    });

    $q.notify({
      color: 'positive',
      message: 'Ratings submitted successfully!',
      icon: 'check_circle',
      position: 'top',
      timeout: 2000,
    });

    closeForm();
  };

  const closeForm = () => {
    isOpen.value = false;
  };

  // Watchers
  watch(
    () => props.applicants,
    () => initializeApplicants(),
    { immediate: true },
  );

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        expandedApplicant.value = null;
        initializeApplicants();
      }
    },
  );

  watch(
    () => props.position,
    () => {
      expandedApplicant.value = null;
      initializeApplicants();
    },
  );
</script>

<style lang="scss" scoped>
  .rating-modal {
    width: 1000px;
    max-width: 95vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    background-color: #f5f5f5;
    padding: 12px 16px;
  }

  .filter-input {
    .q-field__control {
      height: 32px;
      min-height: 32px;
    }
  }

  .criteria-section {
    background-color: #f9f9f9;
  }

  /* Sticky header and footer styles */
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #f5f5f5;
  }

  .sticky-criteria {
    position: sticky;
    top: 112px; /* Adjust this value based on the header's height */
    z-index: 9;
    background-color: #f9f9f9;
  }

  .sticky-footer {
    position: sticky;
    bottom: 0;
    z-index: 10;
    background-color: #f5f5f5;
    margin-top: auto;
  }

  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    max-height: calc(90vh - 250px); /* Adjust based on header and footer heights */
  }

  .rating-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 8px;
      text-align: left;
      border: 1px solid #ddd;
      vertical-align: middle;
      font-size: 0.85rem;
    }

    th {
      background-color: #f2f2f2;
      font-weight: 500;
      text-align: center;
    }
  }

  .applicant-row {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    &.expanded {
      background-color: #e3f2fd;
    }
  }

  .score-input {
    width: 100%;

    :deep(.q-field__control) {
      min-height: 32px;
      height: 32px;
    }

    :deep(input) {
      font-size: 0.85rem;
    }
  }

  .result-value {
    font-size: 0.85rem;
  }

  .total-score {
    font-weight: bold;
    color: #1976d2;
  }

  .rank {
    font-weight: bold;
    background-color: #f0f8ff;
  }

  .applicant-details {
    background-color: #f8f9fa;
  }

  .detail-panel {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 8px;
    background-color: white;
    font-size: 0.85rem;
    min-height: 100px;
    height: auto;
    overflow-y: visible;
  }

  .detail-title {
    font-weight: bold;
    margin-bottom: 4px;
    padding-bottom: 2px;
    border-bottom: 1px solid #eee;
    font-size: 0.85rem;
  }

  .footer-section {
    padding: 12px 16px;
    border-top: 1px solid #e0e0e0;
    background-color: #f5f5f5;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  hr.q-my-xs {
    border: none;
    border-top: 1px solid #eee;
    margin: 4px 0;
  }

  .text-caption {
    font-size: 0.85rem;
    line-height: 1.2;
  }
</style>
