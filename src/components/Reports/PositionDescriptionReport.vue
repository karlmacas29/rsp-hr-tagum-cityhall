<template>
  <div class="position-description-container">
    <!-- First Page -->
    <table class="main-table">
      <tbody>
        <!-- Header and Position Title Row -->
        <tr>
          <td colspan="3" rowspan="2" class="header-cell">
            <div class="header">
              <div class="logo-container">
                <img src="/image.png" alt="Philippine Seal" class="logo" />
              </div>
              <div class="header-text">
                <div>Republic of the Philippines</div>
                <div>POSITION DESCRIPTION FORM</div>
                <div>DBM-CSC Form No. 1</div>
                <div>(Revised Version No. 1, s. 2017)</div>
              </div>
              <div class="logo-container right-logo">
                <img src="/logo.png" alt="City of Tagum Logo" class="logo" />
              </div>
            </div>
          </td>
          <td colspan="3" class="section-header">
            1. POSITION TITLE (as approved by authorized agency) with parenthetical title
          </td>
        </tr>
        <tr>
          <td colspan="3" class="data-cell">COMPUTER PROGRAMMER II</td>
        </tr>

        <!-- Item Number and Salary Grade -->
        <tr>
          <td colspan="3" class="section-header">2. ITEM NUMBER</td>
          <td colspan="3" class="section-header">3. SALARY GRADE</td>
        </tr>
        <tr>
          <td colspan="3" class="data-cell">72</td>
          <td colspan="3" class="data-cell">15</td>
        </tr>

        <!-- Local Government Classification -->
        <tr>
          <td colspan="6" class="section-header">
            4. FOR LOCAL GOVERNMENT POSITION, ENUMERATE GOVERNMENTAL UNIT AND CLASS
          </td>
        </tr>
        <tr>
          <td colspan="6" class="data-cell">
            <div class="checkbox-group-container">
              <!-- First Group: Province, City, Municipality -->
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="province" class="custom-checkbox" />
                  <label for="province">Province</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="city" class="custom-checkbox" checked />
                  <label for="city">City</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="municipality" class="custom-checkbox" />
                  <label for="municipality">Municipality</label>
                </div>
              </div>

              <!-- Second Group: 1st Class, 2nd Class, 3rd Class, 4th Class -->
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="1st-class" class="custom-checkbox" checked />
                  <label for="1st-class">1st Class</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="2nd-class" class="custom-checkbox" />
                  <label for="2nd-class">2nd Class</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="3rd-class" class="custom-checkbox" />
                  <label for="3rd-class">3rd Class</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="4th-class" class="custom-checkbox" />
                  <label for="4th-class">4th Class</label>
                </div>
              </div>

              <!-- Third Group: 5th Class, 6th Class, Special -->
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="5th-class" class="custom-checkbox" />
                  <label for="5th-class">5th Class</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="6th-class" class="custom-checkbox" />
                  <label for="6th-class">6th Class</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="special" class="custom-checkbox" />
                  <label for="special">Special</label>
                </div>
              </div>
            </div>
          </td>
        </tr>

        <!-- Agency and Office -->
        <tr>
          <td colspan="3" class="section-header">5. AGENCY</td>
          <td colspan="3" class="section-header">6. OFFICE</td>
        </tr>
        <tr>
          <td colspan="3" class="data-cell">LOCAL GOVERNMENT UNIT OF TAGUM CITY</td>
          <td colspan="3" class="data-cell">OFFICE OF THE CITY MAYOR</td>
        </tr>

        <!-- Division and Workstation -->
        <tr>
          <td colspan="3" class="section-header">7. DIVISION</td>
          <td colspan="3" class="section-header">8. WORKSTATION / PLACE OF WORK</td>
        </tr>
        <tr>
          <td colspan="3" class="data-cell">RESEARCH AND MANAGEMENT INFORMATION SYSTEM DIVISION</td>
          <td colspan="3" class="data-cell">
            CITY HALL GOVERNMENT CENTER, JV AYALA AVENUE, APOKON, TAGUM CITY
          </td>
        </tr>

        <!-- Appropriation Act and Salary -->
        <tr>
          <td colspan="3" class="section-header">9. PRESENT APPROP ACT</td>
          <td colspan="3" class="section-header">10. PREVIOUS APPROP ACT</td>
        </tr>
        <tr>
          <td colspan="3" class="data-cell">ORDINANCE NO. 06, SERIES 2018</td>
          <td colspan="3" class="data-cell">NONE</td>
        </tr>
        <tr>
          <td colspan="3" class="section-header">11. SALARY AUTHORIZED</td>
          <td colspan="3" class="section-header">12. OTHER COMPENSATION</td>
        </tr>
        <tr>
          <td colspan="3" class="data-cell">30,531.00 / mo.</td>
          <td colspan="3" class="data-cell">PERA - 2,000.00 / mo.</td>
        </tr>

        <!-- Supervision -->
        <tr>
          <td colspan="3" class="section-header">13. POSITION TITLE OF IMMEDIATE SUPERVISOR</td>
          <td colspan="3" class="section-header">14. POSITION TITLE OF NEXT HIGHER SUPERVISOR</td>
        </tr>
        <tr>
          <td colspan="3" class="data-cell">INFORMATION SYSTEMS ANALYST III</td>
          <td colspan="3" class="data-cell">DEVELOPMENT MANAGEMENT OFFICER IV</td>
        </tr>

        <!-- Directly Supervised -->
        <tr>
          <td colspan="6" class="section-header">
            15. POSITION TITLE, AND ITEM OF THOSE DIRECTLY SUPERVISED
          </td>
        </tr>
        <tr>
          <td colspan="6" class="data-cell small-text supervised-note">
            (If more than seven (7) list only by their item numbers and titles)
          </td>
        </tr>
        <tr>
          <td colspan="3" class="sub-header">POSITION TITLE</td>
          <td colspan="3" class="sub-header">ITEM NUMBER</td>
        </tr>
        <tr>
          <td colspan="3" class="data-cell empty-cell large-empty-cell"></td>
          <td colspan="3" class="data-cell empty-cell large-empty-cell"></td>
        </tr>

        <!-- Equipment Used -->
        <tr>
          <td colspan="6" class="section-header">
            16. MACHINE, EQUIPMENT, TOOLS, ETC., USED REGULARLY IN PERFORMANCE OF WORK
          </td>
        </tr>
        <tr>
          <td colspan="6" class="data-cell">
            COMPUTER, TELEPHONE, MOBILE PHONE, TABLE, CHAIRS, ETC.
          </td>
        </tr>

        <!-- Contacts/Clients -->
        <tr>
          <td colspan="6" class="section-header">17. CONTACTS / CLIENTS / STAKEHOLDERS</td>
        </tr>
        <tr>
          <td colspan="6" class="no-padding">
            <table class="inner-table">
              <tbody>
                <tr>
                  <td class="contact-option">17a. Internal</td>
                  <td class="contact-option">Occasional</td>
                  <td class="contact-option">Frequent</td>
                  <td class="contact-option">17b. External</td>
                  <td class="contact-option">Occasional</td>
                  <td class="contact-option">Frequent</td>
                </tr>
                <tr>
                  <td>Executive / Managerial</td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb1" class="custom-checkbox" checked />
                    </div>
                  </td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb2" class="custom-checkbox" />
                    </div>
                  </td>
                  <td>General Public</td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb3" class="custom-checkbox" checked />
                    </div>
                  </td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb4" class="custom-checkbox" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Supervisors</td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb5" class="custom-checkbox" />
                    </div>
                  </td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb6" class="custom-checkbox" checked />
                    </div>
                  </td>
                  <td>Other Agencies</td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb7" class="custom-checkbox" checked />
                    </div>
                  </td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb8" class="custom-checkbox" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Non-Supervisors</td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb9" class="custom-checkbox" />
                    </div>
                  </td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb10" class="custom-checkbox" checked />
                    </div>
                  </td>
                  <td>Others (please Specify):</td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb11" class="custom-checkbox" />
                    </div>
                  </td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb12" class="custom-checkbox" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Staff</td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb13" class="custom-checkbox" />
                    </div>
                  </td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb14" class="custom-checkbox" checked />
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Working Condition -->
        <tr>
          <td colspan="6" class="section-header">18. WORKING CONDITION</td>
        </tr>
        <tr>
          <td colspan="6" class="no-padding">
            <table class="inner-table">
              <tbody>
                <tr>
                  <td width="20%">Office Work</td>
                  <td width="10%" class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb15" class="custom-checkbox" />
                    </div>
                  </td>
                  <td width="10%" class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb16" class="custom-checkbox" checked />
                    </div>
                  </td>
                  <td width="20%">Others (please Specify)</td>
                  <td width="40%"></td>
                </tr>
                <tr>
                  <td>Field Work</td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb17" class="custom-checkbox" />
                    </div>
                  </td>
                  <td class="checkbox-cell">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" id="cb18" class="custom-checkbox" checked />
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Brief Description -->
        <tr>
          <td colspan="6" class="section-header">
            19. BRIEF DESCRIPTION OF THE GENERAL FUNCTION OF THE UNIT OR SECTION
          </td>
        </tr>
        <tr>
          <td colspan="6" class="data-cell description-cell">
            Review, evaluation, program customization, development and monitoring of existing and
            upcoming information technology systems assigned to local government offices, barangay
            offices and other government offices within the jurisdiction of this city with proper
            gathering, categorization, assimilation, storage and responsible communication and
            dissemination of information. Also, oversee the Internal Audit Division and City
            Information Division operations.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Page Break -->
    <div class="page-break"></div>

    <!-- Second Page -->
    <table class="main-table">
      <tbody>
        <!-- Job Summary -->
        <tr>
          <td colspan="6" class="section-header">
            20. BRIEF DESCRIPTION OF THE GENERAL FUNCTION OF THE POSITION (Job Summary)
          </td>
        </tr>
        <tr>
          <td colspan="6" class="data-cell description-cell large-cell"></td>
        </tr>

        <!-- Qualification Standards -->
        <tr>
          <td colspan="6" class="section-header">21. QUALIFICATION STANDARDS</td>
        </tr>

        <!-- Create a separate full-width table for qualification standards -->
        <tr>
          <td colspan="6" class="no-padding">
            <table class="qualifications-table">
              <tbody>
                <tr>
                  <td class="section-header">21A. EDUCATION</td>
                  <td class="section-header">21B. EXPERIENCE</td>
                  <td class="section-header">21C. TRAINING</td>
                  <td class="section-header">21D. ELIGIBILITY</td>
                </tr>
                <tr>
                  <td class="data-cell large-empty-cell"></td>
                  <td class="data-cell large-empty-cell"></td>
                  <td class="data-cell large-empty-cell"></td>
                  <td class="data-cell large-empty-cell"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Core Competencies -->
        <tr>
          <td colspan="5" class="section-header">21e. Core Competencies</td>
          <td colspan="1" class="section-header">Competency Level</td>
        </tr>
        <tr>
          <td colspan="5" class="data-cell"></td>
          <td colspan="1" class="data-cell"></td>
        </tr>

        <!-- Leadership Competencies -->
        <tr>
          <td colspan="5" class="section-header">21f. Leadership Competencies</td>
          <td colspan="1" class="section-header">Competency Level</td>
        </tr>
        <tr>
          <td colspan="5" class="data-cell"></td>
          <td colspan="1" class="data-cell"></td>
        </tr>

        <!-- Statement of Duties and Responsibilities -->
        <tr>
          <td colspan="5" class="section-header">
            22. STATEMENT OF DUTIES AND RESPONSIBILITIES (Technical Competencies)
          </td>
          <td colspan="1" class="section-header">Competency Level</td>
        </tr>
        <tr>
          <td colspan="2" class="data-cell">Percentage of Working Time</td>
          <td colspan="3" class="data-cell">(State the duties and responsibilities here.)</td>
          <td colspan="1" rowspan="2" class="data-cell"></td>
        </tr>
        <tr>
          <td colspan="2" class="data-cell"></td>
          <td colspan="3" class="data-cell"></td>
        </tr>

        <!-- Acknowledgement and Acceptance -->
        <tr>
          <td colspan="6" class="section-header">23. ACKNOWLEDGEMENT AND ACCEPTANCE:</td>
        </tr>
        <tr>
          <td colspan="6" class="data-cell acceptance-text">
            I have received a copy of this position description. It has been discussed with me and I
            have freely chosen to comply with the performance and behavior/conduct expectations
            contained herein.
          </td>
        </tr>
        <tr>
          <td colspan="3" class="signature-cell">
            <div class="signature-line">
              <div class="signature">JOGRAD M. MAHUSAY &nbsp;&nbsp;&nbsp; 08/02/2024</div>
              <div class="signature-label">Employee's Name, Date and Signature</div>
            </div>
          </td>
          <td colspan="3" class="signature-cell">
            <div class="signature-line">
              <div class="signature">08/01/2024</div>
              <div class="signature-label">Supervisor's Name, Date and Signature</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'PositionDescriptionForm',
  };
