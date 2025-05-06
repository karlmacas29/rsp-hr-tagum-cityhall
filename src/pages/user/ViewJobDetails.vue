<template>
  <q-page padding>
    <!-- Header with back button and title -->
    <div class="row justify-between items-center q-my-md q-mx-xl q-px-xl">
      <div class="row items-center">
        <q-btn icon="arrow_back" flat round color="black" to="/jobList" />
        <div class="column q-ml-sm">
          <div class="text-h4 text-bold q-mb-none">Job details {{ jobId }}</div>
          <div class="text-subtitle1 text-grey">Available Job Posts / Job details</div>
        </div>
      </div>
      <div class="column">
        <div class="text-body q-mb-xs">Posted on 20 February 2025</div>
      </div>
    </div>

    <div class="row justify-evenly items-center">
      <!-- Main content card -->
      <q-card class="col-8" flat bordered>
        <q-card-section>
          <!-- Job header with logo and info -->
          <div class="row items-start">
            <q-avatar color="primary" text-color="white" size="75px">C</q-avatar>
            <div class="column q-ml-md" style="flex-grow: 1">
              <div class="text-green text-h5 text-weight-bold">COMPUTER PROGRAMMER II</div>
              <div class="row items-center">
                <q-icon name="business" size="xs" color="grey-8" />
                <span class="q-ml-xs text-body1 text-grey-8">
                  CITY OF INFORMATION COMMUNICATIONS & TECHNOLOGY MANAGEMENT OFFICE
                </span>
              </div>
              <div class="row items-center">
                <q-icon name="school" size="xs" color="grey-8" />
                <span class="q-ml-xs text-body1 text-grey-8">COLLEGE GRADUATE</span>
              </div>
              <div class="text-body1 text-grey q-mt-xs">5 Permanent</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Office section -->
        <q-card-section>
          <div class="text-h5 text-bold text-green">Office</div>
          <div class="text-body2 text-uppercase">
            CITY OF INFORMATION COMMUNICATIONS & TECHNOLOGY MANAGEMENT OFFICE
          </div>
        </q-card-section>

        <q-separator />

        <!-- Qualification Standards section -->
        <q-card-section>
          <div class="text-h5 text-bold text-green">Qualification Standards/Requirements</div>
          <div class="text-weight-bold q-mt-sm">BRIEF QUALIFICATIONS:</div>
          <div class="text-body2">
            <ol>
              <li>Must be graduated from 4-yr job relevance.</li>
              <li>Preferably MALE with relevant experience.</li>
              <li>Analytical, innovative and creative.</li>
            </ol>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Position section -->
        <q-card-section>
          <div class="text-h5 text-bold text-green">Position</div>
          <div class="text-body2">Computer Programmer II</div>
        </q-card-section>

        <q-separator />

        <!-- Application Process - Improved Design -->
        <q-card-section class="bg-grey-1">
          <div class="text-center text-h5 text-weight-bold q-mb-xl">Application Process</div>

          <div class="row items-center justify-center q-col-gutter-lg">
            <!-- Step 1: Download Form -->
            <div class="col-12 col-md-4">
              <div class="process-card bg-white">
                <div class="card-content">
                  <div class="step-number bg-green-1 text-green">1</div>
                  <div class="step-icon bg-green-1">
                    <q-icon name="file_download" size="36px" color="green" />
                  </div>
                  <div class="step-title text-h6 text-green">Download Application Form</div>
                  <div class="step-description q-mb-auto">
                    Get the application template to fill with your details
                  </div>
                  <q-btn
                    label="DOWNLOAD TEMPLATE"
                    color="green"
                    class="action-btn full-width q-mt-md"
                    outline
                    @click="downloadExcelForm"
                  />
                </div>
              </div>
            </div>

            <!-- Step 2: Upload Completed Form -->
            <div class="col-12 col-md-4">
              <div class="process-card bg-white">
                <div class="card-content">
                  <div class="step-number bg-blue-1 text-blue">2</div>
                  <div class="step-icon bg-blue-1">
                    <q-icon name="upload_file" size="36px" color="blue" />
                  </div>
                  <div class="step-title text-h6 text-blue">Upload Completed Form</div>
                  <div class="step-description q-mb-auto">
                    Upload your filled application (XLSX format only)
                  </div>
                  <div class="file-input full-width q-mt-md">
                    <q-file
                      v-model="uploadedFile"
                      accept=".xlsx,.xls"
                      outlined
                      class="full-width"
                      standout
                      bottom-slots
                      hide-bottom-space
                      :rules="[
                        (val) => !!val || 'Please select a file',
                        (val) =>
                          val?.name?.endsWith('.xlsx') ||
                          val?.name?.endsWith('.xls') ||
                          'Only Excel files allowed',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" color="blue" />
                      </template>
                      <template v-slot:hint>
                        <div class="text-grey-7 text-center text-caption q-mt-xs">
                          Select your completed application form
                        </div>
                      </template>
                    </q-file>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Submit Application -->
            <div class="col-12 col-md-4">
              <div class="process-card bg-white">
                <div class="card-content">
                  <div class="step-number bg-purple-1 text-purple">3</div>
                  <div class="step-icon bg-purple-1">
                    <q-icon name="send" size="36px" color="purple" />
                  </div>
                  <div class="step-title text-h6 text-purple">Submit Application</div>
                  <div class="step-description q-mb-auto">
                    Review your application and submit when ready
                  </div>
                  <q-btn
                    label="APPLY NOW"
                    color="purple"
                    class="action-btn full-width q-mt-md"
                    :disable="!uploadedFile"
                    @click="submitApplication"
                  >
                    <q-icon name="check_circle" class="q-ml-sm" />
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Application Confirmation Dialog -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="assignment" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6">Confirm Submission</span>
        </q-card-section>

        <q-card-section>
          You are about to submit your application for
          <strong>Computer Programmer II</strong>
          .
          <div class="q-mt-md">
            <strong>Uploaded file:</strong>
            {{ uploadedFile?.name }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Submit" color="primary" @click="processSubmission" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Success Dialog -->
    <q-dialog v-model="successDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="check_circle" color="green" text-color="white" />
          <span class="q-ml-sm text-h6">Application Submitted!</span>
        </q-card-section>

        <q-card-section>
          Thank you for applying to the
          <strong>Computer Programmer II</strong>
          position.
          <div class="q-mt-md">
            We have received your application and will contact you via email for updates.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" to="/jobList" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { useRoute } from 'vue-router';
  import { ref } from 'vue';

  const route = useRoute();
  const jobId = route.params.id;

  // Application state
  const uploadedFile = ref(null);
  const confirmDialog = ref(false);
  const successDialog = ref(false);
  const isSubmitting = ref(false);

  // Download the Excel template
  const downloadExcelForm = () => {
    const excelFileUrl = '/application-forms/programmer-application-form.xlsx';
    const a = document.createElement('a');
    a.href = excelFileUrl;
    a.download = 'Programmer_Application_Form.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Validate and show confirmation
  const submitApplication = () => {
    if (!uploadedFile.value) return;
    confirmDialog.value = true;
  };

  // Process the submission
  const processSubmission = async () => {
    isSubmitting.value = true;
    confirmDialog.value = false;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would upload the file here:
      // const formData = new FormData();
      // formData.append('jobApplication', uploadedFile.value);
      // formData.append('jobId', jobId);
      // await api.post('/applications', formData);

      successDialog.value = true;
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<style scoped>
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .q-card {
      margin-bottom: 20px;
    }
  }

  /* Process cards styling */
  .process-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition:
      transform 0.3s,
      box-shadow 0.3s;
    overflow: hidden;
    height: 100%;
  }

  .process-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  .step-number {
    font-size: 18px;
    font-weight: 600;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
  }

  .step-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .file-input {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 12px;
    transition: border-color 0.3s;
    cursor: pointer;
  }

  .file-input:hover {
    border-color: #4caf50;
  }

  .action-btn {
    border-radius: 8px;
    font-weight: 600;
    padding: 12px 24px;
    transition: all 0.3s;
  }

  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .progress-connector {
    height: 4px;
    background: #e0e0e0;
    position: relative;
    top: 40px;
    z-index: 0;
  }

  .card-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
  }

  .step-title {
    margin-bottom: 12px;
    font-weight: 600;
  }

  .step-description {
    color: #666;
    margin-bottom: 20px;
  }
</style>
