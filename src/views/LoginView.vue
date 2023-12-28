<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { user } from '@/types/user'
import UserService from '@/api/user'

const loginFormRef = ref<FormInstance>()
const isSubmit = ref(false)
const isSend = ref(false)
const sendText = ref<string | number>('发送')
const tagFlag = ref(false)
const loginForm = reactive<user>({
  username: '',
  password: '',
  phone: '',
  code: '',
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { validator: validateUsername, trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { validator: validatePassword, trigger: 'change' },
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { max: 6, min: 6, message: '验证码格式不正确', trigger: 'blur' },
  ],
})

const router = useRouter()

function validateUsername(rule: object, value: string, callback: any) {
  if (!/^\w{3,16}$/.test(value))
    callback(new Error('仅允许使用字母数字和下划线，长度在3-16个字符之间'))
  else
    callback()

  isSubmit.value = loginForm.username.length > 0 && loginForm.password.length > 0
}
function validatePassword(rule: object, value: string, callback: any) {
  if (!/^[\w_.]{6,18}$/.test(value))
    callback(new Error('仅允许使用字母、数字和下划线小数点，长度在6-18个字符之间'))
  else
    callback()

  isSubmit.value = loginForm.username.length > 0 && loginForm.password.length > 0
}

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate((valid) => {
    if (valid) {
      UserService.login(loginForm).then(
        (res) => {
          localStorage.setItem('token', res.data.token)
          // UserService.getUserinfo().then((res: any) => {
          //   localStorage.setItem('routerList', JSON.stringify(res.data.permissions))
          //   localStorage.setItem('userInfo', JSON.stringify(res.data))
          ElMessage.success('登录成功')
          router.push('/')
          // })
        },
        (err) => {
          ElMessage.error(err.data.message)
        },
      )
    }
    else { ElMessage.error('用户名或密码不符合要求') }
  })
}

async function shortSend() {
  if (/^1[3456789]\d{9}$/.test(loginForm.phone)) {
    UserService.getCode(loginForm.phone).then((res) => {
      ElMessage.success('发送成功')
      let num = 60
      isSend.value = true
      const timer = setInterval(() => {
        sendText.value = num.toString().padStart(2, '0')
        num--
        if (num <= 0) {
          clearInterval(timer)
          sendText.value = '发送'
          isSend.value = false
        }
      }, 1000)
    })
  }
  else {
    ElMessage.error('手机号不符合要求')
  }
}

function isSubmitChange() {
  if (/^1[3456789]\d{9}$/.test(loginForm.phone) && loginForm.code.length === 6)
    isSubmit.value = true
}

function phoneSubmitForm() {
  if (isSubmit.value) {
    UserService.login(loginForm).then(
      (res) => {
        localStorage.setItem('token', res.data.token)
        ElMessage.success('登录成功')
        router.push('/')
      },
      (err) => {
        ElMessage.error(err.data.message)
      },
    )
  }
}

function closeForm() {
  tagFlag.value = isSubmit.value = false
  loginForm.username = loginForm.password = ''
}
</script>

<template>
  <div class="main">
    <div class="bg">
      <img src="@/assets/loginBackground.png" alt="">
      <div class="bgContent">
        <p class="title">
          xxxx后台系统
        </p>
        <p class="subTitle">
          智能分析系统
        </p>
      </div>
    </div>
    <div class="loginBox">
      <div class="loginCont">
        <img class="loginLogo" src="@/assets/loginLogo.png" alt="">
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="auto">
          <div class="head">
            登录
          </div>
          <div class="tab">
            <p :class="tagFlag ? 'active' : ''" @click="tagFlag = true">
              用户名登录
            </p>
            <p :class="!tagFlag ? 'active' : ''" @click="closeForm">
              手机号登录
            </p>
          </div>
          <template v-if="tagFlag">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item style="margin-top: 10px;" prop="password">
              <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码" />
            </el-form-item>
            <el-button :type="isSubmit ? 'success' : 'info'" :disabled="!isSubmit" @click="submitForm(loginFormRef)">
              登录
            </el-button>
          </template>
          <template v-else>
            <el-form-item prop="phone">
              <el-input v-model="loginForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item style="margin-top: 10px;" prop="code">
              <el-input v-model="loginForm.code" placeholder="请输入验证码" @input="isSubmitChange" />
              <el-button type="primary" round :disabled="isSend" @click="shortSend">
                {{ sendText }}
              </el-button>
            </el-form-item>
            <el-button :type="isSubmit ? 'success' : 'info'" :disabled="!isSubmit" @click="phoneSubmitForm">
              登录
            </el-button>
          </template>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item) {
  flex-direction: column;

  .el-form-item__label-wrap {
    margin: 0 !important;
  }
}

.main {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  position: relative;
  display: flex;
  justify-content: center;

  .bg {
    height: 100vh;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .bgContent {
      position: absolute;
      left: 10%;
      top: 20%;

      .title {
        color: #3B4960;
        font-size: 40px;
        font-weight: 700;
      }

      .subTitle {
        color: #00B44D;
        font-size: 64px;
        font-weight: 700;
        margin-bottom: 10px;
      }

      .text {
        font-size: 16px;
        color: rgba(59, 73, 96, 0.3);
        text-transform: uppercase;
      }
    }
  }

  .loginBox {
    flex: 1;
    min-width: 450px;
    height: 100vh;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;

    .loginCont {
      width: 364px;
    }

    .loginLogo {
      margin-bottom: 82px;
    }

    .head {
      color: #3B4960;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 32px;
    }

    .tab {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      >p {
        color: #3B4960;
        font-size: 16px;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        margin-right: 40px;
        padding-bottom: 2px;
        cursor: pointer;

        &.active {
          color: #00B44D;
          border-bottom-color: #00B44D;
        }
      }
    }

    :deep(.el-form) {
      .el-form-item__label-wrap {
        display: none;
      }

      .el-form-item__content {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        input {
          height: 40px;
        }
        .el-button {
          width: auto;
          margin: 0;
          margin-left: 20px;
        }
      }

      .el-button {
        width: 100%;
        margin-top: 20px;
        border: none;
      }
    }
  }
}
</style>
