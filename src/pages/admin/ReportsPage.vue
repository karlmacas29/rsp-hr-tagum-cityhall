<template>
  <q-page class="q-pa-md">
    <!-- Page Header -->
    <div class="column items-start justify-center q-mb-md">
      <h5 class="text-h5 q-ma-none"><b>Rater Management</b></h5>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs class="q-ma-none">
          <template v-slot:separator>
            <q-icon size="1.2em" name="arrow_forward" />
          </template>
          <q-breadcrumbs-el icon="assignment_ind" label="Rater Management" />
          <q-breadcrumbs-el icon="assessment" label="Reports" />
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Reports Table -->
    <div>
      <q-table
        :rows="reports"
        :columns="columns"
        row-key="id"
        class="reports-table"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              round
              dense
              color="primary"
              icon="edit"
              size="md"
              @click="openReportModal(props.row)"
            >
              <q-tooltip>Generate Report</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Report Generation Modal -->
    <q-dialog v-model="reportModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Generate {{ selectedReport.name }} Report</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <q-select
              v-model="selectedOffice"
              :options="offices"
              label="Select Office"
              outlined
              map-options
              emit-value
              option-label="name"
              option-value="id"
              @update:model-value="selectedEmployee = null"
            />
          </div>
          <div class="q-mb-md">
            <q-select
              v-model="selectedEmployee"
              :options="filteredEmployees"
              label="Select Employee"
              outlined
              map-options
              emit-value
              option-label="name"
              option-value="id"
              :disable="!selectedOffice"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn
            label="Generate"
            color="primary"
            :disable="!selectedOffice || !selectedEmployee"
            @click="generateReport"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- PDF content container rendered outside main layout -->
    <Teleport to="body">
      <div
        class="pdf-content-wrapper"
        :class="pdfPageClass"
        ref="pdfWrapper"
        v-show="showPdfContent"
      >
        <component
          :is="currentReportComponent"
          :data="reportData"
          :currentDateTime="currentDateTime"
          :currentUser="currentUser"
          ref="pdfContent"
        ></component>
      </div>
    </Teleport>
  </q-page>
</template>

