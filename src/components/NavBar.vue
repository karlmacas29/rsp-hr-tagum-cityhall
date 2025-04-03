<template>
  <q-toolbar class="q-mb-none header">
    <div class="row items-center justify-between full-width">
      <div class="grid justify-start items-start q-pa-sm">
        <h5 class="text-h6 q-ma-none"><b>Recruitment, Selection and Placement</b></h5>
        <p class="q-ma-none" style="font-size:12px;">City of Human Resources</p>
      </div>

      <div class="row items-center">
        <q-btn round flat dense icon="notifications" class="q-mr-md" />
        <q-btn-dropdown flat :ripple="false">
          <template v-slot:label>
            <div>
              <div v-if="authStore.user" class="text-bold text-body1" style="font-size:13px;">
                <q-avatar size="45px" color="black" text-color="white">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </q-avatar>
              </div>
              <div v-else class="text-bold text-body1" style="width: 45px">
                <q-skeleton type="circle" />
              </div>
            </div>

            <div class="q-ml-sm column justify-start items-start">
              <!-- username -->
              <div>
                <div v-if="authStore.user" class="text-bold text-body1" style="font-size:13px;">
                  {{ authStore.user?.name || 'Guest' }}
                </div>
                <div v-else class="text-bold text-body1" style="width: 100px">
                  <q-skeleton type="text" />
                </div>
              </div>
              <!-- roles -->
              <div>
                <div v-if="authStore.user" class="text-caption" style="font-size:11px;">
                  {{ authStore.user?.position || 'Guest' }}
                </div>
                <div v-else class="text-caption " style="width: 100px">
                  <q-skeleton type="text" />
                </div>
              </div>
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
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const onLogout = async () => {
  try {
    await authStore.logout(); // Call the logout action from authStore

  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const onSetting = () => {
  router.push('/settings');
};
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #eee;
  height: 70px;
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
