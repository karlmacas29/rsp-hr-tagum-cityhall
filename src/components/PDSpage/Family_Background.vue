<template> 
    <div>
        <div class="text-h5 text-bold">Spouse’s Information</div>
    </div>
        <!-- 1 -->
        <div class="row q-col-gutter-md q-px-sm">
            <div class="col-6">
                <div class="row q-col-gutter-md">
                      <div class="col-12 row justify-between q-gutter-x-sm">
                        <div class="col-5">
                          <div class="field-label">Spouse's Firstname:</div>
                          <div class="field-value">Example</div>
                        </div>
                        <div class="col-5">
                          <div class="field-label">Spouse's Lastname:</div>
                          <div class="field-value">Example</div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Occupation:</div>
                        <div class="field-value">HouseWife</div>
                      </div>                      
                      <div class="col-12">
                        <div class="field-label">Employers/Business Name:</div>
                        <div class="field-value">N/A</div>
                      </div>
                      
                    </div>
                  </div>
                  
                  <div class="col-6">
                    <div class="row q-col-gutter-md">
                      <div class="col-12">
                        <div class="field-label">Spouse's Middlename:</div>
                        <div class="field-value">Example</div>
                      </div>
                      
                      <div class="col-12">
                        <div class="field-label">Business Address:</div>
                        <div class="field-value">N/A</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Business Telephone Number:</div>
                        <div class="field-value">N/A</div>
                      </div>
                      <!-- Note that duplicate fields were removed from the right side -->
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-md"/>
                <div>
                  <div class="text-h5 text-bold">Parent's Information</div>
                </div>

                <!-- 2 -->
                <div class="row q-col-gutter-md q-px-sm">
                <div class="col-6">
                <div class="row q-col-gutter-md">
                      <div class="col-12 row justify-between q-gutter-x-sm">
                        <div class="col-5">
                          <div class="field-label">Father's Firstname:</div>
                          <div class="field-value">Example</div>
                        </div>
                        <div class="col-5">
                          <div class="field-label">Father's Lastname:</div>
                          <div class="field-value">Example</div>
                        </div>
                      </div>
                      <div class="col-12 row justify-between q-gutter-x-sm">
                        <div class="col-5">
                          <div class="field-label">Mother's Firstname:</div>
                          <div class="field-value">Example</div>
                        </div>
                        <div class="col-5">
                          <div class="field-label">Mother's Lastname:</div>
                          <div class="field-value">Example</div>
                        </div>
                      </div>                    
                    </div>
                  </div>
                  
                  <div class="col-6">
                    <div class="row q-col-gutter-md">
                      <div class="col-12">
                        <div class="field-label">Father's Middlename:</div>
                        <div class="field-value">Example</div>
                      </div>
                      <div class="col-12">
                        <div class="field-label">Mother's Middlename:</div>
                        <div class="field-value">Example</div>
                      </div>
                      <!-- Note that duplicate fields were removed from the right side -->
                    </div>
                  </div>
                </div>
                
                <q-separator class="q-my-md"/>
                <div>
                  <div class="text-h5 text-bold">Children's Information</div>
                </div>

                <div class="q-pa-md">
                    <q-table
                        title="Children's List"
                        :rows="[
                            { name: 'John Doe', birthdate: '2010-01-01' },
                            { name: 'Jane Doe', birthdate: '2012-03-15' }
                        ]"
                        :columns="[
                            { name: 'name', label: 'Full Name', field: 'name', align: 'left' },
                            { name: 'birthdate', label: 'Date of Birth', field: 'birthdate', align: 'left' }
                        ]"
                        row-key="name"
                    />
                </div>
                <!-- Note that duplicate fields were removed from the right side -->                
        
</template>
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