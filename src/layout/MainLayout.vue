<template>
  <el-container class="layout">
    <el-aside width="220px" class="layout-aside">
      <div class="aside-logo">
        <span class="logo-mark">治</span>
        <span class="logo-text">风险预警系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="aside-menu"
        background-color="transparent"
        text-color="#c3d2e6"
        active-text-color="#ffffff"
        router
      >
        <el-menu-item v-for="item in userStore.menus" :key="item.path" :index="item.path">
          <el-icon><component :is="icons[item.icon]" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <span class="header-title">{{ currentTitle }}</span>
        <div class="header-user">
          <el-tag size="small" effect="plain" class="role-tag">{{ roleLabel }}</el-tag>
          <span class="username">{{ userStore.username }}</span>
          <el-button link type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { HomeFilled, User, Setting, EditPen } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'
import { ROLE_LABEL } from '../utils/role'

const icons = { HomeFilled, User, Setting, EditPen }

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta.title || '')
const roleLabel = computed(() => ROLE_LABEL[userStore.role] || '')

async function handleLogout() {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => Promise.reject())

  // 纯前端退出：清除本地 token 与用户信息，跳转登录页
  userStore.clearUser()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  height: 100vh;
}

.layout-aside {
  background: linear-gradient(180deg, var(--color-brand-strong) 0%, var(--color-brand) 100%);
  display: flex;
  flex-direction: column;
}

.aside-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  height: 56px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-mark {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: #fff;
  font-family: var(--font-display);
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  color: #eef2f8;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.aside-menu {
  border-right: none;
  flex: 1;
}

.layout-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-ink);
}

.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-tag {
  border-color: var(--color-brand);
  color: var(--color-brand);
}

.username {
  font-size: 13px;
  color: var(--color-ink-soft);
}

.layout-main {
  background: var(--color-bg);
  padding: 24px;
}
</style>
