<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Sidebar -->
    <SidebarPage />
    <q-header class="text-black">
      <NavBarPage />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import SidebarPage from 'src/components/SidebarPage.vue'
import NavBarPage from 'src/components/NavBar.vue'

export default {
  components: {
    SidebarPage,
    NavBarPage,
  },
}
</script>
