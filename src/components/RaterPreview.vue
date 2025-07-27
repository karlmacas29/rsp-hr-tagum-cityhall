    <!-- applicant -->
<template>
  <div>
    <!-- No Data Message -->
    <div v-if="applicants.length === 0" class="no-data-message">
      <q-card flat bordered class="q-pa-md text-center">
        <q-icon name="search_off" size="2rem" color="grey-6" />
        <div class="q-mt-sm text-grey-8">No matching applicants found</div>
      </q-card>
    </div>

    <!-- Applicant Rating Form -->
    <div v-for="applicant in applicants" :key="applicant.id" class="applicant-row q-mb-xs">
      <table class="q-table q-table--bordered full-width">
        <tbody>
          <tr
            class="applicant-row"
            :class="{
              'row-hover': !isPreviewMode,
              expanded: expandedApplicant === applicant.id,
            }"
          >
            <!-- Applicant Name Column -->
            <td
              class="applicant-name text-left compact-cell"
              style="width: 12%"
              @click="toggleApplicant(applicant.id)"
            >
              <div class="row items-center no-wrap">
                <q-btn
                  flat
                  dense
                  round
                  size="xs"
                  :icon="expandedApplicant === applicant.id ? 'expand_less' : 'expand_more'"
                />
                <span class="text-caption ellipsis">{{ applicant.name }}</span>
              </div>
            </td>

            <!-- Education Column -->
            <td class="text-left compact-cell" style="width: 12%">
              <q-input
                v-if="!isPreviewMode"
                v-model.number="applicant.educationScore"
                type="number"
                dense
                outlined
                min="0"
                max="25"
                step="0.1"
                class="score-input"
                @update:model-value="updateRating(applicant.id, 'educationScore', $event)"
                @click.stop
              />
              <span v-else>{{ applicant.educationScore }}</span>
            </td>

            <!-- Experience Column -->
            <td class="text-left compact-cell" style="width: 18%">
              <q-input
                v-if="!isPreviewMode"
                v-model.number="applicant.experienceScore"
                type="number"
                dense
                outlined
                min="0"
                max="25"
                step="0.1"
                class="score-input"
                @update:model-value="updateRating(applicant.id, 'experienceScore', $event)"
                @click.stop
              />
              <span v-else>{{ applicant.experienceScore }}</span>
            </td>

            <!-- Training Column -->
            <td class="text-left compact-cell" style="width: 16%">
              <q-input
                v-if="!isPreviewMode"
                v-model.number="applicant.trainingScore"
                type="number"
                dense
                outlined
                min="0"
                max="15"
                step="0.1"
                class="score-input"
                @update:model-value="updateRating(applicant.id, 'trainingScore', $event)"
                @click.stop
              />
              <span v-else>{{ applicant.trainingScore }}</span>
            </td>

            <!-- Performance Column -->
            <td class="text-left compact-cell" style="width: 18%">
              <q-input
                v-if="!isPreviewMode"
                v-model.number="applicant.performance"
                type="number"
                dense
                outlined
                min="0"
                max="15"
                step="0.1"
                class="score-input"
                @update:model-value="updateRating(applicant.id, 'performance', $event)"
                @click.stop
              />
              <span v-else>{{ applicant.performance }}</span>
            </td>



            <!-- BEI Column -->
            <td class="text-center compact-cell" style="width: 6%">
              <q-input
                v-if="!isPreviewMode"
                v-model.number="applicant.bei"
                type="number"
                dense
                outlined
                min="0"
                max="25"
                step="0.1"
                class="score-input"
                @update:model-value="updateRating(applicant.id, 'bei', $event)"
                @click.stop
              />
              <span v-else>{{ applicant.bei }}</span>
            </td>

             <!-- QS Total Column -->
            <td class="text-center compact-cell" style="width: 6%">
              {{ calculateQS(applicant) }}
            </td>
            <!-- Grand Total Column -->
            <td class="text-center compact-cell total-score" style="width: 6%">
              {{ calculateTotal(applicant) }}
            </td>

            <!-- Ranking Column -->
            <td class="text-center compact-cell ranking" style="width: 6%">
              {{ applicant.ranking }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Expanded details panel -->
    <!-- Update the expanded details panel in RaterPreview.vue -->
<div v-if="expandedApplicant === applicant.id" class="applicant-details q-pa-sm bg-grey-1">
  <div class="text-weight-bold text-caption q-mb-xs">Applicant Qualification Details</div>
  <div class="row q-col-gutter-sm">

    <!-- Education Details -->
    <div class="col-3">
      <div class="detail-panel">
        <div class="detail-title text-caption">Education</div>
        <div class="detail-content text-caption">
          <div v-if="applicant.education && applicant.education.length > 0">
            <div v-for="(edu, index) in applicant.education" :key="index" class="q-mb-xs">
              <div class="text-weight-bold">{{ edu.level }}</div>
              <div>{{ edu.school_name }}</div>
              <div>{{ edu.degree }}</div>
              <div v-if="edu.year_graduated">Graduated: {{ edu.year_graduated }}</div>
              <hr v-if="index < applicant.education.length - 1" class="q-my-xs">
            </div>
          </div>
          <div v-else class="text-grey-6">No education data</div>
        </div>
      </div>
    </div>

    <!-- Work Experience Details -->
    <div class="col-3">
      <div class="detail-panel">
        <div class="detail-title text-caption">Work Experience</div>
        <div class="detail-content text-caption">
          <div v-if="applicant.work_experience && applicant.work_experience.length > 0">
            <div v-for="(work, index) in applicant.work_experience" :key="index" class="q-mb-xs">
              <div class="text-weight-bold">{{ work.position_title }}</div>
              <div>{{ work.department }}</div>
              <div>{{ work.work_date_from }} to {{ work.work_date_to }}</div>
              <div>Salary: ₱{{ work.monthly_salary }}</div>
              <div>{{ work.status_of_appointment }}</div>
              <hr v-if="index < applicant.work_experience.length - 1" class="q-my-xs">
            </div>
          </div>
          <div v-else class="text-grey-6">No work experience</div>
        </div>
      </div>
    </div>

    <!-- Training Details -->
    <div class="col-3">
      <div class="detail-panel">
        <div class="detail-title text-caption">Training</div>
        <div class="detail-content text-caption">
          <div v-if="applicant.training && applicant.training.length > 0">
            <div v-for="(train, index) in applicant.training" :key="index" class="q-mb-xs">
              <div class="text-weight-bold">{{ train.training_title }}</div>
              <div>{{ train.inclusive_date_from }} to {{ train.inclusive_date_to }}</div>
              <div>{{ train.number_of_hours }} hours</div>
              <div>{{ train.conducted_by }}</div>
              <hr v-if="index < applicant.training.length - 1" class="q-my-xs">
            </div>
          </div>
          <div v-else class="text-grey-6">No training data</div>
        </div>
      </div>
    </div>

    <!-- Eligibility Details -->
    <div class="col-3">
      <div class="detail-panel">
        <div class="detail-title text-caption">Eligibility</div>
        <div class="detail-content text-caption">
          <div v-if="applicant.eligibility && applicant.eligibility.length > 0">
            <div v-for="(elig, index) in applicant.eligibility" :key="index" class="q-mb-xs">
              <div class="text-weight-bold">{{ elig.eligibility }}</div>
              <div>Rating: {{ elig.rating }}%</div>
              <div>Exam Date: {{ elig.date_of_examination }}</div>
              <div>License: {{ elig.license_number }}</div>
              <hr v-if="index < applicant.eligibility.length - 1" class="q-my-xs">
            </div>
          </div>
          <div v-else class="text-grey-6">No eligibility data</div>
        </div>
      </div>
    </div>

  </div>
</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RaterPreview',
    props: {
      criteria: {
        type: Object,
        required: true,
      },
      applicants: {
        type: Array,
        required: true,
        default: () => [],
      },
      mode: {
        type: String,
        default: 'preview',
        validator: (value) => ['preview', 'input'].includes(value),
      },
    },
    emits: ['update-rating'],
    data() {
      return {
        expandedApplicant: null,
      };
    },
    computed: {
      isPreviewMode() {
        return this.mode === 'preview';
      },
    },
    methods: {
      toggleApplicant(applicantId) {
        if (this.expandedApplicant === applicantId) {
          this.expandedApplicant = null;
        } else {
          this.expandedApplicant = applicantId;
        }
      },
      updateRating(applicantId, field, value) {
        if (!this.isPreviewMode) {
          // Stop propagation to prevent toggling when clicking input
          event.stopPropagation();
          this.$emit('update-rating', { applicantId, field, value });
        }
      },
      calculateQS(applicant) {
        const education = parseFloat(applicant.educationScore) || 0;
        const experience = parseFloat(applicant.experienceScore) || 0;
        const training = parseFloat(applicant.trainingScore) || 0;
        const performance = parseFloat(applicant.performance) || 0;

        // Ensure QS doesn't exceed 75%
        return Math.min(education + experience + training + performance, 75).toFixed(1);
      },
      calculateTotal(applicant) {
        const qs = parseFloat(this.calculateQS(applicant));
        const bei = parseFloat(applicant.bei) || 0;
        // Ensure the total doesn't exceed 100%
        return Math.min(qs + bei, 100).toFixed(1);
      },
    },
    watch: {
      // Close expanded panels when applicant list changes due to filtering
      applicants() {
        this.expandedApplicant = null;
      },
    },
  };
