<template>
  <div class="certification-report-wrapper">
    <div class="certification-report-container">
      <div class="report-content">
        <ReportHeader />

        <div class="certification-title">
          <h1>CERTIFICATION FOR APPOINTEMENTS ISSUED IN LOCAL GOVERNMENT UNITS (LGUs)</h1>
        </div>
        <div class="certification-body">
          <p class="main-text indented" :style="mainTextStyle">
            <slot name="main-text">
              This is to certify all pertinent provisions of Sec 325 of RA No. 7160 (Local
              Government Code of 1991) have been complied with relative to the appointments issued
              on
              {{ formatDateEnglish(data.sepdate) }}
            </slot>
          </p>

          <div class="signature-container">
            <div class="signature-section">
              <div class="signature-name">{{ signatoryName }}</div>
              <div class="signature-line"></div>
              <div class="signature-title">{{ signatoryTitle }}</div>
            </div>
          </div>

          <div class="left-signature-container">
            <div class="stamp">
              Date:
              <span class="underlined">{{ formatDateEnglish(data.sepdate) }}</span>
            </div>
          </div>
        </div>

        <div class="certification-title">
          <h1>CERTIFICATION ON AVAILABILITY OF FUNDS</h1>
        </div>
        <div class="certification-body">
          <p class="main-text indented" :style="mainTextStyle">
            <slot name="main-text">
              This is to certify that funds are available pursusant to Appropriation Ordinance No. 6
              Series of {{ formatYear(data.sepdate) }}
            </slot>
          </p>

          <div class="signature-container">
            <div class="signature-section">
              <div class="signature-name">{{ data.cityaccountant }}</div>
              <div class="signature-line"></div>
              <div class="signature-title">City Accountant</div>
            </div>
          </div>

          <div class="left-signature-container">
            <div class="stamp">
              Date:
              <span class="underlined">{{ formatDateEnglish(data.sepdate) }}</span>
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
              This is to certify that
              {{ data.Sex === 'MALE' ? 'Mr.' : 'Ms.' }}
              <span class="bold underline">{{ data.Name4 || 'Unknown' }}</span>
              has assumed the duties and responsibilities as
              <span class="bold underline">{{ data.NewDesignation || 'NA' }}</span>
              of
              <span class="bold underline">{{ data.NewOffice || 'NA' }}</span>
              effective
              <span class="bold underline">{{ formatDateEnglish(data.sepdate) }}</span>
              .
            </slot>
          </p>

          <p class="main-text indented" :style="mainTextStyle">
            <slot name="main-text">
              This certification is being issued in connection with the issuance of the appointment
              of
              {{ data.Sex === 'MALE' ? 'Mr.' : 'Ms.' }}
              <span class="bold underline">{{ data.Name4 || 'Unknown' }}</span>
              as
              <span class="bold underline">{{ data.NewDesignation || 'NA' }}</span>
              .
            </slot>
          </p>

          <p class="issuance-text indented" :style="issuanceTextStyle">
            <slot name="issuance-text">
              Done this {{ formatDayWithSuffix(data.sepdate) }} day of
              {{ formatMonth(data.sepdate) }}, {{ formatYear(data.sepdate) }} at the City Government
              Center, JV Ayala Avenue, Apokon, Tagum City, Davao del Norte.
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
              Date: {{ formatDateEnglish(data.sepdate) }}
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
        <div class="oathcontainer">
          <div class="oathstamp"><b>SS Porma Blg. 32</b></div>
          <div class="oathstamp"><i>CS Form No. 32</i></div>
        </div>

        <div class="oathcontainer">
          <div class="oathstamp"><b>Narebisa 2025</b></div>
          <div class="oathstamp">
            <i>Revised 2025</i>
          </div>
        </div>

        <div class="certification-title">
          <h1 style="margin-top: 30px">PANUNUMPA SA KATUNGKULAN</h1>
          <div class="subtitle">OATH OF OFFICE</div>
        </div>
        <div class="certification-body FS">
          <p class="oath-content indented">
            <template v-for="(word, idx) in oathWords" :key="idx">
              <ruby class="word-ruby">
                <span v-html="word.fil"></span>
                <rt>
                  <span v-html="word.eng"></span>
                </rt>
              </ruby>
            </template>
          </p>
          <div class="indented">
            <ruby class="word-ruby">
              <span>KASIHAN NAWA AKO NG DIYOS.</span>
              <rt>
                <span>
                  <span style="color: white">*</span>
                  SO HELP ME GOD
                </span>
              </rt>
            </ruby>
          </div>

          <div class="signature-container">
            <div class="signature-name">{{ data.Name4 }}</div>
          </div>

          <div class="left-signature-container">
            <div>
              Government ID:
              <span v-if="data?.TINNo" class="underline">TIN</span>
              <span v-else class="underline">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <div>
              Numero ng ID:
              <span class="underline">
                {{
                  data?.TINNo ||
                  '  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                }}
              </span>
            </div>
            <div>
              Araw ng Pagkakaloob:
              <span
                style="display: inline-block; width: 80px; border-bottom: 1px solid black"
              ></span>
            </div>
          </div>

          <div class="double"></div>

          <p class="main-text indented" :style="mainTextStyle">
            <slot>
              Nilagdaan at pinanumpaan sa harap ko ngayong {{ formatDateTagalog(data.sepdate) }} sa
              Tagum City, Davao Del Norte, Pilipinas.
            </slot>
          </p>

          <div class="signature-container">
            <div class="signature-section">
              <div class="signature-name">{{ signatoryName }}</div>
              <div class="signature-line"></div>
              <div class="signature-title">{{ signatoryTitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import ReportHeader from './ReportHeader.vue';

  const props = defineProps({
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

  // Computed properties for dynamic signatory display
  const signatoryName = computed(() => {
    // Check if 'NewOffice' contains "VICE MAYOR" or "SANGGUNIANG PANLUNGSOD" or "SANGUNIAN"
    if (
      props.data.NewOffice?.includes('VICE MAYOR') ||
      props.data.NewOffice?.includes('SANGGUNIANG PANLUNGSOD') ||
      props.data.NewOffice?.includes('SANGGUNIAN')
    ) {
      return props.data.vicemayor || 'NA';
    } else {
      return props.data.mayor || 'NA';
    }
  });

  // Computed property for signatory title
  const signatoryTitle = computed(() => {
    // Check if 'NewOffice' contains "VICE MAYOR" or "SANGGUNIANG PANLUNGSOD" or "SANGUNIAN"
    if (
      props.data.NewOffice?.includes('VICE MAYOR') ||
      props.data.NewOffice?.includes('SANGGUNIANG PANLUNGSOD') ||
      props.data.NewOffice?.includes('SANGGUNIAN')
    ) {
      return 'City Vice Mayor';
    } else {
      return 'City Mayor';
    }
  });

  // Date formatting functions
  const formatDateEnglish = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatDateTagalog = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    const tagalogMonths = {
      0: 'Enero',
      1: 'Pebrero',
      2: 'Marso',
      3: 'Abril',
      4: 'Mayo',
      5: 'Hunyo',
      6: 'Hulyo',
      7: 'Agosto',
      8: 'Setyembre',
      9: 'Oktubre',
      10: 'Nobyembre',
      11: 'Disyembre',
    };

    const month = tagalogMonths[dateObj.getMonth()];
    return `ika-${day} ng ${month}, ${year}`;
  };

  const formatDayWithSuffix = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const day = dateObj.getDate();
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
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleString('en-US', { month: 'long' });
  };

  const formatYear = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.getFullYear();
  };

  // Make oathWords a computed property to use dynamic data
  const oathWords = computed(() => [
    { fil: '<span style="color:white">*</span>Ako', eng: '<span style="color:white">*</span>I' },
    { fil: '<span style="color:white">*</span>si', eng: '' },
    {
      fil: `<span style="color:white">*</span><span style="font-weight:bold; text-decoration:underline;">${props.data.Name4 || 'Name of Appointee'}</span>`,
      eng: '<span style="color:white">*</span>(Name <span style="color:white">*</span>of <span style="color:white">*</span>Appointee)',
    },
    { fil: '<span style="color:white">*</span>ng', eng: '<span style="color:white">*</span>' },
    {
      fil: '<span style="color:white">*</span><span style="font-weight:bold; text-decoration:underline;">TAGUM CITY, DAVAO DEL NORTE</span>',
      eng: '<span style="color:white">*</span>(Address)',
    },
    {
      fil: '<span style="color:white">*</span>na <span style="color:white">*</span>itinalaga <span style="color:white">*</span>bilang',
      eng: '<span style="color:white">*</span>having <span style="color:white">*</span>been <span style="color:white">*</span>appointed <span style="color:white">*</span>to',
    },
    {
      fil: `<span style="color:white">*</span><span style="font-weight:bold; text-decoration:underline;">${props.data.NewDesignation || 'Position'}</span>`,
      eng: '<span style="color:white">*</span>(Position)',
    },
    {
      fil: '<span style="color:white">*</span>ay <span style="color:white">*</span>taimtim <span style="color:white">*</span>na <span style="color:white">*</span>nanunumpa <span style="color:white">*</span>na',
      eng: '<span style="color:white">*</span>hereby <span style="color:white">*</span>solemnly <span style="color:white">*</span>swear,',
    },
    {
      fil: '<span style="color:white">*</span>sa <span style="color:white">*</span>abot <span style="color:white">*</span>ng <span style="color:white">*</span>aking <span style="color:white">*</span>kakayahan,',
      eng: '<span style="color:white">*</span>to <span style="color:white">*</span>the <span style="color:white">*</span>best <span style="color:white">*</span>of <span style="color:white">*</span>my <span style="color:white">*</span>ability,',
    },
    {
      fil: '<span style="color:white">*</span>ang <span style="color:white">*</span>mga <span style="color:white">*</span>katungkulang <span style="color:white">*</span>pinagtalagahan <span style="color:white">*</span>sa <span style="color:white">*</span>akin',
      eng: '<span style="color:white">*</span>the <span style="color:white">*</span>duties <span style="color:white">*</span>of <span style="color:white">*</span>my <span style="color:white">*</span>present <span style="color:white">*</span>position',
    },
    {
      fil: '<span style="color:white">*</span>at <span style="color:white">*</span>sa <span style="color:white">*</span>dapat <span style="color:white">*</span>gampanan <span style="color:white">*</span>sa <span style="color:white">*</span>iba <span style="color:white">*</span>pang <span style="color:white">*</span>pagkaraan <span style="color:white">*</span>nito\'y <span style="color:white">*</span>gagampanan <span style="color:white">*</span>ko',
      eng: '<span style="color:white">*</span>and <span style="color:white">*</span>of <span style="color:white">*</span>all <span style="color:white">*</span>others <span style="color:white">*</span>that <span style="color:white">*</span>I <span style="color:white">*</span>may <span style="color:white">*</span>hereafter <span style="color:white">*</span>hold',
    },
    {
      fil: '<span style="color:white">*</span>sa <span style="color:white">*</span>ilalim <span style="color:white">*</span>ng <span style="color:white">*</span>Republika <span style="color:white">*</span>ng <span style="color:white">*</span>Pilipinas;',
      eng: '<span style="color:white">*</span>under <span style="color:white">*</span>the <span style="color:white">*</span>Republic <span style="color:white">*</span>of <span style="color:white">*</span>the <span style="color:white">*</span>Philippines;',
    },
    {
      fil: '<span style="color:white">*</span>na <span style="color:white">*</span>aking <span style="color:white">*</span>itataguyod <span style="color:white">*</span>at <span style="color:white">*</span>ipagtatangol <span style="color:white">*</span>ang <span style="color:white">*</span>Saligang <span style="color:white">*</span>Batas <span style="color:white">*</span>ng <span style="color:white">*</span>Pilipinas;',
      eng: '<span style="color:white">*</span>to <span style="color:white">*</span>uphold <span style="color:white">*</span>and <span style="color:white">*</span>defend <span style="color:white">*</span>the <span style="color:white">*</span>Constitution,',
    },
    {
      fil: '<span style="color:white">*</span>na <span style="color:white">*</span>tunay <span style="color:white">*</span>na <span style="color:white">*</span>mananalig <span style="color:white">*</span>at <span style="color:white">*</span>tatalima <span style="color:white">*</span>ako <span style="color:white">*</span>rito;',
      eng: '<span style="color:white">*</span>that <span style="color:white">*</span>I <span style="color:white">*</span>will <span style="color:white">*</span>bear <span style="color:white">*</span>true <span style="color:white">*</span>faith <span style="color:white">*</span>and <span style="color:white">*</span>allegiance <span style="color:white">*</span>to <span style="color:white">*</span>the <span style="color:white">*</span>same;',
    },
    {
      fil: '<span style="color:white">*</span>na <span style="color:white">*</span>susundin <span style="color:white">*</span>ko <span style="color:white">*</span>ang <span style="color:white">*</span>mga <span style="color:white">*</span>batas <span style="color:white">*</span>at <span style="color:white">*</span>mga <span style="color:white">*</span>kautusang <span style="color:white">*</span>legal,',
      eng: '<span style="color:white">*</span>that <span style="color:white">*</span>I <span style="color:white">*</span>will <span style="color:white">*</span>obey <span style="color:white">*</span>the <span style="color:white">*</span>laws, <span style="color:white">*</span>legal <span style="color:white">*</span>orders,',
    },
    {
      fil: '<span style="color:white">*</span>at <span style="color:white">*</span>mga <span style="color:white">*</span>dekretong <span style="color:white">*</span>pinaiiral <span style="color:white">*</span>ng <span style="color:white">*</span>mga <span style="color:white">*</span>sadyang',
      eng: '<span style="color:white">*</span>and <span style="color:white">*</span>decrees <span style="color:white">*</span>promulgated',
    },
    {
      fil: '<span style="color:white">*</span>itinakdang <span style="color:white">*</span>maykapangyarihan <span style="color:white">*</span>ng <span style="color:white">*</span>Republika <span style="color:white">*</span>ng <span style="color:white">*</span>Pilipinas;',
      eng: '<span style="color:white">*</span>by <span style="color:white">*</span>the <span style="color:white">*</span>duly <span style="color:white">*</span>constituted <span style="color:white">*</span>authorities <span style="color:white">*</span>of <span style="color:white">*</span>the <span style="color:white">*</span>Republic <span style="color:white">*</span>of <span style="color:white">*</span>the <span style="color:white">*</span>Philippines;',
    },
    {
      fil: '<span style="color:white">*</span>at <span style="color:white">*</span>kusa <span style="color:white">*</span>kong <span style="color:white">*</span>babalikatin <span style="color:white">*</span>ang <span style="color:white">*</span>pananagutang <span style="color:white">*</span>ito',
      eng: '<span style="color:white">*</span>and <span style="color:white">*</span>that <span style="color:white">*</span>I <span style="color:white">*</span>impose <span style="color:white">*</span>this <span style="color:white">*</span>obligation <span style="color:white">*</span>upon <span style="color:white">*</span>myself <span style="color:white">*</span>voluntarily,',
    },
    {
      fil: '<span style="color:white">*</span>ng <span style="color:white">*</span>walang <span style="color:white">*</span>ano <span style="color:white">*</span>mang <span style="color:white">*</span>pasubali <span style="color:white">*</span>o <span style="color:white">*</span>hangaring <span style="color:white">*</span>umiwas.',
      eng: '<span style="color:white">*</span>without <span style="color:white">*</span>mental <span style="color:white">*</span>reservation <span style="color:white">*</span>or <span style="color:white">*</span>purpose <span style="color:white">*</span>of <span style="color:white">*</span>evasion.',
    },
    { fil: '', eng: '' },
    { fil: '', eng: '' },
  ]);
</script>

<style scoped>
  /* ... (all existing styles remain the same) ... */
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

  h1 {
    margin-top: 80px;
    line-height: 1.5;
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
    letter-spacing: 1px;
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
    text-indent: 2em;
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

  .oath-content {
    text-align: justify;
    margin-bottom: 1.5em;
    line-height: 3;
  }
  .word-ruby {
    display: inline ruby;
    letter-spacing: 1;
    text-align: center;
    ruby-align: center;
  }
  .word-only {
    display: inline;
  }
  .word-space {
    display: inline;
  }
  rt {
    font-size: 10px;
    font-style: italic;
    color: #7f8c8d;
  }
  ruby {
    ruby-position: under;
  }

  .signature-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 60px;
  }
  .left-signature-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 30px;
  }
  .stamp {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .oathcontainer {
    padding-bottom: 10px;
  }
  .oathstamp {
    font-size: 8pt;
  }

  .double {
    width: 100%;
    height: 6px;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
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

  .subtitle {
    font-size: 14px;
    font-weight: normal;
    margin-top: 5px;
  }

  @media print {
    @page {
      size: letter;
      margin: 0;
    }
  }
</style>
