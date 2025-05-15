<template>
  <div class="q-mt-xl">
    <div class="row items-center q-mb-md">
      <div class="text-h6">{{ isPreviewMode ? 'Rater Preview' : 'Applicant Rating Form' }}</div>
      <q-badge v-if="isPreviewMode" color="green" class="q-ml-sm">Preview Only</q-badge>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <p v-if="isPreviewMode" class="text-caption text-italic q-mb-md">
          This is how the form will appear to raters.
        </p>
        <p v-else class="text-caption text-weight-medium q-mb-md">
          Please rate each applicant based on the provided criteria.
        </p>

        <div class="applicant-rating-container">
          <!-- Criteria Row - Always visible -->
          <div class="criteria-header">
            <table class="q-table q-table--bordered full-width">
              <thead>
                <tr>
                  <th class="text-left" style="width: 12%">Name of Applicant</th>
                  <th class="text-left" style="width: 12%">
                    Education
                    <br />
                    (25%)
                  </th>
                  <th class="text-left" style="width: 12%">
                    Experience
                    <br />
                    (25%)
                  </th>
                  <th class="text-left" style="width: 12%">
                    Training
                    <br />
                    (15%)
                  </th>
                  <th class="text-left" style="width: 12%">
                    Performance
                    <br />
                    (15%)
                  </th>
                  <th class="text-center" style="width: 10%">
                    TOTAL QS
                    <br />
                    (75%)
                  </th>
                  <th class="text-center" style="width: 10%">
                    BEI
                    <br />
                    (25%)
                  </th>
                  <th class="text-center" style="width: 10%">
                    GRAND TOTAL
                    <br />
                    (100%)
                  </th>
                  <th class="text-center" style="width: 10%">Ranking</th>
                </tr>
              </thead>
            </table>
          </div>

          <!-- Criteria description row -->
          <div class="criteria-description">
            <table class="q-table q-table--bordered full-width">
              <tbody>
                <tr class="bg-grey-2">
                  <td class="text-left criteria-cell" style="width: 12%">
                    <div class="text-weight-bold">Criteria</div>
                  </td>
                  <td class="text-left criteria-cell" style="width: 12%">
                    <div class="text-weight-bold">HIGH SCORE INDICATOR</div>
                    <div>Completion of relevant college degree</div>
                  </td>
                  <td class="text-left criteria-cell" style="width: 12%">
                    <div class="text-weight-bold">RELEVANT EXPERIENCE</div>
                    <div>Supervisory Experience</div>
                    <div>
                      With direct supervisory experience with exemplary rating in at least 2 rating
                      periods – Very Good = 15%
                    </div>
                    <div>With Work Experience = 10%, None = 0</div>
                  </td>
                  <td class="text-left criteria-cell" style="width: 12%">
                    <div class="text-weight-bold">RELEVANT TRAINING</div>
                    <div>Training Hours</div>
                    <div>Up to 40 hours of training = 15%, None or less than required = 0</div>
                  </td>
                  <td class="text-left criteria-cell" style="width: 12%">
                    <div class="text-weight-bold">PDS Integrity/ PPSB Outstanding = 15%</div>
                    <div>Very Satisfactory = 7%</div>
                    <div>Below VS rating = 0</div>
                  </td>
                  <td class="text-center criteria-cell" style="width: 10%"></td>
                  <td class="text-center criteria-cell" style="width: 10%"></td>
                  <td class="text-center criteria-cell" style="width: 10%"></td>
                  <td class="text-center criteria-cell" style="width: 10%"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- For admin preview: show sample data -->
          <div v-if="isPreviewMode" class="applicant-list">
            <table class="q-table q-table--bordered full-width">
              <tbody>
                <tr>
                  <td class="text-caption" style="width: 12%">ALCOBER, RUEL ANTO</td>
                  <td class="preview-cell" style="width: 12%">25.0</td>
                  <td class="preview-cell" style="width: 12%">25.0</td>
                  <td class="preview-cell" style="width: 12%">15.0</td>
                  <td class="preview-cell" style="width: 12%">15.0</td>
                  <td class="preview-cell" style="width: 10%">75.0</td>
                  <td class="preview-cell" style="width: 10%">25.0</td>
                  <td class="preview-cell" style="width: 10%">100.0</td>
                  <td class="preview-cell" style="width: 10%">1</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- For rater input: show actual applicants with input fields -->
          <div v-else class="applicant-list">
            <div v-for="applicant in applicants" :key="applicant.id" class="applicant-card q-mb-md">
              <table class="q-table q-table--bordered full-width applicant-table">
                <tbody>
                  <tr
                    class="applicant-row"
                    :class="{
                      'row-hover': !isPreviewMode,
                      expanded: expandedApplicant === applicant.id,
                    }"
                  >
                    <td class="applicant-name" style="width: 12%">
                      <div class="row items-center">
                        <q-btn
                          flat
                          dense
                          round
                          size="sm"
                          :icon="expandedApplicant === applicant.id ? 'expand_less' : 'expand_more'"
                          @click.stop="toggleApplicant(applicant.id)"
                        />
                        <span>{{ applicant.name }}</span>
                      </div>
                    </td>
                    <td class="rating-cell" style="width: 12%">
                      <q-input
                        v-model.number="applicant.education"
                        type="number"
                        dense
                        outlined
                        min="0"
                        max="25"
                        step="0.1"
                        :rules="[
                          (val) => (val >= 0 && val <= 25) || 'Value must be between 0 and 25',
                        ]"
                        @update:model-value="updateRating(applicant.id, 'education', $event)"
                        @click.stop
                      />
                    </td>
                    <td class="rating-cell" style="width: 12%">
                      <q-input
                        v-model.number="applicant.experience"
                        type="number"
                        dense
                        outlined
                        min="0"
                        max="25"
                        step="0.1"
                        :rules="[
                          (val) => (val >= 0 && val <= 25) || 'Value must be between 0 and 25',
                        ]"
                        @update:model-value="updateRating(applicant.id, 'experience', $event)"
                        @click.stop
                      />
                    </td>
                    <td class="rating-cell" style="width: 12%">
                      <q-input
                        v-model.number="applicant.training"
                        type="number"
                        dense
                        outlined
                        min="0"
                        max="15"
                        step="0.1"
                        :rules="[
                          (val) => (val >= 0 && val <= 15) || 'Value must be between 0 and 15',
                        ]"
                        @update:model-value="updateRating(applicant.id, 'training', $event)"
                        @click.stop
                      />
                    </td>
                    <td class="rating-cell" style="width: 12%">
                      <q-input
                        v-model.number="applicant.performance"
                        type="number"
                        dense
                        outlined
                        min="0"
                        max="15"
                        step="0.1"
                        :rules="[
                          (val) => (val >= 0 && val <= 15) || 'Value must be between 0 and 15',
                        ]"
                        @update:model-value="updateRating(applicant.id, 'performance', $event)"
                        @click.stop
                      />
                    </td>
                    <td class="text-center" style="width: 10%">{{ calculateQS(applicant) }}</td>
                    <td class="rating-cell" style="width: 10%">
                      <q-input
                        v-model.number="applicant.bei"
                        type="number"
                        dense
                        outlined
                        min="0"
                        max="25"
                        step="0.1"
                        :rules="[
                          (val) => (val >= 0 && val <= 25) || 'Value must be between 0 and 25',
                        ]"
                        @update:model-value="updateRating(applicant.id, 'bei', $event)"
                        @click.stop
                      />
                    </td>
                    <td class="text-center total-score" style="width: 10%">
                      {{ calculateTotal(applicant) }}
                    </td>
                    <td class="text-center ranking" style="width: 10%">{{ getRank(applicant) }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Expanded details panel -->
              <div
                v-if="expandedApplicant === applicant.id"
                class="applicant-details q-pa-md bg-grey-1"
              >
                <div class="text-weight-bold q-mb-sm">Applicant Qualification Standard</div>
                <div class="row q-col-gutter-md">
                  <div class="col-3">
                    <div class="detail-panel">
                      <div class="detail-title">Education</div>
                      <div class="detail-content">
                        {{ applicant.educationDetails || 'Masters in Disaster Management' }}
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="detail-panel">
                      <div class="detail-title">Experience</div>
                      <div class="detail-content">
                        {{ applicant.experienceDetails || '5 years as Assistant DRRM Officer' }}
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="detail-panel">
                      <div class="detail-title">Training</div>
                      <div class="detail-content">
                        {{ applicant.trainingDetails || '60 hours DRRM Training' }}
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="detail-panel">
                      <div class="detail-title">Performance</div>
                      <div class="detail-content">
                        {{ applicant.performanceDetails || 'Civil Service Professional' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
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
        const education = parseFloat(applicant.education) || 0;
        const experience = parseFloat(applicant.experience) || 0;
        const training = parseFloat(applicant.training) || 0;
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
      getRank(applicant) {
        const sorted = [...this.applicants].sort(
          (a, b) => parseFloat(this.calculateTotal(b)) - parseFloat(this.calculateTotal(a)),
        );
        return sorted.findIndex((a) => a.id === applicant.id) + 1;
      },
    },
  };
</script>

<style scoped>
  .applicant-rating-container {
    display: flex;
    flex-direction: column;
  }

  .criteria-header,
  .criteria-description,
  .applicant-list {
    width: 100%;
  }

  .criteria-cell {
    padding: 8px;
    font-size: 12px;
    vertical-align: top;
  }

  .preview-cell {
    background-color: #f5f5f5;
    color: #777;
    text-align: center;
  }

  .applicant-card {
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .applicant-card:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
  }

  .applicant-table {
    margin-bottom: 0;
  }

  .applicant-name {
    background-color: #f9f9f9;
    font-weight: 500;
  }

  .rating-cell .q-field {
    margin-bottom: 0;
  }

  .q-table {
    border-collapse: collapse;
    width: 100%;
  }

  .q-table th,
  .q-table td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .q-table th {
    background-color: #f2f2f2;
  }

  .row-hover {
    cursor: pointer;
  }

  .row-hover:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .applicant-row {
    position: relative;
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
  }

  .detail-panel {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 12px;
    height: 100%;
    background-color: white;
  }

  .detail-title {
    font-weight: bold;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #eee;
    color: #455a64;
  }

  .detail-content {
    color: #546e7a;
    font-size: 0.95rem;
  }
</style>
