<template>
  <q-header reveal elevated>
    <q-toolbar class="header row items-center justify-between text-black" elevated>
      <div class="row items-center justify-between q-gutter-x-sm">
        <div>
          <q-img src="logo.png" alt="City Hall Logo" style="width: 50px; height: 50px" />
        </div>
        <div>
          <h4 class="text-bold">City Hall of Tagum</h4>
        </div>
      </div>
      <div class="row items-center justify-between q-gutter-x-xl">
        <div>
          <q-tabs
            active-color="primary"
            v-model="routeTab"
            class="bg-white"
            align="justify"
            narrow-indicator
          >
            <q-tab name="Homepage" label="Home" @click="navigateTo('Homepage')" />
            <q-tab name="Joblist" label="Job Lists" @click="navigateTo('Joblist')" />
            <q-tab name="Admin" label="Admin" @click="navigateTo('Admin Login')" />
            <q-tab name="Rater" label="Rater" @click="navigateTo('Rater Login')" />
          </q-tabs>
        </div>
        <div></div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, watch, onMounted } from 'vue';

  const route = useRoute();
  const router = useRouter();
  const routeTab = ref(route.name);

  // Update tab when route changes
  watch(
    () => route.name,
    (newRouteName) => {
      routeTab.value = newRouteName;
    },
  );

  // Initialize the tab on component mount
  onMounted(() => {
    routeTab.value = route.name;
  });

  // Navigation function
  const navigateTo = (routeName) => {
    router.push({ name: routeName });
  };
</script>

<style scoped>
  .header {
    background: white;
    border-bottom: 1px solid #eee;
    height: 70px;
  }
</style>
