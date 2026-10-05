// 角色定义：与后端 UserRole 枚举一一对应（字符串枚举，不再使用数字）
// ANALYST    数据分析人员：县综治中心（风险分析研判单位）
// REPORTER   风险上报人员：其他职能部门、乡镇及基层治理单位
// KEY_PERSON 重点人群：特殊事件上报账号
// ADMIN      系统管理人员：不开放注册，由后台/种子数据创建
export const ROLES = {
  ANALYST: 'ANALYST',
  REPORTER: 'REPORTER',
  KEY_PERSON: 'KEY_PERSON',
  ADMIN: 'ADMIN',
}

export const ROLE_LABEL = {
  [ROLES.ANALYST]: '数据分析人员',
  [ROLES.REPORTER]: '风险上报人员',
  [ROLES.KEY_PERSON]: '重点人群',
  [ROLES.ADMIN]: '系统管理人员',
}

// 注册页的单位清单不再前端硬编码，统一由后端 GET /auth/units 提供（唯一来源）。

// 菜单权限映射表：骨架阶段先用占位菜单验证"角色不同、菜单渲染不同"这一机制，
// 后续业务模块（数据接入、风险档案、审核池、规则管理、统计分析等）开发时按角色逐步补充。
// 每一项对应一个路由 name，同时携带按钮级权限标识 perms，供 v-permission 指令使用。
export const MENU_MAP = {
  [ROLES.ANALYST]: [
    { path: '/home', name: 'Home', title: '首页', icon: 'HomeFilled' },
    { path: '/profile', name: 'Profile', title: '个人中心', icon: 'User' },
  ],
  // 普通上报单位的上报菜单待业务模块开发时补充，先用占位菜单
  [ROLES.REPORTER]: [
    { path: '/home', name: 'Home', title: '首页', icon: 'HomeFilled' },
    { path: '/profile', name: 'Profile', title: '个人中心', icon: 'User' },
  ],
  [ROLES.KEY_PERSON]: [
    { path: '/report', name: 'PriorityReport', title: '重点事件录入', icon: 'EditPen' },
    { path: '/profile', name: 'Profile', title: '个人中心', icon: 'User' },
  ],
  [ROLES.ADMIN]: [
    { path: '/home', name: 'Home', title: '首页', icon: 'HomeFilled' },
    { path: '/admin', name: 'AdminPanel', title: '系统管理', icon: 'Setting' },
    { path: '/profile', name: 'Profile', title: '个人中心', icon: 'User' },
  ],
}

// 按钮级权限标识映射
// rule:manage 同时给 ANALYST（县综治中心维护风险规则）和 ADMIN
export const BUTTON_PERM_MAP = {
  [ROLES.ANALYST]: ['rule:manage'],
  [ROLES.REPORTER]: [],
  [ROLES.KEY_PERSON]: [],
  [ROLES.ADMIN]: ['user:create', 'rule:manage'],
}

export function getMenusByRole(role) {
  return MENU_MAP[role] || []
}

export function getButtonPermsByRole(role) {
  return BUTTON_PERM_MAP[role] || []
}

// 登录成功后默认跳转的首页路由，按角色区分（重点人群只写不查，直接进录入页）
export function getDefaultRouteByRole(role) {
  if (role === ROLES.KEY_PERSON) return '/report'
  return '/home'
}