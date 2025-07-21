<template>
  <div class="appointment-container">
    <div class="header">
      <img src="/image.png" alt="City of Tagum Logo" class="logo" />
      <div class="center-text">
        <div class="title">Republic of the Philippines</div>
        <div class="title">PROVINCE OF DAVAO DEL NORTE</div>
        <div class="title">CITY OF TAGUM</div>
      </div>
      <img src="/logo.png" alt="City of Tagum Logo" class="logo" />
    </div>

    <div class="appointment-title">
      <h5>OFFICE OF THE CITY MAYOR</h5>
    </div>

    <div class="appointment-body">
      <p class="intro-text">
        This is to certify that
        <span class="bold">{{ data.name || 'EMPLOYEE NAME' }}</span>
        is hereby appointed to the position of
        <span class="bold">{{ data.position || 'POSITION TITLE' }}</span>
        (Salary Grade {{ data.salaryGrade || 'XX' }}, Step {{ data.step || 'X' }},
        {{ data.status || 'Permanent' }}) in the
        <span class="bold">{{ data.office || 'OFFICE NAME' }}</span>
        with compensation at the rate of
        <span class="bold">{{ data.salaryWords || 'AMOUNT IN WORDS' }} PESOS</span>
        (₱{{ data.salaryFigure || '0.00' }}) per month.
      </p>

      <p class="nature-text">
        Nature of Appointment:
        <span class="bold">{{ data.appointmentNature || 'Original' }}</span>
        <template v-if="data.vice">
          <br />
          Vice:
          <span class="bold">{{ data.vice }}</span>
          <br />
          Who:
          <span class="bold">{{ data.who }}</span>
        </template>
      </p>

      <p class="item-text">
        Plantilla Item No.:
        <span class="bold">{{ data.plantillaItemNo || 'XXXX-XX-XXXX' }}</span>
        <br />
        Page:
        <span class="bold">{{ data.page || 'X' }}</span>
      </p>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-name">{{ data.mayor || 'CITY MAYOR' }}</div>
          <div class="signature-title">City Mayor</div>
        </div>
      </div>

      <div class="date-section">
        <p>Date: {{ formattedSigningDate }}</p>
      </div>

      <div class="csc-section">
        <p class="csc-heading">ATTESTATION:</p>
        <p class="csc-text">
          I hereby certify that this appointment has been issued in accordance with the Civil
          Service Law and Rules, and that the appointee possesses all the minimum qualifications and
          requirements for the position.
        </p>
        <p class="csc-resolution">
          This appointment was approved by Resolution No. {{ data.resolution || 'XXXX' }}, s.
          {{ data.resolutionYear || 'XXXX' }} of the Civil Service Commission dated
          {{ formattedResolutionDate }}.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        name: 'EMPLOYEE NAME',
        position: 'POSITION TITLE',
        salaryGrade: 'XX',
        step: 'X',
        status: 'Permanent',
        office: 'OFFICE NAME',
        salaryWords: 'AMOUNT IN WORDS',
        salaryFigure: '0.00',
        appointmentNature: 'Original',
        vice: '',
        who: '',
        plantillaItemNo: 'XXXX-XX-XXXX',
        page: 'X',
        mayor: 'CITY MAYOR',
        signingDate: new Date().toISOString(),
        resolution: 'XXXX',
        resolutionYear: 'XXXX',
        resolutionDate: new Date().toISOString(),
      }),
    },
    currentDateTime: {
      type: String,
      default: '',
    },
    currentUser: {
      type: String,
      default: '',
    },
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formattedSigningDate = computed(() => formatDate(props.data.signingDate));
  const formattedResolutionDate = computed(() => formatDate(props.data.resolutionDate));
</script>

<style>
  /* These styles will only apply to the PDF */
  .appointment-container {
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
    margin-bottom: 0.3in;
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

  .appointment-title {
    text-align: center;
    margin-bottom: 0.5in;
  }

  .appointment-title h5 {
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid black;
    display: inline-block;
    padding: 0 1in;
    margin: 0;
    font-size: 1.2em;
  }

  .appointment-body {
    text-align: justify;
  }

  .intro-text,
  .nature-text,
  .item-text {
    margin-bottom: 0.3in;
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

  .date-section {
    margin-bottom: 0.5in;
  }

  .csc-section {
    border-top: 1px solid #ccc;
    padding-top: 0.3in;
  }

  .csc-heading {
    font-weight: bold;
    margin-bottom: 0.1in;
    text-transform: uppercase;
  }

  .csc-text,
  .csc-resolution {
    margin-bottom: 0.2in;
  }
</style>
