<template>
  <div class="header-wrapper">
    <div class="logo-container">
      <img class="logo" alt="City of Tagum Logo" src="/logo.png" />
    </div>
    <div class="header-text-container">
      <div class="republic-text">REPUBLIC OF THE PHILIPPINES</div>
      <div class="province-text">PROVINCE OF DAVAO DEL NORTE</div>
      <div class="city-text">CITY OF TAGUM</div>
    </div>
  </div>
  <div class="green-banner">
    <div class="office-text"></div>
  </div>
</template>

<script setup></script>

<style scoped>
  .header-wrapper {
    display: flex;
    align-items: center;
  }

  .logo-container {
    position: absolute;
    width: 90px;
    height: 160px;
    margin-right: 10px;
    background-color: white;
  }

  .logo {
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 0.65in;
    width: 90px;
    height: auto;
  }

  .header-text-container {
    flex: 1;
    color: #00703c;
  }

  .republic-text,
  .province-text {
    font-size: 8pt;
    font-weight: 500;
    padding-left: 1in;
    line-height: 1;
  }

  .city-text {
    font-size: 13pt;
    font-weight: bold;
    line-height: 1;
    padding-top: 2px;
    padding-left: 1in;
    text-transform: uppercase;
  }

  .green-banner {
    background-color: #008000;
    color: white;
    height: 36px;
    display: flex;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 30px;
    width: calc(100% + 2in);
    margin-left: -1in;
  }

  .office-text {
    font-weight: bold;
    text-transform: uppercase;
    padding-left: 2in;
    font-size: 13pt;
  }
</style>
