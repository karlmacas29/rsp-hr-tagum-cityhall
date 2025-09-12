<template>
  <q-page padding>
    <!-- Header -->
    <div class="row q-mb-md">
      <div class="col-12 bg-white rounded-borders shadow-1 q-pa-md">
        <div class="row justify-between items-center">
          <div class="col">
            <h6 class="q-my-none text-weight-bold">Dashboard</h6>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="raterStore.loading" class="row justify-center q-my-xl">
      <q-spinner-dots size="50px" color="primary" />
    </div>

    <!-- Error State -->
    <div v-if="raterStore.error" class="row q-mb-md">
      <div class="col-12">
        <q-banner class="bg-negative text-white">
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          {{ raterStore.error }}
        </q-banner>
      </div>
    </div>

    <!-- Simplified Stats Cards - Only 2 cards now -->
    <div v-if="!raterStore.loading" class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card class="bg-white stat-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Total Assigned Jobs</div>
                <div class="text-h5 q-mt-sm text-primary">
                  {{ dashboardStats.totalAssignedJobs }}
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
                <div class="text-h6">Completed Ratings</div>
                <div class="text-h5 q-mt-sm text-positive">{{ dashboardStats.ratedPositions }}</div>
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
                <div class="text-h6">Not Started</div>
                <div class="text-h5 q-mt-sm text-warning">
                  {{ notStartedJobs }}
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
    <div v-if="!raterStore.loading && dataLoaded" class="row q-col-gutter-md q-mb-lg">
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
                <span class="stat-value">{{ dashboardStats.totalAssignedJobs }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Completion Rate:</span>
                <span class="stat-value text-positive">{{ completionRate }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Completed:</span>
                <span class="stat-value text-positive">{{ dashboardStats.ratedPositions }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Not Started:</span>
                <span class="stat-value text-warning">{{ notStartedJobs }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!raterStore.loading && raterStore.assignedJobs.length === 0"
      class="row justify-center q-mt-xl"
    >
      <div class="col-12 text-center">
        <q-icon name="assignment_turned_in" size="100px" color="grey-5" />
        <div class="text-h6 text-grey-6 q-mt-md">No assigned positions found</div>
        <div class="text-body2 text-grey-5">Check back later for new assignments</div>
        <q-btn color="primary" label="Refresh" @click="refreshData" class="q-mt-md" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import { use_rater_store } from 'stores/rater_store';

  Chart.register(...registerables);

  // Reactive data
  const statusChart = ref(null);
  const chartInstance = ref(null);
  const dataLoaded = ref(false);

  // Store
  const raterStore = use_rater_store();

  // Computed properties
  const assignedJobs = computed(() => raterStore.assignedJobs);

  const dashboardStats = computed(() => {
    const stats = {
      totalAssignedJobs: assignedJobs.value.length,
      ratedPositions: 0, // Only count completed (submitted) jobs
    };

    console.log('Computing dashboard stats for jobs:', assignedJobs.value.length);

    assignedJobs.value.forEach((job) => {
      console.log(`Job ${job.id}: status=${job.status}, submitted=${job.submitted}`);

      // Count completed ratings - check if submitted is true (regardless of status)
      // or if status indicates completion
      if (
        job.submitted === true ||
        job.status === 'rated' ||
        job.status === 'assessed' ||
        job.status === 'Occupied'
      ) {
        stats.ratedPositions++;
        console.log(`Job ${job.id} counted as completed`);
      }
    });

    console.log('Final dashboard stats:', stats);
    return stats;
  });

  const notStartedJobs = computed(() => {
    return dashboardStats.value.totalAssignedJobs - dashboardStats.value.ratedPositions;
  });

  const completionRate = computed(() => {
    if (dashboardStats.value.totalAssignedJobs === 0) return 0;
    return Math.round(
      (dashboardStats.value.ratedPositions / dashboardStats.value.totalAssignedJobs) * 100,
    );
  });

  const chartData = computed(() => {
    return [
      dashboardStats.value.ratedPositions, // Completed
      notStartedJobs.value, // Not Started
    ];
  });

  // Methods
  const initChart = () => {
    console.log('Initializing chart...');
    console.log('Chart ref:', statusChart.value);
    console.log('Chart data:', chartData.value);

    if (chartInstance.value) {
      chartInstance.value.destroy();
      chartInstance.value = null;
    }

    if (statusChart.value) {
      const ctx = statusChart.value.getContext('2d');

      chartInstance.value = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Not Started'],
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
    } else {
      console.error('Chart canvas ref not found');
    }
  };

  const updateChartSize = () => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  };

  const refreshData = async () => {
    console.log('Refreshing data...');
    dataLoaded.value = false;
    try {
      await raterStore.fetch_assigned_jobs();
      dataLoaded.value = true;
      console.log('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const loadInitialData = async () => {
    console.log('Loading initial data...');
    try {
      await raterStore.fetch_assigned_jobs();
      dataLoaded.value = true;
      console.log('Initial data loaded successfully');
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  // Watchers
  watch(
    chartData,
    (newData) => {
      console.log('Chart data changed:', newData);
      if (chartInstance.value && dataLoaded.value) {
        chartInstance.value.data.datasets[0].data = newData;
        chartInstance.value.update('none'); // No animation for better performance
      }
    },
    { deep: true },
  );

  watch(dataLoaded, (newVal) => {
    console.log('Data loaded status changed:', newVal);
    if (newVal) {
      nextTick(() => {
        if (statusChart.value && !chartInstance.value) {
          initChart();
        }
      });
    }
  });

  // Lifecycle hooks
  onMounted(async () => {
    console.log('Dashboard mounted');

    // Load data first
    await loadInitialData();

    // Initialize chart after data is loaded and DOM is ready
    await nextTick();
    if (statusChart.value && dataLoaded.value) {
      initChart();
    }

    // Add resize listener
    window.addEventListener('resize', updateChartSize);
  });

  onBeforeUnmount(() => {
    console.log('Dashboard unmounting');
    window.removeEventListener('resize', updateChartSize);
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
