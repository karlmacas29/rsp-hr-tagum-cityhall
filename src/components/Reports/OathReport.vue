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
            <ruby v-if="word.eng" class="word-ruby">
              {{ word.fil }}
              <rt>{{ word.eng }}</rt>
            </ruby>
            <span v-else class="word-only">{{ word.fil }}</span>
            <span class="word-space"></span>
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

  // Word-by-word translation array based on the exact text provided
  const oathWords = [
    { fil: 'Ako', eng: 'I' },
    { fil: 'si ', eng: ' ' },
    { fil: 'HAZEL T. CABAOBAO', eng: '(Name of Appointee)' },
    { fil: 'ng', eng: 'of' },
    { fil: 'TAGUM CITY, DAVAO DEL NORTE', eng: '(Address)' },

    { fil: 'na', eng: 'having been' },
    { fil: 'itinalaga', eng: 'appointed' },
    { fil: 'bilang', eng: 'as' },
    { fil: 'EXECUTIVE ASSISTANT III', eng: 'EXECUTIVE ASSISTANT III' },
    { fil: 'ay', eng: 'hereby' },
    { fil: 'taimtim', eng: 'solemnly' },
    { fil: 'na', eng: '' },
    { fil: 'nanunumpa', eng: 'swear' },
    { fil: 'na', eng: 'that' },
    { fil: 'tutuparin', eng: 'I will faithfully discharge' },
    { fil: 'ko', eng: '' },
    { fil: 'nang', eng: 'to' },
    { fil: 'buong', eng: 'the' },
    { fil: 'husay', eng: 'best' },
    { fil: 'at', eng: 'and' },
    { fil: 'katapatan,', eng: 'ability' },
    { fil: 'sa', eng: 'of' },
    { fil: 'abot', eng: '' },
    { fil: 'ng', eng: 'my' },
    { fil: 'aking', eng: '' },
    { fil: 'kakayahan,', eng: '' },
    { fil: 'ang', eng: 'the' },
    { fil: 'mga', eng: '' },
    { fil: 'katungkulang', eng: 'duties' },
    { fil: 'pinagkatiwalaan', eng: 'of my present position' },
    { fil: 'sa', eng: '' },
    { fil: 'akin', eng: '' },
    { fil: 'at', eng: 'and' },
    { fil: 'sa', eng: 'of' },
    { fil: 'dapat', eng: 'all' },
    { fil: 'gampanan', eng: 'others' },
    { fil: 'sa', eng: 'that' },
    { fil: 'iba', eng: 'I' },
    { fil: 'pang', eng: 'may' },
    { fil: 'pagkakataon', eng: 'hereafter' },
    { fil: 'nito;', eng: 'hold' },
    { fil: 'gagampanan', eng: '' },
    { fil: 'ko', eng: '' },
    { fil: 'sa', eng: 'under' },
    { fil: 'ilalim', eng: '' },
    { fil: 'ng', eng: 'the' },
    { fil: 'Republika', eng: 'Republic' },
    { fil: 'ng', eng: 'of' },
    { fil: 'Pilipinas;', eng: 'the Philippines;' },
    { fil: 'na', eng: 'that' },
    { fil: 'aking', eng: 'I' },
    { fil: 'itataguyod', eng: 'will uphold' },
    { fil: 'at', eng: 'and' },
    { fil: 'ipagtatanggol', eng: 'defend' },
    { fil: 'ang', eng: 'the' },
    { fil: 'Saligang', eng: '' },
    { fil: 'Batas', eng: 'Constitution' },
    { fil: 'ng', eng: 'of' },
    { fil: 'Pilipinas,', eng: 'the Philippines;' },
    { fil: 'na', eng: 'that' },
    { fil: 'tunay', eng: 'true' },
    { fil: 'na', eng: '' },
    { fil: 'magiging', eng: 'will' },
    { fil: 'tapat', eng: 'faith' },
    { fil: 'at', eng: 'and' },
    { fil: 'taimtim', eng: 'allegiance' },
    { fil: 'ako', eng: 'I' },
    { fil: 'rito;', eng: 'to the same;' },
    { fil: 'na', eng: 'that' },
    { fil: 'susundin', eng: 'I will obey' },
    { fil: 'ko', eng: '' },
    { fil: 'ang', eng: 'the' },
    { fil: 'mga', eng: '' },
    { fil: 'batas', eng: 'laws' },
    { fil: 'at', eng: 'and' },
    { fil: 'mga', eng: '' },
    { fil: 'kautusang', eng: 'legal' },
    { fil: 'legal,', eng: 'orders,' },
    { fil: 'at', eng: 'and' },
    { fil: 'mga', eng: '' },
    { fil: 'dekretong', eng: 'decrees' },
    { fil: 'pinairal', eng: 'promulgated' },
    { fil: 'ng', eng: 'by' },
    { fil: 'mga', eng: 'the' },
    { fil: 'sadyang', eng: 'duly' },
    { fil: 'itinakdang', eng: 'constituted' },
    { fil: 'maykapangyarihan', eng: 'authorities' },
    { fil: 'ng', eng: 'of' },
    { fil: 'Republika', eng: 'the Republic' },
    { fil: 'ng', eng: 'of' },
    { fil: 'Pilipinas;', eng: 'the Philippines;' },
    { fil: 'at', eng: 'and' },
    { fil: 'kusa', eng: 'voluntarily' },
    { fil: 'kong', eng: 'I' },
    { fil: 'babalikatin', eng: 'impose' },
    { fil: 'ang', eng: 'this' },
    { fil: 'pananagutang', eng: 'obligation' },
    { fil: 'ito', eng: '' },
    { fil: 'nang', eng: 'upon' },
    { fil: 'walang', eng: 'without' },
    { fil: 'ano', eng: 'mental' },
    { fil: 'mang', eng: '' },
    { fil: 'pasubali', eng: 'reservation' },
    { fil: 'o', eng: 'or' },
    { fil: 'hangaring', eng: 'purpose' },
    { fil: 'umiwas.', eng: 'evasion.' },
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
    line-height: 2.5;
  }
  .word-ruby {
    display: inline ruby;
    text-align: center;
    ruby-align: center;
  }
  .word-only {
    display: inline;
  }
  .word-space {
    display: inline;
    white-space: pre;
  }
  rt {
    font-size: 10px;
    font-style: italic;
    color: #7f8c8d;
    text-transform: lowercase;
    ruby-align: center;
  }
  ruby {
    ruby-position: under;
    text-align: center;
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

  /* Fallback for browsers that don't support ruby positioning */
  @supports not (ruby-position: under) {
    .word-ruby {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    rt {
      order: 2;
      font-size: 10px;
      font-style: italic;
      color: #7f8c8d;
      line-height: 1.2;
    }
    ruby {
      display: inline-flex;
      flex-direction: column;
    }
  }
</style>
