import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true, title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { public: true, title: '注册' },
  },
  {
    path: '/',
    component: () => import('../layout/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页', roles: ['ADMIN', 'ANALYST', 'REPORTER','KEY_PERSON'] },
      },
      {
        path: 'report',
        name: 'PriorityReport',
        component: () => import('../views/PriorityReport.vue'),
        meta: { title: '重点事件录入', roles: ['KEY_PERSON'] },
      },
      {
        path: 'admin',
        name: 'AdminPanel',
        component: () => import('../views/AdminPanel.vue'),
        meta: { title: '系统管理', roles: ['ADMIN'] },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { title: '个人中心', roles: ['ADMIN', 'ANALYST', 'REPORTER','KEY_PERSON']},
      },
    ],
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../views/Forbidden.vue'),
    meta: { public: true, title: '无权限' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { public: true, title: '页面不存在' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  document.title = to.meta.title ? `${to.meta.title} - 社会治理风险预警系统` : '社会治理风险预警系统'

  // 公开页面（登录/注册/403/404）直接放行
  if (to.meta.public) {
    return
  }

  // 未登录访问需鉴权页面 -> 跳转登录页，并记录来源用于登录后跳回
  if (!userStore.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 已登录但当前角色不在该路由允许的角色列表内 -> 提示无权限，跳 403 页
  const allowedRoles = to.meta.roles
  if (allowedRoles && !allowedRoles.includes(userStore.role)) {
    ElMessage.error('无权限访问该页面')
    return { path: '/403' }
  }

  return
})

export default router
