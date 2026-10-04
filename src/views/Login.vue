<template>
  <div class="auth-page">
    <div class="auth-brand">
      <svg class="brand-pattern" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="dot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3c6ea5" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#3c6ea5" stop-opacity="0" />
          </radialGradient>
        </defs>
        <g stroke="#2c4c74" stroke-width="1" opacity="0.55">
          <line x1="40" y1="60" x2="160" y2="120" />
          <line x1="160" y1="120" x2="120" y2="240" />
          <line x1="160" y1="120" x2="300" y2="90" />
          <line x1="300" y1="90" x2="340" y2="220" />
          <line x1="120" y1="240" x2="60" y2="330" />
          <line x1="120" y1="240" x2="250" y2="300" />
          <line x1="300" y1="90" x2="250" y2="300" />
          <line x1="250" y1="300" x2="340" y2="220" />
        </g>
        <g fill="#5c86b8">
          <circle cx="40" cy="60" r="4" />
          <circle cx="160" cy="120" r="6" />
          <circle cx="120" cy="240" r="5" />
          <circle cx="300" cy="90" r="5" />
          <circle cx="340" cy="220" r="4" />
          <circle cx="60" cy="330" r="4" />
          <circle cx="250" cy="300" r="7" fill="url(#dot)" />
        </g>
      </svg>
      <div class="brand-copy">
        <p class="brand-eyebrow">社会治理数字化平台</p>
        <h1 class="brand-title">社会治理数据分析<br />与风险预警系统</h1>
        <p class="brand-desc">
          统一接入多来源事件数据，识别重复与关联，
          按可解释规则计算风险等级，支撑跨部门协同处置。
        </p>
      </div>
    </div>

    <div class="auth-panel">
      <div class="auth-card">
        <h2 class="auth-title">账号登录</h2>
        <p class="auth-subtitle">请使用分配的账号登录系统</p>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="auth-form"
          @keyup.enter="handleSubmit"
        >
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名" size="large" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="auth-submit"
              :loading="loading"
              @click="handleSubmit"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <p class="auth-switch">
          还没有账号？
          <router-link to="/register">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { login, getUserInfo } from '../api/auth'
import { useUserStore } from '../stores/user'
import { getDefaultRouteByRole } from '../utils/role'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    // 登录失败（用户名或密码错误）时后端返回 success:false，
    // 已由 axios 响应拦截器统一 toast 提示，这里 catch 后直接停止即可。
    const loginRes = await login({ username: form.username, password: form.password })
    userStore.setToken(loginRes.data)

    const infoRes = await getUserInfo()
    userStore.setUserInfo(infoRes.data)

    ElMessage.success('登录成功')
    const redirect = route.query.redirect || getDefaultRouteByRole(userStore.role)
    router.push(redirect)
  } catch (err) {
    // 登录/取用户信息失败：清理可能残留的半成品登录态，留在登录页
    userStore.clearUser()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
}

.auth-brand {
  position: relative;
  flex: 1.1;
  min-width: 0;
  background: linear-gradient(160deg, var(--color-brand-strong) 0%, var(--color-brand) 65%, #234876 100%);
  display: flex;
  align-items: center;
  padding: 0 64px;
  overflow: hidden;
}

.brand-pattern {
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  width: 480px;
  height: 480px;
  opacity: 0.9;
}

.brand-copy {
  position: relative;
  z-index: 1;
  max-width: 480px;
  color: #eef2f8;
}

.brand-eyebrow {
  font-size: 14px;
  letter-spacing: 0.08em;
  color: #9db6d8;
  margin: 0 0 18px;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 34px;
  line-height: 1.45;
  font-weight: 600;
  margin: 0 0 24px;
  color: #ffffff;
}

.brand-desc {
  font-size: 14px;
  line-height: 1.9;
  color: #c3d2e6;
  max-width: 380px;
}

.auth-panel {
  flex: 0.9;
  min-width: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.auth-card {
  width: 340px;
}

.auth-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 6px;
}

.auth-subtitle {
  font-size: 13px;
  color: var(--color-ink-soft);
  margin: 0 0 32px;
}

.auth-form {
  margin-bottom: 8px;
}

.auth-submit {
  width: 100%;
  background: var(--color-brand);
  border-color: var(--color-brand);
}

.auth-submit:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.auth-switch {
  font-size: 13px;
  color: var(--color-ink-soft);
  text-align: center;
}

.auth-switch a {
  color: var(--color-brand);
  font-weight: 500;
  text-decoration: none;
}

.auth-switch a:hover {
  text-decoration: underline;
}

@media (max-width: 860px) {
  .auth-brand {
    display: none;
  }
  .auth-panel {
    flex: 1;
  }
}
</style>
