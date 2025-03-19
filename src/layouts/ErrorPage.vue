<template>
  <div class="q-pa-md flex flex-center full-height">
    <q-card class="text-center">
      <q-card-section>
        <h1 class="text-h4 text-negative">404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="Go Home" color="primary" @click="goHome" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  methods: {
    goHome() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.full-height {
  height: 100vh;
}
</style>
