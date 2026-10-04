<template>
  <div class="page">
    <el-card shadow="never" class="welcome-card">
      <h2>系统管理</h2>
      <p class="hint">
        本页面仅「系统管理员（县综治中心）」角色可见。风险规则配置、审核池、跨部门统计
        等功能将在业务模块任务中接入。
      </p>
      <el-button v-permission="'user:create'" type="primary" plain>新增账号</el-button>
      <el-button v-permission="'rule:manage'" plain>风险规则管理</el-button>
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
  margin-bottom: 16px;
}
</style>
