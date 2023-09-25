<template>
  <el-dialog v-model="dialogActive" title="Create a recognition" :before-close="resetAndClose">
    <el-steps v-if="currentStep < 4" :active="currentStep" finish-status="success" align-center>
      <el-step title="Step 1" description="Choose an employee"/>
      <el-step title="Step 2" description="Value of recognition"/>
      <el-step title="Step 3" description="Detail"/>
    </el-steps>
      <!-- employee info -->
      <div class="center" v-if="currentStep < 4">
        <el-avatar :size="50" src="https://emplt" @error="errorHandler" >
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
          <el-descriptions :column="3" size="small" class="mt-4">
            <el-descriptions-item label="Employee Name">
              {{selectedEmployee.userName}}
            </el-descriptions-item>
            <el-descriptions-item label="Email">
              {{selectedEmployee.userMail}}
            </el-descriptions-item>
            <el-descriptions-item label="Role">
              <span v-if="selectedEmployee.userRole != undefined">{{ UserRole[selectedEmployee.userRole].value }}</span>
              <span v-else>{{ selectedEmployee.userRole }}</span>
            </el-descriptions-item>
          </el-descriptions>
      </div>
      <div v-if="currentStep == 1">
        <el-input
          v-model="searchName"
          placeholder="Input employee name to search"
          class="w-20 m-2"
          size="large"
          style="width: 50%;text-align: left;"
          :prefix-icon="Search"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
      <!-- step one section -->
      <div v-if="currentStep == 1" class="infinite-list-wrapper" style="overflow: auto">
        <el-row :gutter="12" v-for="emp in employeeList" :key="emp.id" @click="selectEmployee(emp)" style="padding-top: 5px;">
          <el-col>
            <el-card shadow="hover"
            :style="[emp.id == recognition.recognitionUserId ? 'background-color: lightblue' : '']"
            >
              <div style="display: flex;">
                <div>
                  <el-avatar :size="50" :src="emp.avatarUrl" @error="errorHandler" >
                    <img
                      src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                    />
                  </el-avatar>
                </div>
                <div style="padding-left: 10px; text-align: left;">
                  <span>{{ emp.userName }}</span><br/>
                  <span>{{ emp.userMail }}</span><br/>
                  <span>{{ UserRole[emp.userRole].value }}</span><br/>
                </div>

              </div>
            </el-card>
          </el-col>
        </el-row>
        <p v-if="more" @click="getUsers('load more')">Click to load more</p>
      </div>

      <!-- step two section -->
      <div v-if="currentStep == 2" class="center">
        <el-select v-model="recognition.point" class="m-2" placeholder="Select point to recognize" size="large" style="width: 40%;" @select="nextActive == true">
          <el-option
            v-for="item in RecognitionPoint"
            :key="item.code"
            :label="item.value"
            :value="item.code"
          />
        </el-select>
      </div>

      <!-- step three section -->
      <div v-if="currentStep == 3" class="center">
        <el-input
          v-model="recognition.detail"
          :autosize="{ minRows: 3, maxRows: 6 }"
          type="textarea"

          placeholder="Please share the reason"
        />
      </div>
      <!-- finish section -->
      <div v-if="currentStep == 4" class="center">
        <el-icon size="100" color="green"><SuccessFilled /></el-icon>
        <div class="center">
          <span style="font-size: 20px;">Recognition has been created and sent to {{ selectedEmployee.userName }}</span>
        </div>
      </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="currentStep < 4" :disabled="currentStep==0" @click="currentStep--">
          Previous
        </el-button>
        <el-button :disabled="!nextActive" type="primary" @click="next">
          {{ nextText }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"

export default defineComponent({
  props: {
    timelineList: [],

  },
  setup(props, { emit }) {

  }
})
const nextActive = computed(() => (
  currentStep.value == 1 && recognition.value.recognitionUserId)
  || (currentStep.value == 2 && recognition.value.point)
  || (currentStep.value == 3 && recognition.value.detail)
  || currentStep.value == 4
)

const nextText = computed(() => {
  if (currentStep.value < 3) return 'Next'
  else if (currentStep.value == 3) return 'Submit'
  else return 'Close'
})

const currentStep = ref(1)
</script>