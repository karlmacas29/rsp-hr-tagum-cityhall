<template>
  <q-dialog v-model="localShow" persistent>
    <q-card
      class="applicant-score-modal"
      style="width: 1200px; max-width: 98vw; max-height: 98vh; overflow: auto"
    >
      <!-- Sticky Applicant Header -->
      <q-card-section class="row items-center header q-px-md q-py-sm">
        <q-img
          :src="applicantImageUrl || 'https://placehold.co/100'"
          class="bg-grey-4"
          style="width: 90px; height: 90px; border-radius: 10px; margin-right: 24px"
          alt="Applicant Photo"
        />
        <div class="col">
          <div class="applicant-name">
            {{ applicantName }}
          </div>
          <div class="applicant-info">Position: {{ applicant?.position || 'N/A' }}</div>
          <div class="applicant-info">Final Rank: #{{ finalScores?.rank || 'N/A' }}</div>
        </div>
        <div class="col-auto">
          <q-btn icon="close" flat round dense class="close-btn q-ml-md" @click="closeModal" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="main-content-section q-pa-none">
        <!-- Individual Rater Scores -->
        <div v-if="raterScores.length > 0" class="q-mb-lg q-pa-md">
          <div class="section-title">Individual Rater Scores</div>
          <q-card flat class="modern-table-card">
            <q-table
              :rows="raterScores"
              :columns="columns"
              row-key="id"
              flat
              dense
              hide-pagination
              separator="cell"
              wrap-cells
              :hide-header="false"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="modern-table-header"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props" class="modern-table-row">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="modern-table-cell"
                  >
                    <template v-if="col.name === 'rater'">
                      <span class="text-weight-medium">
                        {{ props.row.rater_name || 'Anonymous Rater' }}
                      </span>
                      <div v-if="props.row.rater_id" class="text-caption text-grey-6">
                        ID: {{ props.row.rater_id }}
                      </div>
                    </template>
                    <template v-else-if="col.name === 'rank'">
                      <q-badge
                        :color="getRankColor(props.row.ranking)"
                        class="text-caption q-px-sm"
                        rounded
                      >
                        {{ props.row.ranking }}
                      </q-badge>
                    </template>
                    <template v-else-if="col.name === 'grandTotal'">
                      <span class="text-bold">{{ formatScore(props.row.grand_total) }}</span>
                    </template>
                    <template v-else>
                      {{ formatScore(props.row[col.field]) }}
                    </template>
                  </q-td>
                </q-tr>
              </template>
              <template v-slot:no-data>
                <div class="full-width row flex-center q-pa-md text-grey-7">
                  <q-icon name="info" size="18px" class="q-mr-sm" />
                  No individual rater scores available
                </div>
              </template>
            </q-table>
          </q-card>
        </div>

        <!-- Final/Average Scores -->
        <div v-if="finalScores" class="q-pa-md">
          <div class="section-title">Final Averaged Scores</div>
          <q-card flat class="modern-table-card">
            <q-table
              :rows="[finalScores]"
              :columns="finalScoreColumns"
              row-key="nPersonalInfo_id"
              flat
              dense
              hide-pagination
              separator="cell"
              wrap-cells
              :hide-header="false"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="modern-table-header"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props" class="modern-table-row">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="modern-table-cell"
                  >
                    <template v-if="col.name === 'rank'">
                      <q-badge
                        :color="getRankColor(props.row.rank)"
                        class="text-caption q-px-sm"
                        rounded
                      >
                        {{ props.row.rank }}
                      </q-badge>
                    </template>
                    <template v-else-if="col.name === 'grandTotal'">
                      <span class="text-bold text-positive">
                        {{ formatScore(props.row.grand_total) }}
                      </span>
                    </template>
                    <template v-else>
                      {{ formatScore(props.row[col.field]) }}
                    </template>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card>
        </div>

        <!-- No data message -->
        <div
          v-if="raterScores.length === 0 && !finalScores"
          class="text-center q-pa-md text-grey-6"
        >
          <q-icon name="info" size="2em" />
          <div class="q-mt-sm">No scoring data available for this applicant</div>
        </div>
      </q-card-section>

      <!-- Footer Actions -->
      <q-separator />
      <q-card-section class="footer-actions bg-grey-2 q-py-sm">
        <div class="row justify-between items-center q-gutter-sm" style="width: 100%">
          <div class="text-body2 text-grey-8" v-if="showHireButton">
            <q-icon name="info" color="primary" class="q-mr-xs" />
            Note: This applicant is considered qualified for the position and may be hired.
          </div>

          <div>
            <q-btn
              v-if="showHireButton"
              color="positive"
              icon="work"
              label="Hire"
              class="q-mr-sm"
              @click="hireApplicant"
              :loading="hiringLoading"
              unelevated
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
  import { ref, computed, watch } from 'vue';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { toast } from 'src/boot/toast';

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
      ratingData: {
        type: Object,
        default: () => ({ total_completed: 0, total_assigned: 0 }),
      },
    },
    emits: ['update:show', 'close'],
    setup(props, { emit }) {
      const localShow = ref(props.show);
      const raterScores = ref([]);
      const finalScores = ref(null);
      const applicantImageUrl = ref('');
      const showControlNo = ref(false);
      const hiringLoading = ref(false);

      const jobPostStore = useJobPostStore();

      const applicantName = computed(() => {
        if (!props.applicant) return 'Unknown Applicant';

        const firstName = props.applicant.firstname || props.applicant.first_name || '';
        const lastName = props.applicant.lastname || props.applicant.last_name || '';
        const extension = props.applicant.name_extension
          ? ` ${props.applicant.name_extension}`
          : '';

        return `${firstName} ${lastName}${extension}`.trim() || 'Unknown Applicant';
      });

      // Computed property to determine if hire button should be shown
      const showHireButton = computed(() => {
        // Check if all ratings are completed
        const allRatingsCompleted =
          props.ratingData.total_completed === props.ratingData.total_assigned;

        // Check if applicant rank is within top 5
        const applicantRank = parseInt(finalScores.value?.rank) || 999;
        const isTopFive = applicantRank <= 5;

        return allRatingsCompleted && isTopFive;
      });

      const columns = ref([
        { name: 'rater', label: 'Rater', field: 'rater_name', align: 'left' },
        {
          name: 'education',
          label: 'Education',
          field: 'education',
          align: 'center',
        },
        {
          name: 'experience',
          label: 'Experience',
          field: 'experience',
          align: 'center',
        },
        {
          name: 'training',
          label: 'Training',
          field: 'training',
          align: 'center',
        },
        {
          name: 'performance',
          label: 'Performance',
          field: 'performance',
          align: 'center',
        },
        { name: 'bei', label: 'BEI', field: 'bei', align: 'center' },
        { name: 'totalQs', label: 'Total QS', field: 'total_qs', align: 'center' },
        { name: 'rank', label: 'Rank', field: 'ranking', align: 'center' },
        {
          name: 'grandTotal',
          label: 'Grand Total',
          field: 'grand_total',
          align: 'center',
        },
      ]);

      const finalScoreColumns = ref([
        {
          name: 'education',
          label: 'Education',
          field: 'education',
          align: 'center',
        },
        {
          name: 'experience',
          label: 'Experience',
          field: 'experience',
          align: 'center',
        },
        {
          name: 'training',
          label: 'Training',
          field: 'training',
          align: 'center',
        },
        {
          name: 'performance',
          label: 'Performance',
          field: 'performance',
          align: 'center',
        },
        { name: 'bei', label: 'BEI', field: 'bei', align: 'center' },
        { name: 'totalQs', label: 'Total QS', field: 'total_qs', align: 'center' },
        { name: 'rank', label: 'Final Rank', field: 'rank', align: 'center' },
        {
          name: 'grandTotal',
          label: 'Final Total',
          field: 'grand_total',
          align: 'center',
        },
      ]);

      // DEFINE ALL FUNCTIONS FIRST BEFORE WATCHERS

      const closeModal = () => {
        localShow.value = false;
      };

      const cleanupModal = () => {
        raterScores.value = [];
        finalScores.value = null;
        applicantImageUrl.value = '';
        showControlNo.value = false;
        hiringLoading.value = false;
        emit('close');
      };

      const getRankColor = (rank) => {
        const rankNum = parseInt(rank);
        if (rankNum === 1) return 'orange';
        if (rankNum === 2) return 'grey-6';
        if (rankNum === 3) return 'brown';
        return 'grey';
      };

      const formatScore = (score) => {
        if (score === null || score === undefined || score === '') return '0.00';
        const num = parseFloat(score);
        return isNaN(num) ? '0.00' : num.toFixed(2);
      };

      const hireApplicant = async () => {
        try {
          hiringLoading.value = true;

          // Prepare the payload for hiring
          const payload = {
            nPersonalInfo_id: props.applicant.nPersonalInfo_id,
            job_batches_rsp_id: props.applicant.job_batches_rsp_id,
            rank: finalScores.value?.rank,
            grand_total: finalScores.value?.grand_total,
            firstname: props.applicant.firstname,
            lastname: props.applicant.lastname,
            name_extension: props.applicant.name_extension || '',
            position: props.applicant.position,
          };

          console.log('Hiring applicant with payload:', payload);

          await jobPostStore.hiredApplicant(payload);

          toast.success(`Successfully hired ${applicantName.value}!`);

          // Close the modal after successful hiring
          closeModal();
        } catch (error) {
          console.error('Error hiring applicant:', error);
          toast.error('Failed to hire applicant. Please try again.');
        } finally {
          hiringLoading.value = false;
        }
      };

      const loadScoreData = () => {
        console.log('Loading score data for applicant:', props.applicant);

        if (!props.applicant) {
          console.warn('No applicant data available');
          return;
        }

        // Set image URL
        applicantImageUrl.value = props.applicant.image_url || 'https://placehold.co/100';

        // Load individual rater scores from history
        if (props.applicant.history && Array.isArray(props.applicant.history)) {
          raterScores.value = props.applicant.history.map((score, index) => ({
            ...score,
            // Ensure we have a unique ID for each row
            id: score.id || `rater-${index}`,
          }));
          console.log('Loaded rater scores:', raterScores.value);
        } else {
          console.log('No history data found in applicant:', props.applicant);
          raterScores.value = [];
        }

        // Set final scores (the averaged scores from the main applicant data)
        finalScores.value = {
          education: props.applicant.education,
          experience: props.applicant.experience,
          training: props.applicant.training,
          performance: props.applicant.performance,
          bei: props.applicant.bei,
          total_qs: props.applicant.total_qs,
          grand_total: props.applicant.grand_total,
          rank: props.applicant.rank,
          nPersonalInfo_id: props.applicant.nPersonalInfo_id,
        };

        console.log('Final scores set:', finalScores.value);
        console.log('Rater scores set:', raterScores.value);
      };

      // NOW DEFINE WATCHERS AFTER ALL FUNCTIONS ARE DECLARED

      // Watch for show prop changes
      watch(
        () => props.show,
        (newVal) => {
          localShow.value = newVal;
          if (newVal) {
            loadScoreData();
          }
        },
        { immediate: true },
      );

      // Watch for applicant changes
      watch(
        () => props.applicant,
        () => {
          if (props.show) {
            loadScoreData();
          }
        },
        { deep: true },
      );

      watch(localShow, (newVal) => {
        emit('update:show', newVal);
        if (!newVal) {
          cleanupModal();
        }
      });

      return {
        localShow,
        raterScores,
        finalScores,
        applicantImageUrl,
        showControlNo,
        applicantName,
        columns,
        finalScoreColumns,
        closeModal,
        getRankColor,
        formatScore,
        showHireButton,
        hireApplicant,
        hiringLoading,
      };
    },
  };
</script>

<style scoped lang="scss">
  .applicant-score-modal {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
  }

  .header {
    background-color: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .applicant-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }

  .applicant-info {
    font-size: 10px;
    color: #666;
    margin-bottom: 2px;
  }

  .modern-table-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
    border-radius: 8px;
    border: 2px solid #eee !important;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .modern-table-header {
    background-color: #fff !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    color: #333 !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid #eee;
  }

  .modern-table-row {
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9f9f9;
    }

    &:nth-child(even) {
      background-color: #fafafa;
    }
  }

  .modern-table-cell {
    padding: 12px 16px !important;
    font-size: 11px !important;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
  }

  .section-title {
    font-size: 14px;
    font-weight: 400;
    color: #333;
    margin: 0 0 12px 0;
  }

  .footer-actions {
    flex: 0 0 auto;
    border-top: 1px solid #eee;
  }

  .control-badge {
    font-size: 9px;
  }

  .hire-note {
    display: flex;
    align-items: center;
    font-size: 12px;
  }

  .hire-btn {
    font-weight: 500;
    padding: 8px 16px;
  }
</style>
