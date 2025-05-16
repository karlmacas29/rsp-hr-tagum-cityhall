<template>
  <q-page padding>
    <!-- Header with back button and title -->
    <div class="row justify-between items-center q-my-md q-mx-xl q-px-xl">
      <div class="row items-center">
        <q-btn icon="arrow_back" round class="bg-primary text-white" to="/jobList" />
        <div class="column q-ml-sm">
          <div class="text-h4 text-bold q-mb-none">Job details</div>
          <div class="text-subtitle1 text-grey">Available Job Posts / Job details</div>
        </div>
      </div>
      <div class="column">
        <q-badge class="text-h6 q-mb-xs bg-blue">
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
        </q-badge>
      </div>
    </div>

    <div class="row justify-evenly items-center">
      <!-- Main content card -->
      <q-card class="col-8" flat bordered>
        <q-card-section>
          <!-- Job header with logo and info -->
          <div class="row items-center">
            <q-avatar color="primary" text-color="white" size="75px">
              {{ selectedJob?.Position ? selectedJob.Position.charAt(0) : 'N' }}
            </q-avatar>
            <div class="column q-ml-md" style="flex-grow: 1">
              <div class="text-green text-h5 text-weight-bold">
                {{ selectedJob?.Position || 'No Position' }}
              </div>
              <div class="row items-center">
                <q-icon name="business" size="xs" color="grey-8" />
                <span class="q-ml-xs text-body1 text-grey-8">
                  {{ selectedJob?.Office || 'No Office' }}
                </span>
              </div>
              <div class="row items-center">
                <q-icon name="business" size="xs" color="grey-8" />
                <span class="q-ml-xs text-body1 text-grey-8">
                  {{ selectedJob?.Division || 'No Division' }}
                </span>
              </div>
              <div class="row items-center">
                <q-icon name="business" size="xs" color="grey-8" />
                <span class="q-ml-xs text-body1 text-grey-8">
                  {{ selectedJob?.Section || 'No Section' }}
                </span>
              </div>
              <div class="row items-center">
                <q-icon name="business" size="xs" color="grey-8" />
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

        </div>
      </q-card-section>
      <q-separator />
      <!-- Qualification Standards section -->
      <q-card-section >
        <div class="text-h5 text-bold text-green">Qualification Standards/Requirements</div>
        <div>
          <div class="text-weight-bold q-mt-sm">BRIEF QUALIFICATIONS:</div>
          <div class="text-body2">
            <ol v-if="selectedCriteria" class="q-pl-md text-body1 q-gutter-sm">
              <li>
                <q-badge>Education</q-badge>
                - {{ selectedCriteria?.Education || 'None' }}
              </li>
              <li>
                <q-badge>Experience</q-badge>
                - {{ selectedCriteria?.Experience || 'None' }}
              </li>
              <li>
                <q-badge>Training</q-badge>
                - {{ selectedCriteria?.Training || 'None' }}
              </li>
              <li>
                <q-badge>Eligibility</q-badge>
                - {{ selectedCriteria?.Eligibility || 'None' }}
              </li>
            </ol>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <!-- Position section -->
      <q-card-section>
        <div class="text-h5 text-bold text-green">Position</div>
        <div class="text-body2">Computer Programmer II</div>
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
  import { onMounted, ref } from 'vue';
  import { useJobPostStore } from 'stores/jobPostStore';

  const jobPostStore = useJobPostStore();

  const route = useRoute();
  const jobId = route.params.id;

  // Job details
  const selectedJob = ref([]);
  const selectedCriteria = ref([]);

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

    // Create dynamic filename based on position
    const position = selectedJob.value?.Position || 'Job';
    const formattedPosition = position.replace(/\s+/g, '_');
    a.download = `${formattedPosition}_Application_Form.xlsx`;

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

  onMounted(async () => {
    // Fetch job details if needed
    await jobPostStore.fetchJobPostById(jobId).then((job) => {
      selectedJob.value = job;
    });
    await jobPostStore.fetchCriteriaById(jobId).then((criteria) => {
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
</style>
