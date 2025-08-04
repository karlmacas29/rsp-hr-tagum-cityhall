<template>
  <q-dialog v-model="isVisible" persistent transition-show="scale" transition-hide="scale">
    <q-card class="confirmation-modal">
      <q-card-section class="q-pb-none">
        <div class="text-h6 text-weight-bold">Confirm Submission</div>
      </q-card-section>

      <q-card-section>
        <!-- Header text based on slot count -->
        <div class="text-body1 q-mb-md">
          <span v-if="slotCount === 1">
            For the available position slot, the following applicant is recommended:
          </span>
          <span v-else>
            For the {{ slotCount }} available position slots, the following applicants are
            recommended:
          </span>
        </div>

        <!-- Top applicants who will fill the slots -->
        <div class="q-mb-md">
          <div class="text-caption text-weight-medium text-primary q-mb-xs">
            CONSIDERED APPLICANTS
          </div>
          <q-list bordered separator class="rounded-borders bg-green-1">
            <q-item v-for="applicant in topApplicants" :key="applicant.id" class="bg-green-1">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">{{ applicant.ranking }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ applicant.name }}</q-item-label>
                <q-item-label caption lines="2" class="q-mt-xs">
                  <div class="row q-gutter-x-md">
                    <div>
                      <span class="text-weight-medium">QS:</span>
                      {{ formatScore(applicant.totalQS) }}
                    </div>
                    <div>
                      <span class="text-weight-medium">BEI:</span>
                      {{ formatScore(applicant.bei) }}
                    </div>
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="getScoreColor(applicant.grandTotal)" outline class="score-badge">
                  {{ formatScore(applicant.grandTotal) }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Tied applicants section (if any) -->
        <div v-if="tiedApplicants.length > 0" class="q-mb-md">
          <div class="tied-warning q-pa-sm q-mb-sm">
            <q-icon name="warning" size="sm" class="q-mr-xs" />
            <span class="text-weight-medium">Note:</span>
            The following {{ tiedApplicants.length }}
            {{ tiedApplicants.length === 1 ? 'applicant has' : 'applicants have' }} the same ranking
            but {{ tiedApplicants.length === 1 ? 'exceeds' : 'exceed' }} the available slots.
          </div>

          <q-list bordered separator class="rounded-borders bg-amber-1">
            <q-item v-for="applicant in tiedApplicants" :key="applicant.id" class="bg-amber-1">
              <q-item-section avatar>
                <q-avatar color="warning" text-color="white">{{ applicant.ranking }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ applicant.name }}</q-item-label>
                <q-item-label caption lines="2" class="q-mt-xs">
                  <div class="row q-gutter-x-md">
                    <div>
                      <span class="text-weight-medium">QS:</span>
                      {{ formatScore(applicant.totalQS) }}
                    </div>
                    <div>
                      <span class="text-weight-medium">BEI:</span>
                      {{ formatScore(applicant.bei) }}
                    </div>
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="getScoreColor(applicant.grandTotal)" outline class="score-badge">
                  {{ formatScore(applicant.grandTotal) }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Other applicants count -->
        <div v-if="otherApplicants.length > 0" class="text-body2 q-mb-md">
          <span class="text-weight-medium">
            {{ otherApplicants.length }} other
            {{ otherApplicants.length === 1 ? 'applicant' : 'applicants' }}
          </span>
          with lower rankings {{ otherApplicants.length === 1 ? 'was' : 'were' }} not included in
          the recommendation.
        </div>

        <q-separator class="q-my-md" />

        <p class="text-body2">
          <span class="text-weight-medium">Are you sure you want to submit these ratings?</span>
          This action will finalize the ratings and cannot be undone.
        </p>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-2 q-pa-md">
        <q-btn label="Cancel" color="grey" flat v-close-popup @click="cancel" />
        <q-btn label="Confirm & Submit" color="green" @click="confirm" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
  import { ref, computed } from 'vue';

  export default {
    name: 'ConfirmationModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      applicants: {
        type: Array,
        default: () => [],
      },
      slotCount: {
        type: Number,
        default: 1,
      },
    },
    emits: ['update:visible', 'confirm', 'cancel'],
    setup(props, { emit }) {
      const loading = ref(false);
      const isVisible = computed({
        get: () => props.visible,
        set: (value) => emit('update:visible', value),
      });

      // Sorted applicants by ranking and score
      const sortedApplicants = computed(() => {
        return [...props.applicants].sort((a, b) => {
          // First by ranking
          if (a.ranking !== b.ranking) return a.ranking - b.ranking;
          // Then by grandTotal for ties
          return (b.grandTotal || 0) - (a.grandTotal || 0);
        });
      });

      // Top applicants who will fill the available slots
      const topApplicants = computed(() => {
        if (sortedApplicants.value.length === 0) return [];

        // Simply take the top slotCount applicants
        return sortedApplicants.value.slice(0, props.slotCount);
      });

      // Tied applicants who have the same ranking as included applicants but exceed slot count
      const tiedApplicants = computed(() => {
        if (topApplicants.value.length === 0) return [];

        // Get the last ranking from the top applicants
        const lastRank = topApplicants.value[topApplicants.value.length - 1].ranking;

        // Find all applicants with the same rank that didn't make it into the top list
        return sortedApplicants.value.filter(
          (app) =>
            app.ranking === lastRank && !topApplicants.value.some((topApp) => topApp.id === app.id),
        );
      });

      // All other applicants not in top or tied groups
      const otherApplicants = computed(() => {
        if (sortedApplicants.value.length === 0) return [];

        // Get all applicants not in top or tied lists
        return sortedApplicants.value.filter(
          (app) =>
            !topApplicants.value.some((topApp) => topApp.id === app.id) &&
            !tiedApplicants.value.some((tiedApp) => tiedApp.id === app.id),
        );
      });

      // Format score to display with 2 decimal places
      const formatScore = (score) => {
        return Number(score || 0).toFixed(2);
      };

      // Get color based on score
      const getScoreColor = (score) => {
        const numScore = Number(score || 0);
        if (numScore >= 90) return 'positive';
        if (numScore >= 80) return 'primary';
        if (numScore >= 70) return 'info';
        return 'grey';
      };

      // Handler functions
      const confirm = () => {
        loading.value = true;
        setTimeout(() => {
          // Include both successful and tied applicants in the result
          const allRecommended = [...topApplicants.value, ...tiedApplicants.value];
          emit('confirm', allRecommended);
          loading.value = false;
          isVisible.value = false;
        }, 500);
      };

      const cancel = () => {
        emit('cancel');
      };

      return {
        isVisible,
        loading,
        topApplicants,
        tiedApplicants,
        otherApplicants,
        formatScore,
        getScoreColor,
        confirm,
        cancel,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .confirmation-modal {
    width: 550px;
    max-width: 95vw;
  }

  .score-badge {
    font-size: 1rem;
    padding: 4px 8px;
  }

  .bg-green-1 {
    background-color: rgba(76, 175, 80, 0.08);
  }

  .bg-amber-1 {
    background-color: rgba(255, 193, 7, 0.08);
  }

  .tied-warning {
    border-left: 4px solid #ff9800;
    background-color: rgba(255, 152, 0, 0.08);
    border-radius: 4px;
    color: #e65100;
  }

  .text-weight-medium {
    font-weight: 500;
  }
</style>
