<template>
  <div class="auth-page">
    <div class="auth-brand">
      <svg class="brand-pattern" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
          <circle cx="250" cy="300" r="7" />
        </g>
      </svg>
      <div class="brand-copy">
        <p class="brand-eyebrow">社会治理数字化平台</p>
        <h1 class="brand-title">社会治理数据分析<br />与风险预警系统</h1>
        <p class="brand-desc">
          账号按角色划分权限：县综治中心、其他单位、重点人群三类角色，
          分别对应不同的数据边界与操作权限。
        </p>
      </div>
    </div>

    <div class="auth-panel">
      <div class="auth-card">
        <h2 class="auth-title">注册账号</h2>
        <p class="auth-subtitle">请选择与本单位对应的角色</p>

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
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item prop="role">
            <el-select v-model="form.role" placeholder="请选择角色" size="large" class="auth-select">
              <el-option
                v-for="opt in ROLE_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="auth-submit"
              :loading="loading"
              @click="handleSubmit"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <p class="auth-switch">
          已有账号？
          <router-link to="/login">返回登录</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { register } from '../api/auth'
import { ROLE_OPTIONS } from '../utils/role'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  role: null,
})

function validateConfirm(rule, value, callback) {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await register({
      username: form.username,
      password: form.password,
      role: form.role,
    })
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (err) {
    // 失败已由响应拦截器统一 toast 提示
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

.auth-select {
  width: 100%;
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
