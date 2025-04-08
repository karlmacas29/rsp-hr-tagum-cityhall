<template>
    <q-layout view="hHh LpR fFf">
      <q-page-container>
          <HeaderUser />
        <router-view />
      </q-page-container>
    </q-layout>
</template>

<script setup>
import HeaderUser from '../components/User/HeaderUser.vue';
</script>