</script>

<style scoped>

.detail-panel {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
  height: 200px;
  background-color: white;
  overflow-y: auto;
}
.detail-content {
  color: #546e7a;
  font-size: 0.85rem;
  line-height: 1.3;
  max-height: 160px;
  overflow-y: auto;
}

.q-my-xs {
  margin-top: 4px !important;
  margin-bottom: 4px !important;
}

hr.q-my-xs {
  border: none;
  border-top: 1px solid #eee;
  margin: 4px 0;
}
  /* No data message */
  .no-data-message {
    margin: 20px 0;
  }

  .applicant-row {
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .applicant-row:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .applicant-name {
    background-color: #f9f9f9;
    font-weight: 650;
  }

  .score-input {
    min-height: 28px;
  }

  .score-input :deep(.q-field__control) {
    height: 28px;
    min-height: 30px;
  }

  .score-input :deep(.q-field__marginal) {
    height: 28px;
  }

  .score-input :deep(input) {
    font-size: 0.95rem !important;
    line-height: 1.1 !important;
  }

  .score-input :deep(.q-field__native) {
    padding-top: 0;
    padding-bottom: 0;
  }

  .score-input :deep(.q-field__control-container) {
    padding-top: 0;
    padding-bottom: 0;
  }

  .compact-cell {
    padding: 2px 4px !important;
    font-size: 0.95rem;
    line-height: 1.1;
  }

  .total-score {
    font-weight: bold;
    color: #1976d2;
  }

  .ranking {
    font-weight: bold;
    background-color: #f0f8ff;
  }

  .applicant-details {
    border-top: 1px dashed #ddd;
    margin-top: -1px;
  }

  .detail-panel {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 6px;
    height: 100%;
    background-color: white;
  }

  .detail-title {
    font-weight: bold;
    margin-bottom: 4px;
    padding-bottom: 2px;
    border-bottom: 1px solid #eee;
    color: #455a64;
  }

  .detail-content {
    color: #546e7a;
    font-size: 0.95rem;
    line-height: 1.2;
  }

  .q-mb-xs {
    margin-bottom: 2px !important;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
