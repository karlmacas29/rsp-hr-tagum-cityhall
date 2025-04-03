<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6 text-weight-bold">Rating Form for Qualification Standards</div>
      <q-btn color="green" label="Update Rating" @click="confirmUpdate" />
    </div>

    <div class="row q-mb-md">
      <div class="col-12 col-sm-6">
        <div class="row">
          <div class="col-4 q-py-sm">Office:</div>
          <div class="col-8">
            <q-input outlined dense v-model="formData.office" />
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="row">
          <div class="col-5 q-py-sm">Salary Grade:</div>
          <div class="col-7">
            <q-input outlined dense v-model="formData.salaryGrade" />
          </div>
        </div>
      </div>
    </div>

    <div class="row q-mb-lg">
      <div class="col-12 col-sm-6">
        <div class="row">
          <div class="col-4 q-py-sm">Position:</div>
          <div class="col-8">
            <q-input outlined dense v-model="formData.position" />
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="row">
          <div class="col-5 q-py-sm">Plantilla Item No.:</div>
          <div class="col-7">
            <q-input outlined dense v-model="formData.plantillaItemNo" />
          </div>
        </div>
      </div>
    </div>

    <div class="q-table-container">
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
              <div class="text-weight-bold"></div>
            </td>
            <td class="text-left criteria-cell">
              <q-input
                v-model="criteria.education.title1"
                dense
                flat
                borderless
                class="no-padding"
              />
              <q-input
                v-model="criteria.education.title2"
                dense
                flat
                borderless
                class="no-padding text-weight-bold"
              />
              <q-input
                v-model="criteria.education.description"
                dense
                flat
                borderless
                class="no-padding"
                type="textarea"
                autogrow
              />
            </td>
            <td class="text-left criteria-cell">
              <q-input
                v-model="criteria.experience.title1"
                dense
                flat
                borderless
                class="no-padding"
              />
              <q-input
                v-model="criteria.experience.title2"
                dense
                flat
                borderless
                class="no-padding text-weight-bold"
              />
              <q-input
                v-model="criteria.experience.description1"
                dense
                flat
                borderless
                class="no-padding"
                type="textarea"
                autogrow
              />
              <q-input
                v-model="criteria.experience.description2"
                dense
                flat
                borderless
                class="no-padding"
              />
            </td>
            <td class="text-left criteria-cell">
              <q-input
                v-model="criteria.training.title1"
                dense
                flat
                borderless
                class="no-padding"
              />
              <q-input
                v-model="criteria.training.title2"
                dense
                flat
                borderless
                class="no-padding text-weight-bold"
              />
              <q-input
                v-model="criteria.training.description"
                dense
                flat
                borderless
                class="no-padding"
                type="textarea"
                autogrow
              />
            </td>
            <td class="text-left criteria-cell">
              <q-input
                v-model="criteria.performance.title"
                dense
                flat
                borderless
                class="no-padding"
              />
              <q-input
                v-model="criteria.performance.rating1"
                dense
                flat
                borderless
                class="no-padding"
              />
              <q-input
                v-model="criteria.performance.rating2"
                dense
                flat
                borderless
                class="no-padding"
              />
              <q-input
                v-model="criteria.performance.rating3"
                dense
                flat
                borderless
                class="no-padding"
              />
            </td>
            <td class="text-center criteria-cell"></td>
            <td class="text-center criteria-cell"></td>
            <td class="text-center criteria-cell"></td>
            <td class="text-center criteria-cell"></td>
          </tr>
          <tr>
            <td>1.</td>
            <td>
              <q-input
                filled
                dense
                v-model="applicant1.education"
                type="number"
                @update:model-value="calculateTotals(applicant1)"
              />
            </td>
            <td>
              <q-input
                filled
                dense
                v-model="applicant1.experience"
                type="number"
                @update:model-value="calculateTotals(applicant1)"
              />
            </td>
            <td>
              <q-input filled dense v-model="applicant1.training" type="text" readonly disable />
            </td>
            <td>
              <q-input
                filled
                dense
                v-model="applicant1.performance"
                type="number"
                @update:model-value="calculateTotals(applicant1)"
              />
            </td>
            <td class="text-center">
              <q-input filled dense v-model="applicant1.totalQS" type="text" readonly disable />
            </td>
            <td>
              <q-input
                filled
                dense
                v-model="applicant1.bei"
                type="number"
                @update:model-value="calculateTotals(applicant1)"
              />
            </td>
            <td class="text-center">
              <q-input filled dense v-model="applicant1.grandTotal" type="text" readonly disable />
            </td>
            <td class="text-center">
              <q-input filled dense v-model="applicant1.ranking" type="text" readonly disable />
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>
              <q-input
                filled
                dense
                v-model="applicant2.education"
                type="number"
                @update:model-value="calculateTotals(applicant2)"
              />
            </td>
            <td>
              <q-input
                filled
                dense
                v-model="applicant2.experience"
                type="number"
                @update:model-value="calculateTotals(applicant2)"
              />
            </td>
            <td>
              <q-input filled dense v-model="applicant2.training" type="text" readonly disable />
            </td>
            <td>
              <q-input
                filled
                dense
                v-model="applicant2.performance"
                type="number"
                @update:model-value="calculateTotals(applicant2)"
              />
            </td>
            <td class="text-center">
              <q-input filled dense v-model="applicant2.totalQS" type="text" readonly disable />
            </td>
            <td>
              <q-input
                filled
                dense
                v-model="applicant2.bei"
                type="number"
                @update:model-value="calculateTotals(applicant2)"
              />
            </td>
            <td class="text-center">
              <q-input filled dense v-model="applicant2.grandTotal" type="text" readonly disable />
            </td>
            <td class="text-center">
              <q-input filled dense v-model="applicant2.ranking" type="text" readonly disable />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to update the rating criteria?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Update" color="primary" @click="updateRating" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'CriteriaRater',

  data() {
    return {
      confirmDialog: false,
      formData: {
        office: '',
        position: '',
        salaryGrade: '',
        plantillaItemNo: '',
      },
      criteria: {
        education: {
          title1: 'High School Graduate',
          title2: 'RELEVANT EDUCATION',
          description:
            "Completion of Bachelor's Degree and/or Master/ Doctorate/ Professional Ed or Position → 20%",
        },
        experience: {
          title1: 'None required',
          title2: 'RELEVANT EXPERIENCE',
          description1:
            'With Experience with higher Salary Grade/level with Office Order of Designation from the Local Chief → 20%',
          description2: 'Without Experience → 10%',
        },
        training: {
          title1: 'None required',
          title2: 'RELEVANT TRAINING',
          description:
            'With the Minimum hours of related Training to the position or at least 4 hours if required of the position → 15%',
        },
        performance: {
          title: 'IPCR Rating/OPV Rating',
          rating1: 'Outstanding → 15%',
          rating2: 'Very Satisfactory → 13%',
          rating3: 'Below VS rating → 10%',
        },
      },
      applicant1: {
        education: '',
        experience: '',
        training: '',
        performance: '',
        bei: '',
        totalQS: '',
        grandTotal: '',
        ranking: '',
      },
      applicant2: {
        education: '',
        experience: '',
        training: '',
        performance: '',
        bei: '',
        totalQS: '',
        grandTotal: '',
        ranking: '',
      },
    }
  },
  methods: {
    confirmUpdate() {
      this.confirmDialog = true
    },
    updateRating() {
      this.calculateAllTotals()
      this.$q.notify({
        color: 'positive',
        message: 'Rating criteria updated successfully',
        icon: 'check_circle',
      })
    },
    calculateAllTotals() {
      this.calculateTotals(this.applicant1)
      this.calculateTotals(this.applicant2)
    },
    calculateTotals(applicant) {
      const education = parseFloat(applicant.education) || 0
      const experience = parseFloat(applicant.experience) || 0
      const training = parseFloat(applicant.training) || 0
      const performance = parseFloat(applicant.performance) || 0
      const bei = parseFloat(applicant.bei) || 0

      applicant.totalQS = (education + experience + training + performance).toFixed(1)
      applicant.grandTotal = (parseFloat(applicant.totalQS) + bei).toFixed(1)
    },
  },
}
</script>

<style scoped>
.criteria-cell {
  padding: 8px;
  font-size: 12px;
  vertical-align: top;
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

.no-padding {
  padding: 0;
}

.no-padding :deep(.q-field__control) {
  padding: 0;
  min-height: unset;
}

.no-padding :deep(.q-field__marginal) {
  display: none;
}

.q-field--disabled {
  background-color: #f5f5f5;
}

.q-field--disabled .q-field__control {
  background-color: #f5f5f5;
  color: #666;
}
</style>
