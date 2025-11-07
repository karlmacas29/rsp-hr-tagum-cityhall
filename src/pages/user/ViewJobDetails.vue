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

    <!-- Confirmation Dialog for Initial Submission -->
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

    <!-- ✅ FLEXIBLE SUCCESS DIALOG - Shows different content for new vs updated applications -->
    <q-dialog v-model="successDialog" persistent>
      <q-card class="confirmation-dialog">
        <!-- Green header with centered icon -->
        <div class="header-green">
          <div class="icon-container">
            <q-icon
              :name="successType === 'updated' ? 'refresh' : 'check_circle'"
              size="28px"
              color="green"
            />
          </div>
        </div>

        <!-- Success title - Dynamic based on type -->
        <div class="dialog-title">
          <div class="text-h5 text-green text-center text-weight-bold">
            {{ successType === 'updated' ? 'Application Updated!' : 'Application Successful!' }}
          </div>
          <div class="text-subtitle1 text-center text-grey q-mt-sm">
            {{
              successType === 'updated'
                ? 'Your application has been successfully updated'
                : 'Your application has been submitted'
            }}
          </div>
        </div>

        <q-separator />

        <!-- Success content - Dynamic based on type -->
        <div class="dialog-content text-center">
          <!-- NEW APPLICATION MESSAGE -->
          <template v-if="successType === 'new'">
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
          </template>

          <!-- UPDATED APPLICATION MESSAGE -->
          <template v-else-if="successType === 'updated'">
            <div class="q-mb-md">
              Your application for the
              <span class="text-green text-weight-bold">
                {{ selectedJob?.Position || 'Computer Programmer II' }}
              </span>
              position has been updated with your new files.
            </div>

            <div class="q-my-md">
              The updated documents have been received and will be reviewed for next steps.
            </div>

            <div class="text-grey-7 q-mt-lg">Updated on: {{ getCurrentDateTime() }}</div>
          </template>
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

    <!-- ✅ NEW: Update Cancelled Dialog -->
    <q-dialog v-model="updateCancelledDialog" persistent>
      <q-card class="confirmation-dialog">
        <!-- Blue header with info icon -->
        <div class="header-blue">
          <div class="icon-container">
            <q-icon name="info" size="28px" color="blue" />
          </div>
        </div>

        <!-- Cancelled title -->
        <div class="dialog-title">
          <div class="text-h5 text-blue text-center text-weight-bold">Update Cancelled</div>
          <div class="text-subtitle1 text-center text-grey q-mt-sm">
            Your previous application will remain unchanged
          </div>
        </div>

        <q-separator />

        <!-- Cancelled content -->
        <div class="dialog-content text-center">
          <div class="q-mb-md">
            <q-icon name="check_circle" size="48px" color="blue" class="q-mb-md" />
            <div class="text-body1">
              Application update cancelled. Your previous application for
              <span class="text-blue text-weight-bold">
                {{ selectedJob?.Position || 'Computer Programmer II' }}
              </span>
              will remain unchanged.
            </div>
          </div>

          <div class="q-my-md text-body2 text-grey-7">
            Temporary data has been removed. You can apply to other positions or update later if
            needed.
          </div>

          <div class="text-caption text-grey-7 q-mt-lg">
            Cancelled at: {{ getCurrentDateTime() }}
          </div>
        </div>

        <!-- Action button -->
        <div class="dialog-actions">
          <q-btn unelevated label="OK" color="blue" @click="closeCancelledDialog" class="q-px-xl" />
        </div>
      </q-card>
    </q-dialog>

    <!-- NEW: Update Confirmation Modal for Already Applied -->
    <q-dialog v-model="updateConfirmationDialog" persistent @hide="stopConfirmationCountdown">
      <q-card class="confirmation-dialog">
        <!-- Orange header with info icon -->
        <div class="header-orange">
          <div class="icon-container">
            <q-icon name="info" size="28px" color="orange" />
          </div>
        </div>

        <!-- Confirmation title -->
        <div class="dialog-title">
          <div class="text-h5 text-orange text-center text-weight-bold">
            Application Already Submitted
          </div>
          <div class="text-subtitle1 text-center text-grey q-mt-sm">Update Your Application?</div>
        </div>

        <q-separator />

        <!-- Confirmation content -->
        <div class="dialog-content">
          <div class="q-mb-md text-body1">
            {{ confirmationMessage }}
          </div>

          <!-- Expiration Timer -->
          <div class="row items-center q-pa-md bg-orange-1 rounded-borders q-mb-md">
            <q-icon name="schedule" size="20px" color="orange" class="q-mr-sm" />
            <div class="text-body2">
              <span class="text-weight-bold">Expires in:</span>
              <span :class="isConfirmationExpired ? 'text-red' : 'text-orange'" class="q-ml-sm">
                {{
                  isConfirmationExpired
                    ? 'Expired'
                    : `${Math.floor(confirmationCountdown / 60000)}m ${Math.floor((confirmationCountdown % 60000) / 1000)}s`
                }}
              </span>
            </div>
          </div>

          <!-- Token info (optional, for transparency) -->
          <div class="text-caption text-grey-7 q-mb-lg">
            <span class="text-weight-bold">Confirmation Token:</span>
            <br />
            {{ confirmationToken.substring(0, 20) }}...
          </div>

          <div class="text-center text-grey-7">
            Your previous application will be updated with the newly submitted files.
          </div>
        </div>

        <!-- Action buttons -->
        <div class="dialog-actions">
          <q-btn
            flat
            label="NO, KEEP PREVIOUS"
            color="grey-7"
            @click="handleConfirmationChoice(false)"
            :disable="isConfirmationExpired || uploadingLoading"
            class="q-px-md"
          />
          <q-btn
            unelevated
            label="YES, UPDATE"
            color="orange"
            @click="handleConfirmationChoice(true)"
            :disable="isConfirmationExpired || uploadingLoading"
            :loading="uploadingLoading"
            class="q-px-md"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- Zip Instructions Modal Component -->
    <ZipInstructionModal
      v-model="showZipInstructions"
      @instruction-complete="handleInstructionComplete"
    />
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue';
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

  // ==================== UI STATE ====================
  const showZipInstructions = ref(false);
  const confirmDialog = ref(false);
  const uploadingLoading = ref(false);
  const zipFileInputRef = ref(null);
  const userClickedZipInput = ref(false);
  const nativeFileInput = ref(null);

  // ==================== SUCCESS DIALOG STATE ====================
  const successType = ref('new'); // 'new' or 'updated'

  // ==================== UPDATE CANCELLED DIALOG STATE ====================
  const updateCancelledDialog = ref(false);

  // ==================== UPDATE CONFIRMATION STATE ====================
  const updateConfirmationDialog = ref(false);
  const confirmationMessage = ref('');
  const confirmationExpiresAt = ref(null);
  const confirmationToken = ref('');
  const confirmationCountdown = ref(0);
  const isConfirmationExpired = ref(false);
  let confirmationCountdownInterval = null;

  // ==================== JOB DATA STATE ====================
  const selectedJob = ref(null);
  const selectedCriteria = ref(null);

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Format file size in human-readable format
   */
  function formatFileSize(bytes) {
    if (bytes === undefined || bytes === null) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get current date and time formatted
   */
  function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * Start countdown timer for confirmation expiration
   */
  function startConfirmationCountdown() {
    if (confirmationCountdownInterval) {
      clearInterval(confirmationCountdownInterval);
    }

    confirmationCountdownInterval = setInterval(() => {
      const now = new Date();
      if (!confirmationExpiresAt.value) {
        clearInterval(confirmationCountdownInterval);
        return;
      }

      const diffMs = confirmationExpiresAt.value.getTime() - now.getTime();

      if (diffMs <= 0) {
        clearInterval(confirmationCountdownInterval);
        isConfirmationExpired.value = true;
        confirmationCountdown.value = 0;
        // Auto-close modal after expiration
        setTimeout(() => {
          updateConfirmationDialog.value = false;
          $q.notify({
            type: 'negative',
            message: 'Confirmation link has expired. Please try submitting again.',
            position: 'top',
          });
        }, 2000);
      } else {
        confirmationCountdown.value = diffMs;
      }
    }, 1000);
  }

  /**
   * Stop countdown timer
   */
  function stopConfirmationCountdown() {
    if (confirmationCountdownInterval) {
      clearInterval(confirmationCountdownInterval);
      confirmationCountdownInterval = null;
    }
  }

  /**
   * Generate reference number for success display
   */
  function generateReferenceNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${timestamp}-${random}`;
  }

  /**
   * Download Excel form template
   */
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

  /**
   * Handle ZIP file input click - show instructions first
   */
  function handleZipFileClick() {
    userClickedZipInput.value = true;
    showZipInstructions.value = true;

    nextTick(() => {
      if (zipFileInputRef.value) {
        nativeFileInput.value = zipFileInputRef.value.$el.querySelector('input[type="file"]');
      }
    });
  }

  /**
   * Open ZIP instructions via info button
   */
  function openZipInstructions() {
    userClickedZipInput.value = false;
    showZipInstructions.value = true;
  }

  /**
   * Handle when user completes ZIP instructions
   */
  async function handleInstructionComplete() {
    showZipInstructions.value = false;

    if (userClickedZipInput.value) {
      userClickedZipInput.value = false;
      await nextTick();

      setTimeout(() => {
        try {
          if (zipFileInputRef.value) {
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

  // ==================== JOB DATA FUNCTIONS ====================

  /**
   * Refresh job details from API
   */
  const refreshJobDetails = async (showLoading = false) => {
    if (showLoading) {
      jobPostStore.loading = true;
    }

    try {
      console.log('Refreshing job details for ID:', id);

      let jobDetails = await jobPostStore.fetchJobDetails(id);

      if (!jobDetails && jobPostStore.jobPosts) {
        console.log('Using data from store.jobPosts');
        jobDetails = jobPostStore.jobPosts;
      }

      if (!jobDetails) {
        throw new Error('No job details returned from server');
      }

      console.log('Successfully refreshed job details:', jobDetails);

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

  // ==================== COMPUTED PROPERTIES ====================

  const uploadedFile = computed({
    get: () => uploadStore.uploadedFile,
    set: (val) => (uploadStore.uploadedFile = val),
  });

  const uploadedZipFile = computed({
    get: () => uploadStore.uploadedZipFile,
    set: (val) => (uploadStore.uploadedZipFile = val),
  });

  const successDialog = computed({
    get: () => uploadStore.successDialog,
    set: (val) => (uploadStore.successDialog = val),
  });

  // ==================== APPLICATION SUBMISSION FUNCTIONS ====================

  /**
   * Called by APPLY NOW button - open confirmation dialog
   */
  async function submitApplication() {
    if (!uploadStore.uploadedFile || !uploadStore.uploadedZipFile) {
      $q.notify({
        type: 'negative',
        message: 'Please attach both Excel and ZIP files before submitting.',
        position: 'top',
      });
      return;
    }
    confirmDialog.value = true;
  }

  /**
   * Process initial submission - sends files to API
   */
  async function processSubmission() {
    confirmDialog.value = false;
    uploadingLoading.value = true;

    try {
      console.log('Current selected job (local):', selectedJob.value);
      console.log('Current selected job (store):', uploadStore.selectedJob);
      console.log('Excel file:', uploadStore.uploadedFile?.name);
      console.log('ZIP file:', uploadStore.uploadedZipFile?.name);

      const response = await uploadStore.processSubmission();
      console.log('Raw response from store:', response);

      const data = response?.data ?? response;
      const message = data?.message ?? uploadStore.errorMessage ?? '';

      if (data?.success === true) {
        // Success: Set type to 'new' and show success dialog (NO TOAST)
        successType.value = 'new';
        setTimeout(() => {
          uploadStore.successDialog = true;
        }, 500);
      } else if (
        data?.success === false &&
        message ===
          "You've already applied for this job. Do you want to update your previous application?"
      ) {
        // Already applied: Show update confirmation modal
        console.log('Opening update confirmation dialog');
        confirmationMessage.value = message;
        confirmationToken.value = data?.confirmation_token || '';
        const expiresInMinutes = data?.expires_in_minutes || 10;
        confirmationExpiresAt.value = new Date(Date.now() + expiresInMinutes * 60 * 1000);
        isConfirmationExpired.value = false;
        updateConfirmationDialog.value = true;

        startConfirmationCountdown();

        jobPostStore.setConfirmationToken(confirmationToken.value, expiresInMinutes);
      } else {
        // Other failures: Show ONLY error toast
        $q.notify({
          type: 'negative',
          message: message || 'Failed to upload submission',
          position: 'top',
        });
        console.warn('Submission failed:', message);
      }

      if (data?.id) {
        console.log('Job batch response ID:', data.id);
      }
    } catch (err) {
      console.error('Submission process error:', err);
      // Show ONLY error toast
      $q.notify({
        type: 'negative',
        message: 'Network error. Please try again.',
        position: 'top',
      });
    } finally {
      uploadingLoading.value = false;
    }
  }

  /**
   * ✅ Handle confirmation choice (Yes/No for update)
   */
  async function handleConfirmationChoice(confirmed) {
    stopConfirmationCountdown();

    if (isConfirmationExpired.value) {
      $q.notify({
        type: 'negative',
        message: 'Confirmation link has expired. Please try submitting again.',
        position: 'top',
      });
      updateConfirmationDialog.value = false;
      return;
    }

    uploadingLoading.value = true;

    try {
      const payload = {
        confirm_update: confirmed ? 1 : 0,
        confirmation_token: confirmationToken.value,
      };

      console.log('Sending confirmation payload:', payload);

      const response = await jobPostStore.updateConfirmation(payload);
      const data = response?.data ?? response;

      if (data?.success === true) {
        updateConfirmationDialog.value = false;

        // ✅ Check if user said YES (update) or NO (keep previous)
        if (confirmed) {
          // YES - UPDATE: Show update success dialog
          successType.value = 'updated';
          setTimeout(() => {
            uploadStore.successDialog = true;
          }, 500);
        } else {
          // NO - KEEP PREVIOUS: Show cancelled dialog
          updateCancelledDialog.value = true;
        }
      } else {
        // Failure: Show ONLY error toast
        $q.notify({
          type: 'negative',
          message: data?.message || 'Failed to process confirmation',
          position: 'top',
        });
      }
    } catch (err) {
      console.error('Error during confirmation:', err);
      // Show ONLY error toast
      $q.notify({
        type: 'negative',
        message: 'An error occurred while processing your confirmation. Please try again.',
        position: 'top',
      });
    } finally {
      uploadingLoading.value = false;
    }
  }

  /**
   * Close success dialog and redirect
   */
  function closeSuccessDialog() {
    uploadStore.reset();
    successDialog.value = false;
    router.push('/jobList');
  }

  /**
   * ✅ Close cancelled dialog and reset files
   */
  function closeCancelledDialog() {
    updateCancelledDialog.value = false;
    uploadStore.reset();
    // Reset file inputs
    uploadedFile.value = null;
    uploadedZipFile.value = null;
  }

  // ==================== LIFECYCLE HOOKS ====================

  /**
   * On component mount: load job details
   */
  onMounted(async () => {
    if (!id) {
      console.error('No job ID provided in route params');
      toast.error('No job ID provided');
      router.push('/job-post');
      return;
    }

    try {
      await refreshJobDetails(true);

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

  /**
   * On component unmount: cleanup timers
   */
  onBeforeUnmount(() => {
    stopConfirmationCountdown();
  });
</script>

<style scoped>
  /* ==================== RESPONSIVE LAYOUT ====================*/
  @media (max-width: 768px) {
    .q-card {
      margin-bottom: 20px;
    }
  }

  /* ==================== PROCESS CARDS STYLING ====================*/
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

  .card-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
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

  .step-title {
    margin-bottom: 12px;
    font-weight: 600;
  }

  .step-description {
    color: #666;
    margin-bottom: 20px;
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

  /* ==================== CONFIRMATION DIALOG STYLING ====================*/
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

  .header-blue {
    background-color: #2196f3;
    height: 100px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .header-orange {
    background-color: #ff9800;
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
    gap: 12px;
  }

  .position-text {
    font-size: 12px;
  }

  .rounded-borders {
    border-radius: 8px;
  }

  /* ==================== UTILITY CLASSES ====================*/
  .bg-orange-1 {
    background-color: #ffe0b2;
  }

  .text-red {
    color: #f44336;
  }
</style>
