<template>
  <div class="certification-container">
    <!-- Header with Logo -->
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
      <div class="office-text">{{ userStore.officeName || 'OFFICE OF THE CITY MAYOR' }}</div>
    </div>

    <div class="certification-title">
      <h1>CERTIFICATION</h1>
    </div>

    <div class="certification-body">
      <p class="concern-text">TO WHOM IT MAY CONCERN:</p>

      <p class="main-text">
        In connection with the reappointment pursuant to ra6656 of
        <span class="bold">{{ data.employeeName || 'MR. JOGRAD M. MAHUSAY' }}</span>
        as
        <span class="bold">
          {{ data.position || 'INFORMATION SYSTEMS ANALYST III - PERMANENT' }}
        </span>
        , SG {{ data.salaryGrade || '19/1' }} of the
        <span class="bold">
          {{
            data.officeName ||
            'OFFICE OF THE CITY INFORMATION AND COMMUNICATIONS TECHNOLOGY MANAGEMENT OFFICER'
          }}
        </span>
        this City at the rate of
        <span class="bold">
          {{
            data.salary ||
            'SIX HUNDRED SIXTEEN THOUSAND TWO HUNDRED EIGHTY-FOUR (₱616,284.00/A) PESOS'
          }}
        </span>
        per annum, it is hereby certified:
      </p>

      <ol class="certification-list">
        <li>That the position herein is under LBC 61, s. 1996/BC 2004-3/LBC 137, s. 2021;</li>
        <li>That there is no pending administrative or criminal case against the appointee;</li>
        <li>
          That this appointment is issued in accordance with the personal services limitations
          provided for under Sec. 325(a) of R.A. 7160; and
        </li>
        <li>
          That the provisions of law, rules and regulations on appointment and nepotism have been
          observed.
        </li>
      </ol>

      <p class="issuance-text">
        Issued this {{ formatDayWithSuffix(new Date()) }} day of {{ formatMonth(new Date()) }},
        {{ formatYear(new Date()) }} at the City Government Center, JV Ayala Avenue, Apokon, Tagum
        City, Davao del Norte.
      </p>

      <div class="signature-container">
        <div class="signature-section">
          <div class="signature-name">{{ data.mayorName || 'REY T. UY' }}</div>
          <div class="signature-line"></div>
          <div class="signature-title">City Mayor</div>
        </div>
      </div>
    </div>

    <div class="spacer"></div>

    <!-- Fixed Footer Section with Centered Icons -->
    <div class="footer-section">
      <div class="footer-item footer-left">
        <div class="icon-container">
          <div class="footer-icon">
            <q-icon name="location_on" size="9px" />
          </div>
        </div>
        <div class="footer-text">
          2
          <sup>nd</sup>
          Floor, City Hall of Tagum,
          <br />
          JV Ayala Ave., Brgy. Apokon
        </div>
      </div>
      <div class="footer-item footer-center">
        <div class="icon-container">
          <div class="footer-icon">
            <q-icon name="call" size="9px" />
          </div>
        </div>
        <div class="footer-text">(084) 645 3300</div>
      </div>
      <div class="footer-item footer-right">
        <div class="icon-container">
          <div class="footer-icon">
            <q-icon name="email" size="9px" />
          </div>
        </div>
        <div class="footer-text">mayoruytagumcity@gmail.com</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject } from 'vue';

  const userStore = inject('userStore') || {
    officeName: 'OFFICE OF THE CITY MAYOR',
  };

  defineProps({
    data: {
      type: Object,
      default: () => ({
        employeeName: 'MR. JOGRAD M. MAHUSAY',
        position: 'INFORMATION SYSTEMS ANALYST III - PERMANENT',
        salaryGrade: '19/1',
        officeName:
          'OFFICE OF THE CITY INFORMATION AND COMMUNICATIONS TECHNOLOGY MANAGEMENT OFFICER',
        salary: 'SIX HUNDRED SIXTEEN THOUSAND TWO HUNDRED EIGHTY-FOUR (₱616,284.00/A) PESOS',
        mayorName: 'REY T. UY',
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
    padding: 0.75in 1in 0.5in;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    background-color: white;
    box-sizing: border-box;
    color: black;
    position: relative;
    line-height: 1.5;
    letter-spacing: 0.5px;
    display: flex;
    flex-direction: column;
  }

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
    width: calc(100% + 3in);
    margin-left: -1in;
  }

  .office-text {
    font-weight: bold;
    text-transform: uppercase;
    padding-left: 2in;
    font-size: 13pt;
  }

  /* Certification Title */
  .certification-title {
    text-align: center;
    margin-bottom: 30px;
  }

  .certification-title h1 {
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 4px;
  }

  .certification-body {
    text-align: justify;
  }

  .concern-text {
    margin-bottom: 20px;
  }

  .main-text {
    margin-bottom: 15px;
    text-align: justify;
  }

  .certification-list {
    padding-left: 40px;
    margin-bottom: 30px;
    line-height: 1.8;
  }

  .certification-list li {
    margin-bottom: 15px;
    text-align: justify;
    padding-left: 10px;
  }

  .main-text {
    margin-bottom: 25px;
    text-align: justify;
    line-height: 1.8;
  }

  .concern-text {
    margin-bottom: 30px;
  }

  .issuance-text {
    margin-top: 15px;
    margin-bottom: 60px;
    text-align: justify;
    line-height: 1.8;
  }

  .bold {
    font-weight: bold;
  }

  .signature-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 60px;
    margin-bottom: 60px;
  }

  .signature-section {
    width: 3in;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
  }

  .signature-line {
    width: 100%;
    border-bottom: 1px solid black;
    margin-bottom: 5px;
  }

  .signature-name {
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
  }

  .signature-title {
    text-align: center;
  }

  /* Added spacer to push footer down */
  .spacer {
    flex-grow: 1;
    min-height: 40px;
  }

  /* Fixed Footer Section */
  .footer-section {
    margin-top: 100px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #00703c;
    font-size: 11px;
  }

  .footer-item {
    display: flex;
    width: 33.33%;
    height: 40px;
    box-sizing: border-box;
  }

  /* New icon container to center icons vertically */
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-right: 8px;
  }

  /* Left footer item (location) - left aligned (default) */
  .footer-left {
    justify-content: flex-start;
    align-items: flex-start;
    padding-right: 10px;
  }

  /* Center footer item (phone) - center aligned */
  .footer-center {
    justify-content: center;
    align-items: center;
  }

  .footer-center .footer-text {
    text-align: center;
  }

  /* Right footer item (email) - right aligned */
  .footer-right {
    justify-content: flex-end;
    align-items: center;
    padding-left: 10px;
  }

  .footer-right .footer-text {
    text-align: right;
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
  }

  /* Print Styles */
  @media print {
    @page {
      size: portrait;
      margin: 0;
    }

    .certification-container {
      margin: 0;
      padding: 0.75in 1in 0.5in;
      width: 100%;
      height: 100%;
    }

    .green-banner {
      background-color: #008000 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color: white !important;
    }

    .header-text-container {
      color: #00703c !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .footer-section {
      color: #00703c !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .footer-icon {
      background-color: #00703c !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color: white !important;
    }
  }
</style>
