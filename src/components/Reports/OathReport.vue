<template>
  <div class="certification-report-container">
    <div class="report-content">
      <ReportHeader :officeName="officeName" />

      <div class="certification-title">
        <h1>PANUNUMPA SA KATUNGKULAN</h1>
      </div>

      <div class="certification-body">
        <p class="oath-content">
          <template v-for="(word, idx) in oathWords" :key="idx">
            <span class="word-pair">
              <span class="filipino">{{ word.fil }}</span>
              <span class="english">{{ word.eng }}</span>
            </span>
          </template>
        </p>

        <!-- Signature -->
        <div class="signature-container">
          <div class="signature-name">{{ data.Name4 || '________________' }}</div>
        </div>

        <div class="left-signature-container">
          <div class="stamp">Government ID:</div>
          <div class="stamp">Numero ng ID:</div>
          <div class="stamp">Araw ng Pagkakaloob:</div>
        </div>

        <div class="double"></div>

        <p class="main-text indented">
          Nilagdaan at pinanumpaan sa harap ko ngayong ika-{{ oathDay }} ng {{ oathMonth }},
          {{ oathYear }} sa Tagum City, Davao Del Norte, Pilipinas.
        </p>

        <div class="signature-container">
          <div class="signature-section">
            <div class="signature-name">{{ data.mayor || '________________' }}</div>
            <div class="signature-line"></div>
            <div class="signature-title">City Mayor</div>
          </div>
        </div>
      </div>

      <ReportFooter :phone="footerPhone" :email="footerEmail" />
    </div>
  </div>
</template>

<script setup>
  import ReportHeader from './ReportHeader.vue';
  import ReportFooter from './ReportFooter.vue';

  const props = defineProps({
    data: { type: Object, default: () => ({}) },
    officeName: { type: String, default: '' },
    footerPhone: { type: String, default: '' },
    footerEmail: { type: String, default: '' },
  });

  const data = props.data;

  // Word-by-word translation array
  const oathWords = [
    { fil: 'Ako', eng: 'I' },
    { fil: 'si', eng: 'am' },
    { fil: data.Name4 || '________________,', eng: data.Name4 || '________________,' },
    { fil: 'mula', eng: 'from' },
    { fil: 'sa', eng: '' },
    { fil: data.Address || '________________,', eng: data.Address || '________________,' },
    { fil: 'itinalaga', eng: 'appointed' },
    { fil: 'bilang', eng: 'as' },
    {
      fil: data.NewDesignation || '________________,',
      eng: data.NewDesignation || '________________,',
    },
    { fil: 'ay', eng: '' },
    { fil: 'taimtim', eng: 'solemnly' },
    { fil: 'na', eng: '' },
    { fil: 'nanunumpa,', eng: 'swear,' },
    { fil: 'na', eng: 'that' },
    { fil: 'aking', eng: 'I' },
    { fil: 'tutuparin,', eng: 'will fulfill,' },
    { fil: 'nang', eng: 'with' },
    { fil: 'buong', eng: 'utmost' },
    { fil: 'husay,', eng: 'skill,' },
    { fil: 'at', eng: 'and' },
    { fil: 'katapatan,', eng: 'honesty,' },
    { fil: 'ang', eng: 'the' },
    { fil: 'mga', eng: '' },
    { fil: 'tungkulin,', eng: 'duties,' },
    { fil: 'na', eng: 'that' },
    { fil: 'iniatang', eng: 'entrusted' },
    { fil: 'sa', eng: 'to' },
    { fil: 'akin,', eng: 'me,' },
    { fil: 'bilang', eng: 'as' },
    {
      fil: data.NewDesignation || '________________,',
      eng: data.NewDesignation || '________________,',
    },
    { fil: 'ng', eng: 'of' },
    { fil: data.NewOffice || '________________,', eng: data.NewOffice || '________________,' },
    { fil: 'sa', eng: 'under' },
    { fil: 'ilalim', eng: '' },
    { fil: 'ng', eng: 'the' },
    { fil: 'Republika,', eng: 'Republic,' },
    { fil: 'ng', eng: 'of' },
    { fil: 'Pilipinas.', eng: 'Philippines.' },
    { fil: 'Itataguyod', eng: 'I will uphold' },
    { fil: 'ko,', eng: '' },
    { fil: 'at', eng: 'and' },
    { fil: 'ipagtatanggol,', eng: 'defend,' },
    { fil: 'ang', eng: 'the' },
    { fil: 'Saligang', eng: '' },
    { fil: 'Batas,', eng: 'Constitution,' },
    { fil: 'ng', eng: 'of' },
    { fil: 'Pilipinas;', eng: 'Philippines;' },
    { fil: 'tunay', eng: 'true' },
    { fil: 'na', eng: '' },
    { fil: 'mananalig,', eng: 'faith,' },
    { fil: 'at', eng: 'and' },
    { fil: 'tatalima', eng: 'allegiance' },
    { fil: 'rito;', eng: 'thereto;' },
    { fil: 'susundin', eng: 'I will obey' },
    { fil: 'ko,', eng: '' },
    { fil: 'ang', eng: 'the' },
    { fil: 'mga', eng: '' },
    { fil: 'batas,', eng: 'laws,' },
    { fil: 'kautusan,', eng: 'orders,' },
    { fil: 'at', eng: 'and' },
    { fil: 'dekretong,', eng: 'decrees,' },
    { fil: 'ipinatutupad', eng: 'promulgated' },
    { fil: 'ng', eng: 'by' },
    { fil: 'awtoridad;', eng: 'authorities;' },
    { fil: 'at', eng: 'and' },
    { fil: 'kusa', eng: 'voluntarily' },
    { fil: 'kong', eng: 'I' },
    { fil: 'babalikatin,', eng: 'assume,' },
    { fil: 'ang', eng: 'this' },
    { fil: 'panunumpang', eng: '' },
    { fil: 'ito,', eng: 'obligation,' },
    { fil: 'ng', eng: '' },
    { fil: 'walang', eng: 'without' },
    { fil: 'pasubali.', eng: 'reservation.' },
    { fil: 'Kasihan', eng: 'help' },
    { fil: 'nawa', eng: 'may' },
    { fil: 'ako', eng: 'me' },
    { fil: 'ng', eng: '' },
    { fil: 'Diyos.', eng: 'God.' },
  ];

  const now = new Date();
  const oathDay = now.getDate();
  const oathMonth = now.toLocaleString('default', { month: 'long' });
  const oathYear = now.getFullYear();
</script>

<style scoped>
  .certification-report-container {
    width: 8.5in;
    min-height: 11in;
    background-color: white;
    font-family: Arial, sans-serif;
    color: black;
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
    font-size: 14px;
    line-height: 1.6;
  }
  .oath-content {
    text-align: justify;
    margin-bottom: 1.5em;
    line-height: 2;
  }
  .word-pair {
    display: inline-block;
    text-align: justify;
    vertical-align: top;
    text-align: center;
    min-width: 50px;
  }
  .filipino {
    display: block;
    text-align: justify;
    font-weight: bold;
    font-size: 14px;
    color: #2c3e50;
  }
  .english {
    display: block;
    text-align: justify;
    font-style: italic;
    color: #7f8c8d;
    font-size: 12px;
  }
  .signature-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 60px;
    margin-bottom: 40px;
  }
  .left-signature-container {
    margin-top: 30px;
  }
  .stamp {
    margin-bottom: 5px;
  }
  .double {
    width: 100%;
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
    text-transform: uppercase;
    text-align: center;
  }
  .signature-title {
    text-align: center;
  }
  .indented {
    text-indent: 2em;
  }
</style>
