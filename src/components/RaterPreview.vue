<template>
  <div class="q-mt-xl">
    <div class="row items-center q-mb-md">
      <div class="text-h6">{{ isPreviewMode ? 'Rater Preview' : 'Applicant Rating Form' }}</div>
      <q-badge v-if="isPreviewMode" color="green" class="q-ml-sm">Preview Only</q-badge>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <p v-if="isPreviewMode" class="text-caption text-italic q-mb-md">This is how the form will appear to raters.</p>
        <p v-else class="text-caption text-weight-medium q-mb-md">Please rate each applicant based on the provided criteria.</p>

        <table class="q-table q-table--bordered full-width">
          <thead>
            <tr>
              <th class="text-left" style="width: 12%">Name of Applicant</th>
              <th class="text-left" style="width: 12%">Education<br />(20%)</th>
              <th class="text-left" style="width: 12%">Experience<br />(20%)</th>
              <th class="text-left" style="width: 12%">Training<br />(15%)</th>
              <th class="text-left" style="width: 12%">Performance<br />(15%)</th>
              <th class="text-center" style="width: 10%">TOTAL QS<br />(75%)</th>
              <th class="text-center" style="width: 10%">BEI<br />(30%)</th>
              <th class="text-center" style="width: 10%">GRAND TOTAL<br />(100%)</th>
              <th class="text-center" style="width: 10%">Ranking</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-grey-2">
              <td class="text-left criteria-cell">
                <div class="text-weight-bold">Criteria</div>
              </td>
              <td class="text-left criteria-cell">
                <div>{{ criteria.education.title1 }}</div>
                <div class="text-weight-bold">{{ criteria.education.title2 }}</div>
                <div>{{ criteria.education.description }}</div>
              </td>
              <td class="text-left criteria-cell">
                <div>{{ criteria.experience.title1 }}</div>
                <div class="text-weight-bold">{{ criteria.experience.title2 }}</div>
                <div>{{ criteria.experience.description1 }}</div>
                <div>{{ criteria.experience.description2 }}</div>
              </td>
              <td class="text-left criteria-cell">
                <div>{{ criteria.training.title1 }}</div>
                <div class="text-weight-bold">{{ criteria.training.title2 }}</div>
                <div>{{ criteria.training.description }}</div>
              </td>
              <td class="text-left criteria-cell">
                <div>{{ criteria.performance.title }}</div>
                <div>{{ criteria.performance.rating1 }}</div>
                <div>{{ criteria.performance.rating2 }}</div>
                <div>{{ criteria.performance.rating3 }}</div>
              </td>
              <td class="text-center criteria-cell"></td>
              <td class="text-center criteria-cell"></td>
              <td class="text-center criteria-cell"></td>
              <td class="text-center criteria-cell"></td>
            </tr>

            <!-- For admin preview: show sample data -->
            <template v-if="isPreviewMode">
              <tr>
                <td class="text-caption">Applicant Name</td>
                <td class="preview-cell">20.0</td>
                <td class="preview-cell">20.0</td>
                <td class="preview-cell">15.0</td>
                <td class="preview-cell">15.0</td>
                <td class="preview-cell">70.0</td>
                <td class="preview-cell">25.0</td>
                <td class="preview-cell">95.0</td>
                <td class="preview-cell">1</td>
              </tr>
            </template>

            <!-- For rater input: show actual applicants with input fields -->
            <template v-else>
              <tr v-for="applicant in applicants" :key="applicant.id">
                <td>{{ applicant.name }}</td>
                <td class="rating-cell">
                  <q-input
                    v-model.number="applicant.education"
                    type="number"
                    dense
                    outlined
                    min="0"
                    max="20"
                    step="0.1"
                    @update:model-value="updateRating(applicant.id, 'education', $event)"
                  />
                </td>
                <td class="rating-cell">
                  <q-input
                    v-model.number="applicant.experience"
                    type="number"
                    dense
                    outlined
                    min="0"
                    max="20"
                    step="0.1"
                    @update:model-value="updateRating(applicant.id, 'experience', $event)"
                  />
                </td>
                <td class="rating-cell">
                  <q-input
                    v-model.number="applicant.training"
                    type="number"
                    dense
                    outlined
                    min="0"
                    max="15"
                    step="0.1"
                    @update:model-value="updateRating(applicant.id, 'training', $event)"
                  />
                </td>
                <td class="rating-cell">
                  <q-input
                    v-model.number="applicant.performance"
                    type="number"
                    dense
                    outlined
                    min="0"
                    max="15"
                    step="0.1"
                    @update:model-value="updateRating(applicant.id, 'performance', $event)"
                  />
                </td>
                <td class="text-center">{{ calculateQS(applicant) }}</td>
                <td class="rating-cell">
                  <q-input
                    v-model.number="applicant.bei"
                    type="number"
                    dense
                    outlined
                    min="0"
                    max="30"
                    step="0.1"
                    @update:model-value="updateRating(applicant.id, 'bei', $event)"
                  />
                </td>
                <td class="text-center">{{ calculateTotal(applicant) }}</td>
                <td class="text-center">{{ getRank(applicant) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
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
      required: true
    },
    applicants: {
      type: Array,
      required: true,
      default: () => []
    },
    // Add mode prop to control component behavior
    mode: {
      type: String,
      default: 'preview',
      validator: (value) => ['preview', 'input'].includes(value)
    }
  },
  computed: {
    isPreviewMode() {
      return this.mode === 'preview';
    }
  },
  methods: {
    updateRating(applicantId, field, value) {
      // Only emit events when in input mode
      if (!this.isPreviewMode) {
        this.$emit('update-rating', { applicantId, field, value })
      }
    },
    calculateQS(applicant) {
      return (
        (applicant.education || 0) +
        (applicant.experience || 0) +
        (applicant.training || 0) +
        (applicant.performance || 0)
      ).toFixed(1)
    },
    calculateTotal(applicant) {
      return (
        parseFloat(this.calculateQS(applicant)) +
        (applicant.bei || 0)
      ).toFixed(1)
    },
    getRank(applicant) {
      // Calculate ranking based on total score
      const sorted = [...this.applicants].sort((a, b) =>
        parseFloat(this.calculateTotal(b)) - parseFloat(this.calculateTotal(a))
      )
      return sorted.findIndex(a => a.id === applicant.id) + 1
    }
  }
}
</script>

<style scoped>
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
</style>
