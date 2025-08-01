<template>
  <div>
    <!-- Applicant Stats Cards -->
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-3">
        <q-card class="bg-white stat-card">
          <q-card-section class="card-content">
            <div class="row items-center no-wrap full-width">
              <div class="col stats-text">
                <div class="label-text">Total Applicants</div>
                <div class="value-text text-primary">{{ dashboardStore.total}}</div>
              </div>
              <div class="col-auto icon-container">
                <q-icon name="groups" size="40px" color="primary" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="bg-white stat-card">
          <q-card-section class="card-content">
            <div class="row items-center no-wrap full-width">
              <div class="col stats-text">
                <div class="label-text">Pendings</div>
                <div class="value-text text-orange">{{dashboardStore.pending }}</div>
              </div>
              <div class="col-auto icon-container">
                <q-icon name="pending_actions" size="40px" color="orange" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="bg-white stat-card">
          <q-card-section class="card-content">
            <div class="row items-center no-wrap full-width">
              <div class="col stats-text">
                <div class="label-text">Qualified</div>
                <div class="value-text text-positive">{{ dashboardStore.qualified }}</div>
              </div>
              <div class="col-auto icon-container">
                <q-icon name="verified_user" size="40px" color="positive" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="bg-white stat-card">
          <q-card-section class="card-content">
            <div class="row items-center no-wrap full-width">
              <div class="col stats-text">
                <div class="label-text">Unqualified</div>
                <div class="value-text text-negative">{{ dashboardStore.unqualified }}</div>
              </div>
              <div class="col-auto icon-container">
                <q-icon name="cancel" size="40px" color="negative" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {onMounted } from 'vue';


  import { DashboardStore } from 'src/stores/dashboardStore';

  const dashboardStore = DashboardStore();

  // Variable names updated to match labels


  onMounted(async () => {
    try {
      await dashboardStore.status();

    } catch (error) {
      console.error('Failed to fetch job data:', error);
    }
  });
</script>

<style scoped>
  .stat-card {
    border-top: 4px solid #00b034;
    border-radius: 8px;
    height: 100px;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .card-content {
    height: 100%;
    padding: 12px;
    display: flex;
    align-items: center;
  }

  .stats-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .label-text {
    font-size: 14px;
    font-weight: 500;
    color: #616161;
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .value-text {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    flex-shrink: 0;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    border-top: 4px solid #1088d8;
  }

  /* Improve readability on smaller screens */
  @media (max-width: 1200px) {
    .label-text {
      font-size: 13px;
    }

    .value-text {
      font-size: 18px;
    }
  }
</style>
