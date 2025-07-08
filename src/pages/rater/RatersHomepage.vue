<template>
  <q-page padding>
    <!-- Header with Date/Time Info -->
    <div class="row q-mb-md">
      <div class="col-12 bg-white rounded-borders shadow-1 q-pa-md">
        <div class="row justify-between items-center">
          <div class="col">
            <h6 class="q-my-none text-weight-bold">Dashboard</h6>
          </div>
          <div class="col-auto text-caption text-right">
            <div>Current Date and Time (UTC): {{ currentDateTime }}</div>
            <div>Current User's Login: {{ currentUser }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rating Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card class="bg-white stat-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Positions to Rate</div>
                <div class="text-h5 q-mt-sm text-primary">{{ positionsToRate }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="assignment" size="48px" color="primary" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="bg-white stat-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Rated Positions</div>
                <div class="text-h5 q-mt-sm text-positive">{{ ratedPositions }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="check_circle" size="48px" color="positive" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="bg-white stat-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">In Progress</div>
                <div class="text-h5 q-mt-sm text-warning">{{ inProgressRatings }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="pending_actions" size="48px" color="warning" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="bg-white stat-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Overdue</div>
                <div class="text-h5 q-mt-sm text-negative">{{ overdueRatings }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="event_busy" size="48px" color="negative" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Upcoming Deadlines Section (with fixed height and scrollable content) -->
      <div class="col-12 col-md-6">
        <q-card class="bg-white content-card">
          <q-card-section class="deadline-header q-pb-xs">
            <div class="text-h6">Upcoming Rating Deadlines</div>
          </q-card-section>
          <q-card-section class="deadline-content q-pt-none">
            <q-scroll-area style="height: 380px">
              <q-list separator>
                <q-item
                  v-for="(deadline, index) in sortedDeadlines"
                  :key="index"
                  class="q-py-sm"
                  clickable
                  v-ripple
                >
                  <q-item-section>
                    <q-item-label class="text-subtitle1">{{ deadline.position }}</q-item-label>
                    <q-item-label caption>{{ deadline.department }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge :color="getDeadlineColor(deadline.daysLeft)">
                      {{ deadline.date }} ({{ deadline.daysLeft }} days left)
                    </q-badge>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="assignment"
                      @click="startRating(deadline)"
                    >
                      <q-tooltip>Start Rating</q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>

      <!-- Status Chart (Remains in place) -->
      <div class="col-12 col-md-6">
        <q-card class="bg-white content-card">
          <q-card-section class="full-height">
            <div class="text-h6">Rating Status Overview</div>
            <div class="chart-container">
              <canvas ref="statusChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  // Current date/time and user info
  const currentDateTime = ref('2025-07-08 08:00:48');
  const currentUser = ref('dsfsgs');

  const positionsToRate = ref(16);
  const ratedPositions = ref(3);
  const inProgressRatings = ref(2);
  const overdueRatings = ref(2);

  const upcomingDeadlines = ref([
    {
      position: 'City Government Department Head',
      department: 'DRRM Office',
      date: 'July 30, 2025',
      daysLeft: 22,
    },
    {
      position: 'Information Technology Officer',
      department: 'IT Department',
      date: 'July 15, 2025',
      daysLeft: 7,
    },
    {
      position: 'City Planner IV',
      department: 'Planning and Development',
      date: 'July 20, 2025',
      daysLeft: 12,
    },
    {
      position: 'City Health Officer',
      department: 'Health Department',
      date: 'July 25, 2025',
      daysLeft: 17,
    },
    {
      position: 'Budget Officer III',
      department: 'Finance Department',
      date: 'July 18, 2025',
      daysLeft: 10,
    },
    {
      position: 'Human Resource Manager',
      department: 'HR Department',
      date: 'August 5, 2025',
      daysLeft: 28,
    },
    {
      position: 'Civil Engineer II',
      department: 'Engineering Office',
      date: 'July 14, 2025',
      daysLeft: 6,
    },
    {
      position: 'Administrative Officer V',
      department: 'Administrative Services',
      date: 'July 22, 2025',
      daysLeft: 14,
    },
    {
      position: 'Legal Officer II',
      department: 'Legal Department',
      date: 'July 17, 2025',
      daysLeft: 9,
    },
    {
      position: 'City Treasurer',
      department: 'Treasury Office',
      date: 'July 28, 2025',
      daysLeft: 20,
    },
    {
      position: 'Environmental Specialist',
      department: 'Environmental Management',
      date: 'July 16, 2025',
      daysLeft: 8,
    },
    {
      position: 'Tourism Officer',
      department: 'Tourism Office',
      date: 'July 31, 2025',
      daysLeft: 23,
    },
    {
      position: 'Accountant III',
      department: 'Accounting Department',
      date: 'July 19, 2025',
      daysLeft: 11,
    },
    {
      position: 'Social Welfare Officer',
      department: 'Social Welfare Department',
      date: 'July 13, 2025',
      daysLeft: 5,
    },
    // Adding overdue items
    {
      position: 'Procurement Officer II',
      department: 'Procurement Department',
      date: 'July 6, 2025',
      daysLeft: -2,
    },
    {
      position: 'City Architect',
      department: 'City Engineering Office',
      date: 'July 7, 2025',
      daysLeft: -1,
    },
  ]);

  // Sort deadlines by urgency: overdue first, then by proximity to deadline
  const sortedDeadlines = computed(() => {
    return [...upcomingDeadlines.value].sort((a, b) => {
      // If both are overdue or both are not overdue, sort by days left
      if ((a.daysLeft < 0 && b.daysLeft < 0) || (a.daysLeft >= 0 && b.daysLeft >= 0)) {
        return a.daysLeft - b.daysLeft;
      }
      // Overdue items come first
      return a.daysLeft < 0 ? -1 : 1;
    });
  });

  // Get color for deadline badges
  const getDeadlineColor = (daysLeft) => {
    if (daysLeft < 0) return 'negative';
    if (daysLeft <= 3) return 'negative';
    if (daysLeft <= 7) return 'warning';
    return 'primary';
  };

  const startRating = (deadline) => {
    console.log('Starting rating for:', deadline.position);
  };

  const statusChart = ref(null);
  let chartInstance = null;

  onMounted(() => {
    if (statusChart.value) {
      // Create chart with better size settings
      chartInstance = new Chart(statusChart.value.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Not Started', 'Overdue'],
          datasets: [
            {
              label: 'Rating Status',
              data: [3, 2, 9, 2],
              backgroundColor: ['#4caf50', '#ff9800', '#9e9e9e', '#f44336'],
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
              },
            },
            tooltip: {
              bodyFont: {
                size: 14,
              },
              padding: 12,
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

      // Handle window resize to redraw chart
      window.addEventListener('resize', updateChartSize);
    }
  });

  // Clean up event listener on component unmount
  onUnmounted(() => {
    window.removeEventListener('resize', updateChartSize);
    if (chartInstance) {
      chartInstance.destroy();
    }
  });

  // Function to update chart size on window resize
  const updateChartSize = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };
</script>

<style scoped>
  .stat-card {
    height: 130px;
  }

  .content-card {
    height: 450px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .deadline-header {
    flex: 0 0 auto;
  }

  .deadline-content {
    flex: 1 1 auto;
    overflow: hidden;
  }

  .chart-container {
    position: relative;
    height: calc(100% - 40px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .full-height {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .q-card {
    transition: all 0.2s ease;
  }

  .q-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }

  /* Customize scrollbar for better appearance */
  :deep(.q-scrollarea__thumb) {
    width: 6px;
    opacity: 0.7;
    background: #ccc;
    border-radius: 3px;
  }

  :deep(.q-scrollarea__thumb:hover) {
    background: #aaa;
    opacity: 0.9;
  }
</style>