</script>

<style scoped>
  .position-description-container {
    width: 8.5in;
    margin: 0 auto;
    padding: 0.5in;
    font-family: Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.3;
    box-sizing: border-box;
    overflow: visible;
    letter-spacing: 0.5px;
  }

  .page-break {
    page-break-before: always;
    break-before: page;
    height: 0;
    display: block;
    margin-bottom: 0.5in;
  }

  .main-table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid #000;
    table-layout: fixed;
    margin-bottom: 20px;
  }

  .main-table td,
  .main-table th {
    border: 1px solid #000;
    padding: 6px;
  }

  /* Qualification standards table */
  .qualifications-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .qualifications-table td {
    width: 25%; /* Equal width for all 4 columns */
    border: 1px solid #000;
    padding: 6px;
  }

  .header-cell {
    padding: 0;
    border-bottom: 2px solid #000;
    width: 50%;
  }

  .header {
    display: flex;
    align-items: center;
    padding: 10px;
    height: 100%;
  }

  .logo-container {
    width: 70px;
    flex-shrink: 0;
  }

  .logo {
    width: 60px;
    height: auto;
  }

  .header-text {
    flex-grow: 1;
    font-size: 8pt;
    text-align: center;
    font-weight: bold;
  }

  .form-title {
    font-size: 14pt;
    margin: 5px 0;
    font-weight: bold;
  }

  .right-logo {
    text-align: right;
  }

  .section-header {
    background-color: #ccc;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 8pt;
    padding: 4px 6px;
    letter-spacing: 0.5px;
  }

  .sub-header {
    background-color: #f0f0f0;
    font-weight: bold;
    text-align: center;
    font-size: 8pt;
  }

  .data-cell {
    vertical-align: top;
    padding: 6px;
    font-weight: normal;
  }

  .empty-cell {
    height: 50px;
  }

  .large-empty-cell {
    min-height: 150px;
    height: 150px;
  }

  .large-cell {
    min-height: 400px;
    height: 400px;
  }

  tr:has(td:nth-child(1):empty) {
    height: 40px;
  }

  tr:has(.section-header:contains('21e. Core Competencies')) + tr {
    height: 40px;
  }

  tr:has(.sub-header:contains('21f. Leadership Competencies')) + tr {
    height: 40px;
  }

  tr:has(.data-cell:contains('Percentage of Working Time')) + tr {
    height: 40px;
  }

  .supervised-note {
    height: auto;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .checkbox-group-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    width: 30%;
    padding: 5px 0;
  }

  .checkbox-item {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    font-size: 9pt;
  }

  .checkbox-item input[type='checkbox'] {
    margin-right: 10px;
  }

  .checkbox-item label {
    letter-spacing: 0.5px;
    font-weight: normal;
  }

  .checkbox-cell {
    text-align: center;
    vertical-align: middle;
  }

  .checkbox-wrapper {
    display: inline-block;
    position: relative;
    width: 14px;
    height: 14px;
  }

  .custom-checkbox {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border: 1px solid #000;
    border-radius: 0;
    background-color: #fff;
    margin: 0;
    padding: 0;
    display: block;
    box-sizing: border-box;
  }

  input[type='checkbox'].custom-checkbox:checked {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath d='M 3 7 L 6 10 L 11 4' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 12px;
  }

  .small-text {
    font-style: italic;
    font-size: 8pt;
    font-weight: normal; /* Already normal */
    text-align: center;
  }

  .inner-table {
    width: 100%;
    border-collapse: collapse;
  }

  .contact-option {
    background-color: #ccc;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    font-size: 8pt;
    padding: 4px 6px;
  }

  .inner-table td {
    border: 1px solid #999;
    padding: 4px;
    font-size: 8pt;
    letter-spacing: 0.5px;
    font-weight: normal;
  }

  .no-padding {
    padding: 0;
  }

  .description-cell {
    text-align: justify;
    min-height: 150px;
    font-weight: normal;
    line-height: 1.4;
    letter-spacing: 0.5px;
  }

  .acceptance-text {
    text-align: justify;
    padding: 10px;
    line-height: 1.4;
  }

  .signature-cell {
    height: 80px;
    vertical-align: bottom;
    padding-bottom: 10px;
  }

  .signature-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .signature {
    border-bottom: 1px solid #000;
    width: 100%;
    text-align: center;
    padding-bottom: 5px;
    margin-bottom: 5px;
    font-weight: normal;
  }

  .signature-label {
    font-size: 8pt;
    font-weight: bold;
    text-align: center;
    font-weight: normal;
  }

  @media print {
    .position-description-container {
      padding: 0;
    }

    .page-break {
      height: 0;
      page-break-before: always;
      margin: 0;
      border-top: none;
    }
  }
</style>
