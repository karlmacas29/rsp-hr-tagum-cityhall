<template>
  <q-layout view="hHh LpR fFf">
    <!-- Sidebar -->
    <SidebarPage />
    <q-page-container>
      <NavBarPage />
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
