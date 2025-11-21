<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="rating-modal">
      <!-- Header (Sticky) -->
      <q-card-section class="header sticky-header">
        <div class="row items-center justify-between">
          <div>
            <h6 class="q-ma-none text-weight-bold">Rated Applicants for Qualification Standards</h6>
            <div class="text-subtitle1">{{ position.position }}</div>
            <div class="text-caption">Office: {{ position.office }}</div>
          </div>
          <q-btn flat round dense icon="close" @click="closeForm" />
        </div>
        <div class="row q-mt-sm q-col-gutter-sm">
          <div class="col-4">
            <q-input
              v-model="filterText"
              dense
              borderless
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
            <q-select v-model="sortBy" :options="sortOptions" dense borderless label="Sort by" />
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
            <!-- Criteria Header (Sticky) -->
            <thead class="sticky-criteria">
              <tr>
                <th style="width: 200px">Name of Applicant</th>
                <th style="width: 110px">
                  Education
                  <span class="text-caption">{{ educationMaxRate }}%</span>
                </th>
                <th style="width: 110px">
                  Experience
                  <span class="text-caption">{{ experienceMaxRate }}%</span>
                </th>
                <th style="width: 110px">
                  Training
                  <span class="text-caption">{{ trainingMaxRate }}%</span>
                </th>
                <th style="width: 110px">
                  Performance
                  <span class="text-caption">{{ performanceMaxRate }}%</span>
                </th>
                <th style="width: 110px">
                  BEI
                  <span class="text-caption">{{ behavioralMaxRate }}%</span>
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
              <tr class="bg-grey-2 criteria-description">
                <td>
                  <div class="text-weight-bold text-caption">Criteria</div>
                </td>
                <td>
                  <div class="text-weight-bold text-caption q-mb-xs">EDUCATION CRITERIA:</div>
                  <div
                    v-for="(item, index) in education.items"
                    :key="'edu-' + index"
                    class="text-caption q-mb-xs criteria-item"
                  >
                    <span class="criteria-percentage">{{ item.percentage }}%</span>
                    - {{ item.description }}
                  </div>
                </td>
                <td>
                  <div class="text-weight-bold text-caption q-mb-xs">EXPERIENCE CRITERIA:</div>
                  <div
                    v-for="(item, index) in experience.items"
                    :key="'exp-' + index"
                    class="text-caption q-mb-xs criteria-item"
                  >
                    <span class="criteria-percentage">{{ item.percentage }}%</span>
                    - {{ item.description }}
                  </div>
                </td>
                <td>
                  <div class="text-weight-bold text-caption q-mb-xs">TRAINING CRITERIA:</div>
                  <div
                    v-for="(item, index) in training.items"
                    :key="'train-' + index"
                    class="text-caption q-mb-xs criteria-item"
                  >
                    <span class="criteria-percentage">{{ item.percentage }}%</span>
                    - {{ item.description }}
                  </div>
                </td>
                <td>
                  <div class="text-weight-bold text-caption q-mb-xs">PERFORMANCE CRITERIA:</div>
                  <div
                    v-for="(item, index) in performance.items"
                    :key="'perf-' + index"
                    class="text-caption q-mb-xs criteria-item"
                  >
                    <span class="criteria-percentage">{{ item.percentage }}%</span>
                    - {{ item.description }}
                  </div>
                </td>
                <td>
                  <div class="text-weight-bold text-caption q-mb-xs">BEI CRITERIA:</div>
                  <div
                    v-for="(item, index) in behavioral.items"
                    :key="'bei-' + index"
                    class="text-caption q-mb-xs criteria-item"
                  >
                    <span class="criteria-percentage">{{ item.percentage }}%</span>
                    - {{ item.description }}
                  </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </thead>
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
                      :model-value="formatScore(applicant.educationScore)"
                      type="text"
                      dense
                      borderless
                      readonly
                      class="score-input"
                      placeholder="-"
                    />
                  </td>
                  <td style="width: 110px">
                    <q-input
                      :model-value="formatScore(applicant.experienceScore)"
                      type="text"
                      dense
                      borderless
                      readonly
                      class="score-input"
                      placeholder="-"
                    />
                  </td>
                  <td style="width: 110px">
                    <q-input
                      :model-value="formatScore(applicant.trainingScore)"
                      type="text"
                      dense
                      borderless
                      readonly
                      class="score-input"
                      placeholder="-"
                    />
                  </td>
                  <td style="width: 110px">
                    <q-input
                      :model-value="formatScore(applicant.performanceScore)"
                      type="text"
                      dense
                      borderless
                      readonly
                      class="score-input"
                      placeholder="-"
                    />
                  </td>
                  <td style="width: 110px">
                    <q-input
                      :model-value="formatScore(applicant.behavioralScore)"
                      type="text"
                      dense
                      borderless
                      readonly
                      class="score-input"
                      placeholder="-"
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
      <q-card-section class="footer-section sticky-footer"></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';

  // Props
  const props = defineProps({
    modelValue: Boolean,
    position: { type: Object, default: () => ({}) },
    criteria: { type: Object, default: () => ({}) },
    applicants: { type: Array, default: () => [] },
    loading: Boolean,
  });

  // Emits
  const emit = defineEmits(['update:modelValue', 'close']);

  // Computed
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  // Transform criteria structure to include items array
  const education = computed(() => {
    const edu = props.criteria.education || {};
    return {
      Rate: edu.Rate || '20',
      items: edu.items || [],
    };
  });

  const experience = computed(() => {
    const exp = props.criteria.experience || {};
    return {
      Rate: exp.Rate || '20',
      items: exp.items || [],
    };
  });

  const training = computed(() => {
    const train = props.criteria.training || {};
    return {
      Rate: train.Rate || '15',
      items: train.items || [],
    };
  });

  const performance = computed(() => {
    const perf = props.criteria.performance || {};
    return {
      Rate: perf.Rate || '15',
      items: perf.items || [],
    };
  });

  const behavioral = computed(() => {
    const beh = props.criteria.behavioral || {};
    return {
      Rate: beh.Rate || '30',
      items: beh.items || [],
    };
  });

  const educationMaxRate = computed(() => parseFloat(education.value.Rate));
  const experienceMaxRate = computed(() => parseFloat(experience.value.Rate));
  const trainingMaxRate = computed(() => parseFloat(training.value.Rate));
  const performanceMaxRate = computed(() => parseFloat(performance.value.Rate));
  const behavioralMaxRate = computed(() => parseFloat(behavioral.value.Rate));

  const qsMaxRate = computed(
    () =>
      educationMaxRate.value +
      experienceMaxRate.value +
      trainingMaxRate.value +
      performanceMaxRate.value,
  );

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
    if (!applicant) return '-';
    const eduScore = parseFloat(applicant.educationScore) || 0;
    const expScore = parseFloat(applicant.experienceScore) || 0;
    const trainingScore = parseFloat(applicant.trainingScore) || 0;
    const perfScore = parseFloat(applicant.performanceScore) || 0;

    if (eduScore === 0 && expScore === 0 && trainingScore === 0 && perfScore === 0) {
      return '-';
    }

    const qsScore = eduScore + expScore + trainingScore + perfScore;
    return Math.min(qsScore, qsMaxRate.value).toFixed(2);
  };

  const calculateTotal = (applicant) => {
    if (!applicant) return '-';
    const qsScoreRaw = calculateQS(applicant);
    if (qsScoreRaw === '-') return '-';

    const qsScore = parseFloat(qsScoreRaw);
    const beiScore = parseFloat(applicant.behavioralScore) || 0;

    if (qsScore === 0 && beiScore === 0) {
      return '-';
    }

    return Math.min(qsScore + beiScore, totalMaxRate.value).toFixed(2);
  };

  const formatScore = (score) => {
    if (score === null || score === undefined || score === 0) {
      return '';
    }
    return score.toString();
  };

  const calculateAllRankings = () => {
    if (!applicantsData.value.length) return;
    const sortedApplicants = [...applicantsData.value].sort((a, b) => {
      return parseFloat(calculateTotal(b)) - parseFloat(calculateTotal(a));
    });
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const closeForm = () => {
    isOpen.value = false;
    emit('close');
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
    width: 1700px;
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
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #f5f5f5;
  }
  // .sticky-criteria {
  //   position: sticky;
  //   top: 0;
  //   z-index: 9;
  //   background-color: #f9f9f9;
  // }
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
    max-height: calc(90vh - 200px);
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
  .criteria-description {
    background-color: #f9f9f9;
  }
  .criteria-item {
    line-height: 1.3;
    margin-bottom: 4px;
  }
  .criteria-percentage {
    font-weight: bold;
    color: #2e7d32;
    display: inline-block;
    min-width: 35px;
  }
  .applicant-row {
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
    &.expanded {
      background-color: #d0ffd6;
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
    color: green;
  }
  .rank {
    font-weight: bold;
    background-color: #d0ffd6;
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
