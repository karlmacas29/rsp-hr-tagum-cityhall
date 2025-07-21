<template>
  <div class="position-description-container">
    <div class="header">
      <img src="/logo.png" alt="City of Tagum Logo" class="logo" />
      <div class="center-text">
        <div class="title">Republic of the Philippines</div>
        <div class="title">PROVINCE OF DAVAO DEL NORTE</div>
        <div class="title">CITY OF TAGUM</div>
      </div>
      <img src="/logo.png" alt="City of Tagum Logo" class="logo" />
    </div>

    <div class="position-description-title">
      <h2>POSITION DESCRIPTION FORM</h2>
    </div>

    <div class="position-description-body">
      <div class="section">
        <h3>I. POSITION INFORMATION</h3>
        <table class="info-table">
          <tr>
            <td width="30%">Position Title:</td>
            <td width="70%" class="data-cell">{{ data.position }}</td>
          </tr>
          <tr>
            <td>Office/Department:</td>
            <td class="data-cell">{{ data.officeName }}</td>
          </tr>
          <tr>
            <td>Salary Grade:</td>
            <td class="data-cell">{{ data.salaryGrade }}</td>
          </tr>
          <tr>
            <td>Reports to:</td>
            <td class="data-cell">{{ data.reportsTo }}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h3>II. JOB SUMMARY</h3>
        <div class="text-box">
          {{
            data.jobSummary ||
            'Responsible for performing various administrative and technical tasks related to the position.'
          }}
        </div>
      </div>

      <div class="section">
        <h3>III. DUTIES AND RESPONSIBILITIES</h3>
        <ol class="duties-list">
          <li v-for="(duty, index) in data.duties || defaultDuties" :key="index">
            {{ duty }}
          </li>
        </ol>
      </div>

      <div class="signature-section">
        <div class="signature-row">
          <div class="signature-column">
            <p>Prepared by:</p>
            <div class="signature-line"></div>
            <div class="signature-name">{{ data.preparedBy || 'HRMO OFFICER' }}</div>
            <div class="signature-title">Human Resource Management Officer</div>
          </div>
          <div class="signature-column">
            <p>Approved by:</p>
            <div class="signature-line"></div>
            <div class="signature-name">{{ data.approvedBy || 'DEPARTMENT HEAD' }}</div>
            <div class="signature-title">Department Head</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, ref } from 'vue';

  const defaultDuties = ref([
    'Performs administrative and technical tasks as assigned',
    'Prepares reports and correspondences',
    'Maintains records and files',
    'Coordinates with other offices and departments',
    'Attends meetings and trainings as required',
    'Performs other related duties as may be assigned',
  ]);

  defineProps({
    data: {
      type: Object,
      default: () => ({
        employeeName: 'EMPLOYEE NAME',
        position: 'POSITION TITLE',
        officeName: 'OFFICE NAME',
        salaryGrade: 'XX',
        reportsTo: 'SUPERVISOR POSITION',
        jobSummary: '',
        duties: null,
        preparedBy: '',
        approvedBy: '',
      }),
    },
  });
</script>

<style scoped>
  .position-description-container {
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

  .position-description-title {
    text-align: center;
    margin-bottom: 0.5in;
  }

  .position-description-title h2 {
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid black;
    display: inline-block;
    padding: 0 0.5in;
    margin: 0;
  }

  .position-description-body {
    text-align: justify;
  }

  .section {
    margin-bottom: 0.4in;
  }

  .section h3 {
    margin-bottom: 0.1in;
    text-decoration: underline;
  }

  .info-table {
    width: 100%;
    border-collapse: collapse;
  }

  .info-table td {
    padding: 0.1in;
    border: 1px solid #ccc;
  }

  .data-cell {
    font-weight: bold;
  }

  .text-box {
    padding: 0.2in;
    border: 1px solid #ccc;
    min-height: 1in;
  }

  .duties-list li {
    margin-bottom: 0.1in;
  }

  .signature-section {
    margin-top: 1in;
  }

  .signature-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .signature-column {
    width: 45%;
    text-align: center;
  }

  .signature-line {
    border-bottom: 1px solid black;
    margin: 0.5in auto 0.1in;
    width: 80%;
    height: 1px;
  }

  .signature-name {
    font-weight: bold;
    text-transform: uppercase;
  }

  .signature-title {
    font-style: italic;
  }
</style>
