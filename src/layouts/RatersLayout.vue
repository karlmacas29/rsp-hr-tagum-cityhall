<template>
  <q-layout view="hHh LpR fFf">
    <SideBar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import SideBar from '../components/Rater/SideBar.vue';
</script>
