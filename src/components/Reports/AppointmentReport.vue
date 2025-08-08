<template>
  <div class="appointment-form-container">
    <!-- First page -->
    <div class="appointment-form">
      <div class="form-content">
        <div class="form-title">
          <div class="cs-form">CS Form No. 33-B</div>
          <div class="revised">Revised 2018</div>
        </div>

        <div class="header">
          <div class="left-logo">
            <img src="/image.png" alt="Philippine Seal" />
          </div>
          <div class="center-header">
            <div>Republic of the Philippines</div>
            <div>PROVINCE OF DAVAO DEL NORTE</div>
            <div><strong>CITY OF TAGUM</strong></div>
            <br />
            <div class="office"><strong>OFFICE OF THE CITY MAYOR</strong></div>
          </div>
          <div class="right-logo">
            <img src="/logo.png" alt="City of Tagum Logo" />
          </div>
        </div>

        <div class="body">
          <p>
            MR./MS.:
            <strong class="underline">{{ data.Name4 || '(Name)' }}</strong>
          </p>

          <p style="text-indent: 2em">
            You are hereby appointed as
            <strong class="underline">{{ data.NewDesignation  || '(Position Title)' }}</strong>
            (SG/Step
            <strong class="underline">
              {{ data.SG || '(SG)' }}/{{ data.Step || '(Step)' }}
            </strong>
            ) under
            <strong class="underline">
              {{ data.Status  || '(Permanent, Temporary, etc.)' }}
            </strong>
            status at the
            <strong class="underline">{{ data.NewOffice|| '(Office/Department/Unit)' }}</strong>
            with a compensation rate of
            <strong class="underline">{{ formatSalaryWords(data.MRate)|| '(Salary in Words)' }}</strong>
            (
            <strong class="underline">{{ formatSalaryAmount(data.MRate) || '(Amount)' }}</strong>
            ) pesos per month.
          </p>

          <p style="text-indent: 2em">
            The nature of this appointment is
            <strong class="underline">
              {{ data.Renew || '(Original, Promotion, etc.)' }}
            </strong>
            vice
            <!-- <strong class="underline">{{ data.vicecause || '(Previous Appointee/N/A)' }}</strong> -->
             <strong class="underline">{{ data.vicecause || 'N/A' }}</strong>
            , who
            <!-- <strong class="underline">{{ data.vicecause || '(Transferred, Retired, etc.)' }}</strong> -->
              <strong class="underline">{{ data.vicecause || 'N/A' }}</strong>
            with Plantilla Item No.
            <strong class="underline">{{ data.ItemNo || '(Item No.)' }}</strong>
            Page
            <strong class="underline">{{ data.Pages || '(Page No.)' }}</strong>
            .
          </p>

          <p style="text-indent: 2em">
            This appointment shall take effect on the date of signing by the appointing
            officer/authority.
          </p>
        </div>

        <div class="signature-block">
          <p class="signature-salutation">Very truly yours,</p>
          <br />
          <br />

          <div class="signature-section">
            <div class="signature-name-container">
              <strong class="signature-name">{{ data.mayor || 'REY T. UY' }}</strong>
            </div>
            <div class="signature-title">City Mayor</div>
            <br />
            <div class="signing-date-container">
              <strong class="signing-date">{{ formattedSigningDate || 'August 1, 2024' }}</strong>
            </div>
            <div class="signing-label">Date of Signing</div>
          </div>
        </div>

        <div class="footer-note">
          <p class="footer">
            Accredited/Deregulated Pursuant to
            <br />
            <span>CSC Resolution No.</span>
            <!-- <strong class="underline">{{ data.resolution || '(Resolution No.)' }}</strong>
            , s.
            <strong class="underline">{{ data.resolutionYear || '(Year)' }}</strong> -->
               <strong class="underline">1701688,</strong>
            , s. <strong class="underline">2017</strong>
            <br />
            Dated
            <!-- <strong class="underline">{{ formattedResolutionDate || '(Resolution Date)' }}</strong> -->
            <strong class="underline">December 28, 1017</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Second page (Certification page) -->
    <CertificationPage />
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import CertificationPage from 'src/components/Reports/AppoinmentNextPage.vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        // name: '',
        // position: '',
        // salaryGrade: '',
        // step: '',
        // status: '',
        // office: '',
        // salaryWords: '',
        // salaryFigure: '',
        // appointmentNature: '',
        // vice: '',
        // who: '',
        // plantillaItemNo: '',
        // page: '',
        // mayor: '',
        // signingDate: '',
        // resolution: '',
        // resolutionYear: '',
        // resolutionDate: '',
      }),
    },
  });
