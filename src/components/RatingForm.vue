<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="rating-modal">
      <q-card-section class="header">
        <div class="row items-center justify-between">
          <div>
            <h6 class="q-ma-none text-weight-bold">Rating Form for Qualification Standards</h6>
            <div class="text-subtitle1">{{ position.position }}</div>
            <div class="text-caption">Office: {{ position.office }}</div>
            <div class="text-caption">Position ID: {{ positionID }}</div>
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
                      v-model="applicant.educationScore"
                      type="text"
                      dense
                      outlined
                      class="score-input"
                      placeholder="-"
                      @input="handleInput(applicant, 'educationScore', $event)"
                      @blur="validateScore(applicant, 'educationScore', educationMaxRate, false)"
                      @click.stop
                    />
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model="applicant.experienceScore"
                      type="text"
                      dense
                      outlined
                      class="score-input"
                      placeholder="-"
                      @input="handleInput(applicant, 'experienceScore', $event)"
                      @blur="validateScore(applicant, 'experienceScore', experienceMaxRate, false)"
                      @click.stop
                    />
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model="applicant.trainingScore"
                      type="text"
                      dense
                      outlined
                      class="score-input"
                      placeholder="-"
                      @input="handleInput(applicant, 'trainingScore', $event)"
                      @blur="validateScore(applicant, 'trainingScore', trainingMaxRate, false)"
                      @click.stop
                    />
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model="applicant.performanceScore"
                      type="text"
                      dense
                      outlined
                      class="score-input"
                      placeholder="-"
                      @input="handleInput(applicant, 'performanceScore', $event)"
                      @blur="
                        validateScore(applicant, 'performanceScore', performanceMaxRate, false)
                      "
                      @click.stop
                    />
                  </td>

                  <td style="width: 110px">
                    <q-input
                      v-model="applicant.behavioralScore"
                      type="text"
                      dense
                      outlined
                      class="score-input"
                      placeholder="-"
                      @input="handleInput(applicant, 'behavioralScore', $event)"
                      @blur="validateScore(applicant, 'behavioralScore', behavioralMaxRate, true)"
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
                      <div class="col-12 q-mb-sm">
                        <q-btn
                          label="View Qualification Standards"
                          icon="visibility"
                          color="primary"
                          outline
                          dense
                          size="sm"
                          @click="openQSModal(applicant)"
                        />
                      </div>
                      <div class="col-12">
                        <div class="row q-col-gutter-sm">
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
                                  <hr
                                    v-if="index < applicant.education.length - 1"
                                    class="q-my-xs"
                                  />
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
                                v-if="
                                  applicant.work_experience && applicant.work_experience.length > 0
                                "
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
                                  <hr
                                    v-if="index < applicant.training.length - 1"
                                    class="q-my-xs"
                                  />
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
                                  <hr
                                    v-if="index < applicant.eligibity.length - 1"
                                    class="q-my-xs"
                                  />
                                </div>
                              </div>
                              <div v-else class="text-grey-6">No eligibility data</div>
                            </div>
                          </div>
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
        <!-- Progress indicator -->
        <div v-if="!allApplicantsRated" class="row items-center q-mb-sm">
          <q-icon name="info" color="info" class="q-mr-xs" />
          <span class="text-caption text-info">
            {{ ratedApplicantsCount }} of {{ applicantsData.length }} applicants rated
          </span>
        </div>

        <div class="row justify-end q-gutter-sm">
          <q-btn color="primary" label="Save as Draft" icon-right="save" @click="saveDraft" dense />
          <q-btn
            v-if="allApplicantsRated"
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

  <!-- Use existing QS Modal Component -->
  <QualificationStandardModal
    v-model:show="showQSModal"
    :applicant-data="selectedApplicantForQS"
    :variant="'applicant'"
  />
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { useQuasar } from 'quasar';
  import QualificationStandardModal from 'src/components/QSModal.vue';

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
    rawCriteria: {
      type: Object,
      default: () => null,
    },
    applicants: {
      type: Array,
      default: () => [],
    },
    loading: Boolean,
  });

  // Emits
  const emit = defineEmits(['close', 'update:modelValue', 'submit-ratings', 'save-draft']);

  // Computed
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  // Get PositionID from raw criteria
  const positionID = computed(() => {
    if (props.rawCriteria && props.rawCriteria.job_batch) {
      return props.rawCriteria.job_batch.PositionID;
    }
    // Fallback to position data
    return props.position.tblStructureDetails_ID || null;
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

  // Helper function to check if a value is empty or just '-'
  const isEmpty = (value) => {
    return !value || value === '' || value === '-';
  };

  // Helper function to format number
  const formatNumber = (num) => {
    const number = parseFloat(num);
    if (isNaN(number)) return num;

    if (number % 1 === 0) {
      return String(Math.round(number));
    } else {
      return number.toFixed(2);
    }
  };

  // Check if all applicants have been rated
  const allApplicantsRated = computed(() => {
    if (!applicantsData.value || applicantsData.value.length === 0) {
      return false;
    }

    return applicantsData.value.every((applicant) => {
      const requiredFieldsValid =
        isValidScore(applicant.educationScore, false) &&
        isValidScore(applicant.experienceScore, false) &&
        isValidScore(applicant.trainingScore, false) &&
        isValidScore(applicant.performanceScore, false);

      const behavioralValid = isValidScore(applicant.behavioralScore, true);

      return requiredFieldsValid && behavioralValid;
    });
  });

  const ratedApplicantsCount = computed(() => {
    if (!applicantsData.value || applicantsData.value.length === 0) {
      return 0;
    }

    return applicantsData.value.filter((applicant) => {
      const requiredFieldsValid =
        isValidScore(applicant.educationScore, false) &&
        isValidScore(applicant.experienceScore, false) &&
        isValidScore(applicant.trainingScore, false) &&
        isValidScore(applicant.performanceScore, false);

      const behavioralValid = isValidScore(applicant.behavioralScore, true);

      return requiredFieldsValid && behavioralValid;
    }).length;
  });

  const isValidScore = (score, allowEmpty = false) => {
    if (isEmpty(score)) {
      return allowEmpty;
    }

    const numScore = parseFloat(score);
    return !isNaN(numScore) && numScore >= 0;
  };

  // State
  const expandedApplicant = ref(null);
  const filterText = ref('');
  const sortBy = ref({ label: 'Name', value: 'name' });
  const sortOrder = ref('asc');
  const applicantsData = ref([]);

  // QS Modal State
  const showQSModal = ref(false);
  const selectedApplicantForQS = ref(null);

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
          aValue = isEmpty(a[sortBy.value.value]) ? -1 : parseFloat(a[sortBy.value.value]) || 0;
          bValue = isEmpty(b[sortBy.value.value]) ? -1 : parseFloat(b[sortBy.value.value]) || 0;
      }

      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return result;
  });

  // Methods
  const initializeApplicants = () => {
    if (props.applicants?.length > 0) {
      applicantsData.value = props.applicants.map((applicant) => {
        const draftScore = applicant.draft_score || {};
        return {
          ...applicant,
          educationScore:
            draftScore.education_score !== null &&
            draftScore.education_score !== undefined &&
            draftScore.education_score !== 0 &&
            draftScore.education_score !== '-'
              ? formatNumber(draftScore.education_score)
              : '',
          experienceScore:
            draftScore.experience_score !== null &&
            draftScore.experience_score !== undefined &&
            draftScore.experience_score !== 0 &&
            draftScore.experience_score !== '-'
              ? formatNumber(draftScore.experience_score)
              : '',
          trainingScore:
            draftScore.training_score !== null &&
            draftScore.training_score !== undefined &&
            draftScore.training_score !== 0 &&
            draftScore.training_score !== '-'
              ? formatNumber(draftScore.training_score)
              : '',
          performanceScore:
            draftScore.performance_score !== null &&
            draftScore.performance_score !== undefined &&
            draftScore.performance_score !== 0 &&
            draftScore.performance_score !== '-'
              ? formatNumber(draftScore.performance_score)
              : '',
          behavioralScore:
            draftScore.behavioral_score !== null &&
            draftScore.behavioral_score !== undefined &&
            draftScore.behavioral_score !== 0 &&
            draftScore.behavioral_score !== '-'
              ? formatNumber(draftScore.behavioral_score)
              : '',
          name: `${applicant.firstname} ${applicant.lastname}`,
          ranking: draftScore.ranking || null,
        };
      });

      calculateAllRankings();
    } else {
      applicantsData.value = [];
    }
  };

  const handleInput = (applicant, field) => {
    let value = applicant[field];
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    applicant[field] = value;
  };

  const calculateQS = (applicant) => {
    if (!applicant) return '-';

    const eduScore = isEmpty(applicant.educationScore)
      ? 0
      : parseFloat(applicant.educationScore) || 0;
    const expScore = isEmpty(applicant.experienceScore)
      ? 0
      : parseFloat(applicant.experienceScore) || 0;
    const trainingScore = isEmpty(applicant.trainingScore)
      ? 0
      : parseFloat(applicant.trainingScore) || 0;
    const perfScore = isEmpty(applicant.performanceScore)
      ? 0
      : parseFloat(applicant.performanceScore) || 0;

    if (
      isEmpty(applicant.educationScore) &&
      isEmpty(applicant.experienceScore) &&
      isEmpty(applicant.trainingScore) &&
      isEmpty(applicant.performanceScore)
    ) {
      return '-';
    }

    const qsScore = eduScore + expScore + trainingScore + perfScore;
    const result = Math.min(qsScore, qsMaxRate.value);
    return formatNumber(result);
  };

  const calculateTotal = (applicant) => {
    if (!applicant) return '-';

    const qsScore = calculateQS(applicant);

    if (qsScore === '-') {
      return '-';
    }

    const qsScoreNum = parseFloat(qsScore);
    const beiScore = isEmpty(applicant.behavioralScore)
      ? 0
      : parseFloat(applicant.behavioralScore) || 0;

    const result = Math.min(qsScoreNum + beiScore, totalMaxRate.value);
    return formatNumber(result);
  };

  const calculateAllRankings = () => {
    if (!applicantsData.value.length) return;

    const applicantsWithScores = applicantsData.value.filter((applicant) => {
      const total = calculateTotal(applicant);
      return total !== '-';
    });

    const sortedApplicants = [...applicantsWithScores].sort((a, b) => {
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

    applicantsData.value.forEach((applicant) => {
      applicant.ranking = null;
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

  const validateScore = (applicant, field, maxValue, allowEmpty = false) => {
    const value = applicant[field];

    if (isEmpty(value)) {
      if (allowEmpty) {
        calculateAllRankings();
        return;
      } else {
        $q.notify({
          color: 'warning',
          message: 'This field requires a numeric value',
          icon: 'warning',
          position: 'top',
          timeout: 2000,
        });
        return;
      }
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      $q.notify({
        color: 'warning',
        message: allowEmpty
          ? 'Please enter a valid number or leave empty'
          : 'Please enter a valid number',
        icon: 'warning',
        position: 'top',
        timeout: 2000,
      });
      applicant[field] = '';
      calculateAllRankings();
      return;
    }

    if (numValue < 0) {
      $q.notify({
        color: 'warning',
        message: 'Score cannot be negative',
        icon: 'warning',
        position: 'top',
        timeout: 2000,
      });
      applicant[field] = '';
      calculateAllRankings();
      return;
    }

    if (numValue > maxValue) {
      $q.notify({
        color: 'warning',
        message: `Score cannot exceed ${maxValue}`,
        icon: 'warning',
        position: 'top',
        timeout: 2000,
      });
      applicant[field] = formatNumber(maxValue);
      calculateAllRankings();
      return;
    }

    applicant[field] = formatNumber(numValue);
    calculateAllRankings();
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

  // QS Modal Methods
  const openQSModal = async (applicant) => {
    try {
      console.log('Opening QS Modal');
      console.log('Position ID:', positionID.value);
      console.log('Applicant:', applicant);

      // Prepare applicant data for the QS modal
      selectedApplicantForQS.value = {
        submission_id: applicant.id, // This is the application/submission ID
        PositionID: positionID.value, // Get from computed property
        name: `${applicant.firstname} ${applicant.lastname}`,
        firstname: applicant.firstname,
        lastname: applicant.lastname,
        position: props.position.position,
        office: props.position.office,
        appliedDate: formatDate(applicant.created_at),
        status: applicant.status || 'PENDING',

        // Pass the PDS data directly from the applicant object
        education: applicant.education || [],
        work_experience: applicant.work_experience || [],
        training: applicant.training || [],
        eligibity: applicant.eligibity || [],
        eligibility: applicant.eligibity || [],

        // Additional fields
        nPersonalInfo_id: applicant.nPersonalInfo_id,
        ControlNo: applicant.ControlNo,
      };

      console.log('Selected Applicant for QS:', selectedApplicantForQS.value);

      showQSModal.value = true;
    } catch (error) {
      console.error('Error opening QS modal:', error);
      $q.notify({
        color: 'negative',
        message: 'Failed to open qualification standards',
        icon: 'error',
        position: 'top',
        timeout: 3000,
      });
    }
  };

  const saveDraft = () => {
    const formattedData = applicantsData.value.map((applicant) => {
      const qsScore = calculateQS(applicant);
      const totalScore = calculateTotal(applicant);

      return {
        id: applicant.id,
        nPersonalInfo_id: applicant.nPersonalInfo_id,
        ControlNo: applicant.ControlNo,
        education_score: isEmpty(applicant.educationScore) ? '-' : Number(applicant.educationScore),
        experience_score: isEmpty(applicant.experienceScore)
          ? '-'
          : Number(applicant.experienceScore),
        training_score: isEmpty(applicant.trainingScore) ? '-' : Number(applicant.trainingScore),
        performance_score: isEmpty(applicant.performanceScore)
          ? '-'
          : Number(applicant.performanceScore),
        behavioral_score: isEmpty(applicant.behavioralScore)
          ? '-'
          : Number(applicant.behavioralScore),
        total_qs: qsScore === '-' ? 0 : Number(qsScore),
        grand_total: totalScore === '-' ? 0 : Number(totalScore),
        ranking: applicant.ranking || null,
      };
    });

    console.log(
      'Saving draft ratings with formatted data:',
      JSON.stringify(formattedData, null, 2),
    );

    emit('save-draft', {
      positionId: props.position.id,
      applicants: formattedData,
    });

    $q.notify({
      color: 'info',
      message: 'Draft ratings saved successfully!',
      icon: 'save',
      position: 'top',
      timeout: 2000,
    });
  };

  const submitRatings = () => {
    if (!allApplicantsRated.value) {
      $q.notify({
        color: 'warning',
        message:
          'Please rate all required fields (Education, Experience, Training, Performance) before submitting. BEI can be left empty.',
        icon: 'warning',
        position: 'top',
        timeout: 3000,
      });
      return;
    }

    const formattedData = applicantsData.value.map((applicant) => {
      const qsScore = parseFloat(calculateQS(applicant));
      const totalScore = parseFloat(calculateTotal(applicant));

      return {
        id: applicant.id,
        nPersonalInfo_id: applicant.nPersonalInfo_id,
        ControlNo: applicant.ControlNo,
        education_score: Number(applicant.educationScore),
        experience_score: Number(applicant.experienceScore),
        training_score: Number(applicant.trainingScore),
        performance_score: Number(applicant.performanceScore),
        behavioral_score: isEmpty(applicant.behavioralScore)
          ? '-'
          : Number(applicant.behavioralScore),
        total_qs: Number(qsScore),
        grand_total: Number(totalScore),
        ranking: applicant.ranking || null,
      };
    });

    console.log('Submitting ratings with formatted data:', JSON.stringify(formattedData, null, 2));

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
    color: #1976d2;
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
      text-align: center;
    }

    :deep(input::placeholder) {
      text-align: center;
      color: #999;
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
