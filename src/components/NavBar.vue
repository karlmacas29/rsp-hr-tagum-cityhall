<template>
  <q-toolbar class="q-mb-none header">
    <div class="row items-center justify-between full-width">
      <div class="grid justify-start items-start q-pa-sm">
        <h5 class="text-h5 q-ma-none"><b>Recruitment, Selection and Placement</b></h5>
        <p class="q-ma-none">City of Human Resources</p>
      </div>

      <div class="row items-center">
        <q-btn round flat dense icon="notifications" class="q-mr-md" />
        <q-btn-dropdown flat :ripple="false">
          <template v-slot:label>
            <q-avatar size="45px">
              <img src="https://placehold.co/45x45" alt="User Avatar" />
            </q-avatar>
            <div class="q-ml-sm column justify-start items-start">
              <div class="text-bold text-body1" style="font-size:13px;">Gavano E. Gavano</div>
              <div class="text-caption">HR Manager</div>
            </div>
          </template>

          <q-list>
            <q-item clickable @click="onSetting" v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="settings" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Settings</q-item-label>
              </q-item-section>

            </q-item>

            <q-item clickable @click="onLogout" v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="logout" color="negative" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>

            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </q-toolbar>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const onLogout = () => {
  router.push('/login')
}

const onSetting = () => {
  router.push('/settings')
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #eee;
  height: 90px;
  /* Reduced height */
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
