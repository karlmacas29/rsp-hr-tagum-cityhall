<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = "RSP-Tagum";
})
</script>