console.log('AppointmentReport - received data:', props.data);
// console.log('AppointmentReport - received employee:', props.employee);
//   const formatDate = (dateStr) => {
//   if (!dateStr) return '';
//   const date = new Date(dateStr);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });
// };
const formatSalaryWords = (amount) => {
  if (!amount) return '';

  // Convert to number and handle decimal places
  const numericAmount = parseFloat(amount);
  const wholeNumber = Math.floor(numericAmount);
  const decimalPart = Math.round((numericAmount - wholeNumber) * 100);

  // Number to words conversion function
  const convertToWords = (num) => {
    if (num === 0) return 'ZERO';

    const ones = [
      '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
      'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
      'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
    ];

    const tens = [
      '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'
    ];

    const scales = ['', 'THOUSAND', 'MILLION', 'BILLION', 'TRILLION'];

    const convertHundreds = (n) => {
      let result = '';

      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' HUNDRED';
        n %= 100;
        if (n > 0) result += ' ';
      }

      if (n >= 20) {
        result += tens[Math.floor(n / 10)];
        n %= 10;
        if (n > 0) result += '-' + ones[n];
      } else if (n > 0) {
        result += ones[n];
      }

      return result;
    };

    if (num === 0) return 'ZERO';

    let result = '';
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        let chunkWords = convertHundreds(chunk);
        if (scales[scaleIndex]) {
          chunkWords += ' ' + scales[scaleIndex];
        }
        result = chunkWords + (result ? ' ' + result : '');
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result;
  };

  let result = convertToWords(wholeNumber);

  // Handle decimal part (centavos) if needed
  if (decimalPart > 0) {
    result += ' AND ' + convertToWords(decimalPart) + '/100';
  }

  return result;
};

const formatSalaryAmount = (amount) => {
  // Format as currency
  return amount ? new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount) : '';
};

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formattedSigningDate = computed(() => formatDate(props.data.signingDate));
  // const formattedResolutionDate = computed(() => formatDate(props.data.resolutionDate));
</script>

<style scoped>
  .appointment-form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .appointment-form {
    width: 8.5in;
    min-height: 12in;
    padding: 0.3in;
    padding-top: 1in;
    font-family: 'Consolas', 'Courier New', Courier, monospace;
    font-size: 12pt;
    color: black;
    background: white;
    box-sizing: border-box;
    line-height: 1.5;
  }

  .form-content {
    width: 100%;
    height: 100%;
    border: 2px solid black;
    box-shadow:
      inset 0 0 0 20px #c0c0c0,
      inset 0 0 0 22px black;
    padding: 0.5in;
    box-sizing: border-box;
    position: relative;
    min-height: calc(11in - 1in);
  }

  .form-title {
    position: absolute;
    top: 0.5in;
    left: 0.5in;
    font-size: 10pt;
    line-height: 1.2;
  }

  .cs-form {
    font-weight: bold;
    font-style: italic;
    font-size: 13pt;
  }

  .revised {
    font-weight: bold;
    font-style: italic;
    font-size: 10pt;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3em;
    margin-bottom: 1em;
  }

  .right-logo img {
    width: 105px;
    height: 95px;
  }

  .left-logo img {
    width: 100px;
    height: 90px;
  }

  .center-header {
    text-align: center;
    flex-grow: 1;
    font-size: 11pt;
  }

  .office {
    font-size: 16pt;
  }

  .body {
    margin-top: 2em;
    font-size: 11pt;
    text-align: justify;
    line-height: 3;
  }

  .underline {
    text-decoration: underline;
  }

  .signature-block {
    margin-top: 3em;
    text-align: right;
    font-size: 11pt;
  }

  .signature-salutation {
    text-align: center;
    margin-bottom: 2em;
  }

  .signature-section {
    display: inline-block;
    text-align: center;
    margin-bottom: 2em;
  }

  .signature-name-container {
    position: relative;
    display: inline-block;
    min-width: 300px;
    border-bottom: 2px solid black;
    padding-bottom: 3px;
    margin-bottom: 5px;
  }

  .signature-name {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 11pt;
  }

  .signature-title {
    font-style: italic;
    font-size: 11pt;
  }

  .signing-date-container {
    position: relative;
    display: inline-block;
    min-width: 200px;
    border-bottom: 2px solid black;
    padding-bottom: 3px;
    margin-bottom: 5px;
  }

  .signing-date {
    font-weight: bold;
    font-size: 11pt;
  }

  .signing-label {
    font-style: italic;
    font-size: 11pt;
  }

  .footer {
    font-size: 11pt;
  }

  .footer-note {
    max-width: 300px;
    margin-top: 3em;
    margin-bottom: 15px;
    font-size: 11pt;
  }
</style>
