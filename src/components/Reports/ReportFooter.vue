<template>
  <div class="footer-section">
    <div class="footer-item">
      <div class="footer-inner">
        <div class="footer-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            />
          </svg>
        </div>
        <div class="footer-text">
          2
          <sup>nd</sup>
          Floor, City Hall of Tagum,
          <br />
          JV Ayala Ave., Brgy. Apokon
        </div>
      </div>
    </div>
    <div class="footer-item">
      <div class="footer-inner">
        <div class="footer-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
            <path
              d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
            />
          </svg>
        </div>
        <div class="footer-text">{{ phone || '0987654321' }}</div>
      </div>
    </div>
    <div class="footer-item">
      <div class="footer-inner">
        <div class="footer-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
            <path
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
            />
          </svg>
        </div>
        <div class="footer-text">{{ email || 'mayoruy@gmail.com' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    phone: String,
    email: String,
  });
</script>

<style scoped>
  .footer-section {
    padding: 0 1in;
    padding-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: #00703c;
    font-size: 11px;
    background: white;
    box-sizing: border-box;
  }

  .footer-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33.33%;
    height: 40px;
    box-sizing: border-box;
  }

  .footer-inner {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .footer-icon {
    width: 16px;
    height: 16px;
    min-width: 16px;
    border-radius: 50%;
    background-color: #00703c;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .footer-icon svg {
    display: block;
  }

  .footer-text {
    color: #00703c;
    line-height: 1.3;
    text-align: left;
  }

  .footer-text sup {
    font-size: 0.7em;
    vertical-align: super;
  }
</style>
