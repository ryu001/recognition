<template>
  <!-- menue tabs -->
  <el-tabs v-model="activeTab" class="my-tabs" @tab-click="handleClick">
    <!-- home tab -->
    <el-tab-pane label="Home" name="first">
      <div style="width: 100%;">
        <div class="flex items-center">
          <el-avatar
            :size="32"
            class="mr-3"
            :src="loginUser.avatarUrl"
          />
          <span class="text-large font-600 mr-3"> {{ loginUser.userName }} </span>
        </div>
        <el-descriptions :column="3" size="small" class="mt-4">
          <el-descriptions-item label="My Points">
            <el-tag size="small">{{ homepagePoint }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Email">
            {{ loginUser.userMail }}
          </el-descriptions-item>
          <el-descriptions-item label="Role">{{ UserRole[loginUser.userRole].value }}</el-descriptions-item>
        </el-descriptions>
        <el-button type="primary" class="ml-2" @click="getUsers('init')" :icon="Plus">
          Create Recognition
        </el-button>
        <div style="border-top: 1px solid var(--el-border-color);text-align: center;"></div>
        <!-- User recognition activity timeline -->
        <div style="overflow: auto; height: 500px;">
          <div style="text-align: center;" v-if="activityList.length == 0">
            <p style="font-size: 20px;">No recognition activity</p>
          </div>
          <el-timeline v-else style="padding-top: 10px;">
            <el-timeline-item v-for="activity in activityList" :key="activity.recognitionId"  placement="top">
              <el-card>
                <h4>@{{ activity.recognitionUserName }}</h4>
                <p>{{ activity.recognitionDetail }}</p>
                <p>Created {{ activity.recognitionCreatedTime }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="My Recognitions" name="second">Recognition list(todo)</el-tab-pane>
  </el-tabs>

  <!-- recognition dialog -->
  <el-dialog v-model="dialogActive" title="Create a recognition" :before-close="resetAndClose">
    <!-- recognition needs three steps -->
    <el-steps v-if="currentStep < 4" :active="currentStep" finish-status="success" align-center>
      <el-step title="Step 1" description="Choose an employee"/>
      <el-step title="Step 2" description="Value of recognition"/>
      <el-step title="Step 3" description="Detail"/>
    </el-steps>
    <!-- employee info -->
    <div class="center" v-if="currentStep < 4 && selectedEmployee?.id">
      <el-avatar :size="50" src="https://emplt" @error="errorHandler" >
          <img :src="selectedEmployee?.avatarUrl"/>
      </el-avatar>
      <el-descriptions :column="3" size="small" class="mt-4">
        <el-descriptions-item label="Employee Name">
          {{selectedEmployee?.userName}}
        </el-descriptions-item>
        <el-descriptions-item label="Email">
          {{selectedEmployee?.userMail}}
        </el-descriptions-item>
        <el-descriptions-item label="Role">
          <span v-if="selectedEmployee?.userRole != undefined">{{ UserRole[selectedEmployee.userRole].value }}</span>
          <span v-else>{{ selectedEmployee?.userRole }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- search employee input -->
    <div v-if="currentStep == 1">
      <el-input
        v-model="userNameVal"
        placeholder="Input employee name to search"
        class="w-20 m-2"
        size="large"
        style="width: 50%;text-align: left;"
        :prefix-icon="Search"
      >
        <template #append>
          <el-button :icon="Search" @click="getUsersByName()"/>
        </template>
      </el-input>
    </div>

    <!-- step one section -->
    <div v-if="currentStep == 1" class="infinite-list-wrapper" style="overflow: auto">
      <div v-if="employeeList.length == 0" style="text-align: center;">
        No data.
      </div>
      <div>
        <el-row :gutter="12" v-for="emp in employeeList" :key="emp.id" @click="selectEmployee(emp)" style="padding-top: 5px;">
          <el-col>
            <el-card shadow="hover"
            :style="[emp.id == recognition.recognitionUserId ? 'background-color: lightblue' : '']"
            >
              <div style="display: flex;">
                <div>
                  <el-avatar :size="50" :src="emp.avatarUrl" @error="errorHandler" >
                    <img :src="emp.avatarUrl"/>
                  </el-avatar>
                </div>
                <div style="padding-left: 10px; text-align: left;">
                  <span>{{ emp.userName }}</span><br/>
                  <span>{{ emp.userMail }}</span><br/>
                  <span v-if="emp.userRole">{{ UserRole[emp.userRole].value }}</span><br/>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <p v-if="more" @click="getUsers('load more')" style="text-align: center;">Click to load more</p>
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
        placeholder="Please share the reason."
      />
    </div>
    <!-- finish section -->
    <div v-if="currentStep == 4" class="center">
      <el-icon size="100" color="green"><SuccessFilled /></el-icon>
      <div class="center">
        <span style="font-size: 20px;">Recognition has been created and sent to {{ selectedEmployee?.userName }}</span>
      </div>
    </div>
    <!-- dialog footer -->
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="currentStep < 4" :disabled="currentStep==1" @click="currentStep--">
          Previous
        </el-button>
        <el-button :disabled="!nextActive" type="primary" @click="next">
          {{ nextText }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { TabsPaneContext, ElMessage } from 'element-plus'
import { ref, computed, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import httpService from '@/services/http.service'
import ResponseData from '@/types/response.data'
import { Recognition, Activity } from '@/types/recognition'
import { RecognitionPoint, UserRole } from '@/utils/enum'
import { getUserFromLocalStorage } from '@/utils/util'
import { User } from '@/types/user'

// activity list
const activityList = ref<Activity[]>([])
// login user info
const loginUser = ref(getUserFromLocalStorage())
// recognized point show in home page
const homepagePoint = ref(0)
// active tab
const activeTab = ref('first')
// create recognition dialog show flag
let dialogActive = ref(false)
// current step in recognition creation
const currentStep = ref(1)
onMounted(() => initialize())
// user name for search in create recognition dialog
const userNameVal = ref('')
const searchName = ref('')
// selected employee in create recognition dialog
let selectedEmployee = ref<User>()
// employee list to create a recognition
let employeeList = ref<User[]>([])
// more employee data to load flag
const more = ref(true)
const errorHandler = () => true
// initialize recognition for creation
const recognition = ref<Recognition>({
  recognitionUserId: undefined,
  createUserId: getUserFromLocalStorage().id,
  point: undefined,
  detail: ''
})

/**
 * initialize home page
 */
const initialize = () => {
  // Get profile data and activity timeline
  const userId = loginUser.value.id
  httpService.getUserPoint(userId)
    .then((response: ResponseData) => {
      if (response.data.data.point) homepagePoint.value = response.data.data.point
      // activities
      getActivities()
    })
    .catch((e: Error) => {
      console.log(e)
      return
    })
}

/**
 * next button active flag in momal
 */
const nextActive = computed(() => (
  currentStep.value == 1 && recognition.value.recognitionUserId)
  || (currentStep.value == 2 && recognition.value.point)
  || (currentStep.value == 3 && recognition.value.detail)
  || currentStep.value == 4
)

/**
 * retrieve user's recognize activities
 */
const getActivities = () => {
  activityList.value = []
  httpService.getRecognitionActivies(loginUser.value.id, 0, 100)
    .then((response: ResponseData) => {
      for (const item of response.data.data) {
        activityList.value.push(item)
      }
    })
    .catch((e: Error) => {
      console.log(e)
      return
    })
}
/**
 * compute text value for button in dialog
 */
const nextText = computed(() => {
  if (currentStep.value < 3) return 'Next'
  else if (currentStep.value == 3) return 'Submit'
  else return 'Close'
})

/**
 * next, submit, close button click event on dialog
 */
const next = () => {
  if (currentStep.value < 3) currentStep.value++
  // submit
  else if (currentStep.value == 3) {
    httpService.recognize(recognition)
    .then((response: ResponseData) => {
      ElMessage({
        message: 'Recognize complete.',
        type: 'success',
      })
      currentStep.value++
    })
    .catch((e: Error) => {
      console.log(e)
      return
    })
  }
  else if (currentStep.value == 4) {
    resetAndClose()
    getActivities()
    return
  }
}

/**
 * clear dialog data
 */
const resetAndClose = () => {
  searchName.value = ''
  dialogActive.value = false
  currentStep.value = 1
  selectedEmployee.value = undefined
  recognition.value = {
    recognitionUserId: undefined,
    createUserId: undefined,
    point: undefined,
    detail: ''
  }
}

const getUsersByName = () => {
  searchName.value = userNameVal.value
  getUsers('init')
}
/**
 * retrieve 10 employees
 * @param type
 */
const getUsers = (type: string) => {
  if (type == 'init') {
    dialogActive.value = true
    employeeList.value = []
  }
  httpService.getUsers(loginUser.value.id, employeeList.value.length, 10, searchName.value)
    .then((response: ResponseData) => {
      for (const employee of response.data.data) {
        employeeList.value.push(employee)
      }
      const len = response.data.data.length
      if (len == 0 || len < 10) more.value = false
      else more.value = true
    })
    .catch((e: Error) => {
      console.log(e)
    })
}

/**
 * set selected employee data
 * @param employee
 */
const selectEmployee = (employee: any) => {
  recognition.value.recognitionUserId = employee.id
  selectedEmployee.value = employee
}

/**
 * change tab
 * @param tab
 * @param event
 */
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // Todo
  console.log(tab, event)
}

</script>
<style>
.infinite-list-wrapper {
  height: 300px;
}
.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.infinite-list-wrapper .list-item + .list-item {
  margin-top: 10px;
}
.center {
  text-align: center;
}
.my-tabs {
  width: 80%;
  margin: 0 auto;
}
.my-tabs > .el-tabs__content {
  padding: 20px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>../types/recognition../types/response.data