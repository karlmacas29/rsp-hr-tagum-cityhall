<template>
    <q-page padding>
    <!-- Header with back button and title -->
    <div class="row justify-between items-center q-my-md q-px-xl">
      <div class="row items-center">
        <q-btn icon="arrow_back" flat round color="black" to="/jobList" />
        <div class="column q-ml-sm">
            <div class="text-h4 text-bold q-mb-none">Job details {{ jobId }}</div>
            <div class="text-subtitle1 text-grey">Available Job Posts / Job details</div>
        </div>
      </div>
      <div class="column">
            <div class="text-body q-mb-xs">Posted on 20 February 2025</div>
          </div>
    </div>
    
    <div class="row justify-evenly items-center">
        <!-- Main content card -->
    <q-card class="col-8" flat bordered>
      <q-card-section>
        <!-- Job header with logo and apply button -->
        <div class="row items-center justify-between">
          <div class="row items-start">
                <q-avatar color="primary" text-color="white" size="75px">
                                    C
                </q-avatar>
            <div class="column q-ml-md">
              <div class="text-green text-h5 text-weight-bold">COMPUTER PROGRAMMER II</div>
              <div class="row items-center">
                <q-icon name="business" size="xs" color="grey-8" />
                <span class="q-ml-xs text-caption text-grey-8">CITY OF INFORMATION COMMUNICATIONS & TECHNOLOGY MANAGEMENT OFFICE</span>
              </div>
              <div class="row items-center">
                <q-icon name="school" size="xs" color="grey-8" />
                <span class="q-ml-xs text-caption text-grey-8">COLLEGE GRADUATE</span>
              </div>
              <div class="text-caption text-grey q-mt-xs">5 Permanent</div>
            </div>
          </div>
          <q-btn label="APPLY NOW" color="green" />
        </div>
      </q-card-section>
      <q-separator />
      <!-- Office section -->
      <q-card-section>
        <div class="row justify-between">
          <div class="column">
            <div class="text-h5 text-bold text-green">Office</div>
            <div class="text-body2 text-uppercase">CITY OF INFORMATION COMMUNICATIONS & TECHNOLOGY MANAGEMENT OFFICE</div>
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
            <ol>
              <li>Must be graduated from 4-yr job relevance.</li>
              <li>Preferably MALE with relevant experience.</li>
              <li>Analytical, innovative and creative.</li>
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
  </q-page>
</template>
<script setup>
import { useRoute } from 'vue-router'


const route = useRoute()
// Get the job ID from the route parameters

const jobId = route.params.id

</script>

