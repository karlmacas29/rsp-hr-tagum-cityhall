<template>
  <q-toolbar class="q-mb-none header">
    <div class="row items-center justify-between full-width">
      <div class="grid justify-start items-start q-pa-sm">
        <h5 class="text-h5 q-ma-none"><b>Recruitment, Selection and Placement</b></h5>
        <p class="q-ma-none">City of Human Resources</p>
      </div>

      <div class="row items-center">
        <q-btn round flat dense icon="notifications" class="q-mr-md" />
        <q-avatar size="36px">
          <img src="https://placehold.co/45x45" alt="User Avatar" />
        </q-avatar>
        <div class="q-ml-sm">
          <div class="text-bold text-body1">Gavano</div>
          <div class="text-caption">HR Manager</div>
        </div>
      </div>
    </div>
  </q-toolbar>
</template>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #eee;
  height: 90px; /* Reduced height */
}

.q-mb-none {
  margin-bottom: 0 !important;
}

.text-h5 {
  font-size: 20px;
}

.q-ml-sm {
  margin-left: 8px !important;
}

.q-mr-md {
  margin-right: 8px !important;
}
</style>
