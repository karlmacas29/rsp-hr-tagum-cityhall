<template>
  <div class="q-mt-xl">
    <div class="row items-center q-mb-md">
      <div class="text-h6">Rater Preview</div>
      <q-badge color="green" class="q-ml-sm">Preview Only</q-badge>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <p class="text-caption text-italic q-mb-md">This is how the form will appear to raters.</p>

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
            <tr>
              <td>Applicant Name</td>
              <td class="preview-cell">20.0</td>
              <td class="preview-cell">20.0</td>
              <td class="preview-cell">15.0</td>
              <td class="preview-cell">15.0</td>
              <td class="preview-cell">70.0</td>
              <td class="preview-cell">25.0</td>
              <td class="preview-cell">95.0</td>
              <td class="preview-cell">1</td>
            </tr>
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
