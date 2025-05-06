<template>
  <q-drawer show-if-above v-model="drawer" side="left" :width="230" bordered>
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/logo.png" alt="Tagum City Logo" class="logo" style="width: 130px" />
    </div>

    <!-- Header Section -->
    <div class="header-container"></div>

    <q-list dense>
      <q-item
        dense
        class="q-mx-xs q-my-xs"
        style="border-radius: 17px; padding: 8px 11px"
        v-for="(item, index) in menuItems"
        :key="index"
        clickable
        v-ripple
        :to="item.route"
        :active-class="route.path === item.route ? 'active-menu' : ''"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" size="sm" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
      <!-- rater -->
    </q-list>

    <!-- footer -->

    <div class="absolute-bottom q-pb-md row justify-center items-center">
      <q-btn color="negative q-px-xl" rounded @click="router.push('/rater-acc')">Logout</q-btn>
    </div>
  </q-drawer>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
  const drawer = ref(true);
  const expanded = ref(false);

  const menuItems = ref([
    { label: 'Dashboard', route: '/uRater', icon: 'dashboard' },
    { label: 'Criteria', route: '/uCriteria', icon: 'list' },
  ]);

  const ratersManage = ref([]);

  onMounted(() => {
    // Set the active menu item based on the current route
    const currentRoute = route.path;
    // Check if the current route matches any of the main menu items
    ratersManage.value.forEach((item) => {
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
