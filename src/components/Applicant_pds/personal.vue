<!-- eslint-disable vue/multi-word-component-names -->
<!-- personal information -->
<template>
  <div class="row">
    <div class="col-3 flex justify-center items-center">
      <img
        v-if="props.personal?.Pics"
        :src="props.personal.Pics"
        class="bg-grey-4"
        style="width: 140px; height: 140px; border-radius: 10px; object-fit: cover"
        alt="Applicant Photo"
      />
      <div
        v-else
        class="bg-grey-4 flex justify-center items-center"
        style="width: 140px; height: 140px; border-radius: 10px"
        title="Applicant Photo"
      >
        <!-- You can put a placeholder icon or text here -->
        No Photo
      </div>
    </div>
    <div class="col">
      <div class="form-title-container">
        <div class="text-h5 text-bold q-px-sm flex items-center q-gutter-x-sm">
          Employee's Name
          <!-- <q-badge>Outsider</q-badge> -->
        </div>
      </div>

      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-3">
          <div class="field-label">First Name</div>
          <div class="field-value">{{ props.personal?.firstname || 'None' }}</div>
        </div>
        <div class="col-3">
          <div class="field-label">Last Name</div>
          <div class="field-value">{{ props.personal?.lastname || 'None' }}</div>
        </div>
        <div class="col-3">
          <div class="field-label">Middle Name</div>
          <div class="field-value">{{ props.personal?.middlename || 'None' }}</div>
        </div>
        <div class="col-3">
          <div class="field-label">Name Extension</div>
          <div class="field-value">{{ props.personal?.name_extension || 'None' }}</div>
        </div>
      </div>
    </div>
  </div>

  <q-separator class="q-my-md" />
  <div class="q-mb-sm">
    <div class="text-h5 text-bold">Additional Information</div>
  </div>
  <!-- 1 -->
  <div class="row q-col-gutter-md q-px-sm">
    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Date of Birth:</div>
          <div class="field-value">
            {{
              props.personal?.date_of_birth
                ? new Date(props.personal.date_of_birth).toLocaleDateString('en-US', {
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric',
                  })
                : 'None'
            }}
          </div>
        </div>
        <div class="col-12 row justify-between q-gutter-x-sm">
          <div class="col-5">
            <div class="field-label">Gender Preference:</div>
            <div class="field-value">{{ props.personal?.gender || 'None' }}</div>
          </div>
          <div class="col-5">
            <div class="field-label">Sex:</div>
            <div class="field-value">{{ props.personal?.sex || 'None' }}</div>
          </div>
        </div>
        <div class="col-12">
          <div class="field-label">Blood Type:</div>
          <div class="field-value">{{ props.personal?.blood_type || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Cellphone Number:</div>
          <div class="field-value">{{ props.personal?.cellphone_number || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Email:</div>
          <div class="field-value">{{ props.personal?.email_address || 'None' }}</div>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Place of Birth:</div>
          <div class="field-value">{{ props.personal?.place_of_birth || 'None' }}</div>
        </div>
        <div class="col-12 row justify-between q-gutter-x-sm">
          <div class="col-5">
            <div class="field-label">Height:</div>
            <div class="field-value">
              {{
                props.personal?.height
                  ? Number(props.personal.height).toFixed(2)
                  : 'None' || 'None'
              }}
            </div>
          </div>
          <div class="col-5">
            <div class="field-label">Weight:</div>
            <div class="field-value">
              {{
                props.personal?.weight
                  ? Number(props.personal.weight).toFixed(2)
                  : 'None' || 'None'
              }}
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="field-label">Civil Status:</div>
          <div class="field-value">{{ props.personal?.civil_status || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Telephone Number:</div>
          <div class="field-value">{{ props.personal?.telephone_number || 'None' }}</div>
        </div>
        <!-- Note that duplicate fields were removed from the right side -->
      </div>
    </div>
  </div>

  <q-separator class="q-my-md" />
  <div class="q-mb-sm">
    <div class="text-h5 text-bold">Goverment's ID</div>
  </div>

  <!-- 2 -->
  <div class="row q-col-gutter-md q-px-sm">
    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">GSIS ID No.:</div>
          <div class="field-value">{{ props.personal?.gsis_no || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">PHILHEALTH ID No.:</div>
          <div class="field-value">{{ props.personal?.philhealth_no || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">TIN No.:</div>
          <div class="field-value">{{ props.personal?.tin_no || 'None' }}</div>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">PAGIBIG ID No.:</div>
          <div class="field-value">{{ props.personal?.pagibig_no || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">SSS No.:</div>
          <div class="field-value">{{ props.personal?.sss_no || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Agency Employee No.:</div>
          <div class="field-value">{{ props.personal?.agency_employee_no || 'None' }}</div>
        </div>
        <!-- Note that duplicate fields were removed from the right side -->
      </div>
    </div>
  </div>

  <q-separator class="q-my-md" />
  <div class="q-mb-sm">
    <div class="text-h5 text-bold">Residential Address</div>
  </div>

  <!-- 3 -->
  <div class="row q-col-gutter-md q-px-sm">
    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Region:</div>
          <div class="field-value">{{ props.personal?.residential_house || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">City/Municipality:</div>
          <div class="field-value">{{ props.personal?.residential_city || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Subdivision/Village:</div>
          <div class="field-value">{{ props.personal?.residential_subdivision || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">House/Block/Lot No.:</div>
          <div class="field-value">{{ props.personal?.residential_street || 'None' }}</div>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Province:</div>
          <div class="field-value">{{ props.personal?.permanent_house || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Barangay:</div>
          <div class="field-value">{{ props.personal?.permanent_barangay || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Street/Purok:</div>
          <div class="field-value">{{ props.personal?.permanent_street || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Zip Code:</div>
          <div class="field-value">{{ props.personal?.permanent_zip || 'None' }}</div>
        </div>
        <!-- Note that duplicate fields were removed from the right side -->
      </div>
    </div>
  </div>

  <q-separator class="q-my-md" />
  <div class="q-mb-sm">
    <div class="text-h5 text-bold q-px-sm flex items-center q-gutter-x-sm">
      Permanent Address
      <!-- <q-badge>Same with Residential Address</q-badge> -->
    </div>
  </div>

  <!-- 4 -->
  <div class="row q-col-gutter-md q-px-sm">
    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
        <div class="field-label">Region:</div>
          <div class="field-value">{{ props.personal?.residential_house || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">City/Municipality:</div>
          <div class="field-value">{{ props.personal?.residential_city || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Subdivision/Village:</div>
          <div class="field-value">{{ props.personal?.residential_subdivision || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">House/Block/Lot No.:</div>
          <div class="field-value">{{ props.personal?.residential_street || 'None' }}</div>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Province:</div>
          <div class="field-value">{{ props.personal?.permanent_city || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Barangay:</div>
          <div class="field-value">{{ props.personal?.permanent_barangay || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Street/Purok:</div>
          <div class="field-value">{{ props.personal?.permanent_street || 'None' }}</div>
        </div>
        <div class="col-12">
          <div class="field-label">Zip Code:</div>
          <div class="field-value">{{ props.personal?.permanent_zip || 'None' }}</div>
        </div>
        <!-- Note that duplicate fields were removed from the right side -->
      </div>
    </div>
  </div>

  <q-separator class="q-my-md" />
  <div class="q-mb-sm">
    <div class="text-h5 text-bold">Other Information</div>
  </div>

  <!-- 5 -->
  <div class="row q-col-gutter-md q-px-sm">
    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Citizenship:</div>
          <div class="field-value">{{ props.personal?.citizenship || 'None' }}</div>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="field-label">Religious Sector:</div>
          <div class="field-value">{{ props.personal?.religion || 'None' }}</div>
        </div>

        <!-- Note that duplicate fields were removed from the right side -->
      </div>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps({
    personal: {
      type: Object,
      required: true,
    },
  });
</script>
<style scoped>
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
    border-left: 3px solid #21ba45;
    font-weight: 500;
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
