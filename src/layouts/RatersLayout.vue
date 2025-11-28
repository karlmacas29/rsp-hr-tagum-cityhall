<template>
  <q-layout view="lHh Lpr lFf">
    <SideBar v-model="leftDrawerOpen" />

    <q-header class="text-black">
      <NavBarPage @toggle-menu="leftDrawerOpen = !leftDrawerOpen" />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import SideBar from '../components/Rater/SideBar.vue';
  import NavBarPage from 'components/Rater/Navbar.vue';
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const leftDrawerOpen = ref($q.screen.gt.sm);
</script>
