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

        <!-- Application Process -->
        <q-card-section class="bg-grey-1">
          <div class="text-center text-h6 text-weight-bold q-mb-md">Application Process</div>

          <div class="row items-center q-col-gutter-md">
            <!-- Step 1: Download Form -->
            <div class="col-12 col-md-4">
              <q-card flat class="text-center">
                <q-card-section>
                  <div class="text-h6 text-primary">Step 1</div>
                  <q-icon name="download" size="lg" color="primary" class="q-mb-sm" />
                  <div>Download Application Form</div>
                  <q-btn
                    label="Download"
                    color="primary"
                    outline
                    class="q-mt-sm full-width"
                    @click="downloadExcelForm"
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- Step 2: Upload Completed Form -->
            <div class="col-12 col-md-4">
              <q-card flat class="text-center">
                <q-card-section>
                  <div class="text-h6 text-primary">Step 2</div>
                  <q-icon name="upload" size="lg" color="primary" class="q-mb-sm" />
                  <div>Upload Completed Form</div>
                  <q-file
                    v-model="uploadedFile"
                    label="Select your file"
                    accept=".xlsx,.xls"
                    outlined
                    class="q-mt-sm full-width"
                    :rules="[
                      (val) => !!val || 'Required',
                      (val) => val?.name?.endsWith('.xlsx') || 'Only .xlsx files',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </q-card-section>
              </q-card>
            </div>

            <!-- Step 3: Submit Application -->
            <div class="col-12 col-md-4">
              <q-card flat class="text-center">
                <q-card-section>
                  <div class="text-h6 text-primary">Step 3</div>
                  <q-icon name="send" size="lg" color="green" class="q-mb-sm" />
                  <div>Submit Application</div>
                  <q-btn
                    label="Apply Now"
                    color="green"
                    class="q-mt-sm full-width"
                    :disable="!uploadedFile"
                    @click="submitApplication"
                  />
                </q-card-section>
              </q-card>
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
</style>
