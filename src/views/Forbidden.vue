<template>
  <div class="result-page">
    <el-result icon="warning" title="403" sub-title="无权限访问该页面">
      <template #extra>
        <el-button type="primary" @click="goBack">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { getDefaultRouteByRole } from '../utils/role'

const router = useRouter()
const userStore = useUserStore()

function goBack() {
  router.push(getDefaultRouteByRole(userStore.role))
}
</script>

<style scoped>
.result-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}
</style>
