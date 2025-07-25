<template>
  <div class="footer-section">
    <div class="footer-item">
      <div class="footer-inner">
        <div class="footer-icon">
          <q-icon name="location_on" size="9px" />
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
          <q-icon name="call" size="9px" />
        </div>
        <div class="footer-text">{{ email || 'mayoruy@gmail.com' }}</div>
      </div>
    </div>
    <div class="footer-item">
      <div class="footer-inner">
        <div class="footer-icon">
          <q-icon name="email" size="9px" />
        </div>
        <div class="footer-text">{{ phone || '0987654321' }}</div>
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
    position: absolute;
    left: 1in;
    right: 1in;
    bottom: 30px;
    width: calc(100% - 2in);
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

  .footer-text {
    color: #00703c;
    line-height: 1.3;
    text-align: left;
  }
</style>
