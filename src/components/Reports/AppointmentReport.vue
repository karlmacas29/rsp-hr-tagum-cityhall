<template>
  <div class="appointment-form-container">
    <!-- First page - Appointment Form -->
    <div class="appointment-form page">
      <div class="form-content">
        <div class="form-title">
          <div class="cs-form">CS Form No. 33-B</div>
          <div class="revised">Revised 2025</div>
        </div>

        <!-- Added Stamp of Date of Receipts -->
        <div class="stamp-section">
          <div class="stamp-line"></div>
          <div class="stamp-label">Stamp of Date of Receipts</div>
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
            <div class="office">
              <strong>{{ officeTitle }}</strong>
            </div>
          </div>
          <div class="right-logo">
            <img src="/logo.png" alt="City of Tagum Logo" />
          </div>
        </div>

        <div class="body">
          <p>
            {{ data.Sex === 'MALE' ? 'MR.' : 'MS.' }}:
            <strong class="underline">{{ data.Name4 || '(Name)' }}</strong>
          </p>

          <p style="text-indent: 2em">
            You are hereby appointed as
            <ruby>
              <strong class="underline">
                <span style="color: white">*</span>
                {{ data.NewDesignation || '(Position Title)' }}
              </strong>
              <rt>
                <span style="color: white">*</span>
                (Position
                <span style="color: white">*</span>
                Title)
                <span style="color: white">*</span>
              </rt>
            </ruby>
            (SG/Step
            <strong class="underline">
              <span style="color: white">*</span>
              {{ data.SG || '(SG)' }}
              <span style="color: white">*</span>
              /
              <span style="color: white">*</span>
              {{ data.Step || '(Step)' }}
            </strong>
            )
            <span style="color: white">*</span>
            under
            <ruby>
              <strong class="underline">
                <span style="color: white">*</span>
                {{ data.Status || '(Permanent, Temporary, etc.)' }}
                <span style="color: white">*</span>
              </strong>
              <rt>
                <span style="color: white">*</span>
                (Permanent,
                <span style="color: white">*</span>
                Temporary,
                <span style="color: white">*</span>
                etc.)
              </rt>
            </ruby>
            status at the
            <ruby>
              <strong class="underline">
                <span style="color: white">*</span>
                {{ data.NewOffice || '(Office/Department/Unit)' }}
                <span style="color: white">*</span>
              </strong>
              <rt>
                <span style="color: white">*</span>
                (Office/Department/Unit)
              </rt>
            </ruby>
            with a compensation rate of
            <strong class="underline">
              {{ formatSalaryWords(data.MRate) || '(Salary in Words)' }}
            </strong>
            (
            <strong class="underline">{{ formatSalaryAmount(data.MRate) || '(Amount)' }}</strong>
            ) pesos per month.
          </p>

          <p style="text-indent: 2em">
            The nature of this appointment is
            <ruby>
              <strong class="underline">
                <span style="color: white">*</span>
                {{ data.Renew || '(Original, Promotion, etc.)' }}
                <span style="color: white">*</span>
              </strong>
              <rt>
                <span style="color: white">*</span>
                (Original,
                <span style="color: white">*</span>
                Promotion,
                <span style="color: white">*</span>
                etc.)
              </rt>
            </ruby>
            vice
            <strong class="underline">{{ data.vicecause || 'N/A' }}</strong>
            , who
            <ruby>
              <strong class="underline">
                <span style="color: white">*</span>
                {{ data.vicecause || 'N/A' }}
                <span style="color: white">*</span>
              </strong>
              <rt>
                <span style="color: white">*</span>
                (Transferred,
                <span style="color: white">*</span>
                Retired,
                <span style="color: white">*</span>
                etc.)
              </rt>
            </ruby>
            <span style="color: white">*</span>
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
              <strong class="signature-name">{{ signatoryName }}</strong>
            </div>
            <div class="signature-title">{{ signatoryTitle }}</div>
            <br />
            <div class="signing-date-container">
              <strong class="signing-date">{{ formattedSigningDate || '' }}</strong>
            </div>
            <div class="signing-label">Date of Signing</div>
          </div>
        </div>

        <div class="footer-note">
          <p class="footer">
            Accredited/Deregulated Pursuant to
            <br />
            <span>CSC Resolution No.</span>
            <strong class="underline">1701688,</strong>
            , s.
            <strong class="underline">2017</strong>
            <br />
            Dated
            <strong class="underline">December 28, 2017</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Second page - Certification Page -->
    <div class="certification-page page">
      <div class="certification-section">
        <!-- Single gray container for both certifications -->
        <div class="certificates-container">
          <!-- First certification with black border -->
          <div class="certificate-box">
            <h3 class="certification-title">Certification</h3>

            <p class="certification-text">
              This is to certify that all requirements and supporting papers pursuant to the
              <span>
                <b>2025 Omnibus Rules on Appointments and Other Human Resource Actions,</b>
              </span>
              have been complied with, reviewed and found to be in order.
            </p>
            <p class="certification-text">
              The position was published at
              <span class="underline">{{ publishedAt }}</span>
              from
              <span class="underline">{{ publishStartDate }}</span>
              to
              <span class="underline">{{ publishEndDate }}</span>
              and posted in three (3) conspicuous places from
              <span class="underline">{{ postStartDate }}</span>
              to
              <span class="underline">{{ postEndDate }}</span>
              in consonance with Republic Act No. 7041. The assessment by the Human Resource Merit
              Promotion and Selection Board (HRMPSB) started on
              <span class="underline">{{ assessmentDate }}</span>
              .
            </p>

            <div class="signature-container">
              <div class="signature">
                <div class="signature-name-container">
                  <strong class="signature-name">JANYLENE A. PALERMO, MM</strong>
                </div>
                <div class="cert-signature-title">City Human Resource Mgt. Officer</div>
              </div>
            </div>
          </div>

          <!-- Second certification with black border -->
          <div class="certificate-box">
            <h3 class="certification-title">Certification</h3>

            <p class="certification-text">
              This is to certify that the appointee has been screened and found qualified by at
              least the majority of the HRMPSB/Placement Committee during the deliberation held on
              <span class="underline">December 27, 2024</span>
              .
            </p>

            <div class="signature-container">
              <div class="signature">
                <div class="signature-name-container">
                  <strong class="signature-name">EDGAR C. DE GUZMAN</strong>
                </div>
                <div class="cert-signature-title">
                  City Administrator
                  <br />
                  Authorized Representative of the City Mayor
                  <br />
                  Chairperson
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notation section with title in gray area -->
        <div class="notation-container">
          <h3 class="notation-title">CSC/HRMO Notation</h3>
          <div class="notation-content">
            <div class="notation-table">
              <table>
                <tbody>
                  <tr>
                    <td colspan="3" class="table-header">ACTION ON APPOINTMENTS</td>
                    <td class="table-header">Recorded by</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="checkbox-row">
                      <input type="checkbox" class="custom-checkbox" />
                      Validated per RAI for the month of
                      <span class="form-field"></span>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="3" class="checkbox-row">
                      <input type="checkbox" class="custom-checkbox" />
                      Invalidated per CSCRO/FO letter dated
                      <span class="form-field"></span>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="checkbox-row">
                      <input type="checkbox" class="custom-checkbox" />
                      <span class="bold-text">Appeal</span>
                    </td>
                    <td class="table-header">DATE FILED</td>
                    <td class="table-header">STATUS</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="checkbox-deeper-indent">
                      <div class="indent-wrapper">
                        <input type="checkbox" class="custom-checkbox" />
                        CSCRO/ CSC-Commission
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="checkbox-row">
                      <input type="checkbox" class="custom-checkbox" />
                      <span class="bold-text">Petition for Review</span>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="checkbox-deeper-indent">
                      <div class="indent-wrapper">
                        <input type="checkbox" class="custom-checkbox" />
                        CSC-Commission
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="checkbox-deeper-indent">
                      <div class="indent-wrapper">
                        <input type="checkbox" class="custom-checkbox" />
                        Court of Appeals
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="checkbox-deeper-indent">
                      <div class="indent-wrapper">
                        <input type="checkbox" class="custom-checkbox" />
                        Supreme Court
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Acknowledgement section -->
        <div class="acknowledgement-container">
          <div class="acknowledgement-boxes">
            <div class="left-box">
              <p class="copy-text">
                Original Copy - for the Agency
                <br />
                Certified True Copy - for the Civil Service Commission
                <br />
                Certified True Copy - for the Appointee
              </p>
            </div>
            <div class="right-box">
              <h3 class="acknowledgement-title">Acknowledgement</h3>
              <p class="acknowledgement-text">
                Received original of appointment on
                <span class="form-field"></span>
              </p>
              <div class="appointee-signature">
                <div class="signature-line"></div>
                <div class="appointee-signature-title">Appointee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  // Computed properties for office and signatory
  const officeTitle = computed(() => {
    if (
      props.data.NewOffice?.includes('VICE MAYOR') ||
      props.data.NewOffice?.includes('SANGGUNIANG PANLUNGSOD') ||
      props.data.NewOffice?.includes('SANGGUNIAN')
    ) {
      return 'OFFICE OF THE VICE MAYOR';
    } else {
      return 'OFFICE OF THE CITY MAYOR';
    }
  });

  const signatoryName = computed(() => {
    if (
      props.data.NewOffice?.includes('VICE MAYOR') ||
      props.data.NewOffice?.includes('SANGGUNIANG PANLUNGSOD') ||
      props.data.NewOffice?.includes('SANGGUNIAN')
    ) {
      return props.data.vicemayor || 'VICE MAYOR NAME';
    } else {
      return props.data.mayor || 'REY T. UY';
    }
  });

  const signatoryTitle = computed(() => {
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

  // Computed properties for certification dates based on status
  const isCoterminousOrElective = computed(() => {
    return props.data.Status === 'CO-TERMINOUS' || props.data.Status === 'Elective';
  });

  const publishedAt = computed(() => {
    return isCoterminousOrElective.value ? 'N/A' : 'CSC Website';
  });

  const publishStartDate = computed(() => {
    return isCoterminousOrElective.value ? 'N/A' : formatDate(props.data.post_date);
  });

  const publishEndDate = computed(() => {
    return isCoterminousOrElective.value ? 'N/A' : formatDate(props.data.end_date);
  });

  const postStartDate = computed(() => {
    return isCoterminousOrElective.value ? 'N/A' : formatDate(props.data.post_date);
  });

  const postEndDate = computed(() => {
    return isCoterminousOrElective.value ? 'N/A' : formatDate(props.data.end_date);
  });

  const assessmentDate = computed(() => {
    return isCoterminousOrElective.value ? 'N/A' : formatDate(props.data.end_date);
  });

  // Utility Functions
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalaryWords = (amount) => {
    if (!amount) return '';

    const numericAmount = parseFloat(amount);
    const wholeNumber = Math.floor(numericAmount);
    const decimalPart = Math.round((numericAmount - wholeNumber) * 100);

    const convertToWords = (num) => {
      if (num === 0) return 'ZERO';

      const ones = [
        '',
        'ONE',
        'TWO',
        'THREE',
        'FOUR',
        'FIVE',
        'SIX',
        'SEVEN',
        'EIGHT',
        'NINE',
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

    if (decimalPart > 0) {
      result += ' AND ' + convertToWords(decimalPart) + '/100';
    }

    return result;
  };

  const formatSalaryAmount = (amount) => {
    return amount
      ? new Intl.NumberFormat('en-PH', {
          style: 'currency',
          currency: 'PHP',
        }).format(amount)
      : '';
  };

  // Computed Properties
  const formattedSigningDate = computed(() => formatDate(props.data.signingDate));

  console.log('AppointmentReport - received data:', props.data);
</script>

<style scoped>
  /* ... (all your existing styles remain the same) ... */
  /* Global Styles */
  .appointment-form-container {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .page {
    width: 8.5in;
    min-height: 11in;
    font-family: 'Consolas', 'Courier New', Courier, monospace;
    font-size: 12pt;
    color: black;
    background: white;
    box-sizing: border-box;
    page-break-after: always;
    page-break-inside: avoid;
  }

  .page:last-child {
    page-break-after: auto;
  }

  /* Page 1 - Appointment Form Styles */
  .appointment-form {
    padding: 0.3in;
    padding-top: 0.6in;
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

  /* New Stamp Section Styles */
  .stamp-section {
    position: absolute;
    top: 0.5in;
    right: 0.5in;
    text-align: center;
    font-size: 10pt;
    line-height: 1.2;
  }

  .stamp-line {
    width: 200px;
    height: 10px;
    border: none;
    border-bottom: 1px solid black;
    margin-bottom: 5px;
    background-color: white;
  }

  .stamp-label {
    font-weight: bold;
    font-style: italic;
    font-size: 9pt;
    text-align: center;
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
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .body p {
    word-break: break-word;
    overflow-wrap: anywhere;
    hyphens: auto;
  }

  .underline {
    text-decoration: underline;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  /* Ruby and RT styling */
  ruby {
    ruby-position: under;
    line-height: 1.8;
    word-break: break-word;
    overflow-wrap: anywhere;
    display: inline-ruby;
  }

  rt {
    font-size: 8pt;
    font-style: italic;
    color: #666;
    line-height: 1;
    text-align: center;
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
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .signature-name {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 11pt;
    word-break: break-word;
    overflow-wrap: anywhere;
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

  /* Page 2 - Certification Page Styles */
  .certification-page {
    padding: 0.3in;
    padding-bottom: 10px;
    padding-top: 0.3in;
    position: relative;
  }

  .certification-section {
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    position: relative;
  }

  .certificates-container {
    width: 100%;
    background-color: #c0c0c0;
    padding: 20px;
    box-sizing: border-box;
    border: 2px solid black;
    margin-bottom: 20px;
  }

  .certificate-box {
    width: 100%;
    border: 2px solid black;
    background-color: white;
    padding: 0.15in;
    box-sizing: border-box;
    margin-bottom: 20px;
  }

  .certificate-box:last-child {
    margin-bottom: 0;
  }

  .notation-container {
    width: 100%;
    background-color: #c0c0c0;
    border: 2px solid black;
    box-sizing: border-box;
    margin-bottom: 20px;
    position: relative;
    padding-top: 35px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
  }

  .notation-title {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    margin: 0;
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
  }

  .notation-content {
    background-color: #ffff;
    border: 2px solid black;
    padding: 0.15in;
    box-sizing: border-box;
  }

  .custom-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border: 1px solid black;
    background-color: white;
    margin-right: 5px;
    position: relative;
    top: 1px;
  }

  .custom-checkbox:checked {
    background-color: white;
  }

  .custom-checkbox:checked:after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 1px;
    color: black;
    font-size: 10px;
  }

  .bold-text {
    font-weight: bold;
  }

  .acknowledgement-container {
    width: 100%;
    background-color: #c0c0c0;
    border: 2px solid black;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 20px;
  }

  .acknowledgement-boxes {
    display: flex;
    width: 100%;
  }

  .left-box {
    width: 50%;
    background-color: white;
    border: 2px solid black;
    padding: 0.15in;
    padding-top: 40px;
    box-sizing: border-box;
    border-right: none;
  }

  .right-box {
    width: 50%;
    background-color: white;
    border: 2px solid black;
    padding: 0.15in;
    box-sizing: border-box;
  }

  .copy-text {
    font-size: 8pt;
    line-height: 1.5;
  }

  .certification-title {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 10px;
  }

  .acknowledgement-title {
    text-align: center;
    font-size: 13pt;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 10px;
  }

  .certification-text {
    text-align: justify;
    text-indent: 2em;
    line-height: 1.5;
    font-size: 11pt;
    margin-bottom: 8px;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .certification-text .underline {
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .signature-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 5px;
  }

  .signature {
    display: inline-block;
    text-align: center;
    width: 380px;
  }

  .cert-signature-title {
    font-size: 11pt;
    margin-top: 3px;
    line-height: 1.5;
  }

  .notation-table table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
    table-layout: fixed;
  }

  .notation-table td {
    border: 1px solid #000;
    padding: 5px;
    height: 25px;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .table-header {
    text-align: center;
    font-size: 11pt;
    font-weight: bold;
    background-color: #fff;
  }

  .checkbox-row {
    font-size: 10pt;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .indent-wrapper {
    padding-left: 20px;
    display: flex;
    align-items: center;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .checkbox-deeper-indent {
    padding-left: 5px;
    font-size: 10pt;
  }

  .form-field {
    display: inline-block;
    width: 150;
    min-width: 100px;
    border-bottom: 1px solid #000;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .acknowledgement-text {
    text-align: left;
    margin-bottom: 30px;
    font-size: 8pt;
  }

  .appointee-signature {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }

  .appointee-signature .signature-line {
    border-top: 1px solid #000;
    display: block;
    width: 200px;
    margin: 0 auto 3px auto;
  }

  .appointee-signature-title {
    text-align: center;
    font-size: 10pt;
    width: 100%;
  }

  /* Print Styles */
  @media print {
    .page {
      page-break-after: always;
      page-break-inside: avoid;
    }

    .page:last-child {
      page-break-after: auto;
    }

    .appointment-form-container {
      gap: 0;
    }

    /* Ensure text wrapping works in print mode */
    * {
      word-break: break-word !important;
      overflow-wrap: anywhere !important;
      white-space: normal !important;
    }
  }
</style>
