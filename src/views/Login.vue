<template>
  <div class="submit-form">
    <el-input
      v-model="loginInfo.loginId"
      placeholder="Please input login id"
      class="w-50 m-2"
      size="large"
      style="padding-top: 3%;"
    />

    <el-input
      v-model="loginInfo.password"
      type="password"
      placeholder="Please input password"
      class="w-50 m-2"
      size="large"
      show-password
      style="padding-top: 5%;padding-bottom: 5%;"
    />
    <div style="text-align: center;">
      <el-button type="primary" @click="login">Sign In</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import httpService from '@/services/http.service'
import { User } from '@/types/user'
import ResponseData from '@/types/response.data'
import router from '@/router'

const loginInfo = ref<User>({
  loginId: 'test@liferay.com',
  password: '123456'
})

const login = () => {
  if (!loginInfo.value.loginId) {
    ElMessage.error('Loginid can not be empty.')
    return
  }
  if (!loginInfo.value.password) {
    ElMessage.error('Password can not be empty.')
    return
  }

  httpService.login(loginInfo)
    .then((response: ResponseData) => {
      window.localStorage.setItem('user_token', response.data.data.token)
      window.localStorage.setItem('user_info', JSON.stringify(response.data.data.user))
      router.push('/dashboard')
    })
    .catch((e: Error) => {
      console.log(e);
    })
}
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>
