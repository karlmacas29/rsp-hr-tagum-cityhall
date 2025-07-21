<template>
  <div class="certification-page">
    <div class="certification-section">
      <div class="certification-box first-box">
        <h3 class="certification-title">Certification</h3>

        <p class="certification-text">
          This is to certify that all requirements and supporting papers pursuant to CSC MC No.
          <span class="underline">24, s. 2017, as amended</span>
          have been complied with, reviewed and found to be in order.
        </p>
        <p class="certification-text">
          The position was published at
          <span class="underline">CSC Website</span>
          from
          <span class="underline">November 22, 2024</span>
          to
          <span class="underline">December 7, 2024</span>
          and posted in
          <span class="underline">3 conspicuous places</span>
          from
          <span class="underline">November 22, 2024</span>
          to
          <span class="underline">December 7, 2024</span>
          in consonance with RA No. 7041. The assessment by the Human Resource Merit Promotion and
          Selection Board (HRMP&SB) started on
          <span class="underline">December 13, 2024</span>
        </p>

        <div class="signature-container">
          <div class="signature">
            <div class="signature-line">JANYLENE A. PALERMO, MM</div>
            <div class="signature-title">City Human Resource Mgt. Officer</div>
          </div>
        </div>
      </div>

      <div class="certification-box second-box">
        <h3 class="certification-title">Certification</h3>

        <p class="certification-text">
          This is to certify that the appointee has been screened and found qualified by the
          majority of the Human Resource Merit Promotion and Selection Board (HRMP&SB) during the
          deliberation held on
          <span class="underline">December 27, 2024</span>
          .
        </p>

        <div class="signature-container">
          <div class="signature">
            <div class="signature-line">EDGAR C. DE GUZMAN</div>
            <div class="signature-title">
              City Administrator
              <br />
              Authorized Representative of the City Mayor
              <br />
              Chairperson
            </div>
          </div>
        </div>
      </div>

      <div class="notation-section">
        <h3 class="notation-title">CSC/HRMO Notation</h3>

        <div class="notation-table">
          <table>
            <tr>
              <td colspan="2" class="table-header">ACTION ON APPOINTMENTS</td>
              <td class="table-header">Recorded by</td>
            </tr>
            <tr>
              <td colspan="2" class="checkbox-row">
                <input type="checkbox" />
                Validated per RAI for the month of
                <span class="form-field"></span>
              </td>
              <td rowspan="2"></td>
            </tr>
            <tr>
              <td colspan="2" class="checkbox-row">
                <input type="checkbox" />
                Invalidated per CSCRO/FO letter dated
                <span class="form-field"></span>
              </td>
            </tr>
            <tr>
              <td class="checkbox-row">
                <input type="checkbox" />
                Appeal
              </td>
              <td class="table-header">DATE FILED</td>
              <td class="table-header">STATUS</td>
            </tr>
            <tr>
              <td class="checkbox-indent">
                <input type="checkbox" />
                CSCRO/ CSC-Commission
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="checkbox-row">
                <input type="checkbox" />
                Petition for Review
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="checkbox-indent">
                <input type="checkbox" />
                CSC-Commission
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="checkbox-indent">
                <input type="checkbox" />
                Court of Appeals
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="checkbox-indent">
                <input type="checkbox" />
                Supreme Court
              </td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="acknowledgement-section">
        <table>
          <tr>
            <td class="copies-column">
              Original Copy - for the Appointee
              <br />
              Original Copy - for the Civil Service Commission
              <br />
              Original Copy - for the Agency
            </td>
            <td class="acknowledgement-column">
              <h3 class="acknowledgement-title">Acknowledgement</h3>
              <p class="acknowledgement-text">
                Received original/photocopy of appointment on
                <span class="form-field"></span>
              </p>
              <div class="appointee-signature">
                <div class="signature-line"></div>
                <div class="signature-title">Appointee</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
  // No props or data needed for this static certification page
</script>

<style scoped>
  .certification-page {
    width: 8.5in;
    min-height: 11in;
    padding: 0.6in;
    padding-top: 0.6in;
    font-family: 'Consolas', 'Courier New', Courier, monospace;
    font-size: 12pt;
    color: black;
    background: white;
    box-sizing: border-box;
  }

  .certification-section {
    width: 100%;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
    position: relative;
  }

  .certification-box,
  .notation-section,
  .acknowledgement-section {
    width: 100%;
    height: 100%;
    border: 2px solid black;
    box-shadow:
      inset 0 0 0 20px #c0c0c0,
      inset 0 0 0 22px black;
    padding: 0.5in;
    box-sizing: border-box;
    position: relative;
    min-height: calc(auto);
  }

  /* Modified styles for certification boxes to create seamless borders */
  .certification-box.first-box {
    margin-bottom: 0; /* Remove bottom margin */
    border-bottom: none; /* Remove bottom border */
    box-shadow:
      inset 0 0 0 20px #c0c0c0,
      inset 0 0 0 22px black,
      inset 0 -22px 0 0 #c0c0c0; /* Special shadow for bottom */
  }

  .certification-box.second-box {
    margin-top: 0; /* Negative margin to overlap borders */
    border-top: none;
    box-shadow:
      inset 0 0 0 20px #c0c0c0,
      inset 0 0 0 22px black,
      inset 0 22px 0 0 #c0c0c0; /* Special shadow for top */
  }

  .notation-section,
  .acknowledgement-section {
    margin-top: 15px;
  }

  .certification-title,
  .notation-title {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 15px;
  }

  .acknowledgement-title {
    text-align: center;
    font-size: 13pt;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 15px;
  }

  .certification-text {
    text-align: justify;
    text-indent: 2em;
    line-height: 1.5;
    font-size: 11pt;
  }

  .signature-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  .signature {
    display: inline-block;
    text-align: center;
    width: 380px;
  }

  .signature-line {
    border-top: 1px solid #000;
    display: inline-block;
    min-width: 300px;
    padding-top: 5px;
    font-weight: bold;
  }

  .signature-title {
    font-size: 10pt;
    margin-top: 5px;
  }

  .underline {
    text-decoration: underline;
    font-weight: bold;
  }

  .notation-section,
  .acknowledgement-section {
    background-color: #f0f0f0;
    padding: 15px;
  }

  .notation-table table {
    width: 90%;
    border-collapse: collapse;
  }

  .notation-table td {
    border: 1px solid #000;
    padding: 8px;
    height: 30px;
  }

  .table-header {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    background-color: #fff;
  }

  .checkbox-row {
    padding-left: 10px;
  }

  .checkbox-indent {
    padding-left: 40px;
  }

  .form-field {
    display: inline-block;
    min-width: 200px;
    border-bottom: 1px solid #000;
  }

  .acknowledgement-section table {
    width: 100%;
    border-collapse: collapse;
  }

  .acknowledgement-section td {
    vertical-align: top;
    padding: 10px;
  }

  .copies-column {
    width: 50%;
    font-size: 10pt;
    line-height: 1.8;
  }

  .acknowledgement-column {
    width: 50%;
    text-align: center;
  }

  .acknowledgement-text {
    text-align: left;
    margin-bottom: 50px;
    font-size: 10pt;
  }

  .appointee-signature .signature-line {
    border-top: 1px solid #000;
    display: inline-block;
    min-width: 200px;
    margin-bottom: 5px;
  }
</style>
