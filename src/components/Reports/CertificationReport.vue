<template>
  <div class="certification-report-container">
    <div class="report-content">
      <ReportHeader :officeName="officeName" />

      <div class="certification-title">
        <h1>CERTIFICATION</h1>
      </div>
      <div class="certification-body">
        <p class="concern-text">TO WHOM IT MAY CONCERN:</p>
        <p class="main-text indented" :style="mainTextStyle">
          <slot name="main-text">
            In connection with the {{ data.Renew }} of
            <span class="bold">{{ data.Name4 || 'Unknown' }}</span>
            as
            <span class="bold">{{ data.NewDesignation || 'NA' }},</span>
            SG {{ data.SG || 'NA' }} of the
            <span class="bold">
              {{ data.NewOffice || 'NA' }}
            </span>
            this City at the rate of
            <span class="bold">
              {{ formatSalary(data.SalaryAnnual) }}
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
        <p class="issuance-text indented" :style="issuanceTextStyle">
          <slot name="issuance-text">
            Issued this {{ formatDayWithSuffix(sepdate) }} day of {{ formatMonth(sepdate) }},
            {{ formatYear(sepdate) }} at the City Government Center, JV Ayala Avenue, Apokon, Tagum
            City, Davao del Norte.
          </slot>
        </p>
        <div class="signature-container">
          <div class="signature-section">
            <div class="signature-name">{{ data.mayor }}</div>
            <div class="signature-line"></div>
            <div class="signature-title">City Mayor</div>
          </div>
        </div>
      </div>
    </div>
    <ReportFooter :phone="footerPhone" :email="footerEmail" />
  </div>

  <div class="certification-report-container">
    <div class="report-content">
      <ReportHeader :officeName="officeName" />

      <div class="certification-title">
        <h1>CERTIFICATION</h1>
      </div>
      <div class="certification-body">
        <p class="concern-text">TO WHOM IT MAY CONCERN:</p>
        <p class="main-text indented" :style="mainTextStyle">
          <slot name="main-text">
            THIS IS TO CERTIFY that funds are available for the position of
            <span class="bold">{{ data.NewDesignation || 'NA' }}</span>
            SG
            <span class="bold">{{ data.SG || 'NA' }},</span>
            Item No.
            <span class="bold">{{ data.ItemNo || 'NA' }},</span>
            of the
            <span class="bold">
              {{ data.NewOffice || 'NA' }}
            </span>
            in the amount of
            <span class="bold">
              {{ formatSalary(data.SalaryAnnual) }}
            </span>
            annually based on Appropriation Ordinance No. 06 series of 2024.
          </slot>
        </p>

        <p class="main-text indented" :style="mainTextStyle">
          <slot name="main-text">
            This certification is being issued in connection with the
            <span class="bold">{{ data.Renew }}</span>
            of
            <span class="bold">{{ data.Name4 || 'Unknown' }}</span>
            .
          </slot>
        </p>

        <p class="issuance-text indented" :style="issuanceTextStyle">
          <slot name="issuance-text">
            Issued this {{ formatDayWithSuffix(sepdate) }} day of {{ formatMonth(sepdate) }},
            {{ formatYear(sepdate) }} at the City Government Center, JV Ayala Avenue, Apokon, Tagum
            City, Davao del Norte.
          </slot>
        </p>
        <div class="signature-container">
          <div class="signature-section">
            <div class="signature-name">{{ data.cityaccountant }}</div>
            <div class="signature-line"></div>
            <div class="signature-title">City Accountant</div>
          </div>
        </div>
      </div>
    </div>
    <ReportFooter :phone="footerPhone" :email="footerEmail" />
  </div>

  <div class="certification-report-container">
    <div class="report-content">
      <ReportHeader />

      <div class="certification-title">
        <h1>CERTIFICATION OF ASSUMPTION TO DUTY</h1>
      </div>
      <div class="certification-body">
        <p class="main-text indented" :style="mainTextStyle">
          <slot name="main-text">
            This is to certify that Mr.
            <span class="bold underline">{{ data.Name4 || 'Unknown' }}</span>
            has assumed the duties and responsibilities as
            <span class="bold underline">{{ data.NewDesignation || 'NA' }}</span>
            of
            <span class="bold underline">{{ data.NewOffice || 'NA' }}</span>
            effective
            <span class="bold underline">{{ data.sepdate || 'NA' }}</span>
            .
          </slot>
        </p>

        <p class="main-text indented" :style="mainTextStyle">
          <slot name="main-text">
            This certification is being issued in connection with the issuance of the appointment of
            Ms.
            <span class="bold underline">{{ data.Name4 || 'Unknown' }}</span>

            as
            <span class="bold underline">{{ data.NewDesignation || 'NA' }}</span>
            .
          </slot>
        </p>

        <p class="issuance-text indented" :style="issuanceTextStyle">
          <slot name="issuance-text">
            Done this {{ formatDayWithSuffix(sepdate) }} day of {{ formatMonth(sepdate) }},
            {{ formatYear(sepdate) }} at the City Government Center, JV Ayala Avenue, Apokon, Tagum
            City, Davao del Norte.
          </slot>
        </p>
        <div class="signature-container">
          <div class="signature-section">
            <div class="signature-name">{{ data.admin }}</div>
            <div class="signature-line"></div>
            <div class="signature-title">City Administrator</div>
          </div>
        </div>

        <div class="left-signature-container">
          <div class="stamp">Attested by:</div>
          <div class="signature-section">
            <div class="signature-name">{{ data.HR }}</div>
            <div class="signature-line"></div>
            <div class="signature-title">City Human Resource Mgt. Officer</div>
          </div>
          <div class="stamp" style="padding-top: 35px; padding-bottom: 40px">
            Date: {{ data.sepdate || 'NA' }}
          </div>
        </div>

        <div class="stamp">
          <div>201 file</div>
          <div>Admin</div>
          <div>COA</div>
          <div>CSC</div>
        </div>
      </div>
    </div>
  </div>

  <div class="certification-report-container">
    <div class="report-content">
      <ReportHeader />

      <div class="certification-title">
        <h1>PANUNUMPA SA KATUNGKULAN</h1>
      </div>
      <div class="certification-body FS">
        <p class="main-text oath-text">
          <span class="bilingual-phrase indented">
            <span class="filipino">Ako</span>
            <span class="translation">I,</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">si</span>
            <span class="translation">&nbsp;</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">{{ data.Name4 || 'Unknown' }}</span>
            <span class="translation">(Appointee)</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">{{ data.Address || 'NA' }}</span>
            <span class="translation">(Address)</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">na itinalaga bilang</span>
            <span class="translation">have been appointed</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">sa posisyong</span>
            <span class="translation">to the position</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino bold underline">{{ data.NewDesignation || 'Unknown' }}</span>
            <span class="translation bold underline">(Position)</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">ay taimtim na nanunumpa</span>
            <span class="translation">hereby solemnly swear</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">na tutuparin ko nang buong husay</span>
            <span class="translation">that I will faithfully discharge</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">at katapatan,</span>
            <span class="translation">with the best</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">sa abot ng aking kakayahan,</span>
            <span class="translation">of my ability,</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">ang mga katungkulang</span>
            <span class="translation">the duties</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">pinagtalagahan sa akin</span>
            <span class="translation">entrusted to me</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">at sa mga katungkulan</span>
            <span class="translation">and of all others</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">na aking gaganapin</span>
            <span class="translation">that I may hold</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">sa ilalim ng Republika ng Pilipinas,</span>
            <span class="translation">under the Republic of the Philippines,</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">na aking itataguyod</span>
            <span class="translation">that I will uphold</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">at ipagtatangol ang Saligang Batas</span>
            <span class="translation">and defend the Constitution</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">ng Pilipinas;</span>
            <span class="translation">of the Philippines;</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">na tunay na mananalig</span>
            <span class="translation">that I will bear true faith</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">at tatalima ako rito;</span>
            <span class="translation">and allegiance to the same</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">na susundin ko</span>
            <span class="translation">that I will obey</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">ang mga batas at kautusang legal,</span>
            <span class="translation">the laws and legal orders,</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">at mga dekretong pinaiiral</span>
            <span class="translation">and decrees promulgated</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">ng mga awtoridad na itinalaga</span>
            <span class="translation">by the duly constituted authorities</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">ng Republika ng Pilipinas;</span>
            <span class="translation">of the Republic of the Philippines;</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">at kusa kong babalikatin</span>
            <span class="translation">and that I impose</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">ang panangutang ito</span>
            <span class="translation">this obligation</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">nang walang pasubali</span>
            <span class="translation">upon myself voluntarily,</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">o hangaring umiwas.</span>
            <span class="translation">without mental reservation or purpose of evasion.</span>
          </span>

          <span class="bilingual-phrase">
            <span class="filipino">KASIHAN NAWA AKO NG DIYOS.</span>
            <span class="translation">SO HELP ME GOD.</span>
          </span>
        </p>

        <div class="signature-container">
          <div class="signature-name">{{ data.Name4 }}</div>
        </div>

        <div class="left-signature-container">
          <div class="stamp">Government ID:</div>
          <div class="stamp">Numero ng ID:</div>
          <div class="stamp">Araw ng Pagkakaloob:</div>
        </div>

        <div class="double"></div>

        <p class="main-text indented" :style="mainTextStyle">
          <slot>
            Nilagdaan at pinanumpaan sa harap ko ngayong ika-XX ng XX, XXXX sa Tagum City, Davao Del
            Norte, Pilipinas.
          </slot>
        </p>

        <div class="signature-container">
          <div class="signature-section">
            <div class="signature-name">{{ data.mayor }}</div>
            <div class="signature-line"></div>
            <div class="signature-title">City Mayor</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <OathReport /> -->
