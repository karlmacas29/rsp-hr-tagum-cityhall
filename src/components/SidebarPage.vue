<template>
  <q-drawer show-if-above v-model="drawer" side="left" :width="230" bordered>
    <!-- Logo Section -->
    <div class="logo-container">
      <q-img src="/logo.png" width="130px" />
    </div>

    <!-- Header Section -->
    <div class="header-container"></div>

    <q-list dense>
      <q-item
        dense
        class="q-mx-xs q-my-xs"
        style="border-radius: 17px; padding: 8px 11px"
        v-for="(item, index) in filteredMenuItems"
        :key="index"
        clickable
        v-ripple
        :to="item.route"
        :active-class="'active-menu'"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" size="sm" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>

      <!-- Rater Management Expansion Item -->
      <q-expansion-item
        v-if="hasRaterManagementAccess"
        v-model="expanded"
        dense
        style="border-radius: 20px; padding: 0; margin: 0"
        class="q-mx-xs q-my-xs"
        icon="assignment_ind"
        label="Rater Management"
      >
        <q-card class="q-py-none content-container">
          <q-item
            dense
            class="q-mx-xs q-my-xs"
            style="border-radius: 17px; padding: 8px 10px"
            v-for="(item, index) in filteredRatersManage"
            :key="index"
            clickable
            v-ripple
            :to="item.route"
            :active-class="'active-menu'"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="sm" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-list>
    <!-- footer -->
  </q-drawer>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from 'stores/authStore';

  const authStore = useAuthStore();
  const route = useRoute();
  const drawer = ref(true);
  const expanded = ref(false);

  // Check if user has any plantilla access (view or modify)
  const hasPlantillaAccess = computed(() => {
    return (
      authStore.user?.permissions?.viewPlantillaAccess == '1' ||
      authStore.user?.permissions?.modifyPlantillaAccess == '1'
    );
  });

  // Check if user has any job post access (view or modify)
  const hasJobPostAccess = computed(() => {
    return (
      authStore.user?.permissions?.viewJobpostAccess == '1' ||
      authStore.user?.permissions?.modifyJobpostAccess == '1'
    );
  });

  // ============================================================================
  // RATER MANAGEMENT MODULE PERMISSIONS
  // ============================================================================

  /**
   * Check if user has access to Raters module (view or modify)
   */
  const hasRatersAccess = computed(() => {
    return (
      authStore.user?.permissions?.viewRater === '1' ||
      authStore.user?.permissions?.modifyRater === '1'
    );
  });

  /**
   * Check if user has access to Criteria module (view or modify)
   */
  const hasCriteriaAccess = computed(() => {
    return (
      authStore.user?.permissions?.viewCriteria === '1' ||
      authStore.user?.permissions?.modifyCriteria === '1'
    );
  });

  /**
   * Check if user has access to Reports module (view only)
   */
  const hasReportsAccess = computed(() => {
    return authStore.user?.permissions?.viewReport === '1';
  });

  const hasActivityLogsAccess = computed(() => {
    return authStore.user?.permissions?.viewActivityLogs === '1';
  });

  /**
   * Check if user has ANY rater management access
   * Shows the Rater Management expansion menu if user has access to at least one module
   */
  const hasRaterManagementAccess = computed(() => {
    return hasRatersAccess.value || hasCriteriaAccess.value || hasReportsAccess.value;
  });

  // ============================================================================
  // END RATER MANAGEMENT MODULE PERMISSIONS
  // ============================================================================

  const hasUserManagementAccess = computed(() => {
    return authStore.user?.permissions?.userManagement == '1';
  });

  const filteredMenuItems = computed(() => {
    return [
      { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
      ...(hasPlantillaAccess.value
        ? [{ label: 'Plantilla', route: '/plantilla', icon: 'domain' }]
        : []),
      ...(hasJobPostAccess.value
        ? [{ label: 'Job Posts', route: '/job-post', icon: 'post_add' }]
        : []),
      ...(hasUserManagementAccess.value
        ? [{ label: 'User Management', route: '/user-access', icon: 'manage_accounts' }]
        : []),
      ...(hasActivityLogsAccess.value
        ? [{ label: 'Activity Log', route: '/activity-log', icon: 'history' }]
        : []),
    ];
  });

  /**
   * Filtered rater management menu items based on user permissions
   * Only shows modules the user has access to
   */
  const filteredRatersManage = computed(() => {
    const allItems = [
      { label: 'Raters', route: '/raters', icon: 'groups', permission: hasRatersAccess },
      { label: 'Criteria', route: '/criteria', icon: 'rule', permission: hasCriteriaAccess },
      { label: 'Reports', route: '/reports', icon: 'assessment', permission: hasReportsAccess },
    ];

    // Filter items based on their individual permissions
    return allItems.filter((item) => item.permission.value);
  });

  onMounted(() => {
    // Set the active menu item based on the current route
    const currentRoute = route.path;
    // Check if the current route matches any of the rater management routes
    filteredRatersManage.value.forEach((item) => {
      if (currentRoute === item.route) {
        expanded.value = true;
      }
    });
  });
</script>

<style scoped>
  .content-container {
    border-left: 2px solid rgb(133, 133, 133);
    /* Change color as needed */
    padding-left: 5px;
    margin-left: 25px;
  }

  /* Logo Section */
  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
    /* Reduce padding */
    margin-bottom: 2px;
    /* Reduce space below logo */
    margin-top: 40px;
  }

  .logo {
    width: 140px;
    /* Slightly smaller logo */
    height: auto;
  }

  /* Header Section */
  .header-container {
    text-align: center;
    margin-bottom: 2px !important;
    /* Further reduce space */
    padding-bottom: 0 !important;
  }

  .company-title {
    font-size: 16px;
    /* Reduce font size slightly */
    font-weight: bold;
    margin-bottom: 0 !important;
    /* Remove extra space below title */
  }

  /* Active menu styling */
  .active-menu {
    background-color: #00b034 !important;
    color: white !important;
    font-weight: bold;
  }
</style>
