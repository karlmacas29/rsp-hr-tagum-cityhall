<template>
  <q-dialog v-model="show" maximized persistent>
    <q-card class="bg-grey-2">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Employee Reports</div>
        <q-btn flat dense icon="close" @click="close" />
      </q-card-section>
      <q-separator />
      <q-tabs v-model="tab" class="bg-white" align="left" dense>
        <q-tab name="appointment" label="Appointment Report" />
        <q-tab name="certification" label="Certification" />
        <q-tab name="position" label="Position Description" />
      </q-tabs>
      <q-separator />
      <div ref="printArea" class="q-pa-md bg-white">
        <div v-show="tab === 'appointment'">
          <AppointmentReport :data="employee" />
        </div>
        <div v-show="tab === 'certification'">
          <CertificationPage :data="employee" />
        </div>
        <div v-show="tab === 'position'">
          <PositionDescriptionForm :data="employee" />
        </div>
      </div>
      <q-separator />
      <q-card-actions align="right">
        <q-btn color="primary" icon="print" label="Print" @click="printTab" />
        <q-btn flat label="Close" color="grey-7" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, watch, nextTick } from 'vue';
  import AppointmentReport from 'src/components/Reports/AppointmentReport.vue';
  import CertificationPage from 'src/components/Reports/CertificationReport.vue';
  import PositionDescriptionForm from 'src/components/Reports/PositionDescriptionReport.vue';

  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    employee: { type: Object, required: true },
  });
  const emit = defineEmits(['update:modelValue', 'close']);

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
  const printArea = ref(null);

  async function printTab() {
    await nextTick();
    const content = printArea.value.innerHTML;
    const win = window.open('', '', 'width=900,height=1200');
    win.document.write('<html><head><title>Print</title>');
    [...document.head.children].forEach((e) => win.document.write(e.outerHTML));
    win.document.write('<style>@media print{body{background:white;}}</style>');
    win.document.write('</head><body>');
    win.document.write(content);
    win.document.write('</body></html>');
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  }
</script>
