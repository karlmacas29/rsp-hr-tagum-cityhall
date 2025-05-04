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
                  clickable
                  :active="currentTab === tab.name"
                  @click="currentTab = tab.name"
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
                v-if="xPDS.loading"
                style="height: 70vh"
                class="column items-center justify-center"
              >
                <q-spinner-dots size="40px" color="primary" />
                <div class="q-mt-sm text-grey">Load PDS...</div>
              </div>
              <div v-else>
                <!-- Personal Information -->
                <div v-if="currentTab === 'personal'" class="q-pa-md">
                  <Personal_Information :personal="xPersonal" />
                </div>
                <div v-else-if="currentTab === 'family'" class="q-pa-md">
                  <Family_Background :family="xPersonal" />
                </div>
                <div v-else-if="currentTab === 'education'" class="q-pa-md">
                  <Educational_Background :educ="xEdu" />
                </div>
                <div v-else-if="currentTab === 'civilService'" class="q-pa-md">
                  <Civil_Service_Eligibility :eligibility="xEligibility" />
                </div>
                <div v-else-if="currentTab === 'work'" class="q-pa-md">
                  <Work_Experience :experience="xExperience" />
                </div>
                <div v-else-if="currentTab === 'voluntary'" class="q-pa-md">
                  <Voluntary_Work :voluntary="xVoluntary" />
                </div>
                <div v-else-if="currentTab === 'training'" class="q-pa-md">
                  <Training_Interventions :ldData="xTraining" />
                </div>
                <div v-else-if="currentTab === 'skills'" class="q-pa-md">
                  <Special_Skills_Hobbies :skills="xSkills" />
                </div>
                <div v-else-if="currentTab === 'nonAcademic'" class="q-pa-md">
                  <Non_Academic :distinctions="xAcademic" />
                </div>
                <div v-else-if="currentTab === 'membership'" class="q-pa-md">
                  <Membership_Association></Membership_Association>
                </div>
                <div v-else-if="currentTab === 'other'" class="q-pa-md">
                  <Other_Information></Other_Information>
                </div>
                <div v-else-if="currentTab === 'references'" class="q-pa-md">
                  <References :references="xReferences" />
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
          <q-btn unelevated label="Close" color="grey-7" @click="closeModal" class="q-mx-sm" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import Personal_Information from './PDSpage/Personal_Information.vue';
  import Family_Background from './PDSpage/Family_Background.vue';
  import Educational_Background from './PDSpage/Educational_Background.vue';
  import Civil_Service_Eligibility from './PDSpage/Civil_Service_Eligibility.vue';
  import Work_Experience from './PDSpage/Work_Experience.vue';
  import Voluntary_Work from './PDSpage/Voluntary_Work.vue';
  import Training_Interventions from './PDSpage/L_D_Interventions.vue';
  import Special_Skills_Hobbies from './PDSpage/Special_Skills_Hobbies.vue';
  import Non_Academic from './PDSpage/Non_Academic.vue';
  import Membership_Association from './PDSpage/Membership_Association.vue';
  import Other_Information from './PDSpage/Other_Information.vue';
  import References from './PDSpage/References_User.vue';
  import { usexPDS } from 'stores/xUserPDS';

  const xPDS = usexPDS();

  const xPersonal = ref({});
  const xEdu = ref({});
  const xEligibility = ref({});
  const xExperience = ref({});
  const xVoluntary = ref({});
  const xTraining = ref({});
  const xSkills = ref({});
  const xAcademic = ref({});
  const xReferences = ref({});

  const props = defineProps({
    modelValue: Boolean,
    applicant: {
      type: Object,
      default: () => ({
        name: '',
        photo: '',
        position: '',
        status: 'Pending',
        personalInfo: {
          dateOfBirth: '',
          placeOfBirth: '',
          sex: '',
          civilStatus: '',
          genderPreference: '',
          height: '',
          weight: '',
          bloodType: '',
          telephone: '',
          mobile: '',
        },
        education: [],
        experience: [],
        training: [],
        eligibility: [],
      }),
    },
  });

  const emit = defineEmits(['update:modelValue', 'close']);

  const localShowModal = ref(props.modelValue);
  const currentTab = ref('personal');
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
    const completedTabs = [
      'personal',
      'family',
      'education',
      'civilService',
      'work',
      'voluntary',
      'training',
      'skills',
      'nonAcademic',
      'membership',
      'other',
      'references',
    ];
    return completedTabs.includes(tabName);
  };

  onMounted(async () => {
    await xPDS.fetchxPDS(props.applicant.controlno);
    xPersonal.value = xPDS.xPDS.User[0];
    xEdu.value = xPDS.xPDS.Education;
    xEligibility.value = xPDS.xPDS.Eligibility;
    xExperience.value = xPDS.xPDS.Experience;
    xVoluntary.value = xPDS.xPDS.Voluntary;
    xTraining.value = xPDS.xPDS.Training;
    xSkills.value = xPDS.xPDS.Skills;
    xAcademic.value = xPDS.xPDS.Academic;
    xReferences.value = xPDS.xPDS.Reference;
  });
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