</template>

<script setup>
  import { ref } from 'vue';
  import ReportHeader from './ReportHeader.vue';
  import ReportFooter from './ReportFooter.vue';
  // import OathReport from './OathReport.vue';

  defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
    officeName: {
      type: String,
      default: '',
    },
    mainTextStyle: {
      type: Object,
      default: () => ({}),
    },
    issuanceTextStyle: {
      type: Object,
      default: () => ({}),
    },
    signatoryName: {
      type: String,
      default: 'REY T. UY',
    },
    signatoryTitle: {
      type: String,
      default: 'CITY MAYOR',
    },
    footerPhone: {
      type: String,
      default: '',
    },
    footerEmail: {
      type: String,
      default: '',
    },
  });

  // Current date using sepdate
  const sepdate = ref(new Date());

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

  // Function to convert number to words (including decimals)
  const numberToWords = (num) => {
    if (!num || isNaN(num)) return 'N/A';

    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    const teens = [
      'TEN',
      'ELEVEN',
      'TWELVE',
      'THIRTEEN',
      'FOURTEEN',
      'FIFTEEN',
      'SIXTEEN',
      'SEVENTEEN',
      'EIGHTEEN',
      'NINETEEN',
    ];
    const tens = [
      '',
      '',
      'TWENTY',
      'THIRTY',
      'FORTY',
      'FIFTY',
      'SIXTY',
      'SEVENTY',
      'EIGHTY',
      'NINETY',
    ];
    const thousands = ['', 'THOUSAND', 'MILLION', 'BILLION'];

    if (num === 0) return 'ZERO';

    // Split into whole and decimal parts
    const [wholePart, decimalPart = '00'] = num.toFixed(2).split('.');

    const convertHundreds = (n) => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' HUNDRED ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };

    let wholeNumber = parseInt(wholePart);
    let result = '';
    let thousandCounter = 0;

    // Convert whole number part
    if (wholeNumber === 0) {
      result = 'ZERO ';
    } else {
      while (wholeNumber > 0) {
        if (wholeNumber % 1000 !== 0) {
          result = convertHundreds(wholeNumber % 1000) + thousands[thousandCounter] + ' ' + result;
        }
        wholeNumber = Math.floor(wholeNumber / 1000);
        thousandCounter++;
      }
    }

    // Add decimal part if not zero
    const decimalValue = parseInt(decimalPart);
    if (decimalValue > 0) {
      result += 'AND ' + convertHundreds(decimalValue) + 'CENTAVOS ';
    }

    return result.trim();
  };

  // Function to format salary in words with peso sign and number (up to 2 decimal places)
  const formatSalary = (salary) => {
    if (!salary) return 'N/A';

    // Extract number from salary if it's a string with peso sign
    let numericSalary;
    if (typeof salary === 'string') {
      // Remove peso sign, commas, and extract number
      const match = salary.match(/[\d,]+\.?\d*/);
      if (match) {
        numericSalary = parseFloat(match[0].replace(/,/g, ''));
      } else {
        return salary; // Return as is if no number found
      }
    } else if (typeof salary === 'number') {
      numericSalary = salary;
    } else {
      return 'N/A';
    }

    // Ensure 2 decimal places
    const roundedSalary = Math.round(numericSalary * 100) / 100;
    const wordsVersion = numberToWords(roundedSalary);
    const formattedNumber = roundedSalary.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${wordsVersion} PESOS (₱${formattedNumber}) `;
  };
</script>

<style scoped>
  .certification-report-container {
    width: 8.5in;
    min-height: 11in;
    height: 14in;
    position: relative;
    font-family: Arial, sans-serif;
    background-color: white;
    box-sizing: border-box;
    color: black;
    line-height: 1.5;
    letter-spacing: 0.5px;
    display: flex;
    flex-direction: column;
  }

  .FS {
    font-family: 'Times New Roman', Times, serif;
  }

  .report-content {
    padding: 0.75in 1in 0 1in;
    flex: 1;
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
  .indented {
    text-indent: 2em; /* Adds indentation to the first line */
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
  .underline {
    text-decoration: underline;
  }

  /* New styles for the oath section */
  .bilingual-phrase {
    display: inline-block;
    text-align: center;
    margin: 0 2px;
  }

  .bilingual-phrase .filipino {
    display: block;
    font-weight: normal;
  }

  .bilingual-phrase .translation {
    display: block;
    font-size: 0.75em;
    font-style: italic;
    color: #444;
  }
  /* .oath-section {
      margin-bottom: 8px;
    }
    .filipino-text {
      font-weight: normal;
    }
    .english-translation {
      font-style: italic;
      color: #555;
      margin-left: 2em;
      font-size: 0.9em;
    }
    .transalation {
      display: none;
    } */

  .signature-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 60px;
    margin-bottom: 60px;
  }
  .left-signature-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 60px;
  }
  .stamp {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .double {
    width: 100%;
    height: 0;
    border-top: 3px double black;
    margin: 20px 0;
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
