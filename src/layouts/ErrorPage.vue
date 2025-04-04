<template>
  <div class="fullscreen bg-green text-white flex flex-center column">
    <!-- Animated SVG Logo -->
    <div class="logo-container q-mb-lg">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        class="brand-logo"
      >
        <circle cx="60" cy="60" r="50" fill="white" />
        <circle cx="60" cy="60" r="42" fill="#1976D2" class="inner-circle" />
        <path
          d="M40 60 L55 45 L85 75 L70 90 Z"
          fill="white"
          class="logo-path"
        />
        <circle cx="72" cy="48" r="8" fill="#26A69A" class="logo-accent" />
      </svg>
    </div>

    <!-- Error Message with Animation -->
    <div class="text-center">
      <h1 class="text-h1 error-text q-mb-xl">404</h1>
      <h2 class="text-h4 q-mt-sm q-mb-md">Page Not Found</h2>
      
      <p class="text-body1 q-mb-xl error-description">
        The page you're looking for has wandered off into the digital void.
      </p>
      
      <!-- Interactive Elements -->
      <div class="action-buttons">
        <q-btn
          @click="goHome"
          color="white"
          text-color="primary"
          label="Go Home"
          class="q-px-md q-py-sm"
          unelevated
          rounded
        />
        <!-- <q-btn
          @click="reportError"
          color="accent"
          text-color="white"
          label="Report Issue"
          class="q-px-md q-py-sm q-ml-md"
          unelevated
          rounded
        /> -->
      </div>
    </div>

    <!-- Interactive Background Elements -->
    <div class="floating-elements">
      <div v-for="n in 12" :key="n" :class="`floating-element element-${n}`"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound',
  methods: {
    reportError() {
      this.$q.notify({
        message: 'Error reported to our team',
        color: 'positive',
        icon: 'check_circle',
        position: 'top'
      })
    },
    goHome() {
      this.$router.push('/')
    }
  }
})
</script>

<style scoped>
.fullscreen {
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #1976D2, #512DA8);
  min-height: 100vh;
}

.error-text {
  font-size: 12rem;
  font-weight: 700;
  text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.05em;
  animation: pulse 3s infinite;
}

.error-description {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.brand-logo {
  animation: spin 40s linear infinite;
}

.inner-circle {
  animation: pulse 3s infinite alternate;
}

.logo-path {
  animation: blink 6s ease-in-out infinite;
}

.logo-accent {
  animation: orbit 8s linear infinite;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite linear;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes orbit {
  from { transform: rotate(0deg) translate(18px) rotate(0deg); }
  to { transform: rotate(360deg) translate(18px) rotate(-360deg); }
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -50px);
  }
  66% {
    transform: translate(-20px, 40px);
  }
  100% {
    transform: translate(0, 0);
  }
}

/* Generate various sized and positioned floating elements */
.element-1 { width: 20px; height: 20px; top: 10%; left: 10%; animation-duration: 15s; }
.element-2 { width: 30px; height: 30px; top: 20%; left: 80%; animation-duration: 25s; }
.element-3 { width: 15px; height: 15px; top: 50%; left: 15%; animation-duration: 18s; }
.element-4 { width: 25px; height: 25px; top: 70%; left: 70%; animation-duration: 22s; }
.element-5 { width: 18px; height: 18px; top: 85%; left: 30%; animation-duration: 21s; }
.element-6 { width: 22px; height: 22px; top: 30%; left: 85%; animation-duration: 19s; }
.element-7 { width: 28px; height: 28px; top: 60%; left: 40%; animation-duration: 16s; }
.element-8 { width: 12px; height: 12px; top: 15%; left: 60%; animation-duration: 23s; }
.element-9 { width: 35px; height: 35px; top: 75%; left: 20%; animation-duration: 17s; }
.element-10 { width: 16px; height: 16px; top: 40%; left: 75%; animation-duration: 20s; }
.element-11 { width: 24px; height: 24px; top: 90%; left: 90%; animation-duration: 24s; }
.element-12 { width: 14px; height: 14px; top: 25%; left: 35%; animation-duration: 26s; }

.action-buttons {
  position: relative;
  z-index: 5;
}
</style>