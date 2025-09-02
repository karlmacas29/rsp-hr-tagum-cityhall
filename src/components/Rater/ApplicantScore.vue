<template>
  <q-dialog v-model="localShow" persistent @show="onModalShow" @hide="onModalHide">
    <q-card class="applicant-score-modal">
      <q-card-section
        class="row items-center bg-primary text-white"
        style="position: relative; padding-bottom: 12px"
      >
        <div>
          <div class="text-h6 text-bold">Applicant Scores by Rater</div>
          <div class="text-subtitle1 q-mt-xs">
            {{ applicantName }}
          </div>
          <div class="text-subtitle1 q-mt-xs">
            {{ applicant.status }}
          </div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense class="close-btn" @click="closeModal" />
      </q-card-section>

      <q-card-section style="padding-top: 12px">
        <q-table :rows="raterScores" :columns="columns" row-key="rater" flat dense hide-pagination>
          <template v-slot:body-cell-rank="props">
            <q-td :props="props">
              <span class="text-bold">
                <q-badge color="green" class="text-caption q-px-sm" rounded>
                  {{ props.row.rank }}
                </q-badge>
              </span>
            </q-td>
          </template>
          <template v-slot:body-cell-grandTotal="props">
            <q-td :props="props">
              <span class="text-bold">{{ props.row.grandTotal }}</span>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
  export default {
    name: 'ApplicantScoreModal',
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      applicant: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        localShow: this.show,
        raterScores: [],
        columns: [
          { name: 'rater', label: 'Rater', field: 'rater', align: 'left' },
          {
            name: 'education',
            label: 'Education',
            field: 'education',
            align: 'left',
          },
          {
            name: 'experience',
            label: 'Experience',
            field: 'experience',
            align: 'left',
          },
          {
            name: 'trainingPerformance',
            label: 'Training Performance',
            field: 'trainingPerformance',
            align: 'left',
          },
          { name: 'bei', label: 'BEI', field: 'bei', align: 'left' },
          { name: 'totalQs', label: 'Total QS', field: 'totalQs', align: 'center' },
          { name: 'rank', label: 'Rank', field: 'rank', align: 'center' },
          {
            name: 'grandTotal',
            label: 'Grand Total',
            field: 'grandTotal',
            align: 'center',
          },
        ],
      };
    },
    computed: {
      applicantName() {
        if (!this.applicant) return '';
        let ext = this.applicant.name_extension ? ` ${this.applicant.name_extension}` : '';
        let firstname = this.applicant.firstname || this.applicant.first_name || '';
        let lastname = this.applicant.lastname || this.applicant.last_name || '';
        return `${firstname} ${lastname}${ext}`;
      },
    },
    watch: {
      show(val) {
        this.localShow = val;
        if (val) {
          this.loadRaterScores();
        }
      },
      localShow(val) {
        this.$emit('update:show', val);
        if (!val) this.$emit('close');
      },
      applicant: {
        handler() {
          if (this.localShow) this.loadRaterScores();
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      onModalShow() {
        this.loadRaterScores();
      },
      onModalHide() {
        this.$emit('close');
      },
      closeModal() {
        this.localShow = false;
      },
      loadRaterScores() {
        if (
          this.applicant &&
          Array.isArray(this.applicant.raterScores) &&
          this.applicant.raterScores.length
        ) {
          this.raterScores = this.applicant.raterScores;
        } else {
          this.raterScores = [
            {
              rater: 'Rater 1',
              education: 25,
              experience: 30,
              trainingPerformance: 20,
              bei: 15,
              totalQs: 90,
              rank: 1,
              grandTotal: 180,
            },
            {
              rater: 'Rater 2',
              education: 24,
              experience: 28,
              trainingPerformance: 19,
              bei: 16,
              totalQs: 87,
              rank: 2,
              grandTotal: 174,
            },
          ];
        }
      },
    },
  };
</script>

<style scoped>
  .applicant-score-modal {
    width: 1000px;
    max-width: 95vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow:
      0 2px 12px 0 rgba(38, 50, 56, 0.12),
      0 1.5px 7px 0 rgba(38, 50, 56, 0.08);
    border: 1px solid #eee;
    background: #fff;
  }
  .q-card-section.bg-primary {
    border-radius: 12px 12px 0 0;
    padding: 18px 24px 10px 24px !important;
  }

  .text-h6.text-bold {
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .close-btn {
    position: absolute;
    right: 16px;
    top: 10px;
    color: #fff;
    z-index: 2;
  }

  .q-table {
    background: #fff;
    border-radius: 8px;
    font-size: 1rem;
  }
  .q-table thead tr {
    background: #f7f7fa;
    font-weight: 600;
  }
  .q-table tr:hover {
    background-color: rgba(33, 86, 164, 0.04);
  }
  .q-td .text-bold {
    font-weight: 700;
  }
</style>
