<template>
  <div class="fullscreen bg-white text-primary text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2">
        Oops. Nothing here...
      </div>

      <q-btn class="q-mt-xl" color="white" text-color="black" unelevated @click="goHome" label="Go Home" no-caps />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  methods: {
    goHome() {
      this.$router.push('/dashboard')
    },
  },
}
</script>

<style scoped></style>
