<template>
  <q-layout view="hHh LpR fFf">
    <SideBar />
         <NavBarPage />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import SideBar from '../components/Rater/SideBar.vue';
  import NavBarPage from 'components/Rater/Navbar.vue';
</script>
