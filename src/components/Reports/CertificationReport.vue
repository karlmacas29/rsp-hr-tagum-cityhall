<template>
  <div class="certification-container">
    <div class="header">
      <img src="/logo.png" alt="City of Tagum Logo" class="logo" />
      <div class="center-text">
        <div class="title">Republic of the Philippines</div>
        <div class="title">PROVINCE OF DAVAO DEL NORTE</div>
        <div class="title">CITY OF TAGUM</div>
      </div>
      <img src="/logo.png" alt="City of Tagum Logo" class="logo" />
    </div>

    <div class="certification-title">
      <h2>CERTIFICATION</h2>
    </div>

    <div class="certification-body">
      <p class="intro-text">
        This is to certify that
        <span class="bold">{{ data.employeeName }}</span>
        ,
        <span class="bold">{{ data.position }}</span>
        of the
        <span class="bold">{{ data.officeName }}</span>
        , City of Tagum, is a bonafide employee of the City Government of Tagum.
      </p>

      <p class="purpose-text">
        This certification is issued upon the request of the aforementioned employee for whatever
        legal purpose it may serve.
      </p>

      <p class="date-text">
        Issued this {{ formatDayWithSuffix(new Date()) }} day of {{ formatMonth(new Date()) }},
        {{ formatYear(new Date()) }} at Tagum City, Philippines.
      </p>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-name">{{ data.hrmoOfficer || 'HRMO OFFICER' }}</div>
          <div class="signature-title">Human Resource Management Officer</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    data: {
      type: Object,
      default: () => ({
        employeeName: 'EMPLOYEE NAME',
        position: 'POSITION TITLE',
        officeName: 'OFFICE NAME',
        hrmoOfficer: 'HRMO OFFICER',
      }),
    },
  });

  const formatDayWithSuffix = (date) => {
    const day = date.getDate();
    if (day > 3 && day < 21) return day + 'th';
    switch (day % 10) {
      case 1:
        return day + 'st';
      case 2:
        return day + 'nd';
      case 3:
        return day + 'rd';
      default:
        return day + 'th';
    }
  };

  const formatMonth = (date) => {
    return date.toLocaleString('en-US', { month: 'long' });
  };

  const formatYear = (date) => {
    return date.getFullYear();
  };
</script>

<style scoped>
  .certification-container {
    width: 8.5in;
    min-height: 11in;
    padding: 1in;
    margin: 0 auto;
    font-family: 'Times New Roman', Times, serif;
    line-height: 1.5;
    background-color: white;
    box-sizing: border-box;
    color: black;
  }

  .logo {
    width: 100px;
    height: auto;
    padding: 10px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5in;
  }

  .center-text {
    text-align: center;
    flex-grow: 1;
    font-weight: bold;
    line-height: 1.5;
  }

  .title {
    font-size: 14px;
  }

  .certification-title {
    text-align: center;
    margin-bottom: 0.5in;
  }

  .certification-title h2 {
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid black;
    display: inline-block;
    padding: 0 0.5in;
    margin: 0;
  }

  .certification-body {
    text-align: justify;
  }

  .intro-text,
  .purpose-text,
  .date-text {
    margin-bottom: 0.3in;
    line-height: 1.8;
  }

  .bold {
    font-weight: bold;
  }

  .signature-section {
    margin: 1in 0;
    display: flex;
    justify-content: flex-end;
  }

  .signature-box {
    text-align: center;
    width: 3in;
  }

  .signature-line {
    border-bottom: 1px solid black;
    margin-bottom: 0.1in;
    height: 1px;
  }

  .signature-name {
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 0.2in;
  }

  .signature-title {
    font-style: italic;
  }
</style>
