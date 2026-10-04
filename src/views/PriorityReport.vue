<template>
  <div class="page">
    <el-card shadow="never" class="welcome-card">
      <h2>重点事件录入</h2>
      <p class="hint">
        本页面仅「风险上报员（重点人群）」角色可见。录入表单及提交后风险保底逻辑
        （相关人员最终风险等级不低于中风险）将在业务模块任务中实现。
      </p>
    </el-card>
  </div>
</template>

<script setup></script>

<style scoped>
.page {
  max-width: 720px;
}
.welcome-card {
  border: 1px solid var(--color-line);
}
.hint {
  color: var(--color-ink-soft);
  font-size: 13px;
  line-height: 1.7;
}
</style>
