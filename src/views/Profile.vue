<template>
  <div class="page">
    <el-card shadow="never" class="welcome-card">
      <h2>个人中心</h2>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ userStore.username }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ roleLabel }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { ROLE_LABEL } from '../utils/role'

const userStore = useUserStore()
const roleLabel = computed(() => ROLE_LABEL[userStore.role] || '')
</script>

<style scoped>
.page {
  max-width: 480px;
}
.welcome-card {
  border: 1px solid var(--color-line);
}
</style>
