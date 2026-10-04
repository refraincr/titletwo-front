// 角色定义：后端数字角色 <-> 实施方案文档中的角色名称
// 1 数据分析员 -> 文档「其他单位」  2 风险上报员 -> 文档「重点人群」  3 系统管理员 -> 文档「县综治中心」
export const ROLES = {
  ANALYST: 1, // 数据分析员（其他单位）
  REPORTER: 2, // 风险上报员（重点人群）
  ADMIN: 3, // 系统管理员（县综治中心）
}

export const ROLE_LABEL = {
  [ROLES.ANALYST]: '数据分析员',
  [ROLES.REPORTER]: '风险上报员',
  [ROLES.ADMIN]: '系统管理员',
}

export const ROLE_OPTIONS = [
  { value: ROLES.ANALYST, label: '数据分析员（其他单位）' },
  { value: ROLES.REPORTER, label: '风险上报员（重点人群）' },
  { value: ROLES.ADMIN, label: '系统管理员（县综治中心）' },
]

// 菜单权限映射表：骨架阶段先用占位菜单验证"角色不同、菜单渲染不同"这一机制，
// 后续业务模块（数据接入、风险档案、审核池、规则管理、统计分析等）开发时按角色逐步补充。
// 每一项对应一个路由 name，同时携带按钮级权限标识 perms，供 v-permission 指令使用。
export const MENU_MAP = {
  [ROLES.ANALYST]: [
    { path: '/home', name: 'Home', title: '首页', icon: 'HomeFilled' },
    { path: '/profile', name: 'Profile', title: '个人中心', icon: 'User' },
  ],
  [ROLES.REPORTER]: [
    { path: '/report', name: 'PriorityReport', title: '重点事件录入', icon: 'EditPen' },
    { path: '/profile', name: 'Profile', title: '个人中心', icon: 'User' },
  ],
  [ROLES.ADMIN]: [
    { path: '/home', name: 'Home', title: '首页', icon: 'HomeFilled' },
    { path: '/admin', name: 'AdminPanel', title: '系统管理', icon: 'Setting' },
    { path: '/profile', name: 'Profile', title: '个人中心', icon: 'User' },
  ],
}

// 按钮级权限标识映射（骨架阶段示例：仅系统管理员可见"新增账号"等管理类按钮）
export const BUTTON_PERM_MAP = {
  [ROLES.ANALYST]: [],
  [ROLES.REPORTER]: [],
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
  if (role === ROLES.REPORTER) return '/report'
  return '/home'
}
