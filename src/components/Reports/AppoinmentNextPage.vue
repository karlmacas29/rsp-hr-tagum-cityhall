<template>
  <div class="certification-page">
    <div class="certification-section">
      <!-- Single gray container for both certifications -->
      <div class="certificates-container">
        <!-- First certification with black border -->
        <div class="certificate-box">
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
              <div class="signature-name-container">
                <strong class="signature-name">JANYLENE A. PALERMO, MM</strong>
              </div>
              <div class="signature-title">City Human Resource Mgt. Officer</div>
            </div>
          </div>
        </div>

        <!-- Second certification with black border -->
        <div class="certificate-box">
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
              <div class="signature-name-container">
                <strong class="signature-name">EDGAR C. DE GUZMAN</strong>
              </div>
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
              Original Copy - for the Appointee
              <br />
              Original Copy - for the Civil Service Commission
              <br />
              Original Copy - for the Agency
            </p>
          </div>
          <div class="right-box">
            <h3 class="acknowledgement-title">Acknowledgement</h3>
            <p class="acknowledgement-text">
              Received original/photocopy of appointment on
              <span class="form-field"></span>
            </p>
            <div class="appointee-signature">
              <div class="signature-line"></div>
              <div class="signature-title">Appointee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
  .certification-page {
    width: 8.5in;
    min-height: 11in;
    padding: 0.3in;
    padding-bottom: 10px;
    padding-top: 1.2in;
    font-family: 'Consolas', 'Courier New', Courier, monospace;
    font-size: 12pt;
    color: black;
    background: white;
    box-sizing: border-box;
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
    font-size: 11pt;
    margin-top: 3px;
    line-height: 1.5;
  }

  .underline {
    text-decoration: underline;
    font-weight: bold;
  }

  .notation-table table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
  }

  .notation-table td {
    border: 1px solid #000;
    padding: 5px;
    height: 25px;
  }

  .table-header {
    text-align: center;
    font-size: 11pt;
    font-weight: bold;
    background-color: #fff;
  }

  .checkbox-row {
    padding-left: 5px;
    font-size: 10pt;
  }

  .checkbox-indent {
    padding-left: 25px;
    font-size: 10pt;
  }

  .checkbox-deep-indent {
    padding-left: 40px;
    font-size: 10pt;
  }

  .indent-wrapper {
    padding-left: 40px;
    display: flex;
    align-items: center;
  }

  .checkbox-deeper-indent {
    padding-left: 5px;
    font-size: 10pt;
  }

  .form-field {
    display: inline-block;
    min-width: 200px;
    border-bottom: 1px solid #000;
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

  .appointee-signature .signature-title {
    text-align: center;
    font-size: 10pt;
    width: 100%;
  }
</style>
