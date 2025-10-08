<template>
  <q-page padding>
    <!-- Header with back button and title -->
    <div class="row justify-between items-center q-my-md q-mx-xl q-px-xl">
      <div class="row items-center">
        <q-btn icon="arrow_back" round class="bg-black text-white" to="/jobList" />
        <div class="column q-ml-sm">
          <div class="text-h4 text-bold q-mb-none">Job details</div>
          <div class="text-subtitle1 text-grey">Available Job Posts / Job details</div>
        </div>
      </div>
      <div class="column">
        <q-chip v-if="!jobPostStore.loading" class="text-h6 q-mb-xs text-white bg-blue">
          Posted on
          {{
            selectedJob?.post_date
              ? new Date(selectedJob.post_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : ''
          }}
        </q-chip>
        <q-chip v-else class="text-h6 q-mb-xs text-white bg-blue">
          <q-linear-progress rounded color="white" query style="width: 100px" />
        </q-chip>
      </div>
    </div>

    <div class="row justify-evenly items-center">
      <!-- Main content card -->
      <q-card v-if="!jobPostStore.loading" class="col-8" flat bordered>
        <q-card-section>
          <!-- Job header with logo and info -->
          <div class="row items-center">
            <q-avatar color="primary" text-color="white" size="75px">
              {{ selectedJob?.Position ? selectedJob.Position.charAt(0) : 'N' }}
            </q-avatar>
            <div class="column q-ml-md" style="flex-grow: 1">
              <div class="text-green text-h5 text-weight-bold">
                {{ selectedJob?.Position || 'No Position' }}
                {{ selectedJob?.id || 'No Position' }}
              </div>
              <div class="row items-center">
                <span class="q-ml-xs text-body1 text-grey-8">
                  {{ selectedJob?.Office || 'No Office' }}
                </span>
              </div>
              <div class="row items-center">
                <span class="q-ml-xs text-body1 text-grey-8">
                  {{ selectedJob?.Division || 'No Division' }}
                </span>
              </div>
              <div class="row items-center">
                <span class="q-ml-xs text-body1 text-grey-8">
                  {{ selectedJob?.Section || 'No Section' }}
                </span>
              </div>
              <div class="row items-center">
                <span class="q-ml-xs text-body1 text-grey-8">
                  {{ selectedJob?.Unit || 'No Unit' }}
                </span>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Office section -->
        <q-card-section>
          <div class="text-h5 text-bold text-green">Office</div>
          <div class="text-body2 text-uppercase">
            {{ selectedJob?.Office || 'No Office' }}
          </div>
        </q-card-section>

        <q-separator />

        <!-- Qualification Standards section -->
        <q-card-section>
          <div class="text-h4 text-bold text-green">Qualification Standards/Requirements</div>

          <div class="q-gutter-y-md q-mt-md">
            <!--  -->
            <div class="row justify-center q-gutter-x-md">
              <q-card flat bordered class="col">
                <q-card-section>
                  <q-badge color="primary">Education</q-badge>
                  <div class="text-body1">{{ selectedCriteria?.Education || 'None' }}</div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="col">
                <q-card-section>
                  <q-badge>Training</q-badge>
                  <div class="text-body1">{{ selectedCriteria?.Training || 'None' }}</div>
                </q-card-section>
              </q-card>
            </div>
            <!--  -->
            <div class="row justify-center q-gutter-x-md">
              <q-card flat bordered class="col">
                <q-card-section>
                  <q-badge>Experience</q-badge>
                  <div class="text-body1">{{ selectedCriteria?.Experience || 'None' }}</div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="col">
                <q-card-section>
                  <q-badge>Eligibility</q-badge>
                  <div class="text-body1">{{ selectedCriteria?.Eligibility || 'None' }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Position section -->
        <q-card-section>
          <div class="text-h5 text-bold text-green">Position</div>
          <div class="text-body2">{{ selectedJob?.Position || 'No Position' }}</div>
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
                    Upload your filled application (XLSM format only)
                  </div>
                  <div class="file-input full-width q-mt-md">
                    <q-file
                      v-model="uploadedFile"
                      accept=".xlsm,.xlsx"
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
      <q-card v-else flat bordered style="width: 70vw">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-skeleton type="QAvatar" size="75px" />
            <div class="column q-ml-md" style="flex-grow: 1">
              <q-skeleton type="text" width="150px" height="30px" class="q-mb-xs" />
              <q-skeleton type="text" width="200px" />
              <q-skeleton type="text" width="180px" />
              <q-skeleton type="text" width="160px" />
              <q-skeleton type="text" width="140px" />
            </div>
          </div>
          <q-separator />
          <div class="q-my-md">
            <q-skeleton type="text" width="100px" height="25px" class="q-mb-xs" />
            <q-skeleton type="text" width="250px" />
          </div>
          <q-separator />
          <div class="q-my-md">
            <q-skeleton type="text" width="250px" height="25px" class="q-mb-xs" />
            <q-skeleton type="text" width="150px" class="q-mb-sm" />
            <q-skeleton type="text" width="300px" />
            <q-skeleton type="text" width="300px" />
            <q-skeleton type="text" width="300px" />
            <q-skeleton type="text" width="300px" />
          </div>
          <q-separator />
          <div class="q-my-md">
            <q-skeleton type="text" width="100px" height="25px" class="q-mb-xs" />
            <q-skeleton type="text" width="200px" />
          </div>
          <q-separator />
          <div class="q-pa-md bg-grey-1">
            <q-skeleton type="text" width="200px" height="30px" class="q-mx-auto q-mb-xl" />
            <div class="row items-start justify-center q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <q-skeleton height="250px" square />
              </div>
              <div class="col-12 col-md-4">
                <q-skeleton height="250px" square />
              </div>
              <div class="col-12 col-md-4">
                <q-skeleton height="250px" square />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- UPDATED: Application Confirmation Dialog -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card class="confirmation-dialog">
        <!-- Green header with centered icon -->
        <div class="header-green">
          <div class="icon-container">
            <q-icon name="assignment" size="28px" color="green" />
          </div>
        </div>

        <!-- Confirmation title -->
        <div class="dialog-title">
          <div class="text-h5 text-green text-center text-weight-bold">Confirm Application</div>
          <div class="text-subtitle1 text-center text-grey q-mt-sm">
            Please verify your submission details
          </div>
        </div>

        <q-separator />

        <!-- Position info -->
        <div class="dialog-content">
          <div class="row items-center q-mb-md">
            <q-icon name="work" size="16px" class="text-green" />
            <div class="q-ml-sm">Position:</div>
            <div class="text-green text-weight-bold q-ml-sm position-text">
              {{ selectedJob?.Position || 'Computer Programmer II' }}
            </div>
          </div>

          <!-- File section -->
          <div class="row items-start">
            <q-icon name="upload_file" size="16px" class="text-green q-mt-xs" />
            <div class="q-ml-sm q-mt-xs">File:</div>
          </div>

          <!-- Fixed width file card -->
          <div class="file-card">
            <div class="row no-wrap">
              <q-icon name="description" size="18px" class="text-blue q-mt-xs" />
              <div class="file-details">
                <div class="file-name">{{ uploadedFile?.name }}</div>
                <div class="file-size">{{ formatFileSize(uploadedFile?.size || 0) }}</div>
              </div>
            </div>
          </div>

          <div class="text-center text-grey-7 q-mt-lg">
            By clicking Submit, you confirm that all information provided is accurate and complete.
          </div>
        </div>

        <!-- Action buttons -->
        <div class="dialog-actions">
          <q-btn flat label="CANCEL" color="grey-7" v-close-popup class="q-px-md" />
          <q-btn
            unelevated
            label="SUBMIT APPLICATION"
            color="green"
            @click="processSubmission"
            class="q-px-md"
            :loading="uploadStore.isSubmitting"
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- Loading Overlay -->
    <q-dialog v-model="uploadStore.isSubmitting" persistent>
      <q-card class="q-pa-xl flex flex-center" style="min-width: 200px">
        <q-spinner size="50px" color="primary" />
        <div class="text-center q-mt-md text-h6">Uploading your application...</div>
      </q-card>
    </q-dialog>
    <!-- Success Dialog -->
    <q-dialog v-model="successDialog" persistent>
      <q-card class="confirmation-dialog">
        <!-- Green header with centered icon -->
        <div class="header-green">
          <div class="icon-container">
            <q-icon name="check_circle" size="28px" color="green" />
          </div>
        </div>

        <!-- Success title -->
        <div class="dialog-title">
          <div class="text-h5 text-green text-center text-weight-bold">Application Successful!</div>
          <div class="text-subtitle1 text-center text-grey q-mt-sm">
            Your application has been submitted
          </div>
        </div>

        <q-separator />

        <!-- Success content -->
        <div class="dialog-content text-center">
          <div class="q-mb-md">
            Thank you for applying to the
            <span class="text-green text-weight-bold">
              {{ selectedJob?.Position || 'Computer Programmer II' }}
            </span>
            position.
          </div>

          <div class="q-my-md">
            We have received your application and will contact you via sms or email for updates.
          </div>

          <div class="text-grey-7 q-mt-lg">Reference #: APP-{{ generateReferenceNumber() }}</div>
        </div>

        <!-- Action button - Changed to close dialog instead of navigating away -->
        <div class="dialog-actions">
          <q-btn
            unelevated
            label="CLOSE"
            color="green"
            @click="closeSuccessDialog"
            class="q-px-xl"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { useRoute } from 'vue-router';
  import { onMounted, ref, computed } from 'vue';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { useUser_upload } from 'stores/user_upload';

  const uploadStore = useUser_upload();

  const jobPostStore = useJobPostStore();

  const route = useRoute();
  const P_ID = route.params.PositionID;
  const I_No = route.params.ItemNo;

  // Job details
  const selectedJob = ref([]);
  const selectedCriteria = ref([]);

  // Application state

  const confirmDialog = ref(false);

  // eslint-disable-next-line no-unused-vars
  const isSubmitting = ref(false);

  const closeSuccessDialog = () => {
    successDialog.value = false;

    uploadedFile.value = null;
  };

  const successDialog = computed({
    get: () => uploadStore.successDialog,
    set: (val) => (uploadStore.successDialog = val),
  });
  // Download the Excel template
  const downloadExcelForm = () => {
    const excelFileUrl = 'pds.xlsx';
    const a = document.createElement('a');
    a.href = excelFileUrl;

    // Create dynamic filename based on position
    const position = selectedJob.value?.Position || 'Job';
    const formattedPosition = position.replace(/\s+/g, '_');
    a.download = `${formattedPosition}_Application_Form.xlsx`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Generate a random reference number
  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${timestamp}-${random}`;
  };

  // Pass file directly to Pinia store

  const uploadedFile = computed({
    get: () => uploadStore.uploadedFile,
    set: (val) => (uploadStore.uploadedFile = val),
  });

  const submitApplication = async () => {
    if (!uploadStore.uploadedFile) return;
    confirmDialog.value = true;
  };

  // const processSubmission = async () => {
  //   confirmDialog.value = false;
  //   await uploadStore.processSubmission();
  // };

  //   onMounted(async () => {
  //     // Fetch job details if needed
  //     await jobPostStore.fetchJobPostByPositionAndItemNo(P_ID, I_No).then((job) => {
  //       selectedJob.value = job;
  //        uploadStore.selectedJob = job;
  //     });
  //     await jobPostStore.fetchCriteriaByPositionAndItemNo(P_ID, I_No).then((criteria) => {
  //       selectedCriteria.value = criteria;
  //     });

  //   });
  // In your component's script setup
  const processSubmission = async () => {
    confirmDialog.value = false;
    try {
      console.log('Current selected job:', uploadStore.selectedJob); // Debug log
      const response = await uploadStore.processSubmission();

      if (response) {
        console.log('Submission response:', response);
        if (response.job_batch_rsp_id) {
          console.log('Job batch response ID:', response.job_batch_rsp_id);
          // You can now use this ID as needed
        }
      }
    } catch (error) {
      console.error('Submission process error:', error);
    }
  };

  onMounted(async () => {
    await jobPostStore.fetchJobPostByPositionAndItemNo(P_ID, I_No).then((job) => {
      selectedJob.value = job;
      uploadStore.setSelectedJob(job); // Properly set the job in the upload store
      console.log('Job loaded:', job); // Debug log
    });
    await jobPostStore.fetchCriteriaByPositionAndItemNo(P_ID, I_No).then((criteria) => {
      selectedCriteria.value = criteria;
    });
  });
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

  /* Confirmation Dialog Styling */
  .confirmation-dialog {
    border-radius: 12px;
    overflow: hidden;
    width: 460px;
    max-width: 95vw;
  }

  .header-green {
    background-color: #00c853;
    height: 100px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-container {
    width: 56px;
    height: 56px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -28px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .dialog-title {
    margin-top: 36px;
    padding: 0 24px 16px 24px;
  }

  .dialog-content {
    padding: 24px;
  }

  .file-card {
    margin-top: 8px;
    margin-left: 8px;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 12px;
    width: 100%;
    max-width: 390px;
    border: 1px solid #e0e0e0;
  }

  .file-details {
    margin-left: 12px;
    width: calc(100% - 36px);
    overflow: hidden;
  }

  .file-name {
    font-weight: 500;
    word-break: break-all;
    white-space: normal;
    color: #1976d2;
  }

  .file-size {
    color: #757575;
    font-size: 0.85rem;
    margin-top: 4px;
  }

  .dialog-actions {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
  }

  .position-text {
    font-size: 12px;
  }
</style>
