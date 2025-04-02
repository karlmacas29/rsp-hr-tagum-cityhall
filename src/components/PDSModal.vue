<template>
  <q-dialog v-model="localShowModal" persistent>
    <q-card class="q-pa-md" style="width: 800px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">Personal Data Sheet (PDS)</div>
      </q-card-section>

      <q-card-section>
        <div class="row">
          <div class="col-4">
            <q-img :src="user?.image " style="width: 100%; max-height: 150px; object-fit: cover" />
          </div>
          <div class="col-8">
            <div class="text-subtitle1"><strong>Full Name:</strong> {{ user.firstName }} {{ user.middleName }} {{ user.lastName }}</div>
            <div><strong>Date of Birth:</strong> {{ user.dob }}</div>
            <div><strong>Place of Birth:</strong> {{ user.placeOfBirth }}</div>
            <div><strong>Sex:</strong> {{ user.sex }}</div>
            <div><strong>Civil Status:</strong> {{ user.civilStatus }}</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-list bordered separator>
          <q-item v-for="(item, index) in pdsInfo" :key="index">
            <q-item-section>
              <q-item-label><strong>{{ item.label }}:</strong> {{ item.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="negative" @click="closeModal" />
        <q-btn flat label="Print" color="primary" @click="printPDS" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    user: Object
  },
  data() {
    return {
      localShowModal: this.showModal
    };
  },
  watch: {
    localShowModal(val) {
      this.$emit('update:showModal', val);
    },
    showModal(val) {
      this.localShowModal = val;
    }
  },
  computed: {
    pdsInfo() {
      return [
        { label: 'Gender Preference', value: this.user.genderPreference },
        { label: 'Height', value: this.user.height },
        { label: 'Weight', value: this.user.weight },
        { label: 'Blood Type', value: this.user.bloodType },
        { label: 'Telephone Number', value: this.user.telephoneNumber },
        { label: 'Cellphone Number', value: this.user.cellphoneNumber }
      ];
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:showModal', false);
    },
    printPDS() {
      window.print();
    }
  }
};
</script>
