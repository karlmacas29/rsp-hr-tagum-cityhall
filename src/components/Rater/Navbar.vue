<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-toolbar class="header">
    <div class="row items-center justify-between full-width">
      <!-- Mobile Menu Toggle -->
      <q-btn
        v-if="$q.screen.lt.lg"
        flat
        dense
        round
        icon="menu"
        class="q-mr-sm"
        @click="emit('toggleMenu')"
      />

      <!-- Title Section -->
      <div class="title-section q-pa-sm">
        <h5 class="text-h6 q-ma-none title-text">
          <b>Recruitment, Selection and Placement</b>
        </h5>
        <p class="q-ma-none subtitle-text">City of Tagum Human Resource Management Office</p>
      </div>

      <!-- User Profile Dropdown -->
      <div class="row items-center profile-section">
        <q-btn-dropdown flat :ripple="false" class="user-dropdown">
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <!-- Avatar -->
              <div>
                <div v-if="useRaterStore.user">
                  <q-avatar size="40px" color="primary" text-color="white">
                    {{ useRaterStore.user?.name?.charAt(0).toUpperCase() }}
                  </q-avatar>
                </div>
                <div v-else>
                  <q-skeleton type="circle" size="40px" />
                </div>
              </div>

              <!-- User Info (Hidden on mobile) -->
              <div v-if="$q.screen.gt.xs" class="q-ml-sm column justify-start items-start">
                <!-- Username -->
                <div>
                  <div v-if="useRaterStore.user" class="text-bold user-name">
                    {{ useRaterStore.user?.name || 'Guest' }}
                  </div>
                  <div v-else style="width: 100px">
                    <q-skeleton type="text" />
                  </div>
                </div>
                <!-- Position -->
                <div>
                  <div v-if="useRaterStore.user" class="text-caption user-position">
                    {{ truncatePosition(useRaterStore.user?.position) || 'Guest' }}
                  </div>
                  <div v-else style="width: 100px">
                    <q-skeleton type="text" />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <q-list class="dropdown-list">
            <!-- Settings -->
            <q-item clickable @click="onSetting" v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="settings" color="primary" text-color="white" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Settings</q-item-label>
                <q-item-label caption>Manage your account</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <!-- Logout -->
            <q-item clickable @click.prevent="onLogout" :disable="useRaterStore.loading">
              <q-item-section v-if="useRaterStore.loading" avatar>
                <q-avatar color="negative" size="36px">
                  <q-spinner color="white" size="20px" />
                </q-avatar>
              </q-item-section>
              <q-item-section v-else avatar>
                <q-avatar icon="logout" color="negative" text-color="white" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Logout</q-item-label>
                <q-item-label caption>Sign out of your account</q-item-label>
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
  import { useRaterAuthStore } from 'stores/authStore_raters';
  import { useLogsStore } from 'stores/logsStore';
  import { useQuasar } from 'quasar';

  const emit = defineEmits(['toggleMenu']);

  const useRaterStore = useRaterAuthStore();
  const logStore = useLogsStore();
  const router = useRouter();
  const $q = useQuasar();

  const truncatePosition = (position) => {
    if (!position) return '';
    if ($q.screen.lt.md && position.length > 30) {
      return position.substring(0, 30) + '...';
    }
    return position;
  };

  const onLogout = async () => {
    await logStore.logAction('Logged Out');
    await useRaterStore.logout();
  };

  const onSetting = () => {
    router.push('/rater/settings');
  };
</script>

<style scoped>
  .header {
    background: white;
    border-bottom: 1px solid #eee;
    min-height: 70px;
    padding: 8px 16px;
  }

  .title-section {
    flex: 1;
    min-width: 0; /* Allow text truncation */
  }

  .title-text {
    font-size: 20px;
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .subtitle-text {
    font-size: 12px;
    color: #666;
  }

  .profile-section {
    flex-shrink: 0;
  }

  .user-dropdown {
    padding: 4px 8px;
  }

  .user-name {
    font-size: 13px;
    line-height: 1.2;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-position {
    font-size: 11px;
    line-height: 1.2;
    color: #666;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-list {
    min-width: 250px;
  }

  /* Tablet responsiveness */
  @media (max-width: 1023px) {
    .title-text {
      font-size: 18px;
    }

    .subtitle-text {
      font-size: 11px;
    }

    .user-name {
      font-size: 12px;
      max-width: 120px;
    }

    .user-position {
      font-size: 10px;
      max-width: 120px;
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 599px) {
    .header {
      min-height: 60px;
      padding: 8px 12px;
    }

    .title-text {
      font-size: 14px;
    }

    .subtitle-text {
      font-size: 10px;
    }

    .user-dropdown {
      padding: 4px;
    }
  }

  /* Extra small screens */
  @media (max-width: 400px) {
    .title-text {
      font-size: 12px;
    }

    .subtitle-text {
      display: none; /* Hide subtitle on very small screens */
    }
  }
</style>
