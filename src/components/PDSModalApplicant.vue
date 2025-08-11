<template>
  <!-- PDS Modal -->
  <q-dialog v-model="localShowModal" persistent class="pds-dialog">
    <q-card class="pds-container">
      <q-card-section class="row justify-between text-black q-mb-sm">
        <div class="text-h4 text-bold items-center flex">
          Personal Data Sheet (PDS)

          <q-badge class="bg-blue">View PDS</q-badge>
        </div>
        <q-btn icon="close" flat round dense class="close-btn" @click="closeModal" />
      </q-card-section>

      <q-card-section class="q-pa-none flex column" style="flex: 1; overflow: hidden">
        <!-- Main Content Area -->
        <div class="row q-pa-sm q-gutter-x-sm" style="flex: 1; overflow: hidden">
          <!-- Left Side - Tabs Navigation -->
          <q-card class="col-3 bg-white q-pa-sm" style="overflow: hidden">
            <q-scroll-area style="height: 100%" class="q-pr-md">
              <q-list>
                <q-item
                  v-for="tab in tabs"
                  :key="tab.name"
                  :clickable="!jobStore.loading"
                  :active="currentTab === tab.name"
                  @click="!jobStore.loading && (currentTab = tab.name)"
                  active-class="active-tab"
                  class="tab-item q-py-sm"
                  style="border-radius: 5px"
                >
                  <q-item-section avatar>
                    <q-icon name="check_circle" color="green" v-if="isTabCompleted(tab.name)" />
                    <q-icon name="circle" color="grey" v-else />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ tab.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-card>

          <!-- Right Side - Content Area -->
          <q-card class="col" style="overflow: hidden">
            <q-scroll-area style="height: 100%">
              <div
                v-if="jobStore.loading"
                style="height: 70vh"
                class="column items-center justify-center"
              >
                <q-spinner-dots size="40px" color="primary" />
                <div class="q-mt-sm text-grey">Loading PDS...</div>
              </div>
              <!-- <div
                v-else-if="jobStore.error"
                style="height: 70vh"
                class="column items-center justify-center"
              >
                <q-icon name="error" color="negative" size="40px" />
                <div class="q-mt-sm text-negative">Failed to load PDS data.</div>
                <q-btn color="primary" class="q-mt-md" label="Retry" @click="fetchApplicantData" />
              </div> -->
              <div v-else>
                <!-- Personal Information -->
                <div v-if="currentTab === 'personal'" class="q-pa-md">
                  <Personal_Information :personal="applicantData" />
                </div>
                <div v-else-if="currentTab === 'family'" class="q-pa-md">
                  <Family_Background :family="applicantData" />
                </div>
                <div v-else-if="currentTab === 'education'" class="q-pa-md">
                  <Educational_Background :educ="applicantData?.education || []" />
                </div>
                <div v-else-if="currentTab === 'civilService'" class="q-pa-md">
                  <Civil_Service_Eligibility :eligibility="applicantData?.eligibity || []" />
                </div>
                <div v-else-if="currentTab === 'work'" class="q-pa-md">
                  <Work_Experience :experience="applicantData?.work_experience || []" />
                </div>
                <div v-else-if="currentTab === 'voluntary'" class="q-pa-md">
                  <Voluntary_Work :voluntary="applicantData?.voluntary_work || []" />
                </div>
                <div v-else-if="currentTab === 'training'" class="q-pa-md">
                  <Training_Interventions :ldData="applicantData?.training || []" />
                </div>
                <div v-else-if="currentTab === 'skills'" class="q-pa-md">
                  <Special_Skills_Hobbies :skills="applicantData?.skills || []" />
                </div>
                <div v-else-if="currentTab === 'nonAcademic'" class="q-pa-md">
                  <Non_Academic :distinctions="applicantData?.academic || []" />
                </div>
                <div v-else-if="currentTab === 'membership'" class="q-pa-md">
                  <Membership_Association />
                </div>
                <div v-else-if="currentTab === 'other'" class="q-pa-md">
                  <Other_Information />
                </div>
                <div v-else-if="currentTab === 'references'" class="q-pa-md">
                  <References :references="applicantData?.reference || []" />
                </div>
                <!-- Placeholder for other tabs -->
                <div v-else class="q-pa-md">
                  <div class="text-h6 q-mb-md">
                    {{ tabs.find((t) => t.name === currentTab)?.label }}
                  </div>
                  <p>Content for {{ currentTab }} will be displayed here</p>
                </div>
              </div>
            </q-scroll-area>
          </q-card>
        </div>

        <!-- Footer with buttons -->
        <q-card-actions class="justify-end q-pa-md">
          <q-btn rounded label="Close" color="grey-7" @click="closeModal" class="q-mx-sm" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { useJobPostStore } from 'stores/jobPostStore.js';

  import Personal_Information from './Applicant_pds/Personal_Information.vue';
  import Family_Background from './Applicant_pds/Family_Background.vue';
  import Educational_Background from './Applicant_pds/Educational_Background.vue';
  import Civil_Service_Eligibility from './Applicant_pds/Civil_Service_Eligibility.vue';
  import Work_Experience from './Applicant_pds/Work_Experience.vue';
  import Voluntary_Work from './Applicant_pds/Voluntary_Work.vue';
  import Training_Interventions from './Applicant_pds/L_D_Interventions.vue';
  import Special_Skills_Hobbies from './Applicant_pds/Special_Skills_Hobbies.vue';
  import Non_Academic from './Applicant_pds/Non_Academic.vue';
  import Membership_Association from './Applicant_pds/Membership_Association.vue';
  import Other_Information from './Applicant_pds/Other_Information.vue';
  import References from './Applicant_pds/References_User.vue';

  const jobStore = useJobPostStore();

  const props = defineProps({
    modelValue: Boolean,
    applicant: {
      type: Object,
      default: () => ({
        nPersonalInfo_id: '',
        controlno: null,
        id: null,
        name: '',
        photo: '',
        position: '',
        status: 'Pending',
      }),
    },
  });

  const emit = defineEmits(['update:modelValue', 'close']);

  const localShowModal = ref(props.modelValue);
  const currentTab = ref('personal');

  const applicantData = computed(() => {
    let arr = jobStore.applicants || jobStore.applicant || [];
    if (arr.length && props.applicant && props.applicant.id) {
      return arr.find((a) => a.id === props.applicant.id) || {};
    }
    return {};
  });

  const tabs = ref([
    { name: 'personal', label: 'Personal Information' },
    { name: 'family', label: 'Family Background' },
    { name: 'education', label: 'Educational Background' },
    { name: 'civilService', label: 'Civil Service Eligibility' },
    { name: 'work', label: 'Work Experience' },
    { name: 'voluntary', label: 'Voluntary Work' },
    { name: 'training', label: 'L&D Interventions' },
    { name: 'skills', label: 'Special Skills & Hobbies' },
    { name: 'nonAcademic', label: 'Non-Academic' },
    { name: 'membership', label: 'Membership Association' },
    { name: 'other', label: 'Other Information' },
    { name: 'references', label: 'References' },
  ]);

  watch(
    () => localShowModal.value,
    (val) => {
      emit('update:modelValue', val);
    },
  );

  watch(
    () => props.modelValue,
    (val) => {
      localShowModal.value = val;
    },
  );

  const closeModal = () => {
    emit('update:modelValue', false);
    emit('close');
  };

  const isTabCompleted = (tabName) => {
    // Logic to determine if a tab is completed based on applicant data
    if (!applicantData.value) return false;
    switch (tabName) {
      case 'personal':
        return !!applicantData.value.firstname;
      case 'family':
        return !!(applicantData.value.family && applicantData.value.family.length > 0);
      case 'education':
        return applicantData.value.education && applicantData.value.education.length > 0;
      case 'civilService':
        return applicantData.value.eligibity && applicantData.value.eligibity.length > 0;
      case 'work':
        return (
          applicantData.value.work_experience && applicantData.value.work_experience.length > 0
        );
      case 'voluntary':
        return true; // Optional section
      case 'training':
        return applicantData.value.training && applicantData.value.training.length > 0;
      case 'skills':
        return applicantData.value.skills && applicantData.value.skills.length > 0;
      case 'nonAcademic':
        return true; // Optional section
      case 'membership':
        return true; // Optional section
      case 'other':
        return true; // Optional section
      case 'references':
        return true; // Optional section
      default:
        return false;
    }
  };
</script>

<style lang="scss" scoped>
  .pds-dialog {
    height: 100%;
  }

  .pds-container {
    width: 1000px;
    max-width: 95vw;
    height: 90vh;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .tab-container {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .tab-item {
    border-left: 3px solid transparent;
    border-radius: 0;
    margin-bottom: 4px;
  }

  .active-tab {
    background-color: #f0f8ff;
    border-left: 7px solid #21ba45;
    font-weight: bolder;
  }

  .form-title-container {
    padding: 8px 0;
    margin-bottom: 10px;
  }

  .field-label {
    color: #666;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .field-value {
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }

  .q-scroll-area {
    background-color: white;
  }

  /* Media queries for responsiveness */
  @media (max-height: 800px) {
    .pds-container {
      height: 95vh;
      max-height: 95vh;
    }

    .field-value {
      margin-bottom: 8px;
    }
  }

  @media (max-height: 600px) {
    .pds-container {
      height: 98vh;
      max-height: 98vh;
    }

    .form-title-container {
      margin-bottom: 5px;
    }

    .field-value {
      margin-bottom: 4px;
    }
  }
</style>
