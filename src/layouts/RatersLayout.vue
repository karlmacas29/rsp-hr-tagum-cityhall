<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Sidebar -->
    <SideBar />
    <q-header class="text-black">
      <NavBarPage />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import SideBar from '../components/Rater/SideBar.vue';
  import NavBarPage from 'components/Rater/Navbar.vue';
  import { onMounted } from 'vue';

  onMounted(async () => {});
</script>