<script>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { useQuasar } from 'quasar';
  import html2pdf from 'html2pdf.js';

  import AppointmentReport from 'src/components/Reports/AppointmentReport.vue';
  import CertificationReport from 'src/components/Reports/CertificationReport.vue';
  import PositionDescriptionReport from 'src/components/Reports/PositionDescriptionReport.vue';

  export default {
    name: 'ReportManagementPage',
    setup() {
      const $q = useQuasar();
      const pdfContent = ref(null);
      const pdfWrapper = ref(null);
      const showPdfContent = ref(false);
      const reportData = ref({});
      const currentReportComponent = ref(null);

      const currentDateTime = ref('2025-07-21 02:39:15');
      const currentUser = ref('dsfsgs');

      const columns = ref([
        { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
        { name: 'name', label: 'Report Name', align: 'left', field: 'name', sortable: true },
        {
          name: 'description',
          label: 'Description',
          align: 'left',
          field: 'description',
          sortable: true,
        },
        { name: 'actions', label: 'Actions', align: 'center', field: 'actions', sortable: false },
      ]);

      const reports = ref([
        {
          id: 1,
          name: 'Appointment',
          description: 'Official appointment document for employees',
          component: AppointmentReport,
          pdfSize: 'legal',
        },
        {
          id: 2,
          name: 'Certification',
          description: 'Certificate of employment and other certifications',
          component: CertificationReport,
          pdfSize: 'letter',
        },
        {
          id: 3,
          name: 'Position Description Form',
          description: 'Detailed job description and requirements',
          component: PositionDescriptionReport,
          pdfSize: 'legal',
        },
      ]);

      const reportModal = ref(false);
      const selectedReport = ref({});
      const selectedOffice = ref(null);
      const selectedEmployee = ref(null);

      const offices = ref([
        { id: 1, name: 'Office of the City Mayor' },
        { id: 2, name: 'Office of the City Information and Communications Technology' },
        { id: 3, name: 'Human Resources Management Office' },
      ]);

      const employees = ref([
        {
          id: 1,
          name: 'Juan A. Reyes',
          officeId: 1,
          position: 'Administrative Assistant III',
          salaryGrade: '10',
          step: '1',
          status: 'Permanent',
          reportsTo: 'City Mayor',
        },
        {
          id: 2,
          name: 'Maria E. Santos',
          officeId: 1,
          position: 'Administrative Officer V',
          salaryGrade: '18',
          step: '2',
          status: 'Permanent',
          reportsTo: 'City Administrator',
        },
        {
          id: 3,
          name: 'Pedro D. Gonzales',
          officeId: 2,
          position: 'Computer Programmer II',
          salaryGrade: '15',
          step: '3',
          status: 'Permanent',
          reportsTo: 'ICT Director',
        },
        {
          id: 4,
          name: 'Ana L. Cruz',
          officeId: 2,
          position: 'Information Technology Officer I',
          salaryGrade: '19',
          step: '1',
          status: 'Permanent',
          reportsTo: 'ICT Director',
        },
        {
          id: 5,
          name: 'Jose P. Mendoza',
          officeId: 3,
          position: 'Human Resource Management Officer IV',
          salaryGrade: '22',
          step: '2',
          status: 'Permanent',
          reportsTo: 'HRMO Director',
        },
        {
          id: 6,
          name: 'Sofia T. Garcia',
          officeId: 3,
          position: 'Human Resource Management Assistant',
          salaryGrade: '8',
          step: '1',
          status: 'Permanent',
          reportsTo: 'HRMO Officer IV',
        },
      ]);

      const filteredEmployees = computed(() => {
        if (!selectedOffice.value) return [];
        return employees.value.filter((emp) => emp.officeId === selectedOffice.value);
      });

      function openReportModal(report) {
        selectedReport.value = report;
        selectedOffice.value = null;
        selectedEmployee.value = null;
        reportModal.value = true;
      }

      function prepareReportData(employee, office) {
        switch (selectedReport.value.id) {
          case 1:
            return {
              name: employee.name,
              position: employee.position,
              salaryGrade: employee.salaryGrade,
              step: employee.step,
              status: employee.status,
              office: office.name,
              salaryWords: 'TWENTY THOUSAND',
              salaryFigure: '20,000.00',
              appointmentNature: 'REAPPOINTMENT PURSUANT TO RA6656',
              plantillaItemNo: `${office.name.substring(0, 4).toUpperCase()}-${employee.id}-2025`,
              page: '1',
              mayor: 'REY T. UY',
              signingDate: new Date().toISOString(),
              resolution: `2025-${100 + employee.id}`,
              resolutionYear: '2025',
              resolutionDate: new Date('2025-06-30').toISOString(),
              vice: employee.id % 2 === 0 ? 'Juan Dela Cruz' : '',
              who: employee.id % 2 === 0 ? 'Transferred' : '',
            };
          case 2:
            return {
              employeeName: employee.name,
              position: employee.position,
              officeName: office.name,
              hrmoOfficer: 'MARIA P. RODRIGUEZ',
            };
          case 3:
            return {
              employeeName: employee.name,
              position: employee.position,
              officeName: office.name,
              salaryGrade: employee.salaryGrade,
              reportsTo: employee.reportsTo,
              preparedBy: 'MARIA P. RODRIGUEZ',
              approvedBy: 'ANTONIO C. SANTOS',
            };
          default:
            return {};
        }
      }

      const pdfPageClass = computed(() => {
        if (!selectedReport.value.pdfSize) return '';
        return selectedReport.value.pdfSize === 'legal' ? 'legal-page' : 'letter-page';
      });

      function generateReport() {
        const office = offices.value.find((o) => o.id === selectedOffice.value);
        const employee = employees.value.find((e) => e.id === selectedEmployee.value);

        $q.notify({
          color: 'positive',
          message: `Generating ${selectedReport.value.name} for ${employee.name} of ${office.name}`,
          position: 'top',
          timeout: 2000,
        });

        reportModal.value = false;
        currentReportComponent.value = selectedReport.value.component;
        reportData.value = prepareReportData(employee, office);
        showPdfContent.value = true;

        nextTick(() => {
          setTimeout(generatePDF, 200);
        });
      }

      function generatePDF() {
        if (!pdfContent.value) {
          console.error('PDF content element not found');
          return;
        }

        const targetElement = pdfContent.value.$el || pdfContent.value;
        const reportName = selectedReport.value.name;
        const employeeName = reportData.value.name || reportData.value.employeeName;
        const paperFormat = selectedReport.value.pdfSize || 'legal';

        const opt = {
          filename: `${reportName}_${employeeName.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: true,
          },
          jsPDF: {
            unit: 'in',
            format: paperFormat,
            orientation: 'portrait',
            compress: true,
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };

        html2pdf()
          .set(opt)
          .from(targetElement)
          .toPdf()
          .get('pdf')
          .then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.setFontSize(10);
              pdf.setTextColor(150);
              // pdf.text(`Page ${i} of ${totalPages}`, 0.5, paperFormat === 'legal' ? 13.5 : 10.5);
            }
          })
          .outputPdf('dataurlnewwindow')
          .then(() => {
            showPdfContent.value = false;
          });
      }

      onMounted(() => {
        // Optionally set currentDateTime if needed
      });

      return {
        pdfContent,
        pdfWrapper,
        showPdfContent,
        reportData,
        currentReportComponent,
        currentDateTime,
        currentUser,
        columns,
        reports,
        reportModal,
        selectedReport,
        selectedOffice,
        selectedEmployee,
        offices,
        employees,
        filteredEmployees,
        pdfPageClass,
        openReportModal,
        generateReport,
      };
    },
  };
</script>

<style>
  .reports-table {
    width: 100%;
  }

  /* PDF Page wrapper for legal and letter sizes */
  .pdf-content-wrapper {
    width: 8.5in;
    background: white;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .letter-page {
    width: 8.5in;
    height: 11in;
  }
  .legal-page {
    width: 8.5in;
    height: 14in;
  }

  /* Print-specific styles */
  @media print {
    body * {
      visibility: hidden;
    }
    .pdf-content-wrapper,
    .pdf-content-wrapper * {
      visibility: visible;
      position: absolute;
      left: 0;
      top: 0;
    }
    .pdf-content-wrapper.letter-page {
      position: absolute;
      left: 0;
      top: 0;
      width: 8.5in;
      height: 11in;
      z-index: 9999;
      background: white;
    }
    .pdf-content-wrapper.legal-page {
      position: absolute;
      left: 0;
      top: 0;
      width: 8.5in;
      height: 14in;
      z-index: 9999;
      background: white;
    }
    @page {
      size: 8.5in 14in;
      margin: 0;
    }
  }
</style>
