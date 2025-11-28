<template>
  <q-page padding>
    <!-- Header -->
    <div class="row q-mb-md">
      <div class="col-12 bg-white rounded-borders shadow-1 q-pa-md">
        <div class="row justify-between items-center">
          <div class="col">
            <h6 class="q-my-none text-weight-bold">Dashboard</h6>
            <p class="text-caption text-grey-7 q-mb-none" v-if="raterStore.user">
              Welcome, {{ raterStore.user.name }}
            </p>
          </div>
          <div class="col-auto">
            <q-btn
              flat
              round
              dense
              icon="refresh"
              @click="refreshData"
              :loading="raterStore.loading"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="raterStore.loading" class="row justify-center q-my-xl">
      <q-spinner-dots size="50px" color="primary" />
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!raterStore.loading && raterStore.isAuthenticated"
      class="row q-col-gutter-md q-mb-lg"
    >
      <div class="col-12 col-md-4">
        <q-card class="bg-white stat-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Total Assigned Jobs</div>
                <div class="text-h5 q-mt-sm text-primary">
                  {{ raterStore.assignedJobsCount }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="assignment" size="48px" color="primary" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-white stat-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Completed Jobs</div>
                <div class="text-h5 q-mt-sm text-positive">
                  {{ raterStore.completedJobsCount }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="check_circle" size="48px" color="positive" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-white stat-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Pending Jobs</div>
                <div class="text-h5 q-mt-sm text-warning">
                  {{ raterStore.pendingJobsCount }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="pending_actions" size="48px" color="warning" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts and Summary -->
    <div
      v-if="!raterStore.loading && raterStore.assignedJobs.length > 0"
      class="row q-col-gutter-md q-mb-lg"
    >
      <!-- Status Chart -->
      <div class="col-12 col-md-8">
        <q-card class="bg-white content-card">
          <q-card-section class="full-height">
            <div class="text-h6">Rating Status Overview</div>
            <div class="chart-container">
              <canvas ref="statusChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Summary Stats -->
      <div class="col-12 col-md-4">
        <q-card class="bg-white content-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Summary</div>
            <div class="stats-list">
              <div class="stat-item">
                <span class="stat-label">Total Jobs:</span>
                <span class="stat-value">{{ raterStore.assignedJobsCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Completion Rate:</span>
                <span class="stat-value text-positive">{{ raterStore.completionRate }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Completed:</span>
                <span class="stat-value text-positive">{{ raterStore.completedJobsCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Pending:</span>
                <span class="stat-value text-warning">{{ raterStore.pendingJobsCount }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import { useRaterAuthStore } from 'stores/authStore_raters'; // Updated import

  Chart.register(...registerables);

  // Reactive data
  const statusChart = ref(null);
  const chartInstance = ref(null);

  // Store - using the correct store name
  const raterStore = useRaterAuthStore();

  // Computed properties for chart data
  const chartData = computed(() => {
    return [raterStore.completedJobsCount, raterStore.pendingJobsCount];
  });

  const initChart = () => {
    console.log('Initializing chart...');

    if (chartInstance.value) {
      chartInstance.value.destroy();
      chartInstance.value = null;
    }

    if (statusChart.value && raterStore.assignedJobs.length > 0) {
      const ctx = statusChart.value.getContext('2d');

      chartInstance.value = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Pending'],
          datasets: [
            {
              label: 'Rating Status',
              data: chartData.value,
              backgroundColor: ['#4caf50', '#ff9800'],
              hoverBackgroundColor: ['#45a049', '#f57c00'],
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  size: 14,
                },
                padding: 20,
                usePointStyle: true,
              },
            },
            tooltip: {
              bodyFont: {
                size: 14,
              },
              padding: 12,
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            },
          },
        },
      });

      console.log('Chart initialized successfully');
    }
  };

  const refreshData = async () => {
    console.log('Refreshing data...');
    // This will call checkAuth_rater internally
    await raterStore.fetch_assigned_jobs();
  };

  // Watchers
  watch(
    chartData,
    (newData) => {
      console.log('Chart data changed:', newData);
      if (chartInstance.value) {
        chartInstance.value.data.datasets[0].data = newData;
        chartInstance.value.update('none');
      }
    },
    { deep: true },
  );

  watch(
    () => raterStore.assignedJobs.length,
    async (newLength) => {
      if (newLength > 0) {
        await nextTick();
        if (statusChart.value && !chartInstance.value) {
          initChart();
        }
      }
    },
  );

  // Lifecycle hooks
  onMounted(async () => {
    console.log('Dashboard mounted');

    // Fetch data on mount using checkAuth_rater
    if (raterStore.isAuthenticated) {
      await raterStore.fetch_assigned_jobs();

      await nextTick();
      if (statusChart.value && raterStore.assignedJobs.length > 0) {
        initChart();
      }
    }
  });

  onBeforeUnmount(() => {
    console.log('Dashboard unmounting');
    if (chartInstance.value) {
      chartInstance.value.destroy();
      chartInstance.value = null;
    }
  });
</script>

<style scoped>
  .stat-card {
    height: 120px;
  }

  .content-card {
    height: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .chart-container {
    position: relative;
    height: calc(100% - 40px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
  }

  .full-height {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .stats-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .stat-item:last-child {
    border-bottom: none;
  }

  .stat-label {
    font-weight: 500;
    color: #666;
  }

  .stat-value {
    font-weight: 600;
    font-size: 1.1em;
  }

  .q-card {
    transition: all 0.2s ease;
  }

  .q-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
</style>
