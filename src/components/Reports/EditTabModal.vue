<template>
  <q-dialog v-model="show" persistent>
    <q-card class="bg-white modal-card column no-wrap">
      <!-- Header -->
      <q-card-section class="row items-center justify-between q-pa-md bg-grey-2">
        <div class="text-h6">Edit Employee Information</div>
        <q-btn flat dense icon="close" @click="close" aria-label="Close dialog" />
      </q-card-section>

      <q-separator />

      <!-- Tabs -->
      <q-tabs v-model="tab" class="bg-white text-primary" align="left" dense>
        <q-tab name="appointment" label="Edit Appointment" />
        <q-tab name="certification" label="Edit Certification" />
        <q-tab name="position" label="Edit Position Description" />
      </q-tabs>

      <q-separator />

      <!-- Content -->
      <div class="q-pa-md overflow-auto" style="flex: 1; min-height: 0">
        <!-- Edit Appointment Tab -->
        <div v-if="tab === 'appointment'">
          <EditAppointmentForm :data="editableData" @update="handleUpdate" />
        </div>

        <!-- Edit Certification Tab -->
        <div v-else-if="tab === 'certification'">
          <EditCertificationForm :data="editableData" @update="handleUpdate" />
        </div>

        <!-- Edit Position Description Tab -->
        <div v-else-if="tab === 'position'">
          <EditPositionDescriptionForm :data="editableData" @update="handleUpdate" />
        </div>
      </div>

      <q-separator />

      <!-- Footer -->
      <q-card-actions align="right" class="q-pa-sm">
        <q-btn color="primary" icon="save" label="Save Changes" unelevated @click="saveChanges" />
        <q-btn flat label="Close" color="primary" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import EditAppointmentForm from 'src/components/Reports/EditAppointmentForm.vue';
  import EditCertificationForm from 'src/components/Reports/EditCertificationForm.vue';
  import EditPositionDescriptionForm from 'src/components/Reports/EditPositionDescriptionForm.vue';

  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    employee: { type: Object, required: true },
  });
  const emit = defineEmits(['update:modelValue', 'close', 'save']);

  const show = ref(props.modelValue);
  watch(
    () => props.modelValue,
    (val) => (show.value = val),
  );
  watch(show, (val) => emit('update:modelValue', val));

  function close() {
    show.value = false;
    emit('close');
  }

  const tab = ref('appointment');
  const editableData = ref({ ...props.employee.appointmentData });

  function handleUpdate(updatedData) {
    editableData.value = { ...updatedData };
  }

  function saveChanges() {
    emit('save', editableData.value);
    close();
  }
</script>

<style scoped>
  .modal-card {
    width: 100%;
    max-width: 900px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  }

  @media (max-width: 950px) {
    .modal-card {
      width: 95vw;
    }
  }
</style>
