// Updated user_upload store with defensive checks in processSubmission
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { adminApi } from 'boot/axios_admin';

export const useUser_upload = defineStore('user_upload', () => {
  const isSubmitting = ref(false);
  const successDialog = ref(false);
  const errorMessage = ref('');
  const uploadedFile = ref(null);
  const uploadedZipFile = ref(null);
  const selectedJob = ref(null);

  const setSelectedJob = (job) => {
    selectedJob.value = job;
    console.log('Job set in upload store:', job);
  };

  const processSubmission = async () => {
    // Defensive validation - return a consistent error shape so callers can handle it uniformly
    if (!uploadedFile.value) {
      errorMessage.value = 'No Excel file selected.';
      return { data: { success: false, message: errorMessage.value } };
    }

    if (!uploadedZipFile.value) {
      errorMessage.value = 'No ZIP file selected.';
      return { data: { success: false, message: errorMessage.value } };
    }

    // Defensive: selectedJob might be null if consumer didn't set it
    if (!selectedJob.value?.id) {
      errorMessage.value = 'No job selected or missing ID';
      console.error('Selected job is missing in upload store:', selectedJob.value);
      return { data: { success: false, message: errorMessage.value } };
    }

    isSubmitting.value = true;
    errorMessage.value = '';
    successDialog.value = false;

    const formData = new FormData();
    formData.append('excel_file', uploadedFile.value);
    formData.append('zip_file', uploadedZipFile.value);
    formData.append('job_batches_rsp_id', selectedJob.value.id);

    console.log('Submitting with job ID:', selectedJob.value.id);
    console.log('Excel file:', uploadedFile.value.name);
    console.log('ZIP file:', uploadedZipFile.value.name);

    try {
      const response = await adminApi.post('/applicant/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Accept 4xx responses so we still get response.data and can show API errors
        validateStatus: (status) => status < 500,
      });

      console.log('Submission response:', response);
      if (response && response.data) {
        if (response.data.success === true) {
          successDialog.value = true;
        } else {
          errorMessage.value = response.data.message || 'Upload failed.';
        }
      } else {
        errorMessage.value = 'Unexpected response format.';
      }

      return response;
    } catch (err) {
      console.error('Submission error:', err.message || err);
      // Return normalized error shape instead of throwing so callers can handle uniformly
      return { data: { success: false, message: 'An error occurred' } };
    } finally {
      isSubmitting.value = false;
    }
  };

  const reset = () => {
    uploadedFile.value = null;
    uploadedZipFile.value = null;
    successDialog.value = false;
    errorMessage.value = '';
    selectedJob.value = null;
  };

  return {
    isSubmitting,
    successDialog,
    errorMessage,
    uploadedFile,
    uploadedZipFile,
    selectedJob,
    setSelectedJob,
    processSubmission,
    reset,
  };
});
