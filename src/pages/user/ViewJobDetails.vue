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

        <!-- Application Process - Updated Design with 4 steps -->
        <q-card-section class="bg-grey-1">
          <div class="text-center text-h5 text-weight-bold q-mb-xl">Application Process</div>

          <div class="row items-center justify-center q-col-gutter-lg">
            <!-- Step 1: Download Form -->
            <div class="col-12 col-md-3">
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
            <div class="col-12 col-md-3">
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

            <!-- Step 3: Upload Supporting Documents -->
            <div class="col-12 col-md-3">
              <div class="process-card bg-white">
                <div class="card-content">
                  <!-- Add info icon in top right corner -->
                  <div class="card-header">
                    <div class="step-number bg-orange-1 text-orange">3</div>
                    <q-btn
                      icon="info_outline"
                      flat
                      round
                      dense
                      size="sm"
                      color="orange"
                      class="info-btn"
                      @click="openZipInstructions"
                    >
                      <q-tooltip class="bg-orange">Click for detailed instructions</q-tooltip>
                    </q-btn>
                  </div>

                  <div class="step-icon bg-orange-1">
                    <q-icon name="folder_zip" size="36px" color="orange" />
                  </div>
                  <div class="step-title text-h6 text-orange">Upload Supporting Documents</div>
                  <div class="step-description q-mb-xs">
                    Upload your supporting documents (ZIP format only)
                  </div>
                  <div class="file-input full-width q-mt-xs">
                    <q-file
                      ref="zipFileInputRef"
                      v-model="uploadedZipFile"
                      accept=".zip"
                      outlined
                      class="full-width"
                      standout
                      bottom-slots
                      hide-bottom-space
                      :rules="[
                        (val) => !!val || 'Please select a ZIP file',
                        (val) => val?.name?.endsWith('.zip') || 'Only ZIP files allowed',
                      ]"
                      @mousedown="handleZipFileClick"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" color="orange" />
                      </template>
                      <template v-slot:hint>
                        <div class="text-grey-7 text-center text-caption q-mt-xs">
                          Select your supporting documents ZIP file
                        </div>
                      </template>
                    </q-file>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Submit Application -->
            <div class="col-12 col-md-3">
              <div class="process-card bg-white">
                <div class="card-content">
                  <div class="step-number bg-purple-1 text-purple">4</div>
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
                    :disable="!uploadedFile || !uploadedZipFile"
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

      <!-- Loading skeleton -->
      <q-card v-else flat bordered style="width: 70vw">
        <q-card-section>
          <q-skeleton type="text" />
          <q-skeleton type="rect" height="200px" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Updated Confirmation Dialog -->
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

          <!-- Excel File section -->
          <div class="row items-start q-mb-md">
            <q-icon name="description" size="16px" class="text-green q-mt-xs" />
            <div class="q-ml-sm q-mt-xs">Application Form:</div>
          </div>

          <div class="file-card q-mb-md">
            <div class="row no-wrap">
              <q-icon name="description" size="18px" class="text-blue q-mt-xs" />
              <div class="file-details">
                <div class="file-name">{{ uploadedFile?.name }}</div>
                <div class="file-size">{{ formatFileSize(uploadedFile?.size || 0) }}</div>
              </div>
            </div>
          </div>

          <!-- ZIP File section -->
          <div class="row items-start">
            <q-icon name="folder_zip" size="16px" class="text-green q-mt-xs" />
            <div class="q-ml-sm q-mt-xs">Supporting Documents:</div>
          </div>

          <div class="file-card">
            <div class="row no-wrap">
              <q-icon name="folder_zip" size="18px" class="text-orange q-mt-xs" />
              <div class="file-details">
                <div class="file-name">{{ uploadedZipFile?.name }}</div>
                <div class="file-size">{{ formatFileSize(uploadedZipFile?.size || 0) }}</div>
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

        <!-- Action button -->
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

    <ZipInstructionModal
      v-model="showZipInstructions"
      @instruction-complete="handleInstructionComplete"
    />
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useJobPostStore } from 'stores/jobPostStore';
  import { useUser_upload } from 'stores/user_upload';
  import { toast } from 'src/boot/toast';
  import ZipInstructionModal from 'components/ZipFileModal.vue';

  const $q = useQuasar();
  const route = useRoute();
  const router = useRouter();

  const uploadStore = useUser_upload();
  const jobPostStore = useJobPostStore();

  const id = route.params.id;

  // Local UI state
  const showZipInstructions = ref(false);
  const confirmDialog = ref(false);
  const uploadingLoading = ref(false);
  const zipFileInputRef = ref(null);
  const userClickedZipInput = ref(false);
  const nativeFileInput = ref(null);

  // Job data refs used by the template
  const selectedJob = ref(null);
  const selectedCriteria = ref(null);

  const refreshJobDetails = async (showLoading = false) => {
    if (showLoading) {
      jobPostStore.loading = true;
    }

    try {
      console.log('Refreshing job details for ID:', id);

      // Call the store method
      let jobDetails = await jobPostStore.fetchJobDetails(id);

      // If the store method doesn't return data, get it from the store
      if (!jobDetails && jobPostStore.jobPosts) {
        console.log('Using data from store.jobPosts');
        jobDetails = jobPostStore.jobPosts;
      }

      if (!jobDetails) {
        throw new Error('No job details returned from server');
      }

      console.log('Successfully refreshed job details:', jobDetails);

      // Update job details
      selectedJob.value = {
        id: jobDetails.id || null,
        old_job_id: jobDetails.old_job_id || null,
        Position: jobDetails.Position || 'Unknown Position',
        status: jobDetails.status || 'Unknown',
        level: jobDetails.level || 'N/A',
        PageNo: jobDetails.PageNo || 'N/A',
        ItemNo: jobDetails.ItemNo || 'N/A',
        SalaryGrade: jobDetails.SalaryGrade || 'N/A',
        Office: jobDetails.Office || 'Unknown Office',
        Division: jobDetails.Division || 'N/A',
        Section: jobDetails.Section || 'N/A',
        Unit: jobDetails.Unit || 'N/A',
        post_date: jobDetails.post_date || null,
        end_date: jobDetails.end_date || null,
        PositionID: jobDetails.PositionID || '',
        tblStructureDetails_ID: jobDetails.tblStructureDetails_ID || null,
        ...jobDetails,
      };

      // Update criteria
      if (jobDetails.criteria && typeof jobDetails.criteria === 'object') {
        selectedCriteria.value = {
          id: jobDetails.criteria.id || null,
          Education: jobDetails.criteria.Education || 'Not specified',
          Experience: jobDetails.criteria.Experience || 'Not specified',
          Training: jobDetails.criteria.Training || 'Not specified',
          Eligibility: jobDetails.criteria.Eligibility || 'Not specified',
        };
      } else {
        selectedCriteria.value = {
          Education: 'No criteria available',
          Experience: 'No criteria available',
          Training: 'No criteria available',
          Eligibility: 'No criteria available',
        };
      }

      return jobDetails;
    } catch (error) {
      console.error('Error refreshing job details:', error);
      throw error;
    } finally {
      if (showLoading) {
        jobPostStore.loading = false;
      }
    }
  };

  // Map store state to template-accessible computed refs
  const uploadedFile = computed({
    get: () => uploadStore.uploadedFile,
    set: (val) => (uploadStore.uploadedFile = val),
  });

  const uploadedZipFile = computed({
    get: () => uploadStore.uploadedZipFile,
    set: (val) => (uploadStore.uploadedZipFile = val),
  });

  // expose store successDialog for template
  const successDialog = computed({
    get: () => uploadStore.successDialog,
    set: (val) => (uploadStore.successDialog = val),
  });

  // Small helper: format file size (template calls this)
  function formatFileSize(bytes) {
    if (bytes === undefined || bytes === null) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Download template helper
  function downloadExcelForm() {
    const excelFileUrl = '/public/pdsv2.xlsx';
    const a = document.createElement('a');
    a.href = excelFileUrl;

    const position = selectedJob.value?.Position || 'Job';
    const formattedPosition = position.replace(/\s+/g, '_');
    a.download = `${formattedPosition}_Application_Form.xlsx`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Generate a simple reference number (used in success dialog)
  function generateReferenceNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${timestamp}-${random}`;
  }

  // Reset store and local UI on success close
  function closeSuccessDialog() {
    uploadStore.reset();
    successDialog.value = false;
    // Optionally redirect back to job list
    router.push('/jobList');
  }

  // Handle ZIP file input click - show instructions first
  function handleZipFileClick() {
    // Mark that user tried to click ZIP input
    userClickedZipInput.value = true;

    // Show the instruction modal instead
    showZipInstructions.value = true;

    // Store reference to native file input
    nextTick(() => {
      if (zipFileInputRef.value) {
        nativeFileInput.value = zipFileInputRef.value.$el.querySelector('input[type="file"]');
      }
    });
  }

  // Open ZIP instructions via info button
  function openZipInstructions() {
    userClickedZipInput.value = false;
    showZipInstructions.value = true;
  }

  // Handle when user completes instructions and clicks "Got it!"
  async function handleInstructionComplete() {
    showZipInstructions.value = false;

    // If user originally clicked the file input, now trigger the file picker
    if (userClickedZipInput.value) {
      userClickedZipInput.value = false;

      // Wait for modal to fully close
      await nextTick();

      // Small delay to ensure DOM is updated
      setTimeout(() => {
        try {
          if (zipFileInputRef.value) {
            // Try multiple methods to trigger file picker
            const qFile = zipFileInputRef.value;

            // Method 1: Direct access via DOM
            const input = qFile.$el.querySelector('input[type="file"]');
            if (input) {
              console.log('Found input element, clicking it');
              input.click();
              return;
            }

            // Method 2: Use Quasar's internal method
            if (qFile.pickFiles && typeof qFile.pickFiles === 'function') {
              console.log('Using pickFiles method');
              qFile.pickFiles();
              return;
            }

            // Method 3: Access through $refs
            if (qFile.$refs && qFile.$refs.input) {
              console.log('Using $refs.input');
              qFile.$refs.input.click();
              return;
            }

            console.warn('Could not find file input to click');
          }
        } catch (error) {
          console.error('Error opening file picker:', error);
        }
      }, 300);
    }
  }

  // Called by the "APPLY NOW" button to open confirm dialog
  async function submitApplication() {
    if (!uploadStore.uploadedFile || !uploadStore.uploadedZipFile) {
      // Minor UX: show immediate notify if user managed to click without files
      $q.notify({
        type: 'negative',
        message: 'Please attach both Excel and ZIP files before submitting.',
      });
      return;
    }
    confirmDialog.value = true;
  }

  // Called when the user confirms submission in the dialog
  async function processSubmission() {
    // close dialog and show local uploading indicator
    confirmDialog.value = false;
    uploadingLoading.value = true;

    try {
      console.log('Current selected job (local):', selectedJob.value);
      console.log('Current selected job (store):', uploadStore.selectedJob);
      console.log('Excel file:', uploadStore.uploadedFile?.name);
      console.log('ZIP file:', uploadStore.uploadedZipFile?.name);

      // Call store action that handles the API request and internal state
      const response = await uploadStore.processSubmission();
      console.log('Raw response from store:', response);

      // Normalize response: store returns axios response or a normalized data object
      const data = response?.data ?? response;

      // Prefer the message from the API, fallback to store.errorMessage
      const message = data?.message ?? uploadStore.errorMessage ?? '';

      if (data?.success === true) {
        // Show positive notification and rely on store.successDialog to show success UI
        $q.notify({ type: 'positive', message: message || 'Submission uploaded successfully' });
        // successDialog in template is backed by computed, and the store also sets successDialog
        // Optionally ensure it's open here if you want immediate visual:
        // uploadStore.successDialog = true;
      } else {
        // Failure branches: show message from API or generic error
        $q.notify({ type: 'negative', message: message || 'Failed to upload submission' });
        // The store.errorMessage is set by the store; you can also display errorMessage in the template.
        console.warn('Submission failed:', message);
      }

      // Example of reading server returned id if present
      if (data?.id) {
        console.log('Job batch response ID:', data.id);
      }
    } catch (err) {
      // Network/unexpected errors
      console.error('Submission process error:', err);
      $q.notify({ type: 'negative', message: 'Network error. Please try again.' });
    } finally {
      uploadingLoading.value = false;
    }
  }

  // On mounted: load job and criteria, set the job into uploadStore (so store has selectedJob)
  onMounted(async () => {
    if (!id) {
      console.error('No job ID provided in route params');
      toast.error('No job ID provided');
      router.push('/job-post');
      return;
    }

    try {
      // Load initial job details
      await refreshJobDetails(true); // Show loading for initial load

      // ✅ FIX: Set the job in the upload store after loading
      if (selectedJob.value && selectedJob.value.id) {
        uploadStore.setSelectedJob(selectedJob.value);
        console.log('Job set in upload store:', selectedJob.value);
      } else {
        console.error('Selected job is missing ID:', selectedJob.value);
        throw new Error('Job ID is missing');
      }

      console.log('Initial data loading completed');
    } catch (error) {
      console.error('Error during initial data loading:', error);

      let errorMessage = 'Failed to load job details';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Job not found';
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      if (error.response?.status === 404) {
        setTimeout(() => {
          router.push('/job-post');
        }, 2000);
      }
    }
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
    position: relative;
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

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 12px;
  }

  .info-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
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
