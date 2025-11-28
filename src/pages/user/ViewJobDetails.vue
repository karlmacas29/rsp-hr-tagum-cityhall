<template>
  <q-page class="job-details-page">
    <!-- Header with back button and title -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <q-btn
            icon="arrow_back"
            round
            class="back-btn bg-black text-white"
            :to="{ name: 'Joblist' }"
            :size="buttonSize"
          />
          <div class="header-text q-ml-sm">
            <div class="page-title text-bold">Job details</div>
            <div class="breadcrumb text-grey gt-xs">Available Job Posts / Job details</div>
          </div>
        </div>
        <div class="header-right">
          <q-chip
            v-if="!jobPostStore.loading"
            class="posted-chip text-white bg-blue"
            :size="chipSize"
          >
            <q-icon name="event" size="xs" class="q-mr-xs gt-xs" />
            <span class="chip-text">
              {{ formatPostedDate(selectedJob?.post_date) }}
            </span>
          </q-chip>
          <q-chip v-else class="posted-chip text-white bg-blue" :size="chipSize">
            <q-linear-progress rounded color="white" query class="loading-progress" />
          </q-chip>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Main content card -->
      <q-card v-if="!jobPostStore.loading" class="job-details-card" flat bordered>
        <q-card-section>
          <!-- Job header with logo and info -->
          <div class="job-header">
            <q-avatar color="primary" text-color="white" :size="avatarSize">
              {{ selectedJob?.Position ? selectedJob.Position.charAt(0) : 'N' }}
            </q-avatar>
            <div class="job-info q-ml-md">
              <div class="job-position text-green text-weight-bold">
                {{ selectedJob?.Position || 'No Position' }}
              </div>
              <div class="job-details-list">
                <div class="job-detail-item" v-if="selectedJob?.Office">
                  <q-icon name="business" size="xs" class="q-mr-xs" />
                  <span>{{ selectedJob.Office }}</span>
                </div>
                <div
                  class="job-detail-item"
                  v-if="selectedJob?.Division && selectedJob.Division !== 'N/A'"
                >
                  <q-icon name="corporate_fare" size="xs" class="q-mr-xs" />
                  <span>{{ selectedJob.Division }}</span>
                </div>
                <div
                  class="job-detail-item"
                  v-if="selectedJob?.Section && selectedJob.Section !== 'N/A'"
                >
                  <q-icon name="account_tree" size="xs" class="q-mr-xs" />
                  <span>{{ selectedJob.Section }}</span>
                </div>
                <div class="job-detail-item" v-if="selectedJob?.Unit && selectedJob.Unit !== 'N/A'">
                  <q-icon name="groups" size="xs" class="q-mr-xs" />
                  <span>{{ selectedJob.Unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Qualification Standards section -->
        <q-card-section class="qualifications-section">
          <div class="section-main-title text-green text-bold">
            Qualification Standards/Requirements
          </div>

          <div class="qualifications-grid q-mt-md">
            <q-card flat bordered class="qualification-card">
              <q-card-section>
                <q-badge color="primary" class="q-mb-sm">Education</q-badge>
                <div class="qualification-text">{{ selectedCriteria?.Education || 'None' }}</div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="qualification-card">
              <q-card-section>
                <q-badge color="secondary" class="q-mb-sm">Training</q-badge>
                <div class="qualification-text">{{ selectedCriteria?.Training || 'None' }}</div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="qualification-card">
              <q-card-section>
                <q-badge color="accent" class="q-mb-sm">Experience</q-badge>
                <div class="qualification-text">{{ selectedCriteria?.Experience || 'None' }}</div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="qualification-card">
              <q-card-section>
                <q-badge color="positive" class="q-mb-sm">Eligibility</q-badge>
                <div class="qualification-text">{{ selectedCriteria?.Eligibility || 'None' }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Position section -->
        <q-card-section class="position-section">
          <div class="section-title text-green">Position</div>
          <div class="section-content">{{ selectedJob?.Position || 'No Position' }}</div>
        </q-card-section>

        <q-separator />

        <!-- Application Process -->
        <q-card-section class="application-process-section bg-grey-1">
          <div class="process-main-title text-center text-weight-bold q-mb-lg">
            Application Process
          </div>

          <div class="process-steps">
            <!-- Step 1: Download Form -->
            <div class="process-step-wrapper">
              <div class="process-card bg-white">
                <div class="card-content">
                  <div class="step-number bg-green-1 text-green">1</div>
                  <div class="step-icon bg-green-1">
                    <q-icon name="file_download" :size="iconSize" color="green" />
                  </div>
                  <div class="step-title text-green">Download Application Form</div>
                  <div class="step-description">
                    Get the application template to fill with your details
                  </div>
                  <q-btn
                    label="DOWNLOAD TEMPLATE"
                    color="green"
                    class="action-btn full-width q-mt-md"
                    outline
                    @click="downloadExcelForm"
                    :size="buttonSize"
                  />
                </div>
              </div>
            </div>

            <!-- Step 2: Upload Completed Form -->
            <div class="process-step-wrapper">
              <div class="process-card bg-white">
                <div class="card-content">
                  <div class="step-number bg-blue-1 text-blue">2</div>
                  <div class="step-icon bg-blue-1">
                    <q-icon name="upload_file" :size="iconSize" color="blue" />
                  </div>
                  <div class="step-title text-blue">Upload Completed Form</div>
                  <div class="step-description">
                    Upload your filled application (XLSX format only)
                  </div>
                  <div class="file-input full-width q-mt-md">
                    <q-file
                      v-model="uploadedFile"
                      accept=".xlsx,.xls"
                      outlined
                      dense
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
            <div class="process-step-wrapper">
              <div class="process-card bg-white">
                <div class="card-content">
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
                    <q-icon name="folder_zip" :size="iconSize" color="orange" />
                  </div>
                  <div class="step-title text-orange">Upload Supporting Documents</div>
                  <div class="step-description">
                    Upload your supporting documents (ZIP format only)
                  </div>
                  <div class="file-input full-width q-mt-md">
                    <q-file
                      ref="zipFileInputRef"
                      v-model="uploadedZipFile"
                      accept=".zip"
                      outlined
                      dense
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
            <div class="process-step-wrapper">
              <div class="process-card bg-white">
                <div class="card-content">
                  <div class="step-number bg-purple-1 text-purple">4</div>
                  <div class="step-icon bg-purple-1">
                    <q-icon name="send" :size="iconSize" color="purple" />
                  </div>
                  <div class="step-title text-purple">Submit Application</div>
                  <div class="step-description">Review your application and submit when ready</div>
                  <q-btn
                    label="APPLY NOW"
                    color="purple"
                    class="action-btn full-width q-mt-md"
                    :disable="!uploadedFile || !uploadedZipFile"
                    @click="submitApplication"
                    :size="buttonSize"
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
      <q-card v-else flat bordered class="job-details-card">
        <q-card-section>
          <q-skeleton type="text" />
          <q-skeleton type="rect" height="200px" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Confirmation Dialog for Initial Submission -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card class="confirmation-dialog">
        <div class="header-green">
          <div class="icon-container">
            <q-icon name="assignment" size="28px" color="green" />
          </div>
        </div>

        <div class="dialog-title">
          <div class="dialog-main-title text-green text-center text-weight-bold">
            Confirm Application
          </div>
          <div class="dialog-subtitle text-center text-grey q-mt-sm">
            Please verify your submission details
          </div>
        </div>

        <q-separator />

        <div class="dialog-content">
          <div class="row items-center q-mb-md flex-wrap">
            <q-icon name="work" size="16px" class="text-green" />
            <div class="q-ml-sm">Position:</div>
            <div class="text-green text-weight-bold q-ml-sm position-text">
              {{ selectedJob?.Position || 'Computer Programmer II' }}
            </div>
          </div>

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

          <div class="text-center text-grey-7 q-mt-lg confirmation-note">
            By clicking Submit, you confirm that all information provided is accurate and complete.
          </div>
        </div>

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
      <q-card class="loading-overlay flex flex-center">
        <q-spinner size="50px" color="primary" />
        <div class="text-center q-mt-md loading-text">Uploading your application...</div>
      </q-card>
    </q-dialog>

    <!-- Success Dialog -->
    <q-dialog v-model="successDialog" persistent>
      <q-card class="confirmation-dialog">
        <div class="header-green">
          <div class="icon-container">
            <q-icon
              :name="successType === 'updated' ? 'refresh' : 'check_circle'"
              size="28px"
              color="green"
            />
          </div>
        </div>

        <div class="dialog-title">
          <div class="dialog-main-title text-green text-center text-weight-bold">
            {{ successType === 'updated' ? 'Application Updated!' : 'Application Successful!' }}
          </div>
          <div class="dialog-subtitle text-center text-grey q-mt-sm">
            {{
              successType === 'updated'
                ? 'Your application has been successfully updated'
                : 'Your application has been submitted'
            }}
          </div>
        </div>

        <q-separator />

        <div class="dialog-content text-center">
          <template v-if="successType === 'new'">
            <div class="q-mb-md success-message">
              Thank you for applying to the
              <span class="text-green text-weight-bold">
                {{ selectedJob?.Position || 'Computer Programmer II' }}
              </span>
              position.
            </div>

            <div class="q-my-md success-message">
              We have received your application and will contact you via sms or email for updates.
            </div>

            <div class="text-grey-7 q-mt-lg reference-number">
              Reference #: APP-{{ generateReferenceNumber() }}
            </div>
          </template>

          <template v-else-if="successType === 'updated'">
            <div class="q-mb-md success-message">
              Your application for the
              <span class="text-green text-weight-bold">
                {{ selectedJob?.Position || 'Computer Programmer II' }}
              </span>
              position has been updated with your new files.
            </div>

            <div class="q-my-md success-message">
              The updated documents have been received and will be reviewed for next steps.
            </div>

            <div class="text-grey-7 q-mt-lg reference-number">
              Updated on: {{ getCurrentDateTime() }}
            </div>
          </template>
        </div>

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

    <!-- Update Cancelled Dialog -->
    <q-dialog v-model="updateCancelledDialog" persistent>
      <q-card class="confirmation-dialog">
        <div class="header-blue">
          <div class="icon-container">
            <q-icon name="info" size="28px" color="blue" />
          </div>
        </div>

        <div class="dialog-title">
          <div class="dialog-main-title text-blue text-center text-weight-bold">
            Update Cancelled
          </div>
          <div class="dialog-subtitle text-center text-grey q-mt-sm">
            Your previous application will remain unchanged
          </div>
        </div>

        <q-separator />

        <div class="dialog-content text-center">
          <div class="q-mb-md">
            <q-icon name="check_circle" size="48px" color="blue" class="q-mb-md" />
            <div class="cancelled-message">
              Application update cancelled. Your previous application for
              <span class="text-blue text-weight-bold">
                {{ selectedJob?.Position || 'Computer Programmer II' }}
              </span>
              will remain unchanged.
            </div>
          </div>

          <div class="q-my-md cancelled-note text-grey-7">
            Temporary data has been removed. You can apply to other positions or update later if
            needed.
          </div>

          <div class="text-caption text-grey-7 q-mt-lg">
            Cancelled at: {{ getCurrentDateTime() }}
          </div>
        </div>

        <div class="dialog-actions">
          <q-btn unelevated label="OK" color="blue" @click="closeCancelledDialog" class="q-px-xl" />
        </div>
      </q-card>
    </q-dialog>

    <!-- Update Confirmation Modal -->
    <q-dialog v-model="updateConfirmationDialog" persistent @hide="stopConfirmationCountdown">
      <q-card class="confirmation-dialog">
        <div class="header-orange">
          <div class="icon-container">
            <q-icon name="info" size="28px" color="orange" />
          </div>
        </div>

        <div class="dialog-title">
          <div class="dialog-main-title text-orange text-center text-weight-bold">
            Application Already Submitted
          </div>
          <div class="dialog-subtitle text-center text-grey q-mt-sm">Update Your Application?</div>
        </div>

        <q-separator />

        <div class="dialog-content">
          <div class="q-mb-md update-message">
            {{ confirmationMessage }}
          </div>

          <div class="row items-center q-pa-md bg-orange-1 rounded-borders q-mb-md">
            <q-icon name="schedule" size="20px" color="orange" class="q-mr-sm" />
            <div class="timer-text">
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

          <div class="text-caption text-grey-7 q-mb-lg token-info">
            <span class="text-weight-bold">Confirmation Token:</span>
            <br />
            {{ confirmationToken.substring(0, 20) }}...
          </div>

          <div class="text-center text-grey-7 update-note">
            Your previous application will be updated with the newly submitted files.
          </div>
        </div>

        <div class="dialog-actions">
          <q-btn
            flat
            label="NO, KEEP PREVIOUS"
            color="grey-7"
            @click="handleConfirmationChoice(false)"
            :disable="isConfirmationExpired || uploadingLoading"
            class="q-px-md keep-btn"
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
  import { useEmailStore } from 'stores/emailStore';
  import { toast } from 'src/boot/toast';
  import ZipInstructionModal from 'components/ZipFileModal.vue';

  const $q = useQuasar();
  const route = useRoute();
  const router = useRouter();

  const uploadStore = useUser_upload();
  const jobPostStore = useJobPostStore();
  const emailStore = useEmailStore();

  const id = route.params.id;

  // ==================== RESPONSIVE COMPUTED ====================
  const buttonSize = computed(() => {
    if ($q.screen.xs) return 'sm';
    if ($q.screen.sm) return 'md';
    return 'md';
  });

  const chipSize = computed(() => {
    if ($q.screen.xs) return 'sm';
    return 'md';
  });

  const avatarSize = computed(() => {
    if ($q.screen.xs) return '50px';
    if ($q.screen.sm) return '60px';
    return '75px';
  });

  const iconSize = computed(() => {
    if ($q.screen.xs) return '24px';
    if ($q.screen.sm) return '30px';
    return '36px';
  });

  // ==================== USER EMAIL ====================
  const userEmail = computed(() => {
    return emailStore.getEmail || localStorage.getItem('userEmail') || '';
  });

  // ==================== UI STATE ====================
  const showZipInstructions = ref(false);
  const confirmDialog = ref(false);
  const uploadingLoading = ref(false);
  const zipFileInputRef = ref(null);
  const userClickedZipInput = ref(false);
  const nativeFileInput = ref(null);

  // ==================== SUCCESS DIALOG STATE ====================
  const successType = ref('new');

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

  function formatFileSize(bytes) {
    if (bytes === undefined || bytes === null) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

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

  function formatPostedDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if ($q.screen.xs) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    }
    return (
      'Posted ' +
      date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    );
  }

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

  function stopConfirmationCountdown() {
    if (confirmationCountdownInterval) {
      clearInterval(confirmationCountdownInterval);
      confirmationCountdownInterval = null;
    }
  }

  function generateReferenceNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${timestamp}-${random}`;
  }

  function downloadExcelForm() {
    const excelFileUrl = '/pdsv2.xlsx';
    const a = document.createElement('a');
    a.href = excelFileUrl;

    const position = selectedJob.value?.Position || 'Job';
    const formattedPosition = position.replace(/\s+/g, '_');
    a.download = `${formattedPosition}_Application_Form.xlsx`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleZipFileClick() {
    userClickedZipInput.value = true;
    showZipInstructions.value = true;

    nextTick(() => {
      if (zipFileInputRef.value) {
        nativeFileInput.value = zipFileInputRef.value.$el.querySelector('input[type="file"]');
      }
    });
  }

  function openZipInstructions() {
    userClickedZipInput.value = false;
    showZipInstructions.value = true;
  }

  async function handleInstructionComplete() {
    showZipInstructions.value = false;

    if (userClickedZipInput.value) {
      userClickedZipInput.value = false;
      await nextTick();

      setTimeout(() => {
        try {
          if (zipFileInputRef.value) {
            const qFile = zipFileInputRef.value;
            const input = qFile.$el.querySelector('input[type="file"]');
            if (input) {
              input.click();
              return;
            }
            if (qFile.pickFiles && typeof qFile.pickFiles === 'function') {
              qFile.pickFiles();
              return;
            }
            if (qFile.$refs && qFile.$refs.input) {
              qFile.$refs.input.click();
              return;
            }
          }
        } catch (error) {
          console.error('Error opening file picker:', error);
        }
      }, 300);
    }
  }

  // ==================== JOB DATA FUNCTIONS ====================

  const refreshJobDetails = async (showLoading = false) => {
    if (showLoading) {
      jobPostStore.loading = true;
    }

    try {
      let jobDetails = await jobPostStore.fetchJobDetails(id);

      if (!jobDetails && jobPostStore.jobPosts) {
        jobDetails = jobPostStore.jobPosts;
      }

      if (!jobDetails) {
        throw new Error('No job details returned from server');
      }

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

  async function submitApplication() {
    if (!uploadStore.uploadedFile || !uploadStore.uploadedZipFile) {
      $q.notify({
        type: 'negative',
        message: 'Please attach both Excel and ZIP files before submitting.',
        position: 'top',
      });
      return;
    }

    if (!userEmail.value) {
      $q.notify({
        type: 'negative',
        message: 'Email not found. Please verify your email again.',
        position: 'top',
      });
      emailStore.logout();
      router.push('/');
      return;
    }

    confirmDialog.value = true;
  }

  async function processSubmission() {
    confirmDialog.value = false;
    uploadingLoading.value = true;

    try {
      const response = await uploadStore.processSubmission(userEmail.value);
      const data = response?.data ?? response;
      const message = data?.message ?? uploadStore.errorMessage ?? '';

      if (data?.success === true) {
        successType.value = 'new';
        setTimeout(() => {
          uploadStore.successDialog = true;
        }, 500);
      } else if (
        data?.success === false &&
        message ===
          "You've already applied for this job. Do you want to update your previous application?"
      ) {
        confirmationMessage.value = message;
        confirmationToken.value = data?.confirmation_token || '';
        const expiresInMinutes = data?.expires_in_minutes || 10;
        confirmationExpiresAt.value = new Date(Date.now() + expiresInMinutes * 60 * 1000);
        isConfirmationExpired.value = false;
        updateConfirmationDialog.value = true;

        startConfirmationCountdown();

        jobPostStore.setConfirmationToken(confirmationToken.value, expiresInMinutes);
      } else if (data?.success === false) {
        $q.notify({
          type: 'negative',
          message: message || 'Failed to upload submission',
          position: 'top',
        });
      }
    } catch (err) {
      console.error('Submission process error:', err);
      $q.notify({
        type: 'negative',
        message: 'Network error. Please try again.',
        position: 'top',
      });
    } finally {
      uploadingLoading.value = false;
    }
  }

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
        email: userEmail.value,
      };

      const response = await jobPostStore.updateConfirmation(payload);
      const data = response?.data ?? response;

      if (data?.success === true) {
        updateConfirmationDialog.value = false;

        if (confirmed) {
          successType.value = 'updated';
          setTimeout(() => {
            uploadStore.successDialog = true;
          }, 500);
        } else {
          updateCancelledDialog.value = true;
        }
      } else {
        $q.notify({
          type: 'negative',
          message: data?.message || 'Failed to process confirmation',
          position: 'top',
        });
      }
    } catch (err) {
      console.error('Error during confirmation:', err);
      $q.notify({
        type: 'negative',
        message: 'An error occurred while processing your confirmation. Please try again.',
        position: 'top',
      });
    } finally {
      uploadingLoading.value = false;
    }
  }

  function closeSuccessDialog() {
    uploadStore.reset();
    successDialog.value = false;
    router.push('/jobList');
  }

  function closeCancelledDialog() {
    updateCancelledDialog.value = false;
    uploadStore.reset();
    uploadedFile.value = null;
    uploadedZipFile.value = null;
  }

  // ==================== LIFECYCLE HOOKS ====================

  onMounted(async () => {
    // Check if user is authenticated
    if (!emailStore.isAuthenticated && !emailStore.checkAuthStatus()) {
      toast.error('Please verify your email before applying');
      router.push('/');
      return;
    }

    if (!userEmail.value) {
      toast.error('Email not found. Please verify your email again.');
      emailStore.logout();
      router.push('/');
      return;
    }

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
      } else {
        throw new Error('Job ID is missing');
      }
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

  onBeforeUnmount(() => {
    stopConfirmationCountdown();
  });
</script>

<style scoped>
  /* ==================== BASE LAYOUT ====================*/
  .job-details-page {
    padding: 0;
    background: #f5f5f5;
  }

  .page-header {
    background: white;
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .header-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .back-btn {
    flex-shrink: 0;
  }

  .header-text {
    min-width: 0;
    flex: 1;
  }

  .page-title {
    font-size: 1.5rem;
    margin: 0;
    line-height: 1.2;
  }

  .breadcrumb {
    font-size: 0.875rem;
    margin-top: 4px;
    line-height: 1.2;
  }

  .header-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .posted-chip {
    white-space: nowrap;
  }

  .chip-text {
    font-size: 0.875rem;
  }

  .loading-progress {
    width: 80px;
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 24px auto;
    padding: 0 24px;
  }

  .job-details-card {
    border-radius: 12px;
    overflow: hidden;
  }

  /* ==================== JOB HEADER ====================*/
  .job-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .job-info {
    flex: 1;
    min-width: 0;
  }

  .job-position {
    font-size: 1.5rem;
    margin-bottom: 12px;
    word-wrap: break-word;
  }

  .job-details-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .job-detail-item {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 0.95rem;
  }

  /* ==================== SECTIONS ====================*/
  .position-section {
    padding: 20px 24px;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .section-content {
    font-size: 0.95rem;
    color: #666;
  }

  .qualifications-section {
    padding: 24px;
  }

  .section-main-title {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }

  .qualifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .qualification-card {
    border-radius: 8px;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .qualification-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .qualification-text {
    margin-top: 8px;
    font-size: 0.95rem;
    color: #444;
  }

  /* ==================== APPLICATION PROCESS ====================*/
  .application-process-section {
    padding: 32px 24px;
  }

  .process-main-title {
    font-size: 1.75rem;
  }

  .process-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .process-step-wrapper {
    min-width: 0;
  }

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
    font-size: 1.1rem;
    margin-bottom: 12px;
    font-weight: 600;
  }

  .step-description {
    color: #666;
    margin-bottom: 20px;
    font-size: 0.9rem;
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

  /* ==================== DIALOG STYLING ====================*/
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

  .dialog-main-title {
    font-size: 1.5rem;
  }

  .dialog-subtitle {
    font-size: 0.95rem;
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
    font-size: 0.9rem;
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
    flex-wrap: wrap;
  }

  .position-text {
    font-size: 0.95rem;
    word-break: break-word;
  }

  .confirmation-note,
  .success-message,
  .cancelled-message,
  .cancelled-note,
  .update-message,
  .update-note {
    font-size: 0.95rem;
  }

  .reference-number {
    font-size: 0.85rem;
  }

  .timer-text {
    font-size: 0.9rem;
  }

  .token-info {
    font-size: 0.8rem;
    word-break: break-all;
  }

  .loading-overlay {
    min-width: 200px;
    padding: 48px;
  }

  .loading-text {
    font-size: 1.1rem;
  }

  .rounded-borders {
    border-radius: 8px;
  }

  .bg-orange-1 {
    background-color: #ffe0b2;
  }

  .text-red {
    color: #f44336;
  }

  /* ==================== TABLET (600px - 1023px) ====================*/
  @media (max-width: 1023px) and (min-width: 600px) {
    .page-header {
      padding: 16px 20px;
    }

    .content-wrapper {
      padding: 0 20px;
      margin: 20px auto;
    }

    .page-title {
      font-size: 1.3rem;
    }

    .breadcrumb {
      font-size: 0.8rem;
    }

    .job-position {
      font-size: 1.3rem;
    }

    .section-main-title {
      font-size: 1.3rem;
    }

    .process-main-title {
      font-size: 1.5rem;
    }

    .qualifications-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .process-steps {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .step-title {
      font-size: 1rem;
    }

    .dialog-main-title {
      font-size: 1.3rem;
    }
  }

  /* ==================== MOBILE (<600px) ====================*/
  @media (max-width: 599px) {
    .page-header {
      padding: 12px 16px;
    }

    .header-content {
      flex-wrap: wrap;
      gap: 12px;
    }

    .header-left {
      flex: 1 1 auto;
      max-width: calc(100% - 120px);
    }

    .header-right {
      flex: 0 0 auto;
    }

    .page-title {
      font-size: 1.1rem;
    }

    .chip-text {
      font-size: 0.75rem;
    }

    .loading-progress {
      width: 60px;
    }

    .content-wrapper {
      padding: 0 16px;
      margin: 16px auto;
    }

    .job-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .job-info {
      width: 100%;
    }

    .job-position {
      font-size: 1.15rem;
    }

    .job-details-list {
      align-items: center;
    }

    .job-detail-item {
      font-size: 0.875rem;
    }

    .section-title {
      font-size: 1.1rem;
    }

    .section-main-title {
      font-size: 1.15rem;
    }

    .qualifications-section {
      padding: 16px;
    }

    .qualifications-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .application-process-section {
      padding: 20px 16px;
    }

    .process-main-title {
      font-size: 1.25rem;
      margin-bottom: 20px !important;
    }

    .process-steps {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .card-content {
      padding: 20px;
    }

    .step-title {
      font-size: 0.95rem;
    }

    .step-description {
      font-size: 0.85rem;
    }

    .dialog-main-title {
      font-size: 1.2rem;
    }

    .dialog-subtitle {
      font-size: 0.85rem;
    }

    .dialog-content {
      padding: 16px;
    }

    .file-card {
      max-width: 100%;
      margin-left: 0;
    }

    .dialog-actions {
      padding: 12px 16px;
      flex-direction: column;
    }

    .dialog-actions .q-btn {
      width: 100%;
    }

    .keep-btn {
      order: 2;
    }

    .confirmation-note,
    .success-message,
    .cancelled-message,
    .update-message {
      font-size: 0.875rem;
    }

    .cancelled-note,
    .update-note {
      font-size: 0.8rem;
    }
  }

  /* ==================== EXTRA SMALL (<360px) ====================*/
  @media (max-width: 359px) {
    .page-header {
      padding: 10px 12px;
    }

    .header-left {
      max-width: calc(100% - 100px);
    }

    .page-title {
      font-size: 1rem;
    }

    .chip-text {
      font-size: 0.7rem;
    }

    .content-wrapper {
      padding: 0 12px;
    }

    .job-position {
      font-size: 1.05rem;
    }

    .section-main-title {
      font-size: 1.05rem;
    }

    .process-main-title {
      font-size: 1.15rem;
    }

    .card-content {
      padding: 16px;
    }

    .step-title {
      font-size: 0.9rem;
    }

    .step-description {
      font-size: 0.8rem;
    }

    .action-btn {
      padding: 10px 16px;
      font-size: 0.85rem;
    }

    .dialog-main-title {
      font-size: 1.1rem;
    }
  }

  /* ==================== LARGE DESKTOP (>1440px) ====================*/
  @media (min-width: 1440px) {
    .page-header {
      padding: 20px 48px;
    }

    .content-wrapper {
      max-width: 1400px;
      padding: 0 48px;
    }

    .page-title {
      font-size: 1.75rem;
    }

    .job-position {
      font-size: 1.75rem;
    }

    .section-main-title {
      font-size: 1.75rem;
    }

    .process-main-title {
      font-size: 2rem;
    }
  }
</style>
