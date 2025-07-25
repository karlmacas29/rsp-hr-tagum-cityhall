<template>
  <div class="certification-report-container">
    <div class="report-content">
      <ReportHeader :officeName="officeName" />

      <div class="certification-title">
        <h1>CERTIFICATION</h1>
      </div>
      <div class="certification-body">
        <p class="concern-text">TO WHOM IT MAY CONCERN:</p>
        <p class="main-text" :style="mainTextStyle">
          <slot name="main-text">
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
          </slot>
        </p>
        <slot name="list">
          <ol class="certification-list">
            <li>That the position herein is under LBC 61, s. 1996/BC 2004-3/LBC 137, s. 2021;</li>
            <li>That there is no pending administrative or criminal case against the appointee;</li>
            <li>
              That this appointment is issued in accordance with the personal services limitations
              provided for under Sec. 325(a) of R.A. 7160; and
            </li>
            <li>
              That the provisions of law, rules and regulations on appointment and nepotism have
              been observed.
            </li>
          </ol>
        </slot>
        <p class="issuance-text" :style="issuanceTextStyle">
          <slot name="issuance-text">
            Issued this {{ formatDayWithSuffix(issueDate) }} day of {{ formatMonth(issueDate) }},
            {{ formatYear(issueDate) }} at the City Government Center, JV Ayala Avenue, Apokon,
            Tagum City, Davao del Norte.
          </slot>
        </p>
        <div class="signature-container">
          <div class="signature-section">
            <div class="signature-name">{{ signatoryName || 'REY T. UY' }}</div>
            <div class="signature-line"></div>
            <div class="signature-title">{{ signatoryTitle || 'CITY MAYOR' }}</div>
          </div>
        </div>
      </div>
    </div>
    <ReportFooter :phone="footerPhone" :email="footerEmail" />
  </div>
</template>

<script setup>
  import ReportHeader from './ReportHeader.vue';
  import ReportFooter from './ReportFooter.vue';

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
    officeName: String,
    signatoryName: String,
    signatoryTitle: String,
    footerPhone: String,
    footerEmail: String,
    issueDate: {
      type: Date,
      default: () => new Date(),
    },
    mainTextStyle: {
      type: [String, Object],
      default: '',
    },
    issuanceTextStyle: {
      type: [String, Object],
      default: '',
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
  .certification-report-container {
    width: 8.5in;
    min-height: 11in;
    height: 11in;
    position: relative;
    font-family: Arial, sans-serif;
    background-color: white;
    box-sizing: border-box;
    color: black;
    line-height: 1.5;
    letter-spacing: 0.5px;
    display: block;
  }

  .report-content {
    padding: 0.75in 1in 0 1in;
  }

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
    line-height: 1.8;
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
    padding-top: 50px;
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

  @media print {
    @page {
      size: letter;
      margin: 0;
    }
  }
</style>
