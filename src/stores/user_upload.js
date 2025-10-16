// stores/user_upload.js
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
    if (!uploadedFile.value) {
      errorMessage.value = 'No Excel file selected.';
      return null;
    }

    if (!uploadedZipFile.value) {
      errorMessage.value = 'No ZIP file selected.';
      return null;
    }

    if (!selectedJob.value?.id) {
      errorMessage.value = 'No job selected or missing ID';
      console.error('Selected job:', selectedJob.value);
      return null;
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
      });

      console.log('Submission successful, response:', response.data);
      successDialog.value = true;
      return response.data;
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
        errorMessage.value = error.response.data?.message || 'Upload failed.';
      } else {
        errorMessage.value = 'Network error or server unavailable';
      }
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  const reset = () => {
    uploadedFile.value = null;
    uploadedZipFile.value = null;
    successDialog.value = false;
    errorMessage.value = '';
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